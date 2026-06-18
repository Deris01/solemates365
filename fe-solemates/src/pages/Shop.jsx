import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; 
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';

const Shop = ({ addToCart }) => {
  // 1. Tangkap Parameter URL
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  // 2. State Data
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. Fungsi Ambil Data Supabase (Biarkan murni mengambil data)
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
            `${baseUrl}-2.${extension}`
          ]
        };
      });

      setDbProducts(productsWithGallery);
    } catch (error) {
      console.error('Gagal mengambil data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const formatIDR = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  // 4. LOGIKA FILTER DINAMIS (Diletakkan di luar fetch, agar selalu bereaksi terhadap URL)
  const filteredProducts = dbProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tampilan Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3EF] flex items-center justify-center">
        <p className="font-light text-sm tracking-widest text-gray-500 uppercase animate-pulse">Menghubungkan ke Database Cloud...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EF] pt-32 pb-24 px-12 max-w-7xl mx-auto">
      {/* HEADER DINAMIS PENCARIAN */}
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl text-[#28282B] mb-3">
          {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : "All Collection"}
        </h1>
        <p className="font-light text-xs tracking-[0.2em] text-gray-500 uppercase">
          {searchQuery ? "Ditemukan dalam katalog kami" : "Koleksi Lengkap Kami"}
        </p>
      </div>

      <div className="flex items-center justify-between border-b border-[#D6C8B3] pb-4 mb-8">
        <h2 className="font-serif text-2xl text-[#28282B]">Solemates365 Exclusive</h2>
        <span className="text-xs font-medium tracking-widest text-gray-400 uppercase">
          {filteredProducts.length} Produk Tersedia
        </span>
      </div>

      {/* GRID PRODUK YANG SUDAH DIFILTER */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 tracking-widest uppercase text-sm">Produk tidak ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              addToCart={addToCart} 
              formatIDR={formatIDR} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;