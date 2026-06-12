// 1. PALING ATAS: Load dotenv
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const midtransClient = require('midtrans-client');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors({ origin: 'http://localhost:5173' })); 
app.use(express.json());

// 2. Inisialisasi Midtrans menggunakan variabel lingkungan
let snap = new midtransClient.Snap({
    isProduction : false,
    serverKey : process.env.MIDTRANS_SERVER_KEY,
    clientKey : process.env.MIDTRANS_CLIENT_KEY
});

// 3. Inisialisasi Supabase menggunakan variabel lingkungan
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Endpoint Pembayaran (Minta Token)
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

// 4. ENDPOINT WEBHOOK
app.post('/api/webhook', async (req, res) => {
    try {
        const notificationJson = req.body;
        const statusResponse = await snap.transaction.notification(notificationJson);
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        console.log(`Notifikasi Midtrans datang! Order ID: ${orderId}, Status: ${transactionStatus}`);

        const parts = orderId.split('-'); 
        const dbOrderId = parseInt(parts[1], 10);

        let finalStatus = 'PENDING';
        if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
            finalStatus = (fraudStatus === 'challenge') ? 'CHALLENGE' : 'PAID';
        } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
            finalStatus = 'FAILED';
        }

        const { error } = await supabase
            .from('orders')
            .update({ status: finalStatus })
            .eq('id', dbOrderId);

        if (error) throw error;

        console.log(`Database berhasil di-update: Order ${dbOrderId} menjadi ${finalStatus}`);

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
        console.error("Kesalahan Webhook:", error);
        res.status(500).send("Internal Server Error");
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend Pembayaran aktif di http://localhost:${PORT}`));