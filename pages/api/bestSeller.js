// File: pages/api/category.js

import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get(`https://api.upos-conn.com/master/v1.3/api/posProduk-showRekomendasi/9`, {
      headers: {
        'X-API-Key': 'd8086ade14369d53a3421d765793e0ac53ec8c4b' // Ganti dengan API key Anda
      }
    });
    const category = response.data;
    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
