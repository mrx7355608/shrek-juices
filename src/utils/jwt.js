import jwt from "jsonwebtoken"

function createToken(id) {
    const token = jwt.sign({ userID: id }, process.env.JWT_SECRET, {
        expiresIn: "5m"
    });
    return token;
}

function verifyToken(token) {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload;
}

export { createToken, verifyToken };
