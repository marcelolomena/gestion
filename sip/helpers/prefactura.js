function toJSON(data) {
    return JSON.stringify(data);
}

function format(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getProveedor(data) {
    return data[0].razonsocial;
}