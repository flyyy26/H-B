import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const cookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('user='));
    if (cookie) {
      const userData = cookie.split('=')[1];
      try {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
      } catch (error) {
        console.error('Error parsing user data from cookie:', error);
      }
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    document.cookie = `user=${JSON.stringify(userData)}; path=/`;
  };

  const logout = async () => {
    setUser(null);
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    await new Promise(resolve => setTimeout(resolve, 100));

    router.push('/masuk');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
