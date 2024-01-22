import { Router } from "express"
import { sendContactEmail } from "../utils/emails.js";
import contactValidator from "../validators/contactus.valdiator.js";

const indexRouter =  Router();

indexRouter.post("/contact-us", async (req, res) => {
    const data = req.body;
    /*
        TODO: validate the input
    */
    // const err = contactValidator(data);

    // Send email
    sendContactEmail(data.email, data.message);
    req.flash("contactFormSuccess", "Your form has been sent successfully!");
    res.redirect("back");
})

export default indexRouter;
