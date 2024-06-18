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
import Modal from "@/components/modal";
import { FaMapLocationDot } from "react-icons/fa6";
import { FaShippingFast } from "react-icons/fa";

const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

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
const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const handleOpenModal = () => setModalOpen(true);
const handleCloseModal = () => setModalOpen(false);

const handleOpenModalAddress = () => {
    // Tampilkan dialog konfirmasi
    setConfirmDialogOpen(true);
};

const handleConfirmChangeAddress = () => {
    localStorage.removeItem('savedAddress');
    localStorage.removeItem('savedCoordinates');

    setFormData({
        namaLengkap: '',
        email: '',
        nomorTelepon: '',
        address: '',
        subdistrict: { id: '', name: '' },
        city: { id: '', name: '' },
        province: { id: '', name: '' },
        kelurahan: '',
    });
    setSavedAddress({});
    setSelectedCoordinates(null);
    setModalAddressOpen(true)
    setConfirmDialogOpen(false);
};

const handleOpenAddressForm = () => {
    setModalAddressOpen(true)
    setFormData({
        namaLengkap: '',
        email: '',
        nomorTelepon: '',
        address: '',
        subdistrict: { id: '', name: '' },
        city: { id: '', name: '' },
        province: { id: '', name: '' },
        kelurahan: '',
    });
};
const handleCloseModalAddress = () => {
    setModalAddressOpen(false)
    setConfirmDialogOpen(false);
};

const handleOpenModalVoucher = () => setModalVoucherOpen(true);
const handleCloseModalVoucher = () => setModalVoucherOpen(false);


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
        const response = await fetch(`${baseUrl}/provinces`); // Ganti URL sesuai dengan endpoint API di Next.js
        const data = await response.json();
        setProvinces(data);
    } catch (error) {
        console.error('Error fetching provinces:', error);
    }
};

// Fungsi untuk mengambil daftar kota dari API berdasarkan provinsi yang dipilih
const fetchCities = async (provinceId) => {
    try {
        const response = await fetch(`${baseUrl}/city?provinceId=${provinceId}`); // Ganti URL sesuai dengan endpoint API di Next.js
        const data = await response.json();
        setCities(data);
    } catch (error) {
        console.error('Error fetching cities:', error);
    }
};

