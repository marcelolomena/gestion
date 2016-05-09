var mssql = require('mssql'); // conector sql server.
var squel = require('squel'); //generador de string de consultas sql server. 

module.exports  = (function () {
//Atributos
var connection;
var request;

    //Configuración de conexión SQL Server
    /*
	var config = {
		user: 'biometria',
		password: 'biometria123',
		server: '200.14.166.182', // You can use 'localhost\\instance' to connect to named instance
		database: 'art_live',
		pool: {
			max: 10,
			min: 0,
			idleTimeoutMillis: 30000
		}
	}
    */
   

    var config = {
        user: 'pi',
        password: '123momiaes',
        driver: 'tedious',
        server: 'zrismart', 
        database: 'art_live',
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        },
        options: {
            instanceName: 'SQLEXPRESS'
        }
    }

//Métodos Privados

/**
 * abrirConexion
 * @author Marcelo Lomeña
 * @version 0.0.1
 * @since 01/04/2016
 * @syntax abrirConexion();
 * Este metodo establece la conexión a la base de datos.
 * @param {function} callback
 * @returns {request} Método y funciones para interactuar con sql server.
 */
var abrirConexion = function (callback) {
    console.log('abrirConexion - abstractSql');
    console.log('Libreria - abrirConexion: ' + mssql);
    connection = new mssql.Connection(config, function (err) {
        console.log('esta abierta?' + connection.connected);
        if (err) {
                console.log(
                    ' Nombre: ' + err.name +
                    ' - Mensaje: ' + err.message +
                    ' - Código: ' + err.code +
                    ' - SQL Errores Anteriores: ' + err.precedingErrors +
                    ' - Fecha: ' + Date() + '\n'
                    );
            } else {
                request = new mssql.Request(connection);
                callback(request);
        }
    });
};

/**
 * cerrarConexion
 * @author Marcelo Lomeña
 * @version 0.0.1
 * @since 01/04/2016
 * @syntax cerrarConexion();
 * Este método desconecta la base de datos.
 * @return {undefined}
 */

var cerrarConexion = function () {
    connection.close();
};

/**
 * devolverConsultaQuery
 * Este método devuelve los resultados de una consulta en un array.
 * @author Marcelo Lomeña
 * @version 0.0.1
 * @since 01/04/2016
 * @syntax devolverConsultaQuery('select * from tabla', function(){...});
 * @param {string} strQuery consulta sql 
 * @param {function} callback
 * @returns {undefined}
 */
var devolverConsultaQuery = function (strQuery, callback) {
    abrirConexion(function (request) {
        request.query(strQuery, function (err, data) {
            if (err) {
                    console.log(
                        ' Nombre: ' + err.name +
                        ' - Mensaje: ' + err.message +
                        ' - Código: ' + err.code +
                        ' - SQL Errores Anteriores: ' + err.precedingErrors +
                        ' - Fecha: ' + Date() + '\n'
                        );
                callback(err, undefined);
            } else {
                callback(undefined, data);
            }
        });
    });
    //cerrarConexion();
};

/**
 * devolverConsultaSp
 * Método que se encarga de la ejecución de cualquier tipo de procedimiento
 * almacenado solo indicando nombre del mismo y parámetros. Devuelve un json
 * con todos los registros de la ejecución.
 * @author Marcelo Lomeña
 * @version 0.0.1
 * @since 2014-10-13
 * @param {string} sp nombre del sp que se requiere ejecutar.
 * @param {array} arrParam json con los parametros (campo/valor) que se necesitan para ejecutar el sp.
 * @param {function} callback
 * @returns {undefined}
 */
var devolverConsultaSp = function (sp, arrParam, callback) {
        console.log('devolverConsultaSp - abstracSql');
    abrirConexion(function (request) {
        for (var key in arrParam) {
            var parametro = key;
            var valor = arrParam[key];
            request.input(parametro, valor);
            }

        request.execute(sp, function (err, data) {
            if (err) {
                    console.log(
                        ' Nombre: ' + err.name +
                        ' - Mensaje: ' + err.message +
                        ' - Código: ' + err.code +
                        ' - SQL Errores Anteriores: ' + err.precedingErrors +
                        ' - Fecha: ' + Date() + '\n'
                        );
                callback(err, undefined);
            } else {
                callback(undefined, data);
            }
        });
    });
    //cerrarConexion();
};

return {
    //Sub Modulos
    AdministrarData: (function () {
        /**
         * CargarMaestro
         * Método público que en base al origen de datos que se le pase como
         * parámetro trae la información de las tablas, vistas o procedimientos
         * almacenado según el tipo de origén solicitado.
         * @author Marcelo Lomeña
         * @version 0.0.1
         * @since 2014-08-10
         * @syntax CargarMaestro('TB', function(err, data) { ... });
         * @param {string} strTipo TB - Tabla, VW - Vista, SP - Proc Almacenado.
         * @param {function} callback
         * @returns {array} array con los registros de la consulta
         */
        var CargarMaestros = function (strTipo, callback) {
            console.log('Tipo de Origen Maestros: ' + strTipo);
            switch (strTipo) {
                case 'TB':
                    var QueryTb = 'SELECT CAST(table_name as varchar) as table_name \n\
                       FROM INFORMATION_SCHEMA.TABLES';
                    devolverConsultaQuery(QueryTb, function (err, data) {
                        if (err) {
                            callback(err, undefined);
                        } else {
                            callback(undefined, data);
                        }
                    });
                    break;
                case 'VW':
                    var QueryVw = 'SELECT CAST(table_name as varchar) as view_name \n\
                       FROM INFORMATION_SCHEMA.VIEWS';
                    devolverConsultaQuery(QueryVw, function (err, data) {
                        if (err) {
                            callback(err, undefined);
                        } else {
                            callback(undefined, data);
                        }
                    });
                    break;
                case 'SP':
                    var QuerySp = 'SELECT CAST(specific_name as varchar) as specific_name \n\
                       FROM INFORMATION_SCHEMA.ROUTINES';
                    devolverConsultaQuery(QuerySp, function (err, data) {
                        if (err) {
                            callback(err, undefined);
                        } else {
                            callback(undefined, data);
                        }
                    });
                    break;
                default:
                    console.log('No se reconoce este origen de datos: '
                            + strTipo);
                    console.log('Origenes de datos validos:\n\
                            TB - Tabla, VW - Vista, SP - Proc Almacenado');
            }
        };

        /**
         * CargarMaestroCampo
         * Este método público se encarga de cargar los campos y su tipo de
         * dato de sql server filtrandolos por el nombre del catalogo (tabla,
         * vista, procedimiento almacenado)
         * @param {string} strTipo
         * @param {string} strCatalogo
         * @param {function} callback
         * @returns {array} data
         */
        var CargarMaestrosCampos = function (strTipo, strCatalogo, callback) {
            console.log('Tipo de Origen Maestros / Campos: ' + strTipo);
            if (strTipo === 'TB' || strTipo === 'VW')
            {
                var queryTbVwCampos = squel.select()
                        .from('INFORMATION_SCHEMA.COLUMNS')
                        .field('column_name')
                        .field('data_type')
                        .where('WHERE table_name = ' + strCatalogo).toString();
                devolverConsultaQuery(queryTbVwCampos, function (err, data) {
                    if (err) {
                        callback(err, undefined);
                    } else {
                        callback(undefined, data);
                    }
                });
            } else if (strTipo === 'SP') {
                var querySpCampos = squel.select()
                        .from('INFORMATION_SCHEMA.PARAMETERS')
                        .field('parameter_name')
                        .field('data_type')
                        .where('WHERE specific_name = ' + strCatalogo).toString();
                devolverConsultaQuery(querySpCampos, function (err, data) {
                    if (err) {
                        callback(err, undefined);
                    } else {
                        callback(undefined, data);
                    }
                });
            } else {
                console.log('No se reconoce este origen de datos: '
                        + strTipo);
                console.log('Origenes de datos validos:\n\
                            TB - Tabla, VW - Vista, SP - Proc Almacenado');
            }
        };


        /**
         * CargarSpDatos
         * Método público que se encarga de ejecutar cualquier procedimiento
         * almacenado solicitando el nombre del sp y los parametros.
         * @author Marcelo Lomeña
         * @version 0.0.1
         * @since 2014-10-13
         * @syntax CargarSpCampos('sp_test', 'json', function(data) { ... });
         * @param {string} sp nombre del procedimiento almacenado
         * @param {array} arrParam json con el nombre y valor de los parámetros del procedimiento almacenado.
         * @param {function} callback
         * @returns {undefined}
         */
        var CargarSpDatos = function (sp, arrParam, callback) {
            console.log('SpDatos - abstractSQL');
            devolverConsultaSp(sp, arrParam, function (err, data) {
                if (err) {
                    callback(err, undefined);
                } else {
                    callback(undefined, data);
                }
            });
            };
            
            var CargarQueryDatos = function (strQuery, callback) {
                console.log('SpDatos - abstractSQL');
                devolverConsultaQuery(strQuery, function (err, data) {
                    if (err) {
                        callback(err, undefined);
                    } else {
                        callback(undefined, data);
                    }
                });
            };

        return {
            //Métodos públicos
            CargarMaestros: CargarMaestros,
            CargarMaestrosCampos: CargarMaestrosCampos,
            CargarSpDatos: CargarSpDatos,
            CargarQueryDatos: CargarQueryDatos
        };
    })()
};
})();