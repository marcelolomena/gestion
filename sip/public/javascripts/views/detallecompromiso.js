function gridDetail(parentRowID, parentRowKey) {
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    var templateDetalle = "<div id='responsive-form' class='clearfix'>";

    templateDetalle += "<div class='form-row'>";
    templateDetalle += "<div class='column-three'>Periodo{periodo}</div>";
    templateDetalle += "<div class='column-three'>Monto{montoorigen}</div>";
    templateDetalle += "<div class='column-three'>Costo{costoorigen}</div>";
    templateDetalle += "</div>";

    templateDetalle += "<hr style='width:100%;'/>";
    templateDetalle += "<div> {sData} {cData}  </div>";
    templateDetalle += "</div>";

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    $("#" + childGridID).jqGrid({
        url: '/compromisos/' + parentRowKey,
        mtype: "POST",
        datatype: "json",
        page: 1,
        rowNum: 100,
        regional: 'es',
        height: 'auto',
        autowidth: true,
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
                }, editrules: { required: true, number: true }
            },
            {
                label: 'Monto', name: 'montoorigen', width: 150, editable: true,
                formatter: 'number', formatoptions: { decimalPlaces: 2 },
                editoptions: {
                    dataInit: function (el) {
                        $(el).mask('000.000.000.000.000,00', { reverse: true });
                    }
                }, editrules: { required: false }
            },
            {
                label: 'Costo', name: 'costoorigen', width: 150, editable: true,
                formatter: 'number', formatoptions: { decimalPlaces: 2 },
                editoptions: {
                    dataInit: function (el) {
                        $(el).mask('000.000.000.000.000,00', { reverse: true });
                    }
                }, editrules: { required: false }
            }
        ],
        pager: "#" + childGridPagerID,
        //regional: "es",
        rowList: [],
        pgbuttons: false,
        pgtext: null,
        viewrecords: false,
        styleUI: "Bootstrap",
        editurl: '/compromisos/' + parentRowKey + '/action',
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $("#grid").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#grid").addRowData("blankRow", { "periodo": "No hay datos" });
            }
        }
    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false, add: true, del: true, search: false, refresh: true,
        view: false, position: "left", cloneToTop: false
    },
        {
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
            var parentTable = "grid_" + parentRowID.split("_")[1] + "_t";
            var parentGrid = $('#' + parentTable);
            var parentRowData = parentGrid.getRowData(parentRowKey);
            var extraparam = {
                pk: parentRowKey,
                valorcuota: parentRowData.valorcuota,
                idmoneda: parentRowData.idmoneda,
                impuesto: parentRowData.impuesto,
                factorimpuesto: parentRowData.factorimpuesto
            }

            saveparameters = {
                "successfunc": null,
                "url": null,
                "extraparam": extraparam,
                "aftersavefunc": null,
                "errorfunc": null,
                "afterrestorefunc": null,
                "restoreAfterError": true,
                "mtype": "POST"
            }
            for (var i = 0; i < ids.length; i++) {
                subgrid.jqGrid('saveRow', ids[i], saveparameters);
            }
            subgrid.trigger('reloadGrid');
        }
    });

    $('#' + childGridID).closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").css("background-color", "#0431B4");

    $("#" + childGridPagerID + "_left").css("width", "");
}