/**
 * WhatNext Vision Motors - Admin Control Center
 */

let allVehicles = [];
let allBookings = [];
let allInquiries = [];
let allUsers = [];
let editingVehicleId = null;

document.addEventListener('DOMContentLoaded', () => {
  // Admin Guard
  const user = window.WN_API.getStoredUser();
  if (!user || user.role !== 'admin') {
    window.WN_API.showToast('Access Restricted', 'Admin authorization required.', 'error');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
    return;
  }

  // Display Admin Info
  const adminName = document.getElementById('adminUserName');
  if (adminName) adminName.innerText = user.name;

  initAdminNavigation();
  initVehicleModalForm();
  loadDashboardData();
});

// Sidebar Navigation Tabs
function initAdminNavigation() {
  const navItems = document.querySelectorAll('.admin-nav-item[data-tab]');
  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  const sidebarToggle = document.getElementById('adminSidebarToggle');
  const sidebar = document.getElementById('adminSidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

function switchTab(tabId) {
  // Update sidebar active classes
  document.querySelectorAll('.admin-nav-item').forEach((i) => i.classList.remove('active'));
  const activeNav = document.querySelector(`.admin-nav-item[data-tab="${tabId}"]`);
  if (activeNav) activeNav.classList.add('active');

  // Update tab contents
  document.querySelectorAll('.admin-tab-content').forEach((c) => (c.style.display = 'none'));
  const targetContent = document.getElementById(`tabContent-${tabId}`);
  if (targetContent) targetContent.style.display = 'block';

  // Load specific data on tab switch
  if (tabId === 'overview') loadDashboardData();
  else if (tabId === 'vehicles') loadAdminVehicles();
  else if (tabId === 'bookings') loadAdminBookings();
  else if (tabId === 'inquiries') loadAdminInquiries();
  else if (tabId === 'users') loadAdminUsers();
}

// 1. Dashboard Overview Stats & Recents
async function loadDashboardData() {
  try {
    const res = await window.WN_API.admin.getStats();
    const stats = res.stats || {};

    // Update KPI numbers
    document.getElementById('statTotalVehicles').innerText = stats.totalVehicles || 0;
    document.getElementById('statTotalUsers').innerText = stats.totalUsers || 0;
    document.getElementById('statTotalBookings').innerText = stats.totalBookings || 0;
    document.getElementById('statPendingBookings').innerText = stats.pendingBookings || 0;
    document.getElementById('statNewInquiries').innerText = stats.newInquiries || 0;

    // Render Recent Bookings in overview
    const recentBookingsTable = document.getElementById('overviewRecentBookings');
    if (recentBookingsTable && stats.recentBookings) {
      if (stats.recentBookings.length === 0) {
        recentBookingsTable.innerHTML = '<tr><td colspan="5" class="text-center">No bookings recorded yet.</td></tr>';
      } else {
        recentBookingsTable.innerHTML = stats.recentBookings
          .map(
            (b) => `
          <tr>
            <td><strong>${b.bookingReference || 'WNV-TD'}</strong></td>
            <td>${b.customerName}</td>
            <td>${b.vehicle?.name || 'Vehicle'}</td>
            <td>${b.preferredDate}</td>
            <td><span class="table-badge-status status-${b.status.toLowerCase()}">${b.status}</span></td>
          </tr>
        `
          )
          .join('');
      }
    }

    // Render Recent Inquiries in overview
    const recentInquiriesTable = document.getElementById('overviewRecentInquiries');
    if (recentInquiriesTable && stats.recentInquiries) {
      if (stats.recentInquiries.length === 0) {
        recentInquiriesTable.innerHTML = '<tr><td colspan="4" class="text-center">No inquiries received yet.</td></tr>';
      } else {
        recentInquiriesTable.innerHTML = stats.recentInquiries
          .map(
            (m) => `
          <tr>
            <td><strong>${m.name}</strong></td>
            <td>${m.subject}</td>
            <td>${m.inquiryType || 'General'}</td>
            <td><span class="table-badge-status status-${m.status.toLowerCase()}">${m.status}</span></td>
          </tr>
        `
          )
          .join('');
      }
    }
  } catch (err) {
    console.error('Failed to load dashboard stats:', err);
  }
}

// 2. Vehicles Fleet Management
async function loadAdminVehicles() {
  const tableBody = document.getElementById('adminVehiclesTableBody');
  if (!tableBody) return;

  tableBody.innerHTML = '<tr><td colspan="7" class="text-center"><div class="spinner"></div></td></tr>';

  try {
    const res = await window.WN_API.vehicles.getAll({ limit: 100 });
    allVehicles = res.vehicles || [];

    renderVehiclesTable(allVehicles);
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center" style="color: var(--danger);">Failed to load vehicles: ${err.message}</td></tr>`;
  }
}

function renderVehiclesTable(vehicles) {
  const tableBody = document.getElementById('adminVehiclesTableBody');
  if (!tableBody) return;

  if (vehicles.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="7" class="text-center">No vehicles in inventory. Add your first vehicle!</td></tr>';
    return;
  }

  tableBody.innerHTML = vehicles
    .map(
      (v) => `
    <tr>
      <td>
        <div class="table-vehicle-cell">
          <img src="${v.images && v.images[0] ? v.images[0] : 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=100&q=80'}" class="table-thumb" alt="${v.name}">
          <div>
            <div style="font-weight: 700; color: #FFF;">${v.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-dim);">${v.model} • ${v.releaseYear}</div>
          </div>
        </div>
      </td>
      <td><span style="color: var(--primary); font-family: var(--font-mono);">${v.vehicleType}</span></td>
      <td><strong>${v.fuelType}</strong></td>
      <td><strong style="color: var(--primary);">${window.WN_API.formatCurrency(v.price)}</strong></td>
      <td>${v.rangeOrMileage}</td>
      <td>
        <span class="table-badge-status ${v.isAvailable ? 'status-confirmed' : 'status-cancelled'}">
          ${v.isAvailable ? 'Available' : 'Unavailable'}
        </span>
      </td>
      <td>
        <div class="table-actions">
          <button class="action-btn-sm" onclick="openEditVehicleModal('${v._id}')" title="Edit Vehicle">✏️ Edit</button>
          <button class="action-btn-sm action-btn-danger" onclick="deleteVehicleConfirm('${v._id}', '${v.name.replace(/'/g, "\\'")}')" title="Delete Vehicle">🗑️ Delete</button>
        </div>
      </td>
    </tr>
  `
    )
    .join('');
}

// Vehicle Add/Edit Modal
function initVehicleModalForm() {
  const addBtn = document.getElementById('addNewVehicleBtn');
  const modal = document.getElementById('vehicleModal');
  const closeBtn = document.getElementById('closeVehicleModal');
  const form = document.getElementById('vehicleForm');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      editingVehicleId = null;
      document.getElementById('vehicleModalTitle').innerText = 'Add New Visionary Vehicle';
      if (form) form.reset();
      modal.classList.add('show');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('show'));
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');

      const name = document.getElementById('vName').value.trim();
      const model = document.getElementById('vModel').value.trim();
      const vehicleType = document.getElementById('vType').value;
      const price = Number(document.getElementById('vPrice').value);
      const fuelType = document.getElementById('vFuel').value;
      const rangeOrMileage = document.getElementById('vRange').value.trim();
      const transmission = document.getElementById('vTransmission').value;
      const seatingCapacity = Number(document.getElementById('vSeats').value);
      const topSpeed = document.getElementById('vTopSpeed').value.trim();
      const acceleration = document.getElementById('vAcceleration').value.trim();
      const horsepower = document.getElementById('vPower').value.trim();
      const batteryCapacity = document.getElementById('vBattery').value.trim();
      const releaseYear = Number(document.getElementById('vYear').value);
      const badge = document.getElementById('vBadge').value.trim();
      const description = document.getElementById('vDescription').value.trim();

      // Parse images (comma-separated or lines)
      const imagesInput = document.getElementById('vImages').value.trim();
      const images = imagesInput
        ? imagesInput.split('\n').map((s) => s.trim()).filter((s) => s.length > 0)
        : ['https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80'];

      // Parse features (comma-separated)
      const featuresInput = document.getElementById('vFeatures').value.trim();
      const features = featuresInput
        ? featuresInput.split(',').map((s) => s.trim()).filter((s) => s.length > 0)
        : [];

      const payload = {
        name,
        model,
        vehicleType,
        price,
        fuelType,
        rangeOrMileage,
        transmission,
        seatingCapacity,
        topSpeed,
        acceleration,
        horsepower,
        batteryCapacity,
        releaseYear,
        badge,
        description,
        images,
        features,
        isAvailable: document.getElementById('vAvailable').checked,
        isFeatured: document.getElementById('vFeatured').checked,
      };

      try {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Saving...';

        if (editingVehicleId) {
          await window.WN_API.vehicles.update(editingVehicleId, payload);
          window.WN_API.showToast('Vehicle Updated', `${name} updated successfully.`, 'success');
        } else {
          await window.WN_API.vehicles.create(payload);
          window.WN_API.showToast('Vehicle Created', `${name} added to inventory.`, 'success');
        }

        modal.classList.remove('show');
        loadAdminVehicles();
        loadDashboardData();
      } catch (err) {
        window.WN_API.showToast('Operation Failed', err.message, 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Save Vehicle';
      }
    });
  }
}

