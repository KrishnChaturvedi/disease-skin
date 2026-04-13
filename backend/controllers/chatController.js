import axios from 'axios';

export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    
    // We use the logged-in user's Mongo ID as the session ID.
    // This allows the LangGraph agent to remember their conversation history!
    const sessionId = req.user._id.toString(); 

    const pythonApiUrl = process.env.ML_SERVICE_URL || "http://ml:8000";

    const mlResponse = await axios.post(`${pythonApiUrl}/chat`, {
      message: message,
      sessionId: sessionId
    });

    res.status(200).json({
      success: true,
      reply: mlResponse.data.reply
    });

  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      success: false,
      message: "Chatbot failed to respond."
    });
  }
};