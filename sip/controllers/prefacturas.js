var models = require('../models');
var sequelize = require('../models/index').sequelize;
var userService = require('../service/user');
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");
exports.list = function (req, res) {

    var page = req.body.page;
    var rows = req.body.rows;
    var filters = req.body.filters;
    var sidx = req.body.sidx;
    var sord = req.body.sord;

    if (!sidx)
        sidx = "a.id";

    if (!sord)
        sord = "asc";

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

    if (filters) {
        var jsonObj = JSON.parse(filters);

        if (JSON.stringify(jsonObj.rules) != '[]') {

            jsonObj.rules.forEach(function (item) {

                if (item.op === 'cn')
                    condition += item.field + " like '%" + item.data + "%' AND"
            });

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
                "WHERE ( a.[borrado] = 1) AND a.[estado] != 'ANULADA' AND " + condition.substring(0, condition.length - 4) + ") " +
                "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

            logger.debug(sql);

            models.prefactura.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
                var total = Math.ceil(records / rows);
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

    logger.debug("****El peridodo:" + periodo);
    sequelize.query('EXECUTE sip.generaprefacturas '
        + periodo + ';').then(function (response) {
            res.json({ error_code: 0 });
        }).error(function (err) {
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
            a.sap is null
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
            a.sap is null
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
            }).then(function (iniciativa) {
                res.json({ error_code: 0 });
            }).catch(function (err) {
                logger.error(err);
                res.json({ error_code: 1 });
            });
            break;
        case "edit":
            models.desglosecontable.update({
                idcui: req.body.idcui,
                idcuentacontable: req.body.idcuentacontable,
                porcentaje: req.body.porcentaje
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (contrato) {
                    res.json({ error_code: 0 });
                }).catch(function (err) {
                    logger.error(err);
                    res.json({ error_code: 1 });
                });
            break;
        case "del":
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
            for(var i=0; i<solicitudaprobacion.length;i++){
                var onePromise = models.solicitudaprobacion.update({
                    iddetallecompromiso: null,
                    idcontrato:null
                }, {
                        where: { id: solicitudaprobacion[i].id }
                    }, { transaction: t });

                promises.push(onePromise);

                var twoPromise = models.detallecompromiso.update({
                    saldopago: null,
                    estadopago: null
                }, {
                        where: { id: solicitudaprobacion[i].iddetallecompromiso }
                    }, { transaction: t });

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

    logger.debug("****El peridodo:" + periodo);
    sequelize.query('EXECUTE sip.generaprefacturasproy '
        + periodo + ';').then(function (response) {
            res.json({ error_code: 0 });
        }).error(function (err) {
            logger.error(err)
            res.json(err);
        });

};

