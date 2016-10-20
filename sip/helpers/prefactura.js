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
    return data[0].subtotal;
}

function impuesto(data) {
    return data[0].impuesto.toFixed();
}

function totalimpuesto(data) {
    return data[0].totalimpuesto;
}

function totalprefactura(data) {
    return data[0].totalprefactura;
}

function montomulta(data) {
    return data[0].montomulta;
}

function montoneto(data) {
    return data[0].montoneto;
}

function getFecha(data) {
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