function gridDetail(parentRowID, parentRowKey) {
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    var childGridURL = "/compromisos/" + parentRowKey;

    var templateDetalle = "<div id='responsive-form' class='clearfix'>";

    templateDetalle += "<div class='form-row'>";
    templateDetalle += "<div class='column-half'>Periodo{periodo}</div>";
    templateDetalle += "<div class='column-half'>Monto{montopesos}</div>";
    templateDetalle += "</div>";

    templateDetalle += "<hr style='width:100%;'/>";
    templateDetalle += "<div> {sData} {cData}  </div>";
    templateDetalle += "</div>";

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "POST",
        datatype: "json",
        page: 1,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        width: null,
        shrinkToFit: false,
        caption: 'Compromisos',
        colModel: [
            { label: 'id', name: 'id', key: true, hidden: true },
            {
                label: 'Período', name: 'periodo', width: 100, editable: true,
                editoptions: {
                    dataInit: function (element) {
                        $(element).mask("000000", { placeholder: "______" });

                    }
                }
            },
            {
                label: 'Monto', name: 'montopesos', width: 100, editable: true,
                editoptions: {
                    dataInit: function (el) {
                        $(el).mask('000.000.000.000.000,00', { reverse: true });
                    }
                }
            }
        ],
        pager: "#" + childGridPagerID,
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        editurl: '/contratos/action',
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $("#grid").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#grid").addRowData("blankRow", { "periodo": "No hay datos" });
            }
        }
    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, { edit: true, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false },
        {
            editCaption: "Modifica Periodo",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: templateDetalle,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }, beforeShowForm: function (form) {
                //sipLibrary.centerDialog($('#grid').attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }
        },
        {
            addCaption: "Agrega Periodo",
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: templateDetalle,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0) {
                    return [false, result.error_text, ""];
                } else {
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"nombre\",\"op\":\"cn\",\"data\":\"" + postdata.nombre + "\"}]}";
                    $("#grid").jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
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

    $('#' + childGridID).closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").children("span.ui-jqgrid-title").css("background-color", "Gold");

    $("#" + childGridPagerID + "_left").css("width", "");
}