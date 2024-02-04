import passport from "passport";
import { Router } from "express";
import validator from "validator";
import { verifyToken } from "../utils/jwt.js";
import UserModel from "../models/user.model.js";
import TokenModel from "../models/token.model.js";
import { sendVerificationEmail } from "../utils/emails.js";
import { signupSchema } from "../validators/auth.validators.js";
import { createVerificationLink } from "../utils/createLinks.js";

const authRouter = Router();

authRouter.use((req, res, next) => {
  res.locals.signupData = req.body;
  next();
});

authRouter.get("/signup", (_req, res) => {
  res.render("signup", { layout: "auth" });
});

authRouter.post("/signup", async (req, res) => {
  try {
    // Validate user data
    const { error } = signupSchema.validate(req.body, { abortEarly: false });

    /*
     * TODO: find another method for this code block
     */
    if (error) {
      const { details } = error;
      for (let i = 0; i < details.length; i++) {
        if (details[i].path[0] === "firstname") {
          req.flash("firstNameError", details[i].message);
        }
        if (details[i].path[0] === "lastname") {
          req.flash("lastNameError", details[i].message);
        }
        if (details[i].path[0] === "email") {
          req.flash("emailError", details[i].message);
        }
        if (details[i].path[0] === "password") {
          req.flash("passwordError", details[i].message);
        }
        if (details[i].path[0] === "confirm_password") {
          req.flash("confirmPasswordError", details[i].message);
        }
      }
      return res.render("signup", { layout: "auth" });
    }

    // Check if user already exists in database
    const userExists = await UserModel.findOne({ email: req.body.email });
    if (userExists) {
      req.flash("userAlreadyExistsError", "Email is already registered");
      return res.render("signup", { layout: "auth" });
    }

    // Add user in db
    const newUser = await UserModel.create(req.body);

    // Create a verification link and save the token
    // in database
    const { token, verificationLink } = createVerificationLink(newUser._id);
    await TokenModel.create({ token });

    // Send verification email
    await sendVerificationEmail(newUser.email, verificationLink);

    // Render a success page
    res.render("signup-success-message", {
      layout: "auth",
      userEmail: newUser.email,
    });
  } catch (error) {
    console.log(error.message);
    return res.render("internal-error");
  }
});

authRouter.get("/login", (_req, res) => {
  res.render("login", { layout: "auth" });
});

authRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

authRouter.get("/verify-email", async (req, res) => {
  try {
    // If user is already verified, redirect him back
    if (req.isAuthenticated() && req.user.isVerified) {
      return res.redirect("back");
    }

    // Check if token exists in url query "token"
    const { token } = req.query;
    if (!token) {
      req.flash(
        "missingTokenError",
        "Verification token is missing, make sure you have copied the url properly"
      );
      return res.render("verify-email");
    }

    // Verify token
    const payload = verifyToken(token);

    // Verify that token is not used before
    // Context: After a token is used to verify an account,
    //          it is deleted from database
    const tokenExists = await TokenModel.findOne({ token });
    if (!tokenExists) {
      req.flash("invalidTokenError", "Verification token is invalid");
      return res.render("verify-email", { layout: "auth" });
    }

    // Check if user exists
    const { userID } = payload;
    const user = await UserModel.findById(userID);
    if (!user) {
      req.flash("emailVerificationError", "User no longer exists");
      res.render("verify-email", { layout: "auth" });
    }

    await UserModel.findByIdAndUpdate(userID, { isVerified: true });
    await TokenModel.findByIdAndDelete(tokenExists._id);
    req.flash(
      "emailVerificationSuccess",
      "Your email has been verified successfully!"
    );
    res.render("verify-email", { layout: "auth" });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      req.flash(
        "tokenExpiredError",
        "Verification token has expired, request a new verification link"
      );
    } else if (err.name === "JsonWebTokenError") {
      req.flash("invalidTokenError", "Verification token is invalid");
    } else {
      res.render("internal-error");
    }
    return res.render("verify-email", { layout: "auth" });
  }
});

authRouter.post("/resend-verification-email", async (req, res) => {
  const { email } = req.body;
  // Check if email is given and is valid
  if (!email) {
    req.flash("resendVerificationError", "Please enter your email address");
    return res.redirect("back");
  }
  if (!validator.isEmail(email)) {
    req.flash("resendVerificationError", "Invalid email address");
    return res.redirect("back");
  }

  // Check if a user is registered on the given email
  const user = await UserModel.findOne({ email });
  if (!user) {
    req.flash("resendVerificationError", "Account not found");
    return res.redirect("back");
  }

  // Check if the email is already verified or not
  if (user.isVerified) {
    req.flash("resendVerificationError", "Email is already verified");
    return res.redirect("back");
  }

  // Create a verification link and save it in database
  const { token, verificationLink } = createVerificationLink(user._id);
  await TokenModel.create({ token });

  // Send verification email
  await sendVerificationEmail(user.email, verificationLink);

  req.flash("resendVerificationSuccess", "Email sent!");
  return res.redirect("back");
});

authRouter.post("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) return res.render("internal-error");
    return res.redirect("/");
  });
});

export default authRouter;
