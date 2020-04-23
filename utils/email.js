const nodemailer = require('nodemailer');

const sendMail = async options => {
    const transporter = nodemailer.createTransport({
        host: '192.168.1.17',
        port: 1025,
        auth: {
            user: 'project.1',
            pass: 'secret.1'
        }
    });
     
    // Define mail options
    
    const mailOptions = {
        from: 'Herve Wilfried <hervew@dev.io>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(mailOptions);
}

module.exports = sendMail;