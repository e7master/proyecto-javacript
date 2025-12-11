const IVA = 0.21;
const productos = [
    {id: 1, nombre: "Mouse", precio: 16000},
    {id: 2, nombre: "Monitor", precio: 45000},
    {id: 3, nombre: "Teclado", precio: 24000},
    {id: 4, nombre: "Auriculares", precio: 31000},
    {id: 5, nombre: "Mousepad", precio: 8000}
];

let carrito = [];

// Catalogo de productos
function mostrarCatalogo(){
    let mensaje = "Catalogo de productos disponibles: \n"
    console.clear()
    console.log("---Catalogo de productos---")
    for (let i=0; i<productos.length; i++){
        const p = productos[i];
        mensaje += "Id: " + p.id + " - " + p.nombre + " - $" + p.precio + "\n";
        console.log("Id: ", p.id, " - Nombre: ", p.nombre, " - Precio: ", p.precio);
    }
    alert(mensaje);
}

// Agregar producto al carrito
function agregarAlCarrito(){
    if (productos.length === 0){
        alert("No hay productos definidos en el catalogo.")
        return;
    }

    const idIngresado = Number(prompt("Ingrese el ID del producto que desee agregar: "));
    if (isNaN(idIngresado)){
        alert("El Id ingresado no es valido.");
        return;
    }

    let productoSeleccionado = null
    for (let i=0; i <productos.length; i++){
        if (productos[i].id === idIngresado){
            productoSeleccionado = productos[i];
            break;
        }   
    }

    if (!productoSeleccionado){
        alert("No se encontro un producto con ese Id.")
        return;
    }

    const cantidadIngresada = Number(prompt("Ingrese la cantidad que desea comprar: "));
    if (isNaN(cantidadIngresada) || cantidadIngresada <=0){
        alert("La cantidad ingresada no es valida.")
        return;
    }

    const confirma = confirm(
        "Confirma la operacion: \n" +
        "Producto: " + productoSeleccionado.nombre + "\n" +
        "Precio unitario: $ " + productoSeleccionado.precio + "\n" +
        "Cantidad: " + cantidadIngresada + "\n" +
        "Subtotal: $ " + (productoSeleccionado.precio * cantidadIngresada)
    );

    if(!confirma){
        alert("No se agrego el producto al carrito.")
        return;
    }

    let itemExistente = null;
    for (let i = 0; i < carrito.length; i++){
        if(carrito[i].id === productoSeleccionado.id){
            itemExistente = carrito[i]
            break;
        }
    }

    if (itemExistente){
        itemExistente.cantidad += cantidadIngresada;
    } else{
        carrito.push({
            id: productoSeleccionado.id,
            nombre: productoSeleccionado.nombre,
            precioUnit: productoSeleccionado.precio,
            cantidad: cantidadIngresada
        });
    }

    alert("Producto agregado")
    console.log(carrito)
}


// Ver carrito y calcular total
function verCarritoYTotales(){
    if (carrito.length === 0){
        alert("El carrito esta vacio.")
        return;
    }

    let mensaje = "Detalle del carrito: \n";
    let subtotal = 0;
    console.clear()
    console.log("---Carrito de comrpas---")
    for (let i = 0; i < carrito.length; i++){
        const item = carrito[i];
        const totalItem = item.precioUnit * item.cantidad;
        subtotal += totalItem;

        mensaje += item.nombre + "(* " + item.cantidad + ") - $" + item.precioUnit + "c/u | Subtotal: $" + totalItem + "\n";
        console.log(
            "Producto: ", item.nombre,
            "- Cantidad: ", item.cantidad,
            "- Precio unitario: ", item.precioUnit,
            "- SUBTOTAL ITEM: ", totalItem
        );
    } 

    const montoIva = subtotal * IVA
    const totalconIva = subtotal + montoIva

    mensaje += "Subtotal: $ " + subtotal + "\n";
    mensaje += "IVA (" + (IVA * 100) + "%): " + montoIva + "\n"
    mensaje += "TOTAL A PAGAR: $ " + totalconIva + "\n";

    console.log("Subtotal: ", subtotal);
    console.log("IVA: ", montoIva);
    console.log("TOTAL: ", totalconIva);

    alert(mensaje)
}

// Finalizar compra
function finalizarCompra(){
    if (carrito.length ===0){
        alert("Carrito vacio.")
        return;
    }
    verCarritoYTotales(); //para ver resumen antes de comprar
    const confirma = confirm("¿Desea confirmar la compra?")
    if (!confirma){
        alert("Compra cancelada. El carrito sigue igual.")
        return;
    }

    console.log("---Factura hecha---")
    let mensajeFactura = "Factura electronica (simulada)\n\n";

    let subtotal = 0;
    for (let i = 0; i < carrito.length; i++){
        const item = carrito[i];
        const totalItem = item.precioUnit * item.cantidad;
        subtotal += totalItem;

        mensajeFactura += item.nombre + " x" + item.cantidad + " $" + item.precioUnit + " Subtotal: $ " + totalItem + "\n";

    }
    const montoIva = subtotal * IVA;
    const totalconIva = subtotal + montoIva;

    mensajeFactura += "Subtotal: $ " + subtotal + "\n";
    mensajeFactura += "IVA (" + (IVA * 100) + "%): $ " + montoIva + "\n";
    mensajeFactura += "TOTAL: $ " + totalconIva + "\n";
    mensajeFactura += "\nCompra realizada";

    console.log(mensajeFactura);
    alert(mensajeFactura);

    carrito = [];
}

// Mostrar menú
function mostrarMenuFacturacion(){
    return prompt(
        "Seleccione una opcion:\n" +
        "1. Ver catalogo de productos\n"+
        "2. Agregar producto al carrito\n" +
        "3. Ver carrito y totales\n" +
        "4. Finalizar compra\n" +
        "5. Salir\n" + 
        "Ingrese el numero de la opcion: "
    );
}

// Inicio
function iniciarSistemadeFacturacion(){
    alert("Simulador");
    let continuar = true;
    while(continuar){
        const opcion = mostrarMenuFacturacion();

        if (opcion === null){
            const deseaSalir = confirm("Desea salir?")
            if(deseaSalir){
                continuar = false;
            }
            continue;
        }
        switch(opcion){
            case "1":
                mostrarCatalogo();
                break;
            case "2":
                agregarAlCarrito();
                break;
            case "3":
                verCarritoYTotales();
                break;
            case "4":
                finalizarCompra();
                break;
            case "5":
                alert("Saliendo del sistema.");
                continuar = false;
                break;
            default:
                alert("Opcion invalida.")
                break;
        }
    }
}


iniciarSistemadeFacturacion();
