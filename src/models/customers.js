const { pool } = require("../config/connection");

class customers {
    constructor(){}
    static async getCustomers() {
       const [rows] = await pool.promise().query("SELECT nombres as cliente, (SELECT turno FROM turno WHERE id = cliente.id_turno) AS turno FROM cliente LIMIT 100")
       return rows
    }
    static async getCustomersSub() {
        const [rows] = await pool.promise().query(`SELECT 
        CONCAT(c.nombres, ' ', c.apellidos) AS cliente, s.celular,
        CASE  WHEN s.suscripcion_push = '0' THEN 'no' ELSE 'si' END AS push FROM cliente c
        JOIN suscripcion s ON c.id = s.id_cliente
 `)
        return rows
     }
     static async create(nombres, apellidos, celular = false, turnos) {
        await pool.promise().query(`
        INSERT INTO cliente (nombres, apellidos, id_turno)
        VALUES(?,?,(SELECT id FROM turno WHERE turno = ?))`, 
        [nombres, apellidos, turnos])
      if (celular) {
         await pool.promise().query(`
        INSERT INTO suscripcion (suscripcion_push,celular, endpoint,smptp, id_cliente)
        VALUES(0,?,0,0,LAST_INSERT_ID())`, 
        [celular])
      } 
     }
}
module.exports = {customers}