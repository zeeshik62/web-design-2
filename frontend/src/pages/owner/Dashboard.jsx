import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/hall_owner/stats');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Dashboard Overview</h1>
      {loading ? (
        <p>Loading stats...</p>
      ) : stats ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ color: 'var(--text-light)', fontSize: '16px', marginBottom: '10px' }}>Total Halls</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalHalls || 0}</p>
          </div>
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ color: 'var(--text-light)', fontSize: '16px', marginBottom: '10px' }}>Total Vendors</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalVendors || 0}</p>
          </div>
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ color: 'var(--text-light)', fontSize: '16px', marginBottom: '10px' }}>Active Queries</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.combinedEnquiries || 0}</p>
          </div>
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ color: 'var(--text-light)', fontSize: '16px', marginBottom: '10px' }}>Total Customers</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalCustomers || 0}</p>
          </div>
        </div>
      ) : (
        <p>Failed to load dashboard statistics.</p>
      )}
    </div>
  );
};

export default Dashboard;
