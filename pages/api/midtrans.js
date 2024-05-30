require('dotenv').config();
import midtransClient from 'midtrans-client';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { order_id, gross_amount, first_name, email, phone } = req.body;

        // Buat instance Snap API
        let snap = new midtransClient.Snap({
            isProduction: true,
            serverKey: process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY,
            clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
        });

        // Buat parameter transaksi
        let parameter = {
            transaction_details: {
                order_id,
                gross_amount,
            },
            credit_card: {
                secure: true
            },
            customer_details: {
                first_name,
                email,
                phone
            }
        };

        try {
            const transaction = await snap.createTransaction(parameter);
            res.status(200).json(transaction);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
