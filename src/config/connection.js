const mysql = require("mysql2/promise")
require("dotenv").config()
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    port: process.env.PORTDB,
    password: process.env.PASSWORDDB,
    database: process.env.DATABASE
})
module.exports = pool