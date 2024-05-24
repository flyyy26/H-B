 // File: pages/api/product.js

import axios from 'axios';

export default async function handler(req, res) {
  const apiKey = 'd8086ade14369d53a3421d765793e0ac53ec8c4b';
  const productsPerPage = 20;
  let products = [];
  let currentPage = 1;

  try {
    while (true) {
      const url = `https://api.upos-conn.com/master/v1.3/api/posProduk/9?page=${currentPage}`;
      const response = await axios.get(url, { headers: { 'X-API-Key': apiKey } });

      if (response.data && response.data.data) {
        // Ambil semua produk dari setiap halaman
        const pageProducts = response.data.data;
        products = [...products, ...pageProducts];
      }

      // Jika tidak ada halaman selanjutnya, keluar dari loop
      if (!response.data.pagination || currentPage >= response.data.pagination.total_pages) {
        break;
      }

      currentPage++;
    }

    console.log(`Total produk yang diambil: ${products.length}`);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error or no products found' });
  }
} 


// File: pages/api/product.js

// import axios from 'axios';

// export default async function handler(req, res) {
//   try {
//     const { page } = req.query; // Ambil nilai halaman dari query parameters

//     const response = await axios.get(`https://api.upos-conn.com/master/v1.3/api/posProduk/9?page=${page}`, {
//       headers: {
//         'X-API-Key': 'd8086ade14369d53a3421d765793e0ac53ec8c4b' // Ganti dengan API key Anda
//       }
//     });
//     const category = response.data;
//     res.status(200).json(category);
//   } catch (error) {
//     console.error('Error fetching category:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }
