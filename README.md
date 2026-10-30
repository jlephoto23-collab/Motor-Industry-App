# Motor Industry App

A modern **Dealer Management System (DMS)** prototype for the motor / automotive industry.

Built as a fully client-side web application (HTML, CSS, JavaScript) with localStorage for data persistence. No backend or installation required — just open `index.html` in a browser.

## Features

- **Dashboard** – Key metrics: vehicles in stock, active customers, upcoming services, recent activity
- **Vehicle Inventory** – Add, view, edit and manage vehicle stock (make, model, year, price, status, mileage, etc.)
- **Customers / CRM** – Customer database and lead management
- **Service Bookings** – Schedule services, job cards, technician assignment
- **Responsive Design** – Works on desktop and mobile
- **Sample Data** – Pre-loaded with realistic demo data so you can explore immediately

## How to Run

1. Clone or download this repository
2. Open `index.html` in any modern browser
3. All data is stored in the browser’s localStorage

```bash
git clone https://github.com/jlephoto23-collab/Motor-Industry-App.git
cd Motor-Industry-App
# then simply open index.html
```

## Project Structure

```
Motor-Industry-App/
├── index.html              # Main application (SPA)
├── css/
│   └── styles.css          # Custom styles + theme
├── js/
│   ├── app.js              # App initialization & navigation
│   ├── data.js             # Sample data + localStorage helpers
│   ├── dashboard.js        # Dashboard logic
│   ├── vehicles.js         # Vehicle inventory module
│   ├── customers.js        # Customers / CRM module
│   └── services.js         # Service bookings module
└── README.md
```

## Tech Stack

- HTML5
- CSS3 (custom automotive theme)
- Vanilla JavaScript (ES6 modules)
- Bootstrap 5 (CDN) for layout & components
- localStorage for persistence

## Future Enhancements

- Backend API (Node.js / Python)
- User authentication
- Parts inventory module
- Invoicing & payments
- Reports & analytics charts
- Mobile app (React Native / Flutter)

---

Created for the Motor Industry App project.