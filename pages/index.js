import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Context } from "@/context";
import { useContext } from "react";
import { getListOfCategories } from "@/utils";
import Post from '@/pages/posts/index';
import gratisOngkir from "@/public/images/gratis-ongkir.png"
import Image from "next/image";
import Merk from "@/components/merk";
import discountPromo from "@/public/images/banner-promo-discount.png"
import discountPromoMobile from "@/public/images/discount-mobile.png"
import Link from "next/link";
import { BsCartPlusFill, BsFillCartCheckFill } from "react-icons/bs";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import lihatDulu from "@/public/images/lihat-dulu.png"
import BannerComponent from "@/components/banner";
import Keunggulan from "@/components/keunggulan";
import bonus from "@/public/images/bonus.png"
import BestSeller from "@/components/best-seller";
import axios from 'axios';
import { useCart } from '@/contexts/CartContext';
import { useFavorit } from "@/contexts/FavoritContext";

export { getStaticProps } from '@/pages/posts/index';

export default function HomePage({articles}) {

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [discount, setDiscount] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const [posQty, setPosQty] = useState(1);
  
  const router = useRouter()

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/discount');
        const data = await response.json();
        const limitedData = data.data.slice(0, 4); // Limit to 4 items
        setDiscount(limitedData);
      } catch (error) {
        console.error('Error fetching discount:', error);
      }
    };

    fetchDiscount();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/category');
      const data = await response.json();

      // Membersihkan data kategori dari simbol &amp;
      const cleanedCategories = data.data.map(category => ({
        ...category,
        namaKategoriBarang: category.namaKategoriBarang.replace(/&amp;/g, '&')
      }));

      setCategories(cleanedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

      fetchCategories();
    }, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/randomProduct');
        const randomProductsData = response.data.sort(() => Math.random() - 0.5).slice(0, 4);
        setRandomProducts(randomProductsData);
      } catch (error) {
        console.error("Error fetching random products:", error);
      }
    };

    fetchAllProducts();
  }, []);

  if (loading) {
    return <h1>Data is Loading !!! Please stand by</h1>;
  }

  const handleBuyNowClick = (posVarianId) => {
    router.push(`/catalog-product/${posVarianId}`);
  };

  const handleButtonCategories = async (categoriesFilter) => {
    router.push(`/catalog-product/categories/${categoriesFilter}`);
  };
  
  const { handleAddToCart } = useCart();
  const { handleAddToFavorit } = useFavorit();
  
  // const [successMessage, setSuccessMessage] = useState(null);

  // const showSuccessPopup = (message) => {
  //   setSuccessMessage(message); // Set pesan keberhasilan
  
  //   // Set timeout untuk menghilangkan popup setelah beberapa detik
  //   setTimeout(() => {
  //     setSuccessMessage(null); // Menghilangkan pesan keberhasilan setelah beberapa detik
  //   }, 3000); // Durasi popup dalam milidetik (misalnya, 3000 ms = 3 detik)
  // };

  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const fetchBestSeller = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/bestSeller');
        const data = await response.json();
        setBestSeller(data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchBestSeller();
  }, []);
  

  return (
    <>

      <BannerComponent/>

      <Merk/>

      <div className="homepage-layout">
          <div className="mobile-option">
            <div className="mobile-option-box">
              <img src="images/pulsa-data.png" />
              <h3>Pulsa & Data</h3>
            </div>
            <div className="mobile-option-box">
              <img src="images/topup.png" />
              <h3>Top up & Tagihan</h3>
            </div>
            <div className="mobile-option-box">
              <img src="images/artikel.png" />
              <h3>Artikel Hib!</h3>
            </div>
            <div className="mobile-option-box">
              <img src="images/terlaris.png" />
              <h3>Produk Terlaris</h3>
            </div>
          </div>
          <div className="list-category-mobile mtop-2">
            <div className="heading-small">
                <h1>Kategori untuk <span>beauty bestie</span></h1>
            </div>
            <div className="flex-category">
              <div className="flex-category-layout">
                {/* Render the first half of categories */}
                {categories.slice(0, Math.ceil(categories.length / 2)).map(category => (
                  <button className="flex-category-box" key={category.posKategoriBarangId} onClick={() => handleButtonCategories(category.posKategoriBarangId)}>
                    {category.namaKategoriBarang}
                  </button>
                ))}
              </div>
              <div className="flex-category-layout">
                {/* Render the second half of categories */}
                {categories.slice(Math.ceil(categories.length / 2)).map(category => (
                  <button className="flex-category-box" key={category.posKategoriBarangId} onClick={() => handleButtonCategories(category.posKategoriBarangId)}>
                    {category.namaKategoriBarang}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="section-first-home display-flex">
            <div className="topup">
            </div>
            <div className="voucher-home">
              <Image src={gratisOngkir} alt="Gratis Ongkir Hallo Beauty"/>
            </div>
          </div>
          <div className="display-flex mtop-1">
            <div className="banner-catalog-home">
              <Link href="#">
                <Image src={discountPromo} alt="Diskon Produk Hallo Beauty"/>
              </Link>
            </div>
            <div className="banner-catalog-mobile">
              <Link href="#">
                <Image src={discountPromoMobile} alt="Diskon Produk Hallo Beauty"/>
              </Link>
            </div>
            <div className="layout-catalog-home">
              <div className="list-product-home">
              {discount.map((product, index) => (
                <div className="box-product box-product-scroll" key={index}>
                  <div className="image-product">
                    <img src={`https://api.upos-conn.com/master/v1/${product.gambar}`} alt={product.namaVarian}/>
                  </div>
                  <h4 className="box-product-name">{product.namaVarian}</h4>
                  <div className="box-product-price">
                    <h4>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(product.hargaJual)}</h4>
                  </div>
                  <div className="box-product-btn">
                    <button onClick={() => handleBuyNowClick(product.posVarianId)}>Beli Sekarang</button>
                    <button onClick={() => handleAddToCart(product.posVarianId, posQty)} className="btn-home-cart"><div className="box-product-cart"><BsCartPlusFill /></div></button>
                  </div>
                  <div className="box-product-favorite">
                    <button onClick={() => handleAddToFavorit(product.posVarianId)}><IoMdHeartEmpty /> Masukkan ke favorit</button>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
          <div className="promo-banner-mobile">
            <div className="promo-banner-mobile-layout">
              <img src='images/gratis-ongkir.png' alt="Gratis Ongkir Hallo Beauty"/>
              <img src='images/bonus.png' alt="Bonus Hallo Beauty"/>
            </div>
          </div>
          <div className="display-flex mtop-1">
            <div className="banner-catalog-mobile">
              <Link href="#">
                <Image src={discountPromoMobile} alt="Diskon Produk Hallo Beauty"/>
              </Link>
            </div>
            <div className="layout-catalog-home">
              <div className="list-product-home">
              {randomProducts.map((product, index) => (
                <div className="box-product box-product-scroll" key={index}>
                  <div className="image-product">
                    <img src={`https://api.upos-conn.com/master/v1/${product.gambar}`} alt={product.namaVarian}/>
                  </div>
                  <h4 className="box-product-name">{product.namaVarian}</h4>
                  <div className="box-product-price">
                    <h4>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(product.hargaJual)}</h4>
                  </div>
                  <div className="box-product-btn">
                    <button onClick={() => handleBuyNowClick(product.posVarianId)}>Beli Sekarang</button>
                    <button onClick={() => handleAddToCart(product.posVarianId, posQty)} className="btn-home-cart"><div className="box-product-cart"><BsCartPlusFill /></div></button>
                  </div>
                  <div className="box-product-favorite">
                    <button onClick={() => handleAddToFavorit(product.posVarianId)}><IoMdHeartEmpty /> Masukkan ke favorit</button>
                  </div>
                </div>
              ))}
              </div>
            </div>
            <div className="banner-catalog-home">
              <Link href="#">
                <Image src={lihatDulu} alt="Diskon Produk Hallo Beauty"/>
              </Link>
            </div>
          </div>
          <div className="list-category mtop-2">
            <div className="heading-small">
                <h1>Kategori untuk <span>beauty bestie</span></h1>
            </div>
            <div className="flex-category">
              <div className="flex-category-layout">
                {/* Render the first half of categories */}
                {categories.slice(0, Math.ceil(categories.length / 2)).map(category => (
                  <button className="flex-category-box" key={category.posKategoriBarangId} onClick={() => handleButtonCategories(category.posKategoriBarangId)}>
                    {category.namaKategoriBarang}
                  </button>
                ))}
              </div>
              <div className="flex-category-layout">
                {/* Render the second half of categories */}
                {categories.slice(Math.ceil(categories.length / 2)).map(category => (
                  <button className="flex-category-box" key={category.posKategoriBarangId} onClick={() => handleButtonCategories(category.posKategoriBarangId)}>
                    {category.namaKategoriBarang}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="display-flex display-none-mobile mtop-1">
            <div className="voucher-home">
              <Image src={bonus} alt="Bonus Hallo Beauty"/>
            </div>
            <BestSeller/>
          </div>
          <div className="best-seller-mobile">
            <div className="heading-mobile">
              <h1>Best Seller Hib!</h1>
              <span>Lihat Semua</span>
            </div>
            <div className="best-seller-mobile-layout">
                <div className="best-seller-mobile-scroll">
                {bestSeller.map(product => (
                  <div className="best-seller-mobile-box" key={product.posVarianId} onClick={() => handleBuyNowClick(product.posVarianId)}>
                    <img src="images/bg-best-seller.png" className="heading-best-seller-img"/>
                    <div className="best-seller-img">
                      <img src={`https://api.upos-conn.com/master/v1/${product.gambar}`} alt={product.namaVarian}  />
                    </div>
                    <h3>{product.namaVarian}</h3>
                  </div>
                ))}
                </div>
            </div>
          </div>
          <Post articles={articles} limit={3} />
          <Keunggulan/>
      </div>
    </>
  );
}
