import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SYSTEM_PROMPT_TEMPLATE = `You are a helpful Mission Control AI Assistant. Use the live dashboard data below to answer the user's question. Always give a direct, friendly answer using the data. Keep answers short (1-3 sentences).

Here is the current live data:
- The ISS is currently at Latitude {LAT}, Longitude {LON}.
- The ISS is near: {PLACE}.
- The ISS is traveling at {SPEED} km/h.
- We have tracked {TRACKED} positions so far.
- There are {PEOPLE_COUNT} people in space right now.
- Their names are: {ASTRONAUTS}.

Recent news headlines:
{NEWS}

If the user asks about something not covered by this data, say you only have dashboard data available.`;

export default function Chatbot({ issContext, newsContext }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('chatbot_messages');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatbot_messages', JSON.stringify(messages.slice(-30)));
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const buildContext = () => {
    let newsStr = '';
    if (newsContext) {
      Object.entries(newsContext).forEach(([cat, articles]) => {
        if (articles && articles.length > 0) {
          newsStr += `Category: ${cat}\n`;
          articles.slice(0, 5).forEach(a => {
            newsStr += `- ${a.title} (Source: ${a.source?.name})\n`;
          });
        }
      });
    }

    return SYSTEM_PROMPT_TEMPLATE
      .replace('{LAT}', issContext?.lat?.toFixed(3) || 'Unknown')
      .replace('{LON}', issContext?.lon?.toFixed(3) || 'Unknown')
      .replace('{PLACE}', issContext?.place || 'Unknown')
      .replace('{SPEED}', issContext?.speed?.toLocaleString() || 'Unknown')
      .replace('{TRACKED}', issContext?.trackedCount || 0)
      .replace('{PEOPLE_COUNT}', issContext?.peopleCount || 0)
      .replace('{ASTRONAUTS}', issContext?.astronautNames || 'None')
      .replace('{NEWS}', newsStr || 'None');
  };

  const handleSend = async (text = input) => {
    if (!text.trim()) return;
    
    const userMsg = { role: 'user', content: text.trim(), time: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const token = import.meta.env.VITE_HF_TOKEN;
      if (!token) throw new Error("No HF_TOKEN");

      const res = await axios.post(
        '/hf-api/v1/chat/completions',
        {
          model: 'meta-llama/Llama-3.2-1B-Instruct',
          messages: [
            { role: 'system', content: buildContext() },
            { role: 'user', content: userMsg.content }
          ],
          max_tokens: 300,
          temperature: 0.3,
          top_p: 0.85
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      let botResponse = res.data?.choices?.[0]?.message?.content || '';
      
      if (!botResponse) botResponse = "I'm not sure how to respond to that.";

      const botMsg = { role: 'assistant', content: botResponse, time: new Date().toLocaleTimeString() };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errMsg = { 
        role: 'assistant', 
        content: "⚠️ Sorry, I could not connect to the AI service. Please try again.", 
        time: new Date().toLocaleTimeString(),
        isError: true
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('chatbot_messages');
  };

  const QUICK_QUESTIONS = [
    "Where is the ISS?",
    "How fast is the ISS?",
    "What are the space news?",
    "Who is in space?"
  ];

  return (
    <>
      {/* Toggle button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full hover:scale-110 transition-all flex items-center justify-center text-xl shadow-lg
          ${isOpen 
            ? 'bg-red-500 dark:bg-neon-pink text-white dark:shadow-[0_0_20px_rgba(255,45,120,0.4)]' 
            : 'bg-blue-600 dark:bg-neon-cyan text-white dark:text-cyber-bg dark:shadow-[0_0_20px_rgba(0,229,255,0.4)]'
          }`}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[520px] flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-neon-cyan/30 bg-white dark:bg-cyber-bg shadow-2xl dark:shadow-[0_0_40px_rgba(0,229,255,0.1)]">
          
          {/* Header */}
          <div className="bg-gray-50 dark:bg-cyber-card p-4 border-b border-gray-200 dark:border-neon-cyan/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 dark:bg-neon-green status-dot"></div>
              <span className="font-bold text-gray-900 dark:text-neon-cyan font-mono text-sm dark:text-glow-cyan">
                MISSION AI
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={clearMessages} className="text-xs text-gray-400 hover:text-red-500 dark:hover:text-neon-pink transition-colors font-mono">
                Clear
              </button>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors text-sm">
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-white dark:bg-[#060a14]">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                <span className="text-4xl">🤖</span>
                <h3 className="font-bold text-gray-800 dark:text-neon-cyan text-base font-mono dark:text-glow-cyan">MISSION AI</h3>
                <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">Ask me about ISS position, speed, or news</p>
                <div className="flex flex-col gap-2 mt-3 w-full px-2">
                  {QUICK_QUESTIONS.map(q => (
                    <button 
                      key={q} 
                      onClick={() => { setInput(q); handleSend(q); }}
                      className="bg-gray-50 dark:bg-cyber-card hover:bg-gray-100 dark:hover:bg-[#111b30] border border-gray-200 dark:border-neon-cyan/20 hover:border-blue-300 dark:hover:border-neon-cyan/40 text-xs font-mono py-2.5 rounded-lg transition-all text-gray-700 dark:text-gray-400"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-3.5 py-2.5 max-w-[85%] ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 dark:bg-neon-cyan/20 text-white dark:text-neon-cyan rounded-xl rounded-tr-sm border border-blue-600 dark:border-neon-cyan/40' 
                      : msg.isError 
                        ? 'bg-red-50 dark:bg-neon-pink/10 text-red-600 dark:text-neon-pink border border-red-200 dark:border-neon-pink/30 rounded-xl rounded-tl-sm'
                        : 'bg-gray-50 dark:bg-cyber-card text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-cyber-border rounded-xl rounded-tl-sm'
                  }`}>
                    <p className="text-xs whitespace-pre-wrap font-mono leading-relaxed">{msg.content}</p>
                  </div>
                  <span className="text-[9px] text-gray-400 dark:text-gray-600 mt-1 mx-1 font-mono">{msg.time}</span>
                </div>
              ))
            )}
            
            {isTyping && (
              <div className="flex flex-col items-start">
                <div className="px-4 py-3 max-w-[85%] bg-gray-50 dark:bg-cyber-card rounded-xl rounded-tl-sm border border-gray-200 dark:border-cyber-border flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-gray-50 dark:bg-cyber-card border-t border-gray-200 dark:border-neon-cyan/20 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              placeholder="Type your message..."
              className="flex-1 bg-white dark:bg-[#060a14] border border-gray-200 dark:border-neon-cyan/20 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-500 dark:focus:border-neon-cyan dark:focus:shadow-[0_0_8px_rgba(0,229,255,0.2)] disabled:opacity-50 text-gray-900 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600 transition-all"
            />
            <button 
              onClick={() => handleSend()}
              disabled={isTyping || !input.trim()}
              className="cyber-btn cyber-btn-primary min-w-[56px] disabled:opacity-40"
            >
              {isTyping ? '...' : '▶'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
