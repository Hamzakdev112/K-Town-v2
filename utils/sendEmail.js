import nodemailer from 'nodemailer'

export const sendEmail = async (options)=>{
    const transporter = nodemailer.createTransport({
        service:'gmail',
        port:465,
        auth:{
            user:process.env.SMTP_EMAIL,
            pass:process.env.SMTP_PASSWORD,
        }
    })
    const mailOpts = {
        from:process.env.SMTP_EMAIL,
        to:options.email,
        subject:options.subject,
        text:options.text
    }
    await transporter.sendMail(mailOpts)

}


