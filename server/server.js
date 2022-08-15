const express = require("express");
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const routerProducts = require("./routersForApi/routerProducts")

app.get("/", (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/../public/index.html`));
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routerProducts);
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})