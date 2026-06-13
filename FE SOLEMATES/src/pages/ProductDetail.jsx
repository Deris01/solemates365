import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams(); // Menangkap ID dari URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single(); // Ambil hanya 1 baris yang cocok dengan ID

        if (error) throw error;

        // Hack Galeri (Sama seperti di Shop.jsx agar konsisten)
        const baseUrl = data.image_url.replace('.jpeg', '').replace('.jpg', '').replace('.png', '');
        const extension = data.image_url.split('.').pop();
        const gallery = [data.image_url, `${baseUrl}-2.${extension}`];

        setProduct({ ...data, imageGallery: gallery });
        setMainImage(data.image_url); // Set gambar utama pertama kali
      } catch (error) {
        console.error("Produk tidak ditemukan:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const formatIDR = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  if (loading) return <div className="min-h-screen pt-40 text-center tracking-widest text-xs uppercase text-gray-500">Memuat detail produk...</div>;
  
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F3EF]">
      <p className="text-gray-500 mb-4">Produk yang Anda cari tidak ditemukan.</p>
      <button onClick={() => navigate('/shop')} className="underline tracking-widest text-xs uppercase hover:text-black">Kembali ke Shop</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F3EF] pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
      {/* Tombol Back */}
      <button onClick={() => navigate('/shop')} className="text-xs font-semibold tracking-widest uppercase text-gray-400 hover:text-black mb-10 flex items-center transition-colors">
        &#10094; Kembali ke Katalog
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Kolom Kiri: Galeri Foto */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#EBE1D7]/40 aspect-[4/5] w-full overflow-hidden flex items-center justify-center">
            <img src={mainImage} alt={product.name} className="w-full h-full object-cover transition-opacity duration-500" />
          </div>
          {/* Thumbnail Selektor */}
          <div className="flex gap-4">
            {product.imageGallery.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setMainImage(img)} 
                className={`w-20 h-24 bg-[#EBE1D7]/40 border-b-2 ${mainImage === img ? 'border-[#28282B]' : 'border-transparent'} overflow-hidden transition-all duration-300 opacity-70 hover:opacity-100`}
              >
                <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Detail & Deskripsi (FULL TEXT) */}
        <div className="flex flex-col pt-4 lg:pt-10">
          <h1 className="font-serif text-4xl text-[#28282B] mb-2">{product.name}</h1>
          <p className="text-2xl font-medium text-[#8B6E5A] mb-8">{formatIDR(product.price)}</p>
          
          <div className="w-full h-px bg-[#D6C8B3]/50 mb-8"></div>
          
          <div className="mb-10">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">Detail Produk</h3>
            <p className="text-sm text-gray-600 leading-loose text-justify">
              {product.description}
            </p>
          </div>

          <div className="mt-auto">
            <p className="text-xs text-gray-400 mb-4 uppercase tracking-widest">Stok Tersedia: {product.stock}</p>
            <button 
              onClick={() => addToCart(product)}
              className="w-full bg-[#28282B] text-white py-4 text-xs font-semibold tracking-widest uppercase hover:bg-black transition-colors shadow-md"
            >
              Tambah ke Keranjang
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;