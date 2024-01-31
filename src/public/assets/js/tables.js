var trSolc = document.querySelector(".thbody-solicitud");
trSolc.addEventListener("click", (e)=>{
    const target = e.target;
    const idTarget = target.getAttribute("id")
    const condSolc = idTarget === "icon-ign" || idTarget === "icon-aprb" || idTarget === "icon-elm"
    if (condSolc) manageDemo(target, idTarget)
})


 function manageDemo(target, idTarget) {
    const dataType = target.getAttribute("data-type")
    if(idTarget === "icon-aprb") startReq(target, dataType)
    if(idTarget === "icon-ign") ignReq(target,dataType)
    if(idTarget === "icon-elm") deltReq(target,dataType)
}

async function ignReq(target, dataType) {
    const id = getId(dataType)
    const objReq = {
        id: id
    }
    const options = {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(objReq)
    }
    // await fetch("/rejectdemo", options)
}
async function startReq(target, dataType) {
    const id = getId(dataType)
    const email = getEmail(target)
    const objReq = {
        id: id,
        email:email
    }
    const options = {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(objReq)
    }
    // await fetch("/startdemo", options)
}
async function deltReq(target,dataType) {
    const id = getId(dataType)
    const objReq = {
        id: id
    }
    const options = {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(objReq)
    }
    // await fetch("/deltdemo", options)
    trSolc.removeChild(target.parentNode.parentNode)
}

function getId(dataType) {
    const start = dataType.indexOf("-")
    const end = dataType.length
    const id = dataType.slice(start+1, end)
    return id
}

    const estado = document.querySelectorAll(".estado")
    estado.forEach((std)=>{
        if (std.textContent == "activa") std.classList.add("new-req")
    })
function getEmail(target){
    const email = target.parentNode.parentNode.firstChild.nextElementSibling.textContent
    return email
}