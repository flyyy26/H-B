// import axios from 'axios';

// export default async function handler(req, res) {
//   try {
//     const { brandId } = req.query; // Mengambil brandId artikel dari parameter permintaan
//     const response = await axios.get(`https://api.upos-conn.com/master/v1.3/api/posProduk-varian-produk/${brandId}`, {
//       headers: {
//         'X-API-Key': 'd8086ade14369d53a3421d765793e0ac53ec8c4b' // Ganti dengan API key Anda
//       }
//     });
//     const productId = response.data;
//     res.status(200).json(productId);
//   } catch (error) {
//     console.error('Error fetching productId:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }

import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { id } = req.query; // Mengambil ID artikel dari parameter permintaan
    const response = await axios.get(`https://api.upos-conn.com/master/v1.3/api//posProduk-varian-produkShop/${id}`, {
      headers: {
        'X-API-Key': 'd8086ade14369d53a3421d765793e0ac53ec8c4b' // Ganti dengan API key Anda
      }
    });
    const productId = response.data;
    res.status(200).json(productId);
  } catch (error) {
    console.error('Error fetching productId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
