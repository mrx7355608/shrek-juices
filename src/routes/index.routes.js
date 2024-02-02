import { Router } from "express";
import {
  sendContactEmail,
  sendOrderPlacedEmailToAdmin,
  sendOrderPlacedEmailToCustomer,
} from "../utils/emails.js";
import validator from "validator";
import JuiceModel from "../models/juices.model.js";

const indexRouter = Router();

// TODO: add missing functionality
indexRouter.post("/contact-us", async (req, res) => {
  const data = req.body;
  /*
        TODO: validate the input
    */
  // const err = contactValidator(data);

  // Send email
  sendContactEmail(data.email, data.message);
  req.flash("contactFormSuccess", "Your message has been sent successfully!");
  res.redirect("back");
});

// Make sure that the user is authenticated
indexRouter.use((req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("orderError", "Please login to place your order");
    return res.redirect("back");
  }
  return next();
});

// TODO: refactor this mess
indexRouter.post("/order/:juiceID", async (req, res) => {
  const { juiceID } = req.params;
  // validate juice id
  if (!validator.isMongoId(juiceID)) {
    req.flash("orderError", "Invalid juice id");
    res.redirect("back");
  }

  // check if juice exists
  const juice = await JuiceModel.findById(juiceID).lean();
  if (!juice) {
    req.flash("orderError", "Juice not found");
    res.redirect("back");
  }

  // send order confirmation email
  await sendOrderPlacedEmailToCustomer(req.user.email, juice);
  await sendOrderPlacedEmailToAdmin(
    process.env.EMAIL_SENDER,
    req.user.email,
    req.body.address,
    req.body.phoneNumber,
    juice
  );
  req.flash("orderSuccess", "Your order has been placed!");
  res.redirect("back");
});

export default indexRouter;
