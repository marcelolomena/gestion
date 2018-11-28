$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'><span style='color:red'>* </span>Clase de Criticidad{glosaclase}</div>";
    template += "<div class='form-row'>";
    template += "<div class='column-half'><span style='color:red'>*</span>Tipo de Factor{calculado}</div>";
    template += "<div class='column-full'>Factor{factor}</div>";
    template += "<div class='column-half'>Color{idcolor}</div>";
    template += "</div>";

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";

    var modelCriticidad = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'Clase de Criticidad', name: 'glosaclase', width: 200, align: 'left', search: true, editable: true, hidden: false },
        {
            label: 'Tipo de Factor', name: 'calculado', search: false, editable: true, hidden: false,width: 100,
            edittype: "custom",
            editoptions: {
                custom_value: sipLibrary.getRadioElementValue,
                // custom_element: sicLibrary.radioElemCalculado, 
                dataEvents: [{

                    type: 'change', fn: function (e) {
     
                        var actual = $("input#factor").attr("readonly");
                        console.log("change actual:" + actual); 
                        if (actual == "readonly") {               
                            $("input#factor").attr("readonly", false);
                             window.setTimeout(function () {
                                  $("#idcolor").attr('disabled', false);                  
                             }, 1000);
                      } else {
                            $("input#factor").attr("readonly", true);
                            window.setTimeout(function () {
                                  $("#idcolor").attr('disabled', true);                  
                             }, 1000);
                        } 
                    }
                }],                
            },
            formatter: function (cellvalue, options, rowObject) {
                var dato = '';
                var val = rowObject.calculado;
                if (val == 1) {
                    dato = 'Variable';

                } else if (val == 0) {
                    dato = 'Constante';
                }
                return dato;
            }            
        },      
        {
            label: 'Factor',
            name: 'factor',
            width: 100,
            editrules: { required: false },
            search: false,
            align: 'left',
            editable: true,
            formatter: 'number',
        },
        
        {
            label: 'Color', name: 'idcolor', editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/sic/clasecriticidad/color',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idcolor;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Color--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].nombre == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        var thistid = $(this).val();
                        $("input#idcolor").val($('option:selected', this).text());
                    }
                }],
            }
        },
        {
            label: 'Color', name: 'valore.nombre', width: 100, align: 'left',
            search: false, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true }
        }, 
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
        subGridRowExpanded: showSubGrids,
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
                if (result.success != true)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            },beforeSubmit: function (postdata, formid) {

                 if (postdata.factor == '') {
                     if (postdata.calculado == 0) {
                        return [false, "Factor: Debe escoger un valor", ""]; }
                    else {
                    return [true, "", ""]
                }}else if (postdata.idcolor == 0) {
                     if (postdata.calculado == 0) {
                        return [false, "Color: Debe escoger un valor", ""]; }
                    else {
                    return [true, "", ""]
                }                
                } else
                     return [true, "", ""]
            },beforeShowForm: function (form) {
                $('input#glosaclase', form).attr('readonly', 'readonly');
                var grid = $("#grid");
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);                
                var calculado = rowData.calculado
                 console.log("Modifica beforeShowForm calculado" + calculado);
                
                if (calculado == "Variable") {
                    $(form).find("input:radio[value='1']").attr('checked', true);
                    $("input#factor").attr("readonly", true);
                    window.setTimeout(function () {
                           $("#idcolor").attr('disabled', true);                  
                    }, 1000);
                    $("#factor", form).val(0);
                    $("#idcolor", form).val(0);
                    console.log("calculado Variable:" + calculado);
                }
                else {
                    $(form).find("input:radio[value='0']").attr('checked', true);
                    $("input#factor").attr("readonly", false);
                    window.setTimeout(function () {
                       $("#idcolor").attr('disabled', false);                  
                             }, 1000);
                    console.log("calculado Constante:" + calculado);
                }

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
                } else if (postdata.factor == '') {
                     if (postdata.calculado == 0) {
                        return [false, "Factor: Debe escoger un valor", ""]; }
                    else {
                    return [true, "", ""]
                }}else if (postdata.idcolor == 0) {
                     if (postdata.calculado == 0) {
                        return [false, "Color: Debe escoger un valor", ""]; }
                    else {
                    return [true, "", ""]
                }                
                } else
                     return [true, "", ""]
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.success != true)
                    return [false, "Error en llamada a Servidor", ""];
                else
                    return [true, "", ""]

            }, beforeShowForm: function (form) {
                 var grid = $("#grid");
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);                
                $(form).find("input:radio[value='0']").attr('checked', true);
                $("#calculado", form).val(0);
               // $("#factor", form).val(0);
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
                if (result.success != true)
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

