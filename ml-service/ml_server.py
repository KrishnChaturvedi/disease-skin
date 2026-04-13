import os
import sys
import requests
import tempfile
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.checkpoint.memory import MemorySaver
from langchain.agents import create_agent

from core.models.llms import groq_llama3_model, groq_mistral_model, gemini_model
from core.prompts.system_message import DermatologyReportPrompt, ChatDermatologistPrompt
from core.tools.dermnet_classifier import create_dermnet_classifier_tool
from core.tools.search_tool import duck_search_tool

app = FastAPI(title="SkinShield ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

print("Loading Scan Analyzer agent...")

classifier_tool = create_dermnet_classifier_tool(
    model_path="best_dermnet_model.pth"
)

analyzer_memory = MemorySaver()

analyzer_agent = create_agent(
    model=gemini_model,
    tools=[classifier_tool, duck_search_tool],
    system_prompt=DermatologyReportPrompt,
    checkpointer=analyzer_memory
)

print("Scan Analyzer ready!")

print("Loading Chatbot agent...")

chatbot_memory = MemorySaver()

chatbot_agent = create_agent(
    model=groq_llama3_model,
    tools=[duck_search_tool],
    system_prompt=ChatDermatologistPrompt,
    checkpointer=chatbot_memory
)

print("Chatbot ready!")

class ScanRequest(BaseModel):
    imageUrl: str       
    symptoms: dict      
    scanId: str         
    language: str = "English" # ✅ Added language to model

class ChatRequest(BaseModel):
    message: str        
    sessionId: str      

def download_image(url: str) -> str:
    response = requests.get(url, timeout=10)
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to download image from Cloudinary")

    suffix = Path(url.split("?")[0]).suffix or ".jpg"
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    tmp.write(response.content)
    tmp.close()
    return tmp.name


def build_scan_prompt(symptoms: dict, image_path: str, language: str) -> str:
    return f"""
            Patient Questionnaire Answers:
            - Age: {symptoms.get('age', 'N/A')}
            - Duration: {symptoms.get('durationDays', 'N/A')} days
            - Evolution (changed?): {symptoms.get('evolution', 'N/A')}
            - Itching Level: {symptoms.get('itchingLevel', 'N/A')}
            - Physical Symptoms: {symptoms.get('physicalSymptoms', 'N/A')}
            - Sun Exposure: {symptoms.get('sunExposure', 'N/A')}
            - Family History of Skin Disease: {symptoms.get('familyHistory', 'N/A')}

            Image Path:
            {image_path}

            Please analyze the image using the skin_condition_classifier tool, then generate a full dermatology report using the questionnaire answers and classification result.
            
            CRITICAL INSTRUCTIONS FOR OUTPUT:
            1. You MUST write the ENTIRE final report EXCLUSIVELY in {language}. 
            2. DO NOT include any internal thought processes, planning steps, or meta-commentary (e.g., do NOT write "The user wants...", "Here is the report...", or "Now I will translate...").
            3. DO NOT provide English translations or English words in brackets next to the {language} words. Use 100% {language}.
            4. Start your response IMMEDIATELY with the report title in {language}, nothing else before it.
            5. Structure the report professionally with clear headings.
            """

def parse_ml_result(messages: list) -> tuple:
    disease = "Unknown"
    confidence = 0.0

    for msg in messages:
        content = getattr(msg, "content", "")
        if "PRIMARY DIAGNOSIS" in content:
            lines = content.split("\n")
            for i, line in enumerate(lines):
                if "PRIMARY DIAGNOSIS" in line and i + 1 < len(lines):
                    disease = lines[i + 1].strip()
                if "Confidence:" in line and disease != "Unknown":
                    try:
                        confidence = float(
                            line.split("Confidence:")[1].replace("%", "").strip()
                        )
                    except Exception:
                        pass
                    break

    return disease, confidence

@app.get("/health")
def health():
    return {"status": "ok", "service": "SkinShield ML"}

@app.post("/analyze")
async def analyze_skin(request: ScanRequest):
    tmp_path = None
    try:
        tmp_path = download_image(request.imageUrl)

        # ✅ Pass language to the prompt builder
        prompt = build_scan_prompt(request.symptoms, tmp_path, request.language)

        response = analyzer_agent.invoke(
            {"messages": [{"role": "user", "content": prompt}]},
            config={"configurable": {"thread_id": request.scanId}}
        )

        report_text = response["messages"][-1].content
        disease, confidence = parse_ml_result(response["messages"])

        return {
            "success": True,
            "disease": disease,
            "confidence": confidence,
            "report": report_text,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = chatbot_agent.invoke(
            {"messages": [{"role": "user", "content": request.message}]},
            config={"configurable": {"thread_id": request.sessionId}}
        )

        reply = response["messages"][-1].content

        return {
            "success": True,
            "reply": reply,
            "sessionId": request.sessionId,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))