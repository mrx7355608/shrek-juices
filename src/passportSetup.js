import passport from "passport";
import { Strategy } from "passport-local";
import UserModel from "./models/user.model.js";
import bcryptjs from "bcryptjs";
import validator from "validator";

export default function passportSetup() {
  passport.use(
    new Strategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        // validate if correct email is given
        if (!validator.isEmail(email)) {
          return done(null, false, { message: "Enter a valid email" });
        }

        // check if user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Incorrect email or password" });
        }

        // validate password
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
          return done(null, false, { message: "Incorrect email or password" });
        }

        // return user
        done(null, user);
      } catch (err) {
        done(err);
      }
    }),
  );

  // Serializer
  passport.serializeUser(async (user, done) => done(null, user.id));

  // De-serializer
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      return done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
