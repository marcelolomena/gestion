$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'><span style='color:red'>* </span>Clase de Criticidad{glosaclase}</div>";
    template += "<div class='column-full'><span style='color:red'>* </span>Factor{factor}</div>";
    template += "</div>";

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";

    var modelCriticidad = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'Clase de Criticidad', name: 'glosaclase', width: 50, align: 'left', search: true, editable: true, hidden: false },
         {
            label: 'Factor',
            name: 'factor',
            width: 200,
            editrules: { required: true },
            search: false,
            align: 'left',
            editable: true,
            formatter: 'number',
        //    formatoptions: { decimalPlaces: 1 },
        //    editoptions: {
        //        dataInit: function (el) {
        //            $(el).mask('0.0', { reverse: true, placeholder: "_____" });
        //        },
        //    }
        }
       
    ];
    $("#grid").jqGrid({
        url: '/sic/clasecriticidad/list',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelCriticidad,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        caption: 'Lista de Clases de Criticidad',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        editurl: '/sic/clasecriticidad/action',
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $("#grid").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#grid").addRowData("blankRow", { "nombre": "No hay datos" });
            }
        },
        subGrid: true,
        subGridRowExpanded: gridDesgloseFactores,
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
            editCaption: "Modifica Clase de Criticidad",
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
                $('input#glosaclase', form).attr('readonly', 'readonly');
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
            addCaption: "Agregar Clase de Criticidad",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {

                if (postdata.glosaclase == 0) {
                    return [false, "Glosa Clase: Debe escoger un valor", ""];
                } if (postdata.factor == 0) {
                    return [false, "Factor: Debe escoger un valor", ""];
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
            addCaption: "Elimina Clase de Criticidad",
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
            var url = '/conceptos/excel';
            $('#grid').jqGrid('excelExport', { "url": url });
        }
    });

    $("#pager_left").css("width", "");

    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });
});

function gridDesgloseFactores(parentRowID, parentRowKey) {

    var tmplP = "<div id='responsive-form' class='clearfix'>";

    tmplP += "<div class='form-row'>";
    tmplP += "<div class='column-full'>Nombre Factor{nombrefactor}</div>";
    tmplP += "</div>";

    tmplP += "<div class='form-row'>";
    tmplP += "<div class='column-full'>Porcentaje{porcentaje}</div>";
    tmplP += "</div>";

    tmplP += "<div class='form-row' style='display: none;'>";
    tmplP += "<div class='column-half'>idclasecriticidad{idclasecriticidad}</div>";
    tmplP += "</div>";

    tmplP += "<hr style='width:100%;'/>";
    tmplP += "<div> {sData} {cData}  </div>";
    tmplP += "</div>";

    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    var childGridURL = "/sic/desglosefactores/" + parentRowKey;

    var grid = $("#grid");
    var rowData = grid.getRowData(parentRowKey);
    var factorrow = rowData.factor;
  
     console.log('rowdata: ' + rowData);
     console.log('factorrow: ' + factorrow);

    if (factorrow != 0){ return }

    var modelDesglose = [
        { label: 'id', name: 'id', key: true, hidden: true },      
        {
            label: 'Nombre Factor',
            name: 'nombrefactor',
            search: false,
            align: 'left',
            width: 100,
            editable: true
        },
        {
            label: 'Porcentaje',
            name: 'porcentaje',
            width: 200,
            editrules: { required: true },
            search: false,
            align: 'left',
            editable: true,
            formatter: 'number',
            formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.00', { reverse: true, placeholder: "_____%" });
                },
            }
        }
    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "POST",
        datatype: "json",
        page: 1,
        caption: 'Desglose Factores',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        colModel: modelDesglose,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,
        editurl: '/sic/actiondesglosefactores/action',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "nombrefactor": "No hay datos" });
            }
        },
        subGrid: true,
        subGridRowExpanded: gridDesgloseNotas,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
    });

    $("#" + childGridID).jqGrid('filterToolbar', {
        stringResult: true, searchOperators: true,
        searchOnEnter: false, defaultSearch: 'cn'
    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: true, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            editCaption: "Modificar Desglose Factores",
            template: tmplP,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                if (postdata.porcentaje == 0) {
                    return [false, "Porcentaje: Campo obligatorio", ""];
                }
                var elporcentaje = parseFloat(postdata.porcentaje);
                console.log('porcentaje: ' + elporcentaje);


                if (elporcentaje > 100) {
                    return [false, "Porcentaje no puede ser mayor a 100", ""];
                }
                else {
                    return [true, "", ""]
                }
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    {return [false, result.error_text, ""];}
                else    
                    {return [true, "", ""]}

             }, beforeShowForm: function (form) {                          
                $('input#nombrefactor', form).attr('readonly', 'readonly');
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
          
            },
            afterShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }
        },
        {
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agregar Desglose Factores",
            template: tmplP,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                if (postdata.nombrefactor == '') {
                    return [false, "Nombre Factor: Campo obligatorio", ""];
                } if (postdata.porcentaje == 0) {
                    return [false, "Porcentaje: Campo obligatorio", ""];
                }
                var elporcentaje = parseFloat(postdata.porcentaje);
                console.log('porcentaje: ' + elporcentaje);
                var suma = 0;

                $.ajax({
                    type: "GET",
                    async: false,
                    url: '/sic/porcentajedesglosefactores/' + parentRowKey,
                    success: function (data) {
                        console.log('porcentajequeviene: ' + data[0].total);
                        suma = data[0].total + elporcentaje;
                        console.log('total: ' + suma);
                    }
                });
                if (suma > 100) {
                    return [false, "Porcentaje total del desglose no puede ser mayor a 100", ""];
                }

                if (elporcentaje > 100) {
                    return [false, "Porcentaje no puede ser mayor a 100", ""];
                }
                else {
                    return [true, "", ""]
                }
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentRowKey };
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                return [true, "", ""]
            },
            beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            },
            afterShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Elimina Factor",
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

};

