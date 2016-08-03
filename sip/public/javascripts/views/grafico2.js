$(document).ready(function () {

	$.getJSON("/sapgrafico", function (j) {
		//$('#sap option').remove();
		$.each(j, function (i, item) {
			$('#sap').append('<option value="' + item.id + '">' + item.sap +' '+ item.nombre+ '</option>');
		});
	});

    $("#sap").change(function () {
        idsap = $(this).val();

		var optionsPieIncident = {
			chart: {
				renderTo: 'container',
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie'
			}, title: {
				text: 'Presupuesto por SAP'
			}, tooltip: {
				formatter: function () {
					return '<b>' + this.point.name + '</b>: ' + Highcharts.numberFormat(this.percentage, 2) + ' %';
				}
			}, plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					point: {
						//events: {
						//	click: function (event) {
						//		loadGrid2(this.options.dId, this.options.name, this.options.y);
						//	}
						//}
					},
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f} %',
						style: {
							color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
						},
						connectorColor: 'silver'
					}
				}
			}, series: []
		};

		$.ajax({
			url: '/graficodatapres/' + idsap,
			type: 'GET',
			success: function (data) {
				optionsPieIncident.series.push(data);
				var charPieDepa = new Highcharts.Chart(optionsPieIncident);

			},
			error: function (e) {

			}
		});
		var optionsPieIncident2 = {
			chart: {
				renderTo: 'container2',
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie'
			}, title: {
				text: 'Pagado por SAP'
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
								loadGrid2(this.options.dId, this.options.name, this.options.y);
							}
						}
					},
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f} %',
						style: {
							color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
						},
						connectorColor: 'silver'
					}
				}
			}, series: []
		};

		$.ajax({
			url: '/graficodatareal/'+ idsap,
			type: 'GET',
			success: function (data) {
				optionsPieIncident2.series.push(data);
				var charPieDepa = new Highcharts.Chart(optionsPieIncident2);

			},
			error: function (e) {

			}
		});
		//showProyectoErogaciones(idsap);
		loadGrid(idsap);
		$("#grid2").jqGrid('setGridState', 'hidden');
		$("#grid2").jqGrid('setCaption', ' ');
		
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

function showProyectoErogaciones(parentID) {

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
                   { label: '# Tarea',
                     name: 'tarea',  
                     search: false,                 
                     width: 70
                   },                                      
                   { label: 'Nombre Tarea',
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
                   { label: 'Pagado',
                     name: 'realacumuladopesos',
                     width: 100,
                     align: 'right',
                     search: false,
                     formatter: 'number', formatoptions: { decimalPlaces: 0 }
                   },
                   { label: 'Saldo',
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
        loadComplete: function () {
            var $grid = $("#grid");
            var colSum = $grid.jqGrid('getCol', 'presupuestopesos', false, 'sum');
            var colSum2 = $grid.jqGrid('getCol', 'realacumuladopesos', false, 'sum');
            var colSum3 = $grid.jqGrid('getCol', 'saldopesos', false, 'sum');
            $grid.jqGrid('footerData', 'set', { presupuestopesos: colSum, realacumuladopesos: colSum2, saldopesos:colSum3});
        },               
        footerrow: true,
        userDataOnFooter: true,              
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
		$("#grid2").jqGrid('setCaption', "FACTURAS - "+parentNombre).jqGrid('setGridParam', { url: url, page: 1}).jqGrid("setGridParam", {datatype: "json"}).trigger("reloadGrid");		
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
                     sortable: false,
                   },
                   { label: 'Numero Factura',
                     name: 'factura',
                     align: 'center',
                     sortable: false,
                     width: 120,
                   },
                   { label: 'Fecha Contable',
                     name: 'fechagl',
                     search: false,
                     sortable: false,
                     width: 120,
                     formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' }
                   },
                   { label: 'Costo DIVOT',
                     name: 'montosum',
                     search: false,
                     sortable: false,
                     width: 140,
                     align: 'right',
                     formatter: 'number', formatoptions: { decimalPlaces: 0 }
                   }                                              
        ],
        viewrecords: true,
		caption: "FACTURAS - "+parentNombre,
        rowNum: 10,
 		height: 'auto',
        styleUI: "Bootstrap",         
        autowidth:false, 
        sortable: "true",  
        rowList: [5, 10, 20, 50],    
        regional : "es",
        loadComplete: function () {
            var $grid = $("#grid2");
            var colSum = $grid.jqGrid('getCol', 'montosum', false, 'sum');
            $grid.jqGrid('footerData', 'set', { montosum: colSum});
        },               
        footerrow: true,
        userDataOnFooter: true,             
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
	
	leida2 = true;
}