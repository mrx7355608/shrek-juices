import transport from "./emailSetup.js"

export default async function sendVerificationEmail(receiver, verificationLink) {
    const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: receiver,
        subject: "Account Verification",
        text: `Please verify your account\n${verificationLink}`
    }
    await transport.sendMail(mailOptions);
    console.log("mail sent!")
}
