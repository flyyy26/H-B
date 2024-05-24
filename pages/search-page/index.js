// pages/SearchResultsPage.js

import React, { useState, useEffect } from 'react';
import SearchResults from '@/components/search-result';
import RandomProducts from '@/components/random-product';

const SearchResultsPage = () => {

  return (
    <div className='container-small'>
      <SearchResults products={SearchResults} />
      <RandomProducts numberOfProducts={8} />
    </div>
  );
};

export default SearchResultsPage;
