import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { id, page = 1, limit = 10 } = req.query; // Mengambil ID kategori, halaman, dan batasan dari parameter permintaan
    // Pastikan ID kategori tidak kosong atau undefined
    if (!id) {
      throw new Error('Category ID is required');
    }

    const response = await axios.get(`https://api.upos-conn.com/master/v1.3/api/produkbykategori/9/${id}`, {
      headers: {
        'X-API-Key': 'd8086ade14369d53a3421d765793e0ac53ec8c4b' // Ganti dengan API key Anda
      },
      params: {
        page: page,
        limit: limit
      }
    });

    const responseData = response.data;
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching categoriesId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
