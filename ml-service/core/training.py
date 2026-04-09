import torch
import torch.nn as nn
import torch.optim as optim
import timm
from tqdm import tqdm
from torch.optim.lr_scheduler import CosineAnnealingWarmRestarts, ReduceLROnPlateau

from dataset import build_dataloaders

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

BATCH_SIZE = 20
print("Loading dataset...")

train_loader, test_loader, classes = build_dataloaders(
    batch_size=BATCH_SIZE,
    num_workers=0
)

NUM_CLASSES = len(classes)
print(f"Number of classes: {NUM_CLASSES}")

# MobileNetV3 - efficient for GTX 1650
print("Loading MobileNetV3 model...")
model = timm.create_model(
    "mobilenetv3_large_100",
    pretrained=True,
    num_classes=NUM_CLASSES,
    drop_rate=0.3
)

model = model.to(device)

def get_class_weights(loader, num_classes):
    class_counts = torch.zeros(num_classes)
    print("Calculating class distribution...")
    for _, labels in tqdm(loader, desc="Analyzing classes"):
        for label in labels:
            class_counts[label] += 1
    
    # Inverse frequency weighting
    class_weights = 1.0 / (class_counts + 1e-6)
    class_weights = class_weights / class_weights.sum() * num_classes
    
    print("\nClass distribution:")
    for i, count in enumerate(class_counts):
        print(f"  Class {i}: {int(count)} samples (weight: {class_weights[i]:.3f})")
    
    return class_weights.to(device)

class_weights = get_class_weights(train_loader, NUM_CLASSES)
criterion = nn.CrossEntropyLoss(weight=class_weights, label_smoothing=0.1)

# Gradient accumulation
ACCUMULATION_STEPS = 2  # Effective batch = 20*2 = 40

def train_epoch(model, loader, optimizer, mixup_alpha=0.2):
    model.train()
    running_loss = 0
    correct = 0
    total = 0
    
    optimizer.zero_grad()
    
    for batch_idx, (images, labels) in enumerate(tqdm(loader, desc="Training")):
        images = images.to(device)
        labels = labels.to(device)
        
        # Mixup augmentation
        if mixup_alpha > 0:
            lam = torch.distributions.Beta(mixup_alpha, mixup_alpha).sample().item()
            index = torch.randperm(images.size(0)).to(device)
            mixed_images = lam * images + (1 - lam) * images[index]
            labels_a, labels_b = labels, labels[index]
        else:
            mixed_images = images
            labels_a = labels
        
        outputs = model(mixed_images)
        
        if mixup_alpha > 0:
            loss = lam * criterion(outputs, labels_a) + (1 - lam) * criterion(outputs, labels_b)
        else:
            loss = criterion(outputs, labels_a)
        
        # Gradient accumulation
        loss = loss / ACCUMULATION_STEPS
        loss.backward()
        
        if (batch_idx + 1) % ACCUMULATION_STEPS == 0:
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()
            optimizer.zero_grad()
        
        running_loss += loss.item() * ACCUMULATION_STEPS
        
        _, predicted = outputs.max(1)
        total += labels.size(0)
        correct += predicted.eq(labels_a).sum().item()
    
    if len(loader) % ACCUMULATION_STEPS != 0:
        optimizer.step()
        optimizer.zero_grad()
    
    acc = 100 * correct / total
    return running_loss / len(loader), acc


def validate(model, loader):
    model.eval()
    running_loss = 0
    correct = 0
    total = 0
    
    with torch.no_grad():
        for images, labels in tqdm(loader, desc="Validation"):
            images = images.to(device)
            labels = labels.to(device)
            
            # Test Time Augmentation - horizontal flip
            outputs = model(images)
            outputs_flip = model(torch.flip(images, dims=[3]))
            outputs = (outputs + outputs_flip) / 2
            
            loss = criterion(outputs, labels)
            running_loss += loss.item()
            
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()
    
    acc = 100 * correct / total
    return running_loss / len(loader), acc

print("\n" + "="*60)
print("STAGE 1: Warmup - Training classifier only")
print("="*60)

for param in model.parameters():
    param.requires_grad = False

for param in model.classifier.parameters():
    param.requires_grad = True

