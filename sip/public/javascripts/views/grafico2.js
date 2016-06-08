$(document).ready(function () {

	$.getJSON("/sapgrafico", function (j) {
		//$('#sap option').remove();
		$.each(j, function (i, item) {
			$('#sap').append('<option value="' + item.id + '">' + item.nombre + '</option>');
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
				text: 'Presupuesto Erogaciones por SAP'
			}, tooltip: {
				formatter: function () {
					return '<b>' + this.point.name + '</b>: ' + Highcharts.numberFormat(this.point.y, 0);
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
				text: 'REAL Erogaciones por SAP'
			}, tooltip: {
				formatter: function () {
					return '<b>' + this.point.name + '</b>: ' + Highcharts.numberFormat(this.percentage, 2) + ' %';
				}
			}, plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					point: {
					//	events: {
					//		click: function (event) {
					//			loadGrid2(this.options.dId, this.options.name, this.options.y);
					//		}
					//	}
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
		showProyectoErogaciones(idsap);
	});
	
});

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