// Open Edit Vehicle Modal with populated fields
window.openEditVehicleModal = (id) => {
  const v = allVehicles.find((item) => item._id === id);
  if (!v) return;

  editingVehicleId = id;
  document.getElementById('vehicleModalTitle').innerText = `Edit: ${v.name}`;

  document.getElementById('vName').value = v.name || '';
  document.getElementById('vModel').value = v.model || '';
  document.getElementById('vType').value = v.vehicleType || 'Sedan';
  document.getElementById('vPrice').value = v.price || '';
  document.getElementById('vFuel').value = v.fuelType || 'EV';
  document.getElementById('vRange').value = v.rangeOrMileage || '';
  document.getElementById('vTransmission').value = v.transmission || 'Single-Speed EV';
  document.getElementById('vSeats').value = v.seatingCapacity || 5;
  document.getElementById('vTopSpeed').value = v.topSpeed || '';
  document.getElementById('vAcceleration').value = v.acceleration || '';
  document.getElementById('vPower').value = v.horsepower || '';
  document.getElementById('vBattery').value = v.batteryCapacity || '';
  document.getElementById('vYear').value = v.releaseYear || 2026;
  document.getElementById('vBadge').value = v.badge || '';
  document.getElementById('vDescription').value = v.description || '';
  document.getElementById('vImages').value = (v.images || []).join('\n');
  document.getElementById('vFeatures').value = (v.features || []).join(', ');
  document.getElementById('vAvailable').checked = v.isAvailable !== false;
  document.getElementById('vFeatured').checked = v.isFeatured === true;

  document.getElementById('vehicleModal').classList.add('show');
};