function gridDesgloseNotas(parentRowID, parentRowKey) {
    var tmplPnotas = "<div id='responsive-form' class='clearfix'>";

    tmplPnotas += "<div class='form-row'>";
    tmplPnotas += "<div class='column-full'>Nombre Nota{nombrenota}</div>";
    tmplPnotas += "</div>";

    tmplPnotas += "<div class='form-row'>";
    tmplPnotas += "<div class='column-full'>Nota{nota}</div>";
    tmplPnotas += "</div>";

    tmplPnotas += "<div class='form-row' style='display: none;'>";
    tmplPnotas += "<div class='column-half'>iddesglosefactores{iddesglosefactores}</div>";
    tmplPnotas += "</div>";

    tmplPnotas += "<hr style='width:100%;'/>";
    tmplPnotas += "<div> {sData} {cData}  </div>";
    tmplPnotas += "</div>";

    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    var childGridURL = "/sic/desglosenotas/" + parentRowKey;

    var modelDesgloseNotas = [
        { label: 'id', name: 'id', key: true, hidden: true },      
        {
            label: 'Nombre Nota',
            name: 'nombrenota',
            search: false,
            align: 'left',
            width: 100,
            editable: true
        },
        {
            label: 'Nota',
            name: 'nota',
            width: 200,
            editrules: { required: true },
            search: false,
            align: 'left',
            editable: true,
            formatter: 'number',
        }
    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "POST",
        datatype: "json",
        page: 1,
        caption: 'Desglose Notas',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        colModel: modelDesgloseNotas,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,
        editurl: '/sic/actiondesglosenotas/action',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "nombrenota": "No hay datos" },{"nota":""});
            }
        }
    });

    $("#" + childGridID).jqGrid('filterToolbar', {
        stringResult: true, searchOperators: true,
        searchOnEnter: false, defaultSearch: 'cn'
    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: true, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            editCaption: "Modificar Desglose Notas",
            template: tmplPnotas,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                if (postdata.nota == 0) {
                    return [false, "Nota: Campo obligatorio", ""];
                }  
                else    
                    {return [true, "", ""]}              
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    {return [false, result.error_text, ""];}
                else    
                    {return [true, "", ""]}

             }, beforeShowForm: function (form) {                          
                $('input#nombrenota', form).attr('readonly', 'readonly');
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
          
            },
            afterShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }
        },
        {
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agregar Desglose Notas",
            template: tmplPnotas,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                if (postdata.nombrenota == '') {
                    return [false, "Nombre Nota: Campo obligatorio", ""];
                } else if (postdata.nota == 0) {
                    return [false, "Nota: Campo obligatorio", ""];
                }  else {
                    return [true, "", ""]
                }           
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentRowKey };
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    {return [false, result.error_text, ""];}
                else    
                    {return [true, "", ""]}
            },
            beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            },
            afterShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Elimina Nota",
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