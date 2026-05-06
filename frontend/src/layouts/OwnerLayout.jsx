import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import './OwnerLayout.css';

const OwnerLayout = () => {
  const { owner } = useContext(AuthContext);
  const displayName = owner?.brand_name || owner?.name || 'Owner';

  return (
    <div className="owner-layout">
      <Sidebar />
      <div className="owner-content">
        <header className="owner-header glass">
          <h2>Dashboard</h2>
          <div className="user-profile">
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '15px', color: 'white' }}>
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontWeight: '600', fontSize: '14px' }}>{displayName}</span>
          </div>
        </header>
        <main className="owner-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;
