const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
require('dotenv').config();

const sendEmailWithQRCode = async (name, email, link) => {
    try {
        // Menghasilkan QR code sebagai Data URL
        const qrCodeData = await QRCode.toDataURL(link);
        console.log('QR Code generated.');

        // Creating transporter and testing SMTP connection
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // Set to true for port 465
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // Test connection to SMTP server
        transporter.verify((error, success) => {
            if (error) {
                console.error('Failed to connect to Brevo SMTP:', error);
            } else {
                console.log('Successfully connected to Brevo SMTP.');
            }
        });

        let mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: `Undangan Pernikahan - Check-in QR Code`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
                    <h2 style="text-align: center; color: #5f6368;">Undangan Pernikahan</h2>
                    <p>Hai ${name},</p>
                    <p>Terima kasih telah mengisi formulir undangan. Silakan gunakan QR code di bawah ini untuk check-in pada hari acara:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <img src="${qrCodeData}" alt="QR Code" style="width: 150px; height: 150px; border: 2px solid #ddd; padding: 10px;"/>
                    </div>
                    <p style="text-align: center; font-weight: bold;">Kami menunggu kehadiran Anda!</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email berhasil dikirim ke: ' + email);
        return true;
    } catch (error) {
        console.error('Gagal mengirim email:', error.message);
        throw new Error('Gagal mengirim email: ' + error.message);
    }
};

module.exports = {
    sendEmailWithQRCode
};
