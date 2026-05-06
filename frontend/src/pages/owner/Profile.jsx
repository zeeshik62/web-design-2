import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { CheckCircle, User } from 'lucide-react';

const inputStyle = {
  width: '100%', padding: '10px 13px', borderRadius: '8px',
  border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.07)',
  color: 'var(--text-color)', fontSize: '14px'
};

const Profile = () => {
  const [form, setForm] = useState({
    name: '', brand_name: '', contact: '',
    street_address: '', city: '', country: '', is_public: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/hall_owner/profile');
        if (res.data.success) {
          const d = res.data.data;
          setForm({
            name: d.name || '',
            brand_name: d.brand_name || '',
            contact: d.contact || '',
            street_address: d.address?.street_address || '',
            city: d.address?.city || '',
            country: d.address?.country || '',
            is_public: d.is_public !== undefined ? d.is_public : true,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        name: form.name,
        brand_name: form.brand_name,
        contact: form.contact,
        is_public: form.is_public,
        address: {
          street_address: form.street_address,
          city: form.city,
          country: form.country,
        }
      };
      const res = await api.put('/hall_owner/profile', payload);
      if (res.data.success) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading profile...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>My Profile</h1>

      <div className="glass-card" style={{ padding: '36px', maxWidth: '640px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={28} color="white" />
          </div>
          <div>
            <h3 style={{ margin: 0 }}>{form.brand_name || form.name}</h3>
            <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '14px' }}>Hall Owner Account</p>
          </div>
        </div>

        {error && <div style={{ color: '#f87171', marginBottom: '18px', padding: '10px 14px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)' }}>{error}</div>}
        {success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4ade80', marginBottom: '18px', padding: '10px 14px', borderRadius: '6px', background: 'rgba(74,222,128,0.1)' }}>
            <CheckCircle size={18} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Full Name</label>
              <input style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your full name" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Brand / Business Name</label>
              <input style={inputStyle} value={form.brand_name} onChange={e => setForm(p => ({ ...p, brand_name: e.target.value }))} placeholder="Your business name" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Contact Number</label>
              <input style={inputStyle} value={form.contact} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))} placeholder="+44 7000 000000" />
            </div>
            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '18px', marginTop: '4px' }}>
              <h4 style={{ marginBottom: '16px', fontSize: '14px' }}>📍 Business Address</h4>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Street Address</label>
              <input style={inputStyle} value={form.street_address} onChange={e => setForm(p => ({ ...p, street_address: e.target.value }))} placeholder="e.g. 12 High Street" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>City</label>
              <input style={inputStyle} value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} placeholder="e.g. London" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Country</label>
              <input style={inputStyle} value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} placeholder="e.g. United Kingdom" />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '18px', marginTop: '4px' }}>
              <input type="checkbox" id="profile_is_public" checked={form.is_public} onChange={e => setForm(p => ({ ...p, is_public: e.target.checked }))} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              <label htmlFor="profile_is_public" style={{ cursor: 'pointer', fontSize: '14px' }}>Make profile publicly visible in discovery</label>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '24px', padding: '12px', fontSize: '15px' }} disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
