# 🏥 Pharmacy ERP (Enterprise Resource Planning) - Frontend

A modern, responsive, and high-performance frontend interface developed specifically for the **Pharmacy ERP** system. Designed to provide pharmacy staff with a seamless user experience for managing inventory, tracking patient records, handling sales, and overseeing procurement processes.

> **Note:** This is the frontend repository. For the backend API and database architecture, please visit the [Pharmacy ERP Backend Repository](https://github.com/MuhammedKeremDemirbent/PharmacyERPBackend).

## 🚀 Key Features

- **Modern & Responsive UI:** Built with Tailwind CSS and Radix UI components (shadcn/ui), providing a clean, accessible, and fast interface across all devices.
- **Centralized State Management:** Utilizes **Redux Toolkit (RTK)** and **Redux Persist** to handle complex application states, user sessions, and caching efficiently.
- **Dynamic Routing:** Implemented via **React Router**, ensuring smooth navigation between the Dashboard, Inventory, Sales, Patients, and Procurement modules.
- **Secure Authentication Flow:** Seamlessly integrates with the backend's JWT-based authentication system, managing token storage, expiration, and protected routes automatically.
- **Real-time API Integration:** Connects seamlessly to the Django REST Framework backend, handling asynchronous requests, error handling, and data visualization.

## 🛠️ Technology Stack

- **Programming Language:** TypeScript
- **Frontend Library:** React (React 19)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI & Lucide React (Icons)
- **State Management:** Redux Toolkit & React-Redux
- **Routing:** React Router DOM (v7)
- **Networking:** Axios

---

## 💻 Installation & Setup

Follow these steps to run the frontend application on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- `npm` or `yarn` installed on your machine.
- The **Pharmacy ERP Backend** must be running to fetch live data (refer to the backend README for Docker setup).

### 1. Clone the Repository
```bash
git clone https://github.com/MuhammedKeremDemirbent/PharmacyERPFrontend.git
cd PharmacyERPFrontend/erp_frontend
```

### 2. Install Dependencies
Run the following command to install all required Node.js packages:
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file inside the `erp_frontend` directory. Make sure to specify the backend API URL:

```env
VITE_API_URL=http://localhost:8000/api
```
*(Adjust the port if your backend is running on a different port).*

### 4. Start the Development Server
Launch the Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```

### 5. Access the Application
Open your browser and navigate to:
**`http://localhost:5173`**

---

## 🏗️ Build for Production

To create an optimized production build, run:
```bash
npm run build
```
This will generate a `dist` folder containing the compiled, minified static files ready to be served by Nginx or any other web server. You can preview the production build locally using:
```bash
npm run preview
```