const express = require("express");
const path = require('path');
const handlebars = require("express-handlebars");

const app = express();
const PORT = process.env.PORT || 3000;
const routerProducts = require("./routersForApi/routerProducts");

app.engine("hbs", handlebars.engine({
    extname: "hbs",
    defaultLayout: "index.hbs",
    layoutsDir: path.resolve(__dirname + "/../views/layouts/"),
    partialsDir: path.resolve(__dirname + "/../views/partials/")
}));
app.set("view engine", "hbs");
app.set("views", path.resolve(__dirname + "/../views/layouts/"));

app.get("/", (req, res) => {
    res.render(`home`);
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", routerProducts);

app.get("/api/products/:id", (req, res) => {
    return res.render("individualProduct", {product: res.locals.product, exists: res.locals.exist})
})
app.get("/api/products", (req, res) => {
    return res.render("store", {products : res.locals.products, noProducts: res.locals.products.length === 0})
})
app.get("/api/addProduct", (req, res) => {
    return res.render("form")
})
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})