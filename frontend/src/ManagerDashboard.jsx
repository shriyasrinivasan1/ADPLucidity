
import React, { useState, useEffect } from 'react';

const ManagerDashboard = () => {
  const [percentage, setPercentage] = useState(75);

  useEffect(() => {
    setTimeout(() => {
      setPercentage(75);
    }, 2000);
  }, []);

  const radius = 45; // Circle radius
  const strokeWidth = 10; // Stroke thickness
  const circumference = 2 * Math.PI * radius; // Full circumference
  const progress = (percentage / 100) * circumference; // Arc length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-red-50 to-gray-50" />

      {/* Main Content */}
      <div className="relative">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-red-600">Manager Dashboard</h1>
            <button className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
              Logout
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="max-w-7xl mx-auto p-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-gray-600 text-sm font-medium mb-2">Total Users</h2>
              <p className="text-2xl font-bold text-red-600">1,245</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-gray-600 text-sm font-medium mb-2">Total Revenue</h2>
              <p className="text-2xl font-bold text-red-600">$150,300</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-gray-600 text-sm font-medium mb-2">Pending Tasks</h2>
              <p className="text-2xl font-bold text-red-600">35</p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="border-b border-gray-200 p-4">
                  <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
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

              {/* Happiness Index (Updated) */}
              <div className="bg-white rounded-lg shadow p-6 mb-6 flex flex-col items-center">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Team Happiness Index</h2>
                <svg width="300" height="300" viewBox="0 0 100 100" className="mb-2">
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#FECACA"
                    strokeWidth={strokeWidth}
                    fill="none"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#DC2626"
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
                    className="text-xl font-bold text-red-600"
                  >
                    {percentage}%
                  </text>
                </svg>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Consensus Summary */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Consensus Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Team Agreement</span>
                    <span className="text-sm font-medium text-red-600">85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Project Progress</span>
                    <span className="text-sm font-medium text-red-600">92%</span>
                  </div>
                </div>
              </div>

              {/* Chat Interface */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Team Chat</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1 bg-gray-100 rounded-lg p-3">
                      <p className="text-sm text-gray-700">Latest team updates will appear here</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;
