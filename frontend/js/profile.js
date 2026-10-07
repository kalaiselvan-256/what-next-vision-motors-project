/**
 * WhatNext Vision Motors - User Profile & Bookings Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const user = window.WN_API.getStoredUser();
  if (!user) {
    window.WN_API.showToast('Authentication Required', 'Please login to access your account.', 'warning');
    setTimeout(() => (window.location.href = 'login.html'), 800);
    return;
  }

  renderUserProfile(user);
  loadMyBookings();
  initUpdateProfileForm();
});

// Render user profile details
function renderUserProfile(user) {
  const nameEl = document.getElementById('profileUserName');
  const emailEl = document.getElementById('profileUserEmail');
  const phoneEl = document.getElementById('profileUserPhone');
  const roleEl = document.getElementById('profileUserRole');
  const avatarEl = document.getElementById('profileAvatarImg');

  if (nameEl) nameEl.innerText = user.name;
  if (emailEl) emailEl.innerText = user.email;
  if (phoneEl) phoneEl.innerText = user.phone || 'Not provided';
  if (roleEl) roleEl.innerText = user.role.toUpperCase();
  if (avatarEl && user.avatar) avatarEl.src = user.avatar;

  const formName = document.getElementById('editName');
  const formPhone = document.getElementById('editPhone');
  if (formName) formName.value = user.name;
  if (formPhone) formPhone.value = user.phone || '';
}

// Load user's booked test drives
async function loadMyBookings() {
  const container = document.getElementById('myBookingsContainer');
  if (!container) return;

  try {
    const res = await window.WN_API.bookings.getMyBookings();
    const bookings = res.bookings || [];

    if (bookings.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📅</div>
          <h3>No Test Drives Reserved Yet</h3>
          <p>You haven't scheduled any vehicle test drives. Explore our inventory to reserve a ride.</p>
          <a href="vehicles.html" class="btn btn-primary btn-sm" style="margin-top: 1rem;">Explore Fleet</a>
        </div>
      `;
      return;
    }

    container.innerHTML = bookings
      .map(
        (b) => `
      <div style="background: var(--bg-surface); border: 1px solid var(--border-glass); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 1.25rem;">
          <img src="${b.vehicle?.images ? b.vehicle.images[0] : 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80'}" style="width: 100px; height: 70px; object-fit: cover; border-radius: 8px;" alt="${b.vehicle?.name || 'Vehicle'}">
          <div>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--primary);">${b.bookingReference}</div>
            <h4 style="margin: 0.2rem 0; font-size: 1.15rem;">${b.vehicle?.name || 'WhatNext Vision Model'}</h4>
            <div style="font-size: 0.85rem; color: var(--text-muted);">
              📍 ${b.dealershipLocation} • 🕒 ${b.preferredDate} (${b.preferredTime})
            </div>
          </div>
        </div>
        <div>
          <span class="table-badge-status status-${b.status.toLowerCase()}">${b.status}</span>
        </div>
      </div>
    `
      )
      .join('');
  } catch (err) {
    console.error('Error fetching bookings:', err);
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3>Failed to load your test drives</h3>
        <p>${err.message}</p>
      </div>
    `;
  }
}

// Handle Profile Update
function initUpdateProfileForm() {
  const form = document.getElementById('updateProfileForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const name = document.getElementById('editName').value.trim();
    const phone = document.getElementById('editPhone').value.trim();
    const password = document.getElementById('editPassword').value;

    const payload = { name, phone };
    if (password) payload.password = password;

    try {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Updating...';

      const res = await window.WN_API.auth.updateProfile(payload);
      const currentToken = window.WN_API.getStoredToken();
      window.WN_API.setAuthData(currentToken, res.user);

      renderUserProfile(res.user);
      window.WN_API.showToast('Profile Updated', 'Your profile details have been updated.', 'success');
      document.getElementById('editPassword').value = '';
    } catch (err) {
      window.WN_API.showToast('Update Failed', err.message, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = 'Save Profile Changes';
    }
  });
}