const fetchSubdistrict = async (cityId) => {
    try {
        const response = await fetch(`${baseUrl}/subdistrict?cityId=${cityId}`); // Ganti URL sesuai dengan endpoint API di Next.js
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
            const response = await fetch(`${baseUrl}/cost`, {
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
    // Ambil data dari localStorage saat komponen dimuat
    const storedAddress = JSON.parse(localStorage.getItem('savedAddress'));
    if (storedAddress) {
      setFormData(storedAddress);
      setSavedAddress(storedAddress);
      console.log(storedAddress)
    }
  }, []);

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
    localStorage.setItem('savedAddress', JSON.stringify(formData));
    setSavedAddress(formData);
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
    const fetchHalloExpressAvailability = async () => {
        try {
            const response = await axios.get(`${baseUrl}/hallo-express/`);
            setShowHalloExpress(response.status === 200);
            console.log('Fetching Hallo Express availability...');
        } catch (error) {
            console.error('Error fetching Hallo Express availability:', error);
            setShowHalloExpress(false); // Sembunyikan jika error atau tidak ditemukan
        }
    };

    const checkHalloExpressAvailability = () => {
        // Periksa dulu di localStorage apakah data kota tersimpan
        const storedAddress = JSON.parse(localStorage.getItem('savedAddress'));
        const cityName = (storedAddress && storedAddress.city.name) || formData.city.name;

        if (cityName === 'Kota Tasikmalaya' || cityName === 'Kabupaten Tasikmalaya') {
            fetchHalloExpressAvailability();
        } else {
            setShowHalloExpress(false);
        }
    };

    checkHalloExpressAvailability();
}, [isFormSaved, formData]);

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

        const savedCoordinates = JSON.parse(localStorage.getItem('savedCoordinates'));
        const posLatitude = savedCoordinates ? savedCoordinates.lat : null;
        const posLongitude = savedCoordinates ? savedCoordinates.lng : null;

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
            posLatitude: posLatitude, // Ganti dengan nilai latitude yang dipilih
            posLongitude: posLongitude // Ganti dengan nilai longitude yang dipilih
        });

      const response = await axios.post(`${baseUrl}/shipping`, formDataParams, {
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

        const posKodeTransaksi = `INV - ${getRandomFourDigits()} - ${getCurrentFormattedDate()} - ${user.userId}`;
        const posTanggalTransaksi = `${getCurrentFormattedDateTime()}`;
        const posDiskonVoucher = appliedVoucher ? appliedVoucher.value : 0;
        const formDataParamsTransaksi = new URLSearchParams({
          posMerchantId: 9,
          posKodeTransaksi: posKodeTransaksi,
          posCustomerId: user.userId,
          posTanggalTransaksi: posTanggalTransaksi,
          posTipeTransaksi: 3,
          posKasirId: 0,
          posStatus: posStatus,
          posTotalPembayaran: transactionData.product.hargaJual * transactionData.quantity,
          posTotalBayar: transactionData.product.hargaJual * transactionData.quantity,
          posJenisPembayaranOnline: posJenisPembayaranOnline,
          posShipingId: posShippingId,
          posDiskon_voucher: posDiskonVoucher
        });

        const transaksiResponse = await axios.post(`${baseUrl}/postTransaksi`, formDataParamsTransaksi, {
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

          const detailTransaksiResponse = await axios.post(`${baseUrl}/detailTransaksi`, detailTransaksiData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });

          console.log('Response detail transaksi:', detailTransaksiResponse.data);

          if (selectedVoucher && selectedVoucher.code) {
            const formDataVoucher = {
              member_id: user.userId,
              price_total: transactionData.product.hargaJual * transactionData.quantity,
              code: selectedVoucher.code,
              order_id: transaksiResponse.data.lastTransaksiId
            };

            console.log('Data voucher yang dikirim:', formDataVoucher);

            try {
              const voucherPostResponse = await axios.post(`${baseUrl}/voucherPost`, formDataVoucher, {
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
              order_id: posKodeTransaksi,
              gross_amount: totalPembayaran,
              first_name: user.nama,
              email: user.email,
              phone: user.noTelp
            };

            try {
              const midtransResponse = await axios.post(`${baseUrl}/midtrans`, midtransTransactionParams);

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
    showModal();;
  }
};
  

useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://app.midtrans.com/snap/snap.js';
  script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
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

const getCurrentFormattedDateTime = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

const checkoutButton = handleSubmitCheckout;

const [selectedCoordinates, setSelectedCoordinates] = useState(null);

    const handleCoordinateSelect = (coordinates) => {
        // Simpan koordinat ke localStorage
        setSelectedCoordinates(coordinates);
        localStorage.setItem('savedCoordinates', JSON.stringify(coordinates));
      };

const [vouchers, setVouchers] = useState([]);

useEffect(() => {
    const fetchVoucher = async () => {
        try {
            const response = await fetch(`${baseUrl}/voucher`);
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
      console.log(`Voucher dipilih: ${selectedVoucher.code} dengan diskon Rp. ${selectedVoucher.value} berakhir dalam ${calculateDaysLeft(selectedVoucher.exp_date)} hari.`);
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

  const [modalIsOpen, setModalIsOpen] = useState(false);

      function showModal() {
        setModalIsOpen(true);
      }
    
      function closeModal() {
        setModalIsOpen(false);
      }

      useEffect(() => {
        if (transactionData) {
          const totalProduk = transactionData.product.hargaJual * transactionData.quantity;
          const ongkosKirim = (selectedShipping && selectedShipping.value) || 0;
          const diskonVoucher = (appliedVoucher && appliedVoucher.value) || 0;
          const totalPembayaran = (totalProduk - diskonVoucher) + ongkosKirim;
          setTotalPembayaran(totalPembayaran);
        }
      }, [transactionData, selectedShipping, appliedVoucher]);   

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

  function showModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  function showModal() {
    setModalIsOpen(true);

    // Set timeout to close the modal after 3 seconds
    setTimeout(() => {
      closeModal();
    }, 680);
  }

    console.log('Current User:', user);
  return (
    <>
    {user ? (
        <>
    <Modal isOpen={modalIsOpen} onClose={closeModal}>
            <FaShippingFast className="check-cart" />
            <p className="check-notif-cart">Pilih pengiriman terlebih dahulu</p>
        </Modal>
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
                    {user && user.nama && (
                    <>
                        <FaUserCircle />
                        <h3>{user.nama} ({user.noTelp})</h3>
                    </>
                    )}
                </div>

                <div className="shipping-alamat">
                    {savedAddress.address && savedAddress.subdistrict.name && savedAddress.city.name && savedAddress.province.name ? (
                        <p>{savedAddress.address}, {savedAddress.subdistrict.name}, {savedAddress.city.name}, {savedAddress.province.name}</p>
                    ) : (
                        <p>Alamat belum diisi.</p>
                    )}
                    <button onClick={() => {
                        if (savedAddress.address && savedAddress.subdistrict.name && savedAddress.city.name && savedAddress.province.name) {
                            handleOpenModalAddress();
                        } else {
                            handleOpenAddressForm();
                        }
                    }}>
                        {savedAddress.address && savedAddress.subdistrict.name && savedAddress.city.name && savedAddress.province.name ? 'Ubah Alamat' : 'Isi Alamat'}
                    </button>
                </div>
            </div>
            <Modal isOpen={confirmDialogOpen} onClose={closeModal}>
                <FaMapLocationDot className="check-cart"/>
                <p className="check-notif-cart">Yakin ingin ubah alamat?</p>
                <div className="confirmation-buttons">
                    <button onClick={handleCloseModalAddress}>Tidak</button>
                    <button onClick={handleConfirmChangeAddress}>Lanjut Ubah Alamat</button>
                </div>
            </Modal>
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
                                    <div className="product-details-checkout-image">
                                        <img src={`https://api.upos-conn.com/master/v1/${transactionData.product.gambar}`} alt={transactionData.product.namaVarian} />
                                    </div>
                                    <div className="product-details-checkout-name">
                                        <h4>{transactionData.product.namaProduk.replace(/&amp;/g, '&')}</h4>
                                        <p>{transactionData.product.namaVarian.replace(/&amp;/g, '&')}</p>
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
                                    <span> - Estimasi tiba {selectedShipping.etd.includes('-') ? selectedShipping.etd.split('-')[0].trim() : selectedShipping.etd} {selectedShipping.service === 'Hallo Express' ? '' : 'hari'}</span>
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
                        <li onClick={handleOpenModalVoucher}><div className="menu-popup-mobile-item"><BiSolidDiscount /> {appliedVoucher ? `Voucher: ${appliedVoucher.code} - Diskon Rp. ${new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(appliedVoucher.value)}` : 'Gunakan Voucher'}</div><GoChevronRight /></li>
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
                            <p>Potongan Voucher:</p> <p>- Rp. {appliedVoucher ? `${new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(appliedVoucher.value)}` : 0}</p>
                        </div>
                        <div className="total-product-checkout-box">
                            <h4>Total Pembayaran:</h4> <span>Rp. {totalPembayaran.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="btn-checkout-pilihan">
                <button className="voucher-checkout" onClick={handleOpenModalVoucher}>
                    <BiSolidDiscount /> {appliedVoucher ? `Voucher: ${appliedVoucher.code} - Diskon Rp. ${new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(appliedVoucher.value)}` : 'Gunakan Voucher'}
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
                        <div className="choose-shipping">
                            {shippingOptions.length === 0 ? (
                                <img src="/images/isi-alamat.png" alt="Isi Alamat" className="isi-alamat-icon"/>
                            ) : (
                            <form onSubmit={handleSubmitShipping}>
                                {shippingOptions.map(option => (
                                <React.Fragment key={option.service}>
                                    <label className="shipping-radio">
                                    <input
                                        type="radio"
                                        name="shippingOption"
                                        value={option.service}
                                        onChange={() => handleSelectOption(option)}
                                        checked={selectedShipping && selectedShipping.service === option.service}
                                    />
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
                                    <input
                                    type="radio"
                                    name="shippingOption"
                                    value='Hallo Express'
                                    onChange={() => handleSelectOption({ service: 'Hallo Express', description: 'BIAYA LEBIH HEMAT' })}
                                    checked={selectedShipping && selectedShipping.service === 'Hallo Express'}
                                    />
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
                                <button type="submit" disabled={!selectedShipping} className='form-button-style'>
                                Konfirmasi Ekspedisi <FaSave />
                                </button>
                            </form>
                            )}
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
                                {vouchers.length === 0 ? (
                                    <p>Belum ada voucher</p>
                                ) : (
                                    vouchers.map(voucher => {
                                    const daysLeft = calculateDaysLeft(voucher.exp_date);
                                    const isVoucherApplicable = totalPembayaran >= voucher.min_spend;
                                    const remainingAmount = voucher.min_spend - totalPembayaran;

                                    return (
                                        <label className="shipping-radio-voucher" key={voucher.id} onClick={() => handleVoucherSelect(voucher)} disabled={!isVoucherApplicable}>
                                        <input 
                                            type="radio" 
                                            name="voucherOption" 
                                            value={voucher.code} 
                                            onClick={(e) => e.stopPropagation()} 
                                            disabled={!isVoucherApplicable} 
                                        /> {/* Mencegah event bubbling ke label */}
                                        <span>
                                            <div className="voucher-box-layout">
                                            <div className="voucher-box-image">
                                                <img src={`https://prahwa.net/storage/${voucher.image}`} />
                                                <div className="circle-left"></div>
                                                <div className="circle-right"></div>
                                                {!isVoucherApplicable && (
                                                <span>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(remainingAmount)} lagi untuk menggunakan voucher ini</span>
                                                )}
                                            </div>
                                            <div className="voucher-box-content">
                                                <h5><BiSolidDiscount /> Diskon Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(voucher.value)},-</h5>
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
                                    })
                                )}
                                </div>

                            <button type="submit" className='form-button-style'>Pakai Voucher<FaSave /></button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </>
        ) : (
            <>
              <div className='login-first-layout'>
              <img src="/images/login-first.png" alt="Masuk dulu H!b" className='login-first'/>
              {/* <button onClick={clickLogin}>Masuk Sekarang</button> */}
              </div>
            </>
        )}
    </>
    );
    };
    
    export default TransaksiBarang;