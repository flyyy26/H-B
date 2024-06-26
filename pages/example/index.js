import { useState, useEffect } from 'react';
import { IoChevronDown } from "react-icons/io5";
import { useRouter } from 'next/router';

const Dropdown = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${baseUrl}/category`);
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
      const response = await fetch(`${baseUrl}/example/${categoryId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const brandsData = await response.json();
      console.log('Received brands:', brandsData);

      setBrands(brandsData);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setBrands([]);
    }
  };

  const handleCategoryClick = (categoryId, categoryName) => {
    setSelectedCategory(categoryName);
    fetchBrands(categoryId);
    setShowCategoryDropdown(false);
    setShowBrandDropdown(true);
  };

  const handleBrandClick = async (id) => {
    router.push(`/catalog-product/filter/${id}`);
    setShowBrandDropdown(false); // Menutup dropdown merek setelah memilih merek
    const brandName = brands.find(brand => brand.posProdukId === id)?.namaProduk || '';
    setSelectedBrand(brandName);
  };

  return (
    <div>
      <div className="dropdown">
        <button className="dropbtn" onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}>
          {selectedCategory ? selectedCategory : 'Pilih Kategori'}
          <IoChevronDown />
        </button>
        {showCategoryDropdown && (
          <div className="dropdown-content">
            {categories.map(category => (
              <button key={category.posKategoriBarangId} onClick={() => handleCategoryClick(category.posKategoriBarangId, category.namaKategoriBarang)}>
                {category.namaKategoriBarang}
              </button>
            ))}
          </div>
        )}
      </div>

      {brands.length > 0 && (
        <div className="dropdown">
          <button className="dropbtn" onClick={() => setShowBrandDropdown(!showBrandDropdown)}>
            {selectedBrand ? selectedBrand : 'Pilih Merek'}
            <IoChevronDown />
          </button>
          {showBrandDropdown && (
            <div className="dropdown-content">
              {brands.map(brand => (
                <button key={brand.posProdukId} onClick={() => handleBrandClick(brand.posProdukId)}>
                  {brand.namaProduk}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedBrand && <p>Merek yang dipilih: {selectedBrand}</p>}
    </div>
  );
};

export default Dropdown;
