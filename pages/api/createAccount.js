import axios from 'axios';
import qs from 'qs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Parse the urlencoded body using qs
      const formData = qs.parse(req.body);

      const { posNama, posEmail, posPassword, posNoTelp, posUserId } = formData;

      const response = await axios.post('https://api.upos-conn.com/auth/v1/posAuth-createCustomer', {
        posNama,
        posEmail,
        posPassword,
        posNoTelp,
        posUserId
      });

      res.status(200).json(response.data);
    } catch (error) {
      console.error('API call error:', error);
      // Check if error.response exists before trying to read status property
      if (error.response && error.response.status) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
