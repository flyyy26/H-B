import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const PilihEkspedisi = () => {
    const router = useRouter();
    const [shippingOptions, setShippingOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Fetch data ekspedisi dari API RajaOngkir
        const fetchShippingOptions = async () => {
            try {
                const response = await fetch('http://103.153.43.25/api/cost', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'key': '6b69e8eec2fcb0f60490f9d8051ecefd' // Ganti dengan API key Anda
                    },
                    body: new URLSearchParams({
                        origin: '501', // ID kota asal, bisa diambil dari data pengguna atau diatur secara statis
                        destination: '114', // ID kota tujuan, bisa diambil dari data pengguna atau diatur secara statis
                        weight: 1000, // Berat barang dalam gram
                        courier: 'jne', // Kurir yang digunakan, misalnya 'jne', 'tiki', 'pos'
                    })
                });
                const data = await response.json();
                setShippingOptions(data.rajaongkir.results[0].costs);
            } catch (error) {
                console.error('Error fetching shipping options:', error);
            }
        };

        fetchShippingOptions();
    }, []);

    const handleSelectOption = (option) => {
        setSelectedOption(option);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lakukan sesuatu dengan opsi pengiriman yang dipilih, misalnya menyimpannya di state aplikasi atau mengirimnya ke backend
        console.log('Selected shipping option:', selectedOption);
    };

    useEffect(() => {
        // Ambil data keranjang dari local storage saat komponen dimuat
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
          setCartItems(JSON.parse(storedCartItems));
        }
      }, []);

    return (
        <div>
            <h1>Pilih Ekspedisi</h1>
            <form onSubmit={handleSubmit}>
                {shippingOptions.map(option => (
                    <div key={option.service}>
                        <input
                            type="radio"
                            id={option.service}
                            name="shippingOption"
                            value={option.service}
                            checked={selectedOption === option.service}
                            onChange={() => handleSelectOption(option.service)}
                        />
                        <label htmlFor={option.service}>{option.service} - {option.description}</label>
                        <p>Biaya: {option.cost[0].value} - Estimasi: {option.cost[0].etd} hari</p>
                    </div>
                ))}
                <button type="submit" >Pilih Ekspedisi</button>
            </form>
            {/* <ul>
                {cartItems.map(item => (
                <li key={item.id}>
                    <img src={item.images && item.images.length > 0 ? item.images[0] : 'none'} alt={item.title} />
                    <span>{item.brand}</span>
                    <h1>{item.title}</h1>
                    <p>{item.description}</p>
                    <p>Rp. {item.price}</p>
                </li>
                ))}
            </ul> */}
        </div>
    );
};

export default PilihEkspedisi;
