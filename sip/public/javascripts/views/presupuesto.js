$(document).ready(function () {

    var modelProyecto = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'CUI', name: 'CUI', width: 80, align: 'left', search: false, editable: true, formoptions: { rowpos: 1, colpos: 1 } },
        { label: 'Nombre CUI', name: 'nombre', width: 250, align: 'left', search: false, editable: true, formoptions: { rowpos: 1, colpos: 1 } },
        { label: 'Responsable CUI', name: 'responsable', width: 250, align: 'left', search: false, editable: true, formoptions: { rowpos: 1, colpos: 1 } },
        { label: 'Ejercicio', name: 'ejercicio', width: 100, align: 'left', search: false, editable: true, formoptions: { rowpos: 1, colpos: 2 } },
        { label: 'Versión', name: 'version', width: 100, align: 'left', search: false, editable: true, formoptions: { rowpos: 1, colpos: 2 } },
        { label: 'Nombre', name: 'descripcion', width: 150, align: 'left', search: false }
    ];
    $("#grid").jqGrid({
        url: '/presupuestolist',
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
        caption: 'Lista de Presupuestos',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        subGrid: true, // set the subGrid property to true to show expand buttons for each row
        subGridRowExpanded: showPresupuestoServicios, // javascript function that will take care of showing the child grid        
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


    $('#grid').jqGrid('navButtonAdd', '#pager', {
        caption: "Excel",
        buttonicon: "silk-icon-page-excel",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $('#grid');
            var rowKey = grid.getGridParam("selrow");
            var url = '/presupuestosexcel';
            $('#grid').jqGrid('excelExport', { "url": url });
        }
    });

    $("#pager_left").css("width", "");
});

    
function showPresupuestoServicios(parentRowID, parentRowKey) {
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";

    // send the parent row primary key to the server so that we know which grid to show
    var childGridURL = "/presupuestoservicios/" + parentRowKey;

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
                   { label: 'Cuenta',
                     name: 'cuentacontable',
                     search: false,
                     width: 120
                   },
                   { label: 'Nombre Cuenta',
                     name: 'nombrecuenta',
                     width: 130,
                     search: false,
                     align: 'right'
                   },
                   { label: 'Servicio',
                     name: 'nombre',  
                     search: false,                 
                     width: 200
                   },                     
                   { label: 'Moneda',
                     name: 'moneda',
                     width: 100,
                     align: 'right',
                     search: false
                   },
                   { label: 'Monto Forecast',
                     name: 'montoforecast',
                     width: 130,
                     align: 'right',
                     search: false,
                     formatter: 'number', formatoptions: { decimalPlaces: 0 }
                   },
                   { label: 'Monto Anual',
                     name: 'montoanual',
                     width: 130,
                     align: 'right',
                     search: false,
                     formatter: 'number', formatoptions: { decimalPlaces: 0 }
                   }                                                     
        ],
        viewrecords: true,
        styleUI: "Bootstrap", 
        regional: 'es',
        sortable: "true",
        rowNum: 10,
 		height: 'auto',  
        rowList: [5, 10, 20, 50],
        autowidth:false,       
        subGrid: true, // set the subGrid property to true to show expand buttons for each row
        subGridRowExpanded: showProyectoErogaciones, // javascript function that will take care of showing the child grid                
        pager: "#" + childGridPagerID
    });
    
    $("#" + childGridID).jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#" + childGridID).jqGrid('navGrid', "#"+ childGridPagerID, {
        search: false, // show search button on the toolbar
        add: false,
        edit: false,
        del: false,
        refresh: true
    });    
    
    $("#" + childGridID).jqGrid('navButtonAdd', "#" + childGridPagerID, {
    caption: "Excel",
    buttonicon: "silk-icon-page-excel",
    title: "Excel",
    position: "last",
    onClickButton: function () {
        var grid = $("#" + childGridID);
        var rowKey = grid.getGridParam("selrow");
        var url = '/presupuestoserviciosexcel/'+ parentRowKey;
        $("#" + childGridID).jqGrid('excelExport', { "url": url });
    }
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
                     search: false,
                     sortable: false,
                     width: 100,
                     formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' }
                   },
                   { label: 'Tarea Ajustada',
                     name: 'numerotarea',
                     align: 'center',
                     search: false,
                     width: 100,
                   },      
                   { label: 'Tarea Original',
                     name: 'toriginalactual',
                     align: 'center',
                     search: false,
                     width: 100,
                   },  
                   { label: 'Total',
                     name: 'montosum',
                     search: false,
                     width: 150,
                     align: 'right',
                     formatter: 'number', formatoptions: { decimalPlaces: 0 }
                   }                                              
        ],
        viewrecords: true,
        rowNum: 10,
 		height: 'auto',
        styleUI: "Bootstrap",         
        autowidth:false, 
        sortable: "true",  
        rowList: [5, 10, 20, 50],    
        regional : "es",
        pager: "#" + childGridPagerID
    });

    $("#" + childGridID).jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#" + childGridID).jqGrid('navGrid', "#"+ childGridPagerID, {
        search: false, // show search button on the toolbar
        add: false,
        edit: false,
        del: false,
        refresh: true
    });  

    $("#" + childGridID).jqGrid('navButtonAdd', "#" + childGridPagerID, {
    caption: "Excel",
    buttonicon: "silk-icon-page-excel",
    title: "Excel",
    position: "last",
    onClickButton: function () {
        var grid = $("#" + childGridID);
        var rowKey = grid.getGridParam("selrow");
        var url = '/erogacionesexcel/'+ parentRowKey;
        $("#" + childGridID).jqGrid('excelExport', { "url": url });
    }
    });
}