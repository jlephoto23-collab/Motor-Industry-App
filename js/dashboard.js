// dashboard.js
import { getVehicles, getCustomers, getServices, formatCurrency } from './data.js';

export function renderDashboard() {
  const vehicles = getVehicles();
  const customers = getCustomers();
  const services = getServices();

  const inStock = vehicles.filter(v => v.status === 'In Stock').length;
  const reserved = vehicles.filter(v => v.status === 'Reserved').length;
  const activeCustomers = customers.filter(c => c.status === 'Active').length;
  const upcomingServices = services.filter(s => s.status === 'Scheduled' || s.status === 'In Progress').length;

  // Stats
  document.getElementById('stat-vehicles').textContent = inStock;
  document.getElementById('stat-customers').textContent = activeCustomers;
  document.getElementById('stat-services').textContent = upcomingServices;
  document.getElementById('stat-reserved').textContent = reserved;

  // Recent vehicles table
  const recentVehicles = [...vehicles].slice(0, 5);
  const tbody = document.getElementById('dashboard-vehicles-body');
  tbody.innerHTML = recentVehicles.map(v => `
    <tr>
      <td>${v.make} ${v.model}</td>
      <td>${v.year}</td>
      <td>${formatCurrency(v.price)}</td>
      <td><span class="badge badge-status bg-${statusColor(v.status)}">${v.status}</span></td>
    </tr>
  `).join('');

  // Upcoming services
  const upcoming = services
    .filter(s => s.status !== 'Completed')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const servicesBody = document.getElementById('dashboard-services-body');
  servicesBody.innerHTML = upcoming.length
    ? upcoming.map(s => `
      <tr>
        <td>${s.vehicle}</td>
        <td>${s.customer}</td>
        <td>${s.date}</td>
        <td><span class="badge badge-status bg-${serviceStatusColor(s.status)}">${s.status}</span></td>
      </tr>
    `).join('')
    : '<tr><td colspan="4" class="text-center text-muted">No upcoming services</td></tr>';
}

function statusColor(status) {
  const map = {
    'In Stock': 'success',
    'Reserved': 'warning',
    'Sold': 'secondary'
  };
  return map[status] || 'secondary';
}

function serviceStatusColor(status) {
  const map = {
    'Scheduled': 'info',
    'In Progress': 'warning',
    'Completed': 'success'
  };
  return map[status] || 'secondary';
}