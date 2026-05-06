import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const OwnerRegister = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    brand_name: '',
    email: '',
    password: '',
    contact: '',
    street_address: '',
    city: '',
    country: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        brand_name: formData.brand_name,
        email: formData.email,
        password: formData.password,
        contact: formData.contact,
        address: {
          street_address: formData.street_address,
          city: formData.city,
          country: formData.country
        }
      };

      const response = await api.post('/auth/register', payload);
      if (response.data.success) {
        // Redirect to verify page with email
        navigate('/owner/verify', { state: { email: formData.email } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-color)', padding: '40px 20px' }}>
      <div className="glass-card" style={{ padding: '40px', width: '100%', maxWidth: '600px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2>Owner Registration</h2>
          <p style={{ color: 'var(--text-light)' }}>Create an account to list halls and vendors</p>
        </div>
        
        {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleRegister}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Brand Name</label>
              <input type="text" name="brand_name" value={formData.brand_name} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Contact Number</label>
              <input type="text" name="contact" value={formData.contact} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Street Address</label>
            <input type="text" name="street_address" value={formData.street_address} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Country</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Already have an account? <Link to="/owner/login" className="text-primary">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default OwnerRegister;
