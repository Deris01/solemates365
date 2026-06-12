import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';

function App() {
  const navigate = useNavigate();
  
  // 1. STATE GLOBAL DIKEMBALIKAN KE LEVEL TERATAS
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
        <div className="hidden md:flex space-x-10 text-[11px] font-medium tracking-[0.2em] text-gray-400">
          <Link to="/" className="hover:text-black transition-colors">HOME</Link>
          <Link to="/shop" className="hover:text-black transition-colors">SHOP</Link>
          <Link to="/about" className="hover:text-black transition-colors">ABOUT US</Link>
        </div>
        <div className="flex space-x-6 items-center text-gray-700">
          <button className="hover:text-black transition-colors text-sm focus:outline-none">🔍</button>
          {/* KERANJANG HIDUP */}
          <button onClick={() => setIsCartOpen(true)} className="relative hover:text-black transition-colors text-base focus:outline-none">
            🛍️
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#8B6E5A] text-white text-[9px] font-semibold w-4 h-4 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* --- AREA KONTEN DINAMIS --- */}
      <Routes>
        <Route path="/checkout" element={<Checkout clearCart={clearCart} />} />
        {/* OPER FUNGSI SEBAGAI PROPS AGAR HALAMAN BISA MENAMBAH BARANG */}
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/shop" element={<Shop addToCart={addToCart} />} />
        <Route path="/about" element={<About />} />
      </Routes>

    </div>
  );
}

export default App;