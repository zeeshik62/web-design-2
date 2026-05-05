import React from 'react';

const Profile = () => {
  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>My Profile</h1>
      <div className="glass-card" style={{ padding: '40px', maxWidth: '600px' }}>
        <form>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Business Name</label>
            <input type="text" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
            <input type="email" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>
          <button type="button" className="btn-primary">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
