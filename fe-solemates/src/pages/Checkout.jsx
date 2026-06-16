import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Checkout = ({ clearCart }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Menangkap data keranjang yang dikirim dari App.jsx
  const cart = location.state?.cart || [];
  
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
  const formatIDR = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  // Mencegah akses langsung ke halaman ini jika keranjang kosong
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F3EF] flex flex-col items-center justify-center text-center px-6">
        <p className="text-gray-500 mb-6 tracking-widest text-sm uppercase">Sistem menolak: Keranjang Anda kosong.</p>
        <button onClick={() => navigate('/shop')} className="bg-[#28282B] text-white px-8 py-3 text-xs tracking-widest uppercase hover:bg-black transition-colors">
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Simpan ke Supabase (Orders)
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: formData.name,
          customer_email: formData.email,
          total_amount: cartTotal,
          status: 'PENDING'
        }])
        .select(); 

      if (orderError) throw orderError;
      const newOrderId = orderData[0].id;

      // 2. Simpan ke Supabase (Order Items)
      const orderItemsData = cart.map(item => ({
        order_id: newOrderId,
        product_id: item.id,
        quantity: item.qty,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData);

      if (itemsError) throw itemsError;

      // 3. Minta Token Pembayaran ke Backend Node.js Anda
      const response = await fetch('https://solemates365.vercel.app/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: `SOLEA-${newOrderId}-${Date.now()}`, // Midtrans butuh ID unik
          gross_amount: cartTotal,
          customer_name: formData.name,
          customer_email: formData.email
        }),
      });

      const paymentData = await response.json();

      if (!paymentData.token) {
        throw new Error("Token gagal didapatkan dari Backend");
      }

      // 4. Picu Pop-up Snap Midtrans
      window.snap.pay(paymentData.token, {
  onSuccess: function(result){
    alert("Pembayaran Berhasil! Keranjang telah dikosongkan.");
    clearCart(); // <--- INI ADALAH INSTRUKSI NYATA
    navigate('/', { replace: true });
  },
  // ... (biarkan fungsi onPending, onError, onClose seperti sebelumnya)

        onPending: function(result){
          alert("Menunggu pembayaran. Silakan selesaikan di ATM/Aplikasi Anda.");
          navigate('/', { replace: true });
        },
        onError: function(result){
          alert("Pembayaran gagal.");
        },
        onClose: function(){
          alert("Anda menutup jendela sebelum menyelesaikan pembayaran.");
        }
      });

    } catch (error) {
      console.error("Kegagalan Sistem:", error);
      alert('Terjadi kesalahan pada sistem transaksi.');
    } finally {
      setIsProcessing(false);
    }
  };

  const noWA = "6285726061573";
  const pesanWA = `Halo Admin Solemates365, saya ingin dibantu terkait konfirmasi pembayaran pesanan saya senilai ${formatIDR(cartTotal)}.`;
  const waLink = `https://wa.me/${noWA}?text=${encodeURIComponent(pesanWA)}`;

  return (
    <div className="min-h-screen bg-[#F7F3EF] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        
        {/* Kolom Formulir Data Pembeli */}
        <div>
          <h1 className="font-serif text-3xl text-[#28282B] mb-8">Informasi Pengiriman</h1>
          <form onSubmit={handleCheckout} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                required
                className="w-full bg-white border border-[#D6C8B3] p-4 text-sm focus:outline-none focus:border-[#28282B] transition-colors"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">Email</label>
              <input 
                type="email" 
                required
                className="w-full bg-white border border-[#D6C8B3] p-4 text-sm focus:outline-none focus:border-[#28282B] transition-colors"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <button 
              type="submit" 
              disabled={isProcessing}
              className={`w-full py-4 mt-4 text-xs font-semibold tracking-widest uppercase text-white transition-colors ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#28282B] hover:bg-black shadow-md'}`}
            >
              {isProcessing ? 'Menulis ke Database...' : 'Selesaikan Pembayaran'}
            </button>
          </form>
        </div>

        {/* Kolom Ringkasan Keranjang */}
        <div className="bg-[#EBE1D7]/30 p-8 border border-[#D6C8B3]/50">
          <h2 className="font-serif text-2xl text-[#28282B] mb-6 border-b border-[#D6C8B3] pb-4">Ringkasan Pesanan</h2>
          <div className="space-y-4 mb-6">
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name} <span className="text-xs text-gray-400">x{item.qty}</span></span>
                <span className="font-medium text-[#28282B]">{formatIDR(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-lg pt-4 border-t border-[#D6C8B3]">
            <span>Total Bayar</span>
            <span>{formatIDR(cartTotal)}</span>
          </div>

          {/* --- INJEKSI 2: UI TOMBOL WHATSAPP --- */}
          <div className="mt-8 pt-6 border-t border-[#D6C8B3]/50 flex flex-col items-center">
            <p className="text-xs text-gray-500 mb-3 text-center">
              Kendala sistem atau butuh transfer manual?
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-3 text-xs font-semibold tracking-widest uppercase transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
              </svg>
              Konfirmasi via WhatsApp
            </a>
          </div>
          {/* ------------------------------------------- */}

        </div>
      </div>
    </div>
  );
};

export default Checkout;