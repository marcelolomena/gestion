var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var log = function (inst) {
    console.dir(inst.get())
}

exports.test = function (req, res) {

    models.DetalleServicioCto.belongsTo(models.Contrato, { foreignKey: 'idcontrato' });
    models.DetalleServicioCto.belongsTo(models.EstructuraCui, { foreignKey: 'idcui' });
    models.DetalleServicioCto.belongsTo(models.Moneda, { foreignKey: 'idmoneda' });
    models.DetalleServicioCto.belongsTo(models.Servicio, { foreignKey: 'idservicio' });
    models.DetalleServicioCto.belongsTo(models.CuentasContables, { foreignKey: 'idcuenta', through: models.Servicio });

    models.DetalleServicioCto.findAll({
        //attributes: ['id', 'user.nickname'],
        where: { id: 415 },
        include: [{ model: models.Contrato },
            { model: models.EstructuraCui },
            { model: models.Servicio },
            {
                model: models.CuentasContables
            }
        ]
    }).then(function (contratos) {
        contratos.forEach(log)
    }).catch(function (err) {
        console.log(err);
    });

}