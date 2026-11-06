// shell.js - Shared logic for multi-page app
import { isAuthenticated, getSession, logout } from './data.js';

export function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

export function initShell(activePage) {
  if (!requireAuth()) return false;

  // Dark mode
  if (localStorage.getItem('mia_dark_mode') === 'true') {
    document.body.classList.add('dark-mode');
  }

  // Current user
  const session = getSession();
  const userEl = document.getElementById('current-user');
  if (userEl && session) {
    userEl.textContent = `${session.name} (${session.role})`;
  }

  // Date
  const dateEl = document.getElementById('current-date');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-ZA', {
      weekday: 'short', day: 'numeric', month: 'short'
    });
  }

  // Active nav highlight
  document.querySelectorAll('[data-page]').forEach(link => {
    if (link.dataset.page === activePage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Logout buttons
  document.querySelectorAll('#btn-logout, #btn-settings-logout').forEach(btn => {
    btn?.addEventListener('click', () => {
      logout();
      window.location.href = 'index.html';
    });
  });

  // Mobile sidebar toggle
  document.getElementById('menu-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('show');
  });

  // Hide splash
  setTimeout(() => {
    document.getElementById('splash-screen')?.classList.add('hide');
  }, 600);

  // PWA install
  const installBtn = document.getElementById('btn-install-pwa');
  const installAppBtn = document.getElementById('btn-install-app');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPrompt = e;
    installBtn?.classList.remove('d-none');
  });

  async function promptInstall() {
    if (!window.deferredPrompt) {
      alert('To install: open this site in Chrome → Menu → Install app');
      return;
    }
    window.deferredPrompt.prompt();
    await window.deferredPrompt.userChoice;
    window.deferredPrompt = null;
    installBtn?.classList.add('d-none');
  }

  installBtn?.addEventListener('click', promptInstall);
  installAppBtn?.addEventListener('click', promptInstall);

  document.getElementById('btn-download-apk')?.addEventListener('click', () => {
    const modal = document.getElementById('apkModal');
    if (modal && window.bootstrap) {
      new bootstrap.Modal(modal).show();
    } else {
      alert('Open this site in Chrome on your phone → Menu → Install app');
    }
  });

  return true;
}
