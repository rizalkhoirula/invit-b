const express = require('express');
const router = express.Router();
const kehadiranServices = require('../services/kehadiranService');
const Undangan = require('../models/undanganModels');

router.get('/check-in/:id', async (req, res) => {  
    try {
        const undanganId = req.params.id;
        const undangan = await Undangan.findById(undanganId);

        if (!undangan) {
            return res.status(404).json({ error: 'Undangan tidak ditemukan' });
        }

        const existingKehadiran = await kehadiranServices.getKehadiranByUndanganId(undanganId);
        if (existingKehadiran) {
            return res.status(400).json({ error: 'Undangan sudah check-in sebelumnya' });
        }

        const kehadiranData = {
            name: undangan.name,
            IdUndangan: undangan._id,
            JamKehadiran: new Date()
        };

        const newKehadiran = await kehadiranServices.createKehadiran(kehadiranData);
        res.status(201).json({ message: 'Check-in berhasil', kehadiran: newKehadiran });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/kehadiran', async (req, res) => {
    try {
        const kehadiran = await kehadiranServices.getAllKehadiran();
        res.status(200).json(kehadiran);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/kehadiran/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const kehadiran = await kehadiranServices.getKehadiranById(id);
        res.status(200).json(kehadiran);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/kehadiran/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedKehadiran = await kehadiranServices.deleteKehadiran(id);
        res.status(200).json(deletedKehadiran);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
