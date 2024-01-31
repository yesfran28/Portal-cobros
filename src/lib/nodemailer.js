const genComponent = require("../models/componentEmail");
const nodemailer = require("nodemailer");
require("dotenv").config()

const sendEmail = async (dataEmail) =>{
    const {email,subj, component, txt} = dataEmail
    const config = {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: "castrillorodriguez28@gmail.com",
            pass: process.env.EMAILKEY
        }
    }
    // async..await is not allowed in global scope, must use a wrapper
    const mensaje = {
        from: "castrillorodriguez28@gmail.com", // sender address
        to: email, // list of receivers
        subject: subj, // Subject line
        text: txt, // plain text body
        html: genComponent(component, dataEmail) // html body
    }
    const transporter = nodemailer.createTransport(config);
    await transporter.sendMail(mensaje)
}
    module.exports = {
        sendEmail
    }