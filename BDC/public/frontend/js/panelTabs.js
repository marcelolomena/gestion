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
            { label: 'id', name: 'program_id', width: 50, key: true, hidden:true },
            { label: 'Programa', name: 'program_name', width: 350,formatter: returnProgramLink },
            { label: 'Estado', name: 'work_flow_status', jsonmap: 'work_flow_status', width: 250,
                		    stype: 'select',
                			searchoptions: {
                				dataUrl: '/list-all-workflowstatus',
                				buildSelect: function (response) {
                					var data = JSON.parse(response);
                					var s = "<select>";
                					s += '<option value="0">--Escoger Estado--</option>';
                					$.each(data, function(i, item) {
                						s += '<option value="' + data[i].value + '">' + data[i].name + '</option>';
                					});
                					return s + "</select>";
                				}
                		    },
            },
            { label: 'Tipo', name: 'program_type', jsonmap: 'program_type', width: 250,
                		    stype: 'select',
                			searchoptions: {
                				dataUrl: '/list-all-programtype',
                				buildSelect: function (response) {
                					var data = JSON.parse(response);
                					var s = "<select>";
                					s += '<option value="0">--Escoger Tipo--</option>';
                					$.each(data, function(i, item) {
                						s += '<option value="' + data[i].value + '">' + data[i].name + '</option>';
                					});
                					return s + "</select>";
                				}
                		    },
            },
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
            { label: 'Responsable', name: 'uid', jsonmap: 'nombre_lider', width: 200,
                                 		    stype: 'select',
                                 			searchoptions: {
                                 				dataUrl: '/list-all-user-active',
                                 				buildSelect: function (response) {
                                 					var data = JSON.parse(response);
                                 					var s = "<select>";
                                 					s += '<option value="0">--Escoger Responsable--</option>';
                                 					$.each(data, function(i, item) {
                                 						s += '<option value="' + data[i].codDivision + '">' + data[i].glosaDivision + '</option>';
                                 					});
                                 					return s + "</select>";
                                 				}
                                 		    },
            },
            { label: 'Fecha Inicio', name: 'plan_start_date',width: 180,
                searchoptions:{
                    dataInit:function(el){
                        $(el).datepicker({
                            dateFormat:'yy-mm-dd',
                            changeYear: true,
                            changeMonth: true,
                            onSelect: function (dateText, inst) {
                                setTimeout(function () {
                                    $('#jqGrid')[0].triggerToolbar();
                                }, 100);
                            }
                        });
                    },
                    sopt: ["le","ge"]
                },
            },
            { label: 'Fecha Comprometida',   name: 'plan_end_date', width: 180,
                searchoptions:{
                    dataInit:function(el){
                        $(el).datepicker({
                            dateFormat:'yy-mm-dd',
                            changeYear: true,
                            changeMonth: true,
                            onSelect: function (dateText, inst) {
                                setTimeout(function () {
                                    $('#jqGrid')[0].triggerToolbar();
                                }, 100);
                            }
                        });
                    },
                    sopt: ["le","ge"]
                },
            },
            { label: '% Avance', name: 'pai', width: 150,
                searchoptions:{
                    sopt: ["ge","le","eq"]
                }
            },
            { label: '% Plan', name: 'pae', width: 150,
                searchoptions:{
                    sopt: ["ge","le","eq"]
                }

            },
            { label: 'SPI', name: 'spi', width: 150,
                searchoptions:{
                    sopt: ["ge","le","eq"]
                },
                formatter: 'number', formatoptions: { decimalPlaces: 2 }

            },
            { label: 'CPI', name: 'cpi', width: 150,
                searchoptions:{
                    sopt: ["ge","le","eq"]
                },
                formatter: 'number', formatoptions: { decimalPlaces: 2 }
            }
        ];

	var modelSubGrid=[
            { label: 'id', name: 'project_id', key: true, hidden:true },
            { label: 'Programa', name: 'project_name', width: 350,formatter: returnProgramLink },
            { label: 'Fecha Inicio', name: 'plan_start_date',width: 180,
                searchoptions:{
                    dataInit:function(el){
                        $(el).datepicker({
                            dateFormat:'yy-mm-dd',
                            changeYear: true,
                            changeMonth: true
                        });
                    },
                    sopt: ["le","ge"]
                },
            },
            { label: 'Fecha Comprometida',   name: 'plan_end_date', width: 180,
                searchoptions:{
                    dataInit:function(el){
                        $(el).datepicker({
                            dateFormat:'yy-mm-dd',
                            changeYear: true,
                            changeMonth: true
                        });
                    },
                    sopt: ["le","ge"]
                },
            },
            { label: '% Avance', name: 'pai', width: 150,
                searchoptions:{
                    sopt: ["ge","le","eq"]
                }
            },
            { label: '% Plan', name: 'pae', width: 150,
                searchoptions:{
                    sopt: ["ge","le","eq"]
                }

            },
            { label: 'SPI', name: 'spi', width: 150,
                searchoptions:{
                    sopt: ["ge","le","eq"]
                }

            },
            { label: 'CPI', name: 'cpi', width: 150,
                searchoptions:{
                    sopt: ["ge","le","eq"]
                }

            }
        ];

	function showSubGrid(parentRowID, parentRowKey) {
	    var childGridID = parentRowID + "_table";
	    var childGridPagerID = parentRowID + "_pager";
	    var childGridURL = "/listStatus/" + parentRowKey;

	    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

	    $("#" + childGridID).jqGrid({
	        url: childGridURL,
	        mtype: "GET",
	        datatype: "json",
	        colModel: modelSubGrid,
			height: 'auto',
	        //autowidth:true,
	        regional : "es",
			viewrecords: true,
	        pager: "#" + childGridPagerID
	    });

	    //$("#" + childGridID).jqGrid('navGrid',"#" + childGridPagerID,{add:false,edit:false,del:false,search: false,refresh:false});
	}


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
        //console.log("tourl ---> : " + tourl)
        var name = "Programas"
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
		        //width: 950,
		        rowNum: 25,
		        shrinkToFit:false,
                forceFit:true,
		        pager: "#jqGridPager",
		        subGrid: true,
                subGridRowExpanded: showSubGrid,
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

