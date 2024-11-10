const Undangan = require('../models/undanganModels');
const { sendEmailWithQRCode } = require('./emailService');

const createUndangan = async (data) => {
    try {
        const undangan = new Undangan(data);
        const savedUndangan = await undangan.save();

        const checkInLink = `http://apiinvit.vercel.app/api/check-in/${savedUndangan._id}`;
        await sendEmailWithQRCode(savedUndangan.name, savedUndangan.email, checkInLink);

        return savedUndangan;
    } catch (error) {
        throw new Error('Gagal membuat undangan: ' + error.message);
    }
};


const checkIn = async (id) => {
    try {
        const undangan = await Undangan.findById(id);

        if (!undangan) {
            return { success: false, message: 'Undangan tidak ditemukan' };
        }

        if (undangan.isScanned) {
            return { success: false, message: 'QR Code sudah digunakan' }; 
        }

        
        undangan.isScanned = true;
        await undangan.save();

        return { success: true, message: 'Check-in berhasil, selamat datang!' };
    } catch (error) {
        return { success: false, message: 'Gagal check-in: ' + error.message };
    }
};

const getAllUndangan = async () => {
    try {
        const undangan = await Undangan.find();
        return undangan;
    } catch (error) {
        throw new Error('Gagal mendapatkan data undangan: ' + error.message);
    }
};

const getUndanganById = async (id) => {
    try {
        const undangan = await Undangan.findById(id);
        if (!undangan) {
            throw new Error('Undangan tidak ditemukan');
        }
        return undangan;
    } catch (error) {
        throw new Error('Gagal mendapatkan data undangan: ' + error.message);
    }
};

const updateUndanganStatus = async (id, status) => {
    try {
        const undangan = await Undangan.findByIdAndUpdate(
            id, 
            { status: status }, 
            { new: true }
        );
        if (!undangan) {
            throw new Error('Undangan tidak ditemukan');
        }
        return undangan;
    } catch (error) {
        throw new Error('Gagal mengupdate status undangan: ' + error.message);
    }
};

const deleteUndangan = async (id) => {
    try {
        const undangan = await Undangan.findByIdAndDelete(id);
        if (!undangan) {
            throw new Error('Undangan tidak ditemukan');
        }
        return undangan;
    } catch (error) {
        throw new Error('Gagal menghapus undangan: ' + error.message);
    }
};
const getAllUcapans = async () => {
    try {
        const ucapans = await Undangan.find().select('name ucapan'); // Mengambil hanya nama dan kolom ucapan
        return ucapans;
    } catch (error) {
        throw new Error('Gagal mendapatkan data ucapan: ' + error.message);
    }
};
const getUndanganCount = async () => {
    try {
        const count = await Undangan.countDocuments(); // Get the count of all undangan
        return { count };
    } catch (error) {
        throw new Error('Gagal mendapatkan count undangan: ' + error.message);
    }
};
module.exports = {
    createUndangan,
    getAllUndangan,
    getUndanganById,
    updateUndanganStatus,
    deleteUndangan,
    checkIn,
    getAllUcapans,
    getUndanganCount
};
