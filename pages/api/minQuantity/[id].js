// pages/api/plusQuantity/[id].js

import axios from 'axios';

export default async function handler(req, res) {
  const { id } = req.query; // Mengakses nilai id dari path endpoint

  if (req.method === 'GET') {
    try {
      const response = await axios.get(`https://api.upos-conn.com/master/v1.3/api/PosCartStoreUpdateQtyMin/${id}`, { 
        headers: {
          'X-API-Key': 'd8086ade14369d53a3421d765793e0ac53ec8c4b'
        }
      });

      if (response.status === 200) {
        res.status(200).json({ success: response.data.messages.success });
      } else {
        res.status(response.status).json({ error: response.statusText });
      }
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
