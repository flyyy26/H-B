import { useState, useEffect } from 'react';
import { IoClose, IoCheckmarkCircleOutline, IoAlertCircleOutline } from "react-icons/io5";
import axios from 'axios';
import { useAuth } from "@/contexts/AuthContext";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HiEye,HiEyeOff } from "react-icons/hi";

import { BsArrowLeft } from "react-icons/bs";


const LoginForm = ({ onClose }) => {
  const { user } = useAuth();
  const router = useRouter()
  const [formData, setFormData] = useState({
    posEmail: '',
    posPassword: '',
    posPin: '0000',
    rememberMe: false
  });

  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState(null);
  const [buttonText, setButtonText] = useState('Masuk'); 

  const handleChangeLogin = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setButtonText('Tunggu sebentar...');
    try {
      const response = await axios.post('http://localhost:3000/api/login', formData);
      const data = response.data;

      if (data.status === 200) {
        document.cookie = `user=${JSON.stringify(data.data)}`;
        setMessage(data.messages.success);
        setAlertType('success');
        window.location.href = '/';
      } else if (data.status === 400 && data.messages.success === "Password Salah.") {
        setMessage(data.messages.success);
        setAlertType('error');
      } else if (data.status === 400 && data.messages.success === "Akun belum aktif.") {
        setMessage(data.messages.success);
        setAlertType('warning');
      } else if (data.status === 400 && data.messages.success === "Akun tidak terdaftar.") {
        setMessage(data.messages.success);
        setAlertType('error');
      } else {
        setMessage('Terjadi kesalahan. Silakan coba lagi.');
        setAlertType('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Terjadi kesalahan. Silakan coba lagi.');
      setAlertType('error');
    } finally {
      setButtonText('Masuk'); // Restore button text
    }
  };

  useEffect(() => {
    let timer;
    if (message) {
      timer = setTimeout(() => {
        setMessage('');
        setAlertType(null);
      }, 2500); // Pesan muncul selama 3 detik
    }
    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    if (user) {
      router.replace('/'); // Redirect to home page if already logged in
    }
  }, [user, router]);

  if (user) { 
    return null; // Return null to render nothing if the user is logged in
  }

  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const registerClick = (e) => {
    // Pastikan event tidak membubbling
    e.preventDefault();
    window.location.href = '/daftar';
    // Navigasi ke halaman daftar setelah onClose dijalankan 
    
  };

  const handleBackLogin = () => {
    router.push('/');
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
              <label htmlFor="rememberMe">Ingatkan Saya</label>
            </div>
            <button type="submit" disabled={buttonText === 'Tunggu sebentar...'}>Masuk</button>
        </form>
        <span><p>Belum punya akun?</p> <p onClick={registerClick} className='btn-popup-mobile-other'>Daftar</p></span>
        <button onClick={() => router.back()} className='back-from-login-mobile'><BsArrowLeft/>Mau lihat-lihat dulu</button>
      </div>
      <img src='/images/bg-login-dekstop.png' alt='Logo H!bi' className='logo-login-dekstop'/>
      {message && (
        <div className={`modal-overlay ${alertType}`}>
          <div className='account-success'>
            <h1>{message}</h1>
            {alertType === 'success' ? 
                <>
                  <img src='images/verification-success.png' alt='H!bi Verification'/>
                  <p>Kamu berhasil masuk!</p>
                </>
                : alertType === 'warning' ?
                <>
                  <img src='images/alert.png' alt='H!bi Verification'/>
                  <p>Akun Anda belum aktif. Silakan hubungi admin untuk aktivasi.</p>
                </>
                :
                <>
                  <img src='images/alert.png' alt='H!bi Verification'/>
                  <p>Yahh.. Kata Sandi nya salah, coba cek lagi dengan teliti</p>
                </>
              }

          </div>
        </div>
      )}
      <button onClick={() => router.back()} className='back-from-login-dekstop'><BsArrowLeft/>Mau lihat-lihat dulu</button>
    </div>
  );
};

export default LoginForm;
