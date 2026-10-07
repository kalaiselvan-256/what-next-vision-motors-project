/**
 * WhatNext Vision Motors - Vehicle Detail Showcase Controller
 */

let activeVehicle = null;

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const vehicleId = urlParams.get('id');

  if (!vehicleId) {
    window.WN_API.showToast('Vehicle Not Specified', 'Redirecting to vehicle showroom...', 'warning');
    setTimeout(() => (window.location.href = 'vehicles.html'), 1000);
    return;
  }

  loadVehicleDetails(vehicleId);
});

// Load vehicle details by ID
async function loadVehicleDetails(id) {
  const container = document.getElementById('vehicleDetailContainer');
  if (!container) return;

  try {
    const res = await window.WN_API.vehicles.getById(id);
    activeVehicle = res.vehicle;

    if (!activeVehicle) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🏎️</div>
          <h2>Vehicle Not Found</h2>
          <p>The requested vehicle is no longer available in our active catalog.</p>
          <a href="vehicles.html" class="btn btn-primary" style="margin-top: 1rem;">Browse All Vehicles</a>
        </div>
      `;
      return;
    }

    renderVehicleDetails(activeVehicle);
  } catch (err) {
    console.error('Error fetching vehicle:', err);
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h2>Error Loading Vehicle</h2>
        <p>${err.message}</p>
        <a href="vehicles.html" class="btn btn-outline" style="margin-top: 1rem;">Back to Showroom</a>
      </div>
    `;
  }
}

// Render dynamic elements into page
function renderVehicleDetails(v) {
  document.title = `${v.name} | WhatNext Vision Motors`;

  // Main Header Details
  const titleEl = document.getElementById('vehicleName');
  const typeEl = document.getElementById('vehicleTypeBadge');
  const priceEl = document.getElementById('vehiclePrice');
  const descEl = document.getElementById('vehicleDescription');
  const badgeEl = document.getElementById('vehicleSpecialBadge');

  if (titleEl) titleEl.innerText = v.name;
  if (typeEl) typeEl.innerText = `${v.vehicleType} • ${v.fuelType}`;
  if (badgeEl) badgeEl.innerText = v.badge || 'Flagship Edition';
  if (priceEl) priceEl.innerText = window.WN_API.formatCurrency(v.price);
  if (descEl) descEl.innerText = v.description;

  // Monthly EMI Estimate Calculation (5-year loan @ 4.5% APR)
  const emiEl = document.getElementById('calculatedEmi');
  if (emiEl) {
    const monthlyRate = 0.045 / 12;
    const months = 60;
    const emi = (v.price * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    emiEl.innerText = `${window.WN_API.formatCurrency(Math.round(emi))}/mo`;
  }

  // Key Metrics Banner
  const metric0to60 = document.getElementById('metric0to60');
  const metricRange = document.getElementById('metricRange');
  const metricPower = document.getElementById('metricPower');
  const metricTopSpeed = document.getElementById('metricTopSpeed');

  if (metric0to60) metric0to60.innerText = v.acceleration || '2.8s';
  if (metricRange) metricRange.innerText = v.rangeOrMileage || '500+ mi';
  if (metricPower) metricPower.innerText = v.horsepower || '650 hp';
  if (metricTopSpeed) metricTopSpeed.innerText = v.topSpeed || '200 mph';

  // Render Image Gallery
  const mainImage = document.getElementById('galleryMainImage');
  const thumbsStrip = document.getElementById('galleryThumbsStrip');
  const images = v.images && v.images.length > 0 ? v.images : ['https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80'];

  if (mainImage) mainImage.src = images[0];

  if (thumbsStrip) {
    thumbsStrip.innerHTML = images
      .map(
        (imgUrl, idx) => `
      <div class="gallery-thumb ${idx === 0 ? 'active' : ''}" onclick="switchGalleryImage('${imgUrl}', this)">
        <img src="${imgUrl}" alt="Gallery Thumbnail ${idx + 1}">
      </div>
    `
      )
      .join('');
  }

  // Features Checklist
  const featuresList = document.getElementById('vehicleFeaturesList');
  if (featuresList && v.features) {
    featuresList.innerHTML = v.features
      .map(
        (feat) => `
      <div class="feature-check-item">
        <span class="icon">✦</span>
        <span>${feat}</span>
      </div>
    `
      )
      .join('');
  }

  // Technical Specifications Table
  const specsTableBody = document.getElementById('specsTableBody');
  if (specsTableBody) {
    const s = v.specs || {};
    specsTableBody.innerHTML = `
      <tr><td>Powertrain Motor</td><td>${s.motor || 'Dual Synchronous Electric'}</td></tr>
      <tr><td>Drivetrain System</td><td>${s.drivetrain || 'All-Wheel Drive (AWD)'}</td></tr>
      <tr><td>Battery Pack Architecture</td><td>${v.batteryCapacity || '100 kWh Ultium'}</td></tr>
      <tr><td>Fast Charging Speed</td><td>${s.chargingTime || '10% to 80% in 18 min (350kW DC)'}</td></tr>
      <tr><td>Seating Capacity</td><td>${v.seatingCapacity || 5} Passengers</td></tr>
      <tr><td>Transmission</td><td>${v.transmission || 'Single-Speed Direct Drive'}</td></tr>
      <tr><td>Exterior Dimensions</td><td>${s.dimensions || '4,960mm L x 1,960mm W x 1,420mm H'}</td></tr>
      <tr><td>Luggage & Cargo Capacity</td><td>${s.cargoSpace || '680 Litres'}</td></tr>
      <tr><td>Factory Warranty</td><td>${s.warranty || '8-Year / 100,000-Mile Battery & Powertrain'}</td></tr>
    `;
  }

  // Set Test Drive button link
  const bookBtn = document.getElementById('detailBookTestDriveBtn');
  if (bookBtn) {
    bookBtn.href = `test-drive.html?vehicleId=${v._id}`;
  }
}

// Global function to switch main image
window.switchGalleryImage = (imageUrl, el) => {
  const mainImage = document.getElementById('galleryMainImage');
  if (mainImage) {
    mainImage.style.opacity = '0.4';
    setTimeout(() => {
      mainImage.src = imageUrl;
      mainImage.style.opacity = '1';
    }, 150);
  }

  document.querySelectorAll('.gallery-thumb').forEach((th) => th.classList.remove('active'));
  if (el) el.classList.add('active');
};
