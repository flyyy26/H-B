// pages/api/daftar.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { posEmail, posPassword, posPin } = req.body;
  
    try {
      // Kirim data ke API
      // Misalnya, Anda bisa menggunakan fetch atau library HTTP lainnya di sini
      // Pastikan untuk menyesuaikan dengan cara Anda mengirim permintaan ke API
      // Contoh penggunaan fetch:
      const response = await fetch('https://api.upos-conn.com/auth/v1/posAuth-login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ posEmail, posPassword, posPin })
      });
      const responseData = await response.json();
        return res.status(response.status).json(responseData);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Terjadi kesalahan. Silakan coba lagi.' });
    }
  }
  