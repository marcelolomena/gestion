
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
       cui = $('#cui').val();
       proveedor = $('#proveedor').val();
       factura = $('#factura').val();
       fechaini = $('#fechaini').val();
       fechafin = $('#fechafin').val();
       //alert('Click:'+factura+", "+ fechaini+", "+fechafin); 
       loadGrid(cui, proveedor, factura, fechaini, fechafin);
    });

});

var leida = false;
function loadGrid(cui, proveedor, factura, fechaini, fechafin) {
    alert('showDocumentos:'+cui+","+proveedor+","+factura+", "+ fechaini+", "+fechafin);
	var url = "/troyafacturas";
	var formatter = new Intl.NumberFormat();
	if (leida){
        //$('#grid').jqGrid("clearGridData");
        //$('#grid').jqGrid('GridDestroy');
        //$('#grid').jqGrid('GridUnload');
        //$.jgrid.gridUnload('#grid'); 
        //$('#grid').remove();
        //$('#container').empty();
        $("#grid").jqGrid('GridUnload');
        showDocumentos(cui, proveedor, factura, fechaini, fechafin);
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
        page: 1,
        colModel: [
                   { label: 'id',
                      name: 'id',
                      width: 50,
                      key: true, 
                      hidden:true
                   },
                   { label: 'Documento',
                     name: 'documento',  
                     search: false,
                     align: 'center',                 
                     width: 100
                   },        
                   { label: 'Fecha',
                     name: 'fechacontable',  
                     search: false,
                     align: 'center',                 
                     width: 70,
                     formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' }                   },                                                     
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
                     name: 'monto',
                     width: 100,
                     align: 'right',
                     search: false,
                     formatter: 'number', formatoptions: { decimalPlaces: 0 }
                   },
                   { label: 'Departamento',
                     name: 'depto',
                     width: 200,
                     search: false,
                     align: 'center'
                   },   
                   { label: 'Gerencia',
                     name: 'gerencia',
                     width: 100,
                     search: false,
                     align: 'center'
                   }                                
        ],
        viewrecords: true,
		caption: "Facturas ",
        rowNum: 10,
 		height: 'auto',
        styleUI: "Bootstrap",         
        autowidth:false, 
        sortable: "true",  
        rowList: [5, 10, 20, 50],    
        regional : "es",
        pager: "#pager"
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

