// pages/api/addToCart.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { posUser_id, posVarian_id } = req.body;
      const payload = {
        posUser_id,
        posVarian_id,
        posStatus_cso: 2,
        posQty: 1
      };

      const response = await axios.post(
        'https://api.upos-conn.com/master/v1.3/api/PosCartStore',
        payload,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-API-Key': 'd8086ade14369d53a3421d765793e0ac53ec8c4b'
          }
        }
      );

      res.status(200).json(response.data);
    } catch (error) {
      res.status(error.response.status || 500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