// Delete Vehicle Confirmation
window.deleteVehicleConfirm = async (id, name) => {
  if (confirm(`Are you sure you want to permanently delete "${name}" from inventory?`)) {
    try {
      await window.WN_API.vehicles.delete(id);
      window.WN_API.showToast('Vehicle Deleted', 'Vehicle removed from database.', 'info');
      loadAdminVehicles();
      loadDashboardData();
    } catch (err) {
      window.WN_API.showToast('Delete Failed', err.message, 'error');
    }
  }
};

// 3. Bookings Management
async function loadAdminBookings() {
  const tableBody = document.getElementById('adminBookingsTableBody');
  if (!tableBody) return;

  tableBody.innerHTML = '<tr><td colspan="7" class="text-center"><div class="spinner"></div></td></tr>';

  try {
    const res = await window.WN_API.bookings.getAll({ limit: 100 });
    allBookings = res.bookings || [];

    if (allBookings.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" class="text-center">No test-drive bookings found.</td></tr>';
      return;
    }

    tableBody.innerHTML = allBookings
      .map(
        (b) => `
      <tr>
        <td><strong style="font-family: var(--font-mono); color: var(--primary);">${b.bookingReference || 'WNV-TD'}</strong></td>
        <td>
          <div style="font-weight: 700; color: #FFF;">${b.customerName}</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">${b.email} • ${b.phone}</div>
        </td>
        <td><strong>${b.vehicle?.name || 'WhatNext Vehicle'}</strong></td>
        <td>${b.preferredDate} (${b.preferredTime})</td>
        <td><span style="font-size: 0.8rem; color: var(--text-muted);">${b.dealershipLocation}</span></td>
        <td>
          <select class="select-field" style="padding: 0.3rem 0.5rem; font-size: 0.8rem; width: auto;" onchange="updateBookingStatus('${b._id}', this.value)">
            <option value="Pending" ${b.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Confirmed" ${b.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Completed" ${b.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Cancelled" ${b.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>
          <button class="action-btn-sm action-btn-danger" onclick="deleteBookingConfirm('${b._id}')">🗑️</button>
        </td>
      </tr>
    `
      )
      .join('');
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center" style="color: var(--danger);">Failed to load bookings: ${err.message}</td></tr>`;
  }
}

window.updateBookingStatus = async (id, newStatus) => {
  try {
    await window.WN_API.bookings.updateStatus(id, { status: newStatus });
    window.WN_API.showToast('Status Updated', `Booking status changed to ${newStatus}`, 'success');
    loadDashboardData();
  } catch (err) {
    window.WN_API.showToast('Update Failed', err.message, 'error');
  }
};

window.deleteBookingConfirm = async (id) => {
  if (confirm('Delete this test drive booking record?')) {
    try {
      await window.WN_API.bookings.delete(id);
      window.WN_API.showToast('Deleted', 'Booking record removed.', 'info');
      loadAdminBookings();
      loadDashboardData();
    } catch (err) {
      window.WN_API.showToast('Error', err.message, 'error');
    }
  }
};

