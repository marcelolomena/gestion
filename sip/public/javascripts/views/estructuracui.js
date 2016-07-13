$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    idestructura = 0;
    cuipadre = 0;

    var templ = "<div id='responsive-form' class='clearfix'>";

    templ += "<div class='form-row'>";
    templ += "<div class='column-full'>Nombre Estructura{nombre}</div>";
    templ += "</div>";

    templ += "<div class='form-row'>";
    templ += "<div class='column-full'>Cui Padre{iddivision}</div>";
    templ += "</div>";

    templ += "<div class='form-row'>";
    templ += "<div class='column-full'>Nombre Division{division}</div>";
    templ += "</div>";

    templ += "<div class='form-row'>";
    templ += "<div class='column-full'>Nombre Responsable{uidresponsable}</div>";
    templ += "</div>";

    templ += "<div class='form-row' style='display: none;'>";
    templ += "<div class='column-full'>Nombre Responsable{responsable}</div>";
    templ += "</div>";

    templ += "<hr style='width:100%;'/>";
    templ += "<div> {sData} {cData}  </div>";
    templ += "</div>";

    var modelEstructura = [
        { label: 'id', name: 'id', key: true, hidden: false },
        { label: 'Nombre', name: 'nombre', width: 200, align: 'left', search: true, editable: true, hidden: false },
        { label: 'CUI Padre', name: 'iddivision', hidden: false, editable: true ,
          editoptions: {dataInit: function (element) {
                    $(element).mask("0000", { placeholder: "____" });

                }}},
        { label: 'Division', name: 'division', hidden: false, editable: true },
        {
            label: 'Responsable', name: 'uidresponsable', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/estructuracui/responsables',
                buildSelect: function (response) {
                    var grid = $("#gridpadre");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.uidresponsable;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Responsable--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#responsable").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Responsable', name: 'responsable', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        }
    ];

    $("#gridpadre").jqGrid({
        url: '/estructuracentro/cabeceracentro',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelEstructura,
        rowNum: 10,
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        caption: 'Estructura de Centros',
        onSelectRow: function (rowid, selected) {
            if (rowid != null) {
                var grid = $("#gridpadre");
                var rowData = grid.getRowData(rowid);
                cuipadre = rowData.iddivision;
                idestructura = rowData.id;
                jQuery("#grid").jqGrid('setGridParam', { url: '/estructuracui/hijos/' + idestructura + '/' + cuipadre, datatype: 'json' }); // the last setting is for demo only
                jQuery("#grid").jqGrid('setCaption', 'Estructura Cui Gerencia');
                jQuery("#grid").trigger("reloadGrid");
            }
        }, // use the onSelectRow that is triggered on row click to show a details grid
        onSortCol: clearSelection,
        onPaging: clearSelection,
        pager: "#pagerpadre",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        editurl: '/estructuracentro/action',
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $("#gridpadre").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#gridpadre").addRowData("blankRow", { "nombre": "No hay datos" });
            }
        },
    });

    $("#gridpadre").jqGrid('navGrid', "#pagerpadre", {
        edit: true, add: true, del: true, search: false,
        refresh: true, view: true, position: "left", cloneToTop: false
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            editCaption: "Modifica Estructura de CUI",
            template: templ,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {

                if (postdata.nombre == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de nombre estructura", ""];
                } if (postdata.iddivision == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de cui padre", ""];
                } if (postdata.division == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de division", ""];
                } if (postdata.uidresponsable == 0) {
                    return [false, "Item Estructura: Debe escoger un responsable", ""];
                } else {
                    return [true, "", ""]
                }
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }, beforeShowForm: function (form) {

                $('input#iddivision', form).attr('readonly', 'readonly');
                sipLibrary.centerDialog($("#gridpadre").attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#gridpadre").attr('id'));
            }
        },
        {
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agregar Estructura de CUI",
            template: templ,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {

                 if (postdata.nombre == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de nombre estructura", ""];
                } if (postdata.iddivision == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de cui padre", ""];
                } if (postdata.division == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de division", ""];
                } if (postdata.uidresponsable == 0) {
                    return [false, "Item Estructura: Debe escoger un responsable", ""];
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
                sipLibrary.centerDialog($("#gridpadre").attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#gridpadre").attr('id'));
            }
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Elimina Estructura de CUI",
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

    $("#gridpadre").jqGrid('navButtonAdd', "#pagerpadre", {
        caption: "",
        buttonicon: "glyphicon glyphicon-download-alt",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $('#gridpadre');
            var rowKey = grid.getGridParam("selrow");
            var url = '/estructuracui/excel';
            $('#gridpadre').jqGrid('excelExport', { "url": url });
        }
    });

    $("#pagerpadre_left").css("width", "");

    $(window).bind('resize', function () {
        $("#gridpadre").setGridWidth($(".gcontainer").width(), true);
        $("#pagerpadre").setGridWidth($(".gcontainer").width(), true);
    });

    loadGrid(idestructura, cuipadre);

});

var leida = false;
var idestructura;
var cuipadre;
var griddepartamento;
var nivel;

function loadGrid(idestructura, cuipadre) {

    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Cui{cui}</div>";
    template += "<div class='column-full'>Nombre Cui{nombrecui}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Nombre Responsable{uid}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Gerencia{idgerencia}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Nombre Gerente{uidgerente}</div>";
    template += "</div>";

    template += "<div class='form-row' style='display: none;'>";
    template += "<div class='column-half'>nombregerente {nombregerente}</div>";
    template += "<div class='column-full'>Nombre Responsable{responsable}</div>";
    template += "<div class='column-full'>genrencia{genrencia}</div>";
    template += "<div class='column-full'>idestructura{idestructura}</div>";
    template += "<div class='column-full'>cuipadre{cuipadre}</div>";
    template += "<div class='column-full'>nivel{nivel}</div>";
    template += "</div>";

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";

    var modelCui = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'idestructura', name: 'idestructura', hidden: true, editable: true },
        { label: 'cuipadre', name: 'cuipadre', hidden: true, editable: true },
        { label: 'nivel', name: 'nivel', hidden: true, editable: true },
        { label: 'CUI', name: 'cui', width: 50, align: 'left', search: true, editable: true, hidden: false,
          editoptions: {dataInit: function (element) {
                    $(element).mask("0000", { placeholder: "____" });

                }} },
        { label: 'Nombre Cui', name: 'nombrecui', width: 200, align: 'left', search: true, editable: true, hidden: false },
        {
            label: 'Responsable', name: 'uid', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/estructuracui/responsables',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.uid;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Responsable--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#responsable").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Responsable', name: 'responsable', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Gerencia', name: 'idgerencia', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/estructuracui/gerencias',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idgerencia;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Gerencia--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#genrencia").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Gerencia', name: 'genrencia', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Nombre Gerente', name: 'uidgerente', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/usuarios_por_rol/Gerente',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.uidgerente;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Gerente--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].uid == thissid) {
                            s += '<option value="' + data[i].uid + '" selected>' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        } else {
                            s += '<option value="' + data[i].uid + '">' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#nombregerente").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Nombre Gerente', name: 'nombregerente', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
    ];
    $("#grid").jqGrid({
        url: '/estructuracui/hijos/' + idestructura + '/' + cuipadre,
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelCui,
        rowNum: 10,
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        caption: 'Estructura Cui Gerencia',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        editurl: '/estructuracui/action',
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $("#grid").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#grid").addRowData("blankRow", { "nombre": "No hay datos" });
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
            editCaption: "Modifica Estructura de CUI",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {

                if (postdata.nombrecui == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de nombre cui", ""];
                } if (postdata.uid == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de responsable", ""];
                } if (postdata.idgerencia == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de gerencia", ""];
                } if (postdata.uidgerente == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de gerente", ""];
                } else {
                    return [true, "", ""]
                }
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }, beforeShowForm: function (form) {
                var grid = $("#gridpadre");
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                cuipadre = rowData.iddivision;
                idestructura = rowData.id;
                nivel=1;
                $("#nivel", form).val(nivel);                
                $("#idestructura", form).val(idestructura);
                $("#cuipadre", form).val(cuipadre);
                $('input#cui', form).attr('readonly', 'readonly');
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
            addCaption: "Agregar Estructura de CUI",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {

                if (postdata.cui == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de cui", ""];
                } if (postdata.nombrecui == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de nombre cui", ""];
                } if (postdata.uid == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de responsable", ""];
                } if (postdata.idgerencia == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de gerencia", ""];
                } if (postdata.uidgerente == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de gerente", ""];
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
                
                $('input#cuipadre', form).attr('readonly', 'readonly');
                var grid = $("#gridpadre");
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                cuipadre = rowData.iddivision;
                idestructura = rowData.id;
                nivel=1;
                $("#nivel", form).val(nivel);                
                $("#idestructura", form).val(idestructura);
                $("#cuipadre", form).val(cuipadre);                
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
            addCaption: "Elimina Estructura de CUI",
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

    $("#pager_left").css("width", "");

    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });

};

function showChildGrid(parentRowID, parentRowKey) {

    var childGridID = parentRowID + "_table";
    griddepartamento = childGridID;
    var childGridPagerID = parentRowID + "_pager";
    var childIdServicio = 0;

    var grid = $("#gridpadre");
    var rowKey = grid.getGridParam("selrow");
    var rowData = grid.getRowData(rowKey);
    idestructura = rowData.id;

    var grid = $("#grid");
    var rowData = grid.getRowData(parentRowKey);
    cuipadre = rowData.cui;

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Cui{cui}</div>";
    template += "<div class='column-full'>Nombre Cui{nombrecui}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Nombre Responsable{uid}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Gerencia{idgerencia}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Nombre Gerente{uidgerente}</div>";
    template += "</div>";

    template += "<div class='form-row' style='display: none;'>";
    template += "<div class='column-half'>nombregerente {nombregerente}</div>";
    template += "<div class='column-full'>Nombre Responsable{responsable}</div>";
    template += "<div class='column-full'>genrencia{genrencia}</div>";
    template += "<div class='column-full'>idestructura{idestructura}</div>";
    template += "<div class='column-full'>cuipadre{cuipadre}</div>";
    template += "<div class='column-full'>nivel{nivel}</div>";
    template += "</div>";

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";

    var modelCui = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'idestructura', name: 'idestructura', hidden: true, editable: true },
        { label: 'cuipadre', name: 'cuipadre', hidden: true, editable: true },
        { label: 'nivel', name: 'nivel', hidden: true, editable: true },
        { label: 'CUI', name: 'cui', width: 50, align: 'left', search: true, editable: true, hidden: false },
        { label: 'Nombre Cui', name: 'nombrecui', width: 200, align: 'left', search: true, editable: true, hidden: false },
        {
            label: 'Responsable', name: 'uid', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/estructuracui/responsables',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.uid;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Responsable--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#responsable").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Responsable', name: 'responsable', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Gerencia', name: 'idgerencia', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/estructuracui/gerencias',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idgerencia;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Gerencia--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#genrencia").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Gerencia', name: 'genrencia', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Nombre Gerente', name: 'uidgerente', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/usuarios_por_rol/Gerente',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.uidgerente;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Gerente--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].uid == thissid) {
                            s += '<option value="' + data[i].uid + '" selected>' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        } else {
                            s += '<option value="' + data[i].uid + '">' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#nombregerente").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Nombre Gerente', name: 'nombregerente', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
    ];

    $("#" + childGridID).jqGrid({
        url: '/estructuracui/hijos/' + idestructura + '/' + cuipadre,
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelCui,
        rowNum: 10,
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        shrinkToFit: true,
        width: 1300,
        caption: 'Estructura Cui Departamento',
        styleUI: "Bootstrap",
        subGrid: true,
        subGridRowExpanded: gridDetail,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,
        editurl: '/estructuracui/action',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "nombre": "No hay datos" });
            }
        }
    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: true, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            editCaption: "Modifica Estructura de CUI",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {

                if (postdata.nombrecui == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de nombre cui", ""];
                } if (postdata.uid == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de responsable", ""];
                } if (postdata.idgerencia == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de gerencia", ""];
                } if (postdata.uidgerente == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de gerente", ""];
                } else {
                    return [true, "", ""]
                }
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }, beforeShowForm: function (form) {
                nivel=2;
                $("#nivel", form).val(nivel);                
                $('input#cui', form).attr('readonly', 'readonly');
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
            addCaption: "Agregar Estructura de CUI",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {

                if (postdata.cui == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de cui", ""];
                } if (postdata.nombrecui == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de nombre cui", ""];
                } if (postdata.uid == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de responsable", ""];
                } if (postdata.idgerencia == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de gerencia", ""];
                } if (postdata.uidgerente == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de gerente", ""];
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
                $("#idestructura", form).val(idestructura);
                var grid = $("#grid");
                var rowData = grid.getRowData(parentRowKey);
                cuipadre = rowData.cui;
                $("#cuipadre", form).val(cuipadre);
                nivel=2;
                $("#nivel", form).val(nivel);                
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Elimina Estructura de CUI",
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

    $("#" + childGridPagerID).css("width", "");

    $(window).bind('resize', function () {
        $("#" + childGridID).setGridWidth($(".gcontainer").width(), true);
        $("#" + childGridPagerID).setGridWidth($(".gcontainer").width(), true);
    });

}
function gridDetail(parentRowID, parentRowKey) {

    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    var childIdServicio = 0;

    var grid = $("#" + griddepartamento);
    var rowData = grid.getRowData(parentRowKey);
    cuipadre = rowData.cui;

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Cui{cui}</div>";
    template += "<div class='column-full'>Nombre Cui{nombrecui}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Nombre Responsable{uid}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Gerencia{idgerencia}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Nombre Gerente{uidgerente}</div>";
    template += "</div>";

    template += "<div class='form-row' style='display: none;'>";
    template += "<div class='column-half'>nombregerente {nombregerente}</div>";
    template += "<div class='column-full'>Nombre Responsable{responsable}</div>";
    template += "<div class='column-full'>genrencia{genrencia}</div>";
    template += "<div class='column-full'>idestructura{idestructura}</div>";
    template += "<div class='column-full'>cuipadre{cuipadre}</div>";
    template += "<div class='column-full'>nivel{nivel}</div>";
    template += "</div>";

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";

    var modelCui = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'idestructura', name: 'idestructura', hidden: true, editable: true },
        { label: 'cuipadre', name: 'cuipadre', hidden: true, editable: true },
        { label: 'nivel', name: 'nivel', hidden: true, editable: true },
        { label: 'CUI', name: 'cui', width: 50, align: 'left', search: true, editable: true, hidden: false },
        { label: 'Nombre Cui', name: 'nombrecui', width: 200, align: 'left', search: true, editable: true, hidden: false },
        {
            label: 'Responsable', name: 'uid', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/estructuracui/responsables',
                buildSelect: function (response) {
                    var grid = $("#" + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.uid;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Responsable--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#responsable").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Responsable', name: 'responsable', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Gerencia', name: 'idgerencia', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/estructuracui/gerencias',
                buildSelect: function (response) {
                    var grid = $("#" + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idgerencia;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Gerencia--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#genrencia").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Gerencia', name: 'genrencia', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Nombre Gerente', name: 'uidgerente', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/usuarios_por_rol/Gerente',
                buildSelect: function (response) {
                    var grid = $("#" + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.uidgerente;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Gerente--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].uid == thissid) {
                            s += '<option value="' + data[i].uid + '" selected>' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        } else {
                            s += '<option value="' + data[i].uid + '">' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#nombregerente").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Nombre Gerente', name: 'nombregerente', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
    ];

    $("#" + childGridID).jqGrid({
        url: '/estructuracui/hijos/' + idestructura + '/' + cuipadre,
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelCui,
        rowNum: 10,
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        shrinkToFit: true,
        width: 1300,
        caption: 'Estructura Cui Seccion',
        styleUI: "Bootstrap",
        subGrid: false,
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,
        editurl: '/estructuracui/action',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "nombre": "No hay datos" });
            }
        }
    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: true, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            editCaption: "Modifica Estructura de CUI",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {

                if (postdata.nombrecui == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de nombre cui", ""];
                } if (postdata.uid == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de responsable", ""];
                } if (postdata.idgerencia == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de gerencia", ""];
                } if (postdata.uidgerente == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de gerente", ""];
                } else {
                    return [true, "", ""]
                }
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }, beforeShowForm: function (form) {
                nivel=3;
                $("#nivel", form).val(nivel);
                $('input#cui', form).attr('readonly', 'readonly');
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
            addCaption: "Agregar Estructura de CUI",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {

                if (postdata.cui == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de cui", ""];
                } if (postdata.nombrecui == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de nombre cui", ""];
                } if (postdata.uid == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de responsable", ""];
                } if (postdata.idgerencia == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de gerencia", ""];
                } if (postdata.uidgerente == 0) {
                    return [false, "Item Estructura: Debe escoger un valor de gerente", ""];
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
                $("#idestructura", form).val(idestructura);
                var grid = $("#" + griddepartamento);
                var rowData = grid.getRowData(parentRowKey);
                cuipadre = rowData.cui;
                $("#cuipadre", form).val(cuipadre);
                nivel=3;
                $("#nivel", form).val(nivel);
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Elimina Estructura de CUI",
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

    $("#" + childGridPagerID).css("width", "");

    $(window).bind('resize', function () {
        $("#" + childGridID).setGridWidth($(".gcontainer").width(), true);
        $("#" + childGridPagerID).setGridWidth($(".gcontainer").width(), true);
    });

}

function clearSelection() {
				jQuery("#grid").jqGrid('setGridParam', { url: "empty.json", datatype: 'json' }); // the last setting is for demo purpose only
				jQuery("#grid").jqGrid('setCaption', 'Detail Grid:: none');
				jQuery("#grid").trigger("reloadGrid");

}


