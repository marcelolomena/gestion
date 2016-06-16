$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var modelPlantilla = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'CUI', name: 'cui', width: 50, align: 'left', search: true, editable: false, hidden: false },
        { label: 'Nombre', name: 'nombre', width: 50, align: 'left', search: true, editable: false, hidden: false },
        { label: 'Nombre Responsable', name: 'nombreresponsable', width: 100, align: 'left', search: true, editable: true },
        { label: 'Nombre Gerente', name: 'nombregerente', width: 100, align: 'left', search: true, editable: true },
    ];
    $("#grid").jqGrid({
        url: '/plantilla/list',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelPlantilla,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        caption: 'Lista de plantillas Por CUI',
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
        subGridRowExpanded: showChildGrid,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
    });

    $("#grid").jqGrid('navGrid', "#pager", {
        edit: false, add: false, del: false, search: false,
        refresh: true, view: true, position: "left", cloneToTop: false
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

function showChildGrid(parentRowID, parentRowKey) {

    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    var childIdServicio  = 0;

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>CUI{cui}</div>";
    template += "<div class='column-full'>Nombre{nombrecui}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Servicio {idservicio}</div>";
    template += "<div class='column-full'>Proveedor {idproveedor}</div>";
    template += "</div>";

    template += "<div class='form-row' style='display: none;'>";
    template += "<div class='column-full'>Servicio {nombre}</div>";
    template += "<div class='column-full'>Proveedor {razonsocial}</div>";
    template += "</div>";

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";

    var modelDetalleServicio = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'idcui', name: 'idcui', hidden: true },
        { label: 'CUI', name: 'cui', editable: true, width: 100, jsonmap: "estructuracui.cui", editrules: { edithidden: false }, hidedlg: false },
        { label: 'Nombre', name: 'nombrecui', editable: true, jsonmap: "estructuracui.nombre", editrules: { edithidden: false }, hidedlg: true },
        {
            label: 'Servicio', name: 'nombre', search: false, width: 300,
            editable: true, jsonmap: "servicio.nombre",
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Servicio', name: 'idservicio', search: false, width: 300,
            editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/cuiservicios/' + parentRowKey,
                buildSelect: function (response) {
                    var grid = $("#" + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idservicio;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Servicio--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                            childIdServicio = data[i].id;
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }, dataInit: function (elem) { $(elem).width(200); }

        },
        {
            label: 'Proveedor', name: 'razonsocial', width: 300, align: 'left',
            search: false, editable: true, jsonmap: "proveedor.razonsocial",
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Proveedor', name: 'idproveedor', width: 300, align: 'right',
            search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/cuiproveedores/' + parentRowKey + '/' + childIdServicio,
                buildSelect: function (response) {
                    var grid = $("#" + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idproveedor;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Proveedor--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].razonsocial + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].razonsocial + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }, dataInit: function (elem) { $(elem).width(200); }
        },
    ];

    $("#" + childGridID).jqGrid({
        url: '/detalleplantilla/' + parentRowKey,
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelDetalleServicio,
        viewrecords: true,
        shrinkToFit: true,
        autowidth: true,
        caption: 'Plantilla por CUI-SERVICIO-PROVEEDOR',
        styleUI: "Bootstrap",
        subGrid: false,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,
        editurl: '/plantilla/action',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "nombre": "No hay datos" });
            }
        }
    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            editCaption: "Modifica Plantilla de Presupuesto",
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
            addCaption: "Agregar Plantilla de Presupuesto",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {

                if (postdata.idcui == 0) {
                    return [false, "Cui: Debe escoger un valor", ""];
                } if (postdata.idservicio == 0) {
                    return [false, "Servicio: Debe escoger un valor", ""];
                } else {
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
                else
                    return [true, "", ""]
            }, beforeShowForm: function (form) {

                var grid = $("#grid");
                var rowData = grid.getRowData(parentRowKey);
                var thissid = rowData.cui;
                $("#cui", form).val(thissid);
                var grid = $("#grid");
                var rowData = grid.getRowData(parentRowKey);
                var thissid = rowData.nombre;
                $("#nombrecui", form).val(thissid);

                $('input#cui', form).attr('readonly', 'readonly');
                $('input#nombrecui', form).attr('readonly', 'readonly');
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }, afterShowForm: function (form) {

                $("#idservicio").change(function () {
                    childIdServicio = $(this).val();
                    $.getJSON("/cuiproveedores/" + parentRowKey+"/"+childIdServicio, function (j) {
                        $('#idproveedor').remove();
                        $.each(j, function (i, item) {
                            $('#idproveedor').append('<option value="' + item.id + '">' + item.razonsocial + '</option>');
                        });
                    });
                });

                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Elimina Plantilla Presupuestaria",
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
