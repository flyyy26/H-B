import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CatalogProductLayout from '../layout';
import { useCart } from '@/contexts/CartContext';
import { useFavorit } from "@/contexts/FavoritContext";
import { BsCartPlusFill } from "react-icons/bs";
import { IoMdHeartEmpty } from "react-icons/io";

const ProductSearch = () => {
  const { handleAddToCart } = useCart();
  const { handleAddToFavorit } = useFavorit();

  const router = useRouter();
  const { productSearch } = router.query;
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [posQty, setPosQty] = useState(1);

  useEffect(() => {
    if (productSearch) {
      setIsLoading(true);
      fetch(`http://localhost:3000/api/search?searchQuery=${encodeURIComponent(productSearch)}`)
        .then(response => response.json())
        .then(data => {
          if (data.data && Array.isArray(data.data)) {
            // Map through the array and replace &amp; with & in namaVarian
            const cleanedData = data.data.map(product => ({
              ...product,
              namaVarian: product.namaVarian ? product.namaVarian.replace(/&amp;/g, '&') : product.namaVarian
            }));
            setProducts(cleanedData);
          } else {
            setProducts([]); // Ensure that you're setting an array
          }
          setIsLoading(false);
          console.log(data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setIsLoading(false);
        });
    }
  }, [productSearch]);
  

  const handleBuyNowClick = (posVarianId) => {
    router.push(`/catalog-product/${posVarianId}`);
  };

  return (
    <CatalogProductLayout>
      <h1 className='search-heading'>Hasil pencarian dari : <span>{productSearch}</span></h1>
      {isLoading ? (
        <p>Tunggu Sebentar...</p>
      ) : products.length === 0 ? (
        <img className='kosong' src='/images/produk-kosong.png'/>
      ) : (
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
                <img src={`https://api.upos-conn.com/master/v1/${product.gambar}`} alt={product.namaVarian} />
              </div>
              <h4 className="box-product-name">{product.namaVarian}</h4>
              <div className="box-product-price">
                <h4>Rp. {new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(product.hargaJual)}</h4>
              </div>
              <div className="box-product-btn">
                <button onClick={() => handleBuyNowClick(product.posVarianId)}>Beli Sekarang</button>
                <button onClick={() => handleAddToCart(product.posVarianId, posQty)} className="btn-home-cart">
                  <div className="box-product-cart"><BsCartPlusFill /></div>
                </button>
              </div>
              <div className="box-product-favorite">
                <button onClick={() => handleAddToFavorit(product.posVarianId)}>
                  <IoMdHeartEmpty /> Masukkan ke favorit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </CatalogProductLayout>
  );
};

export default ProductSearch;
