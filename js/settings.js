// settings.js - Settings page logic
import { logout } from './data.js';

export function renderSettings() {
  const darkMode = localStorage.getItem('mia_dark_mode') === 'true';
  const toggle = document.getElementById('setting-dark-mode');
  if (toggle) toggle.checked = darkMode;

  // Update install button visibility
  updateInstallButton();
}

function updateInstallButton() {
  const installCard = document.getElementById('install-app-card');
  const alreadyInstalled = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;

  if (installCard) {
    if (alreadyInstalled) {
      installCard.innerHTML = `
        <h6><i class="bi bi-phone"></i> App Installed</h6>
        <p class="text-muted small mb-0">This app is already installed on your device.</p>
      `;
    }
  }
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

  // Install App button in Settings
  document.getElementById('btn-install-app')?.addEventListener('click', () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      window.deferredPrompt.userChoice.then(() => {
        window.deferredPrompt = null;
        updateInstallButton();
      });
    } else {
      // Fallback instructions
      alert('To install this app:\n\nAndroid (Chrome):\n1. Tap the menu (⋮)\n2. Tap "Install app" or "Add to Home screen"\n\niPhone (Safari):\n1. Tap the Share button\n2. Tap "Add to Home Screen"');
    }
  });
}