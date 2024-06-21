import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import cookie from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [showAdminPopup, setShowAdminPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Load user from cookies on client-side
    const userCookie = cookie.get('user');
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        setUser(userData);

        // Check user role and show popup if role is not "60"
        if (userData.role !== "60") {
          setErrorMessage('Kamu adalah admin, tidak bisa masuk, tolong akses dengan email lain');
          setShowAdminPopup(true);

          // Automatically logout after 3 seconds
          setTimeout(async () => {
            setShowAdminPopup(false);
            await logout(); // Call logout function to clear user session
          }, 3000);
        }

      } catch (error) {
        console.error('Error parsing user data from cookie:', error);
      }
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    cookie.set('user', JSON.stringify(userData), { path: '/', expires: 1 }); // Set expires to 1 day for example

    // Check user role and show popup if role is not "60"
    if (userData.role !== "60") {
      setErrorMessage('Kamu adalah admin, tidak bisa masuk, tolong akses dengan email lain');
      setShowAdminPopup(true);

      // Automatically logout after 3 seconds
      setTimeout(async () => {
        setShowAdminPopup(false);
        await logout(); // Call logout function to clear user session
      }, 3000);
    }
  };

  const logout = async () => {
    setUser(null);
    cookie.remove('user', { path: '/' });

    await new Promise(resolve => setTimeout(resolve, 100));
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
      {showAdminPopup && (
        <div className="admin-popup">
          <p>{errorMessage}</p>
        </div>
      )}
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
