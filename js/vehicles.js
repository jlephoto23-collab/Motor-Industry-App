// vehicles.js
import { getVehicles, saveVehicles, generateId, formatCurrency } from './data.js';

let editingId = null;

export function renderVehicles(searchTerm = '') {
  let vehicles = getVehicles();
  const term = searchTerm.toLowerCase().trim();

  if (term) {
    vehicles = vehicles.filter(v =>
      `${v.make} ${v.model} ${v.year} ${v.color || ''} ${v.status} ${v.vin || ''} ${v.fuel || ''}`
        .toLowerCase()
        .includes(term)
    );
  }

  const tbody = document.getElementById('vehicles-table-body');

  if (vehicles.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty-state"><i class="bi bi-car-front"></i><p>${term ? 'No vehicles match your search.' : 'No vehicles yet. Add your first vehicle!'}</p></td></tr>`;
    return;
  }

  tbody.innerHTML = vehicles.map(v => `
    <tr>
      <td><strong>${v.make}</strong> ${v.model}</td>
      <td>${v.year}</td>
      <td>${v.color || '-'}</td>
      <td>${v.mileage?.toLocaleString() || '-'} km</td>
      <td>${formatCurrency(v.price)}</td>
      <td><span class="badge badge-status bg-${statusColor(v.status)}">${v.status}</span></td>
      <td class="text-muted small">${v.vin || '-'}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" onclick="window.editVehicle(${v.id})" title="Edit">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="window.deleteVehicle(${v.id})" title="Delete">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function statusColor(status) {
  const map = { 'In Stock': 'success', 'Reserved': 'warning', 'Sold': 'secondary' };
  return map[status] || 'secondary';
}

export function openVehicleModal(id = null) {
  editingId = id;
  const modal = new bootstrap.Modal(document.getElementById('vehicleModal'));
  const form = document.getElementById('vehicle-form');
  form.reset();

  document.getElementById('vehicleModalLabel').textContent = id ? 'Edit Vehicle' : 'Add New Vehicle';

  if (id) {
    const vehicle = getVehicles().find(v => v.id === id);
    if (vehicle) {
      document.getElementById('v-make').value = vehicle.make;
      document.getElementById('v-model').value = vehicle.model;
      document.getElementById('v-year').value = vehicle.year;
      document.getElementById('v-price').value = vehicle.price;
      document.getElementById('v-status').value = vehicle.status;
      document.getElementById('v-mileage').value = vehicle.mileage || '';
      document.getElementById('v-color').value = vehicle.color || '';
      document.getElementById('v-vin').value = vehicle.vin || '';
      document.getElementById('v-fuel').value = vehicle.fuel || 'Petrol';
    }
  }

  modal.show();
}

export function saveVehicle(e) {
  e.preventDefault();
  const vehicles = getVehicles();

  const data = {
    make: document.getElementById('v-make').value.trim(),
    model: document.getElementById('v-model').value.trim(),
    year: parseInt(document.getElementById('v-year').value),
    price: parseFloat(document.getElementById('v-price').value),
    status: document.getElementById('v-status').value,
    mileage: parseInt(document.getElementById('v-mileage').value) || 0,
    color: document.getElementById('v-color').value.trim(),
    vin: document.getElementById('v-vin').value.trim(),
    fuel: document.getElementById('v-fuel').value
  };

  if (editingId) {
    const idx = vehicles.findIndex(v => v.id === editingId);
    if (idx !== -1) {
      vehicles[idx] = { ...vehicles[idx], ...data };
    }
  } else {
    data.id = generateId(vehicles);
    vehicles.push(data);
  }

  saveVehicles(vehicles);
  bootstrap.Modal.getInstance(document.getElementById('vehicleModal')).hide();
  const searchInput = document.getElementById('global-search');
  renderVehicles(searchInput ? searchInput.value : '');
}

export function deleteVehicle(id) {
  if (!confirm('Are you sure you want to delete this vehicle?')) return;
  const vehicles = getVehicles().filter(v => v.id !== id);
  saveVehicles(vehicles);
  const searchInput = document.getElementById('global-search');
  renderVehicles(searchInput ? searchInput.value : '');
}

window.editVehicle = openVehicleModal;
window.deleteVehicle = deleteVehicle;