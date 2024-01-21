import mongoose from "mongoose"

const tokenSchema = new mongoose.Schema({
    token: String, // token is a JWT
})

const TokenModel = mongoose.model("Token", tokenSchema);
export default TokenModel;
