import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      // Dapatkan parameter dari permintaan
      const { csoId } = req.query;
      const { posUser_id, posVarian_id, posStatus_cso, posQty } = req.body;

      // Panggil API PUT untuk mengubah quantity produk di keranjang
      const response = await axios.put(`https://api.upos-conn.com/master/v1.3/api/PosCartStore/${csoId}`, {
        posUser_id,
        posVarian_id,
        posStatus_cso,
        posQty
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-API-Key': 'd8086ade14369d53a3421d765793e0ac53ec8c4b'
        }
      });

      // Tanggapi dengan hasil dari panggilan API PUT
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Error editing quantity:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Tanggapi dengan metode yang tidak diizinkan jika bukan metode PUT
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
