import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Find the Perfect <span className="text-primary">Venue</span> for Your Dream Event
            </h1>
            <p className="hero-subtitle">
              Discover and book the best halls, banquets, and vendors in your city with HallMaster.
            </p>
            <div className="hero-actions">
              <Link to="/halls" className="btn-primary btn-large">Browse Halls</Link>
              <Link to="/vendors" className="btn-secondary btn-large">Find Vendors</Link>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <div className="glass-card hero-image-card">
              {/* Placeholder for an awesome image or animation */}
              <div className="placeholder-image"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section container">
        <h2 className="section-title">Why Choose HallMaster?</h2>
        <div className="features-grid">
          <div className="glass-card feature-card">
            <div className="feature-icon">🏛️</div>
            <h3>Premium Venues</h3>
            <p>Access to top-rated banquets and halls verified by our team.</p>
          </div>
          <div className="glass-card feature-card">
            <div className="feature-icon">🍽️</div>
            <h3>Top Vendors</h3>
            <p>Connect with the best caterers, decorators, and photographers.</p>
          </div>
          <div className="glass-card feature-card">
            <div className="feature-icon">✨</div>
            <h3>Easy Booking</h3>
            <p>Seamless online booking and transparent pricing without hidden fees.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
