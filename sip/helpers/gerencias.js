function toJSON(data) {
    return JSON.stringify(data);
}

function format(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function totalUno(data) {
    var total = 0;

    data.forEach(function (b) {
        total = total + b.ejerciciouno;
    });

    return format(total.toFixed(2));
}

function totalDos(data) {
    var total = 0;

    data.forEach(function (b) {
        total = total + b.ejerciciodos;
    });

    return format(total.toFixed(2));
}

function totalDiferencia(data) {
    var totalUno = 0;
    var totalDos = 0;

    data.forEach(function (b) {
        totalUno = totalUno + b.ejerciciouno;
        totalDos = totalDos + b.ejerciciodos;
    });

    return (totalDos - totalUno).toFixed(2);
}

function totalPorcentaje(data) {
    var totalUno = 0;
    var totalDos = 0;

    data.forEach(function (b) {
        totalUno = totalUno + b.ejerciciouno;
        totalDos = totalDos + b.ejerciciodos;
    });

    var p = ((totalDos - totalUno) / totalUno) * 100

    return format(p.toFixed(2));
}