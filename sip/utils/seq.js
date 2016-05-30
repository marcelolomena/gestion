module.exports = (function () {

    var buildCondition = function (filters, callback) {
        var condition = [];
        try {
            if (filters) {

                var jsonObj = JSON.parse(filters);

                if (JSON.stringify(jsonObj.rules) != '[]') {

                    jsonObj.rules.forEach(function (item) {
                        switch (item.op) {
                            case "cn":
                                condition.push({ [item.field]: { $like: '%' + item.data + '%' } });
                                break;
                            case "eq":
                                if (item.data != 0)
                                    condition.push({ [item.field]: item.data });
                                break;
                            case "ge":
                                condition.push({ [item.field]: { $gte: item.data } });
                                break;
                            case "le":
                                condition.push({ [item.field]: { $lte: item.data } });
                                break;
                        }
                    });
                }
            }

            condition.push({ borrado: 1 })
        } catch (e) {
            return callback(e);
        }
        callback(undefined, condition);
    }
    var buildAdditionalCondition = function (filters, additional, callback) {
        var condition = [];
        try {
            if (filters) {

                var jsonObj = JSON.parse(filters);

                if (JSON.stringify(jsonObj.rules) != '[]') {

                    jsonObj.rules.forEach(function (item) {
                        switch (item.op) {
                            case "cn":
                                condition.push({ [item.field]: { $like: '%' + item.data + '%' } });
                                break;
                            case "eq":
                                if (item.data != 0)
                                    condition.push({ [item.field]: item.data });
                                break;
                            case "ge":
                                condition.push({ [item.field]: { $gte: item.data } });
                                break;
                            case "le":
                                condition.push({ [item.field]: { $lte: item.data } });
                                break;
                        }
                    });
                }
            }

            if (additional) {
                additional.forEach(function (item) {
                    condition.push({ [item.field]: item.data });
                })
            }

            condition.push({ borrado: 1 })
        } catch (e) {
            return callback(e);
        }
        callback(undefined, condition);
    }
    var getDateRange = function (startDate, callback) {
        var range = [];
        try {
            var tmpDate = startDate.toISOString().slice(0, 10).split("-");
            var iniDate = new Date(parseInt(tmpDate[0]), parseInt(tmpDate[1]) - 1, 15);
            var endDate = new Date(parseInt(tmpDate[0]) + 1, parseInt(tmpDate[1]) - 1, 15);

            while (iniDate.getTime() < endDate.getTime()) {
                var mes = parseInt(iniDate.getMonth()) + 1
                var mm = mes < 10 ? '0' + mes : mes;
                var period = iniDate.getFullYear() + '' + mm;
                range.push(parseInt(period));
                iniDate.setTime(iniDate.getTime() + 86400000 * 30);//1 mes
            }

        } catch (e) {
            return callback(e);
        }
        callback(undefined, range);
    }
    return {
        buildCondition: buildCondition,
        buildAdditionalCondition: buildAdditionalCondition,
        getDateRange: getDateRange
    };


})();