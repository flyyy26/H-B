import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { id } = req.query; // Mengambil ID artikel dari parameter permintaan
    const response = await axios.get(`https://roomcode.my.id/api/articles/${id}`, {
      headers: {
        'api_key': 'aGVlYuXDRtCZOBcoK8xjpluX0jqqDxDBvso7RqUe' // Ganti dengan API key Anda
      }
    });
    const articleId = response.data;
    res.status(200).json(articleId);
  } catch (error) {
    console.error('Error fetching articleId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
