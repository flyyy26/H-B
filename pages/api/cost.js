export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { origin, destination, weight, courier } = req.body; // Menerima data dari permintaan POST

    try {
      const response = await fetch('https://pro.rajaongkir.com/api/cost', {
        method: 'POST',
        headers: {
          key: '6b69e8eec2fcb0f60490f9d8051ecefd',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          origin: origin,
          originType: 'city',
          destination: destination,
          destinationType: 'subdistrict',
          weight: weight,
          courier: courier
        })
      });

      const data = await response.json();

      // Kirim response dari API RajaOngkir ke client
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching shipping options:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
