const Kehadiran = require('../models/kehadiran');
const Undangan = require('../models/undanganModels');

const createKehadiran = async (data) => {
    try {
        const kehadiran = new Kehadiran(data);
        const savedKehadiran = await kehadiran.save();

        const undanganId = data.IdUndangan;
        const undangan = await Undangan.findById(undanganId);
        if (undangan) {
            undangan.isScanned = true;
            await undangan.save();
        } else {
            throw new Error('Undangan tidak ditemukan untuk diperbarui');
        }

        return savedKehadiran;
    } catch (error) {
        throw new Error('Gagal mencatat kehadiran: ' + error.message);
    }
};

// Fungsi untuk mendapatkan semua kehadiran
const getAllKehadiran = async () => {
    try {
        const kehadiran = await Kehadiran.find().populate('IdUndangan', 'Name email');
        return kehadiran;
    } catch (error) {
        throw new Error('Gagal mendapatkan data kehadiran: ' + error.message);
    }
};

// Fungsi untuk mendapatkan kehadiran berdasarkan ID
const getKehadiranById = async (id) => {
    try {
        const kehadiran = await Kehadiran.findById(id).populate('IdUndangan', 'Name email');
        if (!kehadiran) {
            throw new Error('Kehadiran tidak ditemukan');
        }
        return kehadiran;
    } catch (error) {
        throw new Error('Gagal mendapatkan data kehadiran: ' + error.message);
    }
};
const getKehadiranByUndanganId = async (undanganId) => {
    try {
        const kehadiran = await Kehadiran.findOne({ IdUndangan: undanganId });
        return kehadiran;
    } catch (error) {
        throw new Error('Gagal mendapatkan kehadiran berdasarkan IdUndangan: ' + error.message);
    }
};
// Fungsi untuk menghapus kehadiran berdasarkan ID
const deleteKehadiran = async (id) => {
    try {
        const kehadiran = await Kehadiran.findByIdAndDelete(id);
        if (!kehadiran) {
            throw new Error('Kehadiran tidak ditemukan');
        }
        return kehadiran;
    } catch (error) {
        throw new Error('Gagal menghapus kehadiran: ' + error.message);
    }
};

module.exports = {
    createKehadiran,
    getAllKehadiran,
    getKehadiranById,
    deleteKehadiran,
    getKehadiranByUndanganId
};