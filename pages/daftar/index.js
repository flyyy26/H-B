import { useState, useEffect } from 'react';
import { HiEye, HiEyeOff } from "react-icons/hi";
import { BsArrowLeft } from "react-icons/bs";
import { useRouter } from 'next/router';
import { auth, googleProvider } from '@/utils/firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import { IoClose } from "react-icons/io5";
import { IoLogoGoogle } from "react-icons/io";

const RegisterForm = ({ onClose }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    posNama: '',
    posEmail: '',
    posPassword: '',
    posNoTelp: ''
  });
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false); // State untuk menunjukkan loading
  const [showPopup, setShowPopup] = useState(false); // State untuk menampilkan popup
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleFormSubmit = async () => {
    try {
      setLoading(true); // Mengatur loading menjadi true saat proses pengiriman data

      // Post data to API
      const response = await fetch(`${baseUrl}/daftar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      console.log(data);
      if (data.status === 200) {
        setMessage('Daftar Akun Berhasil!');
        setAlertType('success');
        setShowPopup(true);
      } else {
        if (data.messages && data.messages.posEmail) {
          setMessage('Email sudah digunakan');
          setAlertType('emailAda');
          setShowPopup(true);
        } else if (data.messages && data.messages.posNoTelp) {
          setMessage('Nomor hp sudah digunakan');
          setAlertType('noHp');
          setShowPopup(true);
        } else {
          setMessage('Gagal membuat akun');
          setAlertType('gagal');
          setShowPopup(true);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Terjadi kesalahan. Silakan coba lagi.');
      setAlertType('error');
      setShowPopup(true);
    } finally {
      setLoading(false); // Mengatur loading menjadi false setelah selesai
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true); // Mengatur loading menjadi true saat proses pengiriman data
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const posNama = user.displayName || user.email.split('@')[0];
      const posEmail = user.email;
      const posPassword = posNama + posEmail;
      const posNoTelp = Math.floor(100000 + Math.random() * 900000).toString();

      // Post data to API
      const response = await fetch(`${baseUrl}/daftar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          posNama,
          posEmail,
          posPassword,
          posNoTelp
        })
      });
      const data = await response.json();
      console.log(data);
      if (data.status === 200) {
        setMessage('Daftar Akun Berhasil!');
        setAlertType('success');
        setShowPopup(true);
      } else {
        if (data.messages && data.messages.posEmail) {
          setMessage('Email sudah digunakan');
          setAlertType('emailAda');
          setShowPopup(true);
        } else if (data.messages && data.messages.posNoTelp) {
          setMessage('Nomor hp sudah digunakan');
          setAlertType('noHp');
          setShowPopup(true);
        } else {
          setMessage('Gagal membuat akun');
          setAlertType('gagal');
          setShowPopup(true);
        }
        setAlertType('error');
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Terjadi kesalahan. Silakan coba lagi.');
      setAlertType('error');
      setShowPopup(true);
    } finally {
      setLoading(false); // Mengatur loading menjadi false setelah selesai
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleFormSubmit();
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleCheckEmail = () => {
    window.location.href = 'mailto:';
    handlePopupClose()
  };

  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleBackLogin = () => {
    router.push('/');
  };

  const masukClick = (e) => {
    e.preventDefault();
    router.push('/masuk');
  };

  const lihatClick = (e) => {
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
        setAlertType('success');
        setShowPopup(true);
      } else {
        if (responseData.error) {
          setMessage(responseData.error);
        } else {
          setMessage('Gagal mengirim link pemulihan.');
        }
        setAlertType('error');
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Terjadi kesalahan. Silakan coba lagi.');
      setAlertType('error');
      setShowPopup(true);
    } finally {
      setLoading(false); // Mengatur loading menjadi false setelah selesai
    }
  };

  return (
    <div className="form-popup login-form">
      <img src='/images/bg-login.png' alt='Logo H!bi' className='logo-login-mobile'/>
      <div className='form-box-popup'>
        <img src='images/logo-2.png' alt='Logo H!bi' className='logo-popup'/>
        <h2>Daftar dulu yuk!</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="posNama" placeholder="Nama" value={formData.posNama} onChange={(e) => setFormData({ ...formData, posNama: e.target.value })} required />
          <input type="email" name="posEmail" placeholder="Email" value={formData.posEmail} onChange={(e) => setFormData({ ...formData, posEmail: e.target.value })} required />
          <div className="password-input-container">
            <input type={passwordVisible ? 'text' : 'password'}  name="posPassword" placeholder="Password" value={formData.posPassword} onChange={(e) => setFormData({ ...formData, posPassword: e.target.value })} required />
            <span onClick={togglePasswordVisibility} className="password-toggle">
              {passwordVisible ? <HiEye/> : <HiEyeOff/>}
            </span>
          </div>
          <input type="text" name="posNoTelp" placeholder="Nomor Telepon" value={formData.posNoTelp} onChange={(e) => setFormData({ ...formData, posNoTelp: e.target.value })} required />
          <button type="submit">Daftar</button>
        </form>
        <h4>Atau</h4>
        <button onClick={handleGoogleSignIn} className="google-sign-in-button"><IoLogoGoogle />Daftar dengan Akun Google</button>
        <span><p>Sudah punya akun?</p> <p onClick={masukClick} className='btn-popup-mobile-other'>Masuk</p></span>
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
            {alertType === 'success' && (
              <div className='report'>
                <img src='images/notif-icon.png' alt='H!bi Verification'/>
                <p>Kami telah mengirim verifikasi ke email {userEmail}, Jangan lupa di klik tombol verifikasi nya ya!</p>
                <div className='button-popup-action'>
                <button onClick={() => handleCheckEmail(userEmail)}>Cek Email Sekarang</button>
                </div>
              </div>
            )}
            {alertType === 'noHp' && (
              <div className='report'>
                <img src='images/alert.png' alt='H!bi Verification'/>
                <p>Pakai yang lain ya, agar akun mu dapat terdaftar</p>
              </div>
            )}
            {alertType === 'emailAda' && (
              <div className='report'>
                <img src='images/alert.png' alt='H!bi Verification'/>
                <p>Pakai yang lain ya, agar akun mu dapat terdaftar</p>
                <div className='button-popup-action'>
                  <button onClick={handleBackLogin}>Masuk</button>
                  <button onClick={handlePulihkan}>Pulihkan Akun</button>
                </div>
              </div>
            )}
            {alertType === 'gagal' && (
              <div className='report'>
                <img src='images/alert.png' alt='H!bi Verification'/>
                <p>Maaf kamu gagal membuat akun</p>
              </div>
            )}
          </div>
        </div>
      )}

      <button onClick={handleBackLogin} className='back-from-login-dekstop'><BsArrowLeft/>Mau lihat-lihat dulu</button>
    </div>
  );
};

export default RegisterForm;
