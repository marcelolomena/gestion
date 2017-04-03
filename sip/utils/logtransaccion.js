var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");

module.exports = (function (registrar, actualizar) {
    var registrar = function (idtransaccion, idregistro, accion, 
    idusuario, model, dataform, callback) {
        console.log("******REGISTRANDO:"+accion+","+idregistro);
        if (accion == 'update' || accion == 'delete') {
            model.findAll({
                where: { id: idregistro },
            }).then(function (res) {
                if (accion == 'update'){
                    var sql = "INSERT INTO sip.logtransaccion (idtransaccion, dataold, dataform, idusuario, fecha, idregistro, borrado) "+
                        "VALUES ("+idtransaccion+",'"+ JSON.stringify(res)+"','"+ JSON.stringify(dataform)+"',"+ idusuario+", getdate(),"+ idregistro +", 1); "+
                        "declare @id int; "+
                        "select @id = @@IDENTITY; " +
                        "select @id as id;";                        
                } else {
                    var sql = "INSERT INTO sip.logtransaccion (idtransaccion, dataold, datanew, idusuario, fecha, idregistro, borrado) "+
                        "VALUES ("+idtransaccion+",'"+ JSON.stringify(res)+"', NULL,"+ idusuario+", getdate(),"+ idregistro +", 1) "+
                        "declare @id int; "+
                        "select @id = @@IDENTITY; " +
                        "select @id as id;";                                                   
                }
                console.log("sql upd:"+sql);
                sequelize.query(sql).spread(function (rows) {
                     callback(undefined,rows[0].id);
                }).catch(function (err) {
                    logger.error(err.message);
                    return callback(err, -1);
                });
            }).catch(function (err) {
                logger.error(err.message);
                return callback(err, -1);
            });
        } else {
            var sql = "INSERT INTO sip.logtransaccion (idtransaccion, dataold, datanew, idusuario, fecha, idregistro, borrado) "+
                "VALUES ("+idtransaccion+", NULL,'"+ JSON.stringify(dataform)+"',"+ idusuario+", getdate(),"+ idregistro +", 1)";
            console.log("sql ins:"+sql);
            sequelize.query(sql).spread(function (rows) {
                    callback(undefined);
            }).catch(function (err) {
                logger.error(err.message);
                return callback(err);
            });
        }
    }

    var actualizar = function (idregistro, iddata, model, callback) {
        console.log("******ACTUALIZANDO:"+idregistro+", idata:"+iddata+", model:"+model);
        model.findAll({
            where: { id: iddata },
        }).then(function (res) {        
            console.log("******ACTUALIZANDO:"+res);
            var sql = "UPDATE sip.logtransaccion SET datanew = '"+JSON.stringify(res)+
                "' where id="+idregistro;
            console.log("sql ins:"+sql);
            sequelize.query(sql).spread(function (rows) {
                    return callback(undefined);
            }).catch(function (err) {
                logger.error(err.message);
                return callback(err);
            });
        }).catch(function (err) {
            logger.error(err.message);
            return callback(err);
        });            
    }
    
    return {
        registrar: registrar, actualizar: actualizar
    };
})();



