import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { Trash2, Eye, EyeOff, Pencil, X, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';

const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.07)', color: 'var(--text-color)', fontSize: '14px' };

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

  // Edit Modal State
  const [editingVendor, setEditingVendor] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  // Add New Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const emptyForm = { vendor_name: '', category: 'Caterer', staff: 'Both', starting_price: '', discount: '', instructions: '', street_address: '', city: '', country: 'United Kingdom', is_public: true };
  const [addForm, setAddForm] = useState(emptyForm);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');
  const [addImages, setAddImages] = useState([]);

  // Upload images to backend, returns array of URL paths
  const uploadImages = async (files, type) => {
    const paths = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post(`/hall_owner/upload/${type}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) paths.push(res.data.data.path);
    }
    return paths;
  };

  // Confirm Delete State
  const [deletingId, setDeletingId] = useState(null);

  const fetchVendors = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/hall_owner/vendors?page=${page}&limit=${pagination.limit}`);
      if (response.data.success) {
        setVendors(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch vendors", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  useEffect(() => { fetchVendors(1); }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/hall_owner/vendors/${id}`);
      fetchVendors(pagination.page);
      setDeletingId(null);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleTogglePublic = async (id) => {
    try {
      const response = await api.patch(`/hall_owner/vendors/${id}/toggle-public`);
      if (response.data.success) {
        setVendors(prev => prev.map(v => v._id === id ? { ...v, is_public: !v.is_public } : v));
      }
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  const openEditModal = (vendor) => {
    setEditingVendor(vendor);
    setEditForm({
      vendor_name: vendor.vendor_name,
      category: vendor.category,
      staff: vendor.staff,
      starting_price: vendor.starting_price,
      discount: vendor.discount || '',
      instructions: vendor.instructions || '',
      street_address: vendor.address?.street_address || '',
      city: vendor.address?.city || '',
      country: vendor.address?.country || '',
    });
    setEditError('');
    setEditSuccess('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      const payload = {
        vendor_name: editForm.vendor_name,
        category: editForm.category,
        staff: editForm.staff,
        starting_price: Number(editForm.starting_price),
        discount: editForm.discount !== '' ? Number(editForm.discount) : null,
        instructions: editForm.instructions,
        address: {
          street_address: editForm.street_address,
          city: editForm.city,
          country: editForm.country,
        }
      };
      const res = await api.put(`/hall_owner/vendors/${editingVendor._id}`, payload);
      if (res.data.success) {
        setEditSuccess('Vendor updated successfully!');
        fetchVendors(pagination.page);
        setTimeout(() => { setEditingVendor(null); setEditSuccess(''); }, 1200);
      }
    } catch (err) {
      setEditError(err.response?.data?.message || 'Update failed.');
    } finally {
      setEditLoading(false);
    }
  };

  const CATEGORIES = ['Caterer', 'Photographer', 'Decorator', 'DJ', 'Live Band', 'Event Planner', 'Make-up Artist'];
  const STAFF_OPTIONS = ['Male', 'Female', 'Both'];

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    try {
      const payload = {
        vendor_name: addForm.vendor_name,
        category: addForm.category,
        staff: addForm.staff,
        starting_price: Number(addForm.starting_price),
        discount: addForm.discount !== '' ? Number(addForm.discount) : null,
        instructions: addForm.instructions,
        is_public: addForm.is_public,
        address: {
          street_address: addForm.street_address,
          city: addForm.city,
          country: addForm.country,
        }
      };
      // Upload images first, then attach their paths
      if (addImages.length > 0) {
        const uploadedPaths = await uploadImages(addImages, 'vendor');
        payload.images = uploadedPaths;
      }
      const res = await api.post('/hall_owner/vendors', payload);
      if (res.data.success) {
        setAddSuccess('Vendor created successfully!');
        fetchVendors(1);
        setTimeout(() => { setShowAddModal(false); setAddForm(emptyForm); setAddImages([]); setAddSuccess(''); }, 1200);
      }
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to create Vendor.');
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>My Vendors</h1>
        <button className="btn-primary" onClick={() => { setShowAddModal(true); setAddForm(emptyForm); setAddImages([]); setAddError(''); setAddSuccess(''); }}>+ Add New Vendor</button>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <p style={{ padding: '30px', textAlign: 'center' }}>Loading...</p>
        ) : vendors.length === 0 ? (
          <p style={{ padding: '30px', textAlign: 'center' }}>No Vendors found.</p>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}>
                    {['#', 'Name', 'Category', 'Staff', 'Price', 'Discount', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor, idx) => (
                    <tr key={vendor._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '12px 16px', color: 'var(--text-light)' }}>{(pagination.page - 1) * pagination.limit + idx + 1}</td>
                      <td style={{ padding: '12px 16px', fontWeight: '500' }}>{vendor.vendor_name}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-light)' }}>{vendor.category}</td>
                      <td style={{ padding: '12px 16px' }}>{vendor.staff}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 'bold', color: 'var(--primary-color)' }}>${vendor.starting_price}</td>
                      <td style={{ padding: '12px 16px' }}>
                        {vendor.discount > 0 ? <span style={{ background: 'green', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>{vendor.discount}%</span> : <span style={{ color: 'var(--text-light)' }}>—</span>}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', background: vendor.is_public ? 'rgba(0,200,0,0.15)' : 'rgba(200,0,0,0.15)', color: vendor.is_public ? '#4ade80' : '#f87171' }}>
                          {vendor.is_public ? 'Public' : 'Private'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button onClick={() => openEditModal(vendor)} title="Edit" style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: 'var(--primary-color)', display: 'flex', alignItems: 'center' }}>
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => handleTogglePublic(vendor._id)} title={vendor.is_public ? 'Make Private' : 'Make Public'} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: vendor.is_public ? '#4ade80' : '#facc15', display: 'flex', alignItems: 'center' }}>
                            {vendor.is_public ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                          <button onClick={() => setDeletingId(vendor._id)} title="Delete" style={{ background: 'rgba(255,0,0,0.1)', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#f87171', display: 'flex', alignItems: 'center' }}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>
                  Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => fetchVendors(pagination.page - 1)} disabled={pagination.page <= 1} className="btn-secondary" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <button onClick={() => fetchVendors(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} className="btn-secondary" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deletingId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-card" style={{ maxWidth: '400px', width: '100%', padding: '30px', textAlign: 'center' }}>
            <Trash2 size={40} color="#f87171" style={{ marginBottom: '15px' }} />
            <h3 style={{ marginBottom: '10px' }}>Delete Vendor?</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '25px' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setDeletingId(null)} className="btn-secondary">Cancel</button>
              <button onClick={() => handleDelete(deletingId)} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingVendor && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', overflowY: 'auto' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '30px', position: 'relative', margin: 'auto' }}>
            <button onClick={() => setEditingVendor(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-color)' }}>
              <X size={22} />
            </button>
            <h2 style={{ marginBottom: '20px' }}>Edit Vendor</h2>

            {editError && <div style={{ color: '#f87171', marginBottom: '15px', padding: '10px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)' }}>{editError}</div>}
            {editSuccess && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <CheckCircle size={40} color="green" /><p style={{ color: 'green', marginTop: '10px' }}>{editSuccess}</p>
              </div>
            )}

            {!editSuccess && (
              <form onSubmit={handleEditSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Vendor Name</label>
                    <input style={inputStyle} value={editForm.vendor_name} onChange={e => setEditForm(p => ({ ...p, vendor_name: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Category</label>
                    <select style={inputStyle} value={editForm.category} onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))} required>
                      {CATEGORIES.map(c => <option key={c} value={c} style={{ color: 'black' }}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Staff</label>
                    <select style={inputStyle} value={editForm.staff} onChange={e => setEditForm(p => ({ ...p, staff: e.target.value }))} required>
                      {STAFF_OPTIONS.map(s => <option key={s} value={s} style={{ color: 'black' }}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Starting Price ($)</label>
                    <input type="number" style={inputStyle} value={editForm.starting_price} onChange={e => setEditForm(p => ({ ...p, starting_price: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Discount (%)</label>
                    <input type="number" min="0" max="100" style={inputStyle} value={editForm.discount} onChange={e => setEditForm(p => ({ ...p, discount: e.target.value }))} placeholder="Optional" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Street Address</label>
                    <input style={inputStyle} value={editForm.street_address} onChange={e => setEditForm(p => ({ ...p, street_address: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>City</label>
                    <input style={inputStyle} value={editForm.city} onChange={e => setEditForm(p => ({ ...p, city: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Country</label>
                    <input style={inputStyle} value={editForm.country} onChange={e => setEditForm(p => ({ ...p, country: e.target.value }))} required />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Instructions</label>
                    <textarea rows="3" style={{ ...inputStyle, resize: 'vertical' }} value={editForm.instructions} onChange={e => setEditForm(p => ({ ...p, instructions: e.target.value }))} />
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '20px', padding: '12px' }} disabled={editLoading}>
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Add New Vendor Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', overflowY: 'auto' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '30px', position: 'relative', margin: 'auto' }}>
            <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-color)' }}>
              <X size={22} />
            </button>
            <h2 style={{ marginBottom: '20px' }}>Add New Vendor</h2>

            {addError && <div style={{ color: '#f87171', marginBottom: '15px', padding: '10px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)' }}>{addError}</div>}
            {addSuccess && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <CheckCircle size={40} color="green" /><p style={{ color: 'green', marginTop: '10px' }}>{addSuccess}</p>
              </div>
            )}

            {!addSuccess && (
              <form onSubmit={handleAddSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Vendor Name *</label>
                    <input style={inputStyle} value={addForm.vendor_name} onChange={e => setAddForm(p => ({ ...p, vendor_name: e.target.value }))} required placeholder="e.g. Royal Caterers" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Category *</label>
                    <select style={inputStyle} value={addForm.category} onChange={e => setAddForm(p => ({ ...p, category: e.target.value }))} required>
                      {CATEGORIES.map(c => <option key={c} value={c} style={{ color: 'black' }}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Staff *</label>
                    <select style={inputStyle} value={addForm.staff} onChange={e => setAddForm(p => ({ ...p, staff: e.target.value }))} required>
                      {STAFF_OPTIONS.map(s => <option key={s} value={s} style={{ color: 'black' }}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Starting Price ($) *</label>
                    <input type="number" style={inputStyle} value={addForm.starting_price} onChange={e => setAddForm(p => ({ ...p, starting_price: e.target.value }))} required placeholder="e.g. 300" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Discount (%)</label>
                    <input type="number" min="0" max="100" style={inputStyle} value={addForm.discount} onChange={e => setAddForm(p => ({ ...p, discount: e.target.value }))} placeholder="Optional" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Street Address *</label>
                    <input style={inputStyle} value={addForm.street_address} onChange={e => setAddForm(p => ({ ...p, street_address: e.target.value }))} required placeholder="e.g. 10 Regent Street" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>City *</label>
                    <input style={inputStyle} value={addForm.city} onChange={e => setAddForm(p => ({ ...p, city: e.target.value }))} required placeholder="e.g. Manchester" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Country *</label>
                    <input style={inputStyle} value={addForm.country} onChange={e => setAddForm(p => ({ ...p, country: e.target.value }))} required />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Instructions / Notes</label>
                    <textarea rows="3" style={{ ...inputStyle, resize: 'vertical' }} value={addForm.instructions} onChange={e => setAddForm(p => ({ ...p, instructions: e.target.value }))} placeholder="Any special notes for customers..." />
                  </div>
                  {/* Image Upload Section */}
                  <ImageUploader
                    files={addImages}
                    onChange={setAddImages}
                    label="Vendor Images"
                    maxImages={5}
                  />
                  <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" id="vendor_is_public_add" checked={addForm.is_public} onChange={e => setAddForm(p => ({ ...p, is_public: e.target.checked }))} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                    <label htmlFor="vendor_is_public_add" style={{ cursor: 'pointer', fontSize: '14px' }}>Make Publicly Visible</label>
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '20px', padding: '12px' }} disabled={addLoading}>
                  {addLoading ? 'Creating...' : 'Create Vendor'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;
