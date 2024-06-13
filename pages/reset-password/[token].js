// pages/reset-password/[token].js

import { useState } from 'react';
import { useRouter } from 'next/router';

const ResetPassword = () => {
  const router = useRouter();
  const { token } = router.query;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Password confirmation does not match');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/delete-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ token, new_password: newPassword, confirm_password: confirmPassword })
      });

      const responseData = await response.json();

      if (response.ok) {
        if (responseData.status === 200) {
          setSuccessMessage(responseData.message);
          router.push('/masuk')
        } else {
          setError(responseData.messages.error);
        }
      } else {
        throw new Error(responseData.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setError('Failed to reset password');
    }
  };

  return (
    <div className='medium-container reset-password'>
      <div className='reset-password-box'>
        <h1>Atur Kata Sandi</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className='reset-field'>
            <label>Password Baru :</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className='reset-field'>
            <label>Konfirmasi Password Baru</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button className='btn-reset' type="submit">Simpan Kata Sandi</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
