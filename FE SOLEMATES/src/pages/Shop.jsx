import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; 
import ProductCard from '../components/ProductCard'; // Pastikan path importnya benar

const Shop = ({ addToCart }) => {
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*'); 
      if (error) throw error;

      // --- INJEKSI DATA GALERI ---
      const productsWithGallery = data.map(product => {
        const baseUrl = product.image_url.replace('.jpeg', '').replace('.jpg', '').replace('.png', '');
        const extension = product.image_url.split('.').pop(); 

        return {
          ...product,
          imageGallery: [
            product.image_url, 
            `${baseUrl}-2.${extension}` // Hanya memanggil gambar kedua
          ]
        };
      });
      // ----------------------------

      setDbProducts(productsWithGallery);
    } catch (error) {
      console.error('Gagal mengambil data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const formatIDR = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3EF] flex items-center justify-center">
        <p className="font-light text-sm tracking-widest text-gray-500 uppercase animate-pulse">Menghubungkan ke Database Cloud...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EF] pt-32 pb-24 px-12 max-w-7xl mx-auto">
      {/* HEADER LAMA */}
      <div className="text-center mb-16">
        <h1 className="font-serif text-5xl tracking-wide text-[#28282B] mb-4">All Collection</h1>
        <p className="font-light text-xs tracking-[0.2em] text-gray-500 uppercase">Koleksi Lengkap Kami</p>
      </div>

      {/* --- INJEKSI TEKS/NAMA TOKO DI ATAS GRID --- */}
      <div className="flex items-center justify-between border-b border-[#D6C8B3] pb-4 mb-8">
        <h2 className="font-serif text-2xl text-[#28282B]">Solemates365 Exclusive</h2>
        <span className="text-xs font-medium tracking-widest text-gray-400 uppercase">
          {dbProducts.length} Produk Tersedia
        </span>
      </div>
      {/* ------------------------------------------ */}

      {/* GRID PRODUK */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
        {dbProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            addToCart={addToCart} 
            formatIDR={formatIDR} 
          />
        ))}
      </div>
    </div>
  );
};

export default Shop;