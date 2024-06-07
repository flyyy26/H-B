import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useCart } from '@/contexts/CartContext';
import { useFavorit } from "@/contexts/FavoritContext";
import { BsCartPlusFill } from "react-icons/bs";
import { IoMdHeartEmpty } from "react-icons/io";

function RandomProduct({ limit }) {
  const { handleAddToCart } = useCart();
  const { handleAddToFavorit } = useFavorit();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [randomProducts, setRandomProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posQty, setPosQty] = useState(1);

  const router = useRouter()

  useEffect(() => {
    const fetchRandomProducts = async () => {
      setLoading(true);
      try {
        const totalPages = 131; // Ganti dengan jumlah total halaman yang tersedia di API Anda
        const randomPage = Math.floor(Math.random() * totalPages) + 1; // Menghasilkan nomor halaman secara acak
    
        const response = await axios.get(`${baseUrl}/randomProduct?page=${randomPage}`);
        if (response.data && Array.isArray(response.data)) {
          // Filter produk sebelum di-random dan melakukan pembersihan nama varian
          const filteredProducts = response.data
            .map(product => ({
              ...product,
              namaVarian: product.namaVarian ? product.namaVarian.replace(/&amp;/g, '&') : product.namaVarian
            }))
            .sort(() => Math.random() - 0.5) // Mengacak urutan produk
            .slice(0, limit); // Slice array ke jumlah produk yang diinginkan
          
          setRandomProducts(filteredProducts);
        } else {
          setRandomProducts([]);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRandomProducts();
  }, [limit]);
  
   // Dependency array includes limit to re-fetch when it changes
  // Re-fetch data when limit changes

  if (loading) {
    return <div className='login-first-layout'>
    <img src="/images/tunggu-sebentar.png" alt='Loading' className='login-first'/>
  </div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleBuyNowClick = (posVarianId) => {
    router.push(`/catalog-product/produk-detail/${posVarianId}`);
  };

  const layoutClass = limit > 8 ? 'catalog-layout' : 'catalog-layout-four';

  return (
    <div className='random-products-container'>
      <h2 className='title-container'>Rekomendasi produk lainnya</h2>
      <div className={layoutClass}>
        {randomProducts.map(product => (
          <div key={product.posVarianId} className='box-product'>
            {product.jumlahStok === "0" && (
                <div className='produk-habis'>
                  <div className='box-produk-habis'>
                    <span>Habis</span>
                  </div>
                </div>
              )}
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
  );
}

export default RandomProduct;
