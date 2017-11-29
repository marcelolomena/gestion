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
//define roles sistema licencias LIC
define("USERLIC", "USERLIC");
define("JEFELIC", "JEFELIC");
define("ADMINLIC", "ADMINLIC");
//define estados sistema licencias
define("RECHAZADO", "Rechazado");
define("ALAESPERA", "A la Espera");


//Define constantes para log de transacciones, contiene id de tabla sip.transaccion
//*contratos
define("CreaContrato", 4);
define("ActualizaContrato", 5);
define("BorraContrato", 6);
define("CreaServicio", 7);
define("ActualizaServicio", 8);
define("BorraServicio", 9);
define("CreaFlujo", 10);
define("ActualizaFlujo", 11);
define("BorraFlujo", 12);
//*Compromisos por sap
define("CreaProyecto", 13);
define("ActualizaProyecto", 14);
define("BorraProyecto", 15);
define("CreaTarea", 16);
define("ActualizaTarea", 17);
define("BorraTarea", 18);
define("CreaFlujoPago", 19);
define("ActualizaFlujoPago", 20);
define("BorraFlujoPago", 21);
//*Prefactura
define("IniciaGeneraSolicitudes", 22);
define("FinExitoGeneraSolicitudes", 23);
define("FinErrorGeneraSolicitudes", 24);
define("ModificaSolicitud", 25);
define("AnulaSolicitud", 26);
define("IniciaGeneraPrefacturas", 27);
define("FinExitoGeneraPrefacturas", 28);
define("FinErrorGeneraPrefacturas", 29);
define("CreaDesgloseContable", 30);
define("ActualizaDesgloseContable", 31);
define("BorraDesgloseContable", 32);
define("IniciaGeneraSolicitudesProyectos", 44);
define("FinExitoGeneraSolicitudesProyectos", 45);
define("FinErrorGeneraSolicitudesProyectos", 46);
define("IniciaGeneraPrefacturasProyectos", 47);
define("FinExitoGeneraPrefacturasProyectos", 48);
define("FinErrorGeneraPrefacturasProyectos", 49);
//*Facturas
define("CreaFactura", 33);
define("ActualizaFactura", 34);
define("BorraFactura", 35);
define("CreaItemFactura", 36);
define("BorraItemFactura", 37);
define("IniciaCargaDTE", 38);
define("FinExitoCargaDTE", 39);
define("FinErrorCargaDTE", 40);
