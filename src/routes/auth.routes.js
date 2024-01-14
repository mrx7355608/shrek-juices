import { Router } from "express";
import UserModel from "../models/user.model.js"

const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
    /*
        * TODO: validate user data
    */
    const newUser = await UserModel.create(req.body)
    console.log(newUser);

    /*
        * TODO: send verification email
    */

    res.render("signup-success-message", { 
        layout: "auth", 
        userEmail: newUser.email 
    })
})

export default authRouter;
