import React from 'react';
import { useParams } from 'react-router-dom';

const HallDetail = () => {
  const { id } = useParams();
  
  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>Hall Detail: {id}</h1>
      <div className="glass-card" style={{ padding: '40px', marginTop: '20px' }}>
        <p>Hall details will be loaded here.</p>
      </div>
    </div>
  );
};

export default HallDetail;
