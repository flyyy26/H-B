// pages/api/voucherPost.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { 
    member_id, price_total, code, order_id } = req.body;

  try {
    const response = await fetch('https://prahwa.net/api/vouchers', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'api_key': 'aGVlYuXDRtCZOBcoK8xjpluX0jqqDxDBvso7RqUe' // Tambahkan X-API-Key di sini
      },
      body: new URLSearchParams({ 
        member_id, price_total, code, order_id })
    });
    const responseData = await response.json();
      return res.status(response.status).json(responseData);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan. Silakan coba lagi.' });
  }
}
