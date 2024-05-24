import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoadingBar from "@/components/loading-bar";
import Header from "@/components/Header";
import Footer from "@/components/footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from '@/contexts/CartContext'; 
import "@/styles/style.css";
import { FavoritProvider } from '@/contexts/FavoritContext';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import PopupWelcome from '@/components/popup-welcome';

function MyAppContent({ Component, pageProps }) {
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const isFirstVisit = localStorage.getItem('isFirstVisit');
    if (!isFirstVisit) {
      setShowPopup(true);
      localStorage.setItem('isFirstVisit', 'true');
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pathsToHideHeader = ['/keranjang', '/favorit', '/catalog-product/[id]', '/transaksi', '/profile'];
  const shouldHideHeader = pathsToHideHeader.some(path => router.pathname.startsWith(path)) && windowWidth <= 768;

  return (
    <>
      <LoadingBar />
      {!shouldHideHeader && <Header />}
      {showPopup && <PopupWelcome onClose={handleClosePopup} />}
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default function App({ Component, pageProps }) {
  return (
    
    <AuthProvider>
      <CartProvider>
        <FavoritProvider>
          <MyAppContent Component={Component} pageProps={pageProps} />
        </FavoritProvider>
      </CartProvider>
    </AuthProvider>
  );
}
