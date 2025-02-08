import React from 'react';
import './ManagerDashboard.css';

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
    </div>
  );
}

export default ManagerDashboard;
