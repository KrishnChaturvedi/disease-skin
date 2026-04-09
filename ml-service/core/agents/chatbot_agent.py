import os
import sys
from dotenv import load_dotenv

load_dotenv()
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from langchain.agents import create_agent
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI

from langgraph.checkpoint.memory import MemorySaver

from core.prompts.system_message import ChatDermatologistPrompt
from core.tools.search_tool import duck_search_tool


def create_chatbot_agent(
    model_choice="groq_llama",
    temperature=0.7,
):

    if model_choice == "groq_llama":
        llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            temperature=temperature,
            groq_api_key=os.getenv("GROQ_API_KEY")
        )

    elif model_choice == "groq_mistral":
        llm = ChatGroq(
            model="mixtral-8x7b-32768",
            temperature=temperature,
            groq_api_key=os.getenv("GROQ_API_KEY")
        )

    elif model_choice == "gemini":
        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=temperature,
            google_api_key=os.getenv("GOOGLE_API_KEY")
        )

    else:
        raise ValueError("Invalid model choice")

    memory = MemorySaver()

    agent = create_agent(
        model=llm,
        tools=[duck_search_tool],
        system_prompt=ChatDermatologistPrompt,
        checkpointer=memory
    )

    return agent