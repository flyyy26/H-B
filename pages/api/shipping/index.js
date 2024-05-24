// pages/api/shipping.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { posEmail,
        posNoHp,
        posAlamat,
        posKelurahan,
        posKecamatan,
        posKota,
        posProvinsi,
        posKecamatanKode,
        posKotaKode,
        posProvKode,
        posShiping,
        posOngkir,
        posno_resi,
        posLatitude,
        posLongitude } = req.body;
  
    try {
      const response = await fetch('https://api.upos-conn.com/master/v1.3/api/PosShiping', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-API-Key': 'd8086ade14369d53a3421d765793e0ac53ec8c4b' // Tambahkan X-API-Key di sini
        },
        body: new URLSearchParams({ posEmail,
            posNoHp,
            posAlamat,
            posKelurahan,
            posKecamatan,
            posKota,
            posProvinsi,
            posKecamatanKode,
            posKotaKode,
            posProvKode,
            posShiping,
            posOngkir,
            posno_resi,
            posLatitude,
            posLongitude })
      });
      const responseData = await response.json();
        return res.status(response.status).json(responseData);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Terjadi kesalahan. Silakan coba lagi.' });
    }
  }
