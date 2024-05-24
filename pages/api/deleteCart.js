// pages/api/delete.js

import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { csoId } = req.body;

    try {
      const response = await axios.delete(`https://api.upos-conn.com/master/v1.3/api/PosCartStore/${csoId}`, {
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
      res.status(error.response.status || 500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
