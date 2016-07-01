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

    }, getRadioElementValue: function (elem, oper, value) {
        if (oper === "set") {
            var radioButton = $(elem).find("input:radio[value='" + value + "']");
            if (radioButton.length > 0) {
                radioButton.prop("checked", true);
            }
        }

        if (oper === "get") {
            return $(elem).find("input:radio:checked").val();
        }
    }, jqGrid_loadErrorHandler: function (xht, st, handler) {
        jQuery(document.body).css('font-size', '100%');
        jQuery(document.body).html(xht.responseText);
    }, radioElemContrato: function (value, options) {
        var receivedradio = '<label class="radio-inline"><input type="radio" name="tipocontrato" value="1"',
            breakline = '/>Continuidad</label>',
            naradio = '<label class="radio-inline"><input type="radio" name="tipocontrato" value="0"',
            endnaradio = '/>Proyecto</label>';

        if (value === '1') {
            return "<div style='margin-top:5px'>" + receivedradio + ' checked="checked"' + breakline + naradio + endnaradio + "</div>";
        }
        if (value === '0') {
            return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
        }
        return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + endnaradio + "</div>";
    }, radioElemDocumento: function (value, options) {
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
    }, radioElemReqcontrato: function (value, options) {
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
        return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + endnaradio + "</div>";
    }, radioElemConIva: function (value, options) {
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
        return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + endnaradio + "</div>";
    },radioElemEstadoPre: function (value, options) {
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
    }, currencyFormatter: function (cellvalue, options, rowObject) {
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
        }
        else {
            return format(cellvalue);
        }
    }
}

