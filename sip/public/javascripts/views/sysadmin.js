$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
    var $grid = $("#grid");

    var modelsysadmin = [
        { label: 'id', name: 'id', key: true, hidden: true },
        {
            label: 'Nombre', name: 'nombre', hidden: false,
            search: false, editable: false, width: 10, align: 'left'
        },
        {
            label: 'Contenido', name: 'contenido', width: 10, align: 'left',
            search: false, editable: false, hidden: false, jsonmap: "contenido.nombre"
        },
        {
            label: 'Sistema', name: 'sistema', hidden: false,
            search: false, editable: false, width: 10, align: 'left',jsonmap:"sistema.sistema"
        },
        {
            label: 'Titulo', name: 'title', width: 10, align: 'left',
            search: false, editable: false, hidden: false
        },
        {
            label: 'Script', name: 'script', width: 30, align: 'left',
            search: false, editable: false, hidden: false,
            edittype: "textarea"
        },

    ];

    $grid.jqGrid({
        url: '/sysadmin',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelsysadmin,
        rowNum: 25,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        caption: 'Administrador de páginas',
        pager: "#pager",
        viewrecords: true,
        rowList: [50, 100, 500, 1000],
        styleUI: "Bootstrap",
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        editurl: '/sysadmin'
    });

    $("#pager_left").css("width", "");


});