import axios from 'axios';

const fetchAllProducts = async (categoryId) => {
  let page = 1;
  const allProducts = [];
  const apiKey = 'd8086ade14369d53a3421d765793e0ac53ec8c4b';
  const baseUrl = `https://api.upos-conn.com/master/v1.3/api/posproduk-kategori/9/${categoryId}`;

  try {
    // Fungsi untuk mengambil data dari satu halaman
    const fetchPage = async (page) => {
      const response = await axios.get(`${baseUrl}?page=${page}`, {
        headers: { 'X-API-Key': apiKey }
      });
      allProducts.push(...response.data.data); // Menambahkan produk dari halaman saat ini ke array

      // Mengecek apakah ada halaman selanjutnya dan mengambil data dari halaman tersebut
      const pagination = response.data.pagination;
      if (pagination.current_page < pagination.total_pages) {
        await fetchPage(pagination.current_page + 1);
      }
    };

    // Mulai dari halaman pertama
    await fetchPage(page);
    return allProducts;
  } catch (error) {
    console.error('Error fetching all products:', error);
    return []; // Mengembalikan array kosong jika terjadi error
  }
};

export default async function handler(req, res) {
  const { id } = req.query; // ID kategori dari query URL
  const products = await fetchAllProducts(id);
  res.status(200).json(products);
}
