// File: pages/api/districts.js

import axios from 'axios';

export default async function handler(req, res) {
  const { cityId } = req.query;

  try {
    const response = await axios.get(`https://pro.rajaongkir.com/api/subdistrict?city=${cityId}`, {
      headers: {
        'key': '6b69e8eec2fcb0f60490f9d8051ecefd' // Ganti dengan API key Anda
      }
    });
    const districts = response.data.rajaongkir.results;
    res.status(200).json(districts);
  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
