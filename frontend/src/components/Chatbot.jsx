import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your AI Dermatologist. Do you have any questions about your scan results or report?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to the bottom whenever a new message is added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    // Add user message to UI immediately
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('skinshield_token');
      
      // Call the Node.js backend (using the updated scan route)
      const response = await axios.post(
        `${API_BASE}/api/scan/chat`, 
        { message: userMsg },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setMessages((prev) => [...prev, { role: 'ai', text: response.data.reply }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: 'error', text: 'Connection failed. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[450px] w-full border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm mt-8">
      {/* Header */}
      <div className="bg-indigo-600 p-4 text-white font-bold flex items-center gap-2">
        <span>💬</span> 
        <span>Ask Follow-up Questions</span>
      </div>
      
      {/* Chat History Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
              msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none shadow-sm' : 
              msg.role === 'error' ? 'bg-red-100 text-red-700 rounded-bl-none border border-red-200' :
              'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-bl-none text-slate-400 text-sm italic shadow-sm">
              AI is typing...
            </div>
          </div>
        )}
        
        {/* Invisible div to anchor the auto-scroll */}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={sendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your symptoms or report..."
          className="flex-1 px-4 py-2.5 border border-slate-300 rounded-full text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}