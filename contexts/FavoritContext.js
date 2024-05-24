// contexts/FavoritContext.js

import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import Modal from '@/components/modal'; // Sesuaikan dengan lokasi file
import { BsBagHeartFill } from "react-icons/bs";
import LoginForm from '@/components/login-form';

const FavoritContext = createContext();

export const FavoritProvider = ({ children }) => {
  const { user } = useAuth();
  const [modalIsOpenFavorit, setModalIsOpenFavorit] = useState(false);
  const [modalMessageFavorit, setModalMessageFavorit] = useState('');
  const [showLogin, setShowLogin] = useState(false);


  const openLogin = () => {
    setShowLogin(true);
  };

  const closeLogin = () => {
    setShowLogin(false);
  };

  const handleAddToFavorit = async (posVarianId) => {
    try {
      if (!user || !user.posLoginId) {
        openLogin();
        // Tambahkan logika untuk menangani jika pengguna tidak login
        return;
      }

      const response = await axios.post('http://localhost:4000/api/addToFavorit', { 
        posUser_id: user.posLoginId,
        posVarian_id: posVarianId
      });

      if (response.status === 200) {
        showModal(response.data.messages.success);
        console.log(response.data)
      }

    } catch (error) {
      console.error('Error adding item to favorit:', error);
      // Tambahkan logika untuk menangani kesalahan jika diperlukan
    }
  };

  function showModal(message) {
    setModalMessageFavorit(message);
    setModalIsOpenFavorit(true);

    // Set timeout to close the modal after 3 seconds
    setTimeout(() => {
      closeModal();
    }, 680);
  }

  function closeModal() {
    setModalIsOpenFavorit(false);
  }

  return (
    <FavoritContext.Provider value={{ handleAddToFavorit }}>
      {children}
      <Modal isOpen={modalIsOpenFavorit} onClose={closeModal}>
        <BsBagHeartFill className='check-cart'/>
        <p className='check-notif-cart'>{modalMessageFavorit}</p>
      </Modal>
      {showLogin && <LoginForm onClose={closeLogin} />}
    </FavoritContext.Provider>
  );
};

export const useFavorit = () => useContext(FavoritContext);