function gridDesgloseFactores(parentRowID, parentRowKey,suffix) {

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
    if (suffix) {
        childGridID += suffix;
        childGridPagerID += suffix;
    }
    var childGridURL = "/sic/desglosefactores/" + parentRowKey;

    var grid = $("#grid");
    var rowData = grid.getRowData(parentRowKey);
    var calculado = rowData.calculado;

    if (calculado == 'Constante'){ return }

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
                if (result.success != true)
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
                if (result.success != true)
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
                if (result.success != true)
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

function showSubGrids(subgrid_id, row_id) {
    gridDesgloseFactores(subgrid_id, row_id, 'factores');
    gridDesgloseColores(subgrid_id, row_id, 'colores');
}

function gridDesgloseColores(parentRowID, parentRowKey,suffix) {
    var tmplPnotas = "<div id='responsive-form' class='clearfix'>";

    tmplPnotas += "<div class='form-row'>";
    tmplPnotas += "<div class='column-full'>Nota{idcolor}</div>";
    tmplPnotas += "</div>";

    tmplPnotas += "<div class='form-row'>";
    tmplPnotas += "<div class='column-full'>Nota inicial{notainicial}</div>";
    tmplPnotas += "</div>";

    tmplPnotas += "<div class='form-row'>";
    tmplPnotas += "<div class='column-full'>Nota Final{notafinal}</div>";
    tmplPnotas += "</div>";

    tmplPnotas += "<div class='form-row' style='display: none;'>";
    tmplPnotas += "<div class='column-half'>idclasecriticidad{idclasecriticidad}</div>";
    tmplPnotas += "</div>";

    tmplPnotas += "<hr style='width:100%;'/>";
    tmplPnotas += "<div> {sData} {cData}  </div>";
    tmplPnotas += "</div>";

    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    if (suffix) {
        childGridID += suffix;
        childGridPagerID += suffix;
    }
    var childGridURL = "/sic/desglosecolores/" + parentRowKey;

    var grid = $("#grid");
    var rowData = grid.getRowData(parentRowKey);
    var calculado = rowData.calculado;

    if (calculado == 'Constante'){ return }

    var modelDesgloseNotas = [
        { label: 'id', name: 'id', key: true, hidden: true },    
        {
            label: 'Color', name: 'idcolor', editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/sic/clasecriticidad/color',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idnota;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Color--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].nombre == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        var thistid = $(this).val();
                        $("input#idcolor").val($('option:selected', this).text());
                    }
                }],
            }
        },          
        {
            label: 'Color', name: 'nombre', width: 50, editrules: { required: true }, search: false,
            align: 'left', editable: true, 
        },
        {
                label: 'Nota Inicial', name: 'notainicial', search: false, editable: true, hidden: false,formatter: 'number'
        },
        {
                label: 'Nota Final', name: 'notafinal', search: false, editable: true, hidden: false,formatter: 'number'
        }
    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "POST",
        datatype: "json",
        page: 1,
        caption: 'Desglose Colores',
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
        editurl: '/sic/actiondesglosecolores/action',
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
            editCaption: "Modificar Desglose Colores",
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
                if (result.success != true)
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
            addCaption: "Agregar Desglose Colores",
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
                if (result.success != true)
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
            addCaption: "Elimina Color",
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.success != true)
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
    tmplPnotas += "<div class='column-full'>Nota{idnota}</div>";
    tmplPnotas += "</div>";

    tmplPnotas += "<div class='form-row'>";
    tmplPnotas += "<div class='column-full'>Nombre Nota{nombrenota}</div>";
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
            label: 'Nota', name: 'idnota', editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/sic/clasecriticidad/notas',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idnota;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Nota--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].nombre == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        var thistid = $(this).val();
                        $("input#idnota").val($('option:selected', this).text());
                    }
                }],
            }
        },          
        {
            label: 'Nota', name: 'nombre', width: 50, editrules: { required: true }, search: false,
            align: 'left', editable: true, formatter: 'number',
        },
        {
                label: 'Nombre Nota', name: 'nombrenota', search: false, editable: true, hidden: false,
                edittype: "textarea"
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
                if (result.success != true)
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
                if (result.success != true)
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
                if (result.success != true)
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