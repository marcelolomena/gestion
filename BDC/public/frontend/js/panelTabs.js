function returnProgramLink(cellValue, options, rowdata, action)
{
    return "<a href='/program-details/" + options.rowId + "' >" + cellValue +"</a>";
}

$(document).ready(function(){
	$.datepicker.setDefaults($.datepicker.regional['es']);

	Highcharts.setOptions({  
        lang: {  
        loading: 'Cargando...',  
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],  
        weekdays: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'],  
        shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],  
        exportButtonTitle: "Exportar",  
        printButtonTitle: "Importar",  
        rangeSelectorFrom: "De",  
        rangeSelectorTo: "A",  
        rangeSelectorZoom: "Periodo",  
        downloadPNG: 'Descargar gráfica PNG',  
        downloadJPEG: 'Descargar gráfica JPEG',  
        downloadPDF: 'Descargar gráfica PDF',  
        downloadSVG: 'Descargar gráfica SVG',  
        printChart: 'Imprimir Gráfica',  
        thousandsSep: ",",  
        decimalPoint: '.'  
    }   
	});
	

	var modelGrid=[
            { label: 'pId', name: 'program_id', width: 50, key: true, hidden:true },  
            { label: 'Programa', name: 'program_name', width: 350,formatter: returnProgramLink },
            { label: 'División', name: 'cod_div', jsonmap: 'name_div', width: 250,
                		    stype: 'select',
                			searchoptions: {
                				dataUrl: '/list-all-divisions',
                				buildSelect: function (response) {
                					var data = JSON.parse(response);
                					var s = "<select>";
                					s += '<option value="0">--Escoger División--</option>';
                					$.each(data, function(i, item) {
                						s += '<option value="' + data[i].codDivision + '">' + data[i].glosaDivision + '</option>';
                					});
                					return s + "</select>";
                				}
                		    },
            },
            { label: 'Gerencia', name: 'cod_man', jsonmap: 'name_man', width: 250,
                         		    stype: 'select',
                         			searchoptions: {
                         				dataUrl: '/list-all-manager',
                         				buildSelect: function (response) {
                         					var data = JSON.parse(response);
                         					var s = "<select>";
                         					s += '<option value="0">--Escoger Gerencia--</option>';
                         					$.each(data, function(i, item) {
                         						s += '<option value="' + data[i].codDivision + '">' + data[i].glosaDivision + '</option>';
                         					});
                         					return s + "</select>";
                         				}
                         		    },
            },
            { label: 'Departamento', name: 'cod_dep', jsonmap: 'name_dep', width: 350,
                         		    stype: 'select',
                         			searchoptions: {
                         				dataUrl: '/list-all-departament',
                         				buildSelect: function (response) {
                         					var data = JSON.parse(response);
                         					var s = "<select>";
                         					s += '<option value="0">--Escoger Departamento--</option>';
                         					$.each(data, function(i, item) {
                         						s += '<option value="' + data[i].codDivision + '">' + data[i].glosaDivision + '</option>';
                         					});
                         					return s + "</select>";
                         				}
                         		    },
            },
            { label: 'Responsable', name: 'nombre_lider', width: 200 },
            { label: 'Fecha Inicio', name: 'plan_start_date',width: 180 },
            { label: 'Fecha Comprometida',   name: 'plan_end_date', width: 180 },
            { label: '% Avance', name: 'pai', width: 150 },
            { label: '% Plan', name: 'pae', width: 150 },
            { label: 'SPI', name: 'spi', width: 150 },
            { label: 'CPI', name: 'cpi', width: 150 }
        ];




	var optionsPie ={
			chart: {
				renderTo: 'containerChart',
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            type: 'pie'
	        },title: {
	            text: 'Programas por División'
	        },tooltip: {
	        	formatter: function() {
	        	    return '<b>'+ this.point.name + '</b>: ' + Highcharts.numberFormat(this.percentage, 2) +' %';
	        	}	        	
	        },plotOptions: {
	            pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                point: {
	                    events: {
	                       click: function(event) {
	                    	   grillaPrograma(this.options.dId,this.options.name);
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
	        },series: []			
	};	
	


    $("#tabs").tabs({
      beforeLoad: function( event, ui ) {
        var tourl = ui.ajaxSettings.url;
        /*
        $.getJSON(url, function (data) {
                 charPie.update({
                     title: {
                         text:  data.titulo
                     },
                     plotOptions: {
                        pie: {
                            point: {
                                events: {
                                    click: function(event) {
                                        //gridIncident("department",this.options.dId,this.options.name);
                                    }
                                }
                            }
                        }
                    },
                    series:data
                 });
				 //Limpia grilla

        });
        */
        console.log("tourl ---> : " + tourl)
        var name = "lolo"
		var grid =	$("#jqGrid").jqGrid({
		        mtype: "GET",
		        url: tourl,
		        datatype: "json",
		        page: 1,
		        colModel: modelGrid,
				viewrecords: true,
				regional : "es",
				height: 'auto',
		        autowidth:true,
		        rowNum: 20,
		        pager: "#jqGridPager",
		        ignoreCase: true
		    }).jqGrid('filterToolbar', {stringResult: true,searchOperators: true, searchOnEnter: false, defaultSearch: 'cn'});

        grid.jqGrid('setCaption', name).jqGrid('setGridParam', { url: tourl, page: 1}).jqGrid("setGridParam", {datatype: "json"}).trigger("reloadGrid");

        return false;

        ui.jqXHR.fail(function() {
          ui.panel.html(
            "Couldn't load this tab. We'll try to fix this as soon as possible." );
        });
      }
    });


});

