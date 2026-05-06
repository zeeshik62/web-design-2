import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const Halls = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await api.get('/hall_owner/subhalls');
        if (response.data.success) {
          setHalls(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch halls", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHalls();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>My Halls</h1>
        <button className="btn-primary">+ Add New Hall</button>
      </div>
      
      {loading ? (
        <p>Loading halls...</p>
      ) : halls.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {halls.map((hall) => (
            <div key={hall._id} className="glass-card" style={{ padding: '20px' }}>
              <h3 style={{ marginBottom: '10px' }}>{hall.name}</h3>
              <p style={{ color: 'var(--text-light)', marginBottom: '10px' }}>
                Capacity: {hall.capacity?.min} - {hall.capacity?.max}
              </p>
              <p style={{ fontWeight: 'bold' }}>Price: ${hall.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '20px' }}>
          <p>No halls added yet. Click the button above to add one.</p>
        </div>
      )}
    </div>
  );
};

export default Halls;
