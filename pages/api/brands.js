// File: pages/api/brands.js

import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://prahwa.net/api/brands', {
      headers: {
        'api_key': 'aGVlYuXDRtCZOBcoK8xjpluX0jqqDxDBvso7RqUe' // Ganti dengan API key Anda
      }
    });
    const brands = response.data;
    res.status(200).json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
 