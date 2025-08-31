class Movimiento {
    constructor(idMovimiento, tipo, monto, fecha) {
        this.idMovimiento = idMovimiento;
        this.tipo = tipo; // DEPÓSITO o RETIRO
        this.monto = monto;
        this.fecha = fecha;
    }
}