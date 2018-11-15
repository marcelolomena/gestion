$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'><span style='color:red'>* </span>Moneda{moneda}</div>";
    template += "<div class='column-full'><span style='color:red'>* </span>Glosa Moneda{glosamoneda}</div>";
    template += "</div>";

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";

    var modelmoneda = [
        { label: 'id', name: 'id', key: true, hidden: true },
        {
            label: 'Moneda', name: 'moneda', width: 50, align: 'left', search: true, editable: true
        },
        { label: 'Glosa Moneda', name: 'glosamoneda', width: 50, align: 'left', search: true, editable: true, hidden: false },
    ];

    var tmpc = "<div id='responsive-form' class='clearfix'>";

    tmpc += "<div class='form-row'>";
    tmpc += "<div class='column-full'><span style='color:red'>* </span>Moneda {moneda}</div>";
    tmpc += "</div>";

    tmpc += "<div class='form-row'>";
    tmpc += "<div class='column-full'><span style='color:red'>* </span>Periodo {periodo}</div>";
    tmpc += "</div>";

    tmpc += "<div class='form-row'>";
    tmpc += "<div class='column-full'><span style='color:red'>* </span>Valor Conversion {valorconversion}</div>";
    tmpc += "</div>";

    tmpc += "<div class='form-row' style='display: none;'>";
    tmpc += "<div class='column-full'><span style='color:red'>* </span>idmoneda {idmoneda}</div>";
    tmpc += "<div class='column-full'><span style='color:red'>* </span>idEjercicio {idejercicio}</div>";
    tmpc += "<div class='column-full'><span style='color:red'>* </span>ejercicio {ejercicio}</div>";
    tmpc += "</div>";

    tmpc += "<hr style='width:100%;'/>";
    tmpc += "<div> {sData} {cData}  </div>";
    tmpc += "</div>";

    $("#grid").jqGrid({
        url: '/monedas/list',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelmoneda,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        caption: 'Lista de Monedas',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        editurl: '/monedas/action',
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $("#grid").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#grid").addRowData("blankRow", { "glosamoneda": "No hay datos" });
            }
        },
        subGrid: true,
        subGridRowExpanded: showChildGrid,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
    });

    $("#grid").jqGrid('navGrid', "#pager", {
        edit: true, add: true, del: true, search: false,
        refresh: true, view: true, position: "left", cloneToTop: false
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            editCaption: "Modifica Moneda",
            template: template,
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
                $('input#moneda', form).attr('readonly', 'readonly');
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
            addCaption: "Agregar Moneda",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {

                if (postdata.moneda == 0) {
                    return [false, "Moneda: Debe escoger un valor", ""];
                } if (postdata.glosamoneda == 0) {
                    return [false, "Glosa Moneda: Debe escoger un valor", ""];
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
            addCaption: "Elimina Moneda",
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
            var url = '/monedas/excel';
            $('#grid').jqGrid('excelExport', { "url": url });
        }
    });

function showChildGrid(parentRowID, parentRowKey) {
        var childGridID = parentRowID + "_table";
        var childGridPagerID = parentRowID + "_pager";
        var childGridURL = "/monedasconversion/list/" + parentRowKey;

        var modelConversion = [
            { label: 'Ejercicio', name: 'ejercicio', width: 100, align: 'left', search: true, editable: true,},
            { label: 'Periodo', name: 'periodo', width: 100, align: 'center', search: true, editable: true, 
                     editoptions: {
                     dataInit: function (element) {
                        $(element).mask("000000", { placeholder: "______" });
                }
            }, editrules: { required: true, number: true }},
            { label: 'Moneda', name: 'moneda', width: 100, align: 'center', search: false, editable: true, },            
            { label: 'Valor Conversión a Pesos', name: 'valorconversion', width: 200, align: 'center', search: false, editable: true,},
            { label: 'idEjercicio', name: 'idejercicio', width: 100, align: 'left', search: false, hidden: true,editable: true,},
            { label: 'idmoneda', name: 'idmoneda', width: 100, align: 'left', search: false, hidden: true,editable: true,},            
        ];

        $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

        $("#" + childGridID).jqGrid({
            url: childGridURL,
            mtype: "post",
          //  cache: false,
            datatype: "json",
            page: 1,
            colModel: modelConversion,
            // caption: 'Monedas de Conversión a Pesos',
            autowidth: true,  // set 'true' here
            shrinkToFit: true, // well, it's 'true' by default
            rowNum: 10,
            rowList: [5, 10, 20, 50],
            viewrecords: true,
            styleUI: "Bootstrap",
            regional: 'es',
            height: 'auto',
            width: 850,
            pager: "#" + childGridPagerID,
            editurl: '/monedasconversion/action',
            gridComplete: function () {
                var recs = $("#" + childGridID).getGridParam("reccount");
                if (isNaN(recs) || recs == 0) {

                    $("#" + childGridID).addRowData("blankRow", { "ejercicio": "", "periodo": "No hay datos" });
                }
            }
        }).jqGrid('filterToolbar', { 
         stringResult: true, 
         searchOnEnter: false,
         defaultSearch: 'cn',         
         searchOperators: true });;

        $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
            edit: true, add: true, del: true, search: false, refresh: true, view: true, position: "left", cloneToTop: false
        },
            {
                closeAfterEdit: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                editCaption: "Modifica Monedas de Conversión",
                template: tmpc,
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
                    $('input#moneda', form).attr('readonly', 'readonly');
                    $('input#periodo', form).attr('readonly', 'readonly');
                    sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                }, afterShowForm: function (form) {
                    sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                }
            },
            {
                closeAfterAdd: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                addCaption: "Agrega Monedas de Conversión",
                template: tmpc,
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                },
                beforeSubmit: function (postdata, formid) {
                    if (postdata.valorconversion == 0) {
                        return [false, "Conversion: Debe escoger un valor", ""];
                    } else  if (postdata.periodo == 0) {
                        return [false, "Periodo: Debe escoger un valor", ""];                        
                    } else {
                        return [true, "", ""]
                    }
                },
                afterSubmit: function (response, postdata) {
                    var json = response.responseText;
                    var result = JSON.parse(json);
                    if (result.error_code != 0) {
                        if (result.error_code == 10)
                        {
                          return [false, "Periodo: Periodo ingresado ya existe", ""]; 
                        } 
                        else  if (result.error_code == 20)
                        {
                          return [false, "Ejercicio: Ejercicio no existe", ""]; 
                        }   
                        else  if (result.error_code == 30)
                        {
                          return [false, "Periodo: Periodo no valido", ""]; 
                        }                      
                        else {
                               return [false, result.error_text, ""];
                        };
                    } else {
                        var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"periodo\",\"op\":\"cn\",\"data\":\"" + postdata.periodo + "\"}]}";
                        $("#" + childGridID).jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                        return [true, "", ""];
                    }
                },
                beforeShowForm: function (form) {
                    $('input#moneda', form).attr('readonly', 'readonly');
                     var grid = $("#" + childGridID);
                     var rowData = grid.getRowData(parentRowKey);
                     moneda = rowData.moneda;
                     idmoneda = rowData.id;
                     $("#moneda", form).val(moneda);
                     $("#idmoneda", form).val(idmoneda);
                    sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                },
                afterShowForm: function (form) {
                    sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                },
                onclickSubmit: function (rowid) {
                    return { parent_id: parentRowKey };
                },
            },
            {
                closeAfterDelete: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                addCaption: "Elimina Monedas de Conversión",
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

    }

        $("#pager_left").css("width", "");

    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });

    });