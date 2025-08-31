// =========================
// Sistema Fintech - Todo en un solo JS
// =========================

// =========================
// Clase Cliente
// =========================
class Cliente {
    constructor(idCliente, nombre, apellido, dni, email, password) {
        this.idCliente = idCliente;
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.email = email;
        this.password = password; 
        this.cuentas = [];
    }

    agregarCuenta(cuenta) {
        this.cuentas.push(cuenta);
    }

    modificarDatos(nuevoNombre, nuevoApellido) {
        this.nombre = nuevoNombre;
        this.apellido = nuevoApellido;
    }
}

// =========================
// Clase Movimiento
// =========================
class Movimiento {
    constructor(idMovimiento, tipo, monto, fecha) {
        this.idMovimiento = idMovimiento;
        this.tipo = tipo; // "DEPÓSITO" o "RETIRO"
        this.monto = monto;
        this.fecha = fecha;
    }
}

// =========================
// Clase Cuenta
// =========================
class Cuenta {
    constructor(idCuenta, cliente, saldoInicial = 0) {
        this.idCuenta = idCuenta;
        this.cliente = cliente;
        this.saldo = saldoInicial;
        this.movimientos = [];
    }

    depositar(monto) {
        if (monto <= 0) throw new Error("Monto inválido para depósito.");
        this.saldo += monto;
        this.registrarMovimiento("DEPÓSITO", monto);
    }

    retirar(monto) {
        if (monto <= 0) throw new Error("Monto inválido para retiro.");
        if (monto > this.saldo) throw new Error("Saldo insuficiente.");
        this.saldo -= monto;
        this.registrarMovimiento("RETIRO", monto);
    }

    consultarSaldo() {
        return this.saldo;
    }

    registrarMovimiento(tipo, monto) {
        const movimiento = new Movimiento(Date.now(), tipo, monto, new Date());
        this.movimientos.push(movimiento);
    }
}

// =========================
// Clase Sistema
// =========================
class Sistema {
    constructor() {
        this.listaClientes = [];
        this.listaCuentas = [];
        this.cargarDatos(); // Cargar datos al iniciar
    }

    // Guardar todo en localStorage
    guardarDatos() {
        const clientesJSON = this.listaClientes;
        const cuentasJSON = this.listaCuentas.map(c => ({
            idCuenta: c.idCuenta,
            clienteId: c.cliente.idCliente,
            saldo: c.saldo,
            movimientos: c.movimientos
        }));
        localStorage.setItem("clientes", JSON.stringify(clientesJSON));
        localStorage.setItem("cuentas", JSON.stringify(cuentasJSON));
    }

    // Cargar datos de localStorage
    cargarDatos() {
        const clientesGuardados = JSON.parse(localStorage.getItem("clientes")) || [];
        const cuentasGuardadas = JSON.parse(localStorage.getItem("cuentas")) || [];

        // Reconstruir clientes
        this.listaClientes = clientesGuardados.map(c => {
            return new Cliente(c.idCliente, c.nombre, c.apellido, c.dni, c.email, c.password);
        });

        // Reconstruir cuentas y movimientos
        this.listaCuentas = cuentasGuardadas.map(c => {
            const clienteAsociado = this.listaClientes.find(cli => cli.idCliente === c.clienteId);
            const cuenta = new Cuenta(c.idCuenta, clienteAsociado, c.saldo);
            cuenta.movimientos = (c.movimientos || []).map(m => new Movimiento(m.idMovimiento, m.tipo, m.monto, new Date(m.fecha)));
            if (clienteAsociado) clienteAsociado.agregarCuenta(cuenta);
            return cuenta;
        });
    }

    // Crear cliente
    crearCliente(nombre, apellido, dni, email, password) {
        if (this.listaClientes.find(c => c.email === email || c.dni === dni)) {
            throw new Error("Cliente con ese email o DNI ya existe.");
        }
        const cliente = new Cliente(Date.now(), nombre, apellido, dni, email, password);
        this.listaClientes.push(cliente);
        this.guardarDatos();
        return cliente;
    }

    // Crear cuenta
    crearCuenta(cliente, saldoInicial = 0) {
        if (!(cliente instanceof Cliente)) {
            throw new Error("Cuenta debe estar asociada a un cliente válido.");
        }
        const cuenta = new Cuenta(Date.now(), cliente, saldoInicial);
        this.listaCuentas.push(cuenta);
        cliente.agregarCuenta(cuenta);
        this.guardarDatos();
        return cuenta;
    }

    // Iniciar sesión
    iniciarSesion(email, password) {
        return this.listaClientes.find(c => c.email === email && c.password === password);
    }
}

// Exportar instancia global
const sistema = new Sistema();
let clienteActivo = null;
