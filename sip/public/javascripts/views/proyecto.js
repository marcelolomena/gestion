$(document).ready(function () {

    var $grid = $("#grid"), modelProyecto = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: '# SAP', name: 'sap', width: 80, align: 'left', search: true, editable: true, formoptions: { rowpos: 1, colpos: 1 } },
        { label: 'Nombre Proyecto', name: 'nombre', width: 250, align: 'left', search: true, editable: true, formoptions: { rowpos: 1, colpos: 2 } },
        { label: 'PMO', name: 'pmo', width: 130, align: 'left', search: true },
        {
            label: 'Inscripción', name: 'fechacreacion', width: 90, align: 'center', search: false, sortable: false,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
            editable: true, formoptions: { rowpos: 2, colpos: 1 },
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).datepicker({ dateFormat: 'dd-mm-yy' })
                }
            }
        },
        {
            label: 'Paso Producción', name: 'papcomprometido', width: 120, align: 'center', search: false, sortable: false,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
            editable: true, formoptions: { rowpos: 3, colpos: 2 },
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).datepicker({ dateFormat: 'dd-mm-yy' })
                }
            }
        },
        {
            label: 'Cierre', name: 'fechavigencia', width: 80, align: 'center', search: false, sortable: false,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
            editable: true, formoptions: { rowpos: 2, colpos: 2 },
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).datepicker({ dateFormat: 'dd-mm-yy' })
                }
            }
        },
        { label: 'Estado', name: 'estado', width: 80, align: 'center', search: false },
        {
            label: '% Consumido', name: 'avance2', width: 100, align: 'center', search: false, sortable: false,
            formatter: 'number', formatoptions: { suffix: '%', decimalPlaces: 0 }, sorttype: 'currency'
        },
        {
            label: 'Ppto Gasto', name: 'presupuestogasto', width: 100, align: 'right', search: false,
            editable: true, formoptions: { rowpos: 4, colpos: 1 },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Ppto Inversion', name: 'presupuestoinversion', width: 120, align: 'right', search: false,
            editable: true, formoptions: { rowpos: 4, colpos: 2 },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Total Presupuesto', name: 'totalpresupuesto', width: 130, align: 'right', search: false, sortable: false,
            editable: true, formoptions: { rowpos: 5, colpos: 2 },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Pagado Gasto', name: 'realacumuladogasto', width: 110, align: 'right', search: false,
            editable: true, formoptions: { rowpos: 5, colpos: 1 },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Pagado Inversion', name: 'realacumuladoinversion', width: 122, align: 'right', search: false,
            editable: true, formoptions: { rowpos: 5, colpos: 2 },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Total Pagado', name: 'totalacumulado', width: 100, align: 'right', search: false, sortable: false,
            editable: true, formoptions: { rowpos: 5, colpos: 2 },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Saldo Gasto', name: 'saldo2gasto', width: 100, align: 'right', search: false,
            editable: true, formoptions: { rowpos: 5, colpos: 2 },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Saldo Inversión', name: 'saldo2inversion', width: 115, align: 'right', search: false,
            editable: true, formoptions: { rowpos: 5, colpos: 2 },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Total Saldo', name: 'totalsaldo', width: 100, align: 'right', search: false, sortable: false,
            editable: true, formoptions: { rowpos: 5, colpos: 2 },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        }

    ];
    $("#grid").jqGrid({
        url: '/proyectoslist',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelProyecto,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        sortable: "true",
        width: null,
        shrinkToFit: false,
        caption: 'Lista de proyectos',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        subGrid: true, // set the subGrid property to true to show expand buttons for each row
        subGridRowExpanded: showProyectosTareas, // javascript function that will take care of showing the child grid        
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        },
        loadComplete: function (data) {

            $.get('/lastdateload/5', function (data) {
                var theDate = data.date.substring(0,10);
                var display = theDate.substring(8)+'-'+theDate.substring(5,7)+'-'+theDate.substring(0,4);
                $grid.jqGrid('setCaption', 'Lista de proyectos al ' + display);
            });

        }
    });

    $("#grid").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $('#grid').jqGrid('navGrid', "#pager", {
        search: false, // show search button on the toolbar
        add: false,
        edit: false,
        del: false,
        refresh: true
    });


    $('#grid').jqGrid('navButtonAdd', '#pager', {
        caption: "",
        buttonicon: "glyphicon glyphicon-download-alt",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $('#grid');
            var rowKey = grid.getGridParam("selrow");
            var url = '/proyectosexcel';
            $('#grid').jqGrid('excelExport', { "url": url });
        }
    });

    $("table.ui-jqgrid-htable").css('width','100%');      
    $("table.ui-jqgrid-btable").css('width','100%');
    $("#pager_left").css("width", "");
});


