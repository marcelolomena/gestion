 $(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Nombre{nombre}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>CUI{idcui}</div>";
    template += "<div class='column-half'>% Avance{porcentajeavance}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Lider Proyecto {uidlider}</div>";
    template += "<div class='column-half'>PMO {uidpmo}</div>";
    template += "</div>";

    template += "<div class='form-row' style='display: none;'>";
    template += "<div class='column-half'>liderproyecto{liderproyecto}</div>";
    template += "<div class='column-half'>pmoresponsable{pmoresponsable}</div>";
    template += "</div>";

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";
    
 var modelPlantilla = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'idcui', name: 'idcui', hidden: true },
        { label: 'idservicio', name: 'idservicio', hidden: true },
        { label: 'idproveedor', name: 'idproveedor', hidden: true },
        {
            label: 'CUI', name: 'estructuracui.cui', width: 50, align: 'left', search: true, editable: false, hidden: false,
            //jsonmap: "EstructuraCui.nombre"
        },
                {
            label: 'Nombre', name: 'estructuracui.nombre', width: 50, align: 'left', search: true, editable: false, hidden: false,
            //jsonmap: "EstructuraCui.nombre"
        },
        {
            label: 'CUI', name: 'idcui', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/cui',
                buildSelect: function (response) {
                    var grid = $('#grid');
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.id;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Cui--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        { label: 'Nombre Responsable', name: 'estructuracui.nombreresponsable', width: 100, align: 'left', search: true, editable: true },       
        { label: 'Nombre Gerente', name: 'estructuracui.nombregerente', width: 100, align: 'left', search: true, editable: true },
    ];
    $("#grid").jqGrid({
        url: '/plantilla/list',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelPlantilla,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        caption: 'Lista de plantillas Presupuestarias',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        editurl: '/plantilla/action',
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $("#grid").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#grid").addRowData("blankRow", { "nombre": "No hay datos" });
            }
        },
        subGrid: true,
       // subGridRowExpanded: showChildGrid,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
    });

    $("#grid").jqGrid("setLabel", "codigoart", "", { "text-align": "right" });
    $("#grid").jqGrid("setLabel", "porcentajeavance", "", { "text-align": "right" });
    $("#grid").jqGrid("setLabel", "fechainicio", "", { "text-align": "center" });
    $("#grid").jqGrid("setLabel", "fechapap", "", { "text-align": "center" });
    $("#grid").jqGrid("setLabel", "fechacierresap", "", { "text-align": "center" });

    $("#grid").jqGrid('navGrid', "#pager", {
        edit: true, add: true, del: true, search: false,
        refresh: true, view: true, position: "left", cloneToTop: false
    },
        {
            editCaption: "Modifica Proyecto",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
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
            }
        },
        {
            addCaption: "Agrega Proyecto",
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {
                if (postdata.uidlider == 0) {
                    return [false, "Lider: Debe escoger un valor", ""];
                } else if (postdata.uidpmo == 0) {
                    return [false, "PMO: Debe escoger un valor", ""];
                } else {
                    return [true, "", ""]
                }
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
                sipLibrary.centerDialog($('#grid').attr('id'));
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

    $('#grid').jqGrid('navButtonAdd', '#pager', {
        caption: "",
        buttonicon: "glyphicon glyphicon-download-alt",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $('#grid');
            var rowKey = grid.getGridParam("selrow");
            var url = '/proyectosenvuelo/excel';
            $('#grid').jqGrid('excelExport', { "url": url });
        }
    });

    $("#pager_left").css("width", "");

    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });
});