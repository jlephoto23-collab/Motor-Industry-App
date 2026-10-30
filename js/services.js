// services.js
import { getServices, saveServices, generateId, formatDate } from './data.js';

let editingId = null;

export function renderServices(searchTerm = '') {
  let services = getServices();
  const term = searchTerm.toLowerCase().trim();

  if (term) {
    services = services.filter(s =>
      `${s.vehicle} ${s.customer} ${s.date} ${s.type} ${s.status} ${s.technician || ''} ${s.notes || ''}`
        .toLowerCase()
        .includes(term)
    );
  }

  const tbody = document.getElementById('services-table-body');

  if (services.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state"><i class="bi bi-wrench"></i><p>${term ? 'No services match your search.' : 'No service bookings yet.'}</p></td></tr>`;
    return;
  }

  const sorted = [...services].sort((a, b) => new Date(b.date) - new Date(a.date));

  tbody.innerHTML = sorted.map(s => `
    <tr>
      <td>${s.vehicle}</td>
      <td>${s.customer}</td>
      <td>${formatDate(s.date)}</td>
      <td>${s.type}</td>
      <td><span class="badge badge-status bg-${statusColor(s.status)}">${s.status}</span></td>
      <td>${s.technician || '-'}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" onclick="window.editService(${s.id})" title="Edit">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="window.deleteService(${s.id})" title="Delete">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function statusColor(status) {
  const map = {
    'Scheduled': 'info',
    'In Progress': 'warning',
    'Completed': 'success',
    'Cancelled': 'secondary'
  };
  return map[status] || 'secondary';
}

export function openServiceModal(id = null) {
  editingId = id;
  const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
  const form = document.getElementById('service-form');
  form.reset();

  document.getElementById('serviceModalLabel').textContent = id ? 'Edit Service Booking' : 'New Service Booking';

  if (id) {
    const service = getServices().find(s => s.id === id);
    if (service) {
      document.getElementById('s-vehicle').value = service.vehicle;
      document.getElementById('s-customer').value = service.customer;
      document.getElementById('s-date').value = service.date;
      document.getElementById('s-type').value = service.type;
      document.getElementById('s-status').value = service.status;
      document.getElementById('s-technician').value = service.technician || '';
      document.getElementById('s-notes').value = service.notes || '';
    }
  } else {
    document.getElementById('s-date').value = new Date().toISOString().split('T')[0];
  }

  modal.show();
}

export function saveService(e) {
  e.preventDefault();
  const services = getServices();

  const data = {
    vehicle: document.getElementById('s-vehicle').value.trim(),
    customer: document.getElementById('s-customer').value.trim(),
    date: document.getElementById('s-date').value,
    type: document.getElementById('s-type').value,
    status: document.getElementById('s-status').value,
    technician: document.getElementById('s-technician').value.trim(),
    notes: document.getElementById('s-notes').value.trim()
  };

  if (editingId) {
    const idx = services.findIndex(s => s.id === editingId);
    if (idx !== -1) {
      services[idx] = { ...services[idx], ...data };
    }
  } else {
    data.id = generateId(services);
    services.push(data);
  }

  saveServices(services);
  bootstrap.Modal.getInstance(document.getElementById('serviceModal')).hide();
  const searchInput = document.getElementById('global-search');
  renderServices(searchInput ? searchInput.value : '');
}

export function deleteService(id) {
  if (!confirm('Are you sure you want to delete this service booking?')) return;
  const services = getServices().filter(s => s.id !== id);
  saveServices(services);
  const searchInput = document.getElementById('global-search');
  renderServices(searchInput ? searchInput.value : '');
}

window.editService = openServiceModal;
window.deleteService = deleteService;