const { Router } = require("express");
const { login, logout, isAuthenticated } = require("../controllers/login");
const { renderCustomers, renderCustomersSub, formCreateCustomers, createCustomer } = require("../controllers/customers");
const { getCredits, getCreditsHistory } = require("../controllers/credits");
const { getProducts, createProduct } = require("../controllers/products");
const { getVapidHeaders } = require("web-push");
const { pool } = require("../config/connection");
const routerControl = Router()

routerControl.get("/", (req, res)=>{
    res.render("layouts/control/index")
})

routerControl.post("/", (req, res)=>{
    createRequest(req)
})

routerControl.get("/login", (req, res)=>{
    res.render("login")
    })
routerControl.post("/login", (req, res)=>{
        login(req, res)
    })

routerControl.get("/logout", (req, res)=>{
   logout(req, res)
})

routerControl.get("/settingaccount", (req, res)=>{
    logout(req, res)
 })

routerControl.post("/rejectreq", (req, res)=>{
    updReqWait(req)
})

routerControl.get("/dashboard", isAuthenticated, (req, res) => {
    res.render("./layouts/portal", { partialMain: "../partials/dashboard" });
})
// customers
routerControl.get("/newcustomer", isAuthenticated,(req, res)=>{
    formCreateCustomers(req, res)
})
routerControl.post("/newcustomer", isAuthenticated,(req, res)=>{
    createCustomer(req, res)
})
routerControl.get("/customers", isAuthenticated,(req, res)=>{
    renderCustomers(req, res)
})
routerControl.get("/suscriptors",isAuthenticated, (req, res)=>{
    renderCustomersSub(req, res)
})
// credits
routerControl.get("/credits",isAuthenticated, (req, res)=>{
    getCredits(req, res)
})

routerControl.get("/creditshistory", isAuthenticated,(req, res)=>{
    getCreditsHistory(req, res)
})

routerControl.get("/newcredit", isAuthenticated,async(req, res)=>{
    const [rows] = await  pool.promise().query("SELECT CONCAT(nombres, ' ', apellidos) as cliente FROM cliente")
    const [rowsProd] = await  pool.promise().query("SELECT CONCAT(nombre, ' ', descripcion) as producto FROM producto")
    res.render("./layouts/portal" ,{
        partialMain: "../partials/form",
        products: rowsProd,
        data: rows,
        form: "Registro de credito"})
})

routerControl.get("/products", isAuthenticated,(req, res)=>{
    getProducts(req, res)
})

routerControl.get("/newproduct", isAuthenticated,(req, res)=>{
    res.render("./layouts/portal" ,{
        partialMain: "../partials/form",
        form: "registro de producto"})
})
routerControl.post("/newproduct", isAuthenticated,(req, res)=>{
    createProduct(req, res)
})

routerControl.get("/setting", isAuthenticated,(req, res)=>{
    res.render("./layouts/control/control" ,{
        page: "./partials/table",
    titlePage: "Demos Activas"})
})

routerControl.post("/verifyproduct", isAuthenticated,async(req, res)=>{
    const {name, descrp} = req.body
    const [rows] = await pool.promise().query("SELECT nombre,descripcion, precio FROM producto WHERE nombre = ? AND descripcion = ?", [name, descrp])
    res.json(rows)
})


routerControl.get("/", ()=>{})
module.exports = routerControl