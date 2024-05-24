import React, { useState } from 'react';

const AddressInput = ({ onSearch }) => {
  const [address, setAddress] = useState('');

  const handleChange = (event) => {
    setAddress(event.target.value);
  };

  const handleSearch = () => {
    onSearch(address);
  };

  return (
    <div>
      <input type="text" value={address} onChange={handleChange} />
      <button onClick={handleSearch}>Cari</button>
    </div>
  );
};

export default AddressInput;
