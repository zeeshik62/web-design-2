/**
 * HMS Pro - Frontend Logic
 */

const API_BASE = '/api';

const HMS = {
    // Utility to show notifications (can be expanded with CSS)
    notify: (message, type = 'success') => {
        console.log(`[${type.toUpperCase()}] ${message}`);
        // Simple alert for now, can be replaced with a toast UI
        alert(message);
    },

    // --- PUBLIC FETCH METHODS ---
    fetchPublicHalls: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) params.append(key, filters[key]);
            });

            const queryString = params.toString() ? `?${params.toString()}` : '';
            const res = await fetch(`${API_BASE}/public/subhalls${queryString}`);
            const json = await res.json();
            return json.success ? json.data : [];
        } catch (err) {
            console.error('Error fetching halls:', err);
            return [];
        }
    },

    fetchHallBySlug: async (slug) => {
        try {
            const res = await fetch(`${API_BASE}/public/subhalls/${slug}`);
            const json = await res.json();
            return json.success ? json.data : null;
        } catch (err) {
            console.error('Error fetching hall detail:', err);
            return null;
        }
    },

    fetchPublicVendors: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) params.append(key, filters[key]);
            });

            const queryString = params.toString() ? `?${params.toString()}` : '';
            const res = await fetch(`${API_BASE}/public/vendors${queryString}`);
            const json = await res.json();
            return json.success ? json.data : [];
        } catch (err) {
            console.error('Error fetching public vendors:', err);
            return [];
        }
    },

    fetchVendorBySlug: async (slug) => {
        try {
            const res = await fetch(`${API_BASE}/public/vendors/${slug}`);
            const json = await res.json();
            return json.success ? json.data : null;
        } catch (err) {
            console.error('Error fetching vendor detail:', err);
            return null;
        }
    },

    // --- OWNER AUTH METHODS ---
    loginOwner: async (email, password) => {
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const json = await res.json();
            if (json.success) {
                localStorage.setItem('hms_token', json.token);
                localStorage.setItem('hms_owner', JSON.stringify(json.data));
                return { success: true };
            }

            if (res.status === 403 || (json.message && json.message.includes("not verified"))) {
                HMS.notify(json.message, 'warning');
                return { success: false, needsVerification: true, email };
            }

            HMS.notify(json.message || 'Login failed', 'error');
            return { success: false };
        } catch (err) {
            console.error('Login error:', err);
            return { success: false };
        }
    },

    registerOwner: async (data) => {
        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const json = await res.json();
            if (json.success) {
                HMS.notify('Registration successful! Please check your email for OTP.');
                return { success: true, email: data.email };
            }
            HMS.notify(json.message || 'Registration failed', 'error');
            return { success: false };
        } catch (err) {
            console.error('Registration error:', err);
            return { success: false };
        }
    },

    verifyOwner: async (email, otp) => {
        try {
            const res = await fetch(`${API_BASE}/auth/verify-registration`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            const json = await res.json();
            if (json.success) {
                localStorage.setItem('hms_token', json.token);
                localStorage.setItem('hms_owner', JSON.stringify(json.data));
                HMS.notify('Account verified successfully!');
                return true;
            }
            HMS.notify(json.message || 'Verification failed', 'error');
            return false;
        } catch (err) {
            console.error('Verification error:', err);
            return false;
        }
    },

    forgotPassword: async (email) => {
        try {
            const res = await fetch(`${API_BASE}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const json = await res.json();
            if (json.success) {
                HMS.notify('OTP sent to your email.');
                return true;
            }
            HMS.notify(json.message || 'Failed to send OTP', 'error');
            return false;
        } catch (err) {
            console.error('Forgot password error:', err);
            return false;
        }
    },

    resetPassword: async (data) => {
        try {
            const res = await fetch(`${API_BASE}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const json = await res.json();
            if (json.success) {
                HMS.notify('Password reset successful! Please login.');
                return true;
            }
            HMS.notify(json.message || 'Failed to reset password', 'error');
            return false;
        } catch (err) {
            console.error('Reset password error:', err);
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('hms_token');
        localStorage.removeItem('hms_owner');
        window.location.href = '/owner/login';
    },

    // --- OWNER HALL MANAGEMENT ---
    fetchOwnerHalls: async () => {
        const token = localStorage.getItem('hms_token');
        if (!token) return [];

        try {
            const res = await fetch(`${API_BASE}/hall_owner/subhalls`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const json = await res.json();
            return json.success ? json.data : [];
        } catch (err) {
            console.error('Error fetching owner halls:', err);
            return [];
        }
    },

    fetchHallById: async (id) => {
        const token = localStorage.getItem('hms_token');
        if (!token) return null;

        try {
            const res = await fetch(`${API_BASE}/hall_owner/subhalls/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const json = await res.json();
            return json.success ? json.data : null;
        } catch (err) {
            console.error('Error fetching hall by ID:', err);
            return null;
        }
    },

    createHall: async (hallData) => {
        const token = localStorage.getItem('hms_token');
        if (!token) return false;

        try {
            const res = await fetch(`${API_BASE}/hall_owner/subhalls`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(hallData)
            });
            const json = await res.json();
            if (json.success) {
                HMS.notify('Hall added successfully!');
                return true;
            }
            HMS.notify(json.message || 'Failed to add hall', 'error');
            return false;
        } catch (err) {
            console.error('Create hall error:', err);
            return false;
        }
    },

    updateHall: async (id, hallData) => {
        const token = localStorage.getItem('hms_token');
        if (!token) return false;

        try {
            const res = await fetch(`${API_BASE}/hall_owner/subhalls/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(hallData)
            });
            const json = await res.json();
            if (json.success) {
                HMS.notify('Hall updated successfully!');
                return true;
            }
            HMS.notify(json.message || 'Failed to update hall', 'error');
            return false;
        } catch (err) {
            console.error('Update hall error:', err);
            return false;
        }
    },

    deleteHall: async (id) => {
        const token = localStorage.getItem('hms_token');
        if (!token) return false;

        try {
            const res = await fetch(`${API_BASE}/hall_owner/subhalls/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const json = await res.json();
            if (json.success) {
                HMS.notify('Hall deleted successfully!');
                return true;
            }
            HMS.notify(json.message || 'Failed to delete hall', 'error');
            return false;
        } catch (err) {
            console.error('Delete hall error:', err);
            return false;
        }
    },

    toggleHallStatus: async (id) => {
        const token = localStorage.getItem('hms_token');
        if (!token) return false;

        try {
            const res = await fetch(`${API_BASE}/hall_owner/subhalls/${id}/toggle-public`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const json = await res.json();
            if (json.success) {
                HMS.notify(`Hall status updated successfully!`);
                return true;
            }
            HMS.notify(json.message || 'Failed to toggle status', 'error');
            return false;
        } catch (err) {
            console.error('Toggle status error:', err);
            return false;
        }
    },

    // --- OWNER VENDOR MANAGEMENT ---
    fetchOwnerVendors: async () => {
        const token = localStorage.getItem('hms_token');
        if (!token) return [];

        try {
            const res = await fetch(`${API_BASE}/hall_owner/vendors`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const json = await res.json();
            return json.success ? json.data : [];
        } catch (err) {
            console.error('Error fetching vendors:', err);
            return [];
        }
    },

    fetchVendorById: async (id) => {
        const token = localStorage.getItem('hms_token');
        if (!token) return null;

        try {
            const res = await fetch(`${API_BASE}/hall_owner/vendors/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const json = await res.json();
            return json.success ? json.data : null;
        } catch (err) {
            console.error('Error fetching vendor detail:', err);
            return null;
        }
    },

    createVendor: async (vendorData) => {
        const token = localStorage.getItem('hms_token');
        if (!token) return false;

        try {
            const res = await fetch(`${API_BASE}/hall_owner/vendors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(vendorData)
            });
            const json = await res.json();
            if (json.success) {
                HMS.notify('Vendor Service added successfully!');
                return true;
            }
            HMS.notify(json.message || 'Failed to add vendor', 'error');
            return false;
        } catch (err) {
            console.error('Create vendor error:', err);
            return false;
        }
    },

    updateVendor: async (id, vendorData) => {
        const token = localStorage.getItem('hms_token');
        if (!token) return false;

        try {
            const res = await fetch(`${API_BASE}/hall_owner/vendors/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(vendorData)
            });
            const json = await res.json();
            if (json.success) {
                HMS.notify('Vendor Service updated successfully!');
                return true;
            }
            HMS.notify(json.message || 'Failed to update vendor', 'error');
            return false;
        } catch (err) {
            console.error('Update vendor error:', err);
            return false;
        }
    },

    deleteVendor: async (id) => {
        const token = localStorage.getItem('hms_token');
        if (!token) return false;

        try {
            const res = await fetch(`${API_BASE}/hall_owner/vendors/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const json = await res.json();
            if (json.success) {
                HMS.notify('Vendor Service deleted successfully!');
                return true;
            }
            HMS.notify(json.message || 'Failed to delete vendor', 'error');
            return false;
        } catch (err) {
            console.error('Delete vendor error:', err);
            return false;
        }
    },

    toggleVendorStatus: async (id) => {
        const token = localStorage.getItem('hms_token');
        if (!token) return false;

        try {
            const res = await fetch(`${API_BASE}/hall_owner/vendors/${id}/toggle-public`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const json = await res.json();
            if (json.success) {
                HMS.notify(`Vendor visibility updated!`);
                return true;
            }
            HMS.notify(json.message || 'Failed to toggle vendor status', 'error');
            return false;
        } catch (err) {
            console.error('Toggle vendor status error:', err);
            return false;
        }
    },

    // --- OWNER PROFILE & UTILITIES ---
    fetchOwnerProfile: async () => {
        const token = localStorage.getItem('hms_token');
        if (!token) return null;

        try {
            const res = await fetch(`${API_BASE}/hall_owner/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const json = await res.json();
            return json.success ? json.data : null;
        } catch (err) {
            console.error('Error fetching profile:', err);
            return null;
        }
    },

    updateOwnerProfile: async (profileData) => {
        const token = localStorage.getItem('hms_token');
        if (!token) return false;

        try {
            const res = await fetch(`${API_BASE}/hall_owner/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });
            const json = await res.json();
            if (json.success) {
                localStorage.setItem('hms_owner', JSON.stringify(json.data));
                HMS.notify('Profile updated successfully!');
                return true;
            }
            HMS.notify(json.message || 'Failed to update profile', 'error');
            return false;
        } catch (err) {
            console.error('Update profile error:', err);
            return false;
        }
    },

    uploadImage: async (file, type = 'vendor') => {
        const token = localStorage.getItem('hms_token');
        if (!token) return null;

        try {
            const formData = new FormData();
            formData.append('image', file);

            const res = await fetch(`${API_BASE}/hall_owner/upload/${type}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const json = await res.json();
            return json.success ? json.data.path : null;
        } catch (err) {
            console.error('Image upload error:', err);
            return null;
        }
    },

    // --- CUSTOMER METHODS ---
    loginCustomer: async (email, password) => {
        try {
            const res = await fetch(`${API_BASE}/customer/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const json = await res.json();
            if (json.success) {
                localStorage.setItem('hms_customer_token', json.token);
                localStorage.setItem('hms_customer', JSON.stringify(json.data));
                return true;
            }
            HMS.notify(json.message || 'Login failed', 'error');
            return false;
        } catch (err) {
            console.error('Customer login error:', err);
            return false;
        }
    },

    registerCustomer: async (data) => {
        try {
            const res = await fetch(`${API_BASE}/customer/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const json = await res.json();
            if (json.success) {
                HMS.notify('Registration successful! You can now login.');
                return true;
            }
            HMS.notify(json.message || 'Registration failed', 'error');
            return false;
        } catch (err) {
            console.error('Customer registration error:', err);
            return false;
        }
    },

    logoutCustomer: () => {
        localStorage.removeItem('hms_customer_token');
        localStorage.removeItem('hms_customer');
        window.location.href = '/';
    },

    submitQuery: async (queryData) => {
        const token = localStorage.getItem('hms_customer_token');
        if (!token) return false;

        try {
            const res = await fetch(`${API_BASE}/customer/queries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(queryData)
            });
            const json = await res.json();
            if (json.success) {
                HMS.notify('Query submitted successfully!');
                return true;
            }
            HMS.notify(json.message || 'Failed to submit query', 'error');
            return false;
        } catch (err) {
            console.error('Query submission error:', err);
            return false;
        }
    },

    submitVendorQuery: async (queryData) => {
        const token = localStorage.getItem('hms_customer_token');
        if (!token) return false;

        try {
            const res = await fetch(`${API_BASE}/customer/vendor-queries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(queryData)
            });
            const json = await res.json();
            if (json.success) {
                HMS.notify('Vendor query submitted successfully!');
                return true;
            }
            HMS.notify(json.message || 'Failed to submit vendor query', 'error');
            return false;
        } catch (err) {
            console.error('Vendor query submission error:', err);
            return false;
        }
    },

    // --- UI HELPERS ---
    renderUserNavbar: () => {
        const guestLinks = document.getElementById('guest-links');
        const userNav = document.getElementById('user-nav');
        const userName = document.getElementById('user-name');
        const userAvatar = document.getElementById('user-avatar');

        if (!guestLinks || !userNav) return;

        const customerToken = localStorage.getItem('hms_customer_token');
        const customerData = JSON.parse(localStorage.getItem('hms_customer') || 'null');

        if (customerToken && customerData) {
            guestLinks.style.display = 'none';
            userNav.style.display = 'flex';
            userName.textContent = customerData.name || 'User';
            userAvatar.textContent = (customerData.name || 'U').charAt(0).toUpperCase();
        } else {
            guestLinks.style.display = 'flex';
            userNav.style.display = 'none';
        }
    }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Navbar
    if (typeof HMS !== 'undefined' && HMS.renderUserNavbar) {
        HMS.renderUserNavbar();
    }

    // Page Specific Logic
    const path = window.location.pathname;
    if (path.startsWith('/halls/')) {
        if (window.renderHallDetail) window.renderHallDetail();
    } else if (path.startsWith('/vendors/') && !path.endsWith('/vendors/')) {
        if (window.renderVendorDetailPage) window.renderVendorDetailPage();
    }
});

// --- GLOBAL RENDER FUNCTIONS ---
async function renderHallListing(filters = {}) {
    const grid = document.getElementById('halls-grid');
    if (!grid) return;

    grid.innerHTML = `
        <div class="loading-spinner" style="grid-column: 1 / -1; text-align: center; padding: 4rem 0;">
            <i class="fas fa-circle-notch fa-spin" style="font-size: 2rem; color: var(--primary); margin-bottom: 1rem; display: block;"></i>
            <span>Refreshing venues...</span>
        </div>
    `;

    const halls = await HMS.fetchPublicHalls(filters);

    if (halls.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 4rem 0;"><h3>No venues found</h3></div>';
        return;
    }

    grid.innerHTML = halls.map(hall => `
        <div class="hall-card">
            <div class="hall-img">
                ${hall.discount ? `<div class="discount-badge">-${hall.discount}%</div>` : ''}
                <img src="${hall.images && hall.images.length > 0 ? hall.images[0] : 'https://via.placeholder.com/400x250?text=No+Image'}" alt="${hall.subhall_name}" onerror="this.src='https://via.placeholder.com/400x250?text=No+Image'">
            </div>
            <div class="hall-content">
                <div class="hall-tags">
                    <span class="tag">${hall.type}</span>
                    <span class="tag"><i class="fas fa-location-dot"></i> ${hall.address.city}</span>
                </div>
                <h4>${hall.subhall_name}</h4>
                <div style="display: flex; gap: 1rem; margin: 1rem 0; color: var(--text-secondary); font-size: 0.9rem;">
                    <span><i class="fas fa-users"></i> ${hall.sitting_capacity} Guests</span>
                    <span><i class="fas fa-car"></i> ${hall.parking_capacity} Spots</span>
                </div>
                <div class="hall-footer">
                    <div class="price">From Rs. ${hall.starting_price.toLocaleString()}</div>
                    <a href="/halls/${hall.slug}" class="btn btn-primary" style="padding: 0.5rem 1rem;">Details</a>
                </div>
            </div>
        </div>
    `).join('');
}
window.renderHallListing = renderHallListing;

const CATEGORY_ICONS = {
    'Caterer': 'fa-utensils',
    'Photographer': 'fa-camera',
    'Decorator': 'fa-wand-magic-sparkles',
    'DJ': 'fa-music',
    'Live Band': 'fa-guitar',
    'Event Planner': 'fa-calendar-check',
    'Make-up Artist': 'fa-brush'
};

async function renderVendorListing(filters = {}) {
    const grid = document.getElementById('vendors-grid');
    if (!grid) return;

    const countEl = document.getElementById('result-count');

    grid.innerHTML = `
        <div class="loading-spinner" style="grid-column: 1 / -1; text-align: center; padding: 4rem 0;">
            <i class="fas fa-circle-notch fa-spin" style="font-size: 2rem; color: var(--primary); margin-bottom: 1rem; display: block;"></i>
            <span>Refreshing services...</span>
        </div>
    `;

    const vendors = await HMS.fetchPublicVendors(filters);

    // Update result count
    if (countEl) {
        document.getElementById('count-value').textContent = vendors.length;
        countEl.style.display = 'block';
    }

    if (vendors.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-box-open"></i>
                <h3>No vendors found</h3>
                <p>Try adjusting your filters to find what you're looking for.</p>
            </div>`;
        return;
    }

    grid.innerHTML = vendors.map(vendor => {
        const catIcon = CATEGORY_ICONS[vendor.category] || 'fa-briefcase';
        const imgSrc  = vendor.images && vendor.images.length > 0
            ? vendor.images[0]
            : `https://via.placeholder.com/400x250?text=${encodeURIComponent(vendor.category)}`;
        const staffColor = vendor.staff === 'Female' ? '#f472b6' : vendor.staff === 'Male' ? '#60a5fa' : '#4ade80';

        return `
        <div class="vendor-card" onclick="window.location.href='/vendors/${vendor.slug}'">
            <div class="vendor-img">
                <span class="vendor-category-badge"><i class="fas ${catIcon}"></i> ${vendor.category}</span>
                ${vendor.discount ? `<div class="discount-badge">-${vendor.discount}%</div>` : ''}
                <img src="${imgSrc}" alt="${vendor.vendor_name}" onerror="this.src='https://via.placeholder.com/400x250?text=No+Image'">
            </div>
            <div class="vendor-content">
                <h4 title="${vendor.vendor_name}">${vendor.vendor_name}</h4>
                <div class="vendor-meta">
                    <span><i class="fas fa-location-dot" style="color:var(--primary);"></i> ${vendor.address.city}, ${vendor.address.country}</span>
                    <span style="color:${staffColor};"><i class="fas fa-user-friends"></i> ${vendor.staff} Staff</span>
                </div>
                <div class="vendor-footer">
                    <div class="price">From Rs. ${vendor.starting_price.toLocaleString()}</div>
                    <a href="/vendors/${vendor.slug}" class="btn btn-primary" style="padding: 0.5rem 1.25rem; font-size:0.85rem;" onclick="event.stopPropagation()">View Details</a>
                </div>
            </div>
        </div>`;
    }).join('');
}
window.renderVendorListing = renderVendorListing;
