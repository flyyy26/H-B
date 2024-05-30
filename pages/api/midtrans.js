import midtransClient from 'midtrans-client';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { order_id, gross_amount, first_name, email, phone } = req.body;

        // Buat instance Snap API
        let snap = new midtransClient.Snap({
            isProduction: true,
            serverKey: 'Mid-server-1QFhZE1u8jktUdMJgsvQtizR',
            clientKey: 'Mid-client-LqB2N4zhOwgOxZn0'
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

// const express = require('express');
// const midtransClient = require('midtrans-client');
// const router = express.Router();

// // Initialize Midtrans Snap client
// let snap = new midtransClient.Snap({
//     isProduction: false, // Set to true if using production environment
//     serverKey: 'Mid-server-1QFhZE1u8jktUdMJgsvQtizR',
//     clientKey: 'Mid-client-LqB2N4zhOwgOxZn0'
// });

// router.post('/api/midtrans', async (req, res) => {
//     const { order_id, gross_amount, first_name, email, phone } = req.body;

//     const parameter = {
//         transaction_details: {
//             order_id: order_id,
//             gross_amount: gross_amount
//         },
//         customer_details: {
//             first_name: first_name,
//             email: email,
//             phone: phone
//         }
//     };

//     try {
//         const transaction = await snap.createTransaction(parameter);
//         res.status(200).json({ token: transaction.token });
//     } catch (error) {
//         console.error('Midtrans createTransaction error:', error);
//         res.status(500).json({ error: 'Failed to create Midtrans transaction' });
//     }
// });

// module.exports = router;
