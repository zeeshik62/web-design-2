import React from 'react';
import { useParams } from 'react-router-dom';

const VendorDetail = () => {
  const { id } = useParams();
  
  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>Vendor Detail: {id}</h1>
      <div className="glass-card" style={{ padding: '40px', marginTop: '20px' }}>
        <p>Vendor details will be loaded here.</p>
      </div>
    </div>
  );
};

export default VendorDetail;
