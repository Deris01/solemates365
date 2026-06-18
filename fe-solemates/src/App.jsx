import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import ProductDetail from './pages/ProductDetail';

function App() {
  const navigate = useNavigate();
  
  // 1. STATE GLOBAL DIKEMBALIKAN KE LEVEL TERATAS
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault(); // Mencegah reload halaman
    if (searchQuery.trim()) {
      setIsSearchOpen(false); // Tutup bar setelah enter
      navigate(`/shop?q=${searchQuery}`); // Lempar ke halaman shop dengan query
      setSearchQuery(''); // Kosongkan input
    }
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
    setIsCartOpen(true); 
  };

  const clearCart = () => {
  setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
  const cartItemCount = cart.reduce((count, item) => count + item.qty, 0);
  const formatIDR = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="font-sans text-[#28282B] antialiased selection:bg-[#8B6E5A] selection:text-white relative min-h-screen">
      
      {/* --- CART SIDEBAR GLOBAL --- */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-[100] transform transition-transform duration-500 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h2 className="font-serif text-2xl tracking-wide">Your Cart</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-black transition-colors text-2xl focus:outline-none">&times;</button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {cart.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-sm font-light">Keranjang Anda masih kosong.</p>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-4 text-sm animate-fadeIn">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-gray-400 text-xs mt-1">{formatIDR(item.price)} &times; {item.qty}</p>
                  </div>
                  <p className="font-semibold text-gray-900">{formatIDR(item.price * item.qty)}</p>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-100 pt-6 mt-auto">
            <div className="flex justify-between font-medium text-base mb-6">
              <span className="text-gray-500">Total:</span>
              <span className="text-lg font-semibold">{formatIDR(cartTotal)}</span>
            </div>
            {/* TOMBOL CHECKOUT YANG BERFUNGSI */}
            <button 
              onClick={() => {
                setIsCartOpen(false); 
                navigate('/checkout', { state: { cart: cart } }); // Membawa data keranjang ke rute checkout
              }}
              className={`w-full py-4 rounded-none text-xs font-semibold tracking-widest uppercase transition-all duration-300 ${cart.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#28282B] text-white hover:bg-black shadow-md'}`}
              disabled={cart.length === 0}
            >
              PROSES CHECKOUT
            </button>
          </div>
        </div>
      </div>

      {/* --- OVERLAY GELAP --- */}
      {isCartOpen && <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-[90] transition-opacity duration-500" onClick={() => setIsCartOpen(false)}></div>}

      {/* --- GLOBAL NAVBAR --- */}
      <nav className="sticky top-0 w-full bg-[#F7F3EF]/90 backdrop-blur-md flex justify-between items-center px-6 md:px-12 py-5 z-50 border-b border-[#EBE1D7]/60">
        <Link to="/" className="font-serif text-2xl tracking-[0.2em] font-semibold text-[#28282B]">Solemates365</Link>
        
        {/* Desktop Menu (Sembunyi di Mobile) */}
        <div className="hidden md:flex space-x-10 text-[11px] font-medium tracking-[0.2em] text-gray-400">
          <Link to="/" className="hover:text-black transition-colors">HOME</Link>
          <Link to="/shop" className="hover:text-black transition-colors">SHOP</Link>
          <Link to="/about" className="hover:text-black transition-colors">ABOUT US</Link>
        </div>
        
        <div className="flex space-x-6 items-center text-gray-700">
          {/* TOMBOL PENCARIAN AKTIF */}
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="hover:text-black transition-colors text-sm focus:outline-none">
            🔍
          </button>
          {/* KERANJANG HIDUP */}
          <button onClick={() => setIsCartOpen(true)} className="relative hover:text-black transition-colors text-base focus:outline-none">
            🛍️
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#8B6E5A] text-white text-[9px] font-semibold w-4 h-4 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </button>
          
          {/* TOMBOL HAMBURGER MOBILE (Sembunyi di Desktop) */}
          <button 
            className="md:hidden flex items-center text-gray-700 hover:text-black focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {/* Logika ikon: jika buka jadi silang (X), jika tutup jadi garis tiga */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* --- PANEL PENCARIAN (SEARCH BAR) --- */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-[#EBE1D7] py-6 px-6 md:px-12 z-40 shadow-md">
          <form onSubmit={handleSearch} className="flex max-w-2xl mx-auto items-center">
            <input 
              type="text" 
              placeholder="Cari produk (misal: Raven Lace)..." 
              className="flex-1 bg-[#F7F3EF] border border-[#D6C8B3] text-[#28282B] text-xs md:text-sm py-4 px-6 focus:outline-none focus:border-[#8B6E5A] transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="bg-[#28282B] text-white px-8 py-4 text-xs font-semibold tracking-widest uppercase hover:bg-black transition-colors">
              CARI
            </button>
          </form>
        </div>
      )}

      {/* --- PANEL DROPDOWN MOBILE --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden sticky top-[73px] w-full bg-[#F7F3EF]/95 backdrop-blur-md border-b border-[#EBE1D7]/60 z-40 shadow-sm flex flex-col items-center py-6 space-y-6 text-xs font-medium tracking-[0.2em] text-gray-600">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black transition-colors w-full text-center block">HOME</Link>
          <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black transition-colors w-full text-center block">SHOP</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black transition-colors w-full text-center block">ABOUT US</Link>
        </div>
      )}

      {/* --- AREA KONTEN DINAMIS --- */}
   <Routes>
     <Route path="/checkout" element={<Checkout clearCart={clearCart} />} />
     <Route path="/" element={<Home addToCart={addToCart} />} />
     <Route path="/shop" element={<Shop addToCart={addToCart} />} />
     {/* INJEKSI RUTE BARU */}
     <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
     <Route path="/about" element={<About />} />
   </Routes>

      {/* --- INJEKSI: GLOBAL FOOTER (KONTAK & SOSMED) --- */}
      <div className="py-12 border-t border-[#D6C8B3] mt-16 flex flex-col items-center justify-center text-center bg-[#F7F3EF]">
        <h3 className="font-serif text-xl text-[#28282B] mb-6">Hubungi Kami</h3>

        <div className="flex flex-col md:flex-row gap-6 md:gap-12 text-xs font-semibold tracking-widest uppercase text-gray-500">
          {/* Link Email */}
          <a
            href="mailto:solemates365.id@gmail.com"
            className="flex items-center justify-center gap-2 hover:text-black transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
            </svg>
            solemates365.id@gmail.com
          </a>

          {/* Link Instagram */}
          <a
            href="https://www.instagram.com/solemates365.id?igsh=MTR3ZDkzdnR1NDY3cg=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 hover:text-black transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.036 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
            </svg>
            @solemates365.id
          </a>
        </div>
      </div>
      {/* ---------------------------------------------------- */}

    </div>
  );
}

export default App;