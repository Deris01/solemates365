import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; // Impor client supabase

const Shop = () => {
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi asinkron untuk mengambil data dari PostgreSQL Supabase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*'); // Mengambil semua kolom
      
      if (error) throw error;
      setDbProducts(data);
    } catch (error) {
      console.error('Gagal mengambil data produk:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      <div className="text-center mb-16">
        <h1 className="font-serif text-5xl tracking-wide text-[#28282B] mb-4">All Collection</h1>
        <p className="font-light text-xs tracking-[0.2em] text-gray-500 uppercase">Membaca data langsung dari tabel PostgreSQL.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
        {dbProducts.map((product) => (
          <div key={product.id} className="group flex flex-col cursor-pointer">
            <div className="bg-[#EBE1D7]/40 aspect-[4/5] mb-5 overflow-hidden flex items-center justify-center relative shadow-xs transition-all duration-500 group-hover:shadow-md">
              <img 
                src={product.image_url} // Menggunakan nama kolom snake_case dari DB
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col items-center text-center mt-2">
              <h3 className="font-serif text-base text-[#28282B] tracking-wide group-hover:text-[#8B6E5A] transition-colors">{product.name}</h3>
              <p className="text-xs font-light tracking-wider text-gray-500 mt-1.5">{formatIDR(product.price)}</p>
              <p className="text-[10px] text-gray-400 mt-1 font-light">Stok: {product.stock} pasang</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;