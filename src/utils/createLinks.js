import { createToken } from "./jwt.js";

const serverUrl = process.env.SERVER_URL

function createVerificationLink(userID) {
    const token = createToken(userID);
    const link = `${serverUrl}/auth/verify-email?token=${token}`;
    return link;
}

export { createVerificationLink };
