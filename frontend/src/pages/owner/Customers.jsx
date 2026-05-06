import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { ChevronLeft, ChevronRight, Mail, Phone } from 'lucide-react';

const Customers = () => {
  const [activeTab, setActiveTab] = useState('hall');

  // ── Hall Customers ────────────────────────────────────────
  const [hallCustomers, setHallCustomers] = useState([]);
  const [hallLoading, setHallLoading] = useState(false);
  const [hallPagination, setHallPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [hallSearch, setHallSearch] = useState('');

  const fetchHallCustomers = useCallback(async (page = 1) => {
    setHallLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: hallPagination.limit });
      if (hallSearch) params.append('name', hallSearch);
      const res = await api.get(`/hall_owner/customers?${params}`);
      if (res.data.success) {
        setHallCustomers(res.data.data);
        setHallPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setHallLoading(false);
    }
  }, [hallPagination.limit, hallSearch]);

  useEffect(() => { if (activeTab === 'hall') fetchHallCustomers(1); }, [activeTab, hallSearch]);

  // ── Vendor Customers (unique customers from vendor queries) ─
  // Re-use the same customers endpoint — the backend already filters by owner's enquiries
  // For vendor customers, we fetch vendor-enquiries and extract unique customers
  const [vendorCustomers, setVendorCustomers] = useState([]);
  const [vendorLoading, setVendorLoading] = useState(false);
  const [vendorSearch, setVendorSearch] = useState('');

  const fetchVendorCustomers = useCallback(async () => {
    setVendorLoading(true);
    try {
      const params = new URLSearchParams({ limit: 100 });
      if (vendorSearch) params.append('customer_name', vendorSearch);
      const res = await api.get(`/hall_owner/vendor-enquiries?${params}`);
      if (res.data.success) {
        // Extract unique customers from vendor queries
        const seen = new Set();
        const unique = [];
        res.data.data.forEach(q => {
          if (q.customer_id && !seen.has(q.customer_id._id)) {
            seen.add(q.customer_id._id);
            unique.push(q.customer_id);
          }
        });
        setVendorCustomers(unique);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVendorLoading(false);
    }
  }, [vendorSearch]);

  useEffect(() => { if (activeTab === 'vendor') fetchVendorCustomers(); }, [activeTab, vendorSearch]);

  const inputStyle = { padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.07)', color: 'var(--text-color)', fontSize: '14px', width: '260px' };

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

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Customers</h1>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button onClick={() => setActiveTab('hall')} className={activeTab === 'hall' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '10px 24px', fontWeight: '600' }}>
          🏛️ Hall Customers
        </button>
        <button onClick={() => setActiveTab('vendor')} className={activeTab === 'vendor' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '10px 24px', fontWeight: '600' }}>
          🎪 Vendor Customers
        </button>
      </div>

      {/* ── HALL CUSTOMERS ─────────────────────────────────── */}
      {activeTab === 'hall' && (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <input
              style={inputStyle}
              placeholder="Search by name..."
              value={hallSearch}
              onChange={e => setHallSearch(e.target.value)}
            />
            <span style={{ fontSize: '13px', color: 'var(--text-light)', marginLeft: 'auto' }}>
              {hallPagination.total} customer{hallPagination.total !== 1 ? 's' : ''}
            </span>
          </div>

          {hallLoading ? (
            <p style={{ padding: '30px', textAlign: 'center' }}>Loading...</p>
          ) : hallCustomers.length === 0 ? (
            <p style={{ padding: '30px', textAlign: 'center', color: 'var(--text-light)' }}>No hall customers found.</p>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}>
                      {['#', 'Customer Name', 'Email', 'Customer ID', 'Joined'].map(h => (
                        <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {hallCustomers.map((c, idx) => (
                      <tr key={c._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <td style={{ padding: '12px 16px', color: 'var(--text-light)' }}>{(hallPagination.page - 1) * hallPagination.limit + idx + 1}</td>
                        <td style={{ padding: '12px 16px', fontWeight: '500' }}>{c.name}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <a href={`mailto:${c.email}`} style={{ color: 'var(--primary-color)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                            <Mail size={13} /> {c.email}
                          </a>
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-light)', fontSize: '13px', fontFamily: 'monospace' }}>{c.customer_id}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-light)', fontSize: '13px' }}>
                          {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-GB') : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationBar pagination={hallPagination} onPage={fetchHallCustomers} />
            </>
          )}
        </div>
      )}

      {/* ── VENDOR CUSTOMERS ─────────────────────────────────── */}
      {activeTab === 'vendor' && (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <input
              style={inputStyle}
              placeholder="Search by name..."
              value={vendorSearch}
              onChange={e => setVendorSearch(e.target.value)}
            />
            <span style={{ fontSize: '13px', color: 'var(--text-light)', marginLeft: 'auto' }}>
              {vendorCustomers.length} customer{vendorCustomers.length !== 1 ? 's' : ''}
            </span>
          </div>

          {vendorLoading ? (
            <p style={{ padding: '30px', textAlign: 'center' }}>Loading...</p>
          ) : vendorCustomers.length === 0 ? (
            <p style={{ padding: '30px', textAlign: 'center', color: 'var(--text-light)' }}>No vendor customers found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}>
                    {['#', 'Customer Name', 'Email', 'Customer ID'].map(h => (
                      <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vendorCustomers.map((c, idx) => (
                    <tr key={c._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '12px 16px', color: 'var(--text-light)' }}>{idx + 1}</td>
                      <td style={{ padding: '12px 16px', fontWeight: '500' }}>{c.name}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <a href={`mailto:${c.email}`} style={{ color: 'var(--primary-color)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                          <Mail size={13} /> {c.email}
                        </a>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-light)', fontSize: '13px', fontFamily: 'monospace' }}>{c.customer_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Customers;
