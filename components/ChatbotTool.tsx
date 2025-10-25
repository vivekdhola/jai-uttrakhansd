import React, { useState, useEffect, useRef } from 'react';
import { Tool } from '../types';
import { chat } from '../services/geminiService';
import { LogoIcon } from './IconComponents';

interface ChatbotToolProps {
  tool: Tool;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const ChatbotTool: React.FC<ChatbotToolProps> = ({ tool }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset chat history when the component mounts
    chat.reset();
    setMessages([]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await chat.sendMessage(input);
      const aiMessage: Message = { sender: 'ai', text: aiResponse };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white h-[calc(100vh-4rem)] flex flex-col p-0 rounded-lg shadow-xl">
      <div className="flex items-center space-x-4 p-4 border-b">
        <div className={`p-3 rounded-full text-white ${tool.color}`}>
          <tool.icon className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-dark">{tool.title}</h2>
          <p className="text-slate-500">{tool.description}</p>
        </div>
      </div>
      
      <div className="flex-grow p-6 overflow-y-auto bg-slate-50">
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'ai' && <LogoIcon className="w-8 h-8 text-primary flex-shrink-0 mt-1" />}
              <div className={`max-w-md p-4 rounded-xl ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-slate-200 text-dark'}`}>
                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
               <LogoIcon className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
               <div className="max-w-md p-4 rounded-xl bg-slate-200 text-dark">
                <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-primary rounded-full animate-bounce"></span>
                </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t bg-white">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-grow p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-primary text-white font-bold py-3 px-6 rounded-lg transition-colors hover:bg-primary-dark disabled:bg-slate-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotTool;