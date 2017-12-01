function toJSON(data) {
    return JSON.stringify(data);
}

function format(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getIdProducto(data) {
    return data[0].idproducto;
}

function getId(data) {
    return data[0].id;
}

function getNumLicencia(data) {
    return data[0].numlicencia;
}

function getFechaUso(data) {
    return data[0].fechauso;
}

function getFechaSolicitud(data) {
    return data[0].fechasolicitud;
}

function getCui(data) {
    return data[0].cui;
}

function getSap(data) {
    return data[0].sap;
}
