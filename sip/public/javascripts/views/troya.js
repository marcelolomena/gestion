
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
            $.each(j,function(i,item) {
                $('#proveedor').append('<option value="'+item.idproveedor+'">'+item.razonsocial+'</option>');
            });
        });
    });
    
    $("#buscar").click(function(){
       alert('Click'); 
       cui = $('#cui').val();
       proveedor = $('#proveedor').val();
       factura = $('#factura').val();
       fechaini = $('#fechaini').val();
       fechafin = $('#fechafin').val();
       showDocumentos(cui, proveedor, factura, fechaini, fechafin);
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

    $("#grid").jqGrid('filterToolbar', {cui:cui, proveedor:proveedor, factura:factura, fechaini:fechaini, fechafin:fechafin, stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#grid").jqGrid('navGrid', "#pager", {
        search: false, // show search button on the toolbar
        add: false,
        edit: false,
        del: false,
        refresh: true
    });  

	leida = true;
}

