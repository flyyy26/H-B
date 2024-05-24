// pages/api/hallo-express/[nama_kota].js
import axios from 'axios';

export default async function handler(req, res) {

  try {
    const response = await axios.get(`http://hibxpress.com/api/layanan/check`, {
      headers: {
        'api-key': 'hallo-beauty'
      }
    });

    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      res.status(response.status).json({ message: 'Error from external API' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
