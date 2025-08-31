class Sistema {
    constructor() {
        this.listaClientes = [];
        this.listaCuentas = [];
        this.cargarDatos(); // 🔄 al iniciar el sistema
    }

    // Guardar todo en localStorage
    guardarDatos() {
        localStorage.setItem("clientes", JSON.stringify(this.listaClientes));
        localStorage.setItem("cuentas", JSON.stringify(this.listaCuentas));
    }

    // Cargar datos de localStorage
    cargarDatos() {
        const clientesGuardados = JSON.parse(localStorage.getItem("clientes")) || [];
        const cuentasGuardadas = JSON.parse(localStorage.getItem("cuentas")) || [];

        // Reconstruir clientes
        this.listaClientes = clientesGuardados.map(c => {
            const cliente = new Cliente(c.idCliente, c.nombre, c.apellido, c.dni, c.email, c.password);
            return cliente;
        });

        // Reconstruir cuentas y movimientos
        this.listaCuentas = cuentasGuardadas.map(c => {
            const clienteAsociado = this.listaClientes.find(cli => cli.idCliente === c.cliente.idCliente);
            const cuenta = new Cuenta(c.idCuenta, clienteAsociado, c.saldo);

            cuenta.movimientos = c.movimientos.map(m => new Movimiento(m.idMovimiento, m.tipo, m.monto, new Date(m.fecha)));

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
