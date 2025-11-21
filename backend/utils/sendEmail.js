import nodemailer from 'nodemailer';

export const sendEmail = (userEmail, verificationUrl) => {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.APP_EMAIL,
            pass: process.env.APP_SECRET
        }
    });

    let mailOptions = {
        from: process.env.APP_EMAIL,
        to: userEmail,
        subject: 'Verification Code',
        // fallback
        text: `Please verify your account by opening the following link: ${verificationUrl}`,

        // styled version
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Welcome!</h2>
            <p>Please verify your account by pressing <a href="${verificationUrl}">this link</a>.</p>
        </div>
    `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}