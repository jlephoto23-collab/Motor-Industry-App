// settings.js - Settings page logic
import { logout } from './data.js';

export function renderSettings() {
  const darkMode = localStorage.getItem('mia_dark_mode') === 'true';
  const toggle = document.getElementById('setting-dark-mode');
  if (toggle) toggle.checked = darkMode;
}

export function initSettings() {
  // Dark mode toggle
  document.getElementById('setting-dark-mode')?.addEventListener('change', (e) => {
    const enabled = e.target.checked;
    localStorage.setItem('mia_dark_mode', enabled);
    document.body.classList.toggle('dark-mode', enabled);
  });

  // Clear all data
  document.getElementById('btn-clear-data')?.addEventListener('click', () => {
    if (confirm('This will permanently delete ALL vehicles, customers, services and parts data. Continue?')) {
      ['mia_vehicles', 'mia_customers', 'mia_services', 'mia_parts'].forEach(key => {
        localStorage.removeItem(key);
      });
      alert('All data has been cleared. The app will now reload.');
      location.reload();
    }
  });

  // Logout from settings
  document.getElementById('btn-settings-logout')?.addEventListener('click', () => {
    logout();
    location.reload();
  });
}