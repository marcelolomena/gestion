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
    }, checkElemImpuesto: function (value, options) {
        var chk0 = '<label class="radio-inline"><input type="checkbox" name="impuesto" value="0"',
            endchk0 = '/>Impuesto</label>',
            chk1 = '<label class="radio-inline"><input type="checkbox" name="impuesto" value="1"',
            endchk1 = '/>Impuesto</label>';

        if (value === '0') {
            return "<div style='margin-top:5px'>" + chk0 + endchk0 + "</div>";
        }
        if (value === '1') {
            return "<div style='margin-top:5px'>" + chk1 + ' checked="checked"' + endchk1 + "</div>";
        }

        return "<div style='margin-top:5px'>" + chk0 + endchk0 + "</div>";
    }
}

