// File: pages/api/discount.js

import axios from 'axios';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const response = await axios.get(`https://api.upos-conn.com/master/v1.3/api/PosTransaksi-showTransaksiByidPlg-All/${id}`, {
      headers: {
        'X-API-Key': 'd8086ade14369d53a3421d765793e0ac53ec8c4b' // Ganti dengan API key Anda
      }
    });
    const transaksi = response.data;
    res.status(200).json(transaksi);
  } catch (error) {
    console.error('Error fetching discount:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
