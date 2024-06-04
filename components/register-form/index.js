import { useState, useEffect } from 'react';
import { IoClose, IoCheckmarkCircleOutline, IoAlertCircleOutline } from "react-icons/io5";
import Link from 'next/link';
import LoginForm from '../login-form';
import { HiEye,HiEyeOff } from "react-icons/hi";
import { BsArrowLeft } from "react-icons/bs";

const RegisterForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    posNama: '',
    posEmail: '',
    posPassword: '',
    posNoTelp: ''
  });
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'posEmail') {
      setUserEmail(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/daftar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(formData)
      });
      const data = await response.json();
      console.log(data);
      if (data.status === 200) {
        setMessage('Daftar Akun Berhasil!');
        setAlertType('success');
      } else {
        if (data.messages && data.messages.posEmail) {
          setMessage('Email sudah digunakan.');
        } else if (data.messages && data.messages.posNoTelp) {
          setMessage('Nomor hp sudah digunakan.');
        } else {
          setMessage('Gagal membuat akun.');
        }
        setAlertType('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Terjadi kesalahan. Silakan coba lagi.');
      setAlertType('error');
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

  const handleCheckEmail = () => {
    window.location.href = 'mailto:';
  };

  const [showLogin, setShowLogin] = useState(false);

  const openLogin = () => {
    setShowLogin(true);
};

const closeLogin = () => {
    setShowLogin(false);
};

const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const masukClick = (e) => {
    // Pastikan event tidak membubbling
    e.preventDefault();
    window.location.href = '/masuk';
    onClose();
    // Navigasi ke halaman daftar setelah onClose dijalankan
    
  };

  const handleBackLogin = () => {
    router.push('/');
  };

  return (
    <div className="form-popup login-form">
      <img src='/images/bg-login.png' alt='Logo H!bi' className='logo-login-mobile'/>
      <div className='form-box-popup'>
        <img src='images/logo-2.png' alt='Logo H!bi' className='logo-popup'/>
        <h2>Daftar dulu yuk!</h2>
        <form onSubmit={handleSubmit}>
            <input type="text" name="posNama" placeholder="Nama" onChange={handleChange} required />
            <input type="email" name="posEmail" placeholder="Email" onChange={handleChange} required />
            <div className="password-input-container">
              <input type={passwordVisible ? 'text' : 'password'}  name="posPassword" placeholder="Password" onChange={handleChange} required />
              <span onClick={togglePasswordVisibility} className="password-toggle">
                {passwordVisible ? <HiEye/> : <HiEyeOff/>}
              </span>
            </div>
            <input type="text" name="posNoTelp" placeholder="Nomor Telepon" onChange={handleChange} required />
            <button type="submit">Daftar</button>
        </form>
        <span><p>Sudah punya akun?</p> <p onClick={masukClick} className='btn-popup-mobile-other'>Masuk</p></span>
        <button onClick={onClose} className='back-from-login-mobile'><BsArrowLeft/>Mau lihat-lihat dulu</button>
      </div> 
      <img src='/images/bg-login-dekstop.png' alt='Logo H!bi' className='logo-login-dekstop'/>
      {message && (
        <div className={`modal-overlay ${alertType}`}>
          <div className='account-success'>
            <h1>{message}</h1>
            {alertType === 'success' ? 
                <>
                <img src='images/notif-icon.png' alt='H!bi Verification'/>
                <p>Kami telah mengirim verifikasi ke email {userEmail},
                    Jangan lupa di klik tombol verifikasi nya ya!</p>
                <button onClick={() => handleCheckEmail(userEmail)}>Cek Email Sekarang</button>
                </>
                : 
                <>
                  <img src='images/alert.png' alt='H!bi Verification'/>
                  <p>Pakai yang lain ya, agar akun mu dapat terdaftar</p>
                </>}
          </div>
        </div>
      )}
      {showLogin && <LoginForm onClose={closeLogin} />}
      <button onClick={onClose} className='back-from-login-dekstop'><BsArrowLeft/>Mau lihat-lihat dulu</button>
    </div>
  );
};

export default RegisterForm;
