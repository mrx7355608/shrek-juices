import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import hpp from "hpp";
import path from "path";
import session from "express-session";
import passport from "passport";
import mongoStore from "connect-mongodb-session";
import __dirname from "./utils/dirnameImport.js";
import { engine } from "express-handlebars";
import passportSetup from "./passportSetup.js";
import flash from "express-flash";
import authRouter from "./routes/auth.routes.js";
import indexRouter from "./routes/index.routes.js";

const app = express();

// app.use(helmet())
app.use(hpp());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(express.static(path.join(__dirname, "..", "..", "/public")));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "..", "/views"));
app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main.hbs",
    layoutsDir: __dirname + "/../views/layouts",
  })
);
// Sessions setup
const MongoStore = mongoStore(session);
const store = new MongoStore({
  uri: process.env.DB_URL,
  collection: "sessions",
});
app.use(
  session({
    secret: process.env.SESSIONS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
passportSetup();

// ROUTES
// TODO: add rate limiting
app.use("/", indexRouter);
app.use("/auth", authRouter);

app.use((_req, res) => {
  res.render("notfound");
});
app.use((err, req, res, next) => {
  console.log(err);
  res.render("internal-error");
});

export default app;
