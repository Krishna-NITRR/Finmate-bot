import React, { useState, useRef, useEffect } from 'react';
import { Send, Shield, User, Loader2, Heart, Home, Car } from 'lucide-react';

export default function FinMate() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm FinMate, your insurance advisor. I specialize in term life insurance and can help you understand coverage options, compare policies, calculate premiums, and answer any insurance questions. How can I assist you today?", 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    "What is term life insurance?",
    "How much coverage do I need?",
    "What factors affect premiums?",
    "Term vs whole life insurance?"
  ];

  const generateBotResponse = async (userMessage) => {
    setIsLoading(true);
    
    try {
      const systemPrompt = `You are FinMate, a friendly and knowledgeable insurance advisor specializing in term life insurance and general insurance guidance. Your role is to:

1. Help users understand term life insurance, its benefits, and how it works
2. Explain different types of insurance (health, auto, home, life)
3. Guide users on coverage amounts and policy selection
4. Explain premium calculations and factors that affect costs
5. Compare different insurance options
6. Answer questions about claims, beneficiaries, and policy terms
7. Provide personalized advice based on user situations

Always be:
- Clear and easy to understand (avoid jargon when possible)
- Helpful and supportive
- Accurate with insurance information
- Encouraging users to make informed decisions
- Reminding users to consult licensed insurance agents for final decisions

Keep responses concise but informative. Use examples when helpful.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            { 
              role: 'user', 
              content: `${systemPrompt}\n\nUser question: ${userMessage}` 
            }
          ],
        }),
      });

      const data = await response.json();
      const botReply = data.content[0].text;
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: botReply,
        sender: 'bot'
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "I'm having trouble connecting right now. Please try again in a moment!",
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (messageText = input) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    generateBotResponse(messageText);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestion = (question) => {
    handleSend(question);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-emerald-200">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-3 rounded-xl shadow-md">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">FinMate</h1>
              <p className="text-sm text-gray-600">Your Insurance Advisor</p>
            </div>
            <div className="hidden md:flex gap-2">
              <div className="flex items-center gap-1 px-3 py-1 bg-emerald-100 rounded-full">
                <Heart className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">Life</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-teal-100 rounded-full">
                <Home className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-medium text-teal-700">Home</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-cyan-100 rounded-full">
                <Car className="w-4 h-4 text-cyan-600" />
                <span className="text-xs font-medium text-cyan-700">Auto</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div key={message.id}>
              <div
                className={`flex gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                  message.sender === 'bot' 
                    ? 'bg-gradient-to-br from-emerald-600 to-teal-600' 
                    : 'bg-gradient-to-br from-gray-700 to-gray-800'
                }`}>
                  {message.sender === 'bot' ? (
                    <Shield className="w-6 h-6 text-white" />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none shadow-lg'
                      : 'bg-white text-gray-800 shadow-lg rounded-tl-none border border-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                </div>
              </div>
              
              {/* Quick Questions after first bot message */}
              {index === 0 && message.sender === 'bot' && (
                <div className="mt-4 ml-14">
                  <p className="text-xs text-gray-600 mb-2 font-medium">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickQuestion(question)}
                        className="px-3 py-2 text-xs bg-white border border-emerald-300 text-emerald-700 rounded-full hover:bg-emerald-50 transition-colors shadow-sm"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-md">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-lg border border-gray-100">
                <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-emerald-200 shadow-lg">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about term life insurance, coverage, premiums..."
              className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 rounded-full hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            FinMate provides general guidance. Consult a licensed agent for personalized advice.
          </p>
        </div>
      </div>
    </div>
  );
}