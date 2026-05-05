import React from 'react';

const Vendors = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>My Vendors</h1>
        <button className="btn-primary">+ Add New Vendor</button>
      </div>
      <div className="glass-card" style={{ padding: '20px' }}>
        <p>No vendors added yet. Click the button above to add one.</p>
      </div>
    </div>
  );
};

export default Vendors;
