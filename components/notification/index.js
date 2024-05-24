// components/NotificationPopup.js

import React, { useEffect } from 'react';

const NotificationPopup = ({ message, onClose }) => {
  // Sembunyikan popup setelah beberapa detik
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, 3000); // Sembunyikan setelah 3 detik

    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className="notification-popup">
      <p>{message}</p>
    </div>
  );
};

export default NotificationPopup;
