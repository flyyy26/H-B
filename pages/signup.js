// pages/signup.js
import { useState } from 'react';

const Signup = () => {
  const [formData, setFormData] = useState({
    posNama: '',
    posEmail: '',
    posPassword: '',
    posNoTelp: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://103.153.43.25/api/daftar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(formData)
      });
      const data = await response.json();
      console.log(data);
      if (data.status === 200) {
        setMessage('Akun berhasil dibuat.');
      } else {
        setMessage('Gagal membuat akun.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Terjadi kesalahan. Silakan coba lagi.');
    }
  };
  

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="posNama" placeholder="Nama" onChange={handleChange} required />
        <input type="email" name="posEmail" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="posPassword" placeholder="Password" onChange={handleChange} required />
        <input type="text" name="posNoTelp" placeholder="Nomor Telepon" onChange={handleChange} required />
        <button type="submit">Daftar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Signup;
