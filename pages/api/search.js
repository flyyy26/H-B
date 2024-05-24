import axios from 'axios';

export default async function handler(req, res) {
  const { searchQuery } = req.query;

  if (!searchQuery) {
    return res.status(400).json({ message: 'Missing search query' });
  }

  const apiKey = 'd8086ade14369d53a3421d765793e0ac53ec8c4b';
  const url = `https://api.upos-conn.com/master/v1.3/api/posProduk-varianbyname/9/${searchQuery}`;

  try {
    const response = await axios.get(url, {
      headers: { 'X-API-Key': apiKey },
    });

    if (response.data) {
      res.status(200).json(response.data);
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