// 4. Contact Inquiries Management
async function loadAdminInquiries() {
  const tableBody = document.getElementById('adminInquiriesTableBody');
  if (!tableBody) return;

  tableBody.innerHTML = '<tr><td colspan="6" class="text-center"><div class="spinner"></div></td></tr>';

  try {
    const res = await window.WN_API.contact.getAll();
    allInquiries = res.messages || [];

    if (allInquiries.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No contact inquiries received yet.</td></tr>';
      return;
    }

    tableBody.innerHTML = allInquiries
      .map(
        (m) => `
      <tr>
        <td>
          <div style="font-weight: 700; color: #FFF;">${m.name}</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">${m.email} ${m.phone ? '• ' + m.phone : ''}</div>
        </td>
        <td><strong>${m.subject}</strong></td>
        <td><span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--primary);">${m.inquiryType || 'General'}</span></td>
        <td>
          <select class="select-field" style="padding: 0.3rem 0.5rem; font-size: 0.8rem; width: auto;" onchange="updateInquiryStatus('${m._id}', this.value)">
            <option value="New" ${m.status === 'New' ? 'selected' : ''}>New</option>
            <option value="Read" ${m.status === 'Read' ? 'selected' : ''}>Read</option>
            <option value="Replied" ${m.status === 'Replied' ? 'selected' : ''}>Replied</option>
            <option value="Archived" ${m.status === 'Archived' ? 'selected' : ''}>Archived</option>
          </select>
        </td>
        <td><button class="action-btn-sm" onclick="viewInquiryMessage('${m._id}')">👁️ View Message</button></td>
        <td><button class="action-btn-sm action-btn-danger" onclick="deleteInquiryConfirm('${m._id}')">🗑️</button></td>
      </tr>
    `
      )
      .join('');
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="color: var(--danger);">Failed to load inquiries: ${err.message}</td></tr>`;
  }
}

window.viewInquiryMessage = (id) => {
  const m = allInquiries.find((item) => item._id === id);
  if (!m) return;
  alert(`From: ${m.name} (${m.email})\nSubject: ${m.subject}\nType: ${m.inquiryType}\n\nMessage:\n${m.message}`);
};

window.updateInquiryStatus = async (id, newStatus) => {
  try {
    await window.WN_API.contact.updateStatus(id, { status: newStatus });
    window.WN_API.showToast('Inquiry Status', `Marked as ${newStatus}`, 'success');
  } catch (err) {
    window.WN_API.showToast('Error', err.message, 'error');
  }
};

window.deleteInquiryConfirm = async (id) => {
  if (confirm('Delete this contact message?')) {
    try {
      await window.WN_API.contact.delete(id);
      window.WN_API.showToast('Deleted', 'Inquiry removed.', 'info');
      loadAdminInquiries();
      loadDashboardData();
    } catch (err) {
      window.WN_API.showToast('Error', err.message, 'error');
    }
  }
};

// 5. Users Management
async function loadAdminUsers() {
  const tableBody = document.getElementById('adminUsersTableBody');
  if (!tableBody) return;

  tableBody.innerHTML = '<tr><td colspan="6" class="text-center"><div class="spinner"></div></td></tr>';

  try {
    const res = await window.WN_API.admin.getUsers();
    allUsers = res.users || [];

    if (allUsers.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No registered users found.</td></tr>';
      return;
    }

    tableBody.innerHTML = allUsers
      .map(
        (u) => `
      <tr>
        <td>
          <div style="font-weight: 700; color: #FFF;">${u.name}</div>
        </td>
        <td>${u.email}</td>
        <td>${u.phone || 'N/A'}</td>
        <td>
          <span class="table-badge-status ${u.role === 'admin' ? 'status-cancelled' : 'status-confirmed'}">
            ${u.role.toUpperCase()}
          </span>
        </td>
        <td>${window.WN_API.formatDate(u.createdAt)}</td>
        <td>
          <button class="action-btn-sm" onclick="toggleUserRole('${u._id}', '${u.role}')">
            ${u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
          </button>
        </td>
      </tr>
    `
      )
      .join('');
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="color: var(--danger);">Failed to load users: ${err.message}</td></tr>`;
  }
}

window.toggleUserRole = async (id, currentRole) => {
  const newRole = currentRole === 'admin' ? 'user' : 'admin';
  if (confirm(`Change user role from ${currentRole} to ${newRole}?`)) {
    try {
      await window.WN_API.admin.updateUserRole(id, newRole);
      window.WN_API.showToast('Role Updated', `User role changed to ${newRole}`, 'success');
      loadAdminUsers();
      loadDashboardData();
    } catch (err) {
      window.WN_API.showToast('Role Update Failed', err.message, 'error');
    }
  }
};
