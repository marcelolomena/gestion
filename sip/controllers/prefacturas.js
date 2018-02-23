var models = require('../models');
var sequelize = require('../models/index').sequelize;
var userService = require('../service/user');
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");
var logtransaccion = require("../utils/logtransaccion");
var constants = require("../utils/constants");

exports.list = function (req, res) {

    var page = req.body.page;
    var rows = req.body.rows;
    var filters = req.body.filters;
    var sidx = req.body.sidx;
    var sord = req.body.sord;

    if (!sidx) {
        sidx = "a.id";
        sord = "desc";
    }

    if (!sord)
        sord = "desc";

    var order = sidx + " " + sord;

    var sql0 = "declare @rowsPerPage as bigint; " +
        "declare @pageNum as bigint;" +
        "set @rowsPerPage=" + rows + "; " +
        "set @pageNum=" + page + ";   " +
        "With SQLPaging As   ( " +
        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
        "as resultNum, a.*, contrato.numero, proveedor.[razonsocial] as proveedor, estructuracui.[cui] as cui, moneda.glosamoneda as moneda " +
        "FROM [sip].[prefactura] a " +
        " LEFT OUTER JOIN [sip].[proveedor] proveedor  ON a.[idproveedor] = proveedor.[id] " +
        " LEFT OUTER JOIN  [sip].[estructuracui] estructuracui  ON a.[idcui] = estructuracui.[id] " +
        " LEFT OUTER JOIN  [sip].[moneda] moneda  ON a.[idmoneda] = moneda.[id] " +
        " LEFT OUTER JOIN  [sip].[contrato] contrato  ON a.[idcontrato] = contrato.[id] " +
        "WHERE (a.[borrado] = 1) AND a.[estado] != 'ANULADA'" +
        ") " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

    logger.debug(sql0);
    var condition = '';
    if (filters) {
        var jsonObj = JSON.parse(filters);

        if (JSON.stringify(jsonObj.rules) != '[]') {

            jsonObj.rules.forEach(function (item) {

                if (item.op === 'cn' || item.op === 'eq')
                    if (item.field == 'idproveedor') {
                        condition += "proveedor.razonsocial like '%" + item.data + "%' AND";
                    } else {
                        condition += item.field + " = " + item.data + "%' AND";
                    }
            });
            condition = condition.substring(0, condition.length - 4);

            var sqlcount;
            sqlcount = "SELECT count(*) as count FROM [sip].[prefactura] a LEFT OUTER JOIN [sip].[proveedor] proveedor  ON a.[idproveedor] = proveedor.[id] ";
                    "where a.[estado] != 'ANULADA' ";
            if (filters && condition != "") {
              sqlcount += " and " + condition + " ";
            }            

            var sql = "declare @rowsPerPage as bigint; " +
                "declare @pageNum as bigint;" +
                "set @rowsPerPage=" + rows + "; " +
                "set @pageNum=" + page + ";   " +
                "With SQLPaging As   ( " +
                "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
                "as resultNum, a.*, contrato.numero, proveedor.[razonsocial] as proveedor, estructuracui.[cui] as cui, moneda.glosamoneda as moneda " +
                "FROM [sip].[prefactura] a " +
                " LEFT OUTER JOIN [sip].[proveedor] proveedor  ON a.[idproveedor] = proveedor.[id] " +
                " LEFT OUTER JOIN  [sip].[estructuracui] estructuracui  ON a.[idcui] = estructuracui.[id] " +
                " LEFT OUTER JOIN  [sip].[moneda] moneda  ON a.[idmoneda] = moneda.[id] " +
                " LEFT OUTER JOIN  [sip].[contrato] contrato  ON a.[idcontrato] = contrato.[id] " +
                "WHERE ( a.[borrado] = 1) AND a.[estado] != 'ANULADA' AND " + condition+ ") " +
                "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

            logger.debug(sql);

            sequelize.query(sqlcount).spread(function (recs) {
                var records = recs[0].count;
                var total = Math.ceil(parseInt(recs[0].count) / rows);
                sequelize.query(sql)
                    .spread(function (rows) {
                        res.json({ records: records, total: total, page: page, rows: rows });
                    });
            })

        } else {

            models.prefactura.count({

            }).then(function (records) {
                var total = Math.ceil(records / rows);
                sequelize.query(sql0)
                    .spread(function (rows) {
                        res.json({ records: records, total: total, page: page, rows: rows });
                    });
            })
        }

    } else {

        models.prefactura.count({

        }).then(function (records) {
            var total = Math.ceil(records / rows);
            sequelize.query(sql0)
                .spread(function (rows) {
                    res.json({ records: records, total: total, page: page, rows: rows });
                });
        })

    }

}


