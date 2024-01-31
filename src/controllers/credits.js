const credits = require("../models/credits");

async function getCredits(req, res) {
    const credit = await credits.states()
    res.render("./layouts/portal" ,{
        partialMain: "../partials/table",
        data: credit,
        table: "Creditos"})
}

async function getCreditsHistory(req, res) {
    const credit = await credits.history()
    res.render("./layouts/portal" ,{
        partialMain: "../partials/table",
        data: credit,
        table: "Historial de creditos"})
}
module.exports = {
    getCredits,
    getCreditsHistory
}