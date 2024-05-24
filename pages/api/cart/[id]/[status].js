// pages/api/cart/[id]/[status].js
import axios from 'axios';

export default async function handler(req, res) {
  const { id, status } = req.query;

  try {
    const response = await axios.get(`https://api.upos-conn.com/master/v1.3/api/PosCartStore/${id}/${status}`, {
      headers: { 'X-API-Key': 'd8086ade14369d53a3421d765793e0ac53ec8c4b' }
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch data', error: error.message });
  }
}
