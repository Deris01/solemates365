import React, { useState } from 'react';
import { products } from '../data/products';

function App() {
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

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
  const cartItemCount = cart.reduce((count, item) => count + item.qty, 0);
  const formatIDR = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="min-h-screen bg-[#F7F3EF] font-sans text-[#28282B] antialiased selection:bg-[#8B6E5A] selection:text-white">
      
      {/* --- CART SIDEBAR --- */}
      <div className={`fixed top-0 right-0 h-full w-85 bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
              <span className="text-gray-500">Total Ringkasan:</span>
              <span className="text-lg font-semibold">{formatIDR(cartTotal)}</span>
            </div>
            <button 
              className={`w-full py-4 rounded-none text-xs font-semibold tracking-widest uppercase transition-all duration-300 ${cart.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#28282B] text-white hover:bg-black shadow-md'}`}
              disabled={cart.length === 0}
            >
              PROSES CHECKOUT
            </button>
          </div>
        </div>
      </div>

      {/* --- OVERLAY --- */}
      {isCartOpen && <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 transition-opacity duration-500" onClick={() => setIsCartOpen(false)}></div>}

      {/* --- NAVIGATION --- */}
      <nav className="sticky top-0 bg-[#F7F3EF]/90 backdrop-blur-md flex justify-between items-center px-12 py-5 z-30 border-b border-[#EBE1D7]/60 transition-all">
        <div className="font-serif text-2xl tracking-[0.2em] font-semibold text-[#28282B]">Solemates365</div>
        <div className="hidden md:flex space-x-10 text-[11px] font-medium tracking-[0.2em] text-gray-400">
          <a href="#" className="text-black transition-colors">HOME</a>
          <a href="#" className="hover:text-black transition-colors">SHOP</a>
          <a href="#" className="hover:text-black transition-colors">ABOUT US</a>
          <a href="#" className="hover:text-black transition-colors">FAQ</a>
          <a href="#" className="hover:text-black transition-colors">CONTACT</a>
        </div>
        <div className="flex space-x-6 items-center text-gray-700">
          <button className="hover:text-black transition-colors text-sm focus:outline-none">🔍</button>
          <button onClick={() => setIsCartOpen(true)} className="relative hover:text-black transition-colors text-base focus:outline-none">
            🛍️
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#8B6E5A] text-white text-[9px] font-semibold w-4 h-4 flex items-center justify-center rounded-full animate-scaleIn">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative w-full h-[650px] bg-[#4E433C] flex items-center px-12 md:px-24 overflow-hidden">
        {/* Lapisan Gradasi Estetis pada Gambar Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 w-full md:w-3/5 h-full bg-cover bg-center opacity-70 transition-transform duration-700 hover:scale-102" style={{ backgroundImage: "url('/public/logo.png')" }}></div>
        
        <div className="relative z-20 max-w-xl text-white">
          <h1 className="font-serif text-5xl md:text-7xl font-light leading-[1.15] mb-6 tracking-wide drop-shadow-xs">
            Find Your Solmate<br /><span className="italic font-normal">In Every Step</span>
          </h1>
          <p className="mb-10 text-[#EBE1D7] text-sm md:text-base font-light tracking-wide leading-relaxed max-w-sm">
            Simple, comfortable, and meticulously crafted to match your everyday movement.
          </p>
          <button className="bg-[#EBE1D7] text-[#4E433C] text-[11px] font-medium tracking-[0.25em] uppercase px-10 py-4 rounded-none hover:bg-black hover:text-white transition-all duration-300 shadow-xl hover:-translate-y-0.5">SHOP NOW</button>
        </div>
      </header>

      {/* --- FEATURES BANNER --- */}
      <section className="bg-[#EBE1D7] py-6 flex flex-wrap justify-center gap-16 border-b border-[#D6C8B3]/50 text-xs tracking-[0.15em] uppercase text-gray-600 font-medium">
        <div className="flex items-center space-x-3">
          <span className="text-[#8B6E5A] text-base">✨</span> <span>High Quality Material</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-[#8B6E5A] text-base">☁️</span> <span>All Day Comfort</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-[#8B6E5A] text-base">🌿</span> <span>Easy to Style</span>
        </div>
      </section>

      {/* --- PRODUCT GRID SECTION --- */}
      <section className="py-24 px-12 max-w-7xl mx-auto">
        <h2 className="font-serif text-4xl text-center tracking-wide mb-3">Best Seller</h2>
        <p className="text-center font-light text-xs tracking-[0.2em] text-gray-400 uppercase mb-16">Koleksi terlaris musim ini</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col">
              {/* Pembungkus Gambar dengan Efek Hover Halus */}
              <div className="bg-[#EBE1D7]/40 aspect-[4/5] mb-5 overflow-hidden rounded-none flex items-center justify-center relative shadow-xs transition-all duration-500 group-hover:shadow-md">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Overlay Tombol Cepat saat di-hover */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-white/90 backdrop-blur-xs text-[#28282B] py-3 text-[10px] font-semibold tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-300 shadow-md transform translate-y-2 group-hover:translate-y-0"
                  >
                    + Add To Cart
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col items-center text-center mt-2">
                <h3 className="font-serif text-base text-[#28282B] tracking-wide group-hover:text-[#8B6E5A] transition-colors">{product.name}</h3>
                <p className="text-xs font-light tracking-wider text-gray-500 mt-1.5">{formatIDR(product.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#4E433C] text-[#EBE1D7] pt-20 pb-10 px-12 border-t border-[#4E433C]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-xs font-light tracking-wide mb-16">
          <div className="space-y-4">
            <h4 className="font-serif text-2xl tracking-widest text-white font-medium">Solemates365</h4>
            <p className="text-gray-400 leading-relaxed font-light">Elegant. Timeless. Everyday.<br />Tema website yang hangat, minimalis, dan feminin dengan sentuhan classy.</p>
          </div>
          <div className="space-y-3">
            <h5 className="text-white font-medium tracking-[0.15em] uppercase mb-2">Shop</h5>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">All Products</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Best Seller</a></li>
              <li><a href="#" className="hover:text-white transition-colors">New In</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="text-white font-medium tracking-[0.15em] uppercase mb-2">Customer Care</h5>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="text-white font-medium tracking-[0.15em] uppercase mb-2">Newsletter</h5>
            <p className="text-gray-400 leading-relaxed">Dapatkan pembaruan promosi langsung di kotak masuk Anda.</p>
            <div className="flex border-b border-gray-500 pb-1">
              <input type="email" placeholder="Your email" className="bg-transparent text-white focus:outline-none text-xs w-full font-light" />
              <button className="text-gray-400 hover:text-white transition-colors">➔</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-850 pt-8 text-center text-[10px] text-gray-500 tracking-widest uppercase">
          &copy; {new Date().getFullYear()} Solemates365. All Rights Reserved.
        </div>
      </footer>

    </div>
  );
}

export default App;