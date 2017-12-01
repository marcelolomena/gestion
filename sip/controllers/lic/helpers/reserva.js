function toJSON(data) {
    return JSON.stringify(data);
}

function format(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getCodAutoriza(data) {
    return data[0].codautoriza;
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

function getComentarioSolicitud(data) {
    return data[0].comentariosolicitud;
}
function getEstado(data) {
    return data[0].estado;
}
function getIdUsuario(data) {
    return data[0].idusuario;
}
function getFechaAprobacion(data) {
    return data[0].fechaaprobacion;
}

function getComentarioAprobacion(data) {
    return data[0].comentarioaprobacion;
}

function getFechaAutorizacion(data) {
    return data[0].fechaautorizacion;
}

function getComentarioAutorizacion(data) {
    return data[0].comentarioautorizacion;
}

function getIdUsuarioJefe(data) {
    return data[0].idusuariojefe;
}












