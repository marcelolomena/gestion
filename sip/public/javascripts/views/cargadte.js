$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
    var $grid = $("#grid");

    var modelcargas = [
        { label: 'id', name: 'id', key: true, hidden: true, jsonmap: "factura.id" },
        {
            label: 'Fecha Carga', name: 'horainicio', hidden: false,
            search: false, editable: false, width: 50, align: 'left',
            formatter: "date", formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y h:i" }
        },
        { label: 'DTE', name: 'archivo', width: 50, align: 'left', search: false, editable: false, hidden: false },
        {
            label: 'Estado', name: 'estado', hidden: false,
            search: false, editable: false, width: 50, align: 'left'
        },
        {
            label: 'Número Factura', name: 'numero', width: 50, align: 'left', search: false, editable: false, hidden: false,
            jsonmap: "factura.numero"
        },
        {
            label: 'Proveedor', name: 'razonsocial', width: 200, align: 'left', search: true, sortable: false, editable: false,
            jsonmap: "factura.proveedor.razonsocial"
        },
        {
            label: 'Fecha Factura', name: 'fecha', hidden: false,
            search: false, editable: false, width: 50, align: 'left',
            formatter: "date", formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y" }, jsonmap: "factura.fecha"
        },
        {
            label: 'Total', name: 'montototal', width: 150, align: 'right', search: false, sortable: false, editable: false,
            formatter: 'number', formatoptions: { decimalPlaces: 0 }, jsonmap: "factura.montototal"
        },
        { label: 'horafin', name: 'horafin', hidden: true, search: false, editable: false, },
        {
            name: 'Tiempo Carga', index: 'tiempo', width: 60, align: 'right', hidden: true,
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

    $grid.jqGrid({
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
        caption: 'Lista de Facturas Cargadas',
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

    $grid.jqGrid('navGrid', "#pager", {
        edit: false, add: true, del: false, search: false, refresh: true, view: false, position: "left", cloneToTop: false
    },
        {}, {
            addCaption: "Carga de DTE",
            closeAfterAdd: true,
            recreateForm: true,
            mtype: 'POST',
            url: '/cargadte/guardar',
            afterSubmit: UploadFile
        }, {}

    );

    $grid.jqGrid('navButtonAdd', "#pager", {
        caption: "",
        id: "download_" + $grid.attr('id'),
        buttonicon: "glyphicon glyphicon-download-alt",
        title: "Generar Asiento",
        position: "first",
        onClickButton: function () {
            var rowKey = $grid.getGridParam("selrow");
            var rowData = $grid.getRowData(rowKey);
            var thissid = rowData.id;
            if (thissid === undefined) {
                bootbox.alert("Debe seleccionar un detalle");
            }
            else {
                try {
                    var url = '/cargadte/download/' + thissid;
                    $grid.jqGrid('excelExport', { "url": url });
                } catch (e) {
                    console.error(e)
                }
            }
        }
    });

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
        {
            label: 'ID Prefactura',
            name: 'idprefactura',
            width: 50,
            hidden: true,
            editable: false
        },
        {
            label: 'ID Facturación',
            name: 'idfacturacion',
            width: 50,
            align: 'left',
            search: false,
            editable: false,
            hidden: false,
        },
        {
            label: 'Glosa Servicio',
            name: 'glosaservicio',
            width: 200,
            align: 'left',
            search: false,
            editable: false,
            hidden: false
        },
        {
            label: 'Monto Neto',
            name: 'montoneto',
            width: 100,
            align: 'right',
            search: false,
            editable: false,
            hidden: false,
            formatter: 'number',
            formatoptions: { decimalPlaces: 2 }
        },
        {
            label: 'Impuesto',
            name: 'impuesto',
            width: 100,
            align: 'right',
            search: false,
            editable: false,
            hidden: false,
            formatter: 'number',
            formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Cantidad',
            name: 'cantidad',
            width: 50,
            align: 'right',
            search: false,
            hidden: false,
            formatter: 'number',
            editable: false
        },
        {
            label: 'Total',
            name: 'montototal',
            width: 100,
            align: 'right',
            search: false,
            hidden: false,
            editable: false,
            formatter: 'number',
            formatoptions: { decimalPlaces: 0 }
        }
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
        caption: 'Detalle de Facturas',
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