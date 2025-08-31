class Cuenta {
    constructor(idCuenta, cliente, saldoInicial = 0) {
        this.idCuenta = idCuenta;
        this.cliente = cliente;
        this.saldo = saldoInicial;
        this.movimientos = [];
    }

    depositar(monto) {
        if (monto <= 0) {
            throw new Error("Monto inválido para depósito.");
        }
        this.saldo += monto;
        this.registrarMovimiento("DEPÓSITO", monto);
    }

    retirar(monto) {
        if (monto <= 0) {
            throw new Error("Monto inválido para retiro.");
        }
        if (monto > this.saldo) {
            throw new Error("Saldo insuficiente.");
        }
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