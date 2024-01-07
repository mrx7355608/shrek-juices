import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import hpp from "hpp";
import path from "path";
import __dirname from "./utils/dirnameImport.js";
import { engine } from "express-handlebars";
import JuiceModel from "./models/juices.model.js";

const app = express();

// app.use(helmet())
app.use(hpp());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "..", "/public")));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "..", "/views"));
app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main.hbs",
    layoutsDir: __dirname + "/../views/layouts",
  }),
);

app.get("/", (_req, res) => {
  res.render("home");
});

app.get("/contact-us", (_req, res) => {
  res.render("contactus");
});

app.get("/feedback", (_req, res) => {
  res.render("feedback");
});

app.get("/franchising", (_req, res) => {
  res.render("franchising");
});

app.get("/store-location", (_req, res) => {
  res.render("storelocation");
});

app.get("/products/:type", async (req, res) => {
  const { type } = req.params;
  const juices = await JuiceModel.find({ type }).lean();
  res.render("juices-page", { type, juices });
});

export default app;
