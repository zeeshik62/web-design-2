import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await api.get('/hall_owner/vendors');
        if (response.data.success) {
          setVendors(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch vendors", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>My Vendors</h1>
        <button className="btn-primary">+ Add New Vendor</button>
      </div>
      
      {loading ? (
        <p>Loading vendors...</p>
      ) : vendors.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {vendors.map((vendor) => (
            <div key={vendor._id} className="glass-card" style={{ padding: '20px' }}>
              <h3 style={{ marginBottom: '10px' }}>{vendor.name}</h3>
              <p style={{ color: 'var(--text-light)', marginBottom: '5px' }}>{vendor.category}</p>
              <p style={{ color: 'var(--text-light)', marginBottom: '10px' }}>
                {vendor.address?.city || 'Location N/A'}
              </p>
              <p style={{ fontWeight: 'bold' }}>Price: ${vendor.price?.amount} / {vendor.price?.unit}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '20px' }}>
          <p>No vendors added yet. Click the button above to add one.</p>
        </div>
      )}
    </div>
  );
};

export default Vendors;
