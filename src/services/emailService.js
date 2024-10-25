const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const Undangan = require('../models/undanganModels'); 
require('dotenv').config();

const saveQRCode = async (link) => {
    const qrCodeDir = path.join(__dirname, 'image', 'qrcode');
    if (!fs.existsSync(qrCodeDir)) {
        fs.mkdirSync(qrCodeDir, { recursive: true });
    }
    const qrCodePath = path.join(qrCodeDir, `${Date.now()}.png`);
    await QRCode.toFile(qrCodePath, link);
    return qrCodePath;
};

const sendEmailWithQRCode = async (name, email, link) => {
    try {
        const qrCodeData = await QRCode.toDataURL(link);
        const qrCodePath = await saveQRCode(link);
        console.log('QR Code saved to:', qrCodePath);

        let transporter = nodemailer.createTransport({
            host: 'smtp.zoho.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.ZOHO_EMAIL,
                pass: process.env.ZOHO_PASSWORD,
            },
        });

        let mailOptions = {
            from: process.env.ZOHO_EMAIL,
            to: email,
            subject: `Undangan Pernikahan - Check-in QR Code`,
            html: `
                <p>Hai ${name},</p>
                <p>Terima kasih telah mengisi formulir undangan. Silakan gunakan QR code di bawah ini untuk check-in pada hari acara:</p>
                <p>Kami menunggu kehadiran Anda!</p>
            `,
            attachments: [
                {
                    filename: 'qrcode.png',
                    path: qrCodePath,
                    cid: 'qrcode' 
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        throw new Error('Gagal mengirim email: ' + error.message);
    }
};

module.exports = {
    saveQRCode,
    sendEmailWithQRCode
};