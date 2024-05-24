// pages/api/proxy.js

import axios from 'axios';

export default async function handler(req, res) {
  const { url } = req.query;

  try {
    const response = await axios.get(url, {
      headers: {
        'X-API-Key': 'd8086ade14369d53a3421d765793e0ac53ec8c4b'
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error proxying request:', error);
    res.status(error.response?.status || 500).json({ error: 'Internal server error' });
  }
}
