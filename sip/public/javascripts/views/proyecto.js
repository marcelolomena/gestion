$(document).ready(function () {

    var modelProyecto = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'SAP', name: 'sap', width: 130, align: 'left', search: true, editable: true, formoptions: { rowpos: 1, colpos: 1 } },
        { label: 'Proyecto', name: 'nombre', width: 200, align: 'left', search: true, editable: true, formoptions: { rowpos: 1, colpos: 2 } },
        { label: 'PMO', name: 'pmo', width: 150, align: 'left', search: true },
        {
            label: 'Fecha Creacion', name: 'fechacreacion', width: 110, align: 'left', search: true,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' },
            editable: true, formoptions: { rowpos: 2, colpos: 1 },
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).datepicker({ dateFormat: 'yy-mm-dd' })
                }
            }
        },
        { label: 'Estado', name: 'estado', width: 100, align: 'left', search: true },
        {
            label: 'Fecha Vigencia', name: 'fechavigencia', width: 110, align: 'left', search: true,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' },
            editable: true, formoptions: { rowpos: 2, colpos: 2 },
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).datepicker({ dateFormat: 'yy-mm-dd' })
                }
            }
        },
        { label: 'Avance', name: 'avance', width: 100, align: 'left', search: true },
        {
            label: 'Fecha Ultimo Pago', name: 'ultimopago', width: 110, align: 'left', search: true,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' },
            editable: true, formoptions: { rowpos: 3, colpos: 1 },
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).datepicker({ dateFormat: 'yy-mm-dd' })
                }
            }
        },
        {
            label: 'Fecha Pap', name: 'papcomprometido', width: 100, align: 'left', search: true,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' },
            editable: true, formoptions: { rowpos: 3, colpos: 2 },
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).datepicker({ dateFormat: 'yy-mm-dd' })
                }
            }
        },
        {
            label: 'Pre Gasto', name: 'presupuestogasto', width: 150, align: 'right', search: true,
            editable: true, formoptions: { rowpos: 4, colpos: 1 },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Pre Inversion', name: 'presupuestoinversion', width: 150, align: 'right', search: true,
            editable: true, formoptions: { rowpos: 4, colpos: 2 },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Real Gasto', name: 'realacumuladogasto', width: 150, align: 'right', search: true,
            editable: true, formoptions: { rowpos: 5, colpos: 1 },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Real Inversion', name: 'realacumuladoinversion', width: 150, align: 'right', search: true,
            editable: true, formoptions: { rowpos: 5, colpos: 2 },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
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
        }
    });

    $("#grid").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $('#grid').jqGrid('navGrid', "#pager", {
        search: false, // show search button on the toolbar
        add: true,
        edit: true,
        del: true,
        refresh: true
    });

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
                   { label: 'id',
                      name: 'id',
                      width: 50,
                      key: true, 
                      hidden:true
                   },
                   { label: 'Tarea',
                     name: 'tarea',                   
                     width: 200,
                   },                                      
                   { label: 'Nombre',
                     name: 'nombre',
                     width: 200,
                   },
                   { label: 'Presupuesto',
                     name: 'presupuestopesos',
                     width: 150,
                     formatter: 'number', formatoptions: { decimalPlaces: 0 }
                   },
                   { label: 'Real Acumulado',
                     name: 'realacumuladopesos',
                     width: 150,
                     formatter: 'number', formatoptions: { decimalPlaces: 0 }
                   },
                   { label: 'Saldo',
                     name: 'saldopesos',
                     width: 150,
                     formatter: 'number', formatoptions: { decimalPlaces: 0 }
                   }            
        ],
        rowNum: 10,
 		height: 'auto',
        styleUI: "Bootstrap",         
        autowidth:false,       
        regional : "es",
        subGrid: true, // set the subGrid property to true to show expand buttons for each row
        subGridRowExpanded: showProyectoErogaciones, // javascript function that will take care of showing the child grid                
        pager: "#" + childGridPagerID
    });

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
                   { label: 'id',
                      name: 'id',
                      width: 50,
                      key: true,
                      hidden:true
                   },                   
                   { label: 'Proveedor',
                     name: 'razonsocial',
                     width: 200,
                   },
                   { label: 'Factura',
                     name: 'factura',
                     width: 150,
                   },
                   { label: 'Fecha GL',
                     name: 'fechagl',
                     width: 150,
                     formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' }
                   },
                   { label: 'Tarea',
                     name: 'numerotarea',
                     width: 150,
                   },      
                   { label: 'Tarea Original',
                     name: 'toriginalactual',
                     width: 150,
                   },  
                   { label: 'Total',
                     name: 'montosum',
                     width: 150,
                     formatter: 'number', formatoptions: { decimalPlaces: 0 }
                   }                                              
        ],
        rowNum: 10,
 		height: 'auto',
        styleUI: "Bootstrap",         
        autowidth:false,       
        regional : "es",
        pager: "#" + childGridPagerID
    });

}