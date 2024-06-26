import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FiPlus, FiMinus } from "react-icons/fi";
import { BsCartPlusFill } from "react-icons/bs";
import { IoMdHeartEmpty } from "react-icons/io";
import RandomProduct from '@/components/random-product';
import { useFavorit } from '@/contexts/FavoritContext';
import { useCart } from '@/contexts/CartContext';
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { RiHeartsFill } from "react-icons/ri";
import { IoCart } from "react-icons/io5";
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import LoginForm from '@/components/login-form';

const ProductDetails = () => {
  const { user } = useAuth();
  const [details, setDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('keterangan'); 
  const [posQty, setPosQty] = useState(1);
  const { handleAddToFavorit } = useFavorit();
  const { handleAddToCart } = useCart();
  const [showLogin, setShowLogin] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [count, setCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (user && user.userId) {
        const fetchDataCartTotal = async () => {
            try {
                const userId = user.userId;
                const cartStatus = 1;

                const response = await axios.get(`${baseUrl}/cartTotal/${userId}/${cartStatus}`);
                const data = response.data;

                if (data && data.data && data.data.count) {
                    setCount(data.data.count);
                }
            } catch (error) {
                console.error('Error fetching cart total:', error);
            }
        };

        fetchDataCartTotal();
        const interval = setInterval(fetchDataCartTotal, 1000); 
        return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const fetchDetailsProduct = async () => {
      try {
        const response = await fetch(`${baseUrl}/productId/${router.query.id}`);
        const data = await response.json();
        if (data && data.data.length > 0) {
          const cleanedData = data.data[0];
          cleanedData.keterangan = cleanHtmlTags(cleanedData.keterangan);
          cleanedData.bahan = cleanHtmlTags(cleanedData.bahan);

          if (cleanedData.namaVarian) {
            cleanedData.namaVarian = cleanedData.namaVarian.replace(/&amp;/g, '&');
          }
          if (cleanedData.namaProduk) {
            cleanedData.namaProduk = cleanedData.namaProduk.replace(/&amp;/g, '&');
          }
          setDetails(cleanedData);
        } else {
          setDetails(null);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    if (router.query.id) {
      fetchDetailsProduct();
    }
  }, [router.query.id]);

  const cleanHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const cleanedText = doc.body.textContent || "";
    return cleanedText.replace(/<p[^>]*>(\s|&nbsp;)*<\/p>/g, '');
  };

  if (!details || !router.query.id) {
    return (
      <div className='login-first-layout'>
        <img src="/images/tunggu-sebentar.png" alt='Loading' className='login-first'/>
      </div>
    );
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleBrandClick = async (productId) => {
    router.push(`/catalog-product/filter/${productId}`);
  };

  const handleIncrement = () => {
    setPosQty(prevQty => prevQty + 1);
  };

  const handleDecrement = () => {
    if (posQty > 1) {
      setPosQty(prevQty => prevQty - 1);
    }
  };

  

  const openLogin = () => {
    setShowLogin(true);
  };

  const closeLogin = () => {
    setShowLogin(false);
  };

  const handleBuyNow = () => {
    const transactionData = {
      product: details,
      quantity: posQty
    };
    localStorage.setItem('transactionData', JSON.stringify(transactionData));
    router.push('/transaksi-produk');
  };

  const goToCartPage = () => {
    // Pastikan pengguna telah login dan memiliki ID yang valid
    if (user && user.userId) {
        const userId = user.userId; // Gunakan ID pengguna dari data pengguna yang telah diperoleh
        const cartStatus = 1; // Ganti dengan status keranjang yang sesuai
        router.push(`/cart/${userId}/${cartStatus}`);
    } else {
        openLogin(); // Log pesan kesalahan jika ID pengguna tidak tersedia
    }
    };

    console.log('Current User:', user);

  return (
    <>
    {user ? (
    <div className="homepage-layout">
      {showLogin && <LoginForm onClose={closeLogin} suppressHydrationWarning/>}
      <div className="product-details-layout">
        <div className="product-details-image">
          <div className="menu-popup-mobile menu-popup-mobile-template menu-popup-mobile-template-product">
            <span className="close"><HiOutlineArrowLeft onClick={() => router.back()} /></span>
            <span onClick={goToCartPage}>
              {count !== null && (
                <div className='amount-product'><p>{count}</p></div>
              )}
              <IoCart/>
            </span>
          </div>
          <img src={`https://api.upos-conn.com/master/v1/${details.gambar}`} alt={details.namaVarian}/>
        </div>
        <div className="product-details-main">
          <div className="product-details-top">
            <div className="product-details-variant">
              <span>{details.namaProduk}</span>
              <h1>{details.namaVarian}</h1>
              <h2>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(details.hargaJual)} 
                  <IoMdHeartEmpty onClick={() => handleAddToFavorit(details.posVarianId)}/>
              </h2>
            </div>
            <div className="product-details-merk">
              <div className="product-details-merk-box">
                <h3>Produk lain dari <span><b>{details.namaProduk}</b></span></h3>
                <button onClick={() => handleBrandClick(details.posProdukId)}>Lihat Produk</button>
              </div>
            </div>
          </div>
          <div className="product-details-list-btn">
            <div className="product-details-quantity">
              <span>Kuantitas <font>:</font></span>
              <div className="quantity-selector">
                <button onClick={handleDecrement}><FiMinus /></button>
                <p>{posQty}</p>
                <button onClick={handleIncrement}><FiPlus /></button>
              </div>
            </div>
            <div className='stok-page-product'>
              <p>{details.jumlahStok} stok tersedia</p>
            </div>
            
            <button className="btn-details-box" onClick={handleBuyNow}>Beli Sekarang</button>
            <button className="btn-details-box" onClick={() => handleAddToCart(details.posVarianId, posQty)}><BsCartPlusFill /></button>
            <button className="btn-details-box" onClick={() => handleAddToFavorit(details.posVarianId)}><IoMdHeartEmpty /></button>
          </div>
          <div className="product-details-tabs">
            <button className={activeTab === 'keterangan' ? 'active' : ''} onClick={() => handleTabClick('keterangan')}>Keterangan</button>
            <button className={activeTab === 'bahan' ? 'active' : ''} onClick={() => handleTabClick('bahan')}>Bahan</button>
          </div>
          <div className="product-details-content">
            {activeTab === 'keterangan' && details.keterangan && (
              <p dangerouslySetInnerHTML={{ __html: details.keterangan }} />
            )}
            {activeTab === 'bahan' && details.bahan && (
              <p dangerouslySetInnerHTML={{ __html: details.bahan }} />
            )}
          </div>
        </div>
        <div className='checkout-product-mobile'>
          <div className='cart-checkout-product-mobile' onClick={() => handleAddToCart(details.posVarianId, posQty)}>
            <BsCartPlusFill />
          </div>
          <button onClick={handleBuyNow}>Beli Sekarang</button>
        </div>
      </div>
      <RandomProduct limit={25}/>
    </div>
    ) : (
    <button className="btn-details-box" onClick={handleBuyNow}>Masuk Untuk beli</button>
    )}
    </>
  );
};

export default ProductDetails;
