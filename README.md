# Motor Industry App

A modern **Dealer Management System (DMS)** prototype for the motor / automotive industry.

Built as a fully client-side web application (HTML, CSS, JavaScript) with localStorage for data persistence.

## Features

- **Login & Authentication** – Secure login screen with role-based demo users
- **Dashboard** – Key metrics: vehicles in stock, active customers, upcoming services
- **Vehicle Inventory** – Full CRUD for vehicle stock
- **Customers / CRM** – Customer database and lead management
- **Service Bookings** – Schedule services, job cards, technician assignment
- **Parts Inventory** – Stock management with low-stock warnings
- **Responsive Design** – Works on desktop and mobile
- **Sample Data** – Pre-loaded with realistic South African demo data

## Demo Login Credentials

| Username | Password  | Role     |
|----------|-----------|----------|
| admin    | admin123  | Admin    |
| sales    | sales123  | Sales    |
| tech     | tech123   | Service  |

## How to Run

Because the app uses **ES6 modules**, you should serve it with a local web server (opening `index.html` directly via `file://` may cause import errors in some browsers).

### Option 1 – VS Code Live Server (easiest)
1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **Open with Live Server**

### Option 2 – Python
```bash
# Python 3
python -m http.server 8000
# then open http://localhost:8000
```

### Option 3 – Node.js
```bash
npx serve .
```

## Project Structure

```
Motor-Industry-App/
├── index.html              # Main SPA + Login screen
├── css/
│   └── styles.css          # Custom styles + login theme
├── js/
│   ├── app.js              # App init, auth flow & navigation
│   ├── data.js             # Sample data, auth helpers, localStorage
│   ├── dashboard.js        # Dashboard logic
│   ├── vehicles.js         # Vehicle inventory module
│   ├── customers.js        # Customers / CRM module
│   ├── services.js         # Service bookings module
│   └── parts.js            # Parts inventory module
└── README.md
```

## Tech Stack

- HTML5
- CSS3 (custom automotive theme)
- Vanilla JavaScript (ES6 modules)
- Bootstrap 5 (CDN)
- localStorage for persistence & session

## Future Enhancements

- Real backend API (Node.js / Python / Firebase)
- Proper password hashing & multi-user management
- Invoicing & payments
- Reports & analytics charts
- Mobile app version

---

Created for the Motor Industry App project.