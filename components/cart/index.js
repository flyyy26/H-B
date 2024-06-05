import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '@/contexts/CartContext';
import { IoMdHeart, IoMdTrash } from "react-icons/io";
import { FiPlus, FiMinus } from "react-icons/fi";
import RandomProduct from '../random-product';
import Link from 'next/link';
import { IoCart } from "react-icons/io5";
import { useFavorit } from '@/contexts/FavoritContext';
import { useAuth } from '@/contexts/AuthContext';
import Modal from '@/components/modal'; // Pastikan pathnya benar
import { BsBagCheckFill } from 'react-icons/bs';
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { useRouter } from 'next/router';
import { RiHeartsFill } from "react-icons/ri";

const CartComponent = ({ id, status }) => {
  const { user } = useAuth();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleCheckout = () => {
    if (checkedItems.length === 0) {
      showModalChooseProduct();
      return;
    }
    router.push({
      pathname: '/transaksi'
    });
  };

  const { handleAddToFavorit } = useFavorit();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalChooseProductIsOpen, setModalChooseProductIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (id && status) {
      try {
        const response = await axios.get(`${baseUrl}/cart/${id}/${status}`);
        if (response.status === 200) {
          const modifiedData = response.data.data.map(item => ({
            ...item,
            namaVarian: item.namaVarian.replace(/&amp;/g, '&'), // Menghapus &amp; dari namaVarian
            namaProduk: item.namaProduk.replace(/&amp;/g, '&') // Menghapus &amp; dari namaProduk
          }));
          setCartItems(modifiedData);
          setIsLoading(false);
          fetchDataCartTotalPrice();
          console.log(modifiedData)
        } else {
          console.error('Failed to fetch data:', response.statusText);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, status]);
  
  useEffect(() => {
    const fetchDataInterval = setInterval(fetchData, 3000);
    return () => clearInterval(fetchDataInterval);
  }, []);

  const handleDeleteItem = async (csoId) => {
    try {
      const response = await axios.delete(`${baseUrl}/deleteCart`, {
        data: { csoId }
      });
  
      if (response.status === 200) {
        if (response.data && response.data.success) {
          showModal(response.data.success);
        } else {
          console.error('Success message not found in response:', response);
        }
        fetchData();
        fetchDataCartTotalPrice();
      } else {
        console.error('Failed to delete item:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleIncreaseQuantity = async (csoId) => {
    try {
      const response = await axios.get(`${baseUrl}/plusQuantity/${csoId}`);
      if (response.status === 201) {
        fetchData();
        fetchDataCartTotalPrice();
      } else {
        console.error('Failed to increase quantity:', response.statusText);
      }
    } catch (error) {
      console.error('Error increasing quantity:', error);
    }
  };

  const handleDecreaseQuantity = async (csoId) => {
    try {
      const response = await axios.get(`${baseUrl}/minQuantity/${csoId}`);
      if (response.status === 201) {
        fetchData();
        fetchDataCartTotalPrice();
      } else {
        console.error('Failed to decrease quantity:', response.statusText);
      }
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    }
  };

  const handleDeleteAllCartItems = async () => {
    try {
      const response = await axios.delete(`${baseUrl}/deleteAll/${user.userId}/1`);
      if (response.status === 200) {
        if (response.data && response.data.messages && response.data.messages.success) {
          showModal(response.data.messages.success);
          fetchDataCartTotalPrice();
        } else {
          console.error('Success message not found in response:', response);
        }
        fetchData();
      }
    } catch (error) { 
      console.error('Error deleting all cart items:', error);
    }
  };

  function showModal(message) {
    setModalMessage(message);
    setModalIsOpen(true);

    setTimeout(() => {
      closeModal();
    }, 680);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  function showModalChooseProduct() {
    setModalChooseProductIsOpen(true);

    setTimeout(() => {
      closeModalChooseProduct();
    }, 1080);
  }

  function closeModalChooseProduct() {
    setModalChooseProductIsOpen(false);
  }

  const [totalHarga, setTotalHarga] = useState(null);

  const fetchDataCartTotalPrice = async () => {
    try {
      const userId = user.userId;
      const cartStatus = 'true';

      const response = await axios.get(`${baseUrl}/cartTotalPrice/${userId}/${cartStatus}`);
      const data = response.data;

      if (data && data.data && data.data.grand_total_asli) {
        setTotalHarga(data.data.grand_total_asli);
      }
    } catch (error) {
      console.error('Error fetching cart total:', error);
    }
  };

  useEffect(() => {
    if (user && user.userId) {
      fetchDataCartTotalPrice();
    }
  }, [user]);

  const [checkedItems, setCheckedItems] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false); // State for "Check All"

  async function handleCheckboxChange(id_cso, checked) {
    try {
      const status = checked ? 'true' : 'false';
      const response = await fetch(`${baseUrl}/checkItem/${id_cso}/${status}`);
      if (!response.ok) {
        console.error('HTTP error', response.status, await response.text());
        return;
      }
      const data = await response.json();
      if (data && data.status === 200) {
        console.log('Data telah diperbarui', data);
        if (checked) {
          setCheckedItems(prevItems => {
            const updatedItems = [...prevItems, id_cso];
            localStorage.setItem('checkedItems', JSON.stringify(updatedItems));
            return updatedItems;
          });
        } else {
          setCheckedItems(prevItems => {
            const updatedItems = prevItems.filter(item => item !== id_cso);
            localStorage.setItem('checkedItems', JSON.stringify(updatedItems));
            return updatedItems;
          });
        }
      } else {
        console.error('Error updating data:', data);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  }

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('checkedItems'));
    if (storedItems) {
      setCheckedItems(storedItems);
    }
  }, []);

  const handleCheckAll = (checked) => {
    setIsCheckAll(checked);
    if (checked) {
      const allItemIds = cartItems.map(item => item.id_cso);
      setCheckedItems(allItemIds);
      localStorage.setItem('checkedItems', JSON.stringify(allItemIds));
      allItemIds.forEach(id => handleCheckboxChange(id, true));
    } else {
      setCheckedItems([]);
      localStorage.setItem('checkedItems', JSON.stringify([]));
      cartItems.forEach(item => handleCheckboxChange(item.id_cso, false));
    }
  };

  if (isLoading) return <p>Tunggu Sebentar...</p>;

  const goToFavoritPage = () => {
    if (user && user.userId) {
      const userId = user.userId;
      const cartStatus = 2;
      router.push(`/favorit/${userId}/${cartStatus}`);
    } else {
      openLogin();
    }
  };

  return (
    <>
      <div className="menu-popup-mobile menu-popup-mobile-template">
        <span className="close"><HiOutlineArrowLeft onClick={() => router.back()} /> Keranjang</span>
        <RiHeartsFill className='favorit-icon-mobile' onClick={goToFavoritPage} />
      </div>
      <div className="container-small">
        <div className="heading-small">
          <h1>Keranjang <span>beauty bestie</span></h1>
        </div>
        <div className="layout-cart-dekstop">
          <div className="header-cart-dekstop-box">
            <h1>Produk</h1>
          </div>
          <div className="header-cart-dekstop-box">
            <h1>Harga Satuan</h1>
          </div>
          <div className="header-cart-dekstop-box">
            <h1>Kuantitas</h1>
          </div>
          <div className="header-cart-dekstop-box">
            <h1>Total Harga</h1>
          </div>
          <div className="header-cart-dekstop-box">
            <h1>Aksi</h1>
          </div>
        </div>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div className='select-cart' key={index}>
              <div className="layout-cart-dekstop layout-cart-dekstop-item" htmlFor={item.id_cso}>
                <div className="product-detail-cart">
                  <div className="product-image-cart">
                    <img src={`https://api.upos-conn.com/master/v1/${item.gambar}`} alt={item.namaVarian} />
                  </div>
                  <div className="product-desc-cart">
                    <h2>{item.namaProduk}</h2>
                    <h3>{item.namaVarian}</h3>
                    <span className='total-mobile'>Rp. {item.subtotal_diskon}</span>
                    <div className="quantity-selector quantity-selector-mobile">
                      <button onClick={() => item.qty > 1 && handleDecreaseQuantity(item.id_cso)} disabled={item.qty === 1}><FiMinus /></button>
                      <p>{item.qty}</p>
                      <button onClick={() => handleIncreaseQuantity(item.id_cso)}><FiPlus /></button>
                    </div>
                  </div>
                  <div className="mobile-cart-action">
                    <button onClick={() => handleAddToFavorit(item.varian_id)}><IoMdHeart /></button>
                    <button onClick={() => handleDeleteItem(item.id_cso)}><IoMdTrash /></button>
                  </div>
                </div>
                <div className="product-price-cart">
                  <span>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(item.harga_promo)}</span>
                </div>
                <div className="product-price-cart">
                  <div className="quantity-selector">
                    <button onClick={() => item.qty > 1 && handleDecreaseQuantity(item.id_cso)} disabled={item.qty === 1}><FiMinus /></button>
                    <p>{item.qty}</p>
                    <button onClick={() => handleIncreaseQuantity(item.id_cso)}><FiPlus /></button>
                  </div>
                </div>
                <div className="product-price-cart">
                  <span>Rp. {item.subtotal_diskon}</span>
                </div>
                <div className="product-price-cart product-price-cart-action">
                  <button onClick={() => handleAddToFavorit(item.varian_id)}><IoMdHeart /></button>
                  <button onClick={() => handleDeleteItem(item.id_cso)}><IoMdTrash /></button>
                </div>
              </div>
              <div className='select-cart-box'>
                <input
                  type="checkbox"
                  id={item.id_cso}
                  name={item.id_cso}
                  value={item.namaVarian}
                  onChange={() => handleCheckboxChange(item.id_cso, !checkedItems.includes(item.id_cso))}
                  checked={checkedItems.includes(item.id_cso)}
                />
              </div>
            </div>
          ))
        ) : (
          <img className='kosong' src='/images/keranjang-kosong.png'/>
        )}
        <Modal isOpen={modalIsOpen} onClose={closeModal}>
          <BsBagCheckFill className="check-cart" />
          <p className="check-notif-cart">{modalMessage}</p>
        </Modal>
        <Modal isOpen={modalChooseProductIsOpen} onClose={closeModalChooseProduct}>
          <BsBagCheckFill className="check-cart" />
          <p className="check-notif-cart">Pilih dulu produk nya yuk!</p>
        </Modal>
        <RandomProduct limit={8} />
        <div className="cart-btn-checkout">
          <button className="cart-btn-checkout-box trash-cart" onClick={handleDeleteAllCartItems}><IoMdTrash /> Hapus Semua Produk</button>
          <div className="select-all-box">
            <input 
              type="checkbox" 
              id="check-all"
              onChange={(e) => handleCheckAll(e.target.checked)}
              checked={isCheckAll}
            />
            <label htmlFor="check-all">Pilih Semua Produk</label>
          </div>
          <span>Total Keseluruhan : <h3>Rp. {totalHarga}</h3></span>
          <button className="checkout-cart" onClick={handleCheckout}>Checkout</button>
          <div className='cart-fixed-mobile'>
            <div className="select-all-box">
              <input 
                type="checkbox" 
                id="check-all"
                onChange={(e) => handleCheckAll(e.target.checked)}
                checked={isCheckAll}
              />
              <label htmlFor="check-all">Pilih Semua Produk</label>
            </div>
            <span>Total : <h3>Rp. {totalHarga}</h3></span>
          </div>
          <button className="checkout-cart-mobile" onClick={handleCheckout}>Checkout</button>
        </div>
      </div>
    </>
  );
};

export default CartComponent;
