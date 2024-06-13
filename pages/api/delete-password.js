// pages/api/delete-password.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { token, new_password, confirm_password } = req.body;
  
    try {
      const response = await fetch('https://api.upos-conn.com/auth/v1/posAuth-resetPassword', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ token, new_password, confirm_password })
      });
      const responseData = await response.json();
        return res.status(response.status).json(responseData);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Terjadi kesalahan. Silakan coba lagi.' });
    }
  }
  