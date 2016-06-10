$(document).ready(function () {
    var cuiusr;
	$.getJSON("/cuiuser", function (j) {
        cuiusr = j.cui;
        console.log('user cui:'+j.cui);      
	});



});

var leida = false;
function loadGrid(parentID) {
	var url = "/proyectostareas/" + parentID;
	var formatter = new Intl.NumberFormat();
	if (leida){
		$("#grid").jqGrid('setCaption', "Tareas SAP ").jqGrid('setGridParam', { url: url, page: 1}).jqGrid("setGridParam", {datatype: "json"}).trigger("reloadGrid");		
	} else {
		showProyectoErogaciones(parentID);
	}
}

function showDocumentos(cui, proveedor, factura, fechaini, fechafin) {

    // send the parent row primary key to the server so that we know which grid to show
    var childGridURL = "/proyectostareas/" + parentID;
    
    $("#grid").jqGrid({
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
                   { label: 'Numero',
                     name: 'tarea',  
                     search: false,                 
                     width: 70
                   },                                      
                   { label: 'Nombre ',
                     name: 'nombre',
                     search: false,
                     width: 180
                   },
                   { label: 'Presupuesto',
                     name: 'presupuestopesos',
                     width: 100,
                     search: false,
                     align: 'right',
                     formatter: 'number', formatoptions: { decimalPlaces: 0 }
                   },                  
                   { label: 'Real',
                     name: 'realacumuladopesos',
                     width: 100,
                     align: 'right',
                     search: false,
                     formatter: 'number', formatoptions: { decimalPlaces: 0 }
                   },
                   { label: 'Total',
                     name: 'saldopesos',
                     width: 100,
                     search: false,
                     align: 'right',
                     formatter: 'number', formatoptions: { decimalPlaces: 0 }
                   }            
        ],
        viewrecords: true,
		caption: "Tareas SAP ",
        rowNum: 10,
 		height: 'auto',
        styleUI: "Bootstrap",         
        autowidth:false, 
        sortable: "true",  
        rowList: [5, 10, 20, 50],    
        regional : "es",
        pager: "#pager"
    });

    $("#grid").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#grid").jqGrid('navGrid', "#pager", {
        search: false, // show search button on the toolbar
        add: false,
        edit: false,
        del: false,
        refresh: true
    });  

	leida = true;
}

var leida2 = false;

function loadGrid2(parentID, parentNombre, monto) {
	var url = "/erogacioneslist/" + parentID;
	var formatter = new Intl.NumberFormat();
	if (leida2){
		$("#grid2").jqGrid('setGridState', 'visible');
		$("#grid2").jqGrid('setCaption', "FACTURAS - "+parentNombre+" - "+ formatter.format(monto)).jqGrid('setGridParam', { url: url, page: 1}).jqGrid("setGridParam", {datatype: "json"}).trigger("reloadGrid");		
	} else {
		showProyectoErogaciones2(parentID, parentNombre, monto);
	}
}

function showProyectoErogaciones2(parentID, parentNombre, monto) {
	var formatter = new Intl.NumberFormat();
	
    // send the parent row primary key to the server so that we know which grid to show
    var childGridURL = "/erogacioneslist/" + parentID;
    
    $("#grid2").jqGrid({
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
                   { label: 'Total',
                     name: 'montosum',
                     search: false,
                     width: 150,
                     align: 'right',
                     formatter: 'number', formatoptions: { decimalPlaces: 0 }
                   }                                              
        ],
        viewrecords: true,
		caption: "FACTURAS - "+parentNombre+" - "+ formatter.format(monto),
        rowNum: 10,
 		height: 'auto',
        styleUI: "Bootstrap",         
        autowidth:false, 
        sortable: "true",  
        rowList: [5, 10, 20, 50],    
        regional : "es",
        pager: "#pager2"
    });

    $("#grid2").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#grid2").jqGrid('navGrid', "#pager2", {
        search: false, // show search button on the toolbar
        add: false,
        edit: false,
        del: false,
        refresh: true
    });  

    $("#grid2").jqGrid('navButtonAdd', "#pager2", {
    caption: "",
    buttonicon: "glyphicon glyphicon-download-alt",
    title: "Excel",
    position: "last",
    onClickButton: function () {
        var grid = $("#" + childGridID);
        var rowKey = grid.getGridParam("selrow");
        var url = '/erogacionesexcel/'+ parentRowKey;
        $("#" + childGridID).jqGrid('excelExport', { "url": url });
    }
    });
	
	leida2 = true;
}