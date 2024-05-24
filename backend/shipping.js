const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware untuk parsing body request
app.use(bodyParser.json());

// Rute untuk menghitung ongkos kirim
app.post('/calculate-shipping', async (req, res) => {
    const {origin, destination, weight, courier} = req.body;

    try {
        const response = await axios.post('https://pro.rajaongkir.com/api/cost', {
            origin, // kota asal
            destination, // kota tujuan
            weight, // berat paket dalam gram
            courier // kode kurir, misal: jne, tiki, pos
        }, {
            headers: {
                key: '6b69e8eec2fcb0f60490f9d8051ecefd' // Ganti dengan API Key Anda
            }
        });

        // Kirim respons ke client
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat menghubungi RajaOngkir');
    }
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
