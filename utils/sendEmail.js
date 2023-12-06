import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config()
const sendEmail = async (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: 'gmail',
        port:  587,
        secure: true, 
        auth:{
             user: "chindaebube03@gmail.com",
             pass: "oxkpgoyopkzejxwu",
        }

        // securesally@gmail.com
    })


    const mailOptions = {
        from:  "chindaebube03@gmail.com",
        to: email,
        subject: subject,
        html: html,

    }
    await transporter.sendMail(mailOptions)

}

export default sendEmail