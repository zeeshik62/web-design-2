import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled'];

const statusStyle = (status) => {
  const map = {
    pending:   { background: 'rgba(250,204,21,0.15)',  color: '#facc15' },
    confirmed: { background: 'rgba(74,222,128,0.15)',  color: '#4ade80' },
    cancelled: { background: 'rgba(248,113,113,0.15)', color: '#f87171' },
  };
  return { padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', ...(map[status] || map.pending) };
};

const selectStyle = {
  padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)',
  background: 'rgba(255,255,255,0.07)', color: 'var(--text-color)', fontSize: '12px', cursor: 'pointer'
};

const Queries = () => {
  const [activeTab, setActiveTab] = useState('hall');

  // ── Hall Enquiries ────────────────────────────────────────
  const [hallEnquiries, setHallEnquiries] = useState([]);
  const [hallLoading, setHallLoading] = useState(false);
  const [hallPagination, setHallPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [hallStatusFilter, setHallStatusFilter] = useState('');
  const [hallUpdating, setHallUpdating] = useState(null);

  const fetchHallEnquiries = useCallback(async (page = 1) => {
    setHallLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: hallPagination.limit });
      if (hallStatusFilter) params.append('status', hallStatusFilter);
      const res = await api.get(`/hall_owner/enquiries?${params}`);
      if (res.data.success) {
        setHallEnquiries(res.data.data);
        setHallPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setHallLoading(false);
    }
  }, [hallPagination.limit, hallStatusFilter]);

  useEffect(() => { if (activeTab === 'hall') fetchHallEnquiries(1); }, [activeTab, hallStatusFilter]);

  const updateHallStatus = async (id, newStatus) => {
    setHallUpdating(id);
    try {
      await api.patch(`/hall_owner/enquiries/${id}/status`, { status: newStatus });
      setHallEnquiries(prev => prev.map(e => e._id === id ? { ...e, status: newStatus } : e));
    } catch (err) {
      console.error(err);
    } finally {
      setHallUpdating(null);
    }
  };

  // ── Vendor Queries ────────────────────────────────────────
  const [vendorQueries, setVendorQueries] = useState([]);
  const [vendorLoading, setVendorLoading] = useState(false);
  const [vendorPagination, setVendorPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [vendorStatusFilter, setVendorStatusFilter] = useState('');
  const [vendorUpdating, setVendorUpdating] = useState(null);

  const fetchVendorQueries = useCallback(async (page = 1) => {
    setVendorLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: vendorPagination.limit });
      if (vendorStatusFilter) params.append('status', vendorStatusFilter);
      const res = await api.get(`/hall_owner/vendor-enquiries?${params}`);
      if (res.data.success) {
        setVendorQueries(res.data.data);
        setVendorPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVendorLoading(false);
    }
  }, [vendorPagination.limit, vendorStatusFilter]);

  useEffect(() => { if (activeTab === 'vendor') fetchVendorQueries(1); }, [activeTab, vendorStatusFilter]);

  const updateVendorStatus = async (id, newStatus) => {
    setVendorUpdating(id);
    try {
      await api.patch(`/hall_owner/vendor-enquiries/${id}/status`, { status: newStatus });
      setVendorQueries(prev => prev.map(q => q._id === id ? { ...q, status: newStatus } : q));
    } catch (err) {
      console.error(err);
    } finally {
      setVendorUpdating(null);
    }
  };

  const PaginationBar = ({ pagination, onPage }) =>
    pagination.totalPages > 1 ? (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>
          Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => onPage(pagination.page - 1)} disabled={pagination.page <= 1} className="btn-secondary" style={{ padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ChevronLeft size={15} /> Prev
          </button>
          <button onClick={() => onPage(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} className="btn-secondary" style={{ padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Next <ChevronRight size={15} />
          </button>
        </div>
      </div>
    ) : null;

  const QueriesTable = ({ rows, idxOffset, entityKey, entityNameField, entityLabel, onStatusChange, updating }) => (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}>
            {['#', 'Customer', 'Email', entityLabel, 'Date', 'Message', 'Status', 'Update Status'].map(h => (
              <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <td style={{ padding: '12px 16px', color: 'var(--text-light)' }}>{idxOffset + i + 1}</td>
              <td style={{ padding: '12px 16px', fontWeight: '500' }}>{row.customer_id?.name || '—'}</td>
              <td style={{ padding: '12px 16px', color: 'var(--text-light)', fontSize: '13px' }}>{row.customer_id?.email || '—'}</td>
              <td style={{ padding: '12px 16px', color: 'var(--primary-color)', fontSize: '13px' }}>
                {row[entityKey]?.[entityNameField] || '—'}
              </td>
              <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', color: 'var(--text-light)', fontSize: '13px' }}>
                {row.date ? new Date(row.date).toLocaleDateString('en-GB') : '—'}
              </td>
              <td style={{ padding: '12px 16px', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-light)', fontSize: '13px' }} title={row.description}>
                {row.description || '—'}
              </td>
              <td style={{ padding: '12px 16px' }}>
                <span style={statusStyle(row.status)}>{row.status}</span>
              </td>
              <td style={{ padding: '12px 16px' }}>
                <select
                  style={selectStyle}
                  value={row.status}
                  onChange={e => onStatusChange(row._id, e.target.value)}
                  disabled={updating === row._id}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s} style={{ color: 'black' }}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Queries & Bookings</h1>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button onClick={() => setActiveTab('hall')} className={activeTab === 'hall' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '10px 24px', fontWeight: '600' }}>
          🏛️ Hall Enquiries
        </button>
        <button onClick={() => setActiveTab('vendor')} className={activeTab === 'vendor' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '10px 24px', fontWeight: '600' }}>
          🎪 Vendor Queries
        </button>
      </div>

      {/* ── HALL ENQUIRIES ─────────────────────────────────── */}
      {activeTab === 'hall' && (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>Filter by Status:</span>
            <select style={selectStyle} value={hallStatusFilter} onChange={e => setHallStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ color: 'black' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <button onClick={() => fetchHallEnquiries(hallPagination.page)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {hallLoading ? (
            <p style={{ padding: '30px', textAlign: 'center' }}>Loading...</p>
          ) : hallEnquiries.length === 0 ? (
            <p style={{ padding: '30px', textAlign: 'center', color: 'var(--text-light)' }}>No hall enquiries found.</p>
          ) : (
            <>
              <QueriesTable
                rows={hallEnquiries}
                idxOffset={(hallPagination.page - 1) * hallPagination.limit}
                entityKey="hall_id"
                entityNameField="subhall_name"
                entityLabel="Hall"
                onStatusChange={updateHallStatus}
                updating={hallUpdating}
              />
              <PaginationBar pagination={hallPagination} onPage={fetchHallEnquiries} />
            </>
          )}
        </div>
      )}

      {/* ── VENDOR QUERIES ─────────────────────────────────── */}
      {activeTab === 'vendor' && (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>Filter by Status:</span>
            <select style={selectStyle} value={vendorStatusFilter} onChange={e => setVendorStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ color: 'black' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <button onClick={() => fetchVendorQueries(vendorPagination.page)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {vendorLoading ? (
            <p style={{ padding: '30px', textAlign: 'center' }}>Loading...</p>
          ) : vendorQueries.length === 0 ? (
            <p style={{ padding: '30px', textAlign: 'center', color: 'var(--text-light)' }}>No vendor queries found.</p>
          ) : (
            <>
              <QueriesTable
                rows={vendorQueries}
                idxOffset={(vendorPagination.page - 1) * vendorPagination.limit}
                entityKey="vendor_id"
                entityNameField="vendor_name"
                entityLabel="Vendor"
                onStatusChange={updateVendorStatus}
                updating={vendorUpdating}
              />
              <PaginationBar pagination={vendorPagination} onPage={fetchVendorQueries} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Queries;
