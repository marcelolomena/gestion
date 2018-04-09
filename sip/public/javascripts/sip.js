//sip.js
var sipLibrary = {

    jsonOptions: {
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    },
    createJSON: function (postdata) {
        if (postdata.id === '_empty')
            postdata.id = null;
        return JSON.stringify(postdata)
    },
    centerDialog: function (id) {
        var dlgDiv = $("#editmod" + id);
        var parentDiv = dlgDiv.parent(); // div#gbox_list
        var dlgWidth = dlgDiv.width();
        var parentWidth = parentDiv.width();
        var dlgHeight = dlgDiv.height();
        var parentHeight = parentDiv.height();
        var parentTop = parentDiv.offset().top;
        var parentLeft = parentDiv.offset().left;

        var height = parentTop + (parentHeight - dlgHeight) / 2
        if (height < 0)
            height = 0;

        dlgDiv[0].style.top = Math.round(height) + "px";
        dlgDiv[0].style.left = Math.round(parentLeft + (parentWidth - dlgWidth) / 2) + "px";

    },
    getRadioElementValue: function (elem, oper, value) {
        if (oper === "set") {
            var radioButton = $(elem).find("input:radio[value='" + value + "']");
            if (radioButton.length > 0) {
                radioButton.prop("checked", true);
            }
        }

        if (oper === "get") {
            return $(elem).find("input:radio:checked").val();
        }
    },
    jqGrid_loadErrorHandler: function (xht, st, handler) {
        jQuery(document.body).css('font-size', '100%');
        jQuery(document.body).html(xht.responseText);

    },
    radioElemEstadoSolici: function (value, options) {
        var receivedradio = '<label class="radio-inline"><input type="radio" name="estado" value="Abierto"',
            breakline = '/>Abierto</label>',
            naradio = '<label class="radio-inline"><input type="radio" name="estado" value="Cerrado"',
            endnaradio = '/>Cerrado</label>';

        if (value === 'Abierto') {
            return "<div style='margin-top:5px'>" + receivedradio + ' checked="checked"' + breakline + naradio + endnaradio + "</div>";
        }
        if (value === 'Cerrado') {
            return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
        }
        return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + endnaradio + "</div>";
    },

    radioElemReservaAutorizacion: function (value, options) {
        var receivedradio = '<label class="radio-inline"><input type="radio" name="estado" value="Autorizado"',
            breakline = '/>Autorizado</label>',
            naradio = '<label class="radio-inline"><input type="radio" name="estado" value="Denegado"',
            endnaradio = '/>Denegado</label>';

        if (value === 'Autorizado') {
            return "<div style='margin-top:5px'>" + receivedradio + ' checked="checked"' + breakline + naradio + endnaradio + "</div>";
        }
        if (value === 'Denegado') {
            return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
        }
        return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + endnaradio + "</div>";
    },


    radioElemCompraTramite: function (value, options) {
        var receivedradio = '<label class="radio-inline"><input type="radio" name="estado" value="1"',
            breakline = '/>En Trámite</label>',
            naradio = '<label class="radio-inline"><input type="radio" name="estado" value="0"',
            endnaradio = '/>Recepcionado</label>';

        if (value === 'En Trámite') {
            return "<div style='margin-top:5px'>" + receivedradio + ' checked="checked"' + breakline + naradio + endnaradio + "</div>";
        }
        if (value === 'Recepcionado') {
            return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
        }
        return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + endnaradio + "</div>";
    },
    radioElemContrato: function (value, options) {
        var receivedradio = '<label class="radio-inline"><input type="radio" name="tipocontrato" value="1"',
            breakline = '/>Continuidad</label>',
            naradio = '<label class="radio-inline"><input type="radio" name="tipocontrato" value="0"',
            endnaradio = '/>Proyecto</label>';

        if (value === 'Continuidad') {
            return "<div style='margin-top:5px'>" + receivedradio + ' checked="checked"' + breakline + naradio + endnaradio + "</div>";
        }
        if (value === 'Proyectos') {
            return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
        }
        return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + endnaradio + "</div>";
    },
    radioElemDocumento: function (value, options) {
        var receivedradio = '<label class="radio-inline"><input type="radio" name="tipodocumento" value="1"',
            breakline = '/>Contrato</label>',
            naradio = '<label class="radio-inline"><input type="radio" name="tipodocumento" value="0"',
            endnaradio = '/>Orden de Compra</label>';

        if (value === '1') {
            return "<div style='margin-top:5px'>" + receivedradio + ' checked="checked"' + breakline + naradio + endnaradio + "</div>";
        }
        if (value === '0') {
            return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
        }
        return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + endnaradio + "</div>";
    },
    radioElemReqcontrato: function (value, options) {
        var receivedradio = '<label class="radio-inline"><input type="radio" name="reqcontrato" value="1"',
            breakline = '/>Sí</label>',
            naradio = '<label class="radio-inline"><input type="radio" name="reqcontrato" value="0"',
            endnaradio = '/>No</label>';

        if (value === 'Sí') {
            return "<div style='margin-top:5px'>" + receivedradio + ' checked="checked"' + breakline + naradio + endnaradio + "</div>";
        }
        if (value === 'No') {
            return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
        }
        //return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + endnaradio + "</div>";
        return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
    },
    radioElemConIva: function (value, options) {
        var receivedradio = '<label class="radio-inline"><input type="radio" name="coniva" value="1"',
            breakline = '/>Sí</label>',
            naradio = '<label class="radio-inline"><input type="radio" name="coniva" value="0"',
            endnaradio = '/>No</label>';

        if (value === 'Sí') {
            return "<div style='margin-top:5px'>" + receivedradio + ' checked="checked"' + breakline + naradio + endnaradio + "</div>";
        }
        if (value === 'No') {
            return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
        }
        //return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + endnaradio + "</div>";
        return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
    },
    radioElemEstadoPre: function (value, options) {
        var receivedradio = '<label class="radio-inline"><input type="radio"  name="estado" value="1"',
            breakline = '/>Creado</label>',
            naradio = '<label class="radio-inline"><input type="radio" name="estado" value="0"',
            endnaradio = '/>Confirmado</label>';

        if (value === '1') {
            return "<div style='margin-top:5px'>" + receivedradio + ' checked="checked"' + breakline + naradio + endnaradio + "</div>";
        }
        if (value === '0') {
            return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
        }
        return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + endnaradio + "</div>";
    },
    radioElemInvgasto: function (value, options) {
        var receivedradio = '<label class="radio-inline"><input type="radio"  name="estado" value="1"',
            breakline = '/>Inversión</label>',
            naradio = '<label class="radio-inline"><input type="radio" name="estado" value="2"',
            endnaradio = '/>Gasto</label>';

        if (value === '1') {
            return "<div style='margin-top:5px'>" + receivedradio + ' checked="checked"' + breakline + naradio + endnaradio + "</div>";
        }
        if (value === '2') {
            return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
        }
        return "<div style='margin-top:5px'>" + receivedradio + ' checked="checked"' + breakline + naradio + endnaradio + "</div>";
    },
    radioElemInscripcion: function (value, options) {
        var receivedradio = '<label class="radio-inline"><input type="radio" name="parainscripcion" value="1"',
            breakline = '/>Sí</label>',
            naradio = '<label class="radio-inline"><input type="radio" name="parainscripcion" value="0"',
            endnaradio = '/>No</label>';

        if (value === 'Sí') {
            return "<div style='margin-top:5px'>" + receivedradio + ' checked="checked"' + breakline + naradio + endnaradio + "</div>";
        }
        if (value === 'No') {
            return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
        }
        //return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + endnaradio + "</div>";
        return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
    },
    radioElemAnexo: function (value, options) {
        var receivedradio = '<label class="radio-inline"><input type="radio" name="anexo" value="1"',
            breakline = '/>Sí</label>',
            naradio = '<label class="radio-inline"><input type="radio" name="anexo" value="0"',
            endnaradio = '/>No</label>';

        if (value === 'Sí') {
            return "<div style='margin-top:5px'>" + receivedradio + ' checked="checked"' + breakline + naradio + endnaradio + "</div>";
        }
        if (value === 'No') {
            return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
        }
        //return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + endnaradio + "</div>";
        return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
    },
    radioElemAprobacion: function (value, options) {
        var receivedradio = '<label class="radio-inline"><input type="radio" name="tipoaprobacion" value="1"',
            breakline = '/>Aceptado</label>',
            naradio = '<label class="radio-inline"><input type="radio" name="tipoaprobacion" value="0"',
            endnaradio = '/>Rechazado</label>';

        if (value === 'Aceptado') {
            return "<div style='margin-top:5px'>" + receivedradio + ' checked="checked"' + breakline + naradio + endnaradio + "</div>";
        }
        if (value === 'Rechazado') {
            return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
        }
        //return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + endnaradio + "</div>";
        return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
    },
    radioElemInstalacion: function (value, options) {
        var receivedradio = '<label class="radio-inline"><input type="radio" name="tipoinstalacion" value="1"',
            breakline = '/>PC</label>',
            naradio = '<label class="radio-inline"><input type="radio" name="tipoinstalacion" value="0"',
            endnaradio = '/>Servidor</label>';

        if (value === 'Servidor') {
            return "<div style='margin-top:5px'>" + receivedradio + ' checked="checked"' + breakline + naradio + endnaradio + "</div>";
        }
        if (value === 'PC') {
            return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
        }
        //return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + endnaradio + "</div>";
        return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
    },
    currencyFormatter: function (cellvalue, options, rowObject) {
        var formatoptions = options.colModel.formatoptions || {};

        formatoptions.defaulValue = formatoptions.defaulValue || 0;
        formatoptions.thousandsSeparator = formatoptions.thousandsSeparator || ".";
        formatoptions.decimalPlaces = formatoptions.decimalPlaces || 0;
        formatoptions.suffix = formatoptions.suffix || "";
        formatoptions.prefix = formatoptions.prefix || "";
        formatoptions.thousandsSeparator = formatoptions.thousandsSeparator || ".";

        var format = function (value) {
            value = Math.ceil(value).toString();

            var reg = /(\d+)(\d{3})/g;

            while (reg.test(value))
                value = value.replace(reg, "$1" + formatoptions.thousandsSeparator + "$2");

            if (formatoptions.decimalPlaces > 0)
                value += ",";

            for (var i = 0; i < formatoptions.decimalPlaces; i++)
                value += "0";

            return formatoptions.prefix + value + formatoptions.suffix;
        }

        if (cellvalue === undefined) {
            if (formatoptions.defaulValue != undefined)
                return format(formatoptions.defaulValue);
            else
                return format(0);
        } else {
            return format(cellvalue);
        }
    },
    currentPeriod: function (currentYear) {
        //var currentYear = (new Date).getFullYear();
        var period = [];
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
        //console.dir(period);
        return period;
    },
    JSON2CSV: function (objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

        var str = '';
        var line = '';

        if ($("#labels").is(':checked')) {
            var head = array[0];
            if ($("#quote").is(':checked')) {
                for (var index in array[0]) {
                    var value = index + "";
                    line += '"' + value.replace(/"/g, '""') + '",';
                }
            } else {
                for (var index in array[0]) {
                    line += index + ',';
                }
            }

            line = line.slice(0, -1);
            str += line + '\r\n';
        }

        for (var i = 0; i < array.length; i++) {
            var line = '';

            if ($("#quote").is(':checked')) {
                for (var index in array[i]) {
                    var value = array[i][index] + "";
                    line += '"' + value.replace(/"/g, '""') + '",';
                }
            } else {
                for (var index in array[i]) {
                    line += array[i][index] + ',';
                }
            }

            line = line.slice(0, -1);
            str += line + '\r\n';
        }
        return str;

    },
    radioElemPerpetua: function (value, options) {
        var receivedradio = '<label class="radio-inline"><input type="radio" name="perpetua" value="1"',
            breakline = '/>Perpetua</label>',
            naradio = '<label class="radio-inline"><input type="radio" name="perpetua" value="0"',
            endnaradio = '/>Suscripción</label>';

        if (value === 'Perpetua') {
            return "<div style='margin-top:5px'>" + receivedradio + ' checked="checked"' + breakline + naradio + endnaradio + "</div>";
        }
        if (value === 'Suscripción') {
            return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
        }
        return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + endnaradio + "</div>";
    },
    radioElemReserva: function (value, options) {
        console.log('aloha');
        var receivedradio = '<label class="radio-inline"><input type="radio" name="estado" value="Aprobado"',
            breakline = '/>Aprobado</label>',
            naradio = '<label class="radio-inline"><input type="radio" name="estado" value="Rechazado"',
            endnaradio = '/>Rechazado</label>';

        if (value === 'Aprobado') {
            return "<div style='margin-top:5px'>" + receivedradio + ' checked="checked"' + breakline + naradio + endnaradio + "</div>";
        }
        if (value === 'Rechazado') {
            return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
        }
        return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + endnaradio + "</div>";
    },
    radioElemInstalacion: function (value, options) {
        console.log('aloha');
        var receivedradio = '<label class="radio-inline"><input type="radio" name="estado" value="Instalado"',
            breakline = '/>Instalado</label>',
            naradio = '<label class="radio-inline"><input type="radio" name="estado" value="NoInstalado"',
            endnaradio = '/>No Instalado</label>';

        if (value === 'Instalado') {
            return "<div style='margin-top:5px'>" + receivedradio + ' checked="checked"' + breakline + naradio + endnaradio + "</div>";
        }
        if (value === 'NoInstalado') {
            return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
        }
        return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + endnaradio + "</div>";
    },	
}