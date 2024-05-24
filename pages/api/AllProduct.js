// File: pages/api/AllProduct.js

// import axios from 'axios';

// export default async function handler(req, res) {
//   const apiKey = 'd8086ade14369d53a3421d765793e0ac53ec8c4b';
//   let products = [];
//   let currentPage = 1;
//   const pagesPerRequest = 10; // Misalnya, kita akan memuat 10 halaman setiap kali

//   try {
//     while (currentPage <= pagesPerRequest) {
//       const url = `https://api.upos-conn.com/master/v1.3/api/posProduk/9?page=1`;
//       const response = await axios.get(url, { headers: { 'X-API-Key': apiKey } });

//       if (response.data && response.data.data) {
//         products = [...products, ...response.data.data];
//       }

//       currentPage++;
//     }

//     console.log(`Total produk yang diambil: ${products.length}`);
//     res.status(200).json(products);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ error: 'Internal server error or no products found' });
//   }
// }

// File: pages/api/category.js

import axios from 'axios';

export default async function handler(req, res) {
  try {
    const page = req.query.page || 1; // Mendapatkan nomor halaman dari query parameter atau default ke 1
    const response = await axios.get(`https://api.upos-conn.com/master/v1.3/api/posProduk/9?page=${page}`, {
      headers: {
        'X-API-Key': 'd8086ade14369d53a3421d765793e0ac53ec8c4b' // Ganti dengan API key Anda
      }
    });
    const { data, pagination } = response.data; // Menyimpan data produk dan informasi paginasi dari respons API
    res.status(200).json({ data, pagination }); // Mengirimkan data produk dan informasi paginasi ke client
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
