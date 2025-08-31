// archivo: interfaz.js

// Inicializamos el sistema
const sistema = new Sistema();
let clienteActivo = null;

// ====== Funciones ======

// Registrar cliente
function registrarCliente() {
    try {
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const dni = document.getElementById("dni").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        sistema.crearCliente(nombre, apellido, dni, email, password);
        document.getElementById("msgRegistro").innerText = "Cliente registrado correctamente!";
        limpiarCamposRegistro();
    } catch (error) {
        document.getElementById("msgRegistro").innerText = error;
    }
}

// Iniciar sesión
function iniciarSesion() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const cliente = sistema.iniciarSesion(email, password);

    if (cliente) {
        clienteActivo = cliente;
        mostrarPanelCliente();
        actualizarListaCuentas();
        document.getElementById("msgLogin").innerText = "";
    } else {
        document.getElementById("msgLogin").innerText = "Email o contraseña incorrectos";
    }
}

// Crear cuenta
function crearCuenta() {
    const saldo = parseFloat(document.getElementById("saldoInicial").value) || 0;
    sistema.crearCuenta(clienteActivo, saldo);
    actualizarListaCuentas();
    document.getElementById("saldoInicial").value = "";
}

// Actualizar la lista de cuentas en el panel
function actualizarListaCuentas() {
    const lista = document.getElementById("listaCuentas");
    lista.innerHTML = "";

    clienteActivo.cuentas.forEach(cuenta => {
        const li = document.createElement("li");
        li.innerText = `Cuenta ${cuenta.idCuenta} - Saldo: ${cuenta.saldo}`;
        
        // Botones para depósito y retiro
        const btnDeposito = document.createElement("button");
        btnDeposito.innerText = "Depositar 100";
        btnDeposito.onclick = () => {
            cuenta.depositar(100);
            actualizarListaCuentas();
        };

        const btnRetiro = document.createElement("button");
        btnRetiro.innerText = "Retirar 50";
        btnRetiro.onclick = () => {
            try {
                cuenta.retirar(50);
                actualizarListaCuentas();
            } catch (e) {
                alert(e);
            }
        };

        li.appendChild(document.createTextNode(" "));
        li.appendChild(btnDeposito);
        li.appendChild(document.createTextNode(" "));
        li.appendChild(btnRetiro);

        lista.appendChild(li);
    });
}

// Mostrar panel de cliente después del login
function mostrarPanelCliente() {
    document.getElementById("panelCliente").style.display = "block";
    document.getElementById("bienvenida").innerText = `Cliente: ${clienteActivo.nombre} ${clienteActivo.apellido}`;
}

// Limpiar campos del registro
function limpiarCamposRegistro() {
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("dni").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
}
// Depósito
btnDeposito.onclick = () => {
    cuenta.depositar(100);
    sistema.guardarDatos();   // 🔄 guardar cambios
    actualizarListaCuentas();
};

// Retiro
btnRetiro.onclick = () => {
    try {
        cuenta.retirar(50);
        sistema.guardarDatos();   // 🔄 guardar cambios
        actualizarListaCuentas();
    } catch (e) {
        alert(e);
    }
};
// ====== Asignar eventos a botones ======
document.getElementById("btnRegistrar").addEventListener("click", registrarCliente);
document.getElementById("btnLogin").addEventListener("click", iniciarSesion);
document.getElementById("btnCrearCuenta").addEventListener("click", crearCuenta);
