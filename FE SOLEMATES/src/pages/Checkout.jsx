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
      const response = await fetch('http://localhost:5000/api/payment', {
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
        </div>

      </div>
    </div>
  );
};

export default Checkout;