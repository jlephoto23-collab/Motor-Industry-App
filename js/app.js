// app.js - Main application entry point
import { isAuthenticated, getSession, login, logout } from './data.js';
import { renderDashboard } from './dashboard.js';
import { renderVehicles, openVehicleModal, saveVehicle } from './vehicles.js';
import { renderCustomers, openCustomerModal, saveCustomer } from './customers.js';
import { renderServices, openServiceModal, saveService } from './services.js';
import { renderParts, openPartModal, savePart } from './parts.js';
import { renderSettings, initSettings } from './settings.js';
import { renderDiagnostics, initDiagnostics } from './diagnostics.js';

let currentSection = 'dashboard';

function showLogin() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('app-shell').style.display = 'none';
}

function showApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app-shell').style.display = 'block';

  const session = getSession();
  if (session) {
    const userEl = document.getElementById('current-user');
    if (userEl) userEl.textContent = `${session.name} (${session.role})`;
  }

  if (localStorage.getItem('mia_dark_mode') === 'true') {
    document.body.classList.add('dark-mode');
  }

  showSection('dashboard');
}

function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  const result = login(username, password);
  if (result.success) {
    errorEl.classList.add('d-none');
    showApp();
  } else {
    errorEl.textContent = result.message;
    errorEl.classList.remove('d-none');
  }
}

function handleLogout() {
  logout();
  showLogin();
  document.getElementById('login-form').reset();
}

function handleSearch() {
  const term = document.getElementById('global-search')?.value || '';
  switch (currentSection) {
    case 'vehicles': renderVehicles(term); break;
    case 'customers': renderCustomers(term); break;
    case 'services': renderServices(term); break;
    case 'parts': renderParts(term); break;
  }
}

function showSection(sectionId) {
  currentSection = sectionId;

  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.bottom-nav-item').forEach(l => l.classList.remove('active'));

  const section = document.getElementById(`section-${sectionId}`);
  const link = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
  const bottomLink = document.querySelector(`.bottom-nav-item[data-section="${sectionId}"]`);

  if (section) section.classList.add('active');
  if (link) link.classList.add('active');
  if (bottomLink) bottomLink.classList.add('active');

  const titles = {
    dashboard: 'Dashboard',
    vehicles: 'Vehicles',
    customers: 'Customers',
    services: 'Services',
    parts: 'Parts',
    diagnostics: 'Diagnostics',
    settings: 'Settings'
  };
  const titleEl = document.getElementById('page-title');
  if (titleEl) titleEl.textContent = titles[sectionId] || 'Dashboard';

  const searchInput = document.getElementById('global-search');
  if (searchInput) searchInput.value = '';

  const searchContainer = document.getElementById('search-container');
  if (searchContainer) {
    searchContainer.style.display = (['dashboard', 'settings', 'diagnostics'].includes(sectionId)) ? 'none' : 'flex';
  }

  switch (sectionId) {
    case 'dashboard': renderDashboard(); break;
    case 'vehicles': renderVehicles(); break;
    case 'customers': renderCustomers(); break;
    case 'services': renderServices(); break;
    case 'parts': renderParts(); break;
    case 'diagnostics': renderDiagnostics(); break;
    case 'settings': renderSettings(); break;
  }

  document.getElementById('sidebar')?.classList.remove('show');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-form')?.addEventListener('submit', handleLogin);
  document.getElementById('btn-logout')?.addEventListener('click', handleLogout);

  document.querySelectorAll('[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(link.dataset.section);
    });
  });

  document.getElementById('menu-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('show');
  });

  document.getElementById('global-search')?.addEventListener('input', handleSearch);

  document.getElementById('vehicle-form')?.addEventListener('submit', saveVehicle);
  document.getElementById('customer-form')?.addEventListener('submit', saveCustomer);
  document.getElementById('service-form')?.addEventListener('submit', saveService);
  document.getElementById('part-form')?.addEventListener('submit', savePart);

  document.getElementById('btn-add-vehicle')?.addEventListener('click', () => openVehicleModal());
  document.getElementById('btn-add-customer')?.addEventListener('click', () => openCustomerModal());
  document.getElementById('btn-add-service')?.addEventListener('click', () => openServiceModal());
  document.getElementById('btn-add-part')?.addEventListener('click', () => openPartModal());

  initSettings();
  initDiagnostics();

  if (isAuthenticated()) {
    showApp();
  } else {
    showLogin();
  }

  const dateEl = document.getElementById('current-date');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-ZA', {
      weekday: 'short', day: 'numeric', month: 'short'
    });
  }
});

window.showSection = showSection;