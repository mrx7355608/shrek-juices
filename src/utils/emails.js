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
}

async function sendContactEmail(customerEmail, message) {
    const mailOptions = {
        to: process.env.EMAIL_SENDER,
        from: customerEmail,
        subject: "Contact Form",
        text: message
    }
    await transport.sendMail(mailOptions);
}

/*
    * TODO: send password reset email
*/
async function sendPasswordResetEmail() {}

async function sendOrderPlacedEmailToCustomer(customerEmail, juice) {
    const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: customerEmail,
        subject: "Your order has been placed",
        html: `Your order of ${juice.name} has been placed successfully. You will receive your order in very short time`
    }
    await transport.sendMail(mailOptions);
}

async function sendOrderPlacedEmailToAdmin(adminEmail, customerEmail, address, phoneNumber, juice) {
    const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: adminEmail,
        subject: "[SHREK-JUICES] New Order",
        html: `
            <p>A new order of ${juice.name} has been placed by ${customerEmail}.</p>
            <p>Address: ${address}</p>
            <p>Ph Number: ${phoneNumber}</p>
        `
    }
    await transport.sendMail(mailOptions);
}

export { 
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendOrderPlacedEmailToCustomer,
    sendOrderPlacedEmailToAdmin,
    sendContactEmail
}
