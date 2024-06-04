import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { BsCartPlusFill } from "react-icons/bs";
import { IoMdHeartEmpty } from "react-icons/io";
import CatalogProductLayout from './layout/index';
import { useCart } from '@/contexts/CartContext';
import { useFavorit } from "@/contexts/FavoritContext";

const BrandsCatalog = ({ isLoading }) => {
  const { handleAddToCart } = useCart();
  const { handleAddToFavorit } = useFavorit();
  
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [posQty, setPosQty] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch(`http://103.153.43.25/api/AllProduct?page=${currentPage}`);
        const data = await response.json();
  
        // Check if data exists and has items
        if (data && data.data && data.data.length > 0) {
          // Map through each product and clean the namaVarian field
          const cleanedProducts = data.data.map(product => {
            if (product.namaVarian) {
              return {
                ...product,
                namaVarian: product.namaVarian.replace(/&amp;/g, '&')
              };
            }
            return product;
          });
  
          setAllProducts(cleanedProducts);
        } else {
          setAllProducts([]);
        }
        
        setTotalPages(data.pagination.total_pages);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    fetchAllProducts();
  }, [currentPage]); // Depend on currentPage to refetch when it changes
  

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleBuyNowClick = (posVarianId) => {
    router.push(`/catalog-product/${posVarianId}`);
  };

  function paginate(totalPages, currentPage, pageNeighbours = 2) {
    const totalNumbers = (pageNeighbours * 2) + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - pageNeighbours);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
      let pages = [1];

      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }
      
      pages.push(totalPages);

      return pages;
    }

    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const renderPagination = () => {
    const pageNeighbours = 2; // Jumlah halaman sebelum dan sesudah halaman aktif
    const pages = paginate(totalPages, currentPage, pageNeighbours);

    return (
      <div className="pagination">
        <button onClick={handlePrevious} disabled={currentPage === 1}>
          <IoChevronBack />
        </button>
        {pages.map(pageNumber => (
          <button
            key={pageNumber}
            className={currentPage === pageNumber ? 'active' : ''}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
        <button onClick={handleNext} disabled={currentPage === totalPages}>
          <IoChevronForward />
        </button>
      </div>
    );
  };

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    
<CatalogProductLayout>
      <div className='catalog-layout'>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          allProducts.map((product) => (
            <div className="box-product" key={product.posVarianId}>
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
          ))
        )}
      </div>

      {renderPagination()}
      </CatalogProductLayout>
  );
};

export default BrandsCatalog;
