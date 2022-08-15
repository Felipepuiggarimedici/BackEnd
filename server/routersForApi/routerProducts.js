const express = require("express");
const { Router } = express;
const routerProducts = Router();
const routerIndividualProduct = require("./routerIndividualProducts");

const FileHandler = require("./../../fileHandlers/FileHandler.js");

const fileHandler = new FileHandler("./fileHandlers/products.txt");

routerProducts.get("/products", async (req, res) => {
    return res.send(await fileHandler.getAll());
})
routerProducts.post("/products", async (req, res) => {
    const newProduct = req.body;
    try {
        const newId = await fileHandler.save(newProduct);
        if (newId === null) {
            const error = new Error("The product already exists");
            error.httpStatusCode = 400;
            return res.send(`Error ${error.httpStatusCode}: ${error.message}`);
        }
        return res.send(`${newId}`);
    }catch(error) {
        const errorAssign = new Error("The product already exists");
        errorAssign.httpStatusCode = 400;
        return res.send(`Error`);
    }
})

routerProducts.use("/products", routerIndividualProduct);

module.exports = routerProducts;