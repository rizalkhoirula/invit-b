require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const undanganRoutes = require('./src/routes/undanganRoutes');
const kehadiranRoutes = require('./src/routes/kehadiranRoutes');

const app = express();
const cors = require('cors');
app.use(cors({
  origin: 'https://wedding-invitation-zeta-five.vercel.app/'  
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/qrcodes', express.static(path.join(__dirname, 'qrcodes')));


mongoose.connect(process.env.MONGODB_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
.then(() => console.log('Koneksi ke database berhasil'))
.catch((error) => console.error('Gagal terhubung ke database:', error));

app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

app.use('/api', undanganRoutes);
app.use('/api', kehadiranRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
