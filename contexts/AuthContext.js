// contexts/AuthContext.js

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import cookie from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const router = useRouter();

  useEffect(() => {
    // Load user from cookies on client-side
    const userCookie = cookie.get('user');
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data from cookie:', error);
      }
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    cookie.set('user', JSON.stringify(userData), { path: '/' });
  };

  const logout = async () => {
    setUser(null);
    cookie.remove('user', { path: '/' });

    await new Promise(resolve => setTimeout(resolve, 100));

    // window.location.href = '/';
    
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
