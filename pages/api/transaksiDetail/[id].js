import axios from 'axios';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Transaction ID is required' });
  }

  try {
    const response = await axios.get(`https://api.upos-conn.com/master/v1.3/api/PosTransaksiDetail/${id}`, {
      headers: {
        'X-API-Key': 'd8086ade14369d53a3421d765793e0ac53ec8c4b',
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    res.status(500).json({ error: 'Failed to fetch transaction details' });
  }
}
