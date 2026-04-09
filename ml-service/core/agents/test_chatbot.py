import os
import sys
from dotenv import load_dotenv

load_dotenv()
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from core.agents.chatbot_agent import create_chatbot_agent


def run_chatbot(agent, user_input, session_id="default"):

    try:
        response = agent.invoke(
            {
                "messages": [
                    {
                        "role": "user",
                        "content": user_input
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
        return f"Error: {str(e)}"


if __name__ == "__main__":

    print("Initializing Chat Dermatologist...")

    agent = create_chatbot_agent(
        model_choice="groq_llama",
        temperature=0.7
    )

    print("Chatbot Ready\n")


    print("=" * 60)
    print("CHAT SESSION 1")
    print("=" * 60)

    response = run_chatbot(
        agent,
        "What causes itchy red rash on skin?",
        session_id="user_1"
    )

    print(response)
    print("\n")


    print("=" * 60)
    print("CHAT SESSION 2 (Follow-up)")
    print("=" * 60)

    response = run_chatbot(
        agent,
        "Can it be treated at home?",
        session_id="user_1"
    )

    print(response)
    print("\n")


    print("=" * 60)
    print("CHAT SESSION 3 (New User)")
    print("=" * 60)

    response = run_chatbot(
        agent,
        "How to know if mole is dangerous?",
        session_id="user_2"
    )

    print(response)