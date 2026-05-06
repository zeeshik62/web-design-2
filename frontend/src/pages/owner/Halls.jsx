import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { Trash2, Eye, EyeOff, Pencil, X, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.07)', color: 'var(--text-color)', fontSize: '14px' };

const Halls = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

  // Edit Modal State
  const [editingHall, setEditingHall] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  // Add New Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const emptyForm = { subhall_name: '', type: 'Marquee', sitting_capacity: '', parking_capacity: '', starting_price: '', discount: '', instructions: '', street_address: '', city: '', country: 'United Kingdom', is_public: true };
  const [addForm, setAddForm] = useState(emptyForm);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  // Confirm Delete State
  const [deletingId, setDeletingId] = useState(null);

  const fetchHalls = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/hall_owner/subhalls?page=${page}&limit=${pagination.limit}`);
      if (response.data.success) {
        setHalls(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch halls", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  useEffect(() => { fetchHalls(1); }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/hall_owner/subhalls/${id}`);
      fetchHalls(pagination.page);
      setDeletingId(null);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleTogglePublic = async (id) => {
    try {
      const response = await api.patch(`/hall_owner/subhalls/${id}/toggle-public`);
      if (response.data.success) {
        setHalls(prev => prev.map(h => h._id === id ? { ...h, is_public: !h.is_public } : h));
      }
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  const openEditModal = (hall) => {
    setEditingHall(hall);
    setEditForm({
      subhall_name: hall.subhall_name,
      type: hall.type,
      sitting_capacity: hall.sitting_capacity,
      parking_capacity: hall.parking_capacity,
      starting_price: hall.starting_price,
      discount: hall.discount || '',
      instructions: hall.instructions || '',
      street_address: hall.address?.street_address || '',
      city: hall.address?.city || '',
      country: hall.address?.country || '',
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
        subhall_name: editForm.subhall_name,
        type: editForm.type,
        sitting_capacity: Number(editForm.sitting_capacity),
        parking_capacity: Number(editForm.parking_capacity),
        starting_price: Number(editForm.starting_price),
        discount: editForm.discount !== '' ? Number(editForm.discount) : null,
        instructions: editForm.instructions,
        address: {
          street_address: editForm.street_address,
          city: editForm.city,
          country: editForm.country,
        }
      };
      const res = await api.put(`/hall_owner/subhalls/${editingHall._id}`, payload);
      if (res.data.success) {
        setEditSuccess('SubHall updated successfully!');
        fetchHalls(pagination.page);
        setTimeout(() => { setEditingHall(null); setEditSuccess(''); }, 1200);
      }
    } catch (err) {
      setEditError(err.response?.data?.message || 'Update failed.');
    } finally {
      setEditLoading(false);
    }
  };

  const HALL_TYPES = ['Marquee', 'Banquet Hall', 'Open Roof', 'Conference Room', 'Other'];

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    try {
      const payload = {
        subhall_name: addForm.subhall_name,
        type: addForm.type,
        sitting_capacity: Number(addForm.sitting_capacity),
        parking_capacity: Number(addForm.parking_capacity),
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
      const res = await api.post('/hall_owner/subhalls', payload);
      if (res.data.success) {
        setAddSuccess('SubHall created successfully!');
        fetchHalls(1);
        setTimeout(() => { setShowAddModal(false); setAddForm(emptyForm); setAddSuccess(''); }, 1200);
      }
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to create SubHall.');
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>My SubHalls</h1>
        <button className="btn-primary" onClick={() => { setShowAddModal(true); setAddForm(emptyForm); setAddError(''); setAddSuccess(''); }}>+ Add New SubHall</button>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <p style={{ padding: '30px', textAlign: 'center' }}>Loading...</p>
        ) : halls.length === 0 ? (
          <p style={{ padding: '30px', textAlign: 'center' }}>No SubHalls found.</p>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}>
                    {['#', 'Name', 'Type', 'Sitting', 'Parking', 'Price', 'Discount', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {halls.map((hall, idx) => (
                    <tr key={hall._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '12px 16px', color: 'var(--text-light)' }}>{(pagination.page - 1) * pagination.limit + idx + 1}</td>
                      <td style={{ padding: '12px 16px', fontWeight: '500' }}>{hall.subhall_name}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-light)' }}>{hall.type}</td>
                      <td style={{ padding: '12px 16px' }}>{hall.sitting_capacity}</td>
                      <td style={{ padding: '12px 16px' }}>{hall.parking_capacity}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 'bold', color: 'var(--primary-color)' }}>${hall.starting_price}</td>
                      <td style={{ padding: '12px 16px' }}>
                        {hall.discount > 0 ? <span style={{ background: 'green', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>{hall.discount}%</span> : <span style={{ color: 'var(--text-light)' }}>—</span>}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', background: hall.is_public ? 'rgba(0,200,0,0.15)' : 'rgba(200,0,0,0.15)', color: hall.is_public ? '#4ade80' : '#f87171' }}>
                          {hall.is_public ? 'Public' : 'Private'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {/* Edit */}
                          <button onClick={() => openEditModal(hall)} title="Edit" style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: 'var(--primary-color)', display: 'flex', alignItems: 'center' }}>
                            <Pencil size={15} />
                          </button>
                          {/* Toggle Public */}
                          <button onClick={() => handleTogglePublic(hall._id)} title={hall.is_public ? 'Make Private' : 'Make Public'} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: hall.is_public ? '#4ade80' : '#facc15', display: 'flex', alignItems: 'center' }}>
                            {hall.is_public ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                          {/* Delete */}
                          <button onClick={() => setDeletingId(hall._id)} title="Delete" style={{ background: 'rgba(255,0,0,0.1)', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#f87171', display: 'flex', alignItems: 'center' }}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>
                  Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => fetchHalls(pagination.page - 1)} disabled={pagination.page <= 1} className="btn-secondary" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <button onClick={() => fetchHalls(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} className="btn-secondary" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
            <h3 style={{ marginBottom: '10px' }}>Delete SubHall?</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '25px' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setDeletingId(null)} className="btn-secondary">Cancel</button>
              <button onClick={() => handleDelete(deletingId)} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingHall && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', overflowY: 'auto' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '30px', position: 'relative', margin: 'auto' }}>
            <button onClick={() => setEditingHall(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-color)' }}>
              <X size={22} />
            </button>
            <h2 style={{ marginBottom: '20px' }}>Edit SubHall</h2>

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
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>SubHall Name</label>
                    <input style={inputStyle} value={editForm.subhall_name} onChange={e => setEditForm(p => ({ ...p, subhall_name: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Type</label>
                    <select style={inputStyle} value={editForm.type} onChange={e => setEditForm(p => ({ ...p, type: e.target.value }))} required>
                      {HALL_TYPES.map(t => <option key={t} value={t} style={{ color: 'black' }}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Sitting Capacity</label>
                    <input type="number" style={inputStyle} value={editForm.sitting_capacity} onChange={e => setEditForm(p => ({ ...p, sitting_capacity: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Parking Capacity</label>
                    <input type="number" style={inputStyle} value={editForm.parking_capacity} onChange={e => setEditForm(p => ({ ...p, parking_capacity: e.target.value }))} required />
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

      {/* Add New SubHall Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', overflowY: 'auto' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '30px', position: 'relative', margin: 'auto' }}>
            <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-color)' }}>
              <X size={22} />
            </button>
            <h2 style={{ marginBottom: '20px' }}>Add New SubHall</h2>

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
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>SubHall Name *</label>
                    <input style={inputStyle} value={addForm.subhall_name} onChange={e => setAddForm(p => ({ ...p, subhall_name: e.target.value }))} required placeholder="e.g. Grand Banquet Hall" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Type *</label>
                    <select style={inputStyle} value={addForm.type} onChange={e => setAddForm(p => ({ ...p, type: e.target.value }))} required>
                      {HALL_TYPES.map(t => <option key={t} value={t} style={{ color: 'black' }}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Sitting Capacity *</label>
                    <input type="number" style={inputStyle} value={addForm.sitting_capacity} onChange={e => setAddForm(p => ({ ...p, sitting_capacity: e.target.value }))} required placeholder="e.g. 200" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Parking Capacity *</label>
                    <input type="number" style={inputStyle} value={addForm.parking_capacity} onChange={e => setAddForm(p => ({ ...p, parking_capacity: e.target.value }))} required placeholder="e.g. 50" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Starting Price ($) *</label>
                    <input type="number" style={inputStyle} value={addForm.starting_price} onChange={e => setAddForm(p => ({ ...p, starting_price: e.target.value }))} required placeholder="e.g. 500" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Discount (%)</label>
                    <input type="number" min="0" max="100" style={inputStyle} value={addForm.discount} onChange={e => setAddForm(p => ({ ...p, discount: e.target.value }))} placeholder="Optional" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Street Address *</label>
                    <input style={inputStyle} value={addForm.street_address} onChange={e => setAddForm(p => ({ ...p, street_address: e.target.value }))} required placeholder="e.g. 12 Baker Street" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>City *</label>
                    <input style={inputStyle} value={addForm.city} onChange={e => setAddForm(p => ({ ...p, city: e.target.value }))} required placeholder="e.g. London" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Country *</label>
                    <input style={inputStyle} value={addForm.country} onChange={e => setAddForm(p => ({ ...p, country: e.target.value }))} required />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Instructions / Notes</label>
                    <textarea rows="3" style={{ ...inputStyle, resize: 'vertical' }} value={addForm.instructions} onChange={e => setAddForm(p => ({ ...p, instructions: e.target.value }))} placeholder="Any special notes for customers..." />
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" id="is_public_add" checked={addForm.is_public} onChange={e => setAddForm(p => ({ ...p, is_public: e.target.checked }))} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                    <label htmlFor="is_public_add" style={{ cursor: 'pointer', fontSize: '14px' }}>Make Publicly Visible</label>
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '20px', padding: '12px' }} disabled={addLoading}>
                  {addLoading ? 'Creating...' : 'Create SubHall'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Halls;

