import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
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
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('skinshield_token');
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
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>

      {/* Chat Window — independently fixed above the button */}
      {open && (
        <div
          className="flex flex-col rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xl"
          style={{ position: 'fixed', bottom: 90, right: 24, width: 340, height: 450, boxShadow: '0 12px 48px rgba(0,0,0,0.18)', zIndex: 50 }}
        >
          {/* Header */}
          <div className="bg-indigo-600 px-4 py-3 text-white font-bold flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span>💬</span>
              <span className="text-sm">Ask Follow-up Questions</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-indigo-200 hover:text-white text-xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                  msg.role === 'user'  ? 'bg-indigo-600 text-white rounded-br-none shadow-sm' :
                  msg.role === 'error' ? 'bg-red-100 text-red-700 rounded-bl-none border border-red-200' :
                  'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-bl-none text-slate-400 text-sm italic shadow-sm">
                  AI is typing...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
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
      )}

      {/* Floating Round Icon Button — black */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="relative flex items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95"
        style={{ width: 56, height: 56, background: '#1a1a1a', boxShadow: '0 4px 24px rgba(0,0,0,0.35)' }}
        title="Ask AI Dermatologist"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        {!open && (
          <span className="absolute top-0 right-0 flex h-3 w-3 rounded-full bg-green-400 ring-2 ring-white animate-pulse" />
        )}
      </button>

    </div>
  );
}
