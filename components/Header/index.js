import Link from "next/link";
import { IoMail } from "react-icons/io5";
import { FaWhatsappSquare, FaMapMarkerAlt } from "react-icons/fa";
import { TbDiscount2 } from "react-icons/tb";
import { RiHeartsFill } from "react-icons/ri";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { useRouter } from "next/router";
import SearchBar from "../search-bar";
import { useState, useEffect } from "react";
import axios from "axios";
import LoginForm from "../login-form";
import RegisterForm from "../register-form";
import { useAuth } from '@/contexts/AuthContext';
import { IoMenuOutline } from "react-icons/io5";
import { GoHome } from "react-icons/go";
import { PiBasketLight } from "react-icons/pi";
import { CiDiscount1 } from "react-icons/ci";
import { PiClipboardTextLight } from "react-icons/pi";
import { PiUserCircleLight } from "react-icons/pi";
import { PiPercent } from "react-icons/pi";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { PiClipboardTextFill } from "react-icons/pi";
import { FaShoppingBasket } from "react-icons/fa";
import { PiPercentFill } from "react-icons/pi";
import { BsFillFileEarmarkTextFill } from "react-icons/bs";
import { GoChevronRight } from "react-icons/go";
import { FaInstagram, FaWhatsapp, FaFacebook, FaTiktok } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";


