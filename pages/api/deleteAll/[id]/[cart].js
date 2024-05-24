// import axios from 'axios';

// export default async function handler(req, res) {
//   if (req.method === 'DELETE') {
//     const { userId, cart } = req.query;

//     try {
//       const response = await axios.delete(`https://api.upos-conn.com/master/v1.3/api/PosCartStoreDeleteAll/${userId}/${cart}`, {
//         headers: {
//           'X-API-Key': 'd8086ade14369d53a3421d765793e0ac53ec8c4b'
//         }
//       });

//       if (response.status === 200) {
//         res.status(200).json({
//           status: 200,
//           error: null,
//           messages: {
//             success: "Data keranjang berhasil dihapus."
//           }
//         });
//       } else {
//         res.status(response.status).json({
//           status: response.status,
//           error: response.statusText,
//           messages: {
//             error: "Gagal menghapus data keranjang."
//           }
//         });
//       }
//     } catch (error) {
//       res.status(500).json({
//         status: 500,
//         error: error.message,
//         messages: {
//           error: "Terjadi kesalahan saat menghubungi server."
//         }
//       });
//     }
//   } else {
//     res.setHeader('Allow', ['DELETE']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

// pages/api/cart/[id]/[status].js
import axios from 'axios';

export default async function handler(req, res) {
  const {id} = req.query;

  try {
    const response = await axios.delete(`https://api.upos-conn.com/master/v1.3/api/PosCartStoreDeleteAll/${id}/1`, {
      headers: { 'X-API-Key': 'd8086ade14369d53a3421d765793e0ac53ec8c4b' }
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch data', error: error.message });
  }
}
