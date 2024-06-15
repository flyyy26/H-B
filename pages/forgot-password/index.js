import { useState } from "react";
import { useRouter } from 'next/router';
import { IoClose } from "react-icons/io5";

const ForgotPassword = () => {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [alertType, setAlertType] = useState(null);
    const [showPopup, setShowPopup] = useState(false); // State untuk menampilkan popup
    const [loading, setLoading] = useState(false); // State untuk menunjukkan loading
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [formData, setFormData] = useState({
        posEmail: ''
    });

    const handleChangeLogin = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    
    const handlePulihkan = async (e) => {
        e.preventDefault();
        try {
            if (!formData.posEmail) {
                setMessage('Email is required.');
                return;
            }
    
            setLoading(true);
            
            const response = await fetch(`${baseUrl}/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: formData.posEmail })
            });
    
            const responseData = await response.json();
            console.log(responseData);
    
            if (response.ok) {
                setMessage('Link telah dikirim ke email Anda');
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
            setLoading(false);
        }
    };
    
      const handlePopupClose = () => {
        setShowPopup(false);
        router.push('/masuk')
      };

    return(
        <>
        <div className='medium-container reset-password'>
            <div className='reset-password-box'>
            <h1>Atur Ulang Kata Sandi</h1>
            <form onSubmit={handlePulihkan}>
                <div className='reset-field'>
                    <input type="email" name="posEmail" placeholder="Isi Email Kamu" onChange={handleChangeLogin} required />
                </div>
                <button className='btn-reset' type="submit">Kirim Link Ke Email</button>
            </form>
            </div>
        </div>

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
                {alertType === 'lupaSandi' && 
                    <>
                    <div className='report'>
                        <img src='/images/verification-success.png' alt='H!bi Verification'/>
                        <p>Klik link yang sudah dikirim ke email kamu</p>
                    </div>
                    </>
                }
            </div>
            </div>
        )}
        </>
    );
}

export default ForgotPassword