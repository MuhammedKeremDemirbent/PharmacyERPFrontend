import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inventory from './pages/inventory';
import Patients from './pages/patients';
import Procurement from './pages/procurement';
import MainPOS from './pages/main';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './App.css'

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        {/* Sol Sidebar (Sabit) */}
        <Sidebar />

        {/* Sağ Ana İçerik */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Üst Bar (Header) */}
          <Navbar />

          {/* Sayfa İçeriği (Scroll Edilebilir) */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <Routes>
              <Route path="/" element={<Inventory />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/procurement" element={<Procurement />} />
              <Route path="/sales" element={<MainPOS />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App


