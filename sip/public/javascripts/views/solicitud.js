$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var modelSolicitudAprobacion = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'Periodo', name: 'periodo', width: 70, align: 'left', search: true, editable: false },
        { label: 'Cui', name: 'cui', width: 50, align: 'left', search: true, editable: false },
        { label: 'Nombre Cui', name: 'nomcui', width: 250, align: 'left', search: true, editable: false },
        { label: 'Responsable', name: 'nombreresponsable', width: 250, align: 'left', search: true, editable: false },
        { label: 'Contrato', name: 'contrato', width: 250, align: 'left', search: true, editable: false },
        { label: 'Proveedor', name: 'razonsocial', width: 250, align: 'left', search: true, editable: false },
        { label: 'Servicio', name: 'servicio', width: 250, align: 'left', search: true, editable: false },
        { label: 'Moneda', name: 'moneda', width: 70, align: 'left', search: true, editable: false },
        { label: 'Monto', name: 'costo', width: 150, align: 'right', formatter: 'number', search: true, editable: false }
    ], $grid = $("#grid");

    $grid.jqGrid({
        url: '/solicitud/lista',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelSolicitudAprobacion,
        rowNum: 20,
        regional: 'es',
        height: 'auto',
        width: null,
        shrinkToFit: false,
        caption: 'Solicitudes de Aprobación',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        gridComplete: function () {
            var recs = $("#grid").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                bootbox.alert("Ya fue ejecutado el proceso!!", function () { /* your callback code */ })
            }
        }
    });
    

    $grid.jqGrid('navGrid', '#pager', { edit: false, add: false, del: false, search: false }, {}, {}, {}, {});
    $grid.jqGrid('navButtonAdd', '#pager', {
        caption: "",
        buttonicon: "glyphicon glyphicon glyphicon-send",
        title: "Generar Solicitudes",
        position: "last",
        onClickButton: function () {
            bootbox.confirm("¿Esta seguro de confirmar la generación de solicitudes?", function (confirmed) {
                if (confirmed == true) {
                    var dialog = bootbox.dialog({
                        title: 'Carga de solicitudes',
                        message: '<p><i class="fa fa-spin fa-spinner"></i> Cargando...</p>'
                    });
                    dialog.init(function () {
                        $.ajax({
                            url: '/solicitud/generar'
                        }).done(function (data) {
                            if (data.error_code === 0) {
                                dialog.find('.bootbox-body').html(data.message);
                            } else {
                                dialog.find('.bootbox-body').html(data.message);
                            }

                        }).fail(function () {
                            dialog.find('.bootbox-body').html("Error");
                        }).always(function () {
                            dialog.modal('hide');
                            $("#grid").trigger("reloadGrid");
                        });
                    });
                }
            });
        }
    });
    $("table.ui-jqgrid-htable").css('width','100%');      $("table.ui-jqgrid-btable").css('width','100%');

    $("#pager_left").css("width", "");
});