function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
}

define("PI", 3.14);
//Define constantes con roles de sistema
define("ROLADMDIVOT", "ROLADMDIVOT");
define("GERENTE", "GERENTE");
define("PMO", "PMO");
define("ADMINISTRADOR", "ADMINISTRADOR");
define("NEGOCIADOR", "NEGOCIADOR");
define("CONTRATO", "CONTRATO");
