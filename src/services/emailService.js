const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const Undangan = require('../models/undanganModels'); 
require('dotenv').config();

const sendEmailWithQRCode = async (name, email, link) => {
    try {
        // Menghasilkan QR code sebagai Data URL
        const qrCodeData = await QRCode.toDataURL(link);
        console.log('QR Code generated.');

        // Mengonversi Data URL menjadi buffer
        const base64Data = qrCodeData.split(',')[1];
        const qrCodeBuffer = Buffer.from(base64Data, 'base64');

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
                    content: qrCodeBuffer,
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
    sendEmailWithQRCode
};
