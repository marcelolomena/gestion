
$(document).ready(function () {

    var options = {
        chart: { renderTo: 'container',type: 'bar'  },
        title: {  text: ''  },
        subtitle: {  text: 'Fuente: Sistema de Licencias LIC' },
        xAxis: {
            categories: [],
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: { text: 'Cantidad',  align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' '
        },
        plotOptions: {
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        allowOverlap: true
                    }
                }
            },
            bar: {
                pointPadding: 0.1,
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    crop: false,
                    overflow: 'none',
                    formatter: function () {
                        if (this.y != 0) {
                            return Highcharts.numberFormat(this.y, 0);
                        } else {
                            return null;
                        }
                    },
                    style: {
                        fontSize: '10px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                },
				allowPointSelect: true,
				events: {
					click: function (event) {
						loadGrid(this.name, event.point.category);
					}
				}					
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: 0,
            y: 0,
            floating: true,
            borderWidth: 1,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: []
    };
//////////////////////////////////

    var serie1_1 = {};
    var serie2_1 = {};
    var categorias_1 = [];
    var serie1_1ArrayData = [];
    var serie2_1ArrayData = [];
	var serie3_1ArrayData = [];

    $.ajax({
        url: '/lic/vencimientos',
        success: function (item) {

			serie1_1ArrayData.push(item[0].x);
			serie2_1ArrayData.push(item[0].y);
			serie3_1ArrayData.push(item[0].k);
			categorias_1.push('PC');

			serie1_1ArrayData.push(item[0].xx);
			serie2_1ArrayData.push(item[0].yy);
			serie3_1ArrayData.push(item[0].kk);
			categorias_1.push('Servidor');
			
            serie1_1 = { name: '30 dias', data: serie1_1ArrayData , color: '#F51616'};
            serie2_1 = { name: '60 dias', data: serie2_1ArrayData , color: '#FFFF00'};
			serie3_1 = { name: '90 dias', data: serie3_1ArrayData , color: '#009900'};

            options.series[0] = serie1_1;
            options.series[1] = serie2_1;
			options.series[2] = serie3_1;
            options.xAxis.categories = categorias_1;
            options.xAxis.labels = {
                style: {
                    color: '#525151',
                    font: '10px Helvetica',
                    fontWeight: 'bold'
                },
                formatter: function () {
                    return this.value;
                }
            };
            options.chart.renderTo = 'container';
            options.title.text = 'Vencimientos de Licencias';
            var chart1 = new Highcharts.Chart(options);
            if (chart1.series[0].data.length > 0) {
                var baseHeight = 250;
                var extraHeightPerThing = 25;
                chart1.setSize(null, baseHeight + chart1.series[0].data.length * extraHeightPerThing);
            }
        }
    });


});


var leida = false;
function loadGrid(dias, tipo) {
    var url = "/lic/tablavencimiento/" + dias+"/"+tipo;
    var formatter = new Intl.NumberFormat();
    if (leida) {
        $("#grid").setGridParam({ postData: { page: 1, rows: 10 } });
        $("#grid").jqGrid('setCaption', "Productos "+tipo+" con Vencimiento "+dias).jqGrid('setGridParam', { url: url, page: 1 }).jqGrid("setGridParam", { datatype: "json" }).trigger("reloadGrid");
    } else {
        showDocumentos(dias, tipo);
    }
}

function showDocumentos(dias, tipo) {

    var viewModel = [{
        label: 'ID',
        name: 'id',
        key: true,
        hidden: true,
        editable: false
    },
    {
        label: 'Producto',
        name: 'nombre',
        jsonmap: 'nombre',
        align: 'left',
        width: 300,
        editable: true,
        editoptions: {
            fullRow: true,
            readonly: 'readonly'
        },
        editrules: {
            required: false,
            edithidden: false
        },
        search: true
    },	
    {
        label: 'Estado',
        name: 'alertarenovacion',
        width: 90,
        align: 'center',
        editable: true,
        search: false,
        formatter: function (cellvalue, options, rowObject) {
            var rojo = '<span><img src="../../../../images/redcircle.png" width="19px"/></span>';
            var amarillo = '<span><img src="../../../../images/yellowcircle.png" width="19px"/></span>';
            var verde = '<span><img src="../../../../images/greencircle.png" width="19px"/></span>';
            var gris = '<span><img src="../../../../images/greycircle.png" width="19px"/></span>';
            if(rowObject.alertarenovacion === 'aGris'){
                return gris;
            }else{
                if (rowObject.alertarenovacion === 'Vencida') {
                    return rojo;
                } else {
                    if (rowObject.alertarenovacion === 'Renovar') {
                        return amarillo;
                    } else {
                        if (rowObject.alertarenovacion === 'bAl Dia')
                        
                        
                        return verde;
                    }
                }    
            }   
        }         
    },
    {
        label: 'Compradas',
        name: 'licstock',
        align: 'center',
        width: 80,
        editable: true,
        search: false,
        editoptions: {
            fullRow: true,
            readonly: 'readonly'
        }        
    },    
    {
        label: 'Instaladas',
        name: 'licocupadas',
        width: 80,
        align: 'center',
        sortable: false,
        editable: true,
        editoptions: {
            fullRow: true,
            readonly: 'readonly'
        },        
        search: false
    },
    {
        label: 'Fecha Compra',
        name: 'fechacompra',
        width: 100,
        hidden: false,
        editable: true,
        edittype: 'textarea',
        search: false,
		formatter: function (cellvalue, options, rowObject) {
			var val = rowObject.fechacompra;
			if (val != null) {
				val = val.substring(0,10);
				var fechaok = val.substring(8)+'-'+val.substring(5,7)+'-'+val.substring(0,4);
				return fechaok;
			} else {
				return '';
			}
		}		
    },
	{
        label: 'Fecha Renovaci�n',
        name: 'fecharenovasoporte',
        width: 100,
        hidden: false,
        editable: true,
        edittype: 'textarea',
        search: false,
		formatter: function (cellvalue, options, rowObject) {
			var val = rowObject.fecharenovasoporte;
			if (val != null) {
				val = val.substring(0,10);
				var fechaok = val.substring(8)+'-'+val.substring(5,7)+'-'+val.substring(0,4);
				return fechaok;
			} else {
				return '';
			}
		}		
    },
    {
        label: 'Fecha Expiraci�n',
        name: 'fechaexpiracion',
        width: 100,
        hidden: false,
        editable: false,
        search: false,
		formatter: function (cellvalue, options, rowObject) {
			var val = rowObject.fechaexpiracion;
			if (val != null) {
				val = val.substring(0,10);
				var fechaok = val.substring(8)+'-'+val.substring(5,7)+'-'+val.substring(0,4);
				return fechaok;
			} else {
				return '';
			}
		}		
    },	
    {
        label: 'Proveedor',
        name: 'razonsocial',
        width: 200,
        hidden: false,
        editable: false,
        search: false
    },
    {
        label: 'Orden Compra',
        name: 'ordencompra',
        width: 100,
        hidden: false,
        editable: false,
        search: false
    },
    {
        label: 'Contrato',
        name: 'contrato',
        width: 100,
        hidden: false,
        editable: false,
        search: false
    }		
];
    $("#grid").jqGrid({
        url: "/lic/tablavencimiento/" + dias+"/"+tipo,
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: viewModel,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        sortable: "true",
        width: null,
        shrinkToFit: false,
        caption: 'Vencimiento de Productos '+dias,
        pager: "#pager",
        viewrecords: true,
        rowList: [10, 20, 30, 40, 50],
        styleUI: "Bootstrap",
        editurl: '/lic/tablavencimiento/',
        subGrid: false // set the subGrid property to true to show expand buttons for each row
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

