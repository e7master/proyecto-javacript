const IVA = 0.21;

const productos = [
    {id: 1, nombre: "Mouse", precio: 16000},
    {id: 2, nombre: "Monitor", precio: 45000},
    {id: 3, nombre: "Teclado", precio: 24000},
    {id: 4, nombre: "Auriculares", precio: 31000},
    {id: 5, nombre: "Mousepad", precio: 8000}
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const catalogoDiv = document.getElementById("catalogo");
const carritoDiv = document.getElementById("carrito");
const totalesDiv = document.getElementById("totales");
const btnFinalizar = document.getElementById("btn-finalizar");
const btnVaciar = document.getElementById("btn-vaciar");
const mensajeDiv = document.getElementById("mensaje");

function renderCatalogo() {
    catalogoDiv.innerHTML = "";
    productos.forEach(prod => {
        const item = document.createElement("div");
        item.innerHTML = `
            ${prod.nombre} - $${prod.precio}
            <button onclick="agregarAlCarrito(${prod.id})"> Agregar </button>
        `;
        catalogoDiv.appendChild(item);
    });
}

function renderCarrito(){
    carritoDiv.innerHTML = "";
    carrito.forEach(item => {
        const linea = document.createElement("div");
        linea.innerHTML = `
            ${item.nombre} x${item.cantidad} - $${item.precioUnit * item.cantidad}
            <button onclick="eliminarItem(${item.id})"> X </button>
        `;
        carritoDiv.appendChild(linea);
    });

    calcularTotales();
}

function calcularTotales(){
    let subtotal = carrito.reduce((acc, item) => acc + (item.precioUnit * item.cantidad), 0);
    let montoIva = subtotal * IVA;
    let total = subtotal + montoIva;

    totalesDiv.innerHTML = `
        Subtotal: $${subtotal} <br>
        IVA (${IVA * 100}%): $${montoIva.toFixed(2)} <br>
        TOTAL: $${total.toFixed(2)}
    `;
}

// Agregar producto al carrito
function agregarAlCarrito(id){
    const prod = productos.find(p => p.id === id);
    const itemExistente = carrito.find(item => item.id === id);

    if (itemExistente){
        itemExistente.cantidad++;
    } else {
        carrito.push({...prod, cantidad: 1, precioUnit: prod.precio});
    }

    guardarCarrito();
    renderCarrito();
}

function eliminarItem(id){
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    renderCarrito();
}

btnVaciar.addEventListener("click", () =>{
    carrito = [];
    guardarCarrito();
    renderCarrito();
    mensajeDiv.innerHTML = "";
});

// Finalizar compra
btnFinalizar.addEventListener("click", () =>{
    if (carrito.length === 0){
        totalesDiv.innerHTML = "El carrito esta vacio";
        mensajeDiv.innerHTML = "";
        return;
    }

    mensajeDiv.innerHTML = "<strong>Compra confirmada!</strong>";

    carrito = [];
    guardarCarrito();
    renderCarrito();
});

function guardarCarrito(){
    localStorage.setItem("carrito", JSON.stringify(carrito));
}


renderCatalogo();
renderCarrito();

