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
    <div className="fixed bottom-5 left-5 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-600 text-white rounded-full w-12 h-12 text-xl cursor-pointer shadow-lg"
        >
          💬
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-lg w-72 max-h-[500px] flex flex-col">
          <div className="bg-red-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="m-0">AI Assistant</h3>
            <div>
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="bg-none border-none text-white mr-2 cursor-pointer"
              >
                ─
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-none border-none text-white cursor-pointer"
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
                    className="flex-1 p-2 border border-gray-300 rounded-md outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-red-600 text-white rounded-md py-2 px-4 cursor-pointer"
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

// Manager Dashboard Component
const ManagerDashboard = () => {
  return (
    <div className="p-5 bg-white">
      <header className="flex justify-between items-center p-5 bg-red-600 text-white mb-5">
        <h1>Manager Dashboard</h1>
        <button className="bg-white text-red-600 py-2 px-4 rounded-md">Logout</button>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
        <div className="bg-white border-2 border-red-600 rounded-lg p-5 text-center">
          <h2 className="text-red-600 mb-3">Total Users</h2>
          <p className="text-2xl font-bold text-red-600">1,245</p>
        </div>
        <div className="bg-white border-2 border-red-600 rounded-lg p-5 text-center">
          <h2 className="text-red-600 mb-3">Total Revenue</h2>
          <p className="text-2xl font-bold text-red-600">$150,300</p>
        </div>
        <div className="bg-white border-2 border-red-600 rounded-lg p-5 text-center">
          <h2 className="text-red-600 mb-3">Pending Tasks</h2>
          <p className="text-2xl font-bold text-red-600">35</p>
        </div>
      </section>

      <section className="bg-white border-2 border-red-600 rounded-lg p-5">
        <h2 className="text-red-600 mb-3">Recent Activity</h2>
        <ul className="list-none p-0">
          <li className="py-2 border-b border-gray-200 text-gray-700">User "John Doe" completed a task.</li>
          <li className="py-2 border-b border-gray-200 text-gray-700">User "Jane Smith" updated their profile.</li>
          <li className="py-2 text-gray-700">New revenue report available.</li>
        </ul>
      </section>

      <ChatInterface />
    </div>
  );
};

export default ManagerDashboard;
