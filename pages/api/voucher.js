// File: pages/api/voucher.js

import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get(`https://prahwa.net/api/vouchers`, {
      headers: {
        'api_key': 'aGVlYuXDRtCZOBcoK8xjpluX0jqqDxDBvso7RqUe' // Ganti dengan API key Anda
      }
    });
    const voucher = response.data;
    res.status(200).json(voucher);
  } catch (error) {
    console.error('Error fetching voucher:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
