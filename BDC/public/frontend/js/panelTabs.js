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
	

	var modelPie=[
            { label: 'pId', name: 'program_id', width: 50, key: true, hidden:true },  
            { label: 'Programa', name: 'programa', width: 250,formatter: returnProgramLink },
            { label: 'Responsable', name: 'responsable', width: 200 },
            { label: 'Fecha Inicio', name: 'fecini',width: 180,formatter: 'date',formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' } },
            { label: 'Fecha Comprometida',   name: 'feccom', width: 180, formatter: 'date', formatoptions: { srcformat: 'Y-m-d',newformat: 'Y-m-d' } },
            { label: '% Avance', name: 'pai', width: 150 },
            { label: '% Plan', name: 'pae', width: 150 },
            { label: 'SPI', name: 'spi', width: 150 },
            { label: 'CPI', name: 'cpi', width: 150 },
            { label: 'Inversión', name: 'inversion', width: 150 },  
            { label: 'Gasto', name: 'gasto', width: 150 }                      
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
        var url = ui.ajaxSettings.url;
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
			     var chuurl="/incidentList";
				 $("#jqGridIncident").jqGrid('setCaption', name).jqGrid('setGridParam', { url: chuurl, page: 1}).jqGrid("setGridParam", {datatype: "json"}).trigger("reloadGrid");

        });

        return false;

        ui.jqXHR.fail(function() {
          ui.panel.html(
            "Couldn't load this tab. We'll try to fix this as soon as possible." );
        });
      }
    });


});

