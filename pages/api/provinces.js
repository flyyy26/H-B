// File: pages/api/provinces.js

import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://pro.rajaongkir.com/api/province', {
      headers: {
        'key': '6b69e8eec2fcb0f60490f9d8051ecefd' // Ganti dengan API key Anda
      }
    });
    const provinces = response.data.rajaongkir.results;
    res.status(200).json(provinces);
  } catch (error) {
    console.error('Error fetching provinces:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
