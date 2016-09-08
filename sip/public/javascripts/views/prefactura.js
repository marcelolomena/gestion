$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var template = "<div id='responsive-form' class='clearfix'>";

    var modelSolicitudAprobacion = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'Cui', name: 'cui', width: 50, align: 'left', search: true, editable: false },
        { label: 'Nombre Cui', name: 'nomcui', width: 250, align: 'left', search: true, editable: false },
        { label: 'Responsable', name: 'nombreresponsable', width: 250, align: 'left', search: true, editable: false },
        { label: 'Contrato', name: 'contrato', width: 250, align: 'left', search: true, editable: false },
        { label: 'Servicio', name: 'servicio', width: 250, align: 'left', search: true, editable: false },
        { label: 'Costo', name: 'costo', width: 150, align: 'left', search: true, editable: false }
    ], $grid = $("#grid");

    $grid.jqGrid({
        url: '/prefactura/solicitud',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelSolicitudAprobacion,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        caption: 'Solicitudes de Aprobación',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        loadError: sipLibrary.jqGrid_loadErrorHandler
    }).jqGrid('filterToolbar', {
        stringResult: true,
        searchOnEnter: true,
        defaultSearch: "cn",
        searchOperators: true,
        beforeSearch: function () { },
        afterSearch: function () { }
    });

    $grid.jqGrid('navGrid', '#pager', { edit: false, add: false, del: false, search: false }, {}, {}, {}, {});
    $grid.jqGrid('navButtonAdd', '#pager', {
        caption: "",
        buttonicon: "glyphicon glyphicon glyphicon-cog",
        title: "Generar Solicitudes",
        position: "last",
        onClickButton: function () {
            if (confirm("¿Esta seguro de Confirmar la Generación de Solicitudes?")) {
                $.get('/prefactura/gensol');
            }
        }
    });
});