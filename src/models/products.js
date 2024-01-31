const { pool } = require("../config/connection")

const products = {
    get:async ()=>{
        const [rows] = await pool.promise().query("SELECT CONCAT(nombre,' ', descripcion) AS producto, precio, (SELECT estado FROM estado_producto WHERE id = producto.id_estado) AS estado FROM producto")
        return rows
    },
    getPrice:async (nombre, descripcion, precio)=>{
        await pool.promise().query("SELECT precio FROM producto WHERE nombre = ? AND descripcion = ?", [nombre,descripcion])
   },
    create:async (nombre, descripcion, precio)=>{
         await pool.promise().query("INSERT INTO producto (nombre,id_estado, descripcion, precio) VALUES(?,?,?,?)", [nombre,1, descripcion, parseFloat(precio)])
    }
}
module.exports = products