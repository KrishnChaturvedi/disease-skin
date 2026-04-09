# ================================
# DermNet Dataset Paths
# ================================

import os
import torch
import numpy as np
import pandas as pd
from PIL import Image
from torchvision import transforms
from torch.utils.data import Dataset, DataLoader
from sklearn.utils.class_weight import compute_class_weight
from collections import Counter
import matplotlib.pyplot as plt

import kagglehub

path = kagglehub.dataset_download("shubhamgoel27/dermnet")
print("Path to dataset files:", path)
BASE_DIR = path

PATHS = {
    "train": os.path.join(BASE_DIR, "train"),
    "test": os.path.join(BASE_DIR, "test"),
    "output": "/kaggle/working"
}

os.makedirs(PATHS["output"], exist_ok=True)

def load_dataset():

    train_dir = PATHS["train"]
    test_dir = PATHS["test"]

    classes = sorted(os.listdir(train_dir))

    label_map = {cls: i for i, cls in enumerate(classes)}

    data = []

    for split in ["train", "test"]:

        split_dir = PATHS[split]

        for cls in classes:

            class_dir = os.path.join(split_dir, cls)

            if not os.path.isdir(class_dir):
                continue

            for img in os.listdir(class_dir):

                data.append({
                    "image_path": os.path.join(class_dir, img),
                    "label": label_map[cls],
                    "split": split
                })

    df = pd.DataFrame(data)

    train_df = df[df["split"] == "train"].reset_index(drop=True)
    test_df = df[df["split"] == "test"].reset_index(drop=True)

    print(f"[INFO] Train Samples: {len(train_df)}")
    print(f"[INFO] Test Samples: {len(test_df)}")
    print(f"[INFO] Classes: {len(classes)}")

    return train_df, test_df, classes

class DermNetDataset(Dataset):

    def __init__(self, df, transform=None):

        self.df = df
        self.transform = transform

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):

        row = self.df.iloc[idx]

        image = Image.open(row["image_path"]).convert("RGB")

        if self.transform:
            image = self.transform(image)

        label = torch.tensor(row["label"], dtype=torch.long)

        return image, label

IMAGE_SIZE = 224

def get_transforms(phase):

    if phase == "train":
        # STRONG augmentations for better generalization
        return transforms.Compose([
            transforms.Resize((256, 256)),
            transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
            transforms.RandomHorizontalFlip(p=0.5),
            transforms.RandomVerticalFlip(p=0.3),
            transforms.RandomRotation(25),
            transforms.ColorJitter(
                brightness=0.3, 
                contrast=0.3, 
                saturation=0.3, 
                hue=0.1
            ),
            transforms.RandomAffine(
                degrees=0, 
                translate=(0.1, 0.1), 
                scale=(0.9, 1.1)
            ),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            ),
            transforms.RandomErasing(p=0.25, scale=(0.02, 0.15))
        ])

    else:
        # Minimal augmentation for validation/test
        return transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])

def build_dataloaders(batch_size=16, num_workers=0):

    train_df, test_df, classes = load_dataset()

    train_dataset = DermNetDataset(
        train_df,
        transform=get_transforms("train")
    )

    test_dataset = DermNetDataset(
        test_df,
        transform=get_transforms("test")
    )

    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=num_workers,
        pin_memory=True  # Faster data transfer to GPU
    )

    test_loader = DataLoader(
        test_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
        pin_memory=True
    )

    return train_loader, test_loader, classes

if __name__ == "__main__":

    print("Loading DermNet dataset...")

    # Load dataset
    train_df, test_df, classes = load_dataset()

    print("\nDataset Info")
    print("---------------------------")
    print(f"Classes: {len(classes)}")
    print(f"Train samples: {len(train_df)}")
    print(f"Test samples: {len(test_df)}")

    print("\nClass Names:")
    for i, cls in enumerate(classes):
        print(f"{i} -> {cls}")

    # Build dataloaders
    train_loader, test_loader, classes = build_dataloaders(
        batch_size=16,
        num_workers=0
    )

    print("\n[INFO] DataLoaders Ready")
    print(f"Train batches: {len(train_loader)}")
    print(f"Test batches: {len(test_loader)}")

    images, labels = next(iter(train_loader))

    print("\n[CHECK]")
    print("Images shape:", images.shape)
    print("Labels shape:", labels.shape)

    print("\nPixel Range:")
    print(f"Min: {images.min():.3f}, Max: {images.max():.3f}")

    print("\nClass Distribution (Train):")
    print(train_df["label"].value_counts().sort_index())

    print("\nPreprocessing Complete — Ready for Training")