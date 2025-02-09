import React, { useState, useEffect } from 'react';

const ManagerDashboard = () => {
  const [percentage, setPercentage] = useState(75); // Happiness
  const [engagementPercentage, setEngagementPercentage] = useState(60);  // Engagement
  const [participationPercentage, setParticipationPercentage] = useState(80);  // Participation
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const radius = 40; // Circle radius
  const strokeWidth = 8; // Stroke thickness
  const circumference = 2 * Math.PI * radius; // Full circumference
  const progress = (percentage / 100) * circumference; // Arc length
  const engagementProgress = (engagementPercentage / 100) * circumference;
  const participationProgress = (participationPercentage / 100) * circumference;

  useEffect(() => {
    setTimeout(() => {
      setPercentage(75);
    }, 2000);
  }, []);

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const botMessage = { text: `Echo: ${input}`, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
      setTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-gradient-to-br from-red-300 to orange-200" />
      <div className="relative flex flex-col h-screen">
        <header className="bg-white rounded-lg border border-gray-200 shadow-sm px-80 py-4 m-4">
          <div className="flex justify-between items-center max-w-full mx-auto">
            <h1 className="text-3xl font-bold text-red-400 text-center whitespace-nowrap mx-auto ">Manager Dashboard</h1>
          </div>
        </header>
        
        <div className="flex flex-1 overflow-hidden p-4 gap-6">
          {/* Main Content */}
          <div className="flex-[3_3_0%] overflow-y-auto min-w-0">
            <main className="w-full">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-gray-600 text-sm font-medium mb-2">Total Users</h2>
                  <p className="text-2xl font-bold text-red-600">4</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Team Happiness Index</h2>
                  <svg width="100" height="100" viewBox="0 0 100 100" className="mb-2">
                    {/* Background Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke="#e2e8f0"
                      strokeWidth={strokeWidth}
                      fill="none"
                    />
                    {/* Progress Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke="#6ee7b7"
                      strokeWidth={strokeWidth}
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - progress}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                      className="transition-all duration-500"
                    />
                    {/* Percentage Text */}
                    <text
                      x="50"
                      y="50"
                      textAnchor="middle"
                      dy="5"
                      className="text-xl font-bold"
                      fill="#6ee7b7"
                    >
                      {percentage}%
                    </text>
                  </svg>
                </div>
              </div>
              
              {/* Engagement and Participation Boxes */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Engagement Progress Circle */}
                <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Engagement Levels</h2>
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke="#e2e8f0"
                      strokeWidth={strokeWidth}
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke="#3b82f6"
                      strokeWidth={strokeWidth}
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - engagementProgress}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                      className="transition-all duration-500"
                    />
                    <text
                      x="50"
                      y="50"
                      textAnchor="middle"
                      dy="5"
                      className="text-xl font-bold"
                      fill="#3b82f6"
                    >
                      {engagementPercentage}%
                    </text>
                  </svg>
                </div>

                {/* Participation Progress Circle */}
                <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Participation Levels</h2>
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke="#e2e8f0"
                      strokeWidth={strokeWidth}
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke="#10b981"
                      strokeWidth={strokeWidth}
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - participationProgress}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                      className="transition-all duration-500"
                    />
                    <text
                      x="50"
                      y="50"
                      textAnchor="middle"
                      dy="5"
                      className="text-xl font-bold"
                      fill="#10b981"
                    >
                      {participationPercentage}%
                    </text>
                  </svg>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="border-b border-gray-200 p-4">
                  <h2 className="text-lg font-medium text-gray-900">Summary</h2>
                </div>
                <ul className="divide-y divide-gray-200">
                  <li className="p-4 hover:bg-gray-50">
                    <p className="text-sm text-gray-700">User "John Doe" completed a task.</p>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </li>
                  <li className="p-4 hover:bg-gray-50">
                    <p className="text-sm text-gray-700">User "Jane Smith" updated their profile.</p>
                    <span className="text-xs text-gray-500">3 hours ago</span>
                  </li>
                  <li className="p-4 hover:bg-gray-50">
                    <p className="text-sm text-gray-700">New revenue report available.</p>
                    <span className="text-xs text-gray-500">5 hours ago</span>
                  </li>
                </ul>
              </div>
            </main>
          </div>

          {/* Permanent Chat Panel */}
          <div className="flex-1 flex flex-col">
            <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col">
              <div className="bg-red-400 text-white p-3 flex items-center rounded-t-lg">
                <span className="font-medium">AI Chatbot</span>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`p-2 my-1 rounded-lg max-w-xs ${
                      msg.sender === 'user' ? 'ml-auto bg-red-100' : 'mr-auto bg-gray-100'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
                {typing && (
                  <div className="p-10">
                    <div className="flex items-center space-x-3 text-gray-600 text-sm">
                      <div className="flex h-full items-center space-x-1">
                        <div className="h-5 animate-bounce">
                          <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                        </div>
                        <div className="h-5 animate-bounce">
                          <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                        </div>
                        <div className="h-5 animate-bounce">
                          <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                        </div>
                      </div>
                      <p className="mb-4">Typing...</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3 border-t flex">
                <input 
                  type="text" 
                  className="flex-1 p-2 border rounded-l-lg text-black" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  className="bg-red-600 text-white px-4 rounded-r-lg hover:bg-red-700 transition-colors" 
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
