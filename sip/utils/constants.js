function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
}

define("PI", 3.14);
//Define constantes con roles de sistema
define("ROLADMDIVOT", 6);
define("GENRENTE", 1);
define("PMO", 2);
define("ADMINISTRADOR", 3);
define("NEGOCIADOR", 4);
define("CONTRATO", 5);
