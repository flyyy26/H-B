
    import axios from 'axios';

export default async function handler(req, res) {
  const {
    query: { user_id, status },
  } = req;

  try {
    const response = await axios.get(`https://api.upos-conn.com/master/v1.3/api/PosCartStoreShowSelected/${user_id}/${status}`, {
      headers: {
        'X-API-Key': 'd8086ade14369d53a3421d765793e0ac53ec8c4b',
      },
    });

    const data = response.data;

    res.status(200).json(data);
  } catch (error) {
    res.status(error.response.status || 500).json({ error: error.message });
  }
}
