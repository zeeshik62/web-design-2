import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { CheckCircle, Camera, ImagePlus, X } from 'lucide-react';

const inputStyle = {
  width: '100%', padding: '10px 13px', borderRadius: '8px',
  border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.07)',
  color: 'var(--text-color)', fontSize: '14px'
};

const API_BASE = 'http://localhost:5000'; // backend origin for image paths

const Profile = () => {
  const [form, setForm] = useState({
    name: '', brand_name: '', contact: '',
    street_address: '', city: '', country: '',
  });
  const [currentImage, setCurrentImage] = useState('');
  const [currentCover, setCurrentCover] = useState('');
  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Visibility toggle state
  const [allPublic, setAllPublic] = useState(true);
  const [visibilityUpdating, setVisibilityUpdating] = useState(false);

  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

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
          });
          setCurrentImage(d.image || '');
          setCurrentCover(d.cover_image || '');
          setAllPublic(d.is_public !== false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Upload a single file to /hall_owner/upload/:type, return path
  const uploadFile = async (file, type) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post(`/hall_owner/upload/${type}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.data.path;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      let imagePath = currentImage;
      let coverPath = currentCover;

      if (profileFile) imagePath = await uploadFile(profileFile, 'hall_owner_profile');
      if (coverFile) coverPath = await uploadFile(coverFile, 'hall_owner_profile');

      const payload = {
        name: form.name,
        brand_name: form.brand_name,
        contact: form.contact,
        image: imagePath,
        cover_image: coverPath,
        address: {
          street_address: form.street_address,
          city: form.city,
          country: form.country,
        }
      };
      const res = await api.put('/hall_owner/profile', payload);
      if (res.data.success) {
        setSuccess('Profile updated successfully!');
        setProfileFile(null);
        setCoverFile(null);
        if (imagePath) setCurrentImage(imagePath);
        if (coverPath) setCurrentCover(coverPath);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  // Toggle ALL subhalls and vendors public/private
  const handleVisibilityToggle = async (makePublic) => {
    setVisibilityUpdating(true);
    setError('');
    try {
      // Get all subhalls and vendors, toggle those whose current state differs
      const [hallsRes, vendorsRes] = await Promise.all([
        api.get('/hall_owner/subhalls?limit=100'),
        api.get('/hall_owner/vendors?limit=100'),
      ]);
      const halls = hallsRes.data.data || [];
      const vendors = vendorsRes.data.data || [];

      const hallsToToggle = halls.filter(h => h.is_public !== makePublic);
      const vendorsToToggle = vendors.filter(v => v.is_public !== makePublic);

      await Promise.all([
        ...hallsToToggle.map(h => api.patch(`/hall_owner/subhalls/${h._id}/toggle-public`)),
        ...vendorsToToggle.map(v => api.patch(`/hall_owner/vendors/${v._id}/toggle-public`)),
      ]);

      setAllPublic(makePublic);
      setSuccess(`All halls and vendors are now ${makePublic ? 'public' : 'private'}.`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update visibility. Please try again.');
    } finally {
      setVisibilityUpdating(false);
    }
  };

  const imgSrc = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_BASE}${path}`;
  };

  const profilePreview = profileFile ? URL.createObjectURL(profileFile) : imgSrc(currentImage);
  const coverPreview = coverFile ? URL.createObjectURL(coverFile) : imgSrc(currentCover);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading profile...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>My Profile</h1>

      {error && <div style={{ color: '#f87171', marginBottom: '16px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)' }}>{error}</div>}
      {success && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4ade80', marginBottom: '16px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(74,222,128,0.1)' }}>
          <CheckCircle size={18} /> {success}
        </div>
      )}

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden', maxWidth: '700px' }}>

        {/* Cover Image */}
        <div
          style={{ position: 'relative', height: '180px', background: coverPreview ? 'none' : 'linear-gradient(135deg, var(--primary-color) 0%, #6366f1 100%)', cursor: 'pointer', overflow: 'hidden' }}
          onClick={() => coverInputRef.current?.click()}
        >
          {coverPreview && <img src={coverPreview} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', opacity: 0, transition: '0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'white' }}>
              <ImagePlus size={28} />
              <span style={{ fontSize: '13px' }}>Change Cover</span>
            </div>
          </div>
          <input ref={coverInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) setCoverFile(e.target.files[0]); }} />
        </div>

        {/* Profile Avatar */}
        <div style={{ padding: '0 30px', marginTop: '-44px', marginBottom: '8px' }}>
          <div
            style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', border: '3px solid var(--bg-color)', overflow: 'hidden', background: 'var(--primary-color)', cursor: 'pointer' }}
            onClick={() => profileInputRef.current?.click()}
          >
            {profilePreview
              ? <img src={profilePreview} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700', color: 'white' }}>
                  {form.brand_name?.charAt(0)?.toUpperCase() || form.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
            }
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0}
            >
              <Camera size={18} color="white" />
            </div>
            <input ref={profileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) setProfileFile(e.target.files[0]); }} />
          </div>
        </div>

        {/* Name + Role — clearly below the cover */}
        <div style={{ padding: '4px 30px 20px' }}>
          <h3 style={{ margin: '0 0 2px' }}>{form.brand_name || form.name}</h3>
          <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '13px' }}>Hall Owner Account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '0 30px 30px' }}>
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

            {/* Address Section */}
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

            {/* Visibility Section */}
            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '18px', marginTop: '4px' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '14px' }}>👁️ Listings Visibility</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '16px' }}>
                Toggle the visibility of <strong>all your subhalls and vendors</strong> at once.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  disabled={visibilityUpdating}
                  onClick={() => handleVisibilityToggle(true)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `2px solid ${allPublic ? 'var(--primary-color)' : 'rgba(255,255,255,0.15)'}`, background: allPublic ? 'rgba(var(--primary-rgb),0.15)' : 'transparent', color: 'var(--text-color)', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: '0.2s' }}
                >
                  🟢 Make All Public
                </button>
                <button
                  type="button"
                  disabled={visibilityUpdating}
                  onClick={() => handleVisibilityToggle(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `2px solid ${!allPublic ? '#f87171' : 'rgba(255,255,255,0.15)'}`, background: !allPublic ? 'rgba(239,68,68,0.15)' : 'transparent', color: 'var(--text-color)', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: '0.2s' }}
                >
                  🔴 Make All Private
                </button>
              </div>
              {visibilityUpdating && <p style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '8px' }}>Updating visibility...</p>}
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '24px', padding: '13px', fontSize: '15px' }} disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