exports.solicitudesporfactura = function (req, res) {

    var page = req.body.page;
    var rows = req.body.rows;
    var filters = req.body.filters;
    var sidx = req.body.sidx;
    var sord = req.body.sord;

    if (!sidx)
        sidx = "id";

    if (!sord)
        sord = "asc";

    var orden = sidx + " " + sord;

    var additional = [{
        "field": "idprefactura",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            models.solicitudaprobacion.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.solicitudaprobacion.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: data
                }).then(function (iniciativas) {
                    res.json({ records: records, total: total, page: page, rows: iniciativas });
                }).catch(function (err) {
                    logger.error(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });


}


exports.generar = function (req, res) {
    var iniDate = new Date();
    var mes = parseInt(iniDate.getMonth()) + 1
    var mm = mes < 10 ? '0' + mes : mes;
    var periodo = iniDate.getFullYear() + '' + mm;
    var datavacia = [{ 'sin datos': '' }];
    logtransaccion.registrar(
        constants.IniciaGeneraPrefacturas,
        0,
        'insert',
        req.session.passport.user,
        'model',
        datavacia,
        function (err, data) {
            if (err) {
                logger.error(err)
                return res.json({ error_code: 1 });
            }
        });
    logger.debug("****El peridodo:" + periodo);
    sequelize.query('EXECUTE sip.generaprefacturas '
        + periodo + ';').then(function (response) {
            logtransaccion.registrar(
                constants.FinExitoGeneraPrefacturas,
                0,
                'insert',
                req.session.passport.user,
                'model',
                datavacia,
                function (err, data) {
                    if (err) {
                        logger.error(err)
                        return res.json({ error_code: 1 });
                    }
                });
            res.json({ error_code: 0 });
        }).error(function (err) {
            logtransaccion.registrar(
                constants.FinErrorGeneraPrefacturas,
                0,
                'insert',
                req.session.passport.user,
                'model',
                datavacia,
                function (err, data) {
                    if (err) {
                        logger.error(err)
                        return res.json({ error_code: 1 });
                    }
                });
            logger.error(err)
            res.json(err);
        });

};

exports.solicitudesaprobadas = function (req, res) {
    var page = req.body.page;
    var rows = req.body.rows;
    var sidx = req.body.sidx;
    var sord = req.body.sord;
    var filters = req.body.filters;
    var condition = "";
    var iniDate = new Date();
    var mes = parseInt(iniDate.getMonth()) + 1
    var mm = mes < 10 ? '0' + mes : mes;
    var periodo = iniDate.getFullYear() + '' + mm;

    if (!sidx)
        sidx = "id";

    if (!sord)
        sord = "asc";

    var order = " ORDER BY " + sidx + " " + sord + " ";

    if (filters) {
        var jsonObj = JSON.parse(filters);
        jsonObj.rules.forEach(function (item) {
            if (item.op === 'cn')
                condition += " AND " + item.field + " like '%" + item.data + "%'"
        });
    }

    var count = `
            SELECT 
            count(*) cantidad
            FROM sip.solicitudaprobacion a 
            where a.periodo= :periodo and a.idprefactura is null 
            and a.aprobado=1 ` + condition

    var sql = `
            SELECT 
                    a.*, d.glosamoneda, e.cui, f.razonsocial, g.nombre, h.nombre AS calificacion
                    FROM sip.solicitudaprobacion a 
                    join sip.detallecompromiso b on  a.iddetallecompromiso=b.id
		            join sip.detalleserviciocto c on b.iddetalleserviciocto=c.id
                    join sip.moneda d on c.idmoneda=d.id
					join sip.estructuracui e on a.idcui=e.id
					join sip.proveedor f on a.idproveedor=f.id
					join sip.servicio g on a.idservicio= g.id 
                    LEFT JOIN sip.parametro h ON a.idcalificacion = h.id
            where a.periodo= :periodo and a.idprefactura is null 
            and a.aprobado=1 ` + condition + order +
        `OFFSET :rows * (:page - 1) ROWS FETCH NEXT :rows ROWS ONLY`

    logger.debug("lala : " + sql)
    logger.debug("lilo : " + periodo)


    sequelize.query(count,
        {
            replacements: { periodo: periodo, condition: condition },
            type: sequelize.QueryTypes.SELECT
        }).then(function (records) {
            var total = Math.ceil(parseInt(records[0].cantidad) / rows);
            sequelize.query(sql,
                {
                    replacements: { page: parseInt(page), rows: parseInt(rows), periodo: periodo, condition: condition },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data) {
                    res.json({ records: parseInt(records[0].cantidad), total: total, page: page, rows: data });
                }).catch(function (e) {
                    logger.error(e)
                })

        }).catch(function (e) {
            logger.error(e)
        })
}

exports.desgloseporsolicitud = function (req, res) {
    var page = req.body.page;
    var rows = req.body.rows;
    var sidx = req.body.sidx;
    var sord = req.body.sord;
    var idsolicitud = req.params.id;
    var filters = req.body.filters;
    var condition = "";

    if (!sidx)
        sidx = "id";

    if (!sord)
        sord = "asc";

    var order = " ORDER BY " + sidx + " " + sord + " ";

    if (filters) {
        var jsonObj = JSON.parse(filters);
        jsonObj.rules.forEach(function (item) {
            if (item.op === 'cn')
                condition += " AND " + item.field + " like '%" + item.data + "%'"
        });
    }

    var count = `
            SELECT 
            count(*) cantidad
            FROM sip.desglosecontable a 
            where a.idsolicitud =  `+ idsolicitud +
        `  ` + condition

    var sql = `
            SELECT 
                    a.* ,b.cui, c.cuentacontable, c.nombrecuenta 
                    FROM sip.desglosecontable a 
                    join sip.estructuracui b on a.idcui=b.id 
					join sip.cuentascontables c on a.idcuentacontable=c.id
            where a.idsolicitud = `+ idsolicitud +
        `  ` + condition + order +
        `OFFSET :rows * (:page - 1) ROWS FETCH NEXT :rows ROWS ONLY`

    logger.debug("lala : " + sql)
    logger.debug("lili : " + idsolicitud)



    sequelize.query(count,
        {
            replacements: { idsolicitud: idsolicitud, condition: condition },
            type: sequelize.QueryTypes.SELECT
        }).then(function (records) {
            var total = Math.ceil(parseInt(records[0].cantidad) / rows);
            sequelize.query(sql,
                {
                    replacements: { page: parseInt(page), rows: parseInt(rows), idsolicitud: idsolicitud, condition: condition },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data) {
                    res.json({ records: parseInt(records[0].cantidad), total: total, page: page, rows: data });
                }).catch(function (e) {
                    logger.error(e)
                })

        }).catch(function (e) {
            logger.error(e)
        })
}

exports.actiondesglose = function (req, res) {
    var action = req.body.oper;
    /*
    var porcentaje = 0.00
    
    if (action != "del") {
      if (req.body.porcentaje != ""){
        porcentaje1 = parseFloat(req.body.porcentaje)/100;
      }else{
        porcentaje = 0.00;
      }
    }
    */

    switch (action) {
        case "add":
            models.desglosecontable.create({
                idsolicitud: req.body.parent_id,
                idcui: req.body.idcui,
                idcuentacontable: req.body.idcuentacontable,
                porcentaje: req.body.porcentaje,
                borrado: 1
            }).then(function (desglose) {
                logtransaccion.registrar(
                    constants.CreaDesgloseContable,
                    desglose.id,
                    'insert',
                    req.session.passport.user,
                    'desglosecontable',
                    desglose,
                    function (err, data) {
                        if (!err) {
                            res.json({ error_code: 0 });
                        } else {
                            logger.error(err)
                            return res.json({ error_code: 1 });
                        }
                    });
                //res.json({ error_code: 0 });
            }).catch(function (err) {
                logger.error(err);
                res.json({ error_code: 1 });
            });
            break;
        case "edit":
            logtransaccion.registrar(
                constants.ActualizaDesgloseContable,
                req.body.id,
                'update',
                req.session.passport.user,
                models.desglosecontable,
                req.body,
                function (err, idlog) {
                    if (!err) {
                        models.desglosecontable.update({
                            idcui: req.body.idcui,
                            idcuentacontable: req.body.idcuentacontable,
                            porcentaje: req.body.porcentaje
                        }, {
                                where: {
                                    id: req.body.id
                                }
                            }).then(function (contrato) {
                                logtransaccion.actualizar(idlog, req.body.id, models.desglosecontable,
                                    function (err, idlog) {
                                        if (!err) {
                                            res.json({ error_code: 0 });
                                        } else {
                                            logger.error(err)
                                            return res.json({ error_code: 1 });
                                        }
                                    });
                                //res.json({ error_code: 0 });
                            }).catch(function (err) {
                                logger.error(err);
                                res.json({ error_code: 1 });
                            });
                    } else {
                        logger.error(err)
                        return res.json({ error_code: 1 });
                    }
                });
            break;
        case "del":
            logtransaccion.registrar(
                constants.BorraDesgloseContable,
                req.body.id,
                'delete',
                req.session.passport.user,
                models.desglosecontable,
                req.body,
                function (err, data) {
                    if (!err) {
                        models.desglosecontable.destroy({
                            where: {
                                id: req.body.id
                            }
                        }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                            if (rowDeleted === 1) {
                                logger.debug('Deleted successfully');
                            }
                            res.json({ error_code: 0 });
                        }).catch(function (err) {
                            logger.error(err);
                            res.json({ error_code: 1 });
                        });
                    } else {
                        logger.error(err)
                        return res.json({ error_code: 1 });
                    }
                });
            break;

    }

}
exports.porcentajedesglose = function (req, res) {
    var sql = "select sum(porcentaje) as total from sip.desglosecontable where idsolicitud=" + req.params.parentRowKey;
    sequelize.query(sql)
        .spread(function (rows) {
            res.json(rows);
        });
};

