// File: pages/api/cities.js

import axios from 'axios';

export default async function handler(req, res) {
  const { provinceId } = req.query;

  try {
    const response = await axios.get(`https://pro.rajaongkir.com/api/city?province=${provinceId}`, {
      headers: {
        'key': '6b69e8eec2fcb0f60490f9d8051ecefd' // Ganti dengan API key Anda
      }
    });
    const cities = response.data.rajaongkir.results;
    res.status(200).json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
