$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'><span style='color:red'>* </span>Cuenta Contable{cuentacontable}</div>";
    template += "<div class='column-full'><span style='color:red'>* </span>Nombre{nombrecuenta}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'><span style='color:red'>* </span>Inversion/Gasto{invgasto}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Concepto Presupuestario{idconcepto}</div>";
    template += "<div class='column-full'><span style='color:red'>* </span>Cuenta Origen{cuentaorigen}</div>";    
    template += "</div>";

    template += "<div class='form-row' style='display: none;'>";
    template += "<div class='column-half'>Concepto Presupuestario{glosaconcepto}</div>";
    template += "</div>";

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";

    var modelCuentas = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'Cuenta Contable', name: 'cuentacontable', width: 100, align: 'left', search: true, editable: true },
        { label: 'Nombre', name: 'nombrecuenta', width: 300, align: 'left', search: true, editable: true, hidden: false },
        { label: 'Inversión/Gasto', name: 'glosatipo', width: 100, align: 'left', search: false, editable: true, hidden: false },

        {
            label: 'Inversion/Gasto', name: 'invgasto',width: 100, search: false, editable: true, hidden: true,
            edittype: "custom",
            editoptions: {
                custom_value: sipLibrary.getRadioElementValue,
                custom_element: sipLibrary.radioElemInvgasto
            }
        },
        {
            label: 'Concepto Presupuestario', name: 'idconcepto', search: false, editable: true,editrules: { required: true },
            hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/cuentascontables/conceptospresupuestarios',
                buildSelect: function (response) {
                    var grid = $("#table_servicio2");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idconcepto;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Concepto Presupuestario--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].glosaconcepto + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].glosaconcepto + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#idconcepto").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Concepto Presupuestario', name: 'glosaconcepto', width: 300, align: 'left',
            search: false, editable: true,jsonmap: "conceptospresupuestario.glosaconcepto", editrules: { required: false }, hidden: false
        },
        { label: 'Cuenta Origen', name: 'cuentaorigen', width: 100, align: 'left', search: true, editable: true, hidden: false },                        
    ];
    $("#grid").jqGrid({
        url: '/cuentascontables/list',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelCuentas,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        caption: 'Lista de Cuentas Contables',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        editurl: '/cuentascontables/action',
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $("#grid").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#grid").addRowData("blankRow", { "nombre": "No hay datos" });
            }
        },
        // subGrid: true,
        // subGridRowExpanded: showChildGrid,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
    });
    $("#grid").jqGrid('filterToolbar', {  stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#grid").jqGrid('navGrid', "#pager", {
        edit: true, add: true, del: true, search: true,
        refresh: true, view: true, position: "left", cloneToTop: false
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            editCaption: "Modifica Cuenta Contable",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {

                if (postdata.nombrecuenta == "") {
                    return [false, "Nombre Cuenta: Debe escoger un valor", ""];
                } if (postdata.invgasto == '0') {
                    return [false, "Inversión/Gasto: Debe escoger un valor", ""];
                } if (postdata.cuentaorigen == "") {
                    return [false, "Cuenta Origen: Debe escoger un valor", ""];
                } else {
                    return [true, "", ""]
                }
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }, beforeShowForm: function (form) {
                $('input#cuentacontable', form).attr('readonly', 'readonly');
                sipLibrary.centerDialog($("#grid").attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#grid").attr('id'));
            }
        },
        {
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agregar Cuenta Contable",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {

                if (postdata.cuentacontable == "") {
                    return [false, "Cuenta Contable: Debe escoger un valor", ""];
                } if (postdata.nombrecuenta == "") {
                    return [false, "Nombre Cuenta: Debe escoger un valor", ""];
                } if (postdata.invgasto == '0') {
                    return [false, "Inversión/Gasto: Debe escoger un valor", ""];
                } if (postdata.cuentaorigen == "") {
                    return [false, "Cuenta Origen: Debe escoger un valor", ""];                                        
                } else {
                    return [true, "", ""]
                }
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, "Error en llamada a Servidor", ""];
                else
                    return [true, "", ""]

            }, beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#grid").attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#grid").attr('id'));
            }
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Elimina Cuenta Contable",
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

    $("#grid").jqGrid('navButtonAdd', "#pager", {
        caption: "",
        buttonicon: "glyphicon glyphicon-download-alt",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $('#grid');
            var rowKey = grid.getGridParam("selrow");
            var url = '/cuentascontables/excel';
            $('#grid').jqGrid('excelExport', { "url": url });
        }
    });

    $("#pager_left").css("width", "");

    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });
});
