import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; //React router
import Inventory from './pages/inventory';
import Patients from './pages/patients';
import Procurement from './pages/procurement';
import MainPOS from './pages/main';
import RegisterEmployee from './pages/RegisterEmployee';
import Login from './pages/Login'; //Login sayfası
import MainLayout from './components/templates/MainLayout';
import './App.css'

import { useSelector } from 'react-redux';
import type { RootState } from './store/store';

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Inventory />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/procurement" element={<Procurement />} />
          <Route path="/sales" element={<MainPOS />} />
          <Route path="/register-employee" element={<RegisterEmployee />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default App


