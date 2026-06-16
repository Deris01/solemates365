// 1. Load Environment Variables (Harus paling atas)
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const midtransClient = require('midtrans-client');
const { createClient } = require('@supabase/supabase-js');

// 2. Inisialisasi Aplikasi Express
const app = express();

// 3. Konfigurasi Port & CORS untuk Cloud
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ['http://localhost:5173', 'https://solemates365.netlify.app'] })); 
app.use(express.json());

// 4. Inisialisasi Midtrans
let snap = new midtransClient.Snap({
    isProduction : false,
    serverKey : process.env.MIDTRANS_SERVER_KEY,
    clientKey : process.env.MIDTRANS_CLIENT_KEY
});

// 5. Inisialisasi Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// --- ROUTING / ENDPOINTS ---

// Endpoint A: Pembayaran (Minta Token Snap)
app.post('/api/payment', (req, res) => {
    const { order_id, gross_amount, customer_name, customer_email } = req.body;
    let parameter = {
        "transaction_details": { "order_id": order_id, "gross_amount": gross_amount },
        "customer_details": { "first_name": customer_name, "email": customer_email }
    };

    snap.createTransaction(parameter)
        .then((transaction) => res.json({ token: transaction.token }))
        .catch((e) => res.status(500).json({ error: e.message }));
});

// Endpoint B: Webhook Midtrans (Penerima Notifikasi)
app.post('/api/webhook', async (req, res) => {
    try {
        // (Opsional) Keamanan dasar bisa ditambahkan di sini menggunakan authHeader
        const authHeader = req.headers['authorization'];
        
        const notificationJson = req.body;
        const statusResponse = await snap.transaction.notification(notificationJson);
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        console.log(`[WEBHOOK] Order ID: ${orderId} | Status: ${transactionStatus}`);

        // Format order_id kita adalah SOLEA-[ID_DB]-[TIMESTAMP]
        const parts = orderId.split('-'); 
        const dbOrderId = parseInt(parts[1], 10);

        let finalStatus = 'PENDING';
        if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
            finalStatus = (fraudStatus === 'challenge') ? 'CHALLENGE' : 'PAID';
        } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
            finalStatus = 'FAILED';
        }

        // Update status di Supabase
        const { error } = await supabase
            .from('orders')
            .update({ status: finalStatus })
            .eq('id', dbOrderId);

        if (error) throw error;
        console.log(`[DB] Order ${dbOrderId} status updated to ${finalStatus}`);

        // Jika LUNAS, kurangi stok
        if (finalStatus === 'PAID') {
            const { data: items } = await supabase
                .from('order_items')
                .select('product_id, quantity')
                .eq('order_id', dbOrderId);

            if (items) {
                for (let item of items) {
                    const { data: productData } = await supabase
                        .from('products')
                        .select('stock')
                        .eq('id', item.product_id)
                        .single();

                    if (productData) {
                        await supabase
                            .from('products')
                            .update({ stock: productData.stock - item.quantity })
                            .eq('id', item.product_id);
                    }
                }
            }
        }
        res.status(200).send("OK");
    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 6. Jalankan Server
app.listen(PORT, () => {
    console.log(`Server Backend aktif dan berjalan di port ${PORT}`);
});