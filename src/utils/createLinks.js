import { createToken } from "./jwt.js";

const serverUrl = process.env.SERVER_URL

function createVerificationLink(userID) {
    const token = createToken(userID);
    const verificationLink = `${serverUrl}/auth/verify-email?token=${token}`;
    return { token, verificationLink };
}

export { createVerificationLink };
