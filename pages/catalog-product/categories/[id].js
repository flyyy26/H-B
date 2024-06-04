import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import CatalogProductLayout from '../layout';
import { useCart } from '@/contexts/CartContext';
import { useFavorit } from "@/contexts/FavoritContext";
import { BsCartPlusFill } from "react-icons/bs";
import { IoMdHeartEmpty } from "react-icons/io";

const CategoryFilter = () => {
  const { handleAddToCart } = useCart();
  const { handleAddToFavorit } = useFavorit();

  const router = useRouter();
  const { id } = router.query;
  const [category, setCategory] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [posQty, setPosQty] = useState(1);

  useEffect(() => {
    if (id) {
      const cleanId = id.replace(/&amp;/g, '&'); // Replace all &amp; with &
      console.log(`Fetching category data for ID: ${cleanId}`);
  
      const fetchCategory = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`http://103.153.43.25/api/categories/${cleanId}`);
          
          if (response.data && response.data.data && Array.isArray(response.data.data)) {
            // Assuming each item in the array has a `namaVarian` field that needs cleaning
            const cleanedData = response.data.data.map(item => ({
              ...item,
              namaVarian: item.namaVarian.replace(/&amp;/g, '&')
            }));
            setCategory(cleanedData);
          } else {
            setCategory(response.data.data); // If the data is not an array or does not need cleaning
          }
  
          setPagination(response.data.pagination); // Save pagination information
          console.log('Data loaded successfully:', response.data);
        } catch (error) {
          console.error('Error fetching category:', error);
          console.log(`Failed to fetch data for ID: ${cleanId}`, error);
        }
        setIsLoading(false);
      };
  
      fetchCategory();
    }
  }, [id]);
  


  const handleBuyNowClick = (productId) => {
    router.push(`/catalog-product/${productId}`); 
  };

  const handlePaginationClick = async (url) => {
    try {
      const response = await axios.get(`http://103.153.43.25/api/proxy?url=${url}`);
      setCategory(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching category with pagination:', error);
    }
  };

  const renderPaginationLinks = () => {
    const maxButtonsToShow = 5; // Jumlah maksimum tombol yang akan ditampilkan
    const activeIndex = pagination.links.findIndex(link => link.is_current);
    const start = Math.max(0, activeIndex - Math.floor(maxButtonsToShow / 2));
    const end = Math.min(pagination.links.length, start + maxButtonsToShow);
  
    return pagination.links.slice(start, end).map((link, index) => (
      <button
        key={index}
        onClick={() => handlePaginationClick(link.url)}
        disabled={link.is_current}
        className={link.is_current ? "active" : ""}
      >
        {link.label}
      </button>
    ));
  };
  

  return (
    <CatalogProductLayout>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className='catalog-layout'>
            {category.map((product, index) => ( 
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
          {pagination && (
            <div className="pagination">
              {renderPaginationLinks()}
            </div>
          )}
        </>
      )}
    </CatalogProductLayout>
  );
};

export default CategoryFilter;
