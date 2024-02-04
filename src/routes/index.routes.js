import { Router } from "express";
import {
  sendContactEmail,
  sendOrderPlacedEmailToAdmin,
  sendOrderPlacedEmailToCustomer,
} from "../utils/emails.js";
import validator from "validator";
import JuiceModel from "../models/juices.model.js";
import convertJuiceTypeName from "../utils/convertJuiceTypeName.js";
import juiceTypeValidator from "../validators/juiceType.validator.js";
import removeSensitiveUserInfoMiddleware from "../middlewares/removeSensitiveUserInfo.middleware.js";

const indexRouter = Router();

indexRouter.use(removeSensitiveUserInfoMiddleware);

indexRouter.get("/", async (_req, res) => {
  const randomJuices = await JuiceModel.aggregate([{ $sample: { size: 20 } }]);
  res.render("home", { juices: randomJuices });
});
indexRouter.get("/contact-us", (_req, res) => {
  res.render("contactus");
});
indexRouter.get("/franchising", (_req, res) => {
  res.render("franchising");
});
indexRouter.get("/store-location", (_req, res) => {
  res.render("storelocation");
});
indexRouter.get("/juices/:type", async (req, res) => {
  const { type } = req.params;
  const isValid = juiceTypeValidator(type);
  if (!isValid) {
    return res.render("notfound");
  }
  const juices = await JuiceModel.find({ type }).lean();
  res.render("juices-page", { type: convertJuiceTypeName(type), juices });
});
indexRouter.get("/order/:juiceID", async (req, res) => {
  // Validate juice id
  const { juiceID } = req.params;
  if (!validator.isMongoId(juiceID)) {
    return res.render("notfound");
  }

  // Check if juice exists
  const juice = await JuiceModel.findById(juiceID).lean();
  if (!juice) {
    return res.render("notfound");
  }
  // Render order page with juice details
  res.render("order-page", { juice, user: req.user });
});

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
  const { email } = req.user;
  const { address, phoneNumber } = req.body;
  const adminEmail = process.env.EMAIL_SENDER;
  await sendOrderPlacedEmailToCustomer(email, juice);
  await sendOrderPlacedEmailToAdmin(
    adminEmail,
    email,
    address,
    phoneNumber,
    juice
  );
  req.flash("orderSuccess", "Your order has been placed!");
  res.redirect("back");
});

export default indexRouter;
