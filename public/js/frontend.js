docker/**
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

    // Fetch all public subhalls with optional filters
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

    // Fetch single subhall by slug
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

    // Owner Login
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

    // Owner Register
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

    // Verify Owner
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

    // Forgot Password
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

    // Reset Password
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

    // Create New Hall (Owner)
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

    // Fetch Owner's Halls
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

    logout: () => {
        localStorage.removeItem('hms_token');
        localStorage.removeItem('hms_owner');
        window.location.href = '/owner/login';
    },

    logoutCustomer: () => {
        localStorage.removeItem('hms_customer_token');
        localStorage.removeItem('hms_customer');
        window.location.href = '/';
    },

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
    },

    // CUSTOMER METHODS
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
    }
};

// Initialize navbar on load
document.addEventListener('DOMContentLoaded', () => {
    if (typeof HMS !== 'undefined' && HMS.renderUserNavbar) {
        HMS.renderUserNavbar();
    }
});

// Auto-run logic based on current page
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path === '/halls') {
        // Handled by halls.pug script
    } else if (path === '/' || path === '/index') {
        // Home page logic
    } else if (path.startsWith('/halls/')) {
        renderHallDetail();
    } else if (path === '/owner/halls') {
        renderOwnerHalls();
    }
});

async function renderHallListing(filters = {}) {
    const grid = document.getElementById('halls-grid');
    if (!grid) return;

    // Show loading state
    grid.innerHTML = `
        <div class="loading-spinner" style="grid-column: 1 / -1; text-align: center; padding: 4rem 0; color: var(--text-secondary);">
            <i class="fas fa-circle-notch.fa-spin" style="font-size: 2rem; color: var(--primary); margin-bottom: 1rem; display: block;"></i>
            <span>Refreshing venues...</span>
        </div>
    `;

    const halls = await HMS.fetchPublicHalls(filters);

    if (halls.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 0; color: var(--text-secondary);">
                <i class="fas fa-search-minus" style="font-size: 3rem; margin-bottom: 1rem; display: block; opacity: 0.5;"></i>
                <h3>No venues found</h3>
                <p>Try adjusting your filters or search terms.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = halls.map(hall => `
        <div class="hall-card">
            <div class="hall-img">
                ${hall.discount ? `<div class="discount-badge">-${hall.discount}%</div>` : ''}
                <img src="${API_BASE.replace('/api', '')}${hall.images && hall.images.length > 0 ? (hall.images[0].startsWith('/') ? hall.images[0] : hall.images[0]) : 'https://via.placeholder.com/400x250?text=No+Image'}" alt="${hall.subhall_name}">
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
                    <div class="price">
                        ${hall.discount ? `<span style="text-decoration: line-through; color: var(--text-secondary); font-size: 0.8rem; display: block;">Rs. ${(hall.starting_price * (1 + hall.discount / 100)).toLocaleString()}</span>` : ''}
                        <span>From Rs. ${hall.starting_price.toLocaleString()}</span>
                    </div>
                    <a href="/halls/${hall.slug}" class="btn btn-primary" style="padding: 0.5rem 1rem; text-decoration: none; font-size: 0.85rem;">Details</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Expose to window for inline scripts
window.renderHallListing = renderHallListing;

async function renderHallDetail() {
    const slug = window.location.pathname.split('/').pop();
    const container = document.getElementById('hall-detail-container');
    if (!container) return;

    const hall = await HMS.fetchHallBySlug(slug);
    if (!hall) {
        container.innerHTML = '<h2>Hall not found</h2>';
        return;
    }

    // Populate the template placeholders (Pug will have the structure, we just fill data if needed via JS or keep it minimal)
    // Actually, for SEO/Pug, it's better if Pug renders the skeleton and we just enhance it, 
    // but if we want dynamic data from API, we do it here.

    // For this implementation, I'll let Pug handle the initial render with empty/loading state 
    // and JS will populate it for better interactivity.

    document.title = `${hall.subhall_name} | HMS`;
    // ... logic to fill the detail page elements ...
}

async function renderOwnerHalls() {
    const tableBody = document.querySelector('#owner-halls-table tbody');
    if (!tableBody) return;

    const halls = await HMS.fetchOwnerHalls();
    tableBody.innerHTML = halls.length ? halls.map(hall => `
        <tr>
            <td>${hall.subhall_name}</td>
            <td>${hall.type}</td>
            <td>${hall.sitting_capacity}</td>
            <td>${hall.address.city}</td>
            <td>
                <button class="btn-icon" onclick="window.location.href='/halls/${hall.slug}'"><i class="fas fa-eye"></i></button>
            </td>
        </tr>
    `).join('') : '<tr><td colspan="5">No halls found. Add your first one!</td></tr>';
}
