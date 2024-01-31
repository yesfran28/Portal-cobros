const products = require("../models/products")

async function getProducts(req, res) {
    const productsData = await products.get()
    res.render("./layouts/portal", {partialMain: "../partials/table", 
    table: "Productos", data: productsData
})
}

async function createProduct(req, res) {
    try {
        const {nombre, descripcion, precio} = req.body
        await products.create(nombre, descripcion, precio)
        res.json({msg: "exito"})
    } catch (error) {
        console.log(error);
    }
}
module.exports = {getProducts, createProduct}