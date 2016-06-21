
$(document).ready(function () {

    $.getJSON("/proveedores/combobox", function(j){
        $('#proveedor').append('<option value="0"> - Escoger Proveedor - </option>');            
        $.each(j,function(i,item) {
            $('#proveedor').append('<option value="'+item.id+'">'+item.razonsocial+'</option>');
        });
    }); 

    $("#proveedor").change(function(){
        idproveedor = $(this).val();
		var optionsPieIncident = {
			chart: {
				renderTo: 'container',
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie'
			}, title: {
				text: 'Facturas Proveedor por CUI'
			}, tooltip: {
				formatter: function () {
					return '<b>' + this.point.name + '</b>: ' + Highcharts.numberFormat(this.percentage, 2) + ' %';
				}
			}, plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					point: {
						events: {
							click: function (event) {
								loadGrid2(this.options.idcui, idproveedor);
							}
						}
					},
					dataLabels: {
						enabled: true,
						format: '<b>{point.idcui}</b>: {point.percentage:.1f} %',
						style: {
							color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
						},
						connectorColor: 'silver'
					}
				}
			}, series: []
		};
        
		$.ajax({
			url: '/graficotroyaproveedor/' + idproveedor,
			type: 'GET',
			success: function (data) {
				optionsPieIncident.series.push(data);
				var charPieDepa = new Highcharts.Chart(optionsPieIncident);
			},
			error: function (e) {

			}
		});     
        loadGrid(idproveedor);
    });
    

});

var leida = false;
function loadGrid(proveedor) {
    //alert('showDocumentos:'+cui+","+proveedor+","+factura+", "+ fechaini+", "+fechafin);
	var url = "/grillatroyaproveedor/"+proveedor;
	var formatter = new Intl.NumberFormat();
	if (leida){
        $("#grid").setGridParam({ postData: {page:1, rows:10} });
        $("#grid").jqGrid('setCaption', "Facturas Proveedor por CUI").jqGrid('setGridParam', { url: url, page: 1}).jqGrid("setGridParam", {datatype: "json"}).trigger("reloadGrid");
	} else {
		showDocumentos(proveedor);
	}
}

function showDocumentos(proveedor) {
    
    // send the parent row primary key to the server so that we know which grid to show
    var childGridURL = "/grillatroyaproveedor/"+proveedor;  
    $("#grid").jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        postData: {
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
                      hidden:true
                   },
                   { label: 'CUI',
                     name: 'cuiseccion',  
                     search: false,
                     key: true, 
                     align: 'left',                 
                     width: 50
                   },        
                   { label: 'Nombre CUI',
                     name: 'nombrecui',  
                     search: false,
                     align: 'left',                 
                     width: 200                   
                    },                                                     
                   { label: 'Cuenta ',
                     name: 'cuentacontable',
                     search: false,
                     align: 'left',
                     width: 80
                   },
                   { label: 'Nombre Cuenta',
                     name: 'nombrecuenta',
                     width: 200,
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
		caption: "Facturas Proveedor por CUI",
 		height: 'auto',
        styleUI: "Bootstrap",         
        autowidth:false, 
        sortable: "true",
        pager: "#pager",
        jsonReader: {cell:""},
        page: 1,
        rowNum: 10,  
        rowList: [5, 10, 20, 50],
        sortname: 'id',
        sortorder: 'asc',
        viewrecords: true,            
        regional : "es",
        loadComplete: function () {
            var $grid = $("#grid");
            var colSum = $grid.jqGrid('getCol', 'monto', false, 'sum');
            $grid.jqGrid('footerData', 'set', { monto: colSum });
        },               
        subGrid: false, 
        footerrow: true,
        userDataOnFooter: true                        
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

var leida2=false;

function loadGrid2(cui, proveedor) {
    //alert('showDocumentos:'+cui+","+proveedor+","+factura+", "+ fechaini+", "+fechafin);
	var url = "/grillafacturascuiproveedor";
	var formatter = new Intl.NumberFormat();
	if (leida2){
        $("#grid2").setGridParam({ postData: {cui:cui, proveedor:proveedor, page:1, rows:10} });
        $("#grid2").jqGrid('setCaption', "Facturas").jqGrid('setGridParam', { url: url, page: 1}).jqGrid("setGridParam", {datatype: "json"}).trigger("reloadGrid");
	} else {
		showDetalleCUI(cui, proveedor);
	}
}

function showDetalleCUI(cui, proveedor) {
    
    var childGridURL = "/grillafacturascuiproveedor";   
    $("#grid2").jqGrid({
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
		caption: "Facturas CUI/Proveedor",
 		height: 'auto',
        styleUI: "Bootstrap",         
        autowidth:false, 
        sortable: "true",
        pager: "#pager2",
        jsonReader: {cell:""},
        page: 1,
        rowNum: 10,  
        rowList: [5, 10, 20, 50],
        sortname: 'id',
        sortorder: 'asc',
        viewrecords: true,            
        regional : "es",
        loadComplete: function () {
            var $grid = $("#grid2");
            var colSum = $grid.jqGrid('getCol', 'montototal', false, 'sum');
            $grid.jqGrid('footerData', 'set', { montototal: colSum });
        },               
        subGrid: true, // set the subGrid property to true to show expand buttons for each row
        footerrow: true,
        userDataOnFooter: true,
        subGridRowExpanded: showDetalle          
    });

    $("#grid2").jqGrid('filterToolbar', {stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#grid2").jqGrid('navGrid', "#pager2", {
        search: false, // show search button on the toolbar
        add: false,
        edit: false,
        del: false,
        refresh: true
    });  

	leida2 = true;
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
