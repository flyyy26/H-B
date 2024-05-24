import { useState, useEffect, useRef } from 'react';
import { IoChevronDown } from "react-icons/io5";
import { useRouter } from 'next/router';

const LayoutFilter = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState('');
  const categoryDropdownRef = useRef(null);
  const brandDropdownRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/category');
        const data = await response.json();

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

  const fetchBrands = async (categoryId) => {
    try {
      const response = await fetch(`/api/example/${categoryId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let brandsData = await response.json();
      brandsData = brandsData.map(brand => ({
        ...brand,
        namaProduk: brand.namaProduk.replace(/&amp;/g, '&')
      }));

      setBrands(brandsData);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setBrands([]);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        categoryDropdownRef.current.classList.remove('active');
      }
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target)) {
        brandDropdownRef.current.classList.remove('active-brand');
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleResetFilter = () => {
    router.push(`/catalog-product`);
  };

  const handleCategoryClick = (categoryId, categoryName) => {
    setSelectedCategory(categoryName);
    fetchBrands(categoryId);
    if (categoryDropdownRef.current) {
      categoryDropdownRef.current.classList.remove('active');
    }
    if (brandDropdownRef.current) {
      brandDropdownRef.current.classList.add('active-brand');
    }
  };

  const handleBrandClick = async (id) => {
    router.push(`/catalog-product/filter/${id}`);
    if (brandDropdownRef.current) {
      brandDropdownRef.current.classList.remove('active-brand');
    }
    const selectedBrandName = brands.find(brand => brand.posProdukId === id)?.namaProduk.replace(/&amp;/g, '&') || '';
    setSelectedBrand(selectedBrandName);
  };

  const toggleCategoryDropdown = () => {
    if (categoryDropdownRef.current) {
      categoryDropdownRef.current.classList.toggle('active');
    }
  };

  const toggleBrandDropdown = () => {
    if (brandDropdownRef.current) {
      brandDropdownRef.current.classList.toggle('active-brand');
    }
  };

  return (
    <div className='filter-container'>
      <div className='filter-layout'>
        <div className="filter-layout-box">
          <button onClick={toggleCategoryDropdown} className="btn-filter">
            {selectedCategory ? selectedCategory : 'Pilih Kategori'}
            <IoChevronDown />
          </button>
          <div ref={categoryDropdownRef} className={`filter-dropdown ${categories.length > 5 ? 'div-scrollable' : ''}`}>
            {categories.map(category => (
              <button key={category.posKategoriBarangId} onClick={() => handleCategoryClick(category.posKategoriBarangId, category.namaKategoriBarang)}>
                {category.namaKategoriBarang}
              </button>
            ))}
          </div>
        </div>

        {brands.length > 0 && (
        <div className="filter-layout-box">
          <button onClick={toggleBrandDropdown} className='btn-filter'>
            {selectedBrand ? selectedBrand : 'Pilih Merek'}
            <IoChevronDown />
          </button>
          <div ref={brandDropdownRef} className={`filter-dropdown ${brands.filter(brand => brand.namaKategoriBarang === selectedCategory).length > 5 ? 'div-scrollable' : ''}`}>
            {brands.map(brand => (
              <button key={brand.posProdukId} onClick={() => handleBrandClick(brand.posProdukId)}>
                {brand.namaProduk}
              </button>
            ))}
          </div>
        </div>
        )}

        <button onClick={() => handleResetFilter()} className='btn-filter'>Hapus Filter</button>
      </div>
    </div>
  );
};

export default LayoutFilter;
