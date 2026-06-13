import React from 'react';
import { products } from '../data/products'; // Menggunakan data lokal untuk Home (atau ubah ke Supabase nanti)
import { Link } from 'react-router-dom';

// 1. TANGKAP PROPS addToCart DARI APP.JSX
const Home = ({ addToCart }) => {
  const formatIDR = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="bg-[#F7F3EF] font-sans text-[#28282B] min-h-screen">
      
      {/* --- HERO VIDEO SECTION --- */}
      <header className="relative w-full h-[85vh] md:h-screen overflow-hidden flex items-center px-12 md:px-24">
        
        {/* Tag Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/videos/promo.mp4" type="video/mp4" />
        </video>

        {/* Lapisan Gradasi Gelap (Penting agar teks putih tetap terbaca di atas video yang bergerak) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10"></div>
        
        {/* Konten Teks Anda (Dipertahankan) */}
        <div className="relative z-20 max-w-xl text-white">
          <h1 className="font-serif text-5xl md:text-7xl font-light leading-[1.15] mb-6 tracking-wide drop-shadow-lg">
            Find Your Solmate<br /><span className="italic font-normal">In Every Step</span>
          </h1>
          <p className="mb-10 text-[#EBE1D7] text-sm md:text-base font-light tracking-wide leading-relaxed max-w-sm drop-shadow-md">
            Simple, comfortable, and meticulously crafted to match your everyday movement.
          </p>
          <button onClick={() => window.location.href='/shop'} className="bg-[#EBE1D7] text-[#4E433C] text-[11px] font-medium tracking-[0.25em] uppercase px-10 py-4 rounded-none hover:bg-black hover:text-white transition-all duration-300 shadow-xl hover:-translate-y-0.5">
            SHOP NOW
          </button>
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
                  {/* 2. GUNAKAN FUNGSI addToCart YANG DITANGKAP DARI PROPS */}
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
};

export default Home;