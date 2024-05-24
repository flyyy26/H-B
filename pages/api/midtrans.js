import midtransClient from 'midtrans-client';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { order_id, gross_amount, first_name, email, phone } = req.body;

        // Buat instance Snap API
        let snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: 'SB-Mid-server-yo4sa1GQ0twYnZxe0QExrvv4',
            clientKey: 'SB-Mid-client-S6EszAqNswaDdtwr'
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
