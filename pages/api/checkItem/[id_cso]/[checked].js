// pages/api/checkItem/[id_cso]/[checked].js
export default async (req, res) => {
    const { id_cso, checked } = req.query;
    const url = `https://api.upos-conn.com/master/v1.3/api/PosCartStoreUpdateSelected/${id_cso}/${checked}`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-API-Key': 'd8086ade14369d53a3421d765793e0ac53ec8c4b'
        }
      });
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ status: 500, error: "Internal server error", messages: error.toString() });
    }
  }
  