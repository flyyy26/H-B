import { useRouter } from 'next/router';
import axios from 'axios';
import { useState, useEffect } from 'react';
import CatalogProductLayout from '../layout';
import { useCart } from '@/contexts/CartContext';
import { useFavorit } from "@/contexts/FavoritContext";
import { BsCartPlusFill } from "react-icons/bs";
import { IoMdHeartEmpty } from "react-icons/io";

const ProductFilterPage = () => {
  const { handleAddToCart } = useCart();
  const { handleAddToFavorit } = useFavorit();

  const router = useRouter();
  const { productFilter } = router.query;
  const [products, setProducts] = useState([]);
  const [posQty, setPosQty] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/filter/${id}`);
      console.log('Data from API:', response.data);
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        const cleanedProducts = response.data.data.map(product => {
          return {
            ...product,
            namaVarian: product.namaVarian.replace(/&amp;/g, '&') // Assuming the product names are stored under `productName`
          };
        });
        setProducts(cleanedProducts);
      } else {
        setProducts([]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      setIsLoading(false);
    }
  };

  
  useEffect(() => {
    if (productFilter) {
      fetchProducts(productFilter);
    }
  }, [productFilter]);

  const handleBuyNowClick = (productId) => {
    router.push(`/catalog-product/${productId}`);
  };

  return (
    <CatalogProductLayout>
      <div className='catalog-layout'>
        {products.map((product, index) => (
            <div className="box-product" key={index}>
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
                    <h4>Rp.  {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(product.hargaJual)}</h4>
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
      </CatalogProductLayout>
  );
};

export default ProductFilterPage;
