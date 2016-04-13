// JavaScript source code
var abstractSql = require('./db.js');
var SeguridadUsuarios = (function () {
    var arrParam = []; //Array de parámetros para el sp.

    /**
     * LoginUsuarios
     * Este método se encarga de traer los datos del login de la base de datos.
     * Esto datos permiten identificar el estado de acceso a la aplicación.
     * @param {type} strUsuario usuario del erp
     * @param {type} strClave clave de acceso
     * @param {function} callback
     * @returns {undefined}
     */
    var LoginUsuarios = function (strUsuario, strClave, callback) {
        console.log('LoginUsuarios - SeguridadUsuarios');
        arrParam = { 'Usuario': strUsuario, 'Clave': strClave };
        abstractSql.AdministrarData.CargarSpDatos('sp_w_Verificar_Usuario', arrParam, function (err, data) {
            console.log('Consultando Sp de Usuarios - SeguridadUsuarios');
            if (err) {
                console.log('Mensaje: ' + err.message + ' - Código: ' + err.code);
                callback(err, undefined);
            } else {
                callback(undefined, data);
            }
        });
    };

    /**
     * VerificarUsuario
     * Método que verifica si el usuario que se esta logueando tiene acceso
     * a la aplicación. Testear con estos usuarios 'JSANCHEZ' y la clave '1234'
     * 'CARLOSM' y clave '1234jpb@'
     * @param {string} strUsuario usuario de acceso al erp
     * @param {string} strClave clave de acceso al erp
     * @param {string} strRealPerson captcha del formulario web
     * @param {string} strRealPersonHash md5 del captcha
     * @param {function} callback
     * @returns {array} data array con el mensaje de validación
     */
    var VerificarUsuario = function (strUsuario, strClave, strRealPerson, strRealPersonHash, callback) {
        console.log('VerificarUsuario - SeguridadUsuario');
        var strClaveDescifrada = ''; //String con la clave desencriptada.
        var strRealPersonDescifrada = ''; //String con el captcha desencriptado.
        LoginUsuarios(strUsuario, strClave, function (err, data) {
            if (err) {
                console.log(' Nombre: ' + err.name +
                        ' - Mensaje: ' + err.message +
                        ' - Código: ' + err.code +
                        ' - SQL Errores Anteriores: ' + err.precedingErrors);
                callback(err, undefined);
            } else {
                if (data[0][0].Acceso === 'encriptado') {
                    //Evaluo si no estan enviando información vacía.
                    if (strUsuario.length === 0 || strClave.length === 0 || strRealPerson === 0) {
                        data[0][0].Acceso = 'No permitido';
                        callback(undefined, data[0]);
                    } else {
                        //Desencripto la clave.
                        strClaveDescifrada = Desencriptar(data[0][0].ClaveEncriptada, data[0][0].ClaveAsccii);
                        strRealPersonDescifrada = rpHash(strRealPersonHash);
                        //Si la clave desencriptada corresponde con la que nos envio el usuario permito el acceso.
                        if (strClaveDescifrada.toUpperCase() === strClave.toUpperCase() && strRealPersonDescifrada.toUpperCase() === strRealPerson.toUpperCase()) {
                            data[0][0].Acceso = 'Permitido';
                            //Devuelvo el array con los parametros.
                            callback(undefined, data[0]);
                        } else {
                            data[0][0].Acceso = 'No permitido';
                            callback(undefined, data[0]);
                        }
                    }
                }
            }
        });
    };

    return {
        VerificarUsuario: VerificarUsuario
    };
})();