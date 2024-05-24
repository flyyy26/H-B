// Import useState, useEffect, dan useRouter
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PilihEkspedisi from '../pilih-ekspedisi';
import Link from 'next/link';
import { PiShoppingCartFill } from "react-icons/pi";
import { TbDiscount2 } from "react-icons/tb";
import { HiMiniChevronRight } from "react-icons/hi2";
import { FaSave } from "react-icons/fa";
import { LuChevronDown } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { BiSolidEdit } from "react-icons/bi";
import { PiCheckCircleFill } from "react-icons/pi";
import React from 'react';

// Komponen Checkout
export default function Checkout() {
    const router = useRouter();

    // State untuk menyimpan data form
    const [formData, setFormData] = useState({
        namaLengkap: '',
        email: '',
        nomorTelepon: '',
        address: '',
        subdistrict: { id: '', name: '' },
        city: { id: '', name: '' },
        province: { id: '', name: '' },
    });

    // State untuk menyimpan daftar provinsi, kota, dan kecamatan
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [subdistrict, setSubdistrict] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [showExpedition, setShowExpedition] = useState(false);
    const [shippingOptions, setShippingOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedShippingCost, setSelectedShippingCost] = useState({ value: 0, etd: '' });
    const [quantity, setQuantity] = useState({});

     // Fungsi untuk mengubah tampilan popup
     const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };
    const togglePopupShipping = () => {
        setShowExpedition(!showExpedition);
    };

    // Hook useEffect untuk mendapatkan daftar provinsi saat komponen dimuat
    useEffect(() => {
        fetchProvinces();
    }, []);

    // Fungsi untuk mengambil daftar provinsi dari API
    const fetchProvinces = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/provinces'); // Ganti URL sesuai dengan endpoint API di Next.js
            const data = await response.json();
            setProvinces(data);
        } catch (error) {
            console.error('Error fetching provinces:', error);
        }
    };

    // Fungsi untuk mengambil daftar kota dari API berdasarkan provinsi yang dipilih
    const fetchCities = async (provinceId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/city?provinceId=${provinceId}`); // Ganti URL sesuai dengan endpoint API di Next.js
            const data = await response.json();
            setCities(data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const fetchSubdistrict = async (cityId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/subdistrict?cityId=${cityId}`); // Ganti URL sesuai dengan endpoint API di Next.js
            const data = await response.json();
            setSubdistrict(data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const fetchShippingOptions = async () => {
        try {
            const destinationSubdistrictId = formData.subdistrict.id;
            const originCityId = '469'; // Kota Tasikmalaya
            const originCityName = 'Tasikmalaya'; // Ganti dengan nama kota asal yang sesuai
            const originProvinceName = 'Jawa Barat'; // Ganti dengan nama provinsi asal yang sesuai
            
            // Mencetak alamat asal ke konsol
            console.log('Alamat Asal:', originCityId, originCityName, originProvinceName);
            
            if (destinationSubdistrictId && originCityId) {
                const response = await fetch('http://localhost:3000/api/cost', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'key': '6b69e8eec2fcb0f60490f9d8051ecefd'
                    },
                    body: new URLSearchParams({
                        origin: originCityId,
                        originType: 'city',
                        destination: destinationSubdistrictId,
                        destinationType: 'subdistrict',
                        weight: 1000, // Berat kiriman, dapat disesuaikan
                        courier: 'jne', // Kurir yang digunakan, dapat disesuaikan
                    })
                });
                const data = await response.json();
                if (data && data.rajaongkir && data.rajaongkir.results && data.rajaongkir.results.length > 0 && data.rajaongkir.results[0].costs) {
                    setShippingOptions(data.rajaongkir.results[0].costs);
                } else {
                    console.error('Struktur data yang diterima tidak valid.');
                }
            } else {
                console.error('Provinsi, kota, atau kecamatan tujuan belum dipilih.');
            }
        } catch (error) {
            console.error('Error fetching shipping options:', error);
        }
    };
    
    
    useEffect(() => {
        const storedQuantity = localStorage.getItem('quantity');
        
        if (storedQuantity) {
            setQuantity(JSON.parse(storedQuantity));
        }
    }, []);
    
    useEffect(() => {
        const storedCartItems = localStorage.getItem('cartItems');
        
        if (storedCartItems) {
            const parsedCartItems = JSON.parse(storedCartItems);
            const updatedCartItems = parsedCartItems.map(item => ({
                ...item,
                quantity: quantity[item.id] || 1
            }));
    
            setCartItems(updatedCartItems);
        }
    }, [quantity]);
    

    const handleSelectOption = (option) => {
        const selectedOption = shippingOptions.find(opt => opt.service === option);
        setSelectedShippingCost({ value: selectedOption.cost[0].value, etd: selectedOption.cost[0].etd });
        setSelectedOption(option);
    };
    

    const handleSubmitShipping = (e) => {
        e.preventDefault();
        if (selectedOption) {
            console.log('Pilihan Ekspedisi:', selectedOption); // Mencetak pilihan ekspedisi ke konsol
            togglePopupShipping();
        } else {
            console.error('Pilih opsi pengiriman terlebih dahulu.');
        }
    };
    

    // Fungsi untuk menangani perubahan pada input form
    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === 'province') {
            const selectedProvince = provinces.find(province => province.province_id === value);
            setFormData({
                ...formData,
                province: { id: value, name: selectedProvince ? selectedProvince.province : '' },
                city: { id: '', name: '' }, // Reset city ketika provinsi berubah
                subdistrict: { id: '', name: '' } // Reset subdistrict ketika provinsi berubah
            });
            fetchCities(value); // Memanggil fetchCities dengan ID provinsi yang dipilih
        } else if (name === 'city') {
            const selectedCity = cities.find(city => city.city_id === value);
            setFormData(prevFormData => ({
                ...prevFormData,
                city: { id: value, name: selectedCity ? `${selectedCity.type} ${selectedCity.city_name}` : '' },
                subdistrict: { id: '', name: '' } // Reset subdistrict ketika city berubah
            }));
            fetchSubdistrict(value); // Memanggil fetchSubdistrict dengan ID kota yang dipilih
        } else if (name === 'subdistrict') {
            const selectedSubdistrict = subdistrict.find(sd => sd.subdistrict_id === value);
            setFormData(prevFormData => ({
                ...prevFormData,
                subdistrict: { id: value, name: selectedSubdistrict ? selectedSubdistrict.subdistrict_name : '' }
            }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value
            }));
        }
    };
    
    
    

    useEffect(() => {
        // Ambil data keranjang dari local storage saat komponen dimuat
        const storedCartItems = sessionStorage.getItem('cartItems');
        if (storedCartItems) {
          setCartItems(JSON.parse(storedCartItems));
        }
    }, []);
    
    // Menggunakan useEffect baru untuk memanggil fetchShippingOptions setiap kali formData.subdistrict.id berubah
    useEffect(() => {
        // Jika formData.subdistrict.id sudah diisi
        if (formData.subdistrict.id) {
            // Ambil opsi pengiriman
            fetchShippingOptions();
        }
    }, [formData.subdistrict.id]);

      const handleSubmit = (e) => {
        e.preventDefault();
        togglePopup(); // Tutup popup setelah submit
        console.log('Pilihan Ekspedisi:', selectedOption); // Mencetak pilihan ekspedisi ke konsol
    };

    const totalBelanja = cartItems.reduce((total, item) => total + (item.price * (quantity[item.id] || 1)), 0);


    // Hitung total bayar
    const totalBayar = totalBelanja + selectedShippingCost.value;

    const handleBayarSekarang = () => {
        // Cetak detail produk yang dibeli
        console.log("Detail Produk yang Dibeli:");
        cartItems.forEach(item => {
            console.log("- Nama Produk:", item.title);
            console.log("- Harga:", item.price);
            console.log("- Kuantitas:", item.quantity);
            console.log("- Total Harga:", item.price * item.quantity);
            console.log("----------------------------");
        });
    
        // Cetak data pengguna yang sudah diisi dalam formulir
        console.log("Data Pengguna:");
        console.log("- Nama Lengkap:", formData.namaLengkap);
        console.log("- Email:", formData.email);
        console.log("- Nomor Telepon:", formData.nomorTelepon);
        console.log("- Alamat:", formData.address);
        console.log("- Kecamatan:", formData.subdistrict.name);
        console.log("- Kota:", formData.city.name);
        console.log("- Provinsi:", formData.province.name);
        console.log("----------------------------");
    
        // Cetak ekspedisi yang dipilih
        console.log("Ekspedisi yang Dipilih:", selectedOption);
        console.log("Biaya Pengiriman:", selectedShippingCost.value);
        console.log("Estimasi Waktu Pengiriman:", selectedShippingCost.etd);
        console.log("----------------------------");
    
        // Cetak ringkasan pembayaran
        console.log("Ringkasan Pembayaran:");
        console.log("- Total Belanja:", totalBelanja);
        console.log("- Total Ongkir:", selectedShippingCost.value);
        console.log("- Total Bayar:", totalBayar);
    };
    
    // ... 
    
    // <button onClick={handleBayarSekarang} className='bayar-now'>Bayar Sekarang yooo</button>
    

    // Return form checkout
    return (
        <div className='container-small container-small-checkout'> 
            <div className='container-checkout-box'>
                <h1>Selesaikan Pesanan</h1>
                <div className='container-checkout-box__page'>
                    <div className='container-checkout-box__layout'>
                        <div className='checkout-box-details'>
                            <div className='product-checkout-details__heading'>
                                <h3>Detail Pesanan</h3>
                            </div>
                            <div className='checkout-box-details-second'>
                                <div className='product-details-checkout'>
                                    {cartItems.map(item => (
                                    <div key={item.id}>
                                        <div className='product-checkout-details'>
                                            <div className='product-checkout-details__image'>
                                                <img src={item.images && item.images.length > 0 ? item.images[0] : 'none'} alt={item.title} />
                                            </div>
                                            <div className='product-checkout-details__item'>
                                                <span>{item.brand}</span>
                                                <h1>{item.title}</h1>
                                                <span>PCS</span>
                                            </div>
                                            <div className='product-checkout-details__price'>
                                                <p>Rp. {(item.price * (quantity[item.id] || 1)).toLocaleString()}</p>
                                                <span>{item.quantity}x</span> 
                                            </div>
                                        </div>
                                        
                                    </div>
                                    ))}
                                </div>
                            </div>
                            <div className='checkout-box-details-second'>
                                <button onClick={togglePopup} className='input-box-checkout'>
                                    {formData.namaLengkap === '' && formData.nomorTelepon === '' && formData.address === '' ? (
                                        <div className='heading-shipping-box'><p>Isi data diri dulu!</p> <HiMiniChevronRight /></div>
                                    ) : (
                                        <><p className='pright-1'>{formData.namaLengkap} {formData.nomorTelepon}, {formData.address} {formData.subdistrict.name} {formData.city.name} {formData.province.name}</p><span className='edit-form'><BiSolidEdit /></span></>
                                    )}
                                </button>
                                {isPopupOpen && (
                                    <div className="popup-checkout">
                                        <div className='popup-checkout-box checkout-box-details'>
                                            <div className='product-checkout-details__heading'>
                                                <h3>Isi Data Diri Kamu </h3>
                                                <IoClose onClick={togglePopup} />
                                            </div>
                                            <div className='checkout-box-details-second borbottom-0'>
                                            <form onSubmit={handleSubmit} className='form-style'>
                                                {/* Input fields for form */}
                                                <label className='input-two-layout'>
                                                    <input type="text" name="namaLengkap" placeholder='Nama Lengkap' value={formData.namaLengkap} onChange={handleChange} required />
                                                    <input type="email" name="email" placeholder='Email' value={formData.email} onChange={handleChange} required />
                                                </label>
                                                <label className='input-two-layout'>
                                                    <input type="number" name="nomorTelepon" placeholder='Nomor Telepon' value={formData.nomorTelepon} onChange={handleChange} required />
                                                    <div className='select-layout'>
                                                        <select name="province" value={formData.province.id} onChange={handleChange} required>
                                                            <option value="">Pilih Provinsi</option>
                                                            {provinces.map(province => (
                                                                <option key={province.province_id} value={province.province_id}>{province.province}</option>
                                                            ))}
                                                        </select>
                                                        <LuChevronDown />
                                                    </div>
                                                </label>

                                                <label className='input-two-layout'>
                                                    <div className='select-layout'>
                                                        <select name="city" value={formData.city.id} onChange={handleChange} required>
                                                            <option value="">Pilih Kota</option>
                                                            {cities.map(city => (
                                                                <option key={city.city_id} value={city.city_id}>{city.type} {city.city_name}</option>
                                                            ))}
                                                        </select>
                                                        <LuChevronDown />
                                                    </div>
                                                    <div className='select-layout'>
                                                        <select name="subdistrict" value={formData.subdistrict.id} onChange={handleChange} required>
                                                            <option value="">Pilih Kecamatan</option>
                                                            {subdistrict.map(sd => (
                                                                <option key={sd.subdistrict_id} value={sd.subdistrict_id}>{sd.subdistrict_name}</option>
                                                            ))}
                                                        </select>
                                                        <LuChevronDown />
                                                    </div>
                                                </label>
                                                <label>
                                                    <textarea type="text" name="address" placeholder='Isi Alamat Lengkap' className='address-input' value={formData.address} onChange={handleChange} required />
                                                </label>
                                                {/* Select field for district */}
                                                <button type="submit" className='form-button-style'>Simpan Data <FaSave /></button>
                                            </form>

                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button onClick={togglePopupShipping} className='input-box-checkout mbottom-0'>
                                     {selectedOption ? <>{selectedOption} - {shippingOptions.find(option => option.service === selectedOption)?.cost[0].etd} hari - Rp.{shippingOptions.find(option => option.service === selectedOption)?.cost[0].value}  <span className='edit-form'><BiSolidEdit /></span> `</> : <div className='heading-shipping-box'>Pilih Ekspedisi <HiMiniChevronRight /></div>}
                                </button>
                                {showExpedition && (
                                    <div className='popup-checkout'>
                                        <div className='popup-checkout-box checkout-box-details'>
                                            <div className='product-checkout-details__heading'>
                                                <h3>Pilih Ekspedisi</h3>
                                                <IoClose onClick={togglePopupShipping} />
                                            </div>
                                            <div className='checkout-box-details-second borbottom-0'>
                                            <form onSubmit={handleSubmitShipping}>
                                                {shippingOptions.map(option => (
                                                    <React.Fragment key={option.service}>
                                                        <label className="shipping-radio">
                                                            <input type="radio" name="shippingOption" value={option.service} onChange={() => handleSelectOption(option.service)}/>
                                                            <span>
                                                                <div className="heading-shipping-method">
                                                                    <h3 htmlFor={option.service}>{option.service} - {option.description}</h3>
                                                                    <p>{option.cost[0].etd === '1-1' ? (
                                                                            <p>Estimasi tiba 1 hari</p>
                                                                        ) : (
                                                                            <p>Estimasi tiba {option.cost[0].etd} hari</p>
                                                                        )}
                                                                        </p>
                                                                </div>
                                                                <div className="price-shipping">
                                                                    <h5>Rp. {option.cost[0].value}</h5>
                                                                    <PiCheckCircleFill className='check-ekspedisi'/>
                                                                </div>
                                                            </span>
                                                        </label>
                                                    </React.Fragment>
                                                ))}
                                                <button type="submit" className='form-button-style'>Konfirmasi Ekspedisi <FaSave /></button>
                                            </form>

                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className='continue-shipping'>
                                <Link href={'/products'}><PiShoppingCartFill /> Tambah Pesanan</Link>
                            </div>
                        </div>
                    </div>
                    <div className='container-checkout-box__layout mleft-2'>
                        <button className='checkout-box-voucher'>
                            <TbDiscount2 /> Gunakan Voucher
                        </button>
                        <div className='checkout-box-total'>
                            <div className='checkout-box-details-second checkout-box-details-second-total'>
                                <h3>Total Belanja</h3>
                            </div>
                            <div className='checkout-box-details-second checkout-box-details-second-total'>
                                <ul>
                                <li><span>Total Harga</span><span>Rp. {totalBelanja}</span></li>
                                <li><span>Total Ongkir</span><span>Rp. {selectedShippingCost.value}</span></li>
                                    <li><span>Diskon</span><span>-</span></li>
                                </ul>
                            </div>
                            <div className='checkout-box-details-second checkout-box-details-second-total borbottom-0'>
                                <ul>
                                    <li><span>Total Bayar</span><span>Rp. {totalBayar}</span></li>
                                </ul>
                                <button className='bayar-now' onClick={handleBayarSekarang} >Bayar Sekarang</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


// const selectedProduct = JSON.parse(sessionStorage.getItem('selectedProduct'));