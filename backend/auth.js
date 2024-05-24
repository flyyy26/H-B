const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Inisialisasi user dummy (sementara)
const users = [];

// Endpoint untuk register user
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Validasi jika username sudah digunakan
    if (users.some(user => user.username === username)) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Simpan user baru
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint untuk login user
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Cari user berdasarkan username
    const user = users.find(user => user.username === username);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Validasi password
    if (await bcrypt.compare(password, user.password)) {
      // Buat token JWT
      const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
