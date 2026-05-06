import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Home, Users, MessageSquare, User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { logoutOwner } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutOwner();
    navigate('/owner/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>Owner<span className="text-primary">Portal</span></span>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/owner/dashboard" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/owner/halls" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <Home size={20} /> My Halls
        </NavLink>
        <NavLink to="/owner/vendors" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <Users size={20} /> Vendors
        </NavLink>
        <NavLink to="/owner/customers" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <Users size={20} /> Customers
        </NavLink>
        <NavLink to="/owner/queries" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <MessageSquare size={20} /> Queries
        </NavLink>
        <NavLink to="/owner/profile" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <User size={20} /> Profile
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <button className="sidebar-link text-danger" onClick={handleLogout}>
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
