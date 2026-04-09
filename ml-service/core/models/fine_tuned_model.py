import torch
import torch.nn as nn
import timm


def init_fine_tuned_model(
    model_name="mobilenetv3_large_100",
    model_path="best_dermnet_model.pth",
    num_classes=23,
    device=None
):
    if device is None:
        device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )
    model = timm.create_model(
        model_name,
        pretrained=False,
        num_classes=num_classes
    )
    model.classifier = nn.Sequential(
        nn.Dropout(0.4),
        nn.Linear(model.classifier.in_features, num_classes)
    )
    model.load_state_dict(
        torch.load(model_path, map_location=device)
    )

    model = model.to(device)
    model.eval()

    return model