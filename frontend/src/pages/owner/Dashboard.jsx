import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Dashboard Overview</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ color: 'var(--text-light)', fontSize: '16px', marginBottom: '10px' }}>Total Bookings</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>24</p>
        </div>
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ color: 'var(--text-light)', fontSize: '16px', marginBottom: '10px' }}>Active Queries</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>12</p>
        </div>
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ color: 'var(--text-light)', fontSize: '16px', marginBottom: '10px' }}>Total Revenue</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>$12,450</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
