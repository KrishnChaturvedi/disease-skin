import os
import sys
from dotenv import load_dotenv
load_dotenv()
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from langchain.agents import create_agent
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI

from langgraph.checkpoint.memory import MemorySaver
from core.prompts.system_message import DermatologyReportPrompt
from core.tools.dermnet_classifier import create_dermnet_classifier_tool
from core.tools.search_tool import duck_search_tool


def create_dermatologist_agent(
    model_choice="groq_llama",
    model_path="best_dermnet_model.pth",
    class_names=None,
    temperature=0.7,
):
    """
    Create Dermatologist AI Agent using Modern LangGraph Architecture
    """

    # Initialize LLM
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
        raise ValueError(f"Unknown model choice: {model_choice}")


    # Tools
    classifier_tool = create_dermnet_classifier_tool(
        model_path=model_path,
        class_names=class_names
    )

    tools = [
        classifier_tool,
        duck_search_tool
    ]


    # LangGraph Memory
    memory = MemorySaver()


    # Create Modern Agent
    agent = create_agent(
        model=llm,
        tools=tools,
        system_prompt=DermatologyReportPrompt,
        checkpointer=memory
    )

    return agent



def run_dermatologist_consultation(
    agent,
    user_input: str,
    image_path: str = None,
    session_id="default"
):
    """
    Run Dermatologist Consultation
    """

    if image_path:
        full_input = f"""
Patient Message:
{user_input}

Image Path:
{image_path}
"""
    else:
        full_input = user_input

    try:
        response = agent.invoke(
            {
                "messages": [
                    {
                        "role": "user",
                        "content": full_input
                    }
                ]
            },
            config={
                "configurable": {
                    "thread_id": session_id
                }
            }
        )

        return response["messages"][-1].content

    except Exception as e:
        return f"Error during consultation: {str(e)}"



if __name__ == "__main__":

    print("Initializing Dr. DermAI...")

    agent = create_dermatologist_agent(
        model_choice="groq_llama",
        model_path="best_dermnet_model.pth",
        temperature=0.7
    )

    print("Agent ready!\n")


    while True:

        print("=" * 60)
        print("SkinShield Dermatologist Consultation")
        print("=" * 60)

        user_input = input("Describe your skin problem (or type 'exit'): ")

        if user_input.lower() == "exit":
            print("Exiting Dr. DermAI...")
            break


        image_path = input(
            "Enter image path (press Enter if no image): "
        ).strip()

        if image_path == "":
            image_path = None


        session_id = input(
            "Enter session id (default: patient_1): "
        ).strip()

        if session_id == "":
            session_id = "patient_1"


        response = run_dermatologist_consultation(
            agent,
            user_input=user_input,
            image_path=image_path,
            session_id=session_id
        )

        print("\n")
        print("=" * 60)
        print("DermAI Response")
        print("=" * 60)
        print(response)
        print("\n")