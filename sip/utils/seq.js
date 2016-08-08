module.exports = (function () {
    Number.prototype.formatMoney = function (decPlaces, thouSeparator, decSeparator) {
        var n = this,
            decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
            decSeparator = decSeparator == undefined ? "." : decSeparator,
            thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
            sign = n < 0 ? "-" : "",
            i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
        return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
    };
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

    var buildConditionExternal = function (filters, callback) {
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

            //condition.push({ borrado: 1 })
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
    var getMonthRange = function (startDate, endDate, callback) {
        var range = [];
        try {
            var iDate = startDate.toISOString().slice(0, 10).split("-");
            var eDate = endDate.toISOString().slice(0, 10).split("-");
            var iniDate = new Date(parseInt(iDate[0]), parseInt(iDate[1]) - 1, 15);
            var endDate = new Date(parseInt(eDate[0]), parseInt(eDate[1]) - 1, 15);

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
    var getYearRange = function (startDate, endDate, callback) {
        var range = [];
        try {
            var iDate = startDate.toISOString().slice(0, 10).split("-");
            var eDate = endDate.toISOString().slice(0, 10).split("-");
            var iYear = parseInt(iDate[0]);
            var eYear = parseInt(eDate[0]);
            var largo = eYear - iYear;
            var iniDate = new Date(parseInt(iDate[0]), parseInt(iDate[1]) - 1, 15);
            //var endDate = new Date(parseInt(eDate[0]) + 1, parseInt(eDate[1]) - 1, 15);

            for (var i = 0; i <= largo; i++) {
                var mes = parseInt(iniDate.getMonth()) + 1
                var mm = mes < 10 ? '0' + mes : mes;
                var agno = iYear + i;
                var period = agno + '' + mm;
                range.push(parseInt(period));
            }
        } catch (e) {
            return callback(e);
        }
        callback(undefined, range);
    }
    var getPeriodRange = function (currentYear, callback) {
        var period = [];
        try {
            var periodIni = currentYear + '09';
            //console.log('periodInit:' + periodIni);
            var periodEnd = (currentYear + 1) + '12';
            //console.log('periodEnd:' + periodEnd);
            for (var i = 1; periodIni <= periodEnd; i++) {
                //console.log('----->>' + periodIni);

                if (periodIni.toString().substring(4, 6) == '12') {
                    period.push(parseInt(periodIni));
                    periodIni = (parseInt(periodIni.toString().substring(0, 4)) + 1) + '01'
                }

                if (periodIni < periodEnd) {
                    period.push(parseInt(periodIni));
                }
                periodIni++;
            }
        } catch (e) {
            return callback(e);
        }
        callback(undefined, period);
    }
    var JSON2CSV = function (data) {
        var result, ctr, keys, columnDelimiter, lineDelimiter;
        var ids = ['cuenta', 'seccion', 'departamento', 'gerencia']

        columnDelimiter = ';';
        lineDelimiter = '\n';

        keys = Object.keys(data[0]);

        for (var j = 0; j <= 15; j++)
            ids.push(keys[j])

        result = '';
        result += ids.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function (item) {
            ctr = 0;
            ids.forEach(function (key) {
                if (ctr > 0) result += columnDelimiter;

                if (key == 'cuenta' || key == 'seccion' || key == 'departamento' || key == 'gerencia') {
                    result += item[key] == null ? 0 : item[key];
                } else {
                    //result += item[key] == null ? 0 : parseFloat(item[key]).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
                    result += item[key] == null ? 0 : item[key].formatMoney(2, '.', ',');
                }

                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }
    return {
        buildCondition: buildCondition,
        buildConditionExternal: buildConditionExternal,
        buildAdditionalCondition: buildAdditionalCondition,
        getDateRange: getDateRange,
        getMonthRange: getMonthRange,
        getYearRange: getYearRange,
        getPeriodRange: getPeriodRange,
        JSON2CSV: JSON2CSV
    };
})();