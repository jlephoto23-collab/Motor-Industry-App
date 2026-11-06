// app.js - Main application with hash routing, swipe gestures + slide animation
import { isAuthenticated, getSession, login, logout } from './data.js';
import { renderDashboard } from './dashboard.js';
import { renderVehicles, openVehicleModal, saveVehicle } from './vehicles.js';
import { renderCustomers, openCustomerModal, saveCustomer } from './customers.js';
import { renderServices, openServiceModal, saveService } from './services.js';
import { renderParts, openPartModal, savePart } from './parts.js';
import { renderSettings, initSettings } from './settings.js';
import { renderDiagnostics, initDiagnostics } from './diagnostics.js';

let currentSection = 'dashboard';
let isAnimating = false;

// Order used for swipe navigation (matches bottom nav)
const SWIPE_SECTIONS = ['dashboard', 'vehicles', 'diagnostics', 'services', 'settings'];
const VALID_SECTIONS = ['dashboard', 'vehicles', 'customers', 'services', 'parts', 'diagnostics', 'settings'];

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

  const hash = window.location.hash.replace('#', '');
  const section = VALID_SECTIONS.includes(hash) ? hash : 'dashboard';
  showSection(section, false);
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
  window.location.hash = '';
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

function showSection(sectionId, updateHash = true, direction = null) {
  if (!VALID_SECTIONS.includes(sectionId)) sectionId = 'dashboard';
  if (sectionId === currentSection && !direction) return;
  if (isAnimating) return;

  const prevSectionId = currentSection;
  currentSection = sectionId;

  if (updateHash && window.location.hash !== '#' + sectionId) {
    window.location.hash = sectionId;
  }

  const prevEl = document.getElementById(`section-${prevSectionId}`);
  const nextEl = document.getElementById(`section-${sectionId}`);

  // Update nav active states
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.bottom-nav-item').forEach(l => l.classList.remove('active'));

  const link = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
  const bottomLink = document.querySelector(`.bottom-nav-item[data-section="${sectionId}"]`);
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

  // Slide animation when swiping
  if (direction && prevEl && nextEl && prevSectionId !== sectionId) {
    isAnimating = true;

    // Prepare next section
    nextEl.classList.add('active');
    nextEl.classList.add(direction === 'left' ? 'slide-in-from-right' : 'slide-in-from-left');
    prevEl.classList.add(direction === 'left' ? 'slide-out-to-left' : 'slide-out-to-right');

    const cleanup = () => {
      prevEl.classList.remove('active', 'slide-out-to-left', 'slide-out-to-right');
      nextEl.classList.remove('slide-in-from-right', 'slide-in-from-left');
      isAnimating = false;
    };

    nextEl.addEventListener('animationend', cleanup, { once: true });
    // Fallback in case animationend doesn't fire
    setTimeout(cleanup, 320);
  } else {
    // Instant switch (menu click / hash change)
    document.querySelectorAll('.section').forEach(s => {
      s.classList.remove('active', 'slide-in-from-right', 'slide-in-from-left', 'slide-out-to-left', 'slide-out-to-right');
    });
    if (nextEl) nextEl.classList.add('active');
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

// ---------- Swipe gesture support ----------
function initSwipeGestures() {
  const main = document.querySelector('.main-content');
  if (!main) return;

  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  const minSwipeDistance = 60;

  main.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  main.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    if (isAnimating) return;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Ignore mostly vertical swipes (scrolling)
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;
    if (Math.abs(deltaX) < minSwipeDistance) return;

    let index = SWIPE_SECTIONS.indexOf(currentSection);
    if (index === -1) index = 0;

    if (deltaX < 0) {
      // Swipe left → next section
      const next = Math.min(index + 1, SWIPE_SECTIONS.length - 1);
      if (next !== index) showSection(SWIPE_SECTIONS[next], true, 'left');
    } else {
      // Swipe right → previous section
      const prev = Math.max(index - 1, 0);
      if (prev !== index) showSection(SWIPE_SECTIONS[prev], true, 'right');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-form')?.addEventListener('submit', handleLogin);
  document.getElementById('btn-logout')?.addEventListener('click', handleLogout);

  document.querySelectorAll('[data-section]').forEach(link => {
    const section = link.dataset.section;
    if (section) link.setAttribute('href', '#' + section);

    link.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(link.dataset.section);
    });
  });

  window.addEventListener('hashchange', () => {
    if (!isAuthenticated()) return;
    const hash = window.location.hash.replace('#', '');
    const section = VALID_SECTIONS.includes(hash) ? hash : 'dashboard';
    showSection(section, false);
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
  initSwipeGestures();

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