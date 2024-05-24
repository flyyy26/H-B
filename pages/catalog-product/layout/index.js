// catalog-product/layouts/LayoutFilter.js

import LayoutFilter from '@/components/catalog-product/layout';

const CatalogProductLayout = ({ children }) => {
  return (
    <div className='homepage-layout medium-container homepage-layout-mobile'>
        <LayoutFilter/>
        {children}
    </div>
  );
};

export default CatalogProductLayout;
