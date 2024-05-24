import { FaUserCircle } from "react-icons/fa";
import { BiSolidDiscount } from "react-icons/bi";
import { useState } from "react";
import { PiCheckCircleFill } from "react-icons/pi";
import { FaSave } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import dynamic from "next/dynamic";
import { LuChevronDown } from "react-icons/lu";
import { MdOutlineAccessTime } from "react-icons/md";
import { useEffect } from "react";
import { useRouter } from "next/router";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { RiHeartsFill } from "react-icons/ri";
import { GoChevronRight } from "react-icons/go";
import { Link } from "react-router-dom";

const MapComponent = dynamic(() => import('@/components/maps'), {
  ssr: false
});

const adjustOverflow = () => {
  const container = document.querySelector('.shipping-radio-overflow');
  if (container) {
    const vouchers = container.querySelectorAll('.shipping-radio-voucher');
    const maxHeight = vouchers.length > 0 ? vouchers[0].clientHeight * 2 : 0;
    container.style.maxHeight = `${maxHeight}px`;
  }
};

const TransaksiBarang = () => {
  const [transactionData, setTransactionData] = useState(null);
  const router = useRouter();
  const { user } = useAuth();
  useEffect(() => {
    adjustOverflow();
    window.onresize = adjustOverflow;

    return () => {
      window.onresize = null;
    };
  }, []);

const [isModalOpen, setModalOpen] = useState(false);
const [isModalVoucherOpen, setModalVoucherOpen] = useState(false);
const [isModalAddressOpen, setModalAddressOpen] = useState(false);

const handleOpenModal = () => setModalOpen(true);
const handleCloseModal = () => setModalOpen(false);

const handleOpenModalAddress = () => setModalAddressOpen(true);
const handleCloseModalAddress = () => setModalAddressOpen(false);

const handleOpenModalVoucher = () => setModalVoucherOpen(true);
const handleCloseModalVoucher = () => setModalVoucherOpen(false);

const [selectedProducts, setSelectedProducts] = useState([]);


const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    nomorTelepon: '',
    address: '',
    subdistrict: { id: '', name: '' },
    city: { id: '', name: '' },
    province: { id: '', name: '' },
    kelurahan: '',
});

const [isFormValid, setIsFormValid] = useState(false);

useEffect(() => {
    const isValid = formData.province.id && formData.city.id && formData.subdistrict.id && formData.kelurahan && formData.address;
    setIsFormValid(isValid);
}, [formData]);

const [provinces, setProvinces] = useState([]);
const [cities, setCities] = useState([]);
const [subdistrict, setSubdistrict] = useState([]);
const [cartItems, setCartItems] = useState([]);
const [isPopupOpen, setIsPopupOpen] = useState(false);
const [showExpedition, setShowExpedition] = useState(false);
const [shippingOptions, setShippingOptions] = useState([]);
const [selectedOption, setSelectedOption] = useState('');
const [selectedShippingCost, setSelectedShippingCost] = useState({ value: 0, etd: '' });

// Hook useEffect untuk mendapatkan daftar provinsi saat komponen dimuat
useEffect(() => {
    fetchProvinces();
}, []);

// Fungsi untuk mengambil daftar provinsi dari API
const fetchProvinces = async () => {
    try {
        const response = await fetch('http://localhost:4000/api/provinces'); // Ganti URL sesuai dengan endpoint API di Next.js
        const data = await response.json();
        setProvinces(data);
    } catch (error) {
        console.error('Error fetching provinces:', error);
    }
};

// Fungsi untuk mengambil daftar kota dari API berdasarkan provinsi yang dipilih
const fetchCities = async (provinceId) => {
    try {
        const response = await fetch(`http://localhost:4000/api/city?provinceId=${provinceId}`); // Ganti URL sesuai dengan endpoint API di Next.js
        const data = await response.json();
        setCities(data);
    } catch (error) {
        console.error('Error fetching cities:', error);
    }
};

const fetchSubdistrict = async (cityId) => {
    try {
        const response = await fetch(`http://localhost:4000/api/subdistrict?cityId=${cityId}`); // Ganti URL sesuai dengan endpoint API di Next.js
        const data = await response.json();
        setSubdistrict(data);
    } catch (error) {
        console.error('Error fetching cities:', error);
    }
};

