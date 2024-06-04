// File: pages/api/discount.js

import axios from 'axios';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const response = await axios.get(`http://hibxpress.com/api/shipping/check/${id}`);
    const transaksi = response.data;
    res.status(200).json(transaksi);
  } catch (error) {
    console.error('Error fetching discount:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
