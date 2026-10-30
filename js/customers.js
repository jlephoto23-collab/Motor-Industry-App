// customers.js
import { getCustomers, saveCustomers, generateId } from './data.js';

let editingId = null;

export function renderCustomers() {
  const customers = getCustomers();
  const tbody = document.getElementById('customers-table-body');

  if (customers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state"><i class="bi bi-people"></i><p>No customers yet.</p></td></tr>`;
    return;
  }

  tbody.innerHTML = customers.map(c => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td>${c.email}</td>
      <td>${c.phone}</td>
      <td><span class="badge bg-${c.type === 'Lead' ? 'info' : 'primary'}">${c.type}</span></td>
      <td><span class="badge badge-status bg-${statusColor(c.status)}">${c.status}</span></td>
      <td class="text-muted small">${c.notes || '-'}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" onclick="window.editCustomer(${c.id})" title="Edit">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="window.deleteCustomer(${c.id})" title="Delete">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function statusColor(status) {
  const map = { 'Active': 'success', 'New': 'info', 'Contacted': 'warning', 'Inactive': 'secondary' };
  return map[status] || 'secondary';
}

export function openCustomerModal(id = null) {
  editingId = id;
  const modal = new bootstrap.Modal(document.getElementById('customerModal'));
  const form = document.getElementById('customer-form');
  form.reset();

  document.getElementById('customerModalLabel').textContent = id ? 'Edit Customer' : 'Add New Customer / Lead';

  if (id) {
    const customer = getCustomers().find(c => c.id === id);
    if (customer) {
      document.getElementById('c-name').value = customer.name;
      document.getElementById('c-email').value = customer.email;
      document.getElementById('c-phone').value = customer.phone;
      document.getElementById('c-type').value = customer.type;
      document.getElementById('c-status').value = customer.status;
      document.getElementById('c-notes').value = customer.notes || '';
    }
  }

  modal.show();
}

export function saveCustomer(e) {
  e.preventDefault();
  const customers = getCustomers();

  const data = {
    name: document.getElementById('c-name').value.trim(),
    email: document.getElementById('c-email').value.trim(),
    phone: document.getElementById('c-phone').value.trim(),
    type: document.getElementById('c-type').value,
    status: document.getElementById('c-status').value,
    notes: document.getElementById('c-notes').value.trim()
  };

  if (editingId) {
    const idx = customers.findIndex(c => c.id === editingId);
    if (idx !== -1) {
      customers[idx] = { ...customers[idx], ...data };
    }
  } else {
    data.id = generateId(customers);
    customers.push(data);
  }

  saveCustomers(customers);
  bootstrap.Modal.getInstance(document.getElementById('customerModal')).hide();
  renderCustomers();
}

export function deleteCustomer(id) {
  if (!confirm('Are you sure you want to delete this customer?')) return;
  const customers = getCustomers().filter(c => c.id !== id);
  saveCustomers(customers);
  renderCustomers();
}

window.editCustomer = openCustomerModal;
window.deleteCustomer = deleteCustomer;