import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const Queries = () => {
  const [hallQueries, setHallQueries] = useState([]);
  const [vendorQueries, setVendorQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const [hallRes, vendorRes] = await Promise.all([
          api.get('/hall_owner/enquiries'),
          api.get('/hall_owner/vendor-enquiries')
        ]);
        
        if (hallRes.data.success) setHallQueries(hallRes.data.data);
        if (vendorRes.data.success) setVendorQueries(vendorRes.data.data);
      } catch (error) {
        console.error("Failed to fetch queries", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQueries();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Queries & Bookings</h1>
      
      {loading ? (
        <p>Loading queries...</p>
      ) : (
        <div style={{ display: 'grid', gap: '30px' }}>
          <div>
            <h2 style={{ marginBottom: '15px' }}>Hall Queries</h2>
            {hallQueries.length > 0 ? (
              <div style={{ display: 'grid', gap: '15px' }}>
                {hallQueries.map((query) => (
                  <div key={query._id} className="glass-card" style={{ padding: '20px' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{query.name} - {query.email}</p>
                    <p style={{ color: 'var(--text-light)', marginBottom: '5px' }}>{query.contact}</p>
                    <p>Status: <span style={{ fontWeight: 'bold' }}>{query.status}</span></p>
                    {query.message && <p style={{ marginTop: '10px', fontStyle: 'italic' }}>"{query.message}"</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card" style={{ padding: '20px' }}>
                <p>No hall queries yet.</p>
              </div>
            )}
          </div>

          <div>
            <h2 style={{ marginBottom: '15px' }}>Vendor Queries</h2>
            {vendorQueries.length > 0 ? (
              <div style={{ display: 'grid', gap: '15px' }}>
                {vendorQueries.map((query) => (
                  <div key={query._id} className="glass-card" style={{ padding: '20px' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{query.name} - {query.email}</p>
                    <p style={{ color: 'var(--text-light)', marginBottom: '5px' }}>{query.contact}</p>
                    <p>Status: <span style={{ fontWeight: 'bold' }}>{query.status}</span></p>
                    {query.message && <p style={{ marginTop: '10px', fontStyle: 'italic' }}>"{query.message}"</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card" style={{ padding: '20px' }}>
                <p>No vendor queries yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Queries;
