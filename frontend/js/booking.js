/**
 * WhatNext Vision Motors - Test Drive Booking Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initBookingForm();
  loadVehiclesDropdown();
  initDateConstraints();
  autofillUserData();
});

// Load all vehicles into the booking form select dropdown
async function loadVehiclesDropdown() {
  const select = document.getElementById('bookingVehicleSelect');
  if (!select) return;

  try {
    const res = await window.WN_API.vehicles.getAll({ limit: 50 });
    const vehicles = res.vehicles || [];

    const urlParams = new URLSearchParams(window.location.search);
    const preselectedId = urlParams.get('vehicleId');

    select.innerHTML = '<option value="">-- Choose a Visionary Vehicle --</option>' +
      vehicles
        .map(
          (v) => `
        <option value="${v._id}" ${v._id === preselectedId ? 'selected' : ''}>
          ${v.name} (${v.vehicleType} • ${window.WN_API.formatCurrency(v.price)})
        </option>
      `
        )
        .join('');

    // If preselected, trigger preview update if card exists
    if (preselectedId) {
      updateVehiclePreview(preselectedId, vehicles);
    }

    select.addEventListener('change', (e) => {
      updateVehiclePreview(e.target.value, vehicles);
    });
  } catch (err) {
    console.error('Failed to populate vehicles in booking form:', err);
  }
}

// Update small preview widget when vehicle is selected
function updateVehiclePreview(vehicleId, vehiclesList) {
  const previewBox = document.getElementById('bookingVehiclePreview');
  if (!previewBox) return;

  const vehicle = vehiclesList.find((v) => v._id === vehicleId);
  if (!vehicle) {
    previewBox.style.display = 'none';
    return;
  }

  previewBox.style.display = 'flex';
  previewBox.innerHTML = `
    <img src="${vehicle.images[0]}" style="width: 90px; height: 60px; object-fit: cover; border-radius: 8px;" alt="${vehicle.name}">
    <div>
      <div style="font-weight: 700; color: #FFF; font-size: 1rem;">${vehicle.name}</div>
      <div style="font-size: 0.8rem; color: var(--primary);">${vehicle.fuelType} • ${vehicle.acceleration} • ${window.WN_API.formatCurrency(vehicle.price)}</div>
    </div>
  `;
}

// Restrict date selection to tomorrow onwards
function initDateConstraints() {
  const dateInput = document.getElementById('bookingDate');
  if (!dateInput) return;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];
  dateInput.setAttribute('min', minDate);
}

// Autofill fields if user is currently logged in
function autofillUserData() {
  const user = window.WN_API.getStoredUser();
  if (!user) return;

  const nameInput = document.getElementById('bookingName');
  const emailInput = document.getElementById('bookingEmail');
  const phoneInput = document.getElementById('bookingPhone');

  if (nameInput && !nameInput.value) nameInput.value = user.name;
  if (emailInput && !emailInput.value) emailInput.value = user.email;
  if (phoneInput && !phoneInput.value) phoneInput.value = user.phone || '';
}

// Handle booking form submission
function initBookingForm() {
  const form = document.getElementById('testDriveBookingForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');

    const vehicleId = document.getElementById('bookingVehicleSelect').value;
    const customerName = document.getElementById('bookingName').value.trim();
    const email = document.getElementById('bookingEmail').value.trim();
    const phone = document.getElementById('bookingPhone').value.trim();
    const preferredDate = document.getElementById('bookingDate').value;
    const preferredTime = document.getElementById('bookingTime').value;
    const dealershipLocation = document.getElementById('bookingLocation').value;
    const notes = document.getElementById('bookingNotes')?.value.trim() || '';

    if (!vehicleId || !customerName || !email || !phone || !preferredDate || !preferredTime || !dealershipLocation) {
      window.WN_API.showToast('Incomplete Form', 'Please fill out all required booking fields.', 'warning');
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner" style="width: 20px; height: 20px; margin: 0; border-width: 2px;"></span> Reserving Slot...';

      const res = await window.WN_API.bookings.create({
        vehicleId,
        customerName,
        email,
        phone,
        preferredDate,
        preferredTime,
        dealershipLocation,
        notes,
      });

      // Show confirmation modal
      showBookingConfirmationModal(res.booking);

      window.WN_API.showToast('Test Drive Confirmed', 'Your reservation has been recorded in MongoDB.', 'success');
      form.reset();
      autofillUserData();
    } catch (err) {
      window.WN_API.showToast('Booking Failed', err.message, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Confirm Test Drive Reservation';
    }
  });
}

// Display Booking Confirmation Modal receipt
function showBookingConfirmationModal(booking) {
  const modal = document.getElementById('bookingSuccessModal');
  const detailsContainer = document.getElementById('bookingConfirmationDetails');

  if (detailsContainer && booking) {
    detailsContainer.innerHTML = `
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎉</div>
        <div style="font-family: var(--font-mono); color: var(--primary); font-size: 0.9rem; font-weight: 700; letter-spacing: 0.08em;">
          BOOKING REFERENCE: ${booking.bookingReference || 'WNV-CONFIRMED'}
        </div>
      </div>
      <div style="background: rgba(8, 12, 21, 0.7); padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-glass); margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem; font-size: 0.9rem;">
          <span style="color: var(--text-dim);">Vehicle:</span>
          <span style="color: #FFF; font-weight: 600;">${booking.vehicle?.name || 'WhatNext Vision Model'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem; font-size: 0.9rem;">
          <span style="color: var(--text-dim);">Driver Name:</span>
          <span style="color: #FFF; font-weight: 600;">${booking.customerName}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem; font-size: 0.9rem;">
          <span style="color: var(--text-dim);">Date & Time:</span>
          <span style="color: #FFF; font-weight: 600;">${booking.preferredDate} (${booking.preferredTime})</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
          <span style="color: var(--text-dim);">Location Hub:</span>
          <span style="color: var(--primary); font-weight: 600;">${booking.dealershipLocation}</span>
        </div>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); text-align: center;">
        A concierge confirmation email with access pass and preparation guidelines has been dispatched to <strong>${booking.email}</strong>.
      </p>
    `;
  }

  if (modal) {
    modal.classList.add('show');
    const closeBtn = document.getElementById('closeBookingSuccessModal');
    if (closeBtn) {
      closeBtn.onclick = () => modal.classList.remove('show');
    }
  }
}
