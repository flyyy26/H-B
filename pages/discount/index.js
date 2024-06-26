import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/contexts/CartContext';
import { useFavorit } from "@/contexts/FavoritContext";
import { BsCartPlusFill } from "react-icons/bs";
import { IoMdHeartEmpty } from "react-icons/io";

function Discount({ limit }) {
  const { handleAddToCart } = useCart();
  const { handleAddToFavorit } = useFavorit();
  const [posQty, setPosQty] = useState(1);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [discount, setDiscount] = useState([]);

  const router = useRouter()

  useEffect(() => { 
    const fetchDiscount = async () => {
      try {
        const response = await fetch(`${baseUrl}/discount`);
        const data = await response.json();
        setDiscount(data.data);
        console.log(data.data)
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchDiscount();
  }, []);

  const handleBuyNowClick = (posVarianId) => {
    router.push(`/catalog-product/produk-detail/${posVarianId}`);
  };

  return (
    <div className='homepage-layout medium-container'>
    <div className="heading-small">
        <h1> Hemat Lebih Banyak dengan <span>Diskon</span> Hebat!</h1>
    </div>
      <div className='catalog-layout mtop-2'>
        {discount.map(product => (
          <div key={product.posVarianId} className='box-product'>
            <div className='discount-label'>
              <span>{Math.round(product.persentase_potongan)}%</span>
            </div>
            {product.jumlahStok === "0" && (
                <div className='produk-habis'>
                  <div className='box-produk-habis'>
                    <span>Habis</span>
                  </div>
                </div>
              )}
            <div className="image-product">
                <img src={`https://api.upos-conn.com/master/v1/${product.gambar}`} onClick={() => handleBuyNowClick(product.posVarianId)} alt={product.namaVarian}/>
            </div>
            <h4 className="box-product-name" onClick={() => handleBuyNowClick(product.posVarianId)}>{product.namaVarian}</h4>
            <div className="box-product-price">
              {product.harga_promo > 0 ? (
                <>
                  <h4>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(product.harga_promo)}</h4>
                  <h5>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(product.hargaJual)}</h5>
                </>
              ) : (
                <h4>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(product.hargaJual)}</h4>
              )}
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

export default Discount;
