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
    }, createTipoContratoEditElement: function (value, editOptions) {
        var div = $("<div style='margin-top:5px'></div>");
        var label0 = $("<label class='radio-inline'></label>");
        var radio0 = $("<input>", { type: "radio", value: "1", name: "tipocontrato", id: "tipocontrato_uno", checked: value == 0 });
        label0.append(radio0).append("Continuidad");
        var label1 = $("<label class='radio-inline'></label>");
        var radio1 = $("<input>", { type: "radio", value: "0", name: "tipocontrato", id: "tipocontrato_cero" });
        label1.append(radio1).append("Proyecto");
        div.append(label0).append(label1);
        return div;
    }, createTipoDocumentoEditElement: function (value, editOptions) {
        var div = $("<div style='margin-top:5px'></div>");
        var label1 = $("<label class='radio-inline'></label>");
        var radio1 = $("<input>", { type: "radio", value: "1", name: "tipodocumento", id: "tipodocumento_uno", checked: value == 0 });
        label1.append(radio1).append("Contrato");
        var label2 = $("<label class='radio-inline'></label>");
        var radio2 = $("<input>", { type: "radio", value: "0", name: "tipodocumento", id: "tipodocumento_cero" });
        label2.append(radio2).append("Orden de Compra");
        div.append(label1).append(label2);
        return div;
    }, jqGrid_loadErrorHandler: function (xht, st, handler) {
        jQuery(document.body).css('font-size', '100%');
        jQuery(document.body).html(xht.responseText);
    }
}