export default function Header(){
    const { user } = useAuth();

    const router = useRouter();
    const [imageUrl, setImageUrl] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const response = await axios.get('/api/logo');
                const logoPath = response.data.data.image;
                setImageUrl(`https://prahwa.net/storage/${logoPath}`); 
            } catch (error) {
                console.error('Error fetching logo:', error);
            }
        };
        fetchLogo();
    }, []);

    const openLogin = () => {
        setShowLogin(true);
    };

    const closeLogin = () => {
        setShowLogin(false);
    };

    const openRegister = () => {
        setShowRegister(true);
    };

    const closeRegister = () => {
        setShowRegister(false);
    };

    const handleToProfile = () => {
        router.push(`/profile/`);
    };

    const logoClick = () => {
    router.push(`/`);
    };

    const goToCartPage = () => {
    // Pastikan pengguna telah login dan memiliki ID yang valid
    if (user && user.posLoginId) {
        const userId = user.posLoginId; // Gunakan ID pengguna dari data pengguna yang telah diperoleh
        const cartStatus = 1; // Ganti dengan status keranjang yang sesuai
        router.push(`/keranjang/${userId}/${cartStatus}`);
    } else {
        openLogin(); // Log pesan kesalahan jika ID pengguna tidak tersedia
    }
    };

    const goToFavoritPage = () => {
        // Pastikan pengguna telah login dan memiliki ID yang valid
        if (user && user.posLoginId) {
            const userId = user.posLoginId; // Gunakan ID pengguna dari data pengguna yang telah diperoleh
            const cartStatus = 2; // Ganti dengan status keranjang yang sesuai
            router.push(`/favorit/${userId}/${cartStatus}`);
        } else {
            openLogin();// Log pesan kesalahan jika ID pengguna tidak tersedia
        }
    };

    const [count, setCount] = useState(0);
    const [countFavorit, setCountFavorit] = useState(0);

    useEffect(() => {
        if (user && user.posLoginId) {
            const fetchDataCartTotal = async () => {
                try {
                    const userId = user.posLoginId;
                    const cartStatus = 1;

                    const response = await axios.get(`/api/cartTotal/${userId}/${cartStatus}`);
                    const data = response.data;

                    if (data && data.data && data.data.count) {
                        setCount(data.data.count);
                    }
                } catch (error) {
                    console.error('Error fetching cart total:', error);
                }
            };

            fetchDataCartTotal(); // Panggil langsung saat komponen pertama kali dimuat
            const interval = setInterval(fetchDataCartTotal, 1000); // Perbarui setiap 3 detik
            return () => clearInterval(interval); // Bersihkan interval saat komponen dibongkar
        }
    }, [user]);

    useEffect(() => {
        if (user && user.posLoginId) {
            const fetchDataFavoritTotal = async () => {
                try {
                    const userId = user.posLoginId;
                    const cartStatus = 2;

                    const response = await axios.get(`/api/cartTotal/${userId}/${cartStatus}`);
                    const data = response.data;

                    if (data && data.data && data.data.count) {
                        setCountFavorit(data.data.count);
                    }
                } catch (error) {
                    console.error('Error fetching cart total:', error);
                }
            };

            fetchDataFavoritTotal(); // Panggil langsung saat komponen pertama kali dimuat
            const interval = setInterval(fetchDataFavoritTotal, 3000); // Perbarui setiap 3 detik
            return () => clearInterval(interval); // Bersihkan interval saat komponen dibongkar
        }
    }, [user]);

    const [isActive, setIsActive] = useState(false);

    const toggleMenuMobile = () => {
    setIsActive(!isActive);
    };

    // const handleClickLogin = () => {
    //     openLogin();
    //     toggleMenuMobile();
    //   };

      const handleClickFavorit = () => {
        goToFavoritPage();
        toggleMenuMobile();
      };

    return(
        <>
            <div className="top-header">
                <div className="icon-header">
                    <Link href="mailto:hallobeautyy@gmail.com">
                        <div className="icon-header-box">
                            <IoMail className="icon-social-media"/>
                            <span>HIBI@gmail.com</span>
                        </div>
                    </Link>
                    <Link href="mailto:hallobeautyy@gmail.com">
                        <div className="icon-header-box">
                            <FaWhatsappSquare className="icon-social-media"/>
                            <span>+62 812 2387 4300</span>
                        </div>
                    </Link>
                    <Link href="mailto:hallobeautyy@gmail.com">
                        <div className="icon-header-box">
                            <FaMapMarkerAlt className="icon-social-media"/>
                            <span>Temukan H!BI</span>
                        </div>
                    </Link>
                </div>
                <div className="btn-signup-signin">
                    {user ? (
                        <div className="user-header" onClick={() => handleToProfile()}>
                            <button>H!, {user.nama}</button>
                            <div className="profile-image">
                                <img src={`https://api.upos-conn.com/master/v1/${user.image}`} alt={user.nama}/>
                            </div>
                            
                        </div>
                    ) : (
                        <>
                            <button onClick={openLogin}>Masuk</button>
                            <div className="divider"></div>
                            <button onClick={openRegister}>Daftar</button>
                        </>
                    )}
                </div>
            </div>
            <div className="nav-menu">
                <div className="logo" onClick={() => logoClick()}>
                    <img src={imageUrl} alt='Logo H!bi'/>  
                </div>
                <SearchBar/>
                <div className="nav-menu-layout">
                    <ul>
                        <li>
                            <Link href="/">
                                <span className={router.pathname === "/" ? "active" : ""}>Beranda</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/catalog-product">
                                <span className={router.pathname === "/catalog-product" ? "active" : ""}>Katalog</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/catalog-product/search/face">
                                <span className={router.pathname === "/face-care" ? "active" : ""}>Face Care</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/catalog-product/search/skin">
                                <span className={router.pathname === "/skin-care" ? "active" : ""}>Skin Care</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/catalog-product/search/body">
                                <span className={router.pathname === "/body-care" ? "active" : ""}>Body Care</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <Link href="/discount" className="link-discount">
                    <button className="discount-btn">Discount <TbDiscount2 /></button>
                </Link>

                <div className="cart-wishlist">
                    <div className="cart-wishlist-box" onClick={goToFavoritPage}>
                        <div className="amount">
                            {countFavorit !== null && (
                                <span>{countFavorit}</span>
                            )}
                        </div>
                        <RiHeartsFill />
                    </div>
                    <div onClick={goToCartPage} className="cart-wishlist-box">
                        <div className="amount">
                            {count !== null && (
                                <span>{count}</span>
                            )}
                        </div>
                        <PiShoppingCartSimpleFill />
                    </div>
                </div>
                <button className="hamburger-menu" onClick={toggleMenuMobile}><IoMenuOutline/></button>
            </div>

            <div className="menu-mobile">
                <div className="menu-mobile-layout">
                    <ul>
                        <li>
                            <Link href="/">
                                <span className={router.pathname === "/" ? "active" : ""}><GoHome/>Beranda</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/catalog-product">
                                <span className={router.pathname === "/catalog-product" ? "active" : ""}><PiBasketLight />Katalog</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/discount">
                                <span className={router.pathname === "/discount" ? "active" : ""}><PiPercent />Promo</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/pesanan">
                                <span className={router.pathname === "/pesanan" ? "active" : ""}><PiClipboardTextLight />Pesanan</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/profil">
                                <span className={router.pathname === "/profil" ? "active" : ""}><PiUserCircleLight />Profil</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className={`popup-menu ${isActive ? 'active' : ''}`}>
                <div className="popup-menu-content">
                    <div className="menu-popup-mobile">
                        <span className="close"><HiOutlineArrowLeft onClick={toggleMenuMobile} /> Menu Utama</span>
                    </div>
                    {user ? (
                        <div className="user-header-mobile" onClick={() => handleToProfile()}>
                            <div className="profile-user-layouting">
                                <div className="profile-image-mobile">
                                    <img src={`https://api.upos-conn.com/master/v1/${user.image}`} alt={user.nama}/>
                                </div>
                                <div className="user-mobile-layout">
                                    <span>H!, {user.nama}</span>
                                    <p>{user.email}</p>
                                </div>
                            </div>
                            <div className="profil-edit-mobile">
                                <Link href='/profile' onClick={toggleMenuMobile}><FaRegEdit /></Link>
                            </div>
                        </div> 
                    ) : (
                        <div className="login-signup-mobile">
                            <button onClick={openLogin}>Masuk</button>
                            <button onClick={openRegister}>Daftar</button>
                        </div>
                    )}
                    <div className="list-menu-popup-mobile">
                        <h3>Aktivitas <span>Beauty Bestie</span></h3>
                        <ul>
                            <Link href='#' onClick={handleClickFavorit} className="menu-popup-mobile-item-link"><li><div className="menu-popup-mobile-item"><RiHeartsFill /> Lihat Favorit</div><GoChevronRight /></li></Link>
                            <Link href='#' className="menu-popup-mobile-item-link"><li><div className="menu-popup-mobile-item"><PiClipboardTextFill /> Pesanan Kamu</div><GoChevronRight /></li></Link>
                            <Link href='/catalog-product' onClick={toggleMenuMobile} className="menu-popup-mobile-item-link"><li><div className="menu-popup-mobile-item"><FaShoppingBasket/>Katalog Produk</div><GoChevronRight /></li></Link>
                            <Link href='/discount' onClick={toggleMenuMobile} className="menu-popup-mobile-item-link"><li><div className="menu-popup-mobile-item"><PiPercentFill /> Produk Promo</div><GoChevronRight /></li></Link>
                            <Link href='/posts' onClick={toggleMenuMobile} className="menu-popup-mobile-item-link"><li><div className="menu-popup-mobile-item"><BsFillFileEarmarkTextFill /> Artikel Hib!</div><GoChevronRight /></li></Link>
                        </ul>
                    </div>
                    <div className="identity-mobile">
                        <h3>Temukan <span>Hib!</span> disini</h3>
                        <div className="social-media-mobile">
                            <Link href='#'>
                                <div className="social-media-mobile-box">
                                    <FaInstagram/>
                                </div>
                            </Link>
                            <Link href='#'>
                                <div className="social-media-mobile-box">
                                    <FaFacebook/>
                                </div>
                            </Link>
                            <Link href='#'>
                                <div className="social-media-mobile-box">
                                    <FaTiktok/>
                                </div>
                            </Link>
                            <Link href='#'>
                                <div className="social-media-mobile-box">
                                    <FaWhatsapp/>
                                </div>
                            </Link>
                        </div>
                        <p>Singaparna, Cipakat, Kec. Singaparna, Kabupaten Tasikmalaya, Jawa Barat 46417</p>
                        <p>Email: hib!@gmail.com</p>
                    </div>
                </div>
            </div>

            {showLogin && <LoginForm onClose={closeLogin} />}
            {showRegister && <RegisterForm onClose={closeRegister} />}
        </>
    );
}