import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h3>HallMaster</h3>
          <p>Book the perfect venue for your next event.</p>
        </div>
        <div className="footer-section">
          <h4>Links</h4>
          <ul>
            <li><a href="/halls">Halls</a></li>
            <li><a href="/vendors">Vendors</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Admin</h4>
          <ul>
            <li><a href="/owner/login">Owner Portal</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} HallMaster. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
