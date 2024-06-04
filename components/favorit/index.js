// components/CartComponent.js

import { useEffect, useState } from 'react';
import axios from 'axios'; 
import { useCart } from '@/contexts/CartContext';
import RandomProduct from '../random-product';
import { IoMdHeart, IoMdTrash } from "react-icons/io";
import { IoCart } from "react-icons/io5";
import { useAuth } from '@/contexts/AuthContext';
import Modal from '@/components/modal'; // Pastikan pathnya benar
import { BsBagCheckFill } from 'react-icons/bs';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { GoHome } from "react-icons/go";
import { PiBasketLight } from "react-icons/pi";
import { PiClipboardTextLight } from "react-icons/pi";
import { PiUserCircleLight } from "react-icons/pi";
import { PiPercent } from "react-icons/pi";
import { HiOutlineArrowLeft } from "react-icons/hi2";

const FavoritComponent = ({ id, status }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [posQty, setPosQty] = useState(1);

  const { handleAddToCart } = useCart();

  const fetchData = async () => {
    if (id && status) {
      try {
        const response = await axios.get(`http://localhost:3000/api/cart/${id}/${status}`);
        if (response.status === 200) {
          // Replace &amp; in namaVarian and namaProduk
          const cleanedData = response.data.data.map(item => ({
            ...item,
            namaVarian: item.namaVarian ? item.namaVarian.replace(/&amp;/g, '&') : item.namaVarian,
            namaProduk: item.namaProduk ? item.namaProduk.replace(/&amp;/g, '&') : item.namaProduk
          }));
          setCartItems(cleanedData);
          setIsLoading(false);
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
    const fetchDataInterval = setInterval(fetchData, 3000); // Misalnya, dijalankan setiap 5 detik
    return () => clearInterval(fetchDataInterval); // Membersihkan interval saat komponen di-unmount
  }, []);

const handleDeleteAllCartItems = async () => {
  try {
    const response = await axios.delete(`http://localhost:3000/api/deleteAllFavorit/${user.userId}/2`);
    if (response.status === 200) {
      if (response.data && response.data.messages && response.data.messages.success) {
        showModal(response.data.messages.success);
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

  // Set timeout to close the modal after 3 seconds
  setTimeout(() => {
    closeModal();
  }, 680);
}

function closeModal() {
  setModalIsOpen(false);
}

const goToCartPage = () => {
  // Pastikan pengguna telah login dan memiliki ID yang valid
  if (user && user.userId) {
      const userId = user.userId; // Gunakan ID pengguna dari data pengguna yang telah diperoleh
      const cartStatus = 1; // Ganti dengan status keranjang yang sesuai
      router.push(`/keranjang/${userId}/${cartStatus}`);
  } else {
      openLogin(); // Log pesan kesalahan jika ID pengguna tidak tersedia
  }
  };

  if (isLoading) return <p>Tunggu Sebentar...</p>;

  return (
      <>
      <div className="menu-popup-mobile menu-popup-mobile-template">
        <span className="close"><HiOutlineArrowLeft onClick={() => router.back()} /> Favorit</span>
        <IoCart className='favorit-icon-mobile' onClick={goToCartPage} />
      </div>
      <div className="container-small container-small-mobile">
          <div className="heading-small space-between">
              <h1>Favorit <span>beauty bestie</span></h1>
              <button onClick={handleDeleteAllCartItems}>Hapus Semua</button>
          </div>
          <div className="layout-cart-dekstop">
              <div className="header-cart-dekstop-box">
                  <h1>Produk</h1>
              </div>
              <div className="header-cart-dekstop-box">
                  <h1>Kategori</h1>
              </div>
              <div className="header-cart-dekstop-box">
                  <h1>Stok Produk</h1>
              </div>
              <div className="header-cart-dekstop-box">
                  <h1>Harga Satuan</h1>
              </div>
              <div className="header-cart-dekstop-box">
                  <h1>Aksi</h1>
              </div>
          </div>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <>
          <div className="layout-cart-dekstop layout-cart-dekstop-item layout-cart-dekstop-item-favorit" key={index}>
              <div className="product-detail-cart">
                  <div className="product-image-cart">
                      <img src={`https://api.upos-conn.com/master/v1/${item.gambar}`} alt={item.namaVarian}/>
                  </div>
                  <div className="product-desc-cart">
                    <h2>{item.namaProduk}</h2>
                    <h3>{item.namaVarian}</h3>
                    <span className='total-mobile'>{item.namaKategoriBarang}</span>
                    <span className='total-mobile'>Rp. {item.subtotal_diskon}</span>
                </div>
              </div>
              <div className="product-price-cart">
                  <span>{item.namaKategoriBarang}</span>
              </div>
              <div className="product-price-cart">
                  <span>{item.jumlahStok}</span>
              </div>
              <div className="product-price-cart">
                  <span>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(item.harga_promo)}</span>
              </div>
              <div className="product-price-cart product-price-cart-action">
                  <button onClick={() => handleAddToCart(item.varian_id, posQty)} ><IoCart /></button>
              </div>
              <div className='add-to-cart-favorit-mobile'>
                  <button onClick={() => handleAddToCart(item.varian_id, posQty)} ><IoCart /></button>
              </div>
          </div>
          
          </>
           ))
          ) : (
            <img className='kosong' src='/images/favorit-kosong.png'/>
          )}
          <button className='delete-all-mobile' onClick={handleDeleteAllCartItems}>Hapus Semua</button>
        <Modal isOpen={modalIsOpen} onClose={closeModal}>
          <BsBagCheckFill className="check-cart" />
          <p className="check-notif-cart">{modalMessage}</p>
        </Modal>
          <RandomProduct limit={8} />
      </div>
      <div className="menu-mobile">
          <div className="menu-mobile-layout">
              <ul>
                  <li>
                      <Link href="/">
                          <span className={router.pathname === "/" ? "active" : ""}><GoHome/>Beranda</span>
                      </Link>
                  </li>
                  <li>
                      <Link href="/catalog-product">
                          <span className={router.pathname === "/catalog-product" ? "active" : ""}><PiBasketLight />Katalog</span>
                      </Link>
                  </li>
                  <li>
                      <Link href="/discount">
                          <span className={router.pathname === "/discount" ? "active" : ""}><PiPercent />Promo</span>
                      </Link>
                  </li>
                  <li>
                      <Link href="/pesanan">
                          <span className={router.pathname === "/pesanan" ? "active" : ""}><PiClipboardTextLight />Pesanan</span>
                      </Link>
                  </li>
                  <li>
                      <Link href="/profil">
                          <span className={router.pathname === "/profil" ? "active" : ""}><PiUserCircleLight />Profil</span>
                      </Link>
                  </li>
              </ul>
          </div>
      </div>
      </>

  );
  
};

export default FavoritComponent;
