import React, { useState, useRef, useEffect } from 'react';
import "tailwindcss";


// ChatBot Component
const ChatInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setMessages(prev => [...prev, { text: inputMessage, sender: 'user' }]);
    setInputMessage('');
    
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "This is a simulated response. Replace this with your actual AI response logic.", 
        sender: 'ai' 
      }]);
      setIsTyping(false);
    }, 2000);
  };

  const TypingIndicator = () => (
    <div className="flex gap-2 p-3">
      <div className="w-2.5 h-2.5 bg-gray-600 rounded-full animate-bounce" />
      <div className="w-2.5 h-2.5 bg-gray-600 rounded-full animate-bounce delay-200" />
      <div className="w-2.5 h-2.5 bg-gray-600 rounded-full animate-bounce delay-400" />
    </div>
  );

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-600 text-white rounded-full w-12 h-12 text-xl cursor-pointer shadow-lg hover:bg-red-700"
        >
          💬
        </button>
      )}

      {isOpen && (
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg w-72 max-h-[500px] flex flex-col">
          <div className="bg-red-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="m-0">AI Assistant</h3>
            <div>
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="bg-none border-none text-white mr-2 cursor-pointer hover:opacity-80"
              >
                ─
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-none border-none text-white cursor-pointer hover:opacity-80"
              >
                ✕
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 max-h-[300px]">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex justify-${message.sender === 'user' ? 'end' : 'start'}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-lg ${message.sender === 'user' ? 'bg-red-600 text-white' : 'bg-gray-200 text-black'}`}>
                      {message.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 rounded-lg">
                      <TypingIndicator />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border border-gray-300 rounded-md outline-none bg-white/90"
                  />
                  <button
                    type="submit"
                    className="bg-red-600 text-white rounded-md py-2 px-4 cursor-pointer hover:bg-red-700"
                  >
                    ➤
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Consensus Summary Component
const ConsensusSummary = () => {
  return (
    <section className="fixed bottom-5 left-5 w-64 bg-white/90 backdrop-blur-sm border-2 border-red-600 rounded-lg p-4 z-40">
      <h2 className="text-red-600 mb-3 text-lg font-bold">Quick Summary</h2>
      <ul className="list-disc list-inside space-y-2">
        <li className="text-gray-700">Team productivity up by 25%</li>
        <li className="text-gray-700">Sprint goals met for Q1</li>
        <li className="text-gray-700">Budget utilization at 85%</li>
      </ul>
    </section>
  );
};

// Happiness Index Component
const HappinessIndex = ({ percentage }) => {
  const radius = 100;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="fixed top-24 left-5 bg-white/90 backdrop-blur-sm border-2 border-red-600 rounded-lg p-4 z-40">
      <h2 className="text-red-600 mb-3 text-lg font-bold text-center">Happiness Index</h2>
      <svg
        width="220"
        height="220"
        className="rotate-90"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="110"
          cy="110"
          r={radius}
          stroke="#ddd"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx="110"
          cy="110"
          r={radius}
          stroke="#dc2626"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="0.3em"
          fill="#333"
          fontSize="30"
          fontWeight="bold"
          className="-rotate-90"
        >
          {percentage}%
        </text>
      </svg>
    </div>
  );
};

// Manager Dashboard Component
const ManagerDashboard = () => {
  const [percentage, setPercentage] = useState(75);

  useEffect(() => {
    setTimeout(() => {
      setPercentage(75);
    }, 2000);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Animated Gradient Background */}
      
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 dashboard-gradient min-h-screen" />
      
      {/* Main Content */}
      <div className="relative z-10 p-5 w-full">
        <div className="ml-72">
          <header className="flex justify-between items-center p-5 bg-white/90 backdrop-blur-sm text-red-600 mb-5 rounded-lg">
            <h1 className="text-2xl font-bold">Manager Dashboard</h1>
            <button className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
              Logout
            </button>
          </header>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
            <div className="bg-white/90 backdrop-blur-sm border-2 border-red-600 rounded-lg p-5">
              <h2 className="text-red-600 mb-3">Total Users</h2>
              <p className="text-2xl font-bold text-red-600">1,245</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border-2 border-red-600 rounded-lg p-5">
              <h2 className="text-red-600 mb-3">Total Revenue</h2>
              <p className="text-2xl font-bold text-red-600">$150,300</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border-2 border-red-600 rounded-lg p-5">
              <h2 className="text-red-600 mb-3">Pending Tasks</h2>
              <p className="text-2xl font-bold text-red-600">35</p>
            </div>
          </section>

          <section className="bg-white/90 backdrop-blur-sm border-2 border-red-600 rounded-lg p-5 mb-5">
            <h2 className="text-red-600 mb-3">Recent Activity</h2>
            <ul className="list-none p-0">
              <li className="py-2 border-b border-gray-200 text-gray-700">User "John Doe" completed a task.</li>
              <li className="py-2 border-b border-gray-200 text-gray-700">User "Jane Smith" updated their profile.</li>
              <li className="py-2 text-gray-700">New revenue report available.</li>
            </ul>
          </section>
        </div>

        {/* Fixed Components */}
        <HappinessIndex percentage={percentage} />
        <ConsensusSummary />
        <ChatInterface />
      </div>
    </div>
  );
};

export default ManagerDashboard;