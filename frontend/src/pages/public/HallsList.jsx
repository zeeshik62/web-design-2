import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const HallsList = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await api.get('/public/subhalls');
        if (response.data.success) {
          setHalls(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch public halls", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHalls();
  }, []);

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 style={{ marginBottom: '30px' }}>Available Halls</h1>
      
      {loading ? (
        <p>Loading halls...</p>
      ) : halls.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {halls.map((hall) => (
            <Link to={`/halls/${hall.slug || hall._id}`} key={hall._id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="glass-card" style={{ padding: '20px', transition: 'transform 0.3s', cursor: 'pointer' }}>
                <h3 style={{ marginBottom: '10px' }}>{hall.name}</h3>
                <p style={{ color: 'var(--text-light)', marginBottom: '10px' }}>
                  Capacity: {hall.capacity?.min} - {hall.capacity?.max}
                </p>
                <p style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  Price: ${hall.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '40px', marginTop: '20px', textAlign: 'center' }}>
          <p>No halls available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default HallsList;
