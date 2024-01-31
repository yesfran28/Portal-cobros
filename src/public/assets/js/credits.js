var customer = document.getElementById("customer")
var amount = document.getElementById("amount")
var product = document.getElementById("product")
var thbodyPed = document.getElementById("tbody-products")
var spanTotal = document.getElementById("span-total")
var counter = 0;
var productList = []
var customerList = []

document.querySelector("#form-cred").addEventListener("submit", (e)=>{
    e.preventDefault()
    createProduct()
    document.querySelectorAll(".td-prod").forEach(td=>{
        console.log(td.textContent);
    })
})


function addProductInlist(prod, prec) {
    const objProd = {prod, prec}
    productList.push(objProd)
    console.log(productList);
}
async function createProduct() {
    const amountValue = amount.value
    const customerValue = customer.value
    const productValue = product.value
    const existProd = await verifyProduct(productValue)

    const condition = amountValue && customerValue && productValue && existProd.length != 0 && amountValue !=0
    if (condition) {
        const tr = document.createElement("tr")
        const tdprd = document.createElement("td")
        const tdCant = document.createElement("td")
        const tdMnt = document.createElement("td")
        const tdAcc = document.createElement("td")
    
        const iDelt = document.createElement("i")
    
        
        tdCant.textContent = amountValue
        tdprd.textContent = productValue
        tdMnt.textContent = parseInt(amountValue)*parseInt(existProd[0].precio)
     
        
        tdprd.classList.add("td-prod")
        tdMnt.classList.add("td-mnt")
        tdCant.classList.add("td-cant")
        tdAcc.classList.add("td-acc")
        iDelt.classList.add("bi-trash")
        
        tdAcc.append(iDelt)
        tr.append(tdprd, tdCant, tdMnt, tdAcc)
        thbodyPed.appendChild(tr)
        addProductInlist(productValue, existProd[0].precio)
        updateTotal()
    }
}
async function verifyProduct(prod) {
    const name = prod.slice(0, prod.indexOf(" "))
    const descrp = prod.slice(prod.indexOf(" ")+1, prod.length)
    const objPrd = {
        name, descrp
    }
    const options = {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(objPrd)
    }
    const req = await fetch("/verifyproduct", options)
    const dataProd = await req.json()
    return dataProd;
}

document.querySelector("tbody").addEventListener("click", (e)=>{
    const target = e.target
    const className = target.className
    if (className === "bi-trash") deltProductReg(target)
})
// Debes inicializar counter antes de usarlo

function deltProductReg(target) {
    const parent = target.parentNode.parentNode;
    const mnt = parseFloat(target.parentNode.previousElementSibling.textContent);

    // Resta el monto del elemento eliminado al contador total
    counter -= mnt;

    // Actualiza el texto del elemento spanTotal
    spanTotal.textContent = counter.toFixed(2);

    // Elimina el elemento del DOM
    thbodyPed.removeChild(parent);
}

function updateTotal() {
    counter = 0; // Reinicia el contador antes de recalcular

    const monto = document.querySelectorAll(".td-mnt");
    monto.forEach(mt => {
        counter += parseFloat(mt.textContent);
    });

    // Actualiza el texto del elemento spanTotal
    spanTotal.textContent = counter.toFixed(2);
}

