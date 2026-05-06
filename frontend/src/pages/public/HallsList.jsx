import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Search, Filter } from 'lucide-react';

const HallsList = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    type: '',
    has_discount: '',
    min_price: '',
    max_price: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  const fetchHalls = async () => {
    setLoading(true);
    try {
      // Build query string from filters
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.city) params.append('city', filters.city);
      if (filters.type) params.append('type', filters.type);
      if (filters.has_discount) params.append('has_discount', filters.has_discount);
      if (filters.min_price) params.append('min_price', filters.min_price);
      if (filters.max_price) params.append('max_price', filters.max_price);

      const response = await api.get(`/public/subhalls?${params.toString()}`);
      if (response.data.success) {
        setHalls(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch public halls", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHalls();
  }, [filters]); // Re-fetch when filters change (you could debounce the search for better performance)

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', city: '', type: '', has_discount: '', min_price: '', max_price: '' });
  };

  // Use the newly generated default hall image stored in the backend
  const fallbackImage = "http://localhost:5000/uploads/subhall/default-hall.png";

  const getImageUrl = (imageName) => {
    if (!imageName) return fallbackImage;
    if (imageName.startsWith('http')) return imageName;
    if (imageName.startsWith('/')) return `http://localhost:5000${imageName}`;
    return `http://localhost:5000/uploads/subhall/${imageName}`;
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Top Header & Main Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ margin: 0 }}>Available Halls</h1>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: '1 1 auto', justifyContent: 'flex-end' }}>
          {/* Always Visible: Search Name */}
          <div style={{ position: 'relative', flex: '0 1 250px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#888' }} />
            <input 
              type="text" 
              name="search" 
              value={filters.search} 
              onChange={handleFilterChange} 
              placeholder="Search hall name..."
              style={{ width: '100%', padding: '8px 10px 8px 32px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.8)', color: '#333' }}
            />
          </div>
          
          {/* Always Visible: City */}
          <div style={{ flex: '0 1 200px' }}>
            <input 
              type="text" 
              name="city" 
              value={filters.city} 
              onChange={handleFilterChange} 
              placeholder="Filter by city..."
              style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.8)', color: '#333' }}
            />
          </div>

          <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px' }}>
            <Filter size={18} /> More Filters
          </button>
        </div>
      </div>

      {/* Advanced Filters Section */}
      {showFilters && (
        <div className="glass-card" style={{ padding: '20px', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 150px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Type</label>
              <select name="type" value={filters.type} onChange={handleFilterChange} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.8)', color: '#333' }}>
                <option value="" style={{ color: 'black' }}>All Types</option>
                <option value="Marquee" style={{ color: 'black' }}>Marquee</option>
                <option value="Banquet Hall" style={{ color: 'black' }}>Banquet Hall</option>
                <option value="Open Roof" style={{ color: 'black' }}>Open Roof</option>
                <option value="Conference Room" style={{ color: 'black' }}>Conference Room</option>
                <option value="Other" style={{ color: 'black' }}>Other</option>
              </select>
            </div>
            <div style={{ flex: '1 1 120px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Discount</label>
              <select name="has_discount" value={filters.has_discount} onChange={handleFilterChange} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.8)', color: '#333' }}>
                <option value="" style={{ color: 'black' }}>Any</option>
                <option value="true" style={{ color: 'black' }}>Has Discount</option>
                <option value="false" style={{ color: 'black' }}>No Discount</option>
              </select>
            </div>
            <div style={{ flex: '1 1 120px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Min Price</label>
              <input 
                type="number" 
                name="min_price" 
                value={filters.min_price} 
                onChange={handleFilterChange} 
                placeholder="$"
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.8)', color: '#333' }}
              />
            </div>
            <div style={{ flex: '1 1 120px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Max Price</label>
              <input 
                type="number" 
                name="max_price" 
                value={filters.max_price} 
                onChange={handleFilterChange} 
                placeholder="$"
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.8)', color: '#333' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={clearFilters} className="btn-secondary" style={{ padding: '8px 15px' }}>Clear All</button>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <p>Loading halls...</p>
      ) : halls.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px' }}>
          {halls.map((hall) => (
            <Link to={`/halls/${hall.slug || hall._id}`} key={hall._id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="glass-card" style={{ transition: 'transform 0.3s', cursor: 'pointer', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', fontSize: '14px' }}>
                {/* Image Section - Smaller height */}
                <div style={{ width: '100%', height: '180px', overflow: 'hidden' }}>
                  <img 
                    src={hall.images && hall.images.length > 0 ? getImageUrl(hall.images[0]) : fallbackImage} 
                    alt={hall.subhall_name} 
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = fallbackImage;
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                
                {/* Content Section - Adjusted padding */}
                <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ marginBottom: '8px', fontSize: '1.2rem' }}>{hall.subhall_name}</h3>
                  <div style={{ color: 'var(--text-light)', marginBottom: '10px', fontSize: '13px', flexGrow: 1 }}>
                    <p style={{ marginBottom: '4px' }}>Type: {hall.type}</p>
                    <p style={{ marginBottom: '4px' }}>Capacity: {hall.sitting_capacity} persons</p>
                    <p style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                      Starting Price: ${hall.starting_price}
                    </p>
                    {hall.discount > 0 && (
                      <p style={{ color: 'green', fontWeight: 'bold', fontSize: '12px', marginTop: '4px' }}>
                        {hall.discount}% OFF
                      </p>
                    )}
                  </div>
                  
                  {/* Address at the bottom */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', marginTop: 'auto' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: 0 }}>
                      📍 {hall.address?.street_address}, {hall.address?.city}, {hall.address?.country}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '40px', marginTop: '20px', textAlign: 'center' }}>
          <p>No halls match your filters.</p>
        </div>
      )}
    </div>
  );
};

export default HallsList;
