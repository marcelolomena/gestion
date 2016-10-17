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

function subtotal(data) {
    var total = 0;

    data.forEach(function (b) {
        total = total + b.montoaprobado;
    });

    return format(total);
}

function totaliva(data) {
    var total = 0;

    data.forEach(function (b) {
        total = total + b.montoaprobado;
    });

    return format(total * 0.19);
}

function total(data) {
    var total = 0;

    data.forEach(function (b) {
        total = total + b.montoaprobado;
    });

    return format(total * 1.19);
}