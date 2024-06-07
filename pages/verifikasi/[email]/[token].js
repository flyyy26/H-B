import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LoginForm from '@/components/login-form';

export default function VerifikasiPage() {
    const router = useRouter();
    const { email, token } = router.query;
    const [status, setStatus] = useState('Tunggu...');
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        if (email && token) {
            fetch(`${baseUrl}/verifikasi?email=${email}&token=${token}`)
                .then(res => res.json())
                .then(data => {
                    console.log("Response data from /api/verifikasi:", data);  // Log the data from the /api/verif
                    
                    if (data.error && data.status === 400) {
                        setStatus(data.messages.success || 'Akun Verifikasi Tidak Valid');
                        clickLogin()
                    } else {
                        setStatus(data.messages.success || 'Verifikasi berhasil!');
                        clickLogin()
                    }
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    setStatus('Verifikasi gagal karena kesalahan sistem.');
                });
        }
    }, [email, token, baseUrl, router]);

    const clickLogin = () => {
        router.push(`/masuk`);
      };

    return (
        <div className='verif-page'>
            <h1 className='message-verif message-verif-first message-verif-stroke'>{status}</h1>
            <h1 className='message-verif'>{status}</h1>
            <h1 className='message-verif message-verif-first message-verif-stroke'>{status}</h1>
        </div>
    );
}
