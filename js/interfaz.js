// =========================
// INTERFAZ DEL SISTEMA
// =========================

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

// Login
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

// Actualizar lista de cuentas
function actualizarListaCuentas() {
    const lista = document.getElementById("listaCuentas");
    lista.innerHTML = "";

    clienteActivo.cuentas.forEach(cuenta => {
        const li = document.createElement("li");
        li.innerText = `Cuenta ${cuenta.idCuenta} - Saldo: ${cuenta.saldo}`;

        const btnDeposito = document.createElement("button");
        btnDeposito.innerText = "Depositar 100";
        btnDeposito.onclick = () => {
            cuenta.depositar(100);
            sistema.guardarDatos();
            actualizarListaCuentas();
        };

        const btnRetiro = document.createElement("button");
        btnRetiro.innerText = "Retirar 50";
        btnRetiro.onclick = () => {
            try {
                cuenta.retirar(50);
                sistema.guardarDatos();
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

// Mostrar panel cliente
function mostrarPanelCliente() {
    document.getElementById("panelCliente").style.display = "block";
    document.getElementById("bienvenida").innerText = `Cliente: ${clienteActivo.nombre} ${clienteActivo.apellido}`;
}

// Limpiar campos registro
function limpiarCamposRegistro() {
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("dni").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
}

// Asignar eventos
document.getElementById("btnRegistrar").addEventListener("click", registrarCliente);
document.getElementById("btnLogin").addEventListener("click", iniciarSesion);
document.getElementById("btnCrearCuenta").addEventListener("click", crearCuenta);
