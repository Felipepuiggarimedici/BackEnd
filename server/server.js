const exp = require("constants");
const express = require("express");
const { Router } = express;
const multer = require("multer");
const path = require('path');
const FileHandler = require("./../fileHandlers/FileHandler.js");
const app = express();
const PORT = process.env.PORT || 3000;
const routerProducts = Router();
const routerIndividualProduct = Router();

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
routerIndividualProduct.get("/:id", async(req, res) => {
    const id = parseInt(req.params.id);
    const product = await fileHandler.getById(id);
    if (product === null) {
        const error = new Error("Product does not exist");
        error.httpStatusCode = 404;
        return res.send(`Error ${error.httpStatusCode}: ${error.message}`);
    }
    return res.send(product);
})
routerIndividualProduct.put("/:id", async(req, res) => {
    try {
        const product = {id: parseInt(req.params.id), ...req.body};
        const changeProductResponse = await fileHandler.changeProduct(product);
        if (changeProductResponse === "ID or price should be of type integer and should be specified") {
            const error = new Error(changeProductResponse);
            error.httpStatusCode = 400;
            return res.send(`Error ${error.httpStatusCode}: ${error.message}`);
        } else if (changeProductResponse === "File couldn't be updated") {
            const error = new Error(changeProductResponse);
            error.httpStatusCode = 500;
            return res.send(`Error ${error.httpStatusCode}: ${error.message}`);
        } else if (changeProductResponse === null) {
            const error = new Error("Product already in the file");
            error.httpStatusCode = 400;
            return res.send(`Error ${error.httpStatusCode}: ${error.message}`);
        } else {
            return res.send(`File updated correctly and product inserted with id: ${changeProductResponse}`)
        }
    } catch (error) {
        const errorAssign = new Error("Product was not entered correctly or File entered incorrectly");
        errorAssign.httpStatusCode = 400;
        return res.send(`Error ${errorAssign.httpStatusCode}: ${errorAssign.message}`);
    }
})
routerIndividualProduct.delete("/:id", async(req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            const error = new Error("ID invalid");
            error.httpStatusCode = 400;
            return res.send(`Error ${error.httpStatusCode}: ${error.message}`);
        }
        const idExists = await fileHandler.deleteById(id);
        if (!idExists) {
            return res.send("Product was not found");
        }
        else {
            return res.send("Product eliminated")
        }
    } catch (error) {
        const errorAssign = new Error("File was not entered correctly");
        errorAssign.httpStatusCode = 400;
        return res.send(`Error ${errorAssign.httpStatusCode}: ${errorAssign.message}`);
    }
})

app.get("/", (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/../public/index.html`));
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routerProducts);
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})