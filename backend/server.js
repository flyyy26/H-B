const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware untuk mengizinkan CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Endpoint untuk mendapatkan daftar provinsi
app.get('/provinces', async (req, res) => {
  try {
    const response = await axios.get('https://pro.rajaongkir.com/api/province', {
      headers: {
        'key': '6b69e8eec2fcb0f60490f9d8051ecefd' // Ganti dengan API key Anda
      }
    });
    const provinces = response.data.rajaongkir.results;
    res.json(provinces);
  } catch (error) {
    console.error('Error fetching provinces:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

