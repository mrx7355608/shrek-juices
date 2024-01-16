import nodemailer from "nodemailer"

const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

// Send verification email
async function sendVerificationEmail(receiver, verificationLink) {
    const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: receiver,
        subject: "Account Verification",
        html: `<p>Please verify your account</p>
        <a href="${verificationLink}" target="_blank">Verify</a>
        `
    }
    await transport.sendMail(mailOptions);
    console.log("mail sent!")
}

/*
    * TODO: send password reset email
*/
async function sendPasswordResetEmail() {}

/*
    * TODO: send order placed email
*/
async function sendOrderPlacedEmail() {}


export { 
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendOrderPlacedEmail
}
