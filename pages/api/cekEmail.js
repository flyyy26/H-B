import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { email } = req.query;

    // Panggil API untuk memeriksa email
    const API_URL = `https://api.upos-conn.com/auth/v1/posAuth/${email}`;  
    const API_KEY = 'd8086ade14369d53a3421d765793e0ac53ec8c4b';

    try {
      const response = await axios.get(API_URL, {
        headers: {
          'x-api-key': API_KEY
        }
      });

      if (response.data.status === 'success') {
        // Email tersedia
        res.status(200).json({ available: true });
      } else {
        // Email sudah digunakan
        res.status(200).json({ available: false });
      }
    } catch (error) {
      console.error('Error checking email:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
