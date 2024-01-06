import express from "express"
import morgan from "morgan"
import helmet from "helmet"
import hpp from "hpp"
import path from "path"
import __dirname from "./utils/dirnameImport.js";
import { engine } from "express-handlebars"

const app = express();

// app.use(helmet())
app.use(hpp())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// Serve css and images
app.use(express.static(path.join(__dirname, "..", "..", "/public")))
/*
    * TODO: setup view engine
*/

app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "..", "/views"))
app.engine(".hbs", engine({
    extname: ".hbs",
    defaultLayout: "main.hbs",
    layoutsDir: __dirname + "/../views/layouts"
}))

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/contact-us", (req, res) => {
    res.render("contactus")
})

app.get("/feedback", (req, res) => {
    res.render("feedback")
})

app.get("/franchising", (req, res) => {
    res.render("franchising")
})

app.get("/store-location", (req, res) => {
    res.render("storelocation")
})

app.get("/products/fruits-juice", (req, res) => {
    res.render("fruit")
})

app.get("/products/vegetables-juice", (req, res) => {
    res.render("vegetablejuice")
})

export default app;
