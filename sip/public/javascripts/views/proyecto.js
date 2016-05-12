$(document).ready(function () {

    var modelProyecto = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'Numero Proyecto', name: 'sap', width: 150, align: 'left', search: true, editable: true, formoptions: { rowpos: 1, colpos: 1 } },
        { label: 'Nombre Proyecto', name: 'nombre', width: 250, align: 'left', search: true, editable: true, formoptions: { rowpos: 1, colpos: 2 } },
        { label: 'Catergoria_2', name: 'categoria2', width: 150, align: 'left', search: true, editable: true, formoptions: { rowpos: 1, colpos: 2 } },
        { label: 'PMO', name: 'pmo', width: 150, align: 'left', search: true },
        {
            label: 'Fecha Creacion', name: 'fechacreacion', width: 110, align: 'left', search: true,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
            editable: true, formoptions: { rowpos: 2, colpos: 1 },
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).datepicker({ dateFormat: 'dd-mm-yy' })
                }
            }
        },
        { label: 'Estado2', name: 'estado', width: 100, align: 'left', search: true },
        {
            label: 'Fecha Vigencia', name: 'fechavigencia', width: 110, align: 'left', search: true,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
            editable: true, formoptions: { rowpos: 2, colpos: 2 },
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).datepicker({ dateFormat: 'dd-mm-yy' })
                }
            }
        },
        { label: 'Avance %', name: 'avance2', width: 100, align: 'left', search: true, 
        formatter: 'number', formatoptions: {suffix: '%', decimalPlaces: 0 }, sorttype: 'currency'
        },
        {
            label: 'Ultimo Pago', name: 'ultimopago', width: 110, align: 'left', search: true,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
            editable: true, formoptions: { rowpos: 3, colpos: 1 },
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).datepicker({ dateFormat: 'dd-mm-yy' })
                }
            }
        },
        {
            label: 'Paso Producción Comprometido', name: 'papcomprometido', width: 100, align: 'left', search: true,
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
            label: 'Cep', name: 'cep', width: 150, align: 'right', search: true,
            editable: true, formoptions: { rowpos: 4, colpos: 1 },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },    
        {
            label: 'Acoplado', name: 'acoplado', width: 150, align: 'right', search: true,
            editable: true, formoptions: { rowpos: 4, colpos: 1 },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },               
        {
            label: 'Presupuesto Gasto', name: 'presupuestogasto', width: 150, align: 'right', search: true,
            editable: true, formoptions: { rowpos: 4, colpos: 1 },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Presupuesto Inversion', name: 'presupuestoinversion', width: 150, align: 'right', search: true,
            editable: true, formoptions: { rowpos: 4, colpos: 2 },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Compromiso Gasto', name: 'compromisogasto', width: 150, align: 'right', search: true,
            editable: true, formoptions: { rowpos: 4, colpos: 1 },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Compromiso Inversion', name: 'compromisoinversion', width: 150, align: 'right', search: true,
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
        {
            label: 'Saldo2 Gasto', name: 'saldo2gasto', width: 150, align: 'right', search: true,
            editable: true, formoptions: { rowpos: 5, colpos: 2 },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Saldo2 Inversión', name: 'saldo2inversion', width: 150, align: 'right', search: true,
            editable: true, formoptions: { rowpos: 5, colpos: 2 },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },                
        {
            label: 'Total Presupuesto', name: 'totalpresupuesto', width: 150, align: 'right', search: true,
            editable: true, formoptions: { rowpos: 5, colpos: 2 },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },  
        {
            label: 'Total Compromiso', name: 'totalcompromiso', width: 150, align: 'right', search: true,
            editable: true, formoptions: { rowpos: 5, colpos: 2 },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        }, 
        {
            label: 'Total Acumulado', name: 'totalacumulado', width: 150, align: 'right', search: true,
            editable: true, formoptions: { rowpos: 5, colpos: 2 },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },   
        {
            label: 'Total Saldo', name: 'totalsaldo', width: 150, align: 'right', search: true,
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
        add: false,
        edit: false,
        del: false,
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
                   { label: 'Numero Tarea',
                     name: 'tarea',                   
                     width: 100,
                   },                                      
                   { label: 'Nombre Tarea',
                     name: 'nombre',
                     width: 200,
                   },
                   { label: 'Presupuesto',
                     name: 'presupuestopesos',
                     width: 150,
                     align: 'right',
                     formatter: 'number', formatoptions: { decimalPlaces: 0 }
                   },
                   { label: 'Compromisos',
                     name: 'compromiso',
                     width: 150,
                     align: 'right',
                     formatter: 'number', formatoptions: { decimalPlaces: 0 }
                   },                   
                   { label: 'Real Acumulado',
                     name: 'realacumuladopesos',
                     width: 150,
                     align: 'right',
                     formatter: 'number', formatoptions: { decimalPlaces: 0 }
                   },
                   { label: 'Total',
                     name: 'saldopesos',
                     width: 150,
                     align: 'right',
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
                   { label: 'Nombre Proveedor',
                     name: 'razonsocial',
                     width: 250,
                   },
                   { label: 'Numero Factura',
                     name: 'factura',
                     align: 'center',
                     width: 100,
                   },
                   { label: 'Fecha GL',
                     name: 'fechagl',
                     width: 100,
                     formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' }
                   },
                   { label: 'Tarea Ajustada',
                     name: 'numerotarea',
                     align: 'center',
                     width: 100,
                   },      
                   { label: 'Tarea Original',
                     name: 'toriginalactual',
                     align: 'center',
                     width: 100,
                   },  
                   { label: 'Total',
                     name: 'montosum',
                     width: 150,
                     align: 'right',
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