class Cliente {
    constructor(idCliente, nombre, apellido, dni, email, password) {
        this.idCliente = idCliente;
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.email = email;
        this.password = password; // 🔒 en la práctica debería estar encriptado
        this.cuentas = []; // un cliente puede tener varias cuentas
    }

    agregarCuenta(cuenta) {
        this.cuentas.push(cuenta);
    }

    modificarDatos(nuevoNombre, nuevoApellido) {
        this.nombre = nuevoNombre;
        this.apellido = nuevoApellido;
    }
}