// pages/SearchResultsPage.js

import React, { useState, useEffect } from 'react';
import RandomProducts from '@/components/random-product';

const SearchResultsPage = () => {

  return (
    <div className='container-small'>
      <RandomProducts numberOfProducts={8} />
    </div>
  );
};

export default SearchResultsPage;
