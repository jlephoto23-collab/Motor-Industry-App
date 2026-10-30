// parts.js - Parts Inventory module
import { getParts, saveParts, generateId, formatCurrency } from './data.js';

let editingId = null;

export function renderParts(searchTerm = '') {
  let parts = getParts();
  const term = searchTerm.toLowerCase().trim();

  if (term) {
    parts = parts.filter(p =>
      `${p.partNumber} ${p.name} ${p.category} ${p.supplier || ''} ${p.location || ''}`
        .toLowerCase()
        .includes(term)
    );
  }

  const tbody = document.getElementById('parts-table-body');

  if (parts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="empty-state"><i class="bi bi-box-seam"></i><p>${term ? 'No parts match your search.' : 'No parts in inventory yet.'}</p></td></tr>`;
    return;
  }

  tbody.innerHTML = parts.map(p => {
    const lowStock = p.quantity <= p.minStock;
    return `
    <tr class="${lowStock ? 'table-warning' : ''}">
      <td><code>${p.partNumber}</code></td>
      <td><strong>${p.name}</strong></td>
      <td>${p.category}</td>
      <td>
        <span class="${lowStock ? 'text-danger fw-bold' : ''}">${p.quantity}</span>
        ${lowStock ? ' <i class="bi bi-exclamation-triangle text-danger" title="Low stock"></i>' : ''}
      </td>
      <td>${p.minStock}</td>
      <td>${formatCurrency(p.price)}</td>
      <td>${p.supplier || '-'}</td>
      <td>${p.location || '-'}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" onclick="window.editPart(${p.id})" title="Edit">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="window.deletePart(${p.id})" title="Delete">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `}).join('');
}

export function openPartModal(id = null) {
  editingId = id;
  const modal = new bootstrap.Modal(document.getElementById('partModal'));
  const form = document.getElementById('part-form');
  form.reset();

  document.getElementById('partModalLabel').textContent = id ? 'Edit Part' : 'Add New Part';

  if (id) {
    const part = getParts().find(p => p.id === id);
    if (part) {
      document.getElementById('p-partNumber').value = part.partNumber;
      document.getElementById('p-name').value = part.name;
      document.getElementById('p-category').value = part.category;
      document.getElementById('p-quantity').value = part.quantity;
      document.getElementById('p-minStock').value = part.minStock;
      document.getElementById('p-price').value = part.price;
      document.getElementById('p-supplier').value = part.supplier || '';
      document.getElementById('p-location').value = part.location || '';
    }
  }

  modal.show();
}

export function savePart(e) {
  e.preventDefault();
  const parts = getParts();

  const data = {
    partNumber: document.getElementById('p-partNumber').value.trim(),
    name: document.getElementById('p-name').value.trim(),
    category: document.getElementById('p-category').value,
    quantity: parseInt(document.getElementById('p-quantity').value) || 0,
    minStock: parseInt(document.getElementById('p-minStock').value) || 0,
    price: parseFloat(document.getElementById('p-price').value) || 0,
    supplier: document.getElementById('p-supplier').value.trim(),
    location: document.getElementById('p-location').value.trim()
  };

  if (editingId) {
    const idx = parts.findIndex(p => p.id === editingId);
    if (idx !== -1) {
      parts[idx] = { ...parts[idx], ...data };
    }
  } else {
    data.id = generateId(parts);
    parts.push(data);
  }

  saveParts(parts);
  bootstrap.Modal.getInstance(document.getElementById('partModal')).hide();
  const searchInput = document.getElementById('global-search');
  renderParts(searchInput ? searchInput.value : '');
}

export function deletePart(id) {
  if (!confirm('Are you sure you want to delete this part?')) return;
  const parts = getParts().filter(p => p.id !== id);
  saveParts(parts);
  const searchInput = document.getElementById('global-search');
  renderParts(searchInput ? searchInput.value : '');
}

window.editPart = openPartModal;
window.deletePart = deletePart;