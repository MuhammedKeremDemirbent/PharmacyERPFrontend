import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Inventory from './pages/inventory';
import Patients from './pages/patients';
import Procurement from './pages/procurement';
import MainPOS from './pages/main';
import RegisterEmployee from './pages/RegisterEmployee';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MainLayout from './components/templates/MainLayout';
import './App.css'

import { useSelector } from 'react-redux';
import type { RootState } from './store/store';

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <Route element={<MainLayout><Outlet /></MainLayout>}>
            <Route path="/" element={<Inventory />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/procurement" element={<Procurement />} />
            <Route path="/sales" element={<MainPOS />} />
            <Route path="/register-employee" element={<RegisterEmployee />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App