exports.getallcuis = function (req, res) {
    var sql = "select id, cui, nombre from sip.estructuracui order by cui";
    sequelize.query(sql)
        .spread(function (rows) {
            res.json(rows);
        });
};

exports.anular = function (req, res) {
    return models.solicitudaprobacion.findAll({
        where: { idprefactura: req.params.id }
    }).then(function (solicitudaprobacion) {

        return models.sequelize.transaction({ autocommit: true }, function (t) {

            var promises = []
            for (var i = 0; i < solicitudaprobacion.length; i++) {
                var onePromise = models.solicitudaprobacion.update({
                    iddetallecompromiso: null,
                    idcontrato: null
                }, {
                        where: { id: solicitudaprobacion[i].id }
                    }, { transaction: t });

                promises.push(onePromise);
                var sap = solicitudaprobacion[i].sap;
                var twoPromise;
                console.log("***SAP:" + sap);
                if (sap) {
                    console.log("***SAP else");
                    twoPromise = models.flujopagoenvuelo.update({
                        saldopago: null,
                        estadopago: null
                    }, {
                            where: { id: solicitudaprobacion[i].iddetallecompromiso }
                        }, { transaction: t });
                } else {
                    console.log("***SAP dentro");
                    twoPromise = models.detallecompromiso.update({
                        saldopago: null,
                        estadopago: null
                    }, {
                            where: { id: solicitudaprobacion[i].iddetallecompromiso }
                        }, { transaction: t });

                }

                promises.push(twoPromise);
            } //cierro for
            var threePromise = models.prefactura.update({
                estado: "Anulada"
            }, {
                    where: { id: req.params.id }
                }, { transaction: t });

            promises.push(threePromise);

            return Promise.all(promises);

        }).then(function (result) {
            res.json({ success: true });
        }).catch(function (err) {
            logger.error(err)
            res.json({ success: false, message: err });
        });

    }).catch(function (err) {
        logger.error(err);
        res.json({ success: false, message: err });
    });
};

