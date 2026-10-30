// app.js - Main application entry point
import { renderDashboard } from './dashboard.js';
import { renderVehicles, openVehicleModal, saveVehicle } from './vehicles.js';
import { renderCustomers, openCustomerModal, saveCustomer } from './customers.js';
import { renderServices, openServiceModal, saveService } from './services.js';

// Navigation
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  const section = document.getElementById(`section-${sectionId}`);
  const link = document.querySelector(`[data-section="${sectionId}"]`);

  if (section) section.classList.add('active');
  if (link) link.classList.add('active');

  // Render content
  switch (sectionId) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'vehicles':
      renderVehicles();
      break;
    case 'customers':
      renderCustomers();
      break;
    case 'services':
      renderServices();
      break;
  }

  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('show');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Nav clicks
  document.querySelectorAll('[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(link.dataset.section);
    });
  });

  // Mobile menu toggle
  document.getElementById('menu-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('show');
  });

  // Form submissions
  document.getElementById('vehicle-form')?.addEventListener('submit', saveVehicle);
  document.getElementById('customer-form')?.addEventListener('submit', saveCustomer);
  document.getElementById('service-form')?.addEventListener('submit', saveService);

  // Add buttons
  document.getElementById('btn-add-vehicle')?.addEventListener('click', () => openVehicleModal());
  document.getElementById('btn-add-customer')?.addEventListener('click', () => openCustomerModal());
  document.getElementById('btn-add-service')?.addEventListener('click', () => openServiceModal());

  // Start on dashboard
  showSection('dashboard');
});

// Expose showSection for any external use
window.showSection = showSection;