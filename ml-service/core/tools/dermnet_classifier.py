import torch
import torch.nn as nn
import timm
from PIL import Image
from torchvision import transforms
from langchain.tools import BaseTool
from typing import Optional, Type
from pydantic import BaseModel, Field
import base64
from io import BytesIO


class DermNetClassifierInput(BaseModel):
    """Input schema for DermNet classifier."""
    image_path: str = Field(description="Path to the skin condition image to classify")


class DermNetClassifierTool(BaseTool):
    """Tool for classifying skin conditions using the trained DermNet model."""
    
    name: str = "skin_condition_classifier"
    description: str = """
    Use this tool to classify skin conditions from dermoscopic or clinical images.
    Input should be a file path to an image.
    Returns the predicted skin condition with confidence scores for top 3 predictions.
    """
    args_schema: Type[BaseModel] = DermNetClassifierInput
    
    model_name: str = "mobilenetv3_large_100"
    model_path: str = "best_dermnet_model.pth"
    device: torch.device = None
    model: nn.Module = None
    
    class_names: list = [
        "Acne and Rosacea",
        "Actinic Keratosis",
        "Atopic Dermatitis",
        "Bullous Disease",
        "Cellulitis",
        "Eczema",
        "Exanthems and Drug Eruptions",
        "Hair Loss",
        "Herpes HPV",
        "Light Diseases",
        "Lupus",
        "Melanoma",
        "Nail Fungus",
        "Poison Ivy",
        "Psoriasis",
        "Scabies Lyme Disease",
        "Seborrheic Keratoses",
        "Systemic Disease",
        "Tinea Ringworm",
        "Urticaria Hives",
        "Vascular Tumors",
        "Vasculitis",
        "Warts Molluscum"
    ]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if self.device is None:
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self._load_model()
    
    def _load_model(self):
        """Load the trained model."""
        num_classes = len(self.class_names)
        
        self.model = timm.create_model(
            self.model_name,
            pretrained=False,
            num_classes=num_classes,
            drop_rate=0.3
        )
        
        # Load trained weights
        state_dict = torch.load(self.model_path, map_location=self.device)
        self.model.load_state_dict(state_dict)
        
        self.model = self.model.to(self.device)
        self.model.eval()
        
        print(f"✓ Model loaded from {self.model_path}")
    
    def _preprocess_image(self, image_path: str) -> torch.Tensor:
        """Preprocess image for model input."""
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
        
        image = Image.open(image_path).convert("RGB")
        image_tensor = transform(image).unsqueeze(0)
        
        return image_tensor.to(self.device)
    
    def _run(self, image_path: str) -> str:
        """Run the classifier on an image."""
        try:
            # Preprocess image
            image_tensor = self._preprocess_image(image_path)
            
            # Get predictions with TTA (Test Time Augmentation)
            with torch.no_grad():
                outputs = self.model(image_tensor)
                outputs_flip = self.model(torch.flip(image_tensor, dims=[3]))
                outputs = (outputs + outputs_flip) / 2
                
                probabilities = torch.nn.functional.softmax(outputs, dim=1)
            
            # Get top 3 predictions
            top_probs, top_indices = torch.topk(probabilities, k=3, dim=1)
            
            result = "🔬 Skin Condition Classification Results:\n\n"
            
            for i, (prob, idx) in enumerate(zip(top_probs[0], top_indices[0])):
                confidence = prob.item() * 100
                condition = self.class_names[idx.item()]
                
                if i == 0:
                    result += f"🎯 PRIMARY DIAGNOSIS:\n"
                    result += f"   {condition}\n"
                    result += f"   Confidence: {confidence:.2f}%\n\n"
                else:
                    result += f"📋 Differential Diagnosis #{i}:\n"
                    result += f"   {condition}\n"
                    result += f"   Confidence: {confidence:.2f}%\n\n"
            
            # Add warning
            result += "\n⚠️  DISCLAIMER: This is an AI prediction tool for educational purposes only. "
            result += "Always consult a licensed dermatologist for proper diagnosis and treatment.\n"
            
            return result
            
        except Exception as e:
            return f"❌ Error classifying image: {str(e)}"
    
    async def _arun(self, image_path: str) -> str:
        """Async version (not implemented)."""
        return self._run(image_path)


def create_dermnet_classifier_tool(
    model_path: str = "best_dermnet_model.pth",
    class_names: list = None
) -> DermNetClassifierTool:
    """Create and return a configured DermNet classifier tool."""
    
    tool = DermNetClassifierTool(model_path=model_path)
    
    if class_names is not None:
        tool.class_names = class_names
    
    return tool