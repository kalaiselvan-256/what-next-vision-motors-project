/**
 * WhatNext Vision Motors - Authentication & Navbar State Manager
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarAuth();
  initLoginForm();
  initRegisterForm();
  initMobileMenu();
});

// Render user state into navbar across all pages
function initNavbarAuth() {
  const authContainer = document.getElementById('navbarAuthContainer');
  if (!authContainer) return;

  const user = window.WN_API.getStoredUser();

  if (user) {
    const isAdmin = user.role === 'admin';
    authContainer.innerHTML = `
      <div class="user-dropdown" id="userDropdownTrigger">
        <button class="user-badge-btn" type="button" aria-expanded="false">
          <img src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}" class="user-avatar-sm" alt="${user.name}">
          <span>${user.name.split(' ')[0]}</span>
          ${isAdmin ? '<span class="admin-badge-role">ADMIN</span>' : ''}
          <span style="font-size: 0.7rem;">▼</span>
        </button>
        <div class="user-menu-dropdown" id="userDropdownMenu">
          <div style="padding: 0.6rem 1.2rem; border-bottom: 1px solid var(--border-glass);">
            <div style="font-weight: 700; color: #FFF; font-size: 0.95rem;">${user.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-dim);">${user.email}</div>
          </div>
          ${isAdmin ? '<a href="admin.html" class="dropdown-item">⚡ Admin Dashboard</a>' : ''}
          <a href="profile.html" class="dropdown-item">👤 My Profile & Bookings</a>
          <a href="vehicles.html" class="dropdown-item">🚗 Explore Inventory</a>
          <a href="test-drive.html" class="dropdown-item">📅 Book Test Drive</a>
          <div class="dropdown-divider"></div>
          <a href="#" id="logoutBtn" class="dropdown-item" style="color: var(--danger);">🚪 Sign Out</a>
        </div>
      </div>
    `;

    // Dropdown toggle
    const trigger = document.getElementById('userDropdownTrigger');
    const menu = document.getElementById('userDropdownMenu');
    if (trigger && menu) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('show');
      });

      document.addEventListener('click', () => {
        menu.classList.remove('show');
      });
    }

    // Logout handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.WN_API.clearAuthData();
        window.WN_API.showToast('Logged Out', 'You have been logged out successfully.', 'info');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 600);
      });
    }
  } else {
    // Guest State
    authContainer.innerHTML = `
      <a href="login.html" class="btn btn-outline btn-sm">Sign In</a>
      <a href="test-drive.html" class="btn btn-primary btn-sm">Book Test Drive</a>
    `;
  }
}

// Mobile Menu Toggle
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }
}

// Login Form Logic on login.html
function initLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      window.WN_API.showToast('Missing Fields', 'Please enter your email and password.', 'warning');
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner" style="width: 20px; height: 20px; margin: 0; border-width: 2px;"></span> Authenticating...';

      const res = await window.WN_API.auth.login({ email, password });
      window.WN_API.setAuthData(res.token, res.user);
      window.WN_API.showToast('Welcome Back', `Logged in as ${res.user.name}`, 'success');

      setTimeout(() => {
        if (res.user.role === 'admin') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'index.html';
        }
      }, 700);
    } catch (err) {
      window.WN_API.showToast('Login Failed', err.message, 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Sign In to Account';
    }
  });
}

// Register Form Logic on login.html
function initRegisterForm() {
  const registerForm = document.getElementById('registerForm');
  if (!registerForm) return;

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = registerForm.querySelector('button[type="submit"]');
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPass = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPass) {
      window.WN_API.showToast('Password Mismatch', 'Passwords do not match.', 'warning');
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner" style="width: 20px; height: 20px; margin: 0; border-width: 2px;"></span> Creating Profile...';

      const res = await window.WN_API.auth.register({ name, email, phone, password });
      window.WN_API.setAuthData(res.token, res.user);
      window.WN_API.showToast('Registration Successful', `Welcome to WhatNext Motors, ${res.user.name}!`, 'success');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 800);
    } catch (err) {
      window.WN_API.showToast('Registration Error', err.message, 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Create Free Account';
    }
  });
}
