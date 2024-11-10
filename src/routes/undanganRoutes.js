const express = require('express');
const router = express.Router();
const undanganServices = require('../services/undanganService');

router.post('/undangan', async (req, res) => {
    try {
        const data = req.body;
        const newUndangan = await undanganServices.createUndangan(data);
        res.status(201).json(newUndangan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/undangan', async (req, res) => {
    try {
        const undangan = await undanganServices.getAllUndangan();
        res.status(200).json(undangan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/ucapan', async (req, res) => {
    try {
        const ucapans = await undanganServices.getAllUcapans();
        const filteredUcapans = ucapans.map(ucapan => ({
            name: ucapan.name,
            message: ucapan.ucapan
        }));
        res.status(200).json(filteredUcapans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/undangan/count', async (req, res) => {
    try {
        const { count } = await undanganServices.getUndanganCount(); // Use the new method to get count
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/undangan/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const undangan = await undanganServices.getUndanganById(id);
        res.status(200).json(undangan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/undangan/:id/status', async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const updatedUndangan = await undanganServices.updateUndanganStatus(id, status);
        res.status(200).json(updatedUndangan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/undangan/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUndangan = await undanganServices.deleteUndangan(id);
        res.status(200).json(deletedUndangan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
