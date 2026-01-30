import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Inventory from './pages/inventory';
import Patients from './pages/patients';
import Procurement from './pages/procurement';
import MainPOS from './pages/main';
import Login from './pages/Login'; // Yeni Login sayfası
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './App.css'

function App() {
  const isAuthenticated = !!localStorage.getItem('access_token');

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        {/* Sol Sidebar*/}
        <Sidebar />

        {/* Sağ Ana İçerik */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Üst Bar*/}
          <Navbar />

          {/* Sayfa İçeriği*/}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <Routes>
              <Route path="/" element={<Inventory />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/procurement" element={<Procurement />} />
              <Route path="/sales" element={<MainPOS />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App


