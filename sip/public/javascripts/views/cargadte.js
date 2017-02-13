$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
    //var $grid = $("#gridMaster");
    var modelcargas = [
        { label: 'id', name: 'id', key: true, hidden: true,jsonmap: "factura.id" },
        {
            label: 'Fecha', name: 'horainicio', hidden: false,
            search: false, editable: false, formatter: "date", formatoptions: { srcformat: "ISO8601Long", newformat: "m/d/Y h:i" }
        },
        { label: 'horafin', name: 'horafin', hidden: true, search: false, editable: false, },
        { label: 'Archivo', name: 'archivo', width: 50, align: 'left', search: true, editable: false, hidden: false },
        {
            name: 'tiempo', index: 'tiempo', width: 60, align: 'right', hidden: true,
            formatter: function (cellvalue, options, rowObject) {
                var horainicio = rowObject.horainicio,
                    horafin = rowObject.horafin;
                console.log("horainicio" + horainicio)
                console.log("horafin" + horafin)
                return 100;
            }
        },
        {
            label: 'Archivo',
            name: 'fileToUpload',
            hidden: true,
            editable: true,
            edittype: 'file',
            editrules: { edithidden: true },
            editoptions: {
                enctype: "multipart/form-data"
            },
            search: false
        }
    ];
    $("#grid").jqGrid({
        url: '/cargadte/list',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelcargas,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        caption: 'Lista de Archivos Disponibles',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $("#grid").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#grid").addRowData("blankRow", { "frecuencia": "No hay datos" });
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
        edit: false, add: true, del: false, search: false, refresh: false, view: false, position: "left", cloneToTop: false
    },
        {}, {
            addCaption: "Carga de Archivo",
            closeAfterAdd: true,
            recreateForm: true,
            mtype: 'POST',
            url: '/cargadte/guardar',
            afterSubmit: UploadFile
        }, {}

    );

    function UploadFile(response, postdata) {

        var data = $.parseJSON(response.responseText);
        if (data.success) {
            if ($("#fileToUpload").val() != "") {
                ajaxFileUpload(data.id);
            }
        }

        return [data.success, data.message, data.id];

    }

    function ajaxFileUpload(id) {
        var dialog = bootbox.dialog({
            title: 'Se inicia la carga en la base de datos',
            message: '<p><i class="fa fa-spin fa-spinner"></i> Esto puede durar varios minutos...</p>'
        });
        dialog.init(function () {
            $.ajaxFileUpload({
                url: '/cargadte/archivo',
                secureuri: false,
                fileElementId: 'fileToUpload',
                dataType: 'json',
                data: { id: id },
                success: function (data, status) {
                    if (typeof (data.success) != 'undefined') {
                        if (data.success == true) {
                            dialog.find('.bootbox-body').html(data.message);
                        } else {
                            dialog.find('.bootbox-body').html(data.message);
                        }
                    }
                    else {
                        dialog.find('.bootbox-body').html(data.message);
                    }
                },
                error: function (data, status, e) {
                    dialog.find('.bootbox-body').html(e);
                }
            })
        });
    }

    $("#pager_left").css("width", "");

    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });
});

function showChildGrid(parentRowID, parentRowKey) {

    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    var childIdServicio = 0;

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    var modelDetalle = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'Control 2', name: 'control2', editable: true, width: 100, editrules: { edithidden: false }, hidedlg: true, search: false },
    ];

    $("#" + childGridID).jqGrid({
        url: '/cargadte/detalle/' + parentRowKey,
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelDetalle,
        rowNum: 10,
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        shrinkToFit: true,
        width: 1300,
        caption: 'Detalle de Cargas Realizadas',
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID
    });


    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false, add: false, del: false, search: false, refresh: true, view: false, position: "left", cloneToTop: false
    }
    );

    $("#" + childGridPagerID).css("width", "");

    $(window).bind('resize', function () {
        $("#" + childGridID).setGridWidth($(".gcontainer").width(), true);
        $("#" + childGridPagerID).setGridWidth($(".gcontainer").width(), true);
    });

}