import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { Home, List, Users, LogIn } from 'lucide-react';

const Navbar = () => {
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
        <div className="navbar-actions">
          <Link to="/login" className="btn-secondary">Login</Link>
          <Link to="/register" className="btn-primary">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
