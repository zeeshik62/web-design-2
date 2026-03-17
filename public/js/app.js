document.addEventListener('DOMContentLoaded', () => {
    // Navigation Logic
    const navLinks = document.querySelectorAll('.nav-links li');
    const views = document.querySelectorAll('.view');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const target = link.getAttribute('data-view');

            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Switch view
            views.forEach(v => {
                if (v.id === `${target}-view`) {
                    v.classList.add('active');
                } else {
                    v.classList.remove('active');
                }
            });

            loadViewData(target);
        });
    });

    loadViewData('halls');
});

async function loadViewData(view) {
    switch (view) {
        case 'halls':
            await loadHalls();
            break;
        case 'enquiries':
            await loadAllEnquiries();
            break;
        case 'customers':
            await loadCustomers();
            break;
    }
}

async function updateStats() {
    try {
        const [hallsRes, enquiriesRes, customersRes] = await Promise.all([
            fetch('/api/halls/get_halls'),
            fetch('/api/hall_owner/get_enquiry'),
            fetch('/api/customer/get_customers')
        ]);

        const halls = await hallsRes.json();
        const enquiries = await enquiriesRes.json();
        const customers = await customersRes.json();

        document.getElementById('stat-halls').textContent = halls.total || 0;
        document.getElementById('stat-enquiries').textContent = enquiries.data?.length || 0;
        document.getElementById('stat-customers').textContent = customers.total || 0;
    } catch (err) {
        console.error('Error updating stats:', err);
    }
}

async function loadHalls() {
    const grid = document.getElementById('halls-grid');
    grid.innerHTML = '<div class="loader">Loading halls...</div>';

    try {
        const res = await fetch('/api/halls/get_halls');
        const json = await res.json();
        const halls = json.data || [];

        grid.innerHTML = halls.map(hall => `
            <div class="hall-card">
                <div class="hall-img">
                    ${hall.imageUrl ? `<img src="${hall.imageUrl}" alt="${hall.hall_name}" onerror="this.style.display='none'; this.parentElement.querySelector('i').style.display='flex';">` : ''}
                    <i class="fas fa-image" style="${hall.imageUrl ? 'display: none;' : ''}"></i>
                </div>
                <div class="hall-content">
                    <div class="hall-tags">
                        <span class="tag">#${hall.hall_id}</span>
                        <span class="tag">${hall.location}</span>
                    </div>
                    <h4>${hall.hall_name || 'Premium Hall'}</h4>
                    <p class="text-secondary">${hall.description || 'Stunning venue for your next event.'}</p>
                    <div class="hall-footer">
                        <div class="capacity">
                            <i class="fas fa-users"></i> ${hall.capacity}
                        </div>
                        <div class="price">$${hall.pricePerPerson}/person</div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        grid.innerHTML = `<div class="error">Failed to load halls: ${err.message}</div>`;
    }
}

async function loadRecentEnquiries() {
    const tbody = document.querySelector('#recent-enquiries-table tbody');
    try {
        const res = await fetch('/api/hall_owner/get_enquiry');
        const json = await res.json();
        const enquiries = json.data?.slice(0, 5) || [];

        tbody.innerHTML = enquiries.map(e => `
            <tr>
                <td>${e.customer_id}</td>
                <td>${e.hall_id}</td>
                <td><span class="status ${e.status?.toLowerCase() || 'pending'}">${e.status || 'Pending'}</span></td>
                <td><button class="btn btn-icon"><i class="fas fa-eye"></i></button></td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Error loading recent enquiries:', err);
    }
}

async function loadAllEnquiries() {
    const tbody = document.querySelector('#enquiries-table-full tbody');
    tbody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';

    try {
        const res = await fetch('/api/hall_owner/get_enquiry');
        const json = await res.json();
        const enquiries = json.data || [];

        tbody.innerHTML = enquiries.map(e => `
            <tr>
                <td>${e._id.substring(18)}</td>
                <td>${e.customer_id}</td>
                <td>${e.hall_id}</td>
                <td><span class="status ${e.status?.toLowerCase() || 'pending'}">${e.status || 'Pending'}</span></td>
                <td>${new Date(e.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-icon" title="View"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-icon" title="Edit"><i class="fas fa-pen"></i></button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="6">Error: ${err.message}</td></tr>`;
    }
}

async function loadCustomers() {
    const tbody = document.querySelector('#customers-table tbody');
    tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';

    try {
        const res = await fetch('/api/customer/get_customers');
        const json = await res.json();
        const customers = json.data || [];

        tbody.innerHTML = customers.map(c => `
            <tr>
                <td>CUST-${c.customer_id}</td>
                <td>${c.name}</td>
                <td>${c.email}</td>
                <td>${c.phone || 'N/A'}</td>
                <td><span class="status approved">Active</span></td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="5">Error: ${err.message}</td></tr>`;
    }
}
