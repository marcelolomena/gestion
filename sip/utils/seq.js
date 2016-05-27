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
            var theDate = new Date(startDate.getTime());

            var now = new Date();

            while (theDate.getTime() < now.getTime()) {
                var string = theDate.getFullYear() + "-" +
                    (theDate.getMonth() + 1) + "-" +
                    theDate.getDate();
                range.push(string);
                theDate.setTime(theDate.getTime() + 86400000);
            }

        } catch (e) {
            return callback(e);
        }
        callback(undefined, range);
    }
    return {
        buildCondition: buildCondition,
        buildAdditionalCondition: buildAdditionalCondition
    };


})();