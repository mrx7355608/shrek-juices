import { Router } from "express";
import JuiceModel from "../models/juices.model.js";
import convertJuiceTypeName from "../utils/convertJuiceTypeName.js";

const viewsRouter = Router();

viewsRouter.get("/", (_req, res) => {
  res.render("home");
});

viewsRouter.get("/contact-us", (_req, res) => {
  res.render("contactus");
});

viewsRouter.get("/feedback", (_req, res) => {
  res.render("feedback");
});

viewsRouter.get("/franchising", (_req, res) => {
  res.render("franchising");
});

viewsRouter.get("/store-location", (_req, res) => {
  res.render("storelocation");
});

viewsRouter.get("/juices/:type", async (req, res) => {
  const { type } = req.params;
  const juices = await JuiceModel.find({ type }).lean();
  res.render("juices-page", { type: convertJuiceTypeName(type), juices });
});

viewsRouter.get("/login", (_req, res) => {
    res.render("login", { layout: "auth" })
})

viewsRouter.get("/signup", (_req, res) => {
    res.render("signup", { layout: "auth" })
})

viewsRouter.get("/order/:juiceID", async (req, res) => {
    const { juiceID } = req.params
    const juice = await JuiceModel.findById(juiceID).lean();
    res.render("order-page", { juice })
})

export default viewsRouter;
