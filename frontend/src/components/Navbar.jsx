import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { Home, List, Users, LogOut, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <span>Hall<span className="text-primary">Master</span></span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link"><Home size={18} /> Home</Link>
          <Link to="/halls" className="nav-link"><List size={18} /> Halls</Link>
          <Link to="/vendors" className="nav-link"><Users size={18} /> Vendors</Link>
        </div>
        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {user?.role === 'owner' ? (
            <Link to="/owner/dashboard" className="nav-link" style={{ fontWeight: 'bold', border: '1px solid var(--primary-color)', padding: '6px 12px', borderRadius: '6px', color: 'var(--primary-color)' }}>
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/owner/login" className="nav-link" style={{ fontWeight: 'bold', border: '1px solid var(--primary-color)', padding: '6px 12px', borderRadius: '6px', color: 'var(--primary-color)' }}>
              List Business
            </Link>
          )}
          
          {user && user.role === 'customer' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                <User size={18} /> {user.name}
              </span>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger-color, #dc3545)', display: 'flex', alignItems: 'center' }} title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          ) : !user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </div>
          ) : user.role === 'owner' ? (
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger-color, #dc3545)', display: 'flex', alignItems: 'center' }} title="Logout Owner">
              <LogOut size={20} />
            </button>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