function showProyectosTareas(parentRowID, parentRowKey) {
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";

    // send the parent row primary key to the server so that we know which grid to show
    var childGridURL = "/proyectostareas/" + parentRowKey;

    // add a table and pager HTML elements to the parent grid row - we will render the child grid here
    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: [
            {
                label: 'id',
                name: 'id',
                width: 50,
                key: true,
                hidden: true
            },
            {
                label: 'Numero Tarea',
                name: 'tarea',
                search: false,
                width: 200
            },
            {
                label: 'Nombre Tarea',
                name: 'nombre',
                search: false,
                width: 200
            },
            {
                label: 'Presupuesto',
                name: 'presupuestopesos',
                width: 150,
                search: false,
                align: 'right',
                formatter: 'number', formatoptions: { decimalPlaces: 0 }
            },
            {
                label: 'Pagado',
                name: 'realacumuladopesos',
                width: 150,
                align: 'right',
                search: false,
                formatter: 'number', formatoptions: { decimalPlaces: 0 }
            },
            {
                label: 'Saldo',
                name: 'saldopesos',
                width: 150,
                search: false,
                align: 'right',
                formatter: 'number', formatoptions: { decimalPlaces: 0 }
            }
        ],
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        width: null,
        shrinkToFit: false,
        rowNum: 10,
        rowList: [5, 10, 20, 50],
        subGrid: true, // set the subGrid property to true to show expand buttons for each row
        subGridRowExpanded: showProyectoErogaciones, // javascript function that will take care of showing the child grid
        loadComplete: function () {
            var $grid = $("#" + childGridID);
            var colSum = $grid.jqGrid('getCol', 'presupuestopesos', false, 'sum');
            var colSum2 = $grid.jqGrid('getCol', 'realacumuladopesos', false, 'sum');
            var colSum3 = $grid.jqGrid('getCol', 'saldopesos', false, 'sum');
            $grid.jqGrid('footerData', 'set', { presupuestopesos: colSum, realacumuladopesos: colSum2, saldopesos: colSum3 });
        },
        footerrow: true,
        userDataOnFooter: true,
        pager: "#" + childGridPagerID
    });

    $("#" + childGridID).jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        search: false, // show search button on the toolbar
        add: false,
        edit: false,
        del: false,
        refresh: true
    });

    $("#" + childGridID).jqGrid('navButtonAdd', "#" + childGridPagerID, {
        caption: "",
        buttonicon: "glyphicon glyphicon-download-alt",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $("#" + childGridID);
            var rowKey = grid.getGridParam("selrow");
            var url = '/proyectostareasexcel/' + parentRowKey;
            $("#" + childGridID).jqGrid('excelExport', { "url": url });
        }
    });
    $("table.ui-jqgrid-htable").css('width','100%');      
    $("table.ui-jqgrid-btable").css('width','100%');
    $("table.ui-jqgrid-ftable").css('width','100%');

    $("#" + childGridPagerID+"_left").css("width", "");

}

function showProyectoErogaciones(parentRowID, parentRowKey) {
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";

    // send the parent row primary key to the server so that we know which grid to show
    var childGridURL = "/erogacioneslist/" + parentRowKey;

    // add a table and pager HTML elements to the parent grid row - we will render the child grid here
    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: [
            {
                label: 'id',
                name: 'id',
                width: 50,
                key: true,
                hidden: true
            },
            {
                label: 'Nombre Proveedor',
                name: 'razonsocial',
                sortable: false,
                width: 250,
            },
            {
                label: 'Numero Factura',
                name: 'factura',
                align: 'center',
                sortable: false,
                width: 130,
            },
            {
                label: 'Fecha Contable',
                name: 'fechagl',
                search: false,
                sortable: false,
                width: 130,
                formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' }
            },
            {
                label: '# Tarea',
                name: 'numerotarea',
                align: 'center',
                sortable: false,
                search: false,
                width: 100,
            },
            {
                label: 'Costo DIVOT',
                name: 'montosum',
                search: false,
                sortable: false,
                width: 130,
                align: 'right',
                formatter: 'number', formatoptions: { decimalPlaces: 0 }
            }
        ],
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: "es",
        height: 'auto',
        width: null,
        shrinkToFit: false,
        rowNum: 10,
        rowList: [5, 10, 20, 50],
        loadComplete: function () {
            var $grid = $("#" + childGridID);
            var colSum = $grid.jqGrid('getCol', 'montosum', false, 'sum');
            $grid.jqGrid('footerData', 'set', { montosum: colSum });
        },
        footerrow: true,
        userDataOnFooter: true,
        pager: "#" + childGridPagerID
    });

    $("#" + childGridID).jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        search: false, // show search button on the toolbar
        add: false,
        edit: false,
        del: false,
        refresh: true
    });

    $("#" + childGridID).jqGrid('navButtonAdd', "#" + childGridPagerID, {
        caption: "",
        buttonicon: "glyphicon glyphicon-download-alt",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $("#" + childGridID);
            var rowKey = grid.getGridParam("selrow");
            var url = '/erogacionesexcel/' + parentRowKey;
            $("#" + childGridID).jqGrid('excelExport', { "url": url });
        }
    });
    
}