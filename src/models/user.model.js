import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
});

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const hashedPassword = await bcryptjs.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } else {
    next();
  }
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