//Proyectos
exports.solicitudesaprobadasproy = function (req, res) {
    var page = req.body.page;
    var rows = req.body.rows;
    var sidx = req.body.sidx;
    var sord = req.body.sord;
    var filters = req.body.filters;
    var condition = "";
    var iniDate = new Date();
    var mes = parseInt(iniDate.getMonth()) + 1
    var mm = mes < 10 ? '0' + mes : mes;
    var periodo = iniDate.getFullYear() + '' + mm;

    if (!sidx)
        sidx = "id";

    if (!sord)
        sord = "asc";

    var order = " ORDER BY " + sidx + " " + sord + " ";

    if (filters) {
        var jsonObj = JSON.parse(filters);
        jsonObj.rules.forEach(function (item) {
            if (item.op === 'cn')
                condition += " AND " + item.field + " like '%" + item.data + "%'"
        });
    }

    var count = `
            SELECT 
            count(*) cantidad
            FROM sip.solicitudaprobacion a 
            where a.periodo= :periodo and a.idprefactura is null 
            and a.sap is not null
            and a.aprobado=1 ` + condition

    var sql = `
            SELECT 
                    a.*, d.glosamoneda, e.cui, f.razonsocial, g.nombre, h.nombre AS calificacion
                    FROM sip.solicitudaprobacion a 
                    join sip.flujopagoenvuelo b on  a.iddetallecompromiso=b.id
                    join sip.tareaenvuelo c on b.idtareaenvuelo=c.id
                    join sip.moneda d on c.idmoneda=d.id
					join sip.estructuracui e on a.idcui=e.id
					join sip.proveedor f on a.idproveedor=f.id
					join sip.servicio g on a.idservicio= g.id 
                    LEFT JOIN sip.parametro h ON a.idcalificacion = h.id
            where a.periodo= :periodo and a.idprefactura is null 
            and a.sap is not null
            and a.aprobado=1 ` + condition + order +
        `OFFSET :rows * (:page - 1) ROWS FETCH NEXT :rows ROWS ONLY`

    logger.debug("lala : " + sql)
    logger.debug("lilo : " + periodo)


    sequelize.query(count,
        {
            replacements: { periodo: periodo, condition: condition },
            type: sequelize.QueryTypes.SELECT
        }).then(function (records) {
            var total = Math.ceil(parseInt(records[0].cantidad) / rows);
            sequelize.query(sql,
                {
                    replacements: { page: parseInt(page), rows: parseInt(rows), periodo: periodo, condition: condition },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data) {
                    res.json({ records: parseInt(records[0].cantidad), total: total, page: page, rows: data });
                }).catch(function (e) {
                    logger.error(e)
                })

        }).catch(function (e) {
            logger.error(e)
        })
}

