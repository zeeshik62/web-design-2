import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Extract returnUrl from state if it was passed
  const returnUrl = location.state?.returnUrl || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/customer/auth/login', { email, password });
      if (response.data.success) {
        // Save token and user data in AuthContext
        login(response.data.token, response.data.data);
        // Redirect to previous page or homepage
        navigate(returnUrl);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-card" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>User Login</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} 
            />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Don't have an account? <Link to="/register" className="text-primary">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