optimizer = optim.AdamW(
    filter(lambda p: p.requires_grad, model.parameters()),
    lr=1e-3,
    weight_decay=0.01
)

scheduler = CosineAnnealingWarmRestarts(optimizer, T_0=3, T_mult=2)

WARMUP_EPOCHS = 3
best_acc = 0

for epoch in range(WARMUP_EPOCHS):
    train_loss, train_acc = train_epoch(model, train_loader, optimizer, mixup_alpha=0)
    val_loss, val_acc = validate(model, test_loader)
    scheduler.step()
    
    print(f"\nEpoch [{epoch+1}/{WARMUP_EPOCHS}]")
    print(f"Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.2f}%")
    print(f"Val Loss: {val_loss:.4f} | Val Acc: {val_acc:.2f}%")
    print(f"LR: {optimizer.param_groups[0]['lr']:.6f}")
    
    if val_acc > best_acc:
        best_acc = val_acc
        torch.save(model.state_dict(), "best_dermnet_model.pth")
        print("✓ Best model saved!")

torch.cuda.empty_cache()

print("\n" + "="*60)
print("STAGE 2: Unfreezing last layers")
print("="*60)

for name, param in model.named_parameters():
    if any(layer in name for layer in ['blocks.14', 'blocks.15', 'blocks.16', 'conv_head', 'classifier']):
        param.requires_grad = True
    else:
        param.requires_grad = False

trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
print(f"Trainable parameters: {trainable_params:,}")

optimizer = optim.AdamW(
    filter(lambda p: p.requires_grad, model.parameters()),
    lr=5e-4,
    weight_decay=0.01
)

scheduler = ReduceLROnPlateau(optimizer, mode='max', factor=0.5, patience=3, verbose=True)

STAGE2_EPOCHS = 12

for epoch in range(STAGE2_EPOCHS):
    train_loss, train_acc = train_epoch(model, train_loader, optimizer, mixup_alpha=0.2)
    val_loss, val_acc = validate(model, test_loader)
    scheduler.step(val_acc)
    
    print(f"\nEpoch [{epoch+1}/{STAGE2_EPOCHS}]")
    print(f"Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.2f}%")
    print(f"Val Loss: {val_loss:.4f} | Val Acc: {val_acc:.2f}%")
    print(f"LR: {optimizer.param_groups[0]['lr']:.6f}")
    
    if val_acc > best_acc:
        best_acc = val_acc
        torch.save(model.state_dict(), "best_dermnet_model.pth")
        print("✓ Best model saved!")

torch.cuda.empty_cache()

print("\n" + "="*60)
print("STAGE 3: Fine-tuning entire model")
print("="*60)

for param in model.parameters():
    param.requires_grad = True

optimizer = optim.AdamW(
    model.parameters(),
    lr=1e-5,
    weight_decay=0.01
)

scheduler = ReduceLROnPlateau(optimizer, mode='max', factor=0.5, patience=2, verbose=True)

FINETUNE_EPOCHS = 10
patience_counter = 0
max_patience = 5

for epoch in range(FINETUNE_EPOCHS):
    train_loss, train_acc = train_epoch(model, train_loader, optimizer, mixup_alpha=0.1)
    val_loss, val_acc = validate(model, test_loader)
    
    old_lr = optimizer.param_groups[0]['lr']
    scheduler.step(val_acc)
    
    print(f"\nEpoch [{epoch+1}/{FINETUNE_EPOCHS}]")
    print(f"Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.2f}%")
    print(f"Val Loss: {val_loss:.4f} | Val Acc: {val_acc:.2f}%")
    print(f"LR: {optimizer.param_groups[0]['lr']:.6f}")
    
    if val_acc > best_acc:
        best_acc = val_acc
        patience_counter = 0
        torch.save(model.state_dict(), "best_dermnet_model.pth")
        print("✓ Best model saved!")
    else:
        patience_counter += 1
    
    if patience_counter >= max_patience:
        print(f"No improvement for {max_patience} epochs, stopping...")
        break
    
    if optimizer.param_groups[0]['lr'] < 1e-7:
        print("Learning rate too small, stopping...")
        break

print("\n" + "="*60)
print("TRAINING COMPLETE")
print("="*60)
print(f"Best Validation Accuracy: {best_acc:.2f}%")

torch.cuda.empty_cache()