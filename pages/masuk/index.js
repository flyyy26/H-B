// components/LoginForm.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/utils/firebaseConfig';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { BsArrowLeft } from 'react-icons/bs';
import { IoClose } from "react-icons/io5";
import { IoLogoGoogle } from "react-icons/io";
import axios from 'axios';

const LoginForm = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    posEmail: '',
    posPassword: '',
    posPin: '0000',
    rememberMe: false
  });

  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // State untuk menampilkan popup
  const [loading, setLoading] = useState(false); // State untuk menunjukkan loading
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleChangeLogin = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmitLogin = async (e) => {
    setLoading(true); 

    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/login`, formData);
      const data = response.data;

      if (data.status === 200) {
        login(data.data);
        setMessage(data.messages.success);
        setAlertType('success');
        setShowPopup(true);
        setTimeout(() => {
          router.push('/');
        }, 2500);
      } else if (data.status === 400 && data.messages.success === "Password Salah.") {
        setMessage(data.messages.success);
        setAlertType('errorPassword');
        setShowPopup(true);
      } else if (data.status === 400 && data.messages.success === "Akun belum aktif.") {
        setMessage(data.messages.success);
        setAlertType('warning');
        setShowPopup(true);
      } else if (data.status === 400 && data.messages.success === "Akun tidak terdaftar.") {
        setMessage(data.messages.success);
        setAlertType('error');
        setShowPopup(true);
      } else {
        setMessage('Terjadi kesalahan. Silakan coba lagi.');
        setAlertType('error');
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true); 

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const posNama = user.displayName || user.email.split('@')[0];
      const posEmail = user.email;
      const posPassword = posNama + posEmail;

      const response = await axios.post(`${baseUrl}/login`, {
        posEmail,
        posPassword, // You may want to handle this differently
        posPin: '0000'
      });

      const data = response.data;
      if (data.status === 200) {
        login(data.data);
        setMessage(data.messages.success);
        setAlertType('success');
        setShowPopup(true);
        setTimeout(() => {
          router.push('/');
        }, 2500);
      } else {
        setMessage('Terjadi kesalahan. Silakan coba lagi.');
        setAlertType('errorGoogle');
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const [showRegister, setShowRegister] = useState(false);
  const openRegister = () => {
    setShowRegister(true);
  };
  const closeRegister = () => {
    setShowRegister(false);
  };

  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const registerClick = (e) => {
    e.preventDefault();
    router.push('/daftar');
  };

  const handleBackLogin = () => {
    router.push('/');
  };

  const handlePulihkan = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); // Mengatur loading menjadi true saat proses pengiriman data

      const response = await fetch(`${baseUrl}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ email: formData.posEmail })
      });

      const responseData = await response.json();
      console.log(responseData);

      if (response.ok) {
        setMessage('Link telah dikirim ke email Anda.');
        setAlertType('lupaSandi');
        setShowPopup(true);
      } else {
        if (responseData.error) {
          setMessage(responseData.error);
        } else {
          setMessage('Gagal mengirim link pemulihan.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false); // Mengatur loading menjadi false setelah selesai
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <div className="form-popup login-form">
      <img src='/images/bg-login.png' alt='Logo H!bi' className='logo-login-mobile'/>
      <div className='form-box-popup'>
        <img src='/images/logo-2.png' alt='Logo H!bi' className='logo-popup'/>  
        <h2>Masuk dulu yuk!</h2>
        <form onSubmit={handleSubmitLogin}>
            <input type="email" name="posEmail" placeholder="Email" onChange={handleChangeLogin} required />
            <div className="password-input-container">
              <input 
                type={passwordVisible ? 'text' : 'password'} 
                name="posPassword" 
                placeholder="Kata Sandi" 
                onChange={handleChangeLogin} 
                required 
              />
              <span onClick={togglePasswordVisibility} className="password-toggle">
                {passwordVisible ? <HiEye/> : <HiEyeOff/>}
              </span>
            </div>
            <div className='remember-me'>
              <input 
                type="checkbox" 
                name="rememberMe" 
                id="rememberMe" 
                onChange={handleChangeLogin} 
                checked={formData.rememberMe}
              />
              <label onClick={handleForgotPassword}>Lupa kata sandi?</label>
            </div>
            <button type="submit">Masuk</button>
        </form>
        <h4>Atau</h4>
        <button onClick={handleGoogleSignIn} className="google-sign-in-button"><IoLogoGoogle />Masuk dengan Akun Google</button>
        <span><p>Belum punya akun?</p> <p onClick={registerClick} className='btn-popup-mobile-other'>Daftar</p></span>
        <button onClick={handleBackLogin} className='back-from-login-mobile'><BsArrowLeft/>Mau lihat-lihat dulu</button>
      </div>
      <img src='/images/bg-login-dekstop.png' alt='Logo H!bi' className='logo-login-dekstop'/>

      {loading && (
        <div className="loading-overlay">
          <img src='/images/tunggu-sebentar.png' alt='Hibi'/>
        </div>
      )}

      {showPopup && (
        <div className={`modal-overlay ${alertType}`}>
          <div className='account-success'>
            <span className="close-btn" onClick={handlePopupClose}><IoClose /></span>
            <h1>{message}</h1>
            {alertType === 'success' &&
                <>
                  <img src='/images/verification-success.png' alt='H!bi Verification'/>
                  <p>Kamu berhasil masuk ke akunmu, Selamat Berbelanja!</p>
                </>
              }
              {alertType === 'errorPassword' && 
                <>
                  <img src='images/alert.png' alt='H!bi Verification'/>
                  <p>Yahh.. Kata Sandi nya salah, coba cek lagi dengan teliti</p>
                </>
              }
              {alertType === 'errorGoogle' && 
                <>
                  <img src='images/alert.png' alt='H!bi Verification'/>
                  <p>Yahh.. Ada kesalahan</p>
                </>
              }
              {alertType === 'warning' && 
                <>
                  <img src='images/alert.png' alt='H!bi Verification'/>
                  <p>Akun Anda belum aktif. Silakan hubungi admin untuk aktivasi.</p>
                </>
              }
              {alertType === 'lupaSandi' && 
                <>
                  <div className='report'>
                    <img src='images/alert.png' alt='H!bi Verification'/>
                    <p>Pakai yang lain ya, agar akun mu dapat terdaftar</p>
                    <div className='button-popup-action'>
                      <button onClick={handlePopupClose}>Masuk</button>
                      <button onClick={handlePulihkan}>Pulihkan Akun</button>
                    </div>
                  </div>
                </>
              }
          </div>
        </div>
      )}
      <button onClick={handleBackLogin} className='back-from-login-dekstop'><BsArrowLeft/>Mau lihat-lihat dulu</button>
    </div>
  );
};

export default LoginForm;