const [selectedCourier, setSelectedCourier] = useState('jne');

const fetchShippingOptions = async () => {
    try {
        const destinationSubdistrictId = formData.subdistrict.id;
        const originCityId = '469'; // Kota Tasikmalaya
        const originCityName = 'Tasikmalaya'; // Ganti dengan nama kota asal yang sesuai
        const originProvinceName = 'Jawa Barat'; // Ganti dengan nama provinsi asal yang sesuai
        
        // Mencetak alamat asal ke konsol
        console.log('Alamat Asal:', originCityId, originCityName, originProvinceName);
        
        if (destinationSubdistrictId && originCityId) {
            const response = await fetch('http://localhost:4000/api/cost', {
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
                    courier: selectedCourier, // Kurir yang digunakan, dapat disesuaikan
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

const [selectedShipping, setSelectedShipping] = useState(null);

const handleSelectOption = (option) => {
// Jika opsi yang dipilih adalah "Hallo Express", langsung atur detail pengiriman
    if (option.service === 'Hallo Express') {
        setSelectedShipping({
            service: option.service,
            description: option.description,
            etd: 'hari ini', // Atur estimasi tiba untuk "Hallo Express"
            value: 0 // Atur biaya pengiriman untuk "Hallo Express"
        });
        setIsHalloExpressSelected(option.service === 'Hallo Express');
    } else {
        // Temukan opsi yang dipilih dari shippingOptions berdasarkan layanan
        const selectedOption = shippingOptions.find(opt => opt.service === option.service);
    
        // Update state untuk menyimpan biaya pengiriman yang dipilih
        setSelectedShippingCost({ value: selectedOption.cost[0].value, etd: selectedOption.cost[0].etd });
    
        // Update state untuk menyimpan opsi pengiriman yang dipilih
        setSelectedOption(option.service);
    
        // Update state untuk menyimpan detail pengiriman yang dipilih
        setSelectedShipping({
            service: selectedOption.service,
            description: selectedOption.description,
            value: selectedOption.cost[0].value,
            etd: selectedOption.cost[0].etd
        });
    }
};

const handleSubmitShipping = (e) => {
    e.preventDefault();
    if (selectedShipping) {
        console.log('Pilihan Ekspedisi:', selectedShipping); // Mencetak pilihan ekspedisi ke konsol
        handleCloseModal();
    } else {
        console.error('Pilih opsi pengiriman terlebih dahulu.');
    }
};



// Fungsi untuk menangani perubahan pada input form
const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'province') {
        const selectedProvince = provinces.find(province => province.province_id === value);
        const updatedProvince = { id: value, name: selectedProvince ? selectedProvince.province : '' };
        setFormData({
            ...formData,
            province: updatedProvince,
            city: { id: '', name: '' }, // Reset city ketika provinsi berubah
            subdistrict: { id: '', name: '' } // Reset subdistrict ketika provinsi berubah
        });
        fetchCities(value); // Memanggil fetchCities dengan ID provinsi yang dipilih
        console.log('Provinsi yang dipilih:', updatedProvince);
    } else if (name === 'city') {
        const selectedCity = cities.find(city => city.city_id === value);
        const updatedCity = { id: value, name: selectedCity ? `${selectedCity.type} ${selectedCity.city_name}` : '' };
        setFormData(prevFormData => ({
            ...prevFormData,
            city: updatedCity,
            subdistrict: { id: '', name: '' } // Reset subdistrict ketika city berubah
        }));
        fetchSubdistrict(value); // Memanggil fetchSubdistrict dengan ID kota yang dipilih
        console.log('Kota yang dipilih:', updatedCity);
    } else if (name === 'subdistrict') {
        const selectedSubdistrict = subdistrict.find(sd => sd.subdistrict_id === value);
        const updatedSubdistrict = { id: value, name: selectedSubdistrict ? selectedSubdistrict.subdistrict_name : '' };
        setFormData(prevFormData => ({
            ...prevFormData,
            subdistrict: updatedSubdistrict
        }));
        console.log('Kecamatan yang dipilih:', updatedSubdistrict);
    } else {
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }
};

const [savedAddress, setSavedAddress] = useState({});

useEffect(() => {
    // Jika formData.subdistrict.id sudah diisi
    if (formData.subdistrict.id) {
        // Ambil opsi pengiriman
        fetchShippingOptions();
    }
}, [formData.subdistrict.id]);

const handleSubmit = (event) => {
    event.preventDefault();
    // Update state untuk menampilkan alamat yang disimpan
    handleCloseModalAddress()
    setSavedAddress({
        address: formData.address,
        subdistrict: formData.subdistrict.name,
        city: formData.city.name,
        province: formData.province.name
    });
    setIsFormSaved(true);
};

const handleKelurahanChange = (e) => {
    const kelurahan = e.target.value;
    setFormData(prevState => ({
        ...prevState,
        kelurahan: kelurahan
    }));
};

const [showHalloExpress, setShowHalloExpress] = useState(false);
const [isFormSaved, setIsFormSaved] = useState(false);

useEffect(() => {
    if (isFormSaved) {
        const fetchHalloExpressAvailability = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/hallo-express/`);
                setShowHalloExpress(response.status === 200);
                console.log('Fetching Hallo Express availability...');
            } catch (error) {
                console.error('Error fetching Hallo Express availability:', error);
                setShowHalloExpress(false); // Sembunyikan jika error atau tidak ditemukan
            }
        };

        // Periksa apakah kota yang dipilih adalah 'Kota Tasikmalaya' atau 'Kabupaten Tasikmalaya'
        if (formData.city.name === 'Kota Tasikmalaya' || formData.city.name === 'Kabupaten Tasikmalaya') {
            fetchHalloExpressAvailability();
        } else {
            setShowHalloExpress(false); // Sembunyikan jika kota bukan Tasikmalaya
        }
    }
}, [isFormSaved, formData.city.name]);


const [totalHarga, setTotalHarga] = useState(null);

// const fetchDataCartTotalPrice = async () => {
//     try {
//         const userId = user.posLoginId;
//         const cartStatus = 'true';

//         const response = await axios.get(`/api/cartTotalPrice/${userId}/${cartStatus}`);
//         const data = response.data;

//         // Mengambil nilai count dari respons API dan menyimpannya di state
//         if (data && data.data && data.data.grand_total_asli) {
//             const grandTotalAsliInteger = parseInt(data.data.grand_total_asli.replace('.', '')); // Mengubah string menjadi integer, dan menghapus titik desimal jika ada
//             setTotalHarga(grandTotalAsliInteger); // Menyimpan nilai integer ke dalam state totalHarga
//             console.log(response.data);
//         }            
//     } catch (error) {
//         console.error('Error fetching cart total:', error);
//     }
// };

// useEffect(() => {
//   if (user && user.posLoginId) {
//       fetchDataCartTotalPrice();
//   }
// }, [user]);



const [isCoordinateSelected, setIsCoordinateSelected] = useState(false);

// Logika untuk menentukan apakah tombol harus diaktifkan
const isButtonEnabled = isFormValid && isCoordinateSelected;
const [isHalloExpressSelected, setIsHalloExpressSelected] = useState(false);

const handleSubmitCheckout = async () => {
  if (selectedShipping) {
    try {
      if (!transactionData) {
        console.error('Tidak ada data transaksi yang tersimpan.');
        return;
      }

      const formDataParams = new URLSearchParams({
        posEmail: user.email,
        posNoHp: user.noTelp,
        posAlamat: formData.address,
        posKelurahan: formData.kelurahan,
        posKecamatan: formData.subdistrict.name,
        posKota: formData.city.name,
        posProvinsi: formData.province.name,
        posKecamatanKode: formData.subdistrict.id,
        posKotaKode: formData.city.id,
        posProvKode: formData.province.id,
        posShiping: selectedShipping.service,
        posOngkir: selectedShipping.value,
        posno_resi: '-', // Isian default
        posLatitude: selectedCoordinates.lat,
        posLongitude: selectedCoordinates.lng
      });

      const response = await axios.post('http://localhost:4000/api/shipping', formDataParams, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.status === 201) {
        console.log('Shipping success:', response.data.messages.success);

        const posShippingId = response.data.lastShipingId;

        let posJenisPembayaranOnline = '';
        let posStatus = '';

        if (selectedShipping.service === 'Hallo Express') {
          posJenisPembayaranOnline = 'COD';
          posStatus = 'COD';
        } else {
          posJenisPembayaranOnline = 'cashlezz';
          posStatus = 'pending';
        }

        const formDataParamsTransaksi = new URLSearchParams({
          posMerchantId: 9,
          posKodeTransaksi: `INV - ${getRandomFourDigits()} - ${getCurrentFormattedDate()} - ${user.posLoginId}`,
          posCustomerId: user.posLoginId,
          posTanggalTransaksi: getCurrentFormattedDate(),
          posTipeTransaksi: 3,
          posKasirId: 0,
          posStatus: posStatus,
          posTotalPembayaran: transactionData.product.hargaJual * transactionData.quantity,
          posTotalBayar: transactionData.product.hargaJual * transactionData.quantity,
          posJenisPembayaranOnline: posJenisPembayaranOnline,
          posShipingId: posShippingId,
          posDiskon_voucher: 0
        });

        const transaksiResponse = await axios.post('http://localhost:4000/api/postTransaksi', formDataParamsTransaksi, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        if (transaksiResponse.status === 201) {
          console.log('Transaksi success:', transaksiResponse.data.messages.success);

          const detailTransaksiData = new URLSearchParams({
            posTransaksiId: transaksiResponse.data.lastTransaksiId,
            posVarianId: parseInt(transactionData.product.posVarianId, 10),
            posQty: parseInt(transactionData.quantity, 10),
            posTotal: transactionData.product.hargaJual * transactionData.quantity,
            posDiskonId: 0,
            posDiskonRp: 0,
            posDiskonPersen: 0
          });

          const detailTransaksiResponse = await axios.post('http://localhost:4000/api/detailTransaksi', detailTransaksiData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });

          console.log('Response detail transaksi:', detailTransaksiResponse.data);

          if (selectedVoucher && selectedVoucher.code) {
            const formDataVoucher = {
              member_id: user.posLoginId,
              price_total: transactionData.product.hargaJual * transactionData.quantity,
              code: selectedVoucher.code,
              order_id: transaksiResponse.data.lastTransaksiId
            };

            console.log('Data voucher yang dikirim:', formDataVoucher);

            try {
              const voucherPostResponse = await axios.post('http://localhost:4000/api/voucherPost', formDataVoucher, {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              });

              if (voucherPostResponse.status === 201) {
                console.log('Voucher berhasil diterapkan:', voucherPostResponse.data);
              } else {
                console.error('Gagal menerapkan voucher:', voucherPostResponse.data);
              }
            } catch (voucherError) {
              console.error('Error saat mengirim data voucher:', voucherError);
            }
          } else {
            console.log('Tidak ada voucher yang dipilih atau kode voucher tidak valid.');
          }

          if (posJenisPembayaranOnline !== 'COD') {
            const midtransTransactionParams = {
              order_id: transaksiResponse.data.lastTransaksiId,
              gross_amount: totalPembayaran,
              first_name: user.name,
              email: user.email,
              phone: user.noTelp
            };

            try {
              const midtransResponse = await axios.post('http://localhost:4000/api/midtrans', midtransTransactionParams);

              if (midtransResponse.status === 200) {
                // Membuat pembayaran menggunakan Snap.js
                window.snap.pay(midtransResponse.data.token, {
                  onSuccess: function(result) {
                    console.log('Pembayaran berhasil:', result);
                    // Redirect ke halaman pesanan setelah pembayaran berhasil
                    router.push('/pesanan');
                  },
                  onPending: function(result) {
                    console.log('Pembayaran masih diproses:', result);
                    // Redirect ke halaman pesanan setelah pembayaran berhasil
                    router.push('/pesanan');
                  },
                  onError: function(result) {
                    console.error('Pembayaran gagal:', result);
                    // Tampilkan pesan kesalahan atau atur ulang pembayaran
                    alert('Pembayaran gagal. Silakan coba lagi.');
                  }
                });
              } else {
                console.error('Gagal membuat transaksi Midtrans:', midtransResponse.data);
              }
            } catch (error) {
              console.error('Error saat mengirim data Midtrans:', error);
            }
          } else {
            console.log('Tidak perlu menampilkan pembayaran Midtrans karena menggunakan COD (Hallo Express).');
            router.push('/pesanan');
          }
        } else {
          console.error('Terjadi kesalahan saat menyimpan data transaksi:', transaksiResponse.data);
        }
      } else {
        console.error('Terjadi kesalahan saat menyimpan data pengiriman.');
      }
    } catch (error) {
      console.error('Error:', error);
      console.error('Terjadi kesalahan saat menyimpan data pengiriman.');
    }
  } else {
    console.error('Pilih opsi pengiriman terlebih dahulu.');
  }
};
  

useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
  script.setAttribute('data-client-key', 'SB-Mid-client-S6EszAqNswaDdtwr');
  document.body.appendChild(script);

  return () => {
      document.body.removeChild(script);
  };
}, []);

const getRandomFourDigits = () => {
    return Math.floor(1000 + Math.random() * 9000);  // Menghasilkan angka random antara 1000 dan 9999
}

const getCurrentFormattedDate = () => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Bulan dimulai dari 0
    const year = date.getFullYear();
    return `${day}${month}${year}`;
}

const checkoutButton = handleSubmitCheckout;

const [selectedCoordinates, setSelectedCoordinates] = useState(null);

const handleCoordinateSelect = (coordinates) => {
    setSelectedCoordinates(coordinates);
  };

const [vouchers, setVouchers] = useState([]);

useEffect(() => {
    const fetchVoucher = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/voucher');
            const data = await response.json();
            const today = new Date();
            const filteredVouchers = data.data.filter(voucher => {
                const expDate = new Date(voucher.exp_date);
                return expDate > today && voucher.qty > 0; // Filter voucher yang belum kedaluwarsa dan qty lebih dari 0
            });
            setVouchers(filteredVouchers);
        } catch (error) {
            console.error('Error fetching vouchers:', error);
        }
    };

    fetchVoucher();
}, []);

  
  const calculateDaysLeft = (expDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Menghilangkan waktu dari tanggal saat ini
    const expDate = new Date(expDateStr);
    expDate.setHours(0, 0, 0, 0); // Menghilangkan waktu dari tanggal kedaluwarsa
    const timeDiff = expDate - today;
    return Math.ceil(timeDiff / (1000 * 3600 * 24)); // Menghitung dan mengembalikan selisih hari
  };

  const [search, setSearch] = useState('');
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  const handleApplyVoucher = (e) => {
    e.preventDefault(); // Mencegah perilaku default form
    if (selectedVoucher) {
      handleCloseModalVoucher();
      setAppliedVoucher(selectedVoucher); // Simpan objek voucher yang dipilih
      console.log(`Voucher dipilih: ${selectedVoucher.code} dengan diskon Rp. ${selectedVoucher.min_spend} berakhir dalam ${calculateDaysLeft(selectedVoucher.exp_date)} hari.`);
    } else {
      alert('Pilih voucher terlebih dahulu');
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  
  const filterVouchers = () => {
    const lowerCaseSearch = search.toLowerCase();
    const filtered = vouchers.filter(voucher => 
      voucher.type === "public" || 
      (voucher.type === "private" && voucher.code.toLowerCase() === lowerCaseSearch)
    );
    setFilteredVouchers(filtered);
  };
  
  useEffect(() => {
    filterVouchers(); // Memanggil saat vouchers atau search berubah
  }, [vouchers, search]);
  
  const handleVoucherSelect = (voucher) => {
    setSelectedVoucher(voucher);
  };
  const [totalPembayaran, setTotalPembayaran] = useState(0);

  useEffect(() => {
    if (transactionData) {
      const totalProduk = transactionData.product.hargaJual * transactionData.quantity;
      const ongkosKirim = (selectedShipping && selectedShipping.value) || 0;
      const diskonVoucher = (appliedVoucher && appliedVoucher.min_spend) || 0;
      const totalPembayaran = totalProduk + ongkosKirim - diskonVoucher;
      setTotalPembayaran(totalPembayaran);
    }
  }, [transactionData, selectedShipping, appliedVoucher]);
    // Menampilkan hasil di console.log
    console.log("Total Pembayaran:", totalPembayaran);

  useEffect(() => {
    const data = localStorage.getItem('transactionData');
    if (data) {
      setTransactionData(JSON.parse(data));
    } else {
      router.push('/'); // Jika tidak ada data, arahkan kembali ke halaman utama
    }
  }, [router]);

  if (!transactionData) {
    return <div>Tunggu Sebentar...</div>;
  }

  return (
    <>
    <div className="menu-popup-mobile menu-popup-mobile-template">
            <span className="close"><HiOutlineArrowLeft onClick={() => router.back()} /> Transaksi</span>
        </div>
        <div className="homepage-layout transaksi-container">
            <div className="shipping-container">
                <div className="border-top-shipping"></div>
                <div className="border-bottom-shipping"></div>
                <div className="border-left-shipping"></div>
                <div className="border-right-shipping"></div>
                <div className="shipping-user">
                    <FaUserCircle />
                    <h3>{user.nama} ({user.noTelp})</h3>
                </div>
                <div className="shipping-alamat">
                    {savedAddress.address && savedAddress.subdistrict && savedAddress.city && savedAddress.province ? (
                        <p>{savedAddress.address}, {savedAddress.subdistrict}, {savedAddress.city}, {savedAddress.province}</p>
                    ) : (
                        <p>Alamat belum diisi.</p>
                    )}
                    <button onClick={handleOpenModalAddress}>
                        {savedAddress.address && savedAddress.subdistrict && savedAddress.city && savedAddress.province ? 'Ubah Alamat' : 'Isi Alamat'}
                    </button>
                </div>
            </div>
            <div className="product-layout-container">
                <div className="heading-checkout-product-mobile">
                    <h4>Produk yang akan dibeli</h4>
                </div>
                <div className="product-checkout-container product-checkout-container-top">
                    <div className="list-product-checkout">
                        <h4>Produk yang akan dibeli</h4>
                    </div>
                    <div className="product-info-checkout">
                        <span>Harga Produk</span>
                    </div>
                    <div className="product-info-checkout">
                        <span>Kuantitas</span>
                    </div>
                    <div className="product-info-checkout">
                        <span>Total Harga Produk</span>
                    </div>
                </div>
                <div className="list-product-box-checkout">
                        <div className="product-checkout-container">
                            <div className="list-product-checkout">
                                <div className="product-details-checkout">
                                    <img src={`https://api.upos-conn.com/master/v1/${transactionData.product.gambar}`} alt={transactionData.product.namaVarian} />
                                    <div className="product-details-checkout-name">
                                        <h4>{transactionData.product.namaProduk}</h4>
                                        <p>{transactionData.product.namaVarian}</p>
                                        <div className="price-quantity-mobile">
                                            <span>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(transactionData.product.hargaJual)}</span>
                                            <span>{transactionData.quantity}x</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="product-info-checkout product-info-checkout-body">
                                <span>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(transactionData.product.hargaJual)}</span>
                            </div>
                            <div className="product-info-checkout product-info-checkout-body">
                                <span>{transactionData.quantity}</span>
                            </div>
                            <div className="product-info-checkout product-info-checkout-body">
                                <span>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(transactionData.product.hargaJual * transactionData.quantity)}</span>
                            </div>
                        </div>
                </div>
                <div className="shipping-product-checkout">
                    <div className="shipping-box-choose">
                        <h4>Pilih Ekspedisi:</h4>
                        {selectedShipping ? (
                            <React.Fragment>
                                <h3>
                                {selectedShipping.service === 'Hallo Express' ? selectedShipping.service : `${selectedCourier} ${selectedShipping.service}`} 
                                <span> - Estimasi tiba {selectedShipping.etd.includes('-') ? selectedShipping.etd.split('-')[0].trim() : selectedShipping.etd} hari</span>
                                </h3>
                                <button onClick={handleOpenModal}>Ubah</button>
                            </React.Fragment>
                        ) : (
                            <button onClick={handleOpenModal}>Pilih Ekspedisi</button>
                        )}
                    </div> 
                    <h2>Rp. {selectedShipping ? selectedShipping.value.toLocaleString() : '0'}</h2>
                </div>
                <div className="list-menu-popup-transaksi">
                    <ul>
                        <li><div className="menu-popup-mobile-item" onClick={handleOpenModalVoucher}><BiSolidDiscount /> {appliedVoucher ? `Voucher: ${appliedVoucher.code} - Diskon Rp. ${new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(appliedVoucher.min_spend)}` : 'Gunakan Voucher'}</div><GoChevronRight /></li>
                    </ul>
                </div>
                <div className="total-product-checkout">
                    <div className="total-product-checkout-layout">
                        <div className="total-product-checkout-box">
                            <p>Subtotal harga produk:</p> <p>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(transactionData.product.hargaJual * transactionData.quantity)}</p>
                        </div>
                        <div className="total-product-checkout-box">
                            <p>Total Ongkos Kirim:</p> <p>Rp. {selectedShipping ? selectedShipping.value.toLocaleString() : '0'}</p>
                        </div>
                        <div className="total-product-checkout-box">
                            <p>Potongan Voucher:</p> <p>- Rp. {appliedVoucher ? `${new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(appliedVoucher.min_spend)}` : 0}</p>
                        </div>
                        <div className="total-product-checkout-box">
                            <h4>Total Pembayaran:</h4> <span>Rp. {totalPembayaran.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="btn-checkout-pilihan">
                <button className="voucher-checkout" onClick={handleOpenModalVoucher}>
                    <BiSolidDiscount /> {appliedVoucher ? `Voucher: ${appliedVoucher.code} - Diskon Rp. ${new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(appliedVoucher.min_spend)}` : 'Gunakan Voucher'}
                </button>
                <button className="buy-now-checkout" onClick={checkoutButton}>Bayar Sekarang</button>
            </div>
            {isModalOpen && (
                <div className="modal-shipping-overlay"> 
                    <div className="modal-box-shipping">
                        <div className="menu-popup-mobile menu-popup-mobile-template">
                            <span className="close"><HiOutlineArrowLeft onClick={handleCloseModal}/> Pilih Ekspedisi</span>
                        </div>
                        <button className="close-button" onClick={handleCloseModal}><IoClose /></button>
                        <h1>Pilih Ekspedisi dulu!</h1>
                        <div className="choose-shipping">
                            <form onSubmit={handleSubmitShipping}>
                                {shippingOptions.map(option => (
                                    <React.Fragment key={option.service}>
                                        <label className="shipping-radio">
                                            <input type="radio" name="shippingOption" value={option.service} onChange={() => handleSelectOption(option)} checked={selectedShipping && selectedShipping.service === option.service}/>
                                            <span>
                                                <div className="heading-shipping-method">
                                                    <h3 htmlFor={option.service}>{selectedCourier} {option.service} - {option.description}</h3>
                                                    <div>
                                                        {option.cost[0].etd === '1-1' ? (
                                                            <p>Estimasi tiba 1 hari</p>
                                                        ) : (
                                                            <p>Estimasi tiba {option.cost[0].etd} hari</p>
                                                        )}
                                                    </div>

                                                </div>
                                                <div className="price-shipping">
                                                    <h5>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(option.cost[0].value)}</h5>
                                                    <PiCheckCircleFill className='check-ekspedisi'/>
                                                </div>
                                            </span>
                                        </label>
                                    </React.Fragment>
                                ))}
                                {showHalloExpress && (
                                    <label className="shipping-radio shipping-radio-hallo">
                                        <input type="radio" name="shippingOption" value='Hallo Express' onChange={() => handleSelectOption({service: 'Hallo Express', description: 'BIAYA LEBIH HEMAT'})} checked={selectedShipping && selectedShipping.service === 'Hallo Express'} />
                                        <span>
                                            <div className="heading-shipping-method">
                                                <h3>Hallo Express - BIAYA LEBIH HEMAT</h3>
                                                <p>Estimasi tiba hari ini</p>
                                            </div>
                                            <div className="price-shipping">
                                                <h5>Gratis Ongkir</h5>
                                                <PiCheckCircleFill className='check-ekspedisi'/>
                                            </div>
                                        </span>
                                    </label>
                                )}
                                <button type="submit" disabled={!selectedShipping} className='form-button-style'>Konfirmasi Ekspedisi <FaSave /></button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {isModalAddressOpen && (
                <div className="modal-shipping-overlay"> 
                    <div className="modal-box-shipping">
                        <div className="menu-popup-mobile menu-popup-mobile-template">
                            <span className="close"><HiOutlineArrowLeft onClick={handleCloseModalAddress}/> Isi Alamat</span>
                        </div>
                        <button className="close-button" onClick={handleCloseModalAddress}><IoClose /></button>
                        <h1>Isi Alamat dulu!</h1>
                        <div className="choose-shipping">
                            <form onSubmit={handleSubmit}>
                                <div className="form-second-layout">
                                    <input type="text" value={user.nama} readOnly/>
                                    <input type="number" value={user.noTelp} readOnly/>
                                </div>
                                <div className="form-second-layout">
                                    <div className="select-form-layout">
                                    <select name="province" value={formData.province.id} onChange={handleChange} required>
                                        <option value="">Pilih Provinsi</option>
                                        {provinces.map(province => (
                                            <option key={province.province_id} value={province.province_id}>{province.province}</option>
                                        ))}
                                    </select>
                                        <LuChevronDown />
                                    </div>
                                    <div className="select-form-layout">
                                        <select name="city" value={formData.city.id} onChange={handleChange} required>
                                            <option value="">Pilih Kota</option>
                                            {cities.map(city => (
                                                <option key={city.city_id} value={city.city_id}>{city.type} {city.city_name}</option>
                                            ))}
                                        </select>
                                        <LuChevronDown />
                                    </div>
                                </div>
                                <div className="form-second-layout">
                                    <div className="select-form-layout">
                                        <select name="subdistrict" value={formData.subdistrict.id} onChange={handleChange} required>
                                            <option value="">Pilih Kecamatan</option>
                                            {subdistrict.map(sd => (
                                                <option key={sd.subdistrict_id} value={sd.subdistrict_id}>{sd.subdistrict_name}</option>
                                            ))}
                                        </select>
                                        <LuChevronDown />
                                    </div>
                                    <input type="text" placeholder="Kelurahan" style={{textTransform: 'capitalize'}} value={formData.kelurahan} onChange={handleKelurahanChange}/>
                                </div>
                                <textarea placeholder="Alamat Lengkap" className="textarea-shipping" name="address" value={formData.address} onChange={handleChange}></textarea>
                                <MapComponent kelurahan={formData.kelurahan} city={formData.city} onCoordinateSelect={() => setIsCoordinateSelected(true)} ifCoordinateSelect={handleCoordinateSelect}/>
                                
                                <button type="submit" disabled={!isButtonEnabled} className='form-button-style'>Simpan Alamat <FaSave /></button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {isModalVoucherOpen && (
                <div className="modal-shipping-overlay"> 
                    <div className="modal-box-shipping">
                        <div className="menu-popup-mobile menu-popup-mobile-template">
                            <span className="close"><HiOutlineArrowLeft onClick={handleCloseModalVoucher}/> Pilih Voucher</span>
                        </div>
                        <button className="close-button" onClick={handleCloseModalVoucher}><IoClose /></button>
                        <h1>Pilih Voucher dulu!</h1>
                        <div className="choose-shipping">
                        <form onSubmit={handleApplyVoucher}>
                            <div className="input-search-voucher">
                                <input type="text" placeholder="Cari Voucher Disini..." value={search} onChange={handleSearchChange}/>
                                <span onClick={handleVoucherSelect}>PAKAI</span>
                            </div>
                            <div className="shipping-radio-overflow">
                            {vouchers.map(voucher => {
                                const daysLeft = calculateDaysLeft(voucher.exp_date);
                                return (
                                    <label className="shipping-radio-voucher" key={voucher.id} onClick={() => handleVoucherSelect(voucher)}>
                                        <input type="radio" name="voucherOption" value={voucher.code} onClick={(e) => e.stopPropagation()} /> {/* Mencegah event bubbling ke label */}
                                        <span>
                                            <div className="voucher-box-layout">
                                                <div className="voucher-box-image">
                                                    <img src={`https://prahwa.net/storage/${voucher.image}`} />
                                                    <div className="circle-left"></div>
                                                    <div className="circle-right"></div>
                                                </div>
                                                <div className="voucher-box-content">
                                                    <h5><BiSolidDiscount /> Diskon Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(voucher.min_spend)},-</h5>
                                                    {daysLeft >= 0 ? (
                                                        <p>Berakhir dalam {daysLeft} hari</p>
                                                    ) : (
                                                        <p>Kedaluwarsa</p>
                                                    )}
                                                </div>
                                            </div>
                                        </span>
                                    </label>
                                );
                            })}

                            </div>
                            <button type="submit" className='form-button-style'>Pakai Voucher<FaSave /></button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </>
    );
    };
    
    export default TransaksiBarang;