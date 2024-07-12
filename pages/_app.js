// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import LoadingBar from "@/components/loading-bar";
// import Header from "@/components/Header";
// import Footer from "@/components/footer";
// import { AuthProvider } from "@/contexts/AuthContext";
// import { CartProvider } from '@/contexts/CartContext'; 
// import "@/styles/style.css";
// import { FavoritProvider } from '@/contexts/FavoritContext';
// import "slick-carousel/slick/slick.css"; 
// import "slick-carousel/slick/slick-theme.css";
// import PopupWelcome from '@/components/popup-welcome';

// function MyAppContent({ Component, pageProps }) {
//   const router = useRouter();
//   const [windowWidth, setWindowWidth] = useState(0);  // Default to 0
//   const [showPopup, setShowPopup] = useState(false);

//   useEffect(() => {
//     // This effect will run only on the client
//     const isFirstVisit = localStorage.getItem('isFirstVisit');
//     if (!isFirstVisit) {
//       setShowPopup(true);
//       localStorage.setItem('isFirstVisit', 'true');
//     }

//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     // Set initial window width
//     setWindowWidth(window.innerWidth);

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const handleClosePopup = () => {
//     setShowPopup(false);
//   };

//   const pathsToHideHeader = ['/cart', '/wishlist', '/catalog-product/produk-detail/[id]', '/transaksi', '/profil'];
//   const shouldHideHeader = pathsToHideHeader.some(path => router.pathname.startsWith(path)) && windowWidth <= 768;

//   return (
//     <>
//       <LoadingBar />
//       {!shouldHideHeader && <Header />}
//       {showPopup && <PopupWelcome onClose={handleClosePopup} />}
//       <>
//         <div className="maintenance-dekstop">
//           <img src="/images/maintenance-dekstop.png" alt="Maintenance H!b"/>
//         </div>
//         <div className="maintenance-mobile">
//           <img src="/images/maintenance-mobile.png" alt="Maintenance H!b"/>
//         </div>
//       </>
//       <Component {...pageProps} />
//       <Footer />
//     </>
//   );
// }

// export default function App({ Component, pageProps }) {
//   return (
//     <AuthProvider>
//       <CartProvider>
//         <FavoritProvider>
//           <MyAppContent Component={Component} pageProps={pageProps} />
//         </FavoritProvider>
//       </CartProvider>
//     </AuthProvider>
//   );
// }


import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import "@/styles/style.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function MyAppContent() {
  return (
    <>
      <div className="maintenance-dekstop">
        <img src="/images/maintenance-dekstop.png" alt="Maintenance H!b"/>
      </div>
      <div className="maintenance-mobile">
        <img src="/images/maintenance-mobile.png" alt="Maintenance H!b"/>
      </div>
    </>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <MyAppContent />
  );
}
