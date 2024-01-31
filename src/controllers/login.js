const bcrypt = require("bcryptjs")
const {pool}  = require("../config/connection")
const jwt = require("jsonwebtoken")
const { promisify } = require("util")
async function login(req, res) {
    
    try {
        const { username, password } = req.body
        //verificamos si los inputs estan vacios utilizo ese alerta de sweetalert
        if (!username || !password) {
            res.json({msg: "Campos vacios"})
        } else {
            //consultamos a la db si existe un correo coincidente al de el usuario
            const [rows] = await pool.promise().query(`SELECT * FROM autenticacion WHERE usuario = ?`, [username])
            //en caso de que exista ese correo verificamos si la contraseña es la misma del registro, la estamos desencrintando
            if (rows.length == 1 && !(await bcrypt.compare(password, rows[0].contrasena))) {
            //en este bloque recuperamos la id del usuario para guardarla en la caché de la session y consultar la cantidad de intentos fallidos
                const [query] = await pool.promise().query(`SELECT intentos FROM autenticacion  WHERE id = ? `, [1])
                let intnts = query[0].intentos
                //en este condicional le restringimos al usuario a que no ingrese mas de 5 contraseñas incorrectas
                if (intnts <= 5) {
                    // contraseña invalida
                    res.json({msg: "Contraseña  incorrecta, intente nuevamente"})
                    await pool.promise().query(`UPDATE autenticacion SET intentos = intentos +1 WHERE id = ?`, [1]) //se actualiza en la db 
                } else {
                    //se ejecuta este codigo el cual evita que se inicie sesion cuando los intentos son mayores que 5
                    setTimeout(() => {
                        pool.promise().query(`UPDATE autenticacion SET intentos = ? WHERE id = ?`, [0, 1])
                    }, 60000);
                    res.json({msg: "Ha alcanzado el limite de intentos, intente luego"})
                }
            }
            //acá verificamos si no hay ningun registro coincidente con ese correo del usuario en la variable rows (array con el registro consultado en la db)
            else if (rows.length === 0 || !(await bcrypt.compare(password, rows[0].contrasena))) {
                // correo invalido
                res.json({msg: "Usuario invalido"})
            }
            else {
                //se sastiface a esta condicion para dejar ingresar al usuario
                //recuperamos la cantidad de intentos registrados de nuevo invocamos la id para hacer la consulta 
                //posteriormente se actualiza la propiedad intFal correspondiente al objeto guardado en la session
                let id = rows[0].id
                const [query] = await pool.promise().query(`SELECT intentos FROM autenticacion  WHERE id = ?`, [id])
                let ints =  query[0].intentos
                if (ints > 5) {
                //en esta parte el usuario ya ingreso su contraseña correcta
                //volvemos a verificar si los intentos son mayores a 5 y le negamos el acceso 
                // acceso denegado
                res.json({msg: "Acceso denegado"})
                } else {
                    //le damos una cookie para cuando intente acceder ya no tenga necesidad de ingresar sus credenciales 
                    const id = rows[0].id
                    res.locals.session.user = rows[0]
                    const token = jwt.sign({ id }, "mysecretsxd", {
                        expiresIn: "7d"
                    })
                    var cookiesOption = {
                        expires: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie("sistema_auto", token, cookiesOption).redirect("/dashboard")
                    await pool.promise().query(`UPDATE autenticacion SET intentos = ? WHERE id = ?`, [0, 1])
                }
            }
        }
    } catch (error) {
        res.json({msg: "Ha ocurrido un error"})
        console.log(error)
    }
}

//esta funcion es invocada en todas las rutas protegidas para verificar si el usuario se ha loggeao o no
async function isAuthenticated(req, res, next) {
try {
    if (req.cookies.sistema_auto){
        decodificaed = await promisify(jwt.verify)(req.cookies.sistema_auto, "mysecretsxd")
    
        pool.query(`SELECT * FROM autenticacion WHERE id = ?`, [decodificaed.id], (err, results) => {
            if (!results) return next()
            res.locals.session.user = results[0]
    })
} else{
    res.redirect("/login")
}
return next()
} catch (error) {
console.log(error);
}
}

//se usa esta funcion para borrar la cookie de session si el usuario decide salir de la aplicación 
function logout(req, res) {
    res.clearCookie("sistema_auto")
    return res.redirect(`/login`)
}



module.exports = {
    login,
    isAuthenticated,
    logout
}
// contraseña de superadmin
//  Jp2=JpXn6~Xn

/* 
Es importante tener cuidado con las modificaciones de este archivo, recomendable enteder bien lo que hemos hecho 
por si sucede un error saber cual es su causa rapidamente 

*/