
$(document).ready(function () {

    $('#fechaini').datepicker({
        format: "dd/mm/yyyy"
    }); 
    
    $('#fechafin').datepicker({
        format: "dd/mm/yyyy"
    });      
                
    var cuiusr;
   
    $.ajax({ 
        url: "/cuiuser", 
        dataType: 'json', 
        async: false, 
        success: function(j){ 
            $.each(j,function(i,item) {
                cuiusr = item.cui;
                console.log('***user cui:'+cuiusr);  
            });
        } 
    });    

    
	$.getJSON("/troyacui/"+cuiusr, function (j) {
		//$('#sap option').remove();
		$.each(j, function (i, item) {
			$('#cui').append('<option value="' + item.id + '">' + item.nombre + '</option>');
		});
	});    

    $("#cui").change(function(){
        scui = $(this).val();
        $.getJSON("/proveedorcui/"+scui, function(j){
            $('#proveedor option').remove();
            $('#proveedor').append('<option value="0"> - Escoger Proveedor - </option>');            
            $.each(j,function(i,item) {
                $('#proveedor').append('<option value="'+item.idproveedor+'">'+item.razonsocial+'</option>');
            });
        });
    });
    
    $("#buscar").click(function(){
       cui = $('#cui').val();
       if (cui == 0){
           alert('Debe escoger un CUI');
           return;
       }
       proveedor = $('#proveedor').val();
       if (proveedor == 0){
           alert('Debe escoger un Proveedor');
           return;
       }       
       factura = $('#factura').val();
       fechaini = $('#fechaini').val();
       fechafin = $('#fechafin').val();
       //alert('Click:'+factura+", "+ fechaini+", "+fechafin); 
       loadGrid(cui, proveedor, factura, fechaini, fechafin);
    });

});

var leida = false;
function loadGrid(cui, proveedor, factura, fechaini, fechafin) {
    //alert('showDocumentos:'+cui+","+proveedor+","+factura+", "+ fechaini+", "+fechafin);
	var url = "/troyafacturas";
	var formatter = new Intl.NumberFormat();
	if (leida){
        $("#grid").setGridParam({ postData: {cui:cui, proveedor:proveedor, factura:factura, fechaini:fechaini, fechafin:fechafin} });
        $("#grid").jqGrid('setCaption', "Facturas").jqGrid('setGridParam', { url: url, page: 1}).jqGrid("setGridParam", {datatype: "json"}).trigger("reloadGrid");
	} else {
		showDocumentos(cui, proveedor, factura, fechaini, fechafin);
	}
}

function showDocumentos(cui, proveedor, factura, fechaini, fechafin) {
    
    // send the parent row primary key to the server so that we know which grid to show
    var childGridURL = "/troyafacturas";   
    $("#grid").jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        postData: {
            cui : function () {
                return cui;
            },
            proveedor : function () {
                return proveedor;
            },
            factura: function () {
                return factura;
            },            
            fechaini: function () {
                return fechaini;
            },
            fechafin: function () {
                return fechafin;
            }            
        },        
        colModel: [
                   { label: 'id',
                      name: 'id',
                      width: 50,
                      hidden:true
                   },
                   { label: 'Documento',
                     name: 'documento',  
                     search: false,
                     key: true, 
                     align: 'center',                 
                     width: 100
                   },        
                   { label: 'Fecha',
                     name: 'fechacontable',  
                     search: false,
                     align: 'center',                 
                     width: 70,
                     formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' }                   
                    },                                                     
                   { label: 'Tipo ',
                     name: 'tipodocumento',
                     search: false,
                     align: 'center',
                     width: 130
                   },
                   { label: 'Proveedor',
                     name: 'razonsocial',
                     width: 200,
                     search: false,
                     align: 'center'
                   },                  
                   { label: 'Monto',
                     name: 'montototal',
                     width: 100,
                     align: 'right',
                     search: false,
                     formatter: 'number', formatoptions: { decimalPlaces: 0 }
                   },
                   { label: 'Glosa Factura',
                     name: 'glosalinea',
                     width: 300,
                     search: false,
                     align: 'left'
                   }                                
        ],
		caption: "Facturas ",
 		height: 'auto',
        styleUI: "Bootstrap",         
        autowidth:false, 
        sortable: "true",
        pager: "#pager",
        jsonReader: {cell:""},
        rowNum: 10,  
        rowList: [5, 10, 20, 50],
        sortname: 'id',
        sortorder: 'asc',
        viewrecords: true,            
        regional : "es",
        loadComplete: function () {
            var $grid = $("#grid");
            var colSum = $grid.jqGrid('getCol', 'montototal', false, 'sum');
            $grid.jqGrid('footerData', 'set', { montototal: colSum });
        },               
        subGrid: true, // set the subGrid property to true to show expand buttons for each row
        footerrow: true,
        userDataOnFooter: true,         
        subGridRowExpanded: showDetalle // javascript function that will take care of showing the child grid                        
    });

    $("#grid").jqGrid('filterToolbar', {stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#grid").jqGrid('navGrid', "#pager", {
        search: false, // show search button on the toolbar
        add: false,
        edit: false,
        del: false,
        refresh: true
    });  

	leida = true;
}

function showDetalle(parentRowID, parentRowKey) {
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";

    // send the parent row primary key to the server so that we know which grid to show
    var childGridURL = "/troyadetalle/" + parentRowKey;

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
                   { label: 'CUI',
                     name: 'cuiseccion',
                     search: false,
                     width: 100,
                     align: 'left'
                   },
                   { label: 'Nombre CUI',
                     name: 'nombrecentrocosto',
                     width: 250,
                     search: false,
                     align: 'left'
                   },                    
                   { label: 'Cuenta',
                     name: 'cuentacontable',
                     width: 100,
                     search: false,
                     align: 'left'
                   },
                   { label: 'Nombre Cuenta',
                     name: 'nombrecuentaorigen',
                     width: 250,
                     search: false,
                     align: 'left'
                   },                   
                   { label: 'Monto',
                     name: 'monto',
                     width: 100,
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
       
}


