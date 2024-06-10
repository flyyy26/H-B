// components/LoginForm.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import RegisterForm from '../register-form';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { BsArrowLeft } from 'react-icons/bs';

const LoginForm = ({ onClose }) => {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    posEmail: '',
    posPassword: '',
    posPin: '0000',
    rememberMe: false
  });

  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState(null);
  const [buttonText, setButtonText] = useState('Masuk'); 
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

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
      const response = await axios.post(`${baseUrl}/login`, formData);
      const data = response.data;

      if (data.status === 200) {
        login(data.data);
        setMessage(data.messages.success);
        setAlertType('success');
        setTimeout(() => {
          onClose();
          router.push('/');
        }, 2500);
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
      setButtonText('Masuk');
    }
  };

  useEffect(() => {
    let timer;
    if (message) {
      timer = setTimeout(() => {
        setMessage('');
        setAlertType(null);
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [message]);

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
    window.location.href = '/daftar';
    onClose();
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
            <button type="submit" disabled={buttonText === 'Tunggu sebentar...'}>{buttonText}</button>
        </form>
        <span><p>Belum punya akun?</p> <p onClick={registerClick} className='btn-popup-mobile-other'>Daftar</p></span>
        <button onClick={onClose} className='back-from-login-mobile'><BsArrowLeft/>Mau lihat-lihat dulu</button>
      </div>
      <img src='/images/bg-login-dekstop.png' alt='Logo H!bi' className='logo-login-dekstop'/>
      {message && (
        <div className={`modal-overlay ${alertType}`}>
          <div className='account-success'>
            <h1>{message}</h1>
            {alertType === 'success' ? 
                <>
                  <img src='/images/verification-success.png' alt='H!bi Verification'/>
                  <p>Kamu berhasil masuk ke akunmu, Selamat Berbelanja!</p>
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
      {showRegister && <RegisterForm onClose={closeRegister} />}
      <button onClick={onClose} className='back-from-login-dekstop'><BsArrowLeft/>Mau lihat-lihat dulu</button>
    </div>
  );
};

export default LoginForm;
