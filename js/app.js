let cuentas = [];
let saldoActual = 0;
let historial = [];
let cuentaSeleccionada = false;
let nombreCuentaSeleccionada = "";

const saldoGuardado = localStorage.getItem("saldo");
if(saldoGuardado){
    saldoActual = Number(saldoGuardado);
}

const historialGuardado = localStorage.getItem("historial");
if(historialGuardado){
    historial = JSON.parse(historialGuardado);
}

// fetch cuentas
fetch("cuentas.json")
    .then(response => {
        if (!response.ok){
            throw new Error();
        }
        return response.json();
    })
    .then(data =>{
        if(!data || data.lenght === 0){
            mostrarAlerta("error","No hay cuentas disponibles");
            return;
        }
        cuentas = data;
        mostrarCuentas();
        mostrarHistorial();
        actualizarSaldoPantalla();
    })
    .catch(() => {
        mostrarAlerta("error","Error cargando cuentas")
    })

// alerta
function mostrarAlerta(tipo, mensaje){
    Swal.fire({
        icon: tipo,
        title: mensaje
    });
}

function guardarDatos(){
    localStorage.setItem("saldo", saldoActual);
    localStorage.setItem("historial", JSON.stringify(historial));
}

function procesarTransferencia(monto){
    saldoActual -= monto;
}

//mostrar cuentas
function mostrarCuentas(){

    const contenedor = document.getElementById("cuentas");
    contenedor.innerHTML = "";

    cuentas.forEach(cuenta => {

        const div = document.createElement("div");
        div.classList.add("cuenta");

        div.innerHTML = `
            <h5>${cuenta.nombre}</h5>
            <p>Saldo inicial: $${cuenta.saldo}</p>
            <button class="btn btn-primary w-100" 
                onclick ="seleccionarCuenta(${cuenta.id})">
                Usar esta cuenta
            </button>
        `;
        contenedor.appendChild(div);
    });
}

// seleccionar cuenta
function seleccionarCuenta(id){

    const cuenta = cuentas.find(c => c.id === id);
    if (!cuenta) return;

    saldoActual = cuenta.saldo;
    cuentaSeleccionada = true
    nombreCuentaSeleccionada = cuenta.nombre;

    guardarDatos();
    actualizarSaldoPantalla();

    mostrarAlerta("success", "Cuenta seleccionada")
}

// actualizar saldo
function actualizarSaldoPantalla(){

    const saldoHTML = document.getElementById("saldoPantalla");
    if(!saldoHTML) return;
    
    saldoHTML.textContent = saldoActual;
}

// mostrar historial
function mostrarHistorial(){
    const lista = document.getElementById("historial");
    lista.innerHTML = "";

    historial.forEach(mov => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.textContent =
            `[${mov.fecha}] ${mov.tipo} de $${mov.monto} desde ${mov.cuenta}`;

        lista.appendChild(li);
    });
}

// transferir dinero
document
    .getElementById("btnTransferir")
    .addEventListener("click", () => {

        if(!cuentaSeleccionada){
            mostrarAlerta("error", "Seleccione una cuenta primero")
            return;
        }

        const monto = Number(document.getElementById("monto").value);

        // validacion monto
        if(!monto || monto <= 0){
            mostrarAlerta("error", "Ingrese un monto valido")
            return;
        } 

        // validacion saldo
        if(monto > saldoActual){
            mostrarAlerta("error", "Saldo insuficiente")
            return;
        }

        // proceso de transferencia
        procesarTransferencia(monto);
        actualizarSaldoPantalla();

        // historial
        historial.unshift({
            tipo: "Transferencia",
            monto: monto,
            cuenta: nombreCuentaSeleccionada,
            fecha: new Date().toLocaleString()
        });
        
        mostrarHistorial();
        guardarDatos();

        document.getElementById("monto").value = "";

        mostrarAlerta("success", "Transferencia realizada")

    });

// reseteo
document.getElementById("btnReset")
    .addEventListener("click", () => {

        localStorage.removeItem("saldo");
        localStorage.removeItem("historial");

        cuentaSeleccionada = false;
        nombreCuentaSeleccionada = "";

        mostrarAlerta("warning", "Datos reseteados")
        setTimeout(() => location.reload(), 1200);
    });
