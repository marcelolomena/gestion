function toJSON(data) {
    return JSON.stringify(data);
}

function format(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getProveedor(data) {
    return data[0].razonsocial;
}

function getId(data) {
    return data[0].id;
}

function getContacto(data) {
    return data[0].contacto;
}

function getCorreo(data) {
    return data[0].correo;
}

function getCui(data) {
    return data[0].cui;
}

function subtotal(data) {
    return data[0].subtotal.toFixed();
}

function impuesto(data) {
    return data[0].impuesto.toFixed();
}

function totalimpuesto(data) {
    return data[0].totalimpuesto.toFixed();
}

function totalprefactura(data) {
    return data[0].totalprefactura.toFixed();
}

function montomulta(data) {
    return data[0].montomulta.toFixed();
}

function montoneto(data) {
    return data[0].montoneto.toFixed();
}

function fecha(data) {
    return data[0].fecha;
}

function getRutProveedor(data) {
    return format(data[0].numrut) + '-' + data[0].dvrut;
}

function getGlosaMoneda(data) {
    return data[0].glosamoneda;
}

function getNombreResponsable(data) {
    return data[0].nombreresponsable;
}

function getFechaInicio(data) {
    return data[0].fechainicio;
}

function getFechaTermino(data) {
    return data[0].fechatermino;
}

function getServicio(data) {
    return data[0].servicio;
}

function getCuentaContable(data) {
    return data[0].cuentacontable;
}

function getNombreCuenta(data) {
    return data[0].nombrecuenta;
}

function getNumeroContrato(data) {
    return data[0].numero;
}

function getCargo(data) {
    return data[0].glosaCargoAct;
}