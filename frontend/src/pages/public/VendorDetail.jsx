import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { ChevronLeft, ChevronRight, X, MapPin, CheckCircle, Tag, Users } from 'lucide-react';

const VendorDetail = () => {
  const { id } = useParams(); // This is the slug
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Slider state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [queryDate, setQueryDate] = useState('');
  const [queryDescription, setQueryDescription] = useState('');
  const [querySubmitting, setQuerySubmitting] = useState(false);
  const [querySuccess, setQuerySuccess] = useState('');
  const [queryError, setQueryError] = useState('');

  const fallbackImage = "http://localhost:5000/uploads/vendor/default-vendor.png";

  // Tomorrow's date as the minimum selectable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await api.get(`/public/vendors/${id}`);
        if (response.data.success) {
          setVendor(response.data.data);
        }
      } catch (err) {
        setError('Failed to load vendor details.');
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [id]);

  const getImageUrl = (imageName) => {
    if (!imageName) return fallbackImage;
    if (imageName.startsWith('http')) return imageName;
    if (imageName.startsWith('/')) return `http://localhost:5000${imageName}`;
    return `http://localhost:5000/uploads/vendor/${imageName}`;
  };

  const images = vendor?.images?.length > 0 ? vendor.images : [null];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAskQueryClick = () => {
    setShowModal(true);
    setQuerySuccess('');
    setQueryError('');
  };

  const submitQuery = async (e) => {
    e.preventDefault();
    if (!user) return;
    setQuerySubmitting(true);
    setQueryError('');
    try {
      const response = await api.post('/customer/vendor-queries', {
        vendor_slug: vendor.slug,
        description: queryDescription,
        date: queryDate
      });
      if (response.data.success) {
        setQuerySuccess('Your query has been sent to the vendor owner successfully!');
        setQueryDescription('');
        setQueryDate('');
      }
    } catch (err) {
      setQueryError(err.response?.data?.message || 'Failed to submit query.');
    } finally {
      setQuerySubmitting(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>Loading...</div>;
  if (error || !vendor) return <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>{error || 'Vendor not found'}</div>;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Top Section: Slider (Left) and Details (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', marginBottom: '40px' }}>
        
        {/* Left Side: Image Slider */}
        <div className="glass-card" style={{ position: 'relative', overflow: 'hidden', height: '400px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img 
            src={getImageUrl(images[currentImageIndex])} 
            alt={`${vendor.vendor_name} - ${currentImageIndex + 1}`}
            onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          
          {images.length > 1 && (
            <>
              <button onClick={prevImage} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextImage} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ChevronRight size={24} />
              </button>
              <div style={{ position: 'absolute', bottom: '15px', display: 'flex', gap: '8px' }}>
                {images.map((_, idx) => (
                  <div key={idx} style={{ width: '10px', height: '10px', borderRadius: '50%', background: currentImageIndex === idx ? 'white' : 'rgba(255,255,255,0.5)' }} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Side: Details & Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h1 style={{ marginBottom: '10px' }}>{vendor.vendor_name}</h1>
            <p style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '5px' }}>{vendor.category}</p>
            <p style={{ color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={16} /> {vendor.address?.street_address}, {vendor.address?.city}, {vendor.address?.country}
            </p>
          </div>

          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '30px' }}>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '5px' }}><Tag size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />Category</p>
                <p style={{ fontWeight: 'bold', fontSize: '16px' }}>{vendor.category}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '5px' }}><Users size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />Staff</p>
                <p style={{ fontWeight: 'bold', fontSize: '16px' }}>{vendor.staff}</p>
              </div>
            </div>
            
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '5px' }}>Starting Price</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <h2 style={{ color: 'var(--primary-color)', margin: 0 }}>${vendor.starting_price}</h2>
                {vendor.discount > 0 && <span style={{ background: 'green', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{vendor.discount}% OFF</span>}
              </div>
            </div>

            {vendor.instructions && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Instructions / Notes</p>
                <p style={{ fontSize: '14px', color: 'var(--text-light)', lineHeight: '1.5' }}>{vendor.instructions}</p>
              </div>
            )}
          </div>

          <button onClick={handleAskQueryClick} className="btn-primary" style={{ padding: '15px', fontSize: '16px', fontWeight: 'bold' }}>
            Ask Query / Request Booking
          </button>

          {vendor.vendor_id?.contact && (
            <a
              href={`https://wa.me/${vendor.vendor_id.contact.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '15px', borderRadius: '8px', background: '#25D366', color: 'white', fontWeight: 'bold', fontSize: '16px', textDecoration: 'none' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Contact on WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* Query Modal Overlay */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-card" style={{ background: 'var(--bg-color)', width: '100%', maxWidth: '500px', padding: '30px', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'var(--text-color)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            
            <h2 style={{ marginBottom: '20px' }}>Ask a Query</h2>

            {!user ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <p style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Please log in to submit a booking query.</p>
                <Link to="/login" state={{ returnUrl: location.pathname }} className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                  Login to Continue
                </Link>
              </div>
            ) : querySuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle size={48} color="green" style={{ marginBottom: '15px' }} />
                <p style={{ color: 'green', fontSize: '1.1rem', marginBottom: '20px' }}>{querySuccess}</p>
                <button onClick={() => setShowModal(false)} className="btn-secondary">Close</button>
              </div>
            ) : (
              <form onSubmit={submitQuery}>
                {queryError && <div style={{ color: 'red', marginBottom: '15px' }}>{queryError}</div>}
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Booking Date (Optional)</label>
                  <input 
                    type="date" 
                    value={queryDate}
                    onChange={(e) => setQueryDate(e.target.value)}
                    min={minDate}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-color)' }} 
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Your Query / Message <span style={{color:'red'}}>*</span></label>
                  <textarea 
                    value={queryDescription}
                    onChange={(e) => setQueryDescription(e.target.value)}
                    placeholder="E.g. I am interested in booking your services..."
                    required
                    rows="4"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-color)', resize: 'vertical' }} 
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={querySubmitting}>
                  {querySubmitting ? 'Sending...' : 'Send Query'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDetail;
