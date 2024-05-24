// import axios from 'axios';

// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     const { q } = req.query;
//     try {
//       const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`);
//       res.status(200).json(response.data);
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   } else {
//     res.status(405).json({ error: 'Method not allowed' });
//   }
// }
