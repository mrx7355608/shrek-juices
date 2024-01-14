import { Router } from "express";
import UserModel from "../models/user.model.js"
import passport from "passport";
import { signupSchema } from "../validators/auth.validators.js";

const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
    try {
        // Validate user data
        const { error } = signupSchema.validate(req.body, { abortEarly: false });
        const { details } = error;

        /*
            * TODO: find another method for this code block
        */
        if (error) {
            for (let i = 0; i < details.length; i++) {
                if (details[i].path[0] === "firstname") {
                    req.flash("firstNameError", details[i].message)
                }
                if (details[i].path[0] === "lastname") {
                    req.flash("lastNameError", details[i].message)
                }
                if (details[i].path[0] === "email") {
                    req.flash("emailError", details[i].message)
                }
                if (details[i].path[0] === "password") {
                    req.flash("passwordError", details[i].message)
                }
                if (details[i].path[0] === "confirm_password") {
                    req.flash("confirmPasswordError", details[i].message)
                }
            }
            return res.redirect("back")
        }

        /*
            * TODO: check if email is already registered or not
        */

        // Add user in db
        const newUser = await UserModel.create(req.body);

        /*
            * TODO: send verification email
        */

        res.render("signup-success-message", { 
            layout: "auth", 
            userEmail: newUser.email 
        })
    } catch (error) {
        return res.render("internal-error");
    }
})

authRouter.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))

export default authRouter;
