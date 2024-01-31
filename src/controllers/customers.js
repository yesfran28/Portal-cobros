const { pool } = require("../config/connection");
const { customers } = require("../models/customers");

async function renderCustomers(req, res){
    try {
        const customersResult = await customers.getCustomers()
        res.render("./layouts/portal", {
            partialMain: "../partials/table",
            table: "Clientes",
            data: customersResult
        })
    } catch (error) {
        console.log(error);
    }
}

async function renderCustomersSub(req, res){
    try {
        const customersResult = await customers.getCustomersSub()
        res.render("./layouts/portal", {
            partialMain: "../partials/table",
            table: "Suscriptores",
            data: customersResult
        })
    } catch (error) {
        console.log(error);
    }
}

async function formCreateCustomers(req, res) {
    const [turnosReg] = await pool.promise().query("SELECT turno FROM turno")
    res.render("./layouts/portal", {partialMain: "../partials/form", 
    form: "Registro de cliente",
    data: turnosReg
})
}

async function createCustomer(req, res) {
    try {
        const {firstname, lastname, phone, turno} = req.body
        customers.create(firstname, lastname, phone, turno)
        res.json({msg: "exito"})
    } catch (error) {
        console.log(error);
    }
}

module.exports = {renderCustomers,formCreateCustomers, renderCustomersSub, createCustomer}