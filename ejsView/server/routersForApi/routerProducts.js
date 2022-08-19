const express = require("express");
const { Router } = express;
const routerProducts = Router();
const routerIndividualProduct = require("./routerIndividualProducts");

const FileHandler = require("../../../fileHandlers/FileHandler.js");

const fileHandler = new FileHandler("./fileHandlers/products.txt");

routerProducts.get("/products", async (req, res, next) => {
    res.locals.products = await fileHandler.getAll();
    next();
})
routerProducts.post("/products", async (req, res, next) => {
    const newProduct = req.body;
    try {
        const newId = await fileHandler.save(newProduct);
        if (newId === null) {
            const error = new Error("The product already exists");
            error.httpStatusCode = 400;
            return res.status(400).send(`Error ${error.httpStatusCode}: ${error.message}`);
        }
        res.send(`${newId}`);
        next();
    }catch(error) {
        const errorAssign = new Error("The product already exists");
        errorAssign.httpStatusCode = 400;
        res.status(400).send(`Error`);
        next();
    }
})

routerProducts.use("/products", routerIndividualProduct);

module.exports = routerProducts;