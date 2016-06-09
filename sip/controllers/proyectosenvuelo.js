exports.list = function (req, res) {

    var page = req.body.page;
    var rows = req.body.rows;
    var filters = req.body.filters;
    var sidx = req.body.sidx;
    var sord = req.body.sord;

    if (!sidx)
        sidx = "nombre";

    if (!sord)
        sord = "asc";

    var orden = sidx + " " + sord;

    utilSeq.buildCondition(filters, function (err, data) {
        if (err) {
            console.log("->>> " + err)
        } else {

            models.proyectosenvuelo.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.proyectosenvuelo.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: data
                }).then(function (proyectosenvuelo) {
                    //Contrato.forEach(log)
                    res.json({ records: records, total: total, page: page, rows: proyectosenvuelo });
                }).catch(function (err) {
                    //console.log(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });

};
