// contexts/CartContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@/components/modal'; // Pastikan pathnya benar
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/login-form';
import { BsBagCheckFill } from 'react-icons/bs';


const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


  const openLogin = () => {
    setShowLogin(true);
  };

  const closeLogin = () => {
    setShowLogin(false);
  };

  const handleAddToCart = async (posVarianId, quantity) => {
    if (!user || !user.userId) {
      openLogin();
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/addToCart`, {
        posUser_id: user.userId,
        posVarian_id: posVarianId,
        posQty: quantity 
      });

      if (response.status === 200) {
        showModal(response.data.messages.success);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      showModal('Failed to add item to cart.');
    }
  };

  function showModal(message) {
    setModalMessage(message);
    setModalIsOpen(true);

    // Set timeout to close the modal after 3 seconds
    setTimeout(() => {
      closeModal();
    }, 680);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  return (
    <CartContext.Provider value={{ handleAddToCart }}>
      {children}
      <Modal isOpen={modalIsOpen} onClose={closeModal}>
        <BsBagCheckFill className="check-cart" />
        <p className="check-notif-cart">{modalMessage}</p>
      </Modal>
      {showLogin && <LoginForm onClose={closeLogin} />}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
