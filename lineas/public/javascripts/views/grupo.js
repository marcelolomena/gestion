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

    var modelGrupo = [
        { label: 'Id', name: 'id', width: 30, key: true, hidden: false },
        { label: 'Rut', name: 'rut', width: 80, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Nombre', name: 'nombre', width: 250, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Razón Social', name: 'razonsocial', width: 250, hidden: false, search: true, editable: true, editrules: { required: true } },
         
    ];
    $("#grid").jqGrid({
        url: '/grupo',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelGrupo,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        caption: 'Lista de Grupos',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        editurl: '/grupo',
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $("#grid").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#grid").addRowData("blankRow", { "nombre": "No hay datos" });
            }
        },
        subGrid: true,
        subGridRowExpanded: subGridGrupos,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
    });

    $("#grid").jqGrid('navGrid', "#pager", {
        edit: true, add: true, del: true, search: false,
        refresh: true, view: false, position: "left", cloneToTop: false
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            editCaption: "Modifica Grupo",
            //template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error != "0")
                    return [false, "Error en llamada a Servidor", ""];
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
            addCaption: "Agregar Grupo",
            //template: template,
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
                if (result.error != "0")
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
            addCaption: "Eliminar Grupo",
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

    $("#pager_left").css("width", "");

    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });
});

function subGridGrupos(subgrid_id, row_id) {
    gridDesgloseGrupo(subgrid_id, row_id, 'desgrupo');
}

function gridDesgloseGrupo(parentRowID, parentRowKey,suffix) {
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
    var childGridURL = "/grupodesglose/" + parentRowKey;

    var modelDesgloseGrupo = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'idgrupo', name: 'idgrupo', hidden: true, editable: true },
        { label: 'Rut', name: 'rutcliente', width: 80, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Razón Social', name: 'cliente.razonsocial', width: 250, hidden: false, search: true, editable: false, editrules: { required: true } },
        
    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        page: 1,
        caption: 'Desglose Grupo',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        colModel: modelDesgloseGrupo,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,
        editurl: '/grupodesglose',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "Rut": "No hay datos" });
            }
        }
    });

    $("#" + childGridID).jqGrid('filterToolbar', {
        stringResult: true, searchOperators: true,
        searchOnEnter: false, defaultSearch: 'cn'
    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            editCaption: "Modificar Desglose Grupo",
            //template: tmplPnotas,
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
                if (result.error != "0")
                    return [false, "Error en llamada a Servidor", ""];
                else
                    return [true, "", ""]

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
            addCaption: "Agregar Desglose Grupo",
            //template: tmplPnotas,
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
                if (result.error != "0")
                    return [false, "Error en llamada a Servidor", ""];
                else
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
            addCaption: "Elimina Desglose Grupo",
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