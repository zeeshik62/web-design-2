import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './OwnerLayout.css';

const OwnerLayout = () => {
  return (
    <div className="owner-layout">
      <Sidebar />
      <div className="owner-content">
        <header className="owner-header glass">
          <h2>Dashboard</h2>
          <div className="user-profile">
            <span>Owner</span>
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
