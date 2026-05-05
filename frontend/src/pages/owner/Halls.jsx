import React from 'react';

const Halls = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>My Halls</h1>
        <button className="btn-primary">+ Add New Hall</button>
      </div>
      <div className="glass-card" style={{ padding: '20px' }}>
        <p>No halls added yet. Click the button above to add one.</p>
      </div>
    </div>
  );
};

export default Halls;
