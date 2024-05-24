import axios from 'axios';

export default async function handler(req, res) {
  const apiKey = 'd8086ade14369d53a3421d765793e0ac53ec8c4b';
  const totalPages = 100; // Ganti dengan jumlah total halaman yang tersedia di API Anda

  try {
    const randomPage = Math.floor(Math.random() * totalPages) + 1; // Menghasilkan nomor halaman secara acak

    const url = `https://api.upos-conn.com/master/v1.3/api/posProduk/9?page=${randomPage}`;
    const response = await axios.get(url, { headers: { 'X-API-Key': apiKey } });

    if (response.data && response.data.data) {
      const products = response.data.data;
      console.log(`Total produk yang diambil dari halaman ${randomPage}: ${products.length}`);
      res.status(200).json(products);
    } else {
      res.status(500).json({ error: 'No products found on the random page' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error or no products found' });
  }
}
