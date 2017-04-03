
$(document).ready(function () {

    $('#fechaini').datepicker({
        format: "dd/mm/yyyy"
    }); 
    
    $('#fechafin').datepicker({
        format: "dd/mm/yyyy"
    });      
   
    $.ajax({ 
        url: "/funciones", 
        dataType: 'json', 
        async: false, 
        success: function(j){ 
            $.each(j,function(i,item) {
                $('#funcionalidad').append('<option value="' + item.id + '">' + item.nombre +'</option>');
            });
        } 
    });    
    
    $.ajax({ 
        url: "/consultalog/usuarios", 
        dataType: 'json', 
        async: false, 
        success: function(j){ 
            $.each(j,function(i,item) {
                $('#usuario').append('<option value="' + item.id + '">' + item.nombre +'</option>');
            });
        } 
    });    

    $("#funcionalidad").change(function(){
        funcion = $(this).val();
        $.getJSON("/transaccioneslog/"+funcion, function(j){
            $('#transaccion option').remove();
            $('#transaccion').append('<option value="0"> - Escoger Transacción - </option>');            
            $.each(j,function(i,item) {
                $('#transaccion').append('<option value="'+item.id+'">'+item.nombre+'</option>');
            });
        });
    });
    
    $("#buscar").click(function(){
       funcion = $('#funcionalidad').val();
       if (funcion == 0){
           alert('Debe escoger un Funcionalidad');
           return;
       }
       transaccion = $('#transaccion').val();
       /*if (transaccion == 0){
           alert('Debe escoger un Transacción');
           return;
       }   */    
       usuario = $('#usuario').val();
       fechaini = $('#fechaini').val();
       fechafin = $('#fechafin').val();
       idregistro = $('#idregistro').val();
       //alert('Click:'+factura+", "+ fechaini+", "+fechafin); 
       loadGrid(funcion, transaccion, usuario, fechaini, fechafin, idregistro);
    });

});

var leida = false;
var proveedorx;
function loadGrid(funcion, transaccion, usuario, fechaini, fechafin, idregistro) {
    //alert('showDocumentos:'+cui+","+proveedor+","+factura+", "+ fechaini+", "+fechafin);
    //proveedorx = proveedor;
	var url = "/consultalog/list";
	var formatter = new Intl.NumberFormat();
	if (leida){
        $("#grid").setGridParam({ postData: {funcion:funcion, transaccion:transaccion, usuario:usuario, fechaini:fechaini, fechafin:fechafin, idregistro:idregistro, page:1, rows:10} });
        $("#grid").jqGrid('setCaption', "Log Transacciones").jqGrid('setGridParam', { url: url, page: 1}).jqGrid("setGridParam", {datatype: "json"}).trigger("reloadGrid");
	} else {
		showDocumentos(funcion, transaccion, usuario, fechaini, fechafin, idregistro);
	}
}

function showDocumentos(funcion, transaccion, usuario, fechaini, fechafin, idregistro) {
    
    // send the parent row primary key to the server so that we know which grid to show
    var childGridURL = "/consultalog/list";   
    $("#grid").jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        postData: {
            funcion : function () {
                return funcion;
            },
            transaccion : function () {
                return transaccion;
            },
            usuario: function () {
                return usuario;
            },            
            fechaini: function () {
                return fechaini;
            },
            fechafin: function () {
                return fechafin;
            },
            idregistro: function () {
                return idregistro;
            },            
            page: function () {
                return 1;
            },
            rows: function () {
                return 10;
            }                                          
        },        
        colModel: [
                   { label: 'id',
                      name: 'id',
                      width: 50,
                      key: true,                       
                      hidden:true
                   },
                   { label: 'Funcionalidad',
                     name: 'funcionalidad',  
                     search: false,
                     align: 'left',                 
                     width: 150
                   },        
                   { label: 'Transacción ',
                     name: 'transaccion',
                     search: false,
                     align: 'left',
                     width: 150
                   },                   
                   { label: 'Fecha',
                     name: 'fecha',  
                     search: false,
                     align: 'center',                 
                     width: 150,
                     formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y H:i:s' }                   
                    },                                                     
                   { label: 'Usuario',
                     name: 'uname',
                     width: 100,
                     search: false,
                     align: 'center',
                   },                  
                   { label: 'ID Registro',
                     name: 'idregistro',
                     width: 100,
                     search: false,
                     align: 'left'
                   }                                          
        ],
		caption: "Log Transacciones ",
 		height: 'auto',
        styleUI: "Bootstrap",         
        autowidth:true, 
        sortable: "true",
        pager: "#pager",
        jsonReader: {cell:""},
        rowNum: 10,  
        rowList: [5, 10, 20, 50],
        sortname: 'id',
        sortorder: 'asc',
        viewrecords: true,            
        regional : "es",             
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
    
    $('#grid').jqGrid('navButtonAdd', '#pager', {
        caption: "",
        buttonicon: "glyphicon glyphicon-download-alt",
        title: "Excel",
        //position: "last",
        onClickButton: function () {
            var grid = $('#grid');
            var rowKey = grid.getGridParam("selrow");
            var url = '/consultalog/excel';
            /*+$('#funcionalidad').val()+
            "/"+$('#transaccion').val()+"/"+$('#usuario').val()+
            "/"+$('#fechaini').val()+"/"+$('#fechafin').val()+
            "/"+$('#idregistro').val();*/
            $('#grid').jqGrid('excelExport', { "url": url });
        }
    });
    

	leida = true;
}

function showDetalle(parentRowID, parentRowKey) {
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    //console.log("*********  Proveedor:"+proveedorx);
    // send the parent row primary key to the server so that we know which grid to show
    var childGridURL = "/consultalog/detalle/" + parentRowKey;

    // add a table and pager HTML elements to the parent grid row - we will render the child grid here
    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        page: 1,
        postData: {
            proveedor : function () {
                return proveedorx;
            }                                    
        },             
        colModel: [                              
                   { label: 'Nombre',
                     name: 'nombre',
                     search: false,
                     width: 100,
                     align: 'left'
                   },
                   { label: 'Datos',
                     name: 'data',
                     width: 250,
                     search: false,
                     align: 'left'
                   }
        ],
        viewrecords: true,
        styleUI: "Bootstrap", 
        regional: 'es',
        sortable: "true",
        rowNum: 10,
 		height: 'auto',  
        rowList: [5, 10, 20, 50],
        autowidth:true,       
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


