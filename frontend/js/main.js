/**
 * WhatNext Vision Motors - Home Page Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  loadFeaturedVehicles();
  initHeroSearch();
  animateCounters();
});

// Load featured vehicles for home showcase with futuristic cyber cards
async function loadFeaturedVehicles() {
  const container = document.getElementById('featuredVehiclesContainer');
  if (!container) return;

  try {
    const res = await window.WN_API.vehicles.getFeatured();
    const vehicles = res.vehicles || [];

    if (vehicles.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">🏎️</div>
          <h3>Inventory Updating</h3>
          <p>New visionary vehicles are being prepared. Check back shortly.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = vehicles
      .map(
        (v) => `
      <div class="vehicle-cyber-card">
        <div class="cyber-card-media">
          <img src="${v.images && v.images[0] ? v.images[0] : 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80'}" alt="${v.name}" loading="lazy">
          <span class="cyber-badge-tag ${v.fuelType}">⚡ ${v.fuelType}</span>
          <span class="cyber-status-tag ${v.isAvailable ? 'status-active' : 'status-reserved'}">
            ${v.isAvailable ? 'Available' : 'Reserved'}
          </span>
        </div>
        <div class="cyber-card-content">
          <div class="cyber-card-category">${v.vehicleType} // ${v.releaseYear || 2026}</div>
          <h3 class="cyber-card-name">${v.name}</h3>
          <p class="cyber-card-desc">${v.description}</p>
          
          <div class="cyber-telemetry-bar">
            <div class="telemetry-mini-node">
              <div class="telemetry-mini-val">${v.rangeOrMileage ? v.rangeOrMileage.split(' ')[0] : '500+'}</div>
              <div class="telemetry-mini-lbl">Range</div>
            </div>
            <div class="telemetry-mini-node">
              <div class="telemetry-mini-val">${v.acceleration || '2.8s'}</div>
              <div class="telemetry-mini-lbl">0-60 MPH</div>
            </div>
            <div class="telemetry-mini-node">
              <div class="telemetry-mini-val">${v.horsepower || '650 hp'}</div>
              <div class="telemetry-mini-lbl">Power</div>
            </div>
          </div>

          <div class="cyber-card-footer">
            <div class="price-quantum">
              <span style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-dim); text-transform: uppercase;">MSRP Starting</span>
              <span class="price-val">${window.WN_API.formatCurrency(v.price)}</span>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <a href="vehicle-details.html?id=${v._id}" class="btn btn-outline btn-sm">Blueprint</a>
              <a href="test-drive.html?vehicleId=${v._id}" class="btn btn-primary btn-sm">Drive</a>
            </div>
          </div>
        </div>
      </div>
    `
      )
      .join('');
  } catch (err) {
    console.error('Failed to load featured vehicles:', err);
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">⚠️</div>
        <h3>Unable to load featured inventory</h3>
        <p>Please check back momentarily.</p>
      </div>
    `;
  }
}

// Hero Quick Search
function initHeroSearch() {
  const form = document.getElementById('heroSearchForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('heroSearchInput').value.trim();
    if (query) {
      window.location.href = `vehicles.html?search=${encodeURIComponent(query)}`;
    } else {
      window.location.href = 'vehicles.html';
    }
  });
}

// Animated stats counter in hero
function animateCounters() {
  const counters = document.querySelectorAll('.telemetry-val [data-target]');
  counters.forEach((counter) => {
    const target = +counter.getAttribute('data-target');
    const increment = target / 40;
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.innerText = Math.ceil(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.innerText = target;
      }
    };
    updateCounter();
  });
}
