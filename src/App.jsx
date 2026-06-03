import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';

function App() {
  // Navbar dipindahkan ke sini agar muncul di semua halaman tanpa harus diulang
  return (
    <Router>
      <div className="font-sans text-[#28282B] antialiased selection:bg-[#8B6E5A] selection:text-white">
        
        {/* GLOBAL NAVBAR */}
        <nav className="fixed top-0 w-full bg-[#F7F3EF]/90 backdrop-blur-md flex justify-between items-center px-12 py-5 z-50 border-b border-[#EBE1D7]/60">
          <Link to="/" className="font-serif text-2xl tracking-[0.2em] font-semibold text-[#28282B]">Solemates365</Link>
          <div className="hidden md:flex space-x-10 text-[11px] font-medium tracking-[0.2em] text-gray-400">
            <Link to="/" className="hover:text-black transition-colors">HOME</Link>
            <Link to="/shop" className="hover:text-black transition-colors">SHOP</Link>
            <Link to="/about" className="hover:text-black transition-colors">ABOUT US</Link>
          </div>
          <div className="flex space-x-6 items-center text-gray-700">
             <span className="text-sm">🔍</span>
             <span className="text-base">🛍️</span>
          </div>
        </nav>

        {/* AREA KONTEN DINAMIS */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;