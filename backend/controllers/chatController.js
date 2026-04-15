import axios from 'axios';

export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

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