import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const VendorsList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await api.get('/public/vendors');
        if (response.data.success) {
          setVendors(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch public vendors", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 style={{ marginBottom: '30px' }}>Trusted Vendors</h1>
      
      {loading ? (
        <p>Loading vendors...</p>
      ) : vendors.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {vendors.map((vendor) => (
            <Link to={`/vendors/${vendor.slug || vendor._id}`} key={vendor._id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="glass-card" style={{ padding: '20px', transition: 'transform 0.3s', cursor: 'pointer' }}>
                <h3 style={{ marginBottom: '10px' }}>{vendor.name}</h3>
                <p style={{ color: 'var(--text-light)', marginBottom: '5px' }}>{vendor.category}</p>
                <p style={{ color: 'var(--text-light)', marginBottom: '10px' }}>
                  {vendor.address?.city || 'Location N/A'}
                </p>
                <p style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  Price: ${vendor.price?.amount} / {vendor.price?.unit}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '40px', marginTop: '20px', textAlign: 'center' }}>
          <p>No vendors available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default VendorsList;
