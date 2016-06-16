function showThirdLevelChildGrid(parentRowID, parentRowKey) {
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";

    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Periodo{periodo}</div>";
    template += "<div class='column-half'>Presupuesto{presupuestoorigen}</div>";
    template += "</div>";

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    var modelFlujoEnVuelo = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'iddetalleenvuelo', name: 'iddetalleenvuelo', hidden: true },
        {
            label: 'Periodo', name: 'periodo', width: 50, align: 'left', search: true, editable: true,
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("000000", { placeholder: "______" });

                }
            }, editrules: { required: true, number: true }
        },
        { label: 'idmoneda', name: 'idmoneda', search: false, hidden: true, editable: true },
        {
            label: 'Presupuesto', name: 'presupuestoorigen', width: 150, align: 'left', search: true, editable: true,
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000,00', { reverse: true });
                }
            }, editrules: { required: true }
        },
        { label: 'presupuestopesos', name: 'presupuestopesos', search: false, hidden: true, editable: true },
    ];

    $("#" + childGridID).jqGrid({
        url: '/flujoenvuelo/' + parentRowKey,
        mtype: "GET",
        datatype: "json",
        colModel: modelFlujoEnVuelo,
        page: 1,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        caption: 'Flujo de proyectos en vuelo',
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        pager: "#" + childGridPagerID,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false, add: true, del: true, search: false, refresh: true,
        view: false, position: "left", cloneToTop: false
    }, {},
        {
            addCaption: "Agrega Periodo",
            closeAfterAdd: true,
            recreateForm: true,
            mtype: 'POST',
            url: '/flujoenvuelo/' + parentRowKey,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {
                postdata.presupuestoorigen = postdata.presupuestoorigen.split(".").join("").replace(",", ".");
                return [true, "", ""]
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0) {
                    return [false, result.error_text, ""];
                } else {
                    $("#" + childGridID).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }, beforeShowForm: function (form) {
                //sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }
        },
        {
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            mtype: 'POST',
            url: '/flujoenvuelo/' + parentRowKey,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }
        },
        {
            recreateFilter: true
        }
    );

    $("#" + childGridID).jqGrid('navButtonAdd', "#" + childGridPagerID, {
        caption: "",
        buttonicon: "glyphicon glyphicon-pencil",
        title: "Editar",
        position: "last",
        onClickButton: function () {
            var subgrid = $("#" + childGridID);
            var ids = subgrid.jqGrid('getDataIDs');
            for (var i = 0; i < ids.length; i++) {
                subgrid.jqGrid('editRow', ids[i]);
            }
        }
    });

    $("#" + childGridID).jqGrid('navButtonAdd', "#" + childGridPagerID, {
        caption: "",
        buttonicon: 'glyphicon glyphicon-save-file',
        title: "Grabar",
        iconsOverText: true,
        position: "last",
        onClickButton: function () {
            var subgrid = $("#" + childGridID);
            var ids = subgrid.jqGrid('getDataIDs');
            var url = '/flujoenvuelo/' + parentRowKey;
            for (var i = 0; i < ids.length; i++) {
                subgrid.jqGrid('saveRow', ids[i], { "url": url });
            }
            subgrid.trigger('reloadGrid');
        }
    });

}
