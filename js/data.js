// data.js - Sample data, auth and localStorage helpers for Motor Industry App

const STORAGE_KEYS = {
  vehicles: 'mia_vehicles',
  customers: 'mia_customers',
  services: 'mia_services',
  parts: 'mia_parts',
  session: 'mia_session'
};

// ---------- Default Users (simple demo auth) ----------
const USERS = [
  { username: 'admin', password: 'admin123', name: 'Admin User', role: 'Admin' },
  { username: 'sales', password: 'sales123', name: 'Sales Consultant', role: 'Sales' },
  { username: 'tech', password: 'tech123', name: 'Technician', role: 'Service' }
];

// ---------- Sample Data ----------
const sampleVehicles = [
  { id: 1, make: 'Toyota', model: 'Corolla', year: 2023, price: 285000, status: 'In Stock', mileage: 12500, color: 'White', vin: 'JTDBR32E720123456', fuel: 'Petrol' },
  { id: 2, make: 'Volkswagen', model: 'Polo', year: 2022, price: 245000, status: 'In Stock', mileage: 28900, color: 'Silver', vin: 'WVWZZZ6RZHY123789', fuel: 'Petrol' },
  { id: 3, make: 'BMW', model: '3 Series', year: 2021, price: 520000, status: 'Reserved', mileage: 34500, color: 'Black', vin: 'WBA8E9G50JNU12345', fuel: 'Petrol' },
  { id: 4, make: 'Ford', model: 'Ranger', year: 2024, price: 689000, status: 'In Stock', mileage: 3200, color: 'Blue', vin: '1FTER4EH5PLA98765', fuel: 'Diesel' },
  { id: 5, make: 'Mercedes-Benz', model: 'C-Class', year: 2020, price: 475000, status: 'Sold', mileage: 41200, color: 'Grey', vin: 'WDDWF4EB5KR123321', fuel: 'Petrol' },
  { id: 6, make: 'Hyundai', model: 'Tucson', year: 2023, price: 415000, status: 'In Stock', mileage: 18700, color: 'Red', vin: 'KM8J3CA46PU456789', fuel: 'Petrol' }
];

const sampleCustomers = [
  { id: 1, name: 'Thabo Molefe', email: 'thabo.m@email.com', phone: '082 555 1234', type: 'Customer', status: 'Active', notes: 'Interested in SUVs' },
  { id: 2, name: 'Sarah van der Berg', email: 'sarah.vdb@email.com', phone: '083 444 9876', type: 'Lead', status: 'New', notes: 'Looking for a family sedan under R300k' },
  { id: 3, name: 'Johan Botha', email: 'johan.b@email.com', phone: '071 222 3344', type: 'Customer', status: 'Active', notes: 'Previously bought a Polo' },
  { id: 4, name: 'Lerato Dlamini', email: 'lerato.d@email.com', phone: '084 777 5566', type: 'Lead', status: 'Contacted', notes: 'Wants test drive of Ranger' },
  { id: 5, name: 'Michael Chen', email: 'm.chen@email.com', phone: '079 111 8899', type: 'Customer', status: 'Active', notes: 'Fleet customer - 3 vehicles' }
];

const sampleServices = [
  { id: 1, vehicle: 'Toyota Corolla (2023)', customer: 'Thabo Molefe', date: '2026-11-05', type: 'Service', status: 'Scheduled', technician: 'Sipho Nkosi', notes: 'Full service + brake check' },
  { id: 2, vehicle: 'BMW 3 Series (2021)', customer: 'Johan Botha', date: '2026-10-31', type: 'Repair', status: 'In Progress', technician: 'Pieter van Wyk', notes: 'Replace front pads and discs' },
  { id: 3, vehicle: 'Ford Ranger (2024)', customer: 'Lerato Dlamini', date: '2026-11-12', type: 'Service', status: 'Scheduled', technician: 'Sipho Nkosi', notes: 'First 5000km service' },
  { id: 4, vehicle: 'Hyundai Tucson (2023)', customer: 'Michael Chen', date: '2026-10-28', type: 'Diagnostic', status: 'Completed', technician: 'Pieter van Wyk', notes: 'Check engine light - resolved' }
];

const sampleParts = [
  { id: 1, partNumber: 'BRK-PAD-001', name: 'Front Brake Pads (Set)', category: 'Brakes', quantity: 24, minStock: 10, price: 1250, supplier: 'AutoParts SA', location: 'Aisle A-12' },
  { id: 2, partNumber: 'OIL-5W30-4L', name: 'Engine Oil 5W-30 4L', category: 'Lubricants', quantity: 48, minStock: 20, price: 489, supplier: 'Shell', location: 'Aisle B-03' },
  { id: 3, partNumber: 'FLT-AIR-TOY', name: 'Air Filter - Toyota', category: 'Filters', quantity: 15, minStock: 8, price: 320, supplier: 'Mann Filter', location: 'Aisle C-07' },
  { id: 4, partNumber: 'SPK-NGK-001', name: 'Spark Plugs (Set of 4)', category: 'Ignition', quantity: 6, minStock: 10, price: 780, supplier: 'NGK', location: 'Aisle D-02' },
  { id: 5, partNumber: 'BAT-12V-70', name: 'Car Battery 12V 70Ah', category: 'Electrical', quantity: 9, minStock: 5, price: 1850, supplier: 'Willard', location: 'Aisle E-01' },
  { id: 6, partNumber: 'TYR-205-55', name: 'Tyre 205/55R16', category: 'Tyres', quantity: 12, minStock: 8, price: 1450, supplier: 'Goodyear', location: 'Yard-T1' },
  { id: 7, partNumber: 'WPR-BLD-22', name: 'Wiper Blade 22"', category: 'Accessories', quantity: 30, minStock: 15, price: 189, supplier: 'Bosch', location: 'Aisle F-05' }
];

// ---------- Storage Helpers ----------
function loadData(key, sample) {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse stored data for', key);
    }
  }
  localStorage.setItem(key, JSON.stringify(sample));
  return [...sample];
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ---------- Auth ----------
export function login(username, password) {
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    const session = { username: user.username, name: user.name, role: user.role, loginTime: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
    return { success: true, user: session };
  }
  return { success: false, message: 'Invalid username or password' };
}

export function logout() {
  localStorage.removeItem(STORAGE_KEYS.session);
}

export function getSession() {
  const stored = localStorage.getItem(STORAGE_KEYS.session);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return getSession() !== null;
}

// ---------- Public Data API ----------
export function getVehicles() {
  return loadData(STORAGE_KEYS.vehicles, sampleVehicles);
}

export function saveVehicles(vehicles) {
  saveData(STORAGE_KEYS.vehicles, vehicles);
}

export function getCustomers() {
  return loadData(STORAGE_KEYS.customers, sampleCustomers);
}

export function saveCustomers(customers) {
  saveData(STORAGE_KEYS.customers, customers);
}

export function getServices() {
  return loadData(STORAGE_KEYS.services, sampleServices);
}

export function saveServices(services) {
  saveData(STORAGE_KEYS.services, services);
}

export function getParts() {
  return loadData(STORAGE_KEYS.parts, sampleParts);
}

export function saveParts(parts) {
  saveData(STORAGE_KEYS.parts, parts);
}

export function generateId(items) {
  if (!items || items.length === 0) return 1;
  return Math.max(...items.map(i => i.id)) + 1;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
}