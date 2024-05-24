

import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://prahwa.net/api/articles', {
      headers: {
        'api_key': 'aGVlYuXDRtCZOBcoK8xjpluX0jqqDxDBvso7RqUe' // Ganti dengan API key Anda
      }
    });
    const articles = response.data;
    res.status(200).json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
