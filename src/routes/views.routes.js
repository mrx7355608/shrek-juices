import { Router } from "express";
import JuiceModel from "../models/juices.model.js";
import convertJuiceTypeName from "../utils/convertJuiceTypeName.js";
import juiceTypeValidator from "../validators/juiceType.validator.js";
import validator from "validator";

const viewsRouter = Router();

viewsRouter.use((req, res, next) => {
  const user = req.user;
  if (user) {
    user.password = undefined;
    user.__v = undefined;
  }

  res.locals.user = user;
  return next();
});

viewsRouter.get("/", async (_req, res) => {
  const randomJuices = await JuiceModel.aggregate([{ $sample: { size: 20 } }]);
  res.render("home", { juices: randomJuices });
});

viewsRouter.get("/contact-us", (_req, res) => {
  res.render("contactus");
});

viewsRouter.get("/franchising", (_req, res) => {
  res.render("franchising");
});

viewsRouter.get("/store-location", (_req, res) => {
  res.render("storelocation");
});

viewsRouter.get("/juices/:type", async (req, res) => {
  const { type } = req.params;
  const isValid = juiceTypeValidator(type);
  if (!isValid) {
    return res.render("notfound");
  }
  const juices = await JuiceModel.find({ type }).lean();
  res.render("juices-page", { type: convertJuiceTypeName(type), juices });
});

viewsRouter.get("/order/:juiceID", async (req, res) => {
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

viewsRouter.get("/resend-verification-email", (_req, res) => {
  res.render("resend-verification-email", { layout: "auth" });
});

export default viewsRouter;
