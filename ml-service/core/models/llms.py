from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
load_dotenv()

gemini_model = init_chat_model(
    "google_genai:gemini-2.5-flash-lite",
    max_tokens=500,
    temperature=0.5,
)

groq_llama3_model = init_chat_model(
    "groq:llama-3.3-70b-versatile",
    max_tokens=500,
    temperature=0.3,
)

groq_mistral_model = init_chat_model(
    "groq:mixtral-8x7b-32768",
    max_tokens=500,
    temperature=0.5,
)

deepseek_chat_model = init_chat_model(
    "deepseek:deepseek-chat",
    max_tokens=500,
    temperature=0.3,
)

deepseek_reasoner_model = init_chat_model(
    "deepseek:deepseek-reasoner",
    max_tokens=500,
    temperature=0.3,
)

def rainbow_model(prompt):
    try:
        return deepseek_reasoner_model.invoke(prompt)
    except Exception:
        try:
            return groq_llama3_model.invoke(prompt)
        except Exception:
            return gemini_model.invoke(prompt)

