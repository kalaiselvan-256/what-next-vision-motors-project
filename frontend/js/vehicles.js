/**
 * WhatNext Vision Motors - Vehicle Inventory & Catalog Controller
 */

let currentFilters = {
  search: '',
  vehicleType: 'all',
  fuelType: 'all',
  maxPrice: '',
  sort: 'newest',
  isAvailable: 'all',
  page: 1,
};

document.addEventListener('DOMContentLoaded', () => {
  parseUrlParams();
  initFilterControls();
  fetchAndRenderVehicles();
});

// Read URL Query parameters into initial filters
function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('search')) currentFilters.search = params.get('search');
  if (params.get('type')) currentFilters.vehicleType = params.get('type');
  if (params.get('fuel')) currentFilters.fuelType = params.get('fuel');
  if (params.get('sort')) currentFilters.sort = params.get('sort');

  const searchInput = document.getElementById('inventorySearchInput');
  const typeSelect = document.getElementById('filterVehicleType');
  const fuelSelect = document.getElementById('filterFuelType');
  const sortSelect = document.getElementById('filterSort');

  if (searchInput && currentFilters.search) searchInput.value = currentFilters.search;
  if (typeSelect && currentFilters.vehicleType) typeSelect.value = currentFilters.vehicleType;
  if (fuelSelect && currentFilters.fuelType) fuelSelect.value = currentFilters.fuelType;
  if (sortSelect && currentFilters.sort) sortSelect.value = currentFilters.sort;
}

// Bind event listeners for search and filters
function initFilterControls() {
  const searchInput = document.getElementById('inventorySearchInput');
  const typeSelect = document.getElementById('filterVehicleType');
  const fuelSelect = document.getElementById('filterFuelType');
  const priceSlider = document.getElementById('filterPriceSlider');
  const priceDisplay = document.getElementById('priceDisplay');
  const sortSelect = document.getElementById('filterSort');
  const resetBtn = document.getElementById('resetFiltersBtn');
  const searchForm = document.getElementById('inventoryFilterForm');

  // Debounced Search Input
  let debounceTimeout;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        currentFilters.search = e.target.value.trim();
        currentFilters.page = 1;
        fetchAndRenderVehicles();
      }, 300);
    });
  }

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      currentFilters.search = searchInput ? searchInput.value.trim() : '';
      fetchAndRenderVehicles();
    });
  }

  if (typeSelect) {
    typeSelect.addEventListener('change', (e) => {
      currentFilters.vehicleType = e.target.value;
      currentFilters.page = 1;
      fetchAndRenderVehicles();
    });
  }

  if (fuelSelect) {
    fuelSelect.addEventListener('change', (e) => {
      currentFilters.fuelType = e.target.value;
      currentFilters.page = 1;
      fetchAndRenderVehicles();
    });
  }

  if (priceSlider && priceDisplay) {
    priceSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      priceDisplay.innerText = val >= 350000 ? 'Any Price' : window.WN_API.formatCurrency(val);
      currentFilters.maxPrice = val >= 350000 ? '' : val;
    });

    priceSlider.addEventListener('change', () => {
      currentFilters.page = 1;
      fetchAndRenderVehicles();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentFilters.sort = e.target.value;
      fetchAndRenderVehicles();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentFilters = {
        search: '',
        vehicleType: 'all',
        fuelType: 'all',
        maxPrice: '',
        sort: 'newest',
        isAvailable: 'all',
        page: 1,
      };

      if (searchInput) searchInput.value = '';
      if (typeSelect) typeSelect.value = 'all';
      if (fuelSelect) fuelSelect.value = 'all';
      if (sortSelect) sortSelect.value = 'newest';
      if (priceSlider) priceSlider.value = 350000;
      if (priceDisplay) priceDisplay.innerText = 'Any Price';

      fetchAndRenderVehicles();
    });
  }
}

// Fetch vehicles from REST API
async function fetchAndRenderVehicles() {
  const container = document.getElementById('inventoryGrid');
  const countDisplay = document.getElementById('resultsCount');
  if (!container) return;

  container.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 0;">
      <div class="spinner"></div>
      <p style="color: var(--text-muted); margin-top: 1rem;">Scanning WhatNext vehicle inventory...</p>
    </div>
  `;

  try {
    const res = await window.WN_API.vehicles.getAll(currentFilters);
    const vehicles = res.vehicles || [];

    if (countDisplay) {
      countDisplay.innerText = `Displaying ${vehicles.length} of ${res.total || vehicles.length} visionary prototypes`;
    }

    if (vehicles.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">🔍</div>
          <h3>No Matching Prototypes</h3>
          <p>No vehicles match your active telemetry parameters. Try adjusting your search filters.</p>
          <button class="btn btn-outline btn-sm" style="margin-top: 1.25rem;" onclick="document.getElementById('resetFiltersBtn').click()">Reset Filters</button>
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
    console.error('Failed to fetch inventory:', err);
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">⚠️</div>
        <h3>Failed to load vehicles</h3>
        <p>${err.message}</p>
      </div>
    `;
  }
}
