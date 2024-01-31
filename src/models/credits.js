const { pool } = require("../config/connection")

const credits = {
    create:async (nombre, descripcion, precio)=>{
        await pool.promise().query(`
        INSERT INTO producto (nombre, descripcion, precio) VALUES(?,?,?)
        `, [nombre, descripcion, precio])
    },
    history: async ()=>{
        const [rows] = await pool.promise().query(`
        SELECT CONCAT(cl.nombres, ' ', cl.apellidos) AS cliente,
        CONCAT(prd.nombre, ' ',prd.descripcion) AS producto, 
        dc.cantidad,dc.fecha, dc.hora, 
        dc.cantidad*(SELECT precio FROM producto WHERE id = dc.id_producto) 
        AS monto FROM detalle_credito dc JOIN 
        credito cd ON cd.id = dc.id_credito JOIN producto 
        prd ON dc.id_producto = prd.id JOIN cliente cl ON cd.id_cliente = cl.id
        `)
        return rows
    },
    states: async ()=>{
        const [rows] = await pool.promise().query(`
        SELECT CONCAT(c.nombres, ' ',c.apellidos) AS cliente, SUM(cr.monto) AS monto,
        ec.estado FROM cliente c JOIN
        credito cr ON c.id = cr.id_cliente JOIN
        estado_cuenta ec ON cr.id_estado_cuenta = ec.id
        GROUP BY c.nombres, ec.estado, c.apellidos;
    `)
       return rows
    },
    amount: async ()=>{
        const [rows] = await pool.promise().query(`
        SELECT COUNT(*) FROM credito
        `)
    }
}
module.exports = credits