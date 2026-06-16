import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, addToCart, formatIDR }) => {
  const navigate = useNavigate(); // TAMBAHKAN INI
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  // ...

  // LOGIKA "HACK": Jika produk memiliki array gallery, gunakan itu. Jika tidak, jadikan image_url tunggal sebagai array.
  const images = product.imageGallery || [product.image_url];

  const nextImg = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div 
      className="group flex flex-col cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)} // TAMBAHKAN INI
    >
      <div className="bg-[#EBE1D7]/40 aspect-[4/5] mb-5 overflow-hidden flex items-center justify-center relative shadow-xs transition-all duration-500 group-hover:shadow-md">
        
        <img 
          src={images[currentImgIndex]} 
          alt={`${product.name} view ${currentImgIndex + 1}`} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Tombol Slider Kiri/Kanan (Hanya muncul jika hover & gambar > 1) */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImg}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
            >
              &#10094;
            </button>
            <button 
              onClick={nextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
            >
              &#10095;
            </button>
            
            {/* Dots */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1 rounded-full transition-all duration-300 ${idx === currentImgIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}

        {/* TOMBOL ADD TO CART */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="w-full bg-white/90 backdrop-blur-xs text-[#28282B] py-3 text-[10px] font-semibold tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-300 shadow-md transform translate-y-2 group-hover:translate-y-0"
          >
            + Add To Cart
          </button>
        </div>

      </div>

      {/* AREA TEKS DETAIL PRODUK YANG BARU */}
      <div className="flex flex-col items-center text-center mt-4 px-2">
        <h3 className="font-serif text-base text-[#28282B] tracking-wide group-hover:text-[#8B6E5A] transition-colors">
          {product.name}
        </h3>
        
        <p className="text-[11px] text-gray-500 mt-2 line-clamp-3 leading-relaxed px-2">
       {product.description || "Deskripsi produk belum tersedia."}
     </p>

        <p className="text-sm font-medium tracking-wider text-gray-800 mt-3">
          {formatIDR(product.price)}
        </p>
        <p className="text-[10px] text-gray-400 mt-1 font-light">
          Stok: {product.stock} pasang
        </p>
      </div>

    </div>
  );
};

export default ProductCard;