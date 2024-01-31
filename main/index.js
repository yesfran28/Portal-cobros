const express = require("express");
const morgan = require("morgan")
const path = require('path');
const cookieParser = require("cookie-parser")
const session = require("express-session")

const routerControl = require("./src/routes/root.js");
const app = express();
//Settings
app.set("view engine", "ejs")
app.set('views', path.join(__dirname, 'views'));
//Middlewares
app.use(express.static(path.join(__dirname, "./src/public")))
app.use(morgan("dev"));
app.use(cookieParser())

app.use(express.urlencoded({extended: false}))
//express session
app.use(express.json())
app.use(session({
    secret: "mysecretsxd",
    resave: true,
    saveUninitialized: true
}));

//Routes
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

app.use((req, res, next)=>{
if (!res.locals.session.user)
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
next();
});

app.use(routerControl)

app.use((req, res, next)=>{
    res.status(404).send(`<h1 style='font-size: 9em; text-align:
    center; margin-top: 1em; color: ff002a;'>404</h1> 
    <h2 style="text-align: center; margin-top: 1em;">PAGE NOT FOUND</h2>`)
    next()
})
 //Run application
const port = process.env.PORT || 5000;
app.listen(port, ()=> console.log("Server in port:", port));