exports.generarproy = function (req, res) {
    var iniDate = new Date();
    var mes = parseInt(iniDate.getMonth()) + 1
    var mm = mes < 10 ? '0' + mes : mes;
    var periodo = iniDate.getFullYear() + '' + mm;

    logger.debug("****El periodo:" + periodo);
    var datavacia = [{ 'sin datos': '' }];
    logtransaccion.registrar(
        constants.IniciaGeneraPrefacturasProyectos,
        0,
        'insert',
        req.session.passport.user,
        'model',
        datavacia,
        function (err, data) {
            if (err) {
                logger.error(err)
                return res.json({ error_code: 1 });
            }
        });    
    return sequelize.query('EXECUTE sip.generaprefacturasproy '
        + periodo + ';').then(function (response) {
            logtransaccion.registrar(
                constants.FinExitoGeneraPrefacturasProyectos,
                0,
                'insert',
                req.session.passport.user,
                'model',
                datavacia,
                function (err, data) {
                    if (err) {
                        logger.error(err)
                        return res.json({ error_code: 1 });
                    }
                });            
            res.json({ error_code: 0 });
        }).error(function (err) {
            logtransaccion.registrar(
                constants.FinErrorGeneraPrefacturasProyectos,
                0,
                'insert',
                req.session.passport.user,
                'model',
                datavacia,
                function (err, data) {
                    if (err) {
                        logger.error(err)
                        return res.json({ error_code: 1 });
                    }
                });            
            logger.error(err)
            res.json(err);
        });

};

