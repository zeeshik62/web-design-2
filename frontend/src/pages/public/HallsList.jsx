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

  // Use the newly generated default hall image stored in the backend
  const fallbackImage = "http://localhost:5000/uploads/subhall/default-hall.png";

  const getImageUrl = (imageName) => {
    if (!imageName) return fallbackImage;
    if (imageName.startsWith('http')) return imageName;
    return `http://localhost:5000/uploads/subhall/${imageName}`;
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 style={{ marginBottom: '30px' }}>Available Halls</h1>
      
      {loading ? (
        <p>Loading halls...</p>
      ) : halls.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px' }}>
          {halls.map((hall) => (
            <Link to={`/halls/${hall.slug || hall._id}`} key={hall._id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="glass-card" style={{ transition: 'transform 0.3s', cursor: 'pointer', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', fontSize: '14px' }}>
                {/* Image Section - Smaller height */}
                <div style={{ width: '100%', height: '180px', overflow: 'hidden' }}>
                  <img 
                    src={hall.images && hall.images.length > 0 ? getImageUrl(hall.images[0]) : fallbackImage} 
                    alt={hall.subhall_name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                
                {/* Content Section - Adjusted padding */}
                <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ marginBottom: '8px', fontSize: '1.2rem' }}>{hall.subhall_name}</h3>
                  <div style={{ color: 'var(--text-light)', marginBottom: '10px', fontSize: '13px', flexGrow: 1 }}>
                    <p style={{ marginBottom: '4px' }}>Type: {hall.type}</p>
                    <p style={{ marginBottom: '4px' }}>Capacity: {hall.sitting_capacity} persons</p>
                    <p style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                      Starting Price: ${hall.starting_price}
                    </p>
                  </div>
                  
                  {/* Address at the bottom */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', marginTop: 'auto' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: 0 }}>
                      📍 {hall.address?.street_address}, {hall.address?.city}, {hall.address?.country}
                    </p>
                  </div>
                </div>
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
