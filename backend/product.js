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
    const response = await axios.get('https://api.upos-conn.com/master/v1.3/api/posProduk/9', {
      headers: {
        'X-API-Key': 'd8086ade14369d53a3421d765793e0ac53ec8c4b'
      }
    });
    const products = response.data.results;
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