exports.getProveedores = function (req, res) {
    var sql = "SELECT DISTINCT (b.id), b.razonsocial as nombre FROM sip.prefactura a JOIN sip.proveedor b ON a.idproveedor=b.id";
    sequelize.query(sql)
        .spread(function (rows) {
            res.json(rows);
        });
};


exports.getExcel = function (req, res) {
    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;
    var condition = "";
    logger.debug("En getExcel");
    var conf = {}
    conf.cols = [
    {
      caption: 'Servicio',
      type: 'string',
      width: 200
    },
    {
      caption: 'Proveedor',
      type: 'string',
      width: 50
    },
    {
      caption: 'Nombre',
      type: 'number',
      width: 40
    },
    {
      caption: 'Apellido',
      type: 'number',
      width: 40
    },
    {
      caption: 'Periodo',
      type: 'number',
      width: 40
    },
    {
      caption: 'Evaluación',
      type: 'number',
      width: 40
    },
    {
      caption: 'Monto Neto',
      type: 'number',
      width: 40
    },
    {
      caption: 'Moneda',
      type: 'number',
      width: 40
    },
    {
      caption: 'CUI',
      type: 'number',
      width: 40
    },
    {
      caption: 'Estado',
      type: 'number',
      width: 40
    },
    {
      caption: 'Prefactura',
      type: 'number',
      width: 40
    },
    {
        caption: 'Fecha Aprobación',
        type: 'number',
        width: 40
      }    
    ];
  
    var sql = "SELECT a.glosaservicio Servicio, b.razonsocial Proveedor, c.first_name Nombre, c.last_name Apellido, a.periodo Periodo, d.nombre Evaluacion, "+
    "a.montoneto MontoNeto, h.moneda Moneda, e.cui CUI, "+
    "IIF(a.aprobado=0, 'Pendiente', IIF(a.aprobado=1,'Aprobado', IIF(a.aprobado=2,'Rechazado', IIF(a.aprobado=3,'Provisionado', 'Ya Facturado')))) Estado,  "+
    "a.idprefactura Prefactura , convert(VARCHAR(10), a.fechaactualizacion,105) FechaAprobacion "+
    "FROM sip.solicitudaprobacion a "+
    "JOIN sip.proveedor b ON a.idproveedor=b.id "+
    "JOIN art_user c ON c.uid = a.uid  "+
    "JOIN sip.parametro d ON a.idcalificacion=d.id "+
    "join sip.estructuracui e on a.idcui=e.id "+
    "JOIN sip.detallecompromiso f ON f.id=a.iddetallecompromiso  "+
    "JOIN sip.detalleserviciocto g ON f.iddetalleserviciocto=g.id "+
    "JOIN sip.moneda h ON g.idmoneda=h.id";
    console.log("query:"+sql);
    sequelize.query(sql)
      .spread(function (proyecto) {
        var arr = []
        for (var i = 0; i < proyecto.length; i++) {
  
          var a = [
          proyecto[i].Servicio,
          proyecto[i].Proveedor,
          proyecto[i].Nombre,
          proyecto[i].Apellido,
          proyecto[i].Periodo,
          proyecto[i].Evaluacion,
          proyecto[i].MontoNeto,
          proyecto[i].Moneda,
          proyecto[i].CUI,
          proyecto[i].Estado,
          proyecto[i].Prefactura,
          proyecto[i].FechaAprobacion
          ];
          arr.push(a);
        }
        //console.log("*******"+JSON.stringify(arr));
        conf.rows = arr;
  
        var result = nodeExcel.execute(conf);
        res.setHeader('Content-Type', 'application/vnd.openxmlformates');
        res.setHeader("Content-Disposition", "attachment;filename=" + "EvaluacionServicioProveedor.xlsx");
        res.end(result, 'binary');
  
      }).catch(function (err) {
        logger.debug(err);
        res.json({ error_code: 100 });
      });
  
  };