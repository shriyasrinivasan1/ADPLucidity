import React, { useState, useRef, useEffect } from 'react';
import './ManagerDashboard.css';

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
    <div style={{ display: 'flex', gap: '8px', padding: '12px' }}>
      <div style={{ 
        width: '8px', 
        height: '8px', 
        backgroundColor: '#888',
        borderRadius: '50%',
        animation: 'bounce 1.4s infinite',
        animationDelay: '0ms'
      }} />
      <div style={{ 
        width: '8px', 
        height: '8px', 
        backgroundColor: '#888',
        borderRadius: '50%',
        animation: 'bounce 1.4s infinite',
        animationDelay: '200ms'
      }} />
      <div style={{ 
        width: '8px', 
        height: '8px', 
        backgroundColor: '#888',
        borderRadius: '50%',
        animation: 'bounce 1.4s infinite',
        animationDelay: '400ms'
      }} />
    </div>
  );

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      zIndex: 1000
    }}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}
        >
          💬
        </button>
      )}

      {isOpen && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          width: '300px',
          maxHeight: '500px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '12px',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0 }}>AI Assistant</h3>
            <div>
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  marginRight: '8px',
                  cursor: 'pointer'
                }}
              >
                ─
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                maxHeight: '300px'
              }}>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{
                      maxWidth: '80%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: message.sender === 'user' ? '#007bff' : '#f0f0f0',
                      color: message.sender === 'user' ? 'white' : 'black'
                    }}>
                      {message.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{ backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                      <TypingIndicator />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSubmit} style={{
                padding: '16px',
                borderTop: '1px solid #eee'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '8px 16px',
                      cursor: 'pointer'
                    }}
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

function ManagerDashboard() {
  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Manager Dashboard</h1>
        <button className="logout-button">Logout</button>
      </header>

      <section className="overview">
        <div className="card">
          <h2>Total Users</h2>
          <p className="value">1,245</p>
        </div>
        <div className="card">
          <h2>Total Revenue</h2>
          <p className="value">$150,300</p>
        </div>
        <div className="card">
          <h2>Pending Tasks</h2>
          <p className="value">35</p>
        </div>
      </section>

      <section className="notifications">
        <h2>Recent Activity</h2>
        <ul>
          <li>User "John Doe" completed a task.</li>
          <li>User "Jane Smith" updated their profile.</li>
          <li>New revenue report available.</li>
        </ul>
      </section>

      <ChatInterface />
    </div>
  );
}

export default ManagerDashboard;