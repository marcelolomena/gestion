function returnProgramLink(cellValue, options, rowdata, action)
{
    return "<a href='/program-details/" + options.rowId + "' >" + cellValue +"</a>";
}

function returnProjectLink(cellValue, options, rowdata, action)
{
    return "<a href='/project-details/" + rowdata.project_id + "' >" + cellValue +"</a>";
}
function returnTaskLink(cellValue, options, rowdata, action)
{
    return "<a href='/project-task-details/" + rowdata.task_id + "' >" + cellValue +"</a>";
}
function returnSubTaskLink(cellValue, options, rowdata, action)
{
    return "<a href='/sub-task-details/" + options.rowId + "' >" + cellValue +"</a>";
}
function returnUserLink(cellValue, options, rowdata, action)
{
    return "<a href='/employee/" + options.rowId + "' >" + cellValue +"</a>";
}

function findWithColor() {
    var filters, i, l, rules, rule, iCol, $this = $(this);
    if (this.p.search === true) {
        filters = $.parseJSON(this.p.postData.filters);
        if (filters !== null && typeof filters.rules !== 'undefined' &&
                filters.rules.length > 0) {
            rules = filters.rules;
            l = rules.length;
            for (i = 0; i < l; i++) {
                rule = rules[i];
                iCol = getColumnIndexByName($this, rule.field);
                if (iCol >=0) {
                    $('>tbody>tr.jqgrow>td:nth-child(' + (iCol + 1) +
                        ')', this).highlight(rule.data);
                }
            }
        }
    }
    return;
}


function showThirdLevelChildGrid(parentRowID, parentRowKey) {
    var childGridID = parentRowID + "_table";
    
    var childGridPagerID = parentRowID + "_pager";

    var childGridURL = "/reportSubTarea/" + parentRowKey;

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: [
                   { label: 'Codigo',
                      name: 'codigo',
                      width: 100,
                      key: true,
                      hidden:true
                   },                   
                   { label: 'Nivel',
                     name: 'nivel',
                     width: 100,
                   },
                   { label: 'Nombre', name: 'programa', width: 250,formatter: returnSubTaskLink },
                   { label: 'Responsable', name: 'responsable', width: 150 },
                   { label: 'Fecha Inicio Planeada',
                     name: 'pfecini',
                     width: 120,
                     formatter: 'date',
                     formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
                   },
                   { label: 'Fecha Termino Planeada',
                     name: 'pfecter',
                     width: 120,
                     sorttype:'date',
                     formatter: 'date',
                     formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
                     
                   },
                   { label: 'Fecha Inicio Real',
                     name: 'rfecini',
                     width: 120,
                     sorttype:'date',
                     formatter: 'date',
                     formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
                     
                   },
                   { label: 'Fecha Termino Real',
                     name: 'rfecter',
                     width: 120,
                     sorttype:'date',
                     formatter: 'date',
                     formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
                     
                   },
                   { label: 'Porcentaje Avance Informado', name: 'pai', width: 100 },
                   { label: 'Porcentaje Avance Esperado', name: 'pae', width: 100 }              
        ],
        rowNum: 10,
 		height: 'auto',
        autowidth:true,       
        regional : "es",
        pager: "#" + childGridPagerID
    });
}

function showChildGrid(parentRowID, parentRowKey) {
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    var childGridURL = "/reportProyect/" + parentRowKey;

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: [
                   { label: 'Codigo',
                      name: 'codigo',
                      width: 100,
                      key: true,
                      hidden:true
                   },                   
                   { label: 'Nivel',
                     name: 'nivel',
                     width: 100,
                   },
                   { label: 'Nombre', name: 'programa', width: 250,formatter: returnProjectLink },
                   { label: 'Responsable', name: 'responsable', width: 150 },
                   { label: 'Fecha Inicio Planeada',
                     name: 'pfecini',
                     width: 120,
                     formatter: 'date',
                     formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
                   },
                   { label: 'Fecha Termino Planeada',
                     name: 'pfecter',
                     width: 120,
                     sorttype:'date',
                     formatter: 'date',
                     formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
                     
                   },
                   { label: 'Fecha Inicio Real',
                     name: 'rfecini',
                     width: 120,
                     sorttype:'date',
                     formatter: 'date',
                     formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
                     
                   },
                   { label: 'Fecha Termino Real',
                     name: 'rfecter',
                     width: 120,
                     sorttype:'date',
                     formatter: 'date',
                     formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
                     
                   },
                   { label: 'Porcentaje Avance Informado', name: 'pai', width: 100},
                   { label: 'Porcentaje Avance Esperado', name: 'pae', width: 100 }              
        ],
        rowNum: 20,
		height: 'auto',
        autowidth:true,
        subGrid: true, 
        subGridRowExpanded: showThirdLevelChildGrid, 
        regional : "es",
        pager: "#" + childGridPagerID
    });
	
    $("#" + childGridID).jqGrid('navGrid',"#" + childGridPagerID,{add:false,edit:false,del:false,search: false,refresh:false});

	$("#" + childGridID).jqGrid('navButtonAdd',"#" + childGridPagerID,{
	       caption:"",
	       buttonicon : "silk-icon-chart-bar",
	       title: "Gráfico Avance", 
	       onClickButton : function () { 
	    	   var grid = $("#" + childGridID);
	           var rowKey = grid.getGridParam("selrow");
	           if(rowKey === null && typeof rowKey === "object"){
		           alert('debe seleccionar un proyecto');
	           }else{

		           var curl = 'getPyChart/' + rowKey;

		           $.ajax({
						  url: curl,
						  type: 'GET',
						  success: function(data) {
							  var largo=data.length;
								if(largo>0){
							  	var items6 = [];
							  	var items7 = [];
								$.each(data, function(index, element) {
									var d = new Date(parseInt(element.fecha));
									items6.push([Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()),parseFloat(element.ecpi)]);
									items7.push([Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()),parseFloat(element.espi)]);
							    });	
								var now = new Date;
								var chart = new Highcharts.Chart({
									chart : {
										renderTo : 'chart1',
										zoomType : 'xy'
									},title: {
								            text: 'Gráfico Porcentaje de Avance'
								    },xAxis : {
										type : 'datetime',
										plotLines: [{
														value: Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate()),
														width: 1,
														color: 'red',
														dashStyle: 'dash',
														label: {
															text: 'Hoy',
															align: 'right',
															y: 12,
															x: 0
														}
													}]										
									},yAxis: {
							            title: {
							                text: 'Porcentaje'
							            }
							        },series : [ {
							            name: '% Avance Informado',
							            data: items6
		       					 	},{
							            name: '% Avance Esperado',
							            data: items7
		       					 	}]
	
								});
								
								$("#chart_box").dialog({modal: true,height:'auto',width:'auto'});
								}else{
									alert('no hay datos');
								}
						  },
						  error: function(e) {

						  }
					}); 
	           }
	       } 
	}); 

	$("#" + childGridID).jqGrid('navButtonAdd',"#" + childGridPagerID,{
	       caption:"",
	       buttonicon : "silk-icon-chart-curve",
	       title: "Gráfico Valor Ganado", 
	       onClickButton : function () { 
	    	   var grid = $("#" + childGridID);
	           var rowKey = grid.getGridParam("selrow");
	           if(rowKey === null && typeof rowKey === "object"){
		           alert('debe seleccionar un proyecto');
	           }else{
		           var curl = 'getPyChart/' + rowKey;
		           $.ajax({
						  url: curl,
						  type: 'GET',
						  success: function(data) {
							  var largo=data.length;
								if(largo>0){
									var items3 = [];
									var items4 = [];
									var items5 = [];
									var items9 = [];
									var items10 = [];
									$.each(data, function(index, element) {
										var d = new Date(parseInt(element.fecha));
										items3.push([Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()),parseFloat(element.vb)]);
										items4.push([Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()),parseFloat(element.vg)]);
										items5.push([Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()),parseFloat(element.vp)]);
										items9.push([Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()),parseFloat(element.evg)]);	
										items10.push([Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()),parseFloat(element.evb)]);																					
								    });	
								    
								var now = new Date;
								var chart_2 = new Highcharts.Chart({
									chart : {
										renderTo : 'chart1',
										zoomType : 'xy'
									},title: {
								            text: 'Gráfico Valor Ganado'
								    },xAxis : {
										type : 'datetime',
										plotLines: [{
														value: Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate()),
														width: 1,
														color: 'red',
														dashStyle: 'dash',
														label: {
															text: 'Hoy',
															align: 'right',
															y: 12,
															x: 0
														}
													}]										
									},yAxis: {
							            title: {
							                text: 'Horas'
							            }
							        },series : [ {
										name: 'HC (100%)',
										data : items3
									},{
						            	name: 'VG (100%)',
						            	data: items4
	       						 	},{
	       						 		name :'Horas Asignadas',
	       						 		data: items5
	       						 	},{
	       						 		name :'HC (% Avance)',
	       						 		data: items10
	       						 	},{
	       						 		name :'VG (% Avance)',
	       						 		data: items9
	       						 	}]
								});
								
								$("#chart_box").dialog({modal: true,height:'auto',width:'auto'});
								}else{
									alert('no hay datos');
								}
						  },
						  error: function(e) {

						  }
					}); 
	           }
	       } 
	});   		

	$("#" + childGridID).jqGrid('navButtonAdd',"#" + childGridPagerID,{
	       caption:"",
	       buttonicon : "silk-icon-chart-line",
	       title: "Gráfico Sub-Tareas Atrasadas", 
	       onClickButton : function () { 
	    	   var grid = $("#" + childGridID);
	           var rowKey = grid.getGridParam("selrow");
	           if(rowKey === null && typeof rowKey === "object"){
		           alert('debe seleccionar un proyecto');
	           }else{

		           var curl = 'getPyChart/' + rowKey;

		           $.ajax({
						  url: curl,
						  type: 'GET',
						  success: function(data) {
							  var largo=data.length;
								if(largo>0){
									var items11 = [];
									var items12 = [];
									$.each(data, function(index, element) {
										var d = new Date(parseInt(element.fecha));
										items11.push([Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()),parseFloat(element.ta)]);
										items12.push([Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()),parseFloat(element.tp)]);
								    });	
								    
								var now = new Date;
								var chart3 = new Highcharts.Chart({
									chart : {
										renderTo : 'chart1',
										zoomType : 'xy',
									},plotOptions: {
					                    series: {
					                        stickyTracking: false,
					                        events: {
					                            click: function(evt) {
					                            	var index = evt.point.index;
					                            	var programId = items13[index][1];
					                            	var date = items13[index][0]
					                            }                      
					                        }
					                        
					                    }
					                },title: {
								            text: 'Gráfico de Sub-Tareas'
								    },xAxis : {
										type : 'datetime',
										plotLines: [{
														value: Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate()),
														width: 1,
														color: 'red',
														dashStyle: 'dash',
														label: {
															text: 'Hoy',
															align: 'right',
															y: 12,
															x: 0
														}
													}]											
									},yAxis: {
							            title: {
							                text: 'sub-tareas'
							            }
							        },series : [ {
									 	name: 'Sub-Tarea Atrasada',
										data : items11
									},{
						            	name: 'Sub-Tarea Planeada',
						            	data: items12
	       						 	}]
								});
								
								$("#chart_box").dialog({modal: true,height:'auto',width:'auto'});
								}else{
									alert('no hay datos');
								}
						  },
						  error: function(e) {

						  }
					}); 
	           }
	       } 
	}); 

}

$(document).ready(function(){
	$.datepicker.regional['es'] = {
	        closeText: 'Cerrar',
	        prevText: '<Ant',
	        nextText: 'Sig>',
	        currentText: 'Hoy',
	        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
	        monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
	        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
	        dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
	        dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
	        weekHeader: 'Sm',
	        dateFormat: 'yy-mm-dd',
	        firstDay: 1,
	        isRTL: false,
	        showMonthAfterYear: false,
	        yearSuffix: ''
	};
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

	  Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
	        return {
	            radialGradient: {
	                cx: 0.5,
	                cy: 0.3,
	                r: 0.7
	            },
	            stops: [
	                [0, color],
	                [1, Highcharts.Color(color).brighten(-0.3).get('rgb')]
	            ]
	        };
	    });
		
	var modelPieDepa=[
	              { label: 'pId', name: 'program_id', width: 50, key: true, hidden:true },  
	              { label: 'Programa', name: 'programa', width: 250,formatter: returnProgramLink },
	              { label: 'Departamento', name: 'division', hidden: true},
	              { label: 'Estado', name: 'estado', width: 150 },
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
			  

    var full = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + '/program-details/';
	var optionsChart = {
		    chart: {
	            type: 'scatter',
	            zoomType: 'xy'
		    },title: {
		    	text: 'CPI/SPI',
	            style: {
	                fontWeight: 'bold'
	            }
	        },tooltip: {
	            formatter: function() {
	                return '<b>' + this.point.programa +'</b>';
	            }
	        },xAxis: {
	            title: {
	                text: 'CPI'
	            },
	            plotLines:[{value:0.75,color: 'red',width:2},{value:0.95,color: 'red',width:2}]
	        },plotOptions: {
	            series: {
	                cursor: 'pointer',
	                events: {
	                    click: function (e) {
	                    	window.location.href = full + e.point.z;
	                    }
	                }
	            }
	        },yAxis: {
	            title: {
	                text: 'SPI'
	            },plotLines:[{value:0.7,color: 'red',width:2},{value:0.9,color: 'red',width:2}]
	        },legend: {
                     enabled: false,
                     layout: 'vertical',
                     align: 'left',
                     verticalAlign: 'top',
                     x: 100,
                     y: 70,
                     floating: true,
                     backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
                     borderWidth: 1
            },series: []
	};

	var optionsPieDepa ={
			chart: {
				renderTo: 'containerDepa',
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            type: 'pie'
	        },title: {
	            text: 'Programas por Departamento'
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
	                    	   grillaProgramaDepa(this.options.dId,this.options.name);
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

	var optionsPie_1 ={
			chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            type: 'pie'
	        },title: {
	        },tooltip: {
	        	formatter: function() {
	        	    return '<b>'+ this.point.name + ' (' +  this.point.y + ')</b>: ' + Highcharts.numberFormat(this.percentage, 2) +' %';
	        	}
	        },plotOptions: {
	            pie: {
	                //size: "70%",
	                allowPointSelect: true,
	                cursor: 'pointer',
	                point: {
	                    events: {
	                       click: function(event) {
	                    	   //grillaPrograma(this.options.dId,this.options.name);
	                       }
	                    }
	                 },
	                dataLabels: {
	                    enabled: true,
	                    format: '<b>{point.name} ({point.y})</b>: {point.percentage:.1f} %',
	                    style: {
	                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                    },
	                    connectorColor: 'silver'
	                }
	            }
	        },series: []
	};


	var optionsPie_2 ={
			chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            type: 'pie'
	        },title: {
	        },tooltip: {
	        	formatter: function() {
	        	    return '<b>'+ this.point.name + ' (' +  this.point.y + ')</b>: ' + Highcharts.numberFormat(this.percentage, 2) +' %';
	        	}
	        },plotOptions: {
	            pie: {
	                //size: "70%",
	                allowPointSelect: true,
	                cursor: 'pointer',
	                point: {
	                    events: {
	                       click: function(event) {
	                    	   //grillaPrograma(this.options.dId,this.options.name);
	                       }
	                    }
	                 },
	                dataLabels: {
	                    enabled: true,
	                    format: '<b>{point.name} ({point.y})</b>: {point.percentage:.1f} %',
	                    style: {
	                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                    },
	                    connectorColor: 'silver'
	                }
	            }
	        },series: []
	};

	var optionsPie_3 ={
			chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            type: 'pie'
	        },title: {
	        },tooltip: {
	        	formatter: function() {
	        	    return '<b>'+ this.point.name + ' (' +  this.point.y + ')</b>: ' + Highcharts.numberFormat(this.percentage, 2) +' %';
	        	}
	        },plotOptions: {
	            pie: {
	                //size: "70%",
	                allowPointSelect: true,
	                cursor: 'pointer',
	                point: {
	                    events: {
	                       click: function(event) {
	                    	   //grillaPrograma(this.options.dId,this.options.name);
	                       }
	                    }
	                 },
	                dataLabels: {
	                    enabled: true,
	                    format: '<b>{point.name} ({point.y})</b>: {point.percentage:.1f} %',
	                    style: {
	                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                    },
	                    connectorColor: 'silver'
	                }
	            }
	        },series: []
	};

	var optionsPie_4 ={
			chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            type: 'pie'
	        },title: {
	        },tooltip: {
	        	formatter: function() {
	        	    return '<b>'+ this.point.name + ' (' +  this.point.y + ')</b>: ' + Highcharts.numberFormat(this.percentage, 2) +' %';
	        	}
	        },plotOptions: {
	            pie: {
	                //size: "70%",
	                allowPointSelect: true,
	                cursor: 'pointer',
	                point: {
	                    events: {
	                       click: function(event) {
	                    	   //grillaPrograma(this.options.dId,this.options.name);
	                       }
	                    }
	                 },
	                dataLabels: {
	                    enabled: true,
	                    format: '<b>{point.name} ({point.y})</b>: {point.percentage:.1f} %',
	                    style: {
	                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                    },
	                    connectorColor: 'silver'
	                }
	            }
	        },series: []
	};

	var optionsPie_5 ={
			chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            type: 'pie'
	        },title: {
	        },tooltip: {
	        	formatter: function() {
	        	    return '<b>'+ this.point.name + ' (' +  this.point.y + ')</b>: ' + Highcharts.numberFormat(this.percentage, 2) +' %';
	        	}
	        },plotOptions: {
	            pie: {
	                //size: "70%",
	                allowPointSelect: true,
	                cursor: 'pointer',
	                point: {
	                    events: {
	                       click: function(event) {
	                    	   //grillaPrograma(this.options.dId,this.options.name);
	                       }
	                    }
	                 },
	                dataLabels: {
	                    enabled: true,
	                    format: '<b>{point.name} ({point.y})</b>: {point.percentage:.1f} %',
	                    style: {
	                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                    },
	                    connectorColor: 'silver'
	                }
	            }
	        },series: []
	};

	var optionsPie_6 ={
			chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            type: 'pie'
	        },title: {
	        },tooltip: {
	        	formatter: function() {
	        	    return '<b>'+ this.point.name + ' (' +  this.point.y + ')</b>: ' + Highcharts.numberFormat(this.percentage, 2) +' %';
	        	}
	        },plotOptions: {
	            pie: {
	                //size: "70%",
	                allowPointSelect: true,
	                cursor: 'pointer',
	                point: {
	                    events: {
	                       click: function(event) {
	                    	   //grillaPrograma(this.options.dId,this.options.name);
	                       }
	                    }
	                 },
	                dataLabels: {
	                    enabled: true,
	                    format: '<b>{point.name} ({point.y})</b>: {point.percentage:.1f} %',
	                    style: {
	                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                    },
	                    connectorColor: 'silver'
	                }
	            }
	        },series: []
	};

	var optionsPie_7 ={
			chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            type: 'pie'
	        },title: {
	        },tooltip: {
	        	formatter: function() {
	        	    return '<b>'+ this.point.name + ' (' +  this.point.y + ')</b>: ' + Highcharts.numberFormat(this.percentage, 2) +' %';
	        	}
	        },plotOptions: {
	            pie: {
	                //size: "70%",
	                allowPointSelect: true,
	                cursor: 'pointer',
	                point: {
	                    events: {
	                       click: function(event) {
	                    	   //grillaPrograma(this.options.dId,this.options.name);
	                       }
	                    }
	                 },
	                dataLabels: {
	                    enabled: true,
	                    format: '<b>{point.name} ({point.y})</b>: {point.percentage:.1f} %',
	                    style: {
	                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                    },
	                    connectorColor: 'silver'
	                }
	            }
	        },series: []
	};

	//change the # in the url when switching tabs
    //makes refresh work!
    $("#tabs li a").click(function(){
    	window.location.hash = $(this).attr("href");
    });

    //make back/forward buttons work on tabs
    if($("#tabs").length > 0) {
    	//prevent scrolling when clicking on a tab
    	var doit = true;
    	$("#tabs a").click(function(){
    		doit = false;
    	});

    	$(window).bind('popstate', function() {
    		//must be asynchronous, because usually popstate happens before the a click event.
    		setTimeout(function(){
    			if(doit) {
    				//only happens if back/forward buttons are used
    				if(window.location.hash.length > 0) {
    					$("a[href="+window.location.hash+"]").click();
    				} else {
    					$("#tabs li:first a").click();
    				}
    			}
    			doit = true;
    		}, 0);
    	});
    }

	var modelProgramGrid=[
            { label: 'id', name: 'program_id', key: true, hidden:true },
            { label: 'Programa', name: 'program_name', width: 350,formatter: returnProgramLink },
            { label: 'Numero', name: 'pcod', width: 120, align: 'center',
                  searchoptions:{
                      sopt: ["eq","ge","le"]
                  }
            },
            { label: 'Estado', name: 'work_flow_status', jsonmap: 'work_flow_status', width: 200,
                		    stype: 'select',
                			searchoptions: {
                				dataUrl: '/list-all-workflowstatus',
                				buildSelect: function (response) {
                					var data = JSON.parse(response);
                					var s = "<select>";
                					s += '<option value="-1">--Estado--</option>';
                					$.each(data, function(i, item) {
                						s += '<option value="' + data[i].value + '">' + data[i].name + '</option>';
                					});
                					return s + "</select>";
                				}
                		    },
            },
            { label: 'Tipo', name: 'program_type', jsonmap: 'program_type', width: 200,
                		    stype: 'select',
                			searchoptions: {
                				dataUrl: '/list-all-programtype',
                				buildSelect: function (response) {
                					var data = JSON.parse(response);
                					var s = "<select>";
                					s += '<option value="-1">--Tipo--</option>';
                					$.each(data, function(i, item) {
                						s += '<option value="' + data[i].value + '">' + data[i].name + '</option>';
                					});
                					return s + "</select>";
                				}
                		    },
            },
            { label: 'Foco', name: 'foco', width: 200,
                            		    stype: 'select',
                            			searchoptions: {
                            				dataUrl: '/list-all-sub-type',
                            				buildSelect: function (response) {
                            					var data = JSON.parse(response);
                            					var s = "<select>";
                            					s += '<option value="-1">--Foco--</option>';
                            					$.each(data, function(i, item) {
                            						s += '<option value="' + data[i].value + '">' + data[i].name + '</option>';
                            					});
                            					return s + "</select>";
                            				}
                            		    },
            },
            { label: 'Impacto', name: 'impact_type', width: 200,
                            		    stype: 'select',
                            			searchoptions: {
                            				dataUrl: '/list-all-impact-type',
                            				buildSelect: function (response) {
                            					var data = JSON.parse(response);
                            					var s = "<select>";
                            					s += '<option value="-1">--Impacto--</option>';
                            					$.each(data, function(i, item) {
                            						s += '<option value="' + data[i].value + '">' + data[i].name + '</option>';
                            					});
                            					return s + "</select>";
                            				}
                            		    },
            },
            { label: 'Tamaño', name: 'tamano', width: 150,
                       		    stype: 'select',
                    			searchoptions: {
                     				dataUrl: '/list-all-internal-state',
                                    buildSelect: function (response) {
                                        var data = JSON.parse(response);
                                        var s = "<select>";
                                        s += '<option value="-1">--Tamaño--</option>';
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
                					s += '<option value="-1">--División--</option>';
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
                         					s += '<option value="-1">--Gerencia--</option>';
                         					$.each(data, function(i, item) {
                         						s += '<option value="' + data[i].codDivision + '">' + data[i].glosaDivision + '</option>';
                         					});
                         					return s + "</select>";
                         				}
                         		    },
            },
            { label: 'Departamento', name: 'cod_dep', jsonmap: 'name_dep', width: 300,
                         		    stype: 'select',
                         			searchoptions: {
                         				dataUrl: '/list-all-departament',
                         				buildSelect: function (response) {
                         					var data = JSON.parse(response);
                         					var s = "<select>";
                         					s += '<option value="-1">--Departamento--</option>';
                         					$.each(data, function(i, item) {
                         						s += '<option value="' + data[i].codDivision + '">' + data[i].glosaDivision + '</option>';
                         					});
                         					return s + "</select>";
                         				}
                         		    },
            },
            { label: 'Lider', name: 'uid', jsonmap: 'nombre_lider', width: 300,
                                 		    stype: 'select',
                                 			searchoptions: {
                                 				dataUrl: '/list-all-user-active',
                                 				buildSelect: function (response) {
                                 					var data = JSON.parse(response);
                                 					var s = "<select>";
                                 					s += '<option value="-1">--Lider--</option>';
                                 					$.each(data, function(i, item) {
                                 						s += '<option value="' + data[i].codDivision + '">' + data[i].glosaDivision + '</option>';
                                 					});
                                 					return s + "</select>";
                                 				}
                                 		    },
            },
            { label: 'Inicio', name: 'plan_start_date',width: 120, align: 'center',
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
            { label: 'Liberación',   name: 'release_date', width: 120, align: 'center',
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
            { label: 'Cierre',   name: 'plan_end_date', width: 120, align: 'center',
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
            { label: '% Informado', name: 'pai', width: 100, align: 'right',
                searchoptions:{
                    sopt: ["ge","le","eq"]
                },
                formatter: 'number', formatoptions: { decimalPlaces: 2 }
            },
            { label: '% Esperado', name: 'pae', width: 100, align: 'right',
                searchoptions:{
                    sopt: ["ge","le","eq"]
                },
                formatter: 'number', formatoptions: { decimalPlaces: 2 }
            },
            { label: 'SPI', name: 'spi', width: 100, align: 'right',
                searchoptions:{
                    sopt: ["ge","le","eq"]
                },
                formatter: 'number', formatoptions: { decimalPlaces: 2 }

            },
            { label: 'CPI', name: 'cpi', width: 100, align: 'right',
                searchoptions:{
                    sopt: ["ge","le","eq"]
                },
                formatter: 'number', formatoptions: { decimalPlaces: 2 }
            },
            { label: 'Consumidas', name: 'hours', width: 100, align: 'right',
                searchoptions:{
                    sopt: ["ge","le","eq"]
                },
                formatter: 'number', formatoptions: { decimalPlaces: 2 }
            },
            { label: 'Asignadas', name: 'allocation', width: 100, align: 'right',
                searchoptions:{
                    sopt: ["ge","le","eq"]
                },
                formatter: 'number', formatoptions: { decimalPlaces: 2 }
            },
            { label: 'Proyectos', name: 'count_project', width: 100, align: 'right',
                              searchoptions:{
                                  sopt: ["eq","ge","le"]
                              }
            },
            { label: 'Tareas', name: 'count_task', width: 100, align: 'right',
                              searchoptions:{
                                  sopt: ["eq","ge","le"]
                              }
            },
            { label: 'Sub - Tareas', name: 'count_subtask', width: 100, align: 'right',
                              searchoptions:{
                                  sopt: ["eq","ge","le"]
                              }
            },
            { label: 'PMO', name: 'pmo', width: 350 },
            { label: 'N° no asignados', name: 'count_subtask_usr', width: 100, align: 'right',
                searchoptions:{
                    sopt: ["eq","ge","le"]
                }
            }
        ];

	var modelProjectSubGrid=[
            { label: 'id', name: 'project_id', key: true, hidden:true },
            { label: 'Proyectos', name: 'program_name', width: 350,formatter: returnProjectLink },
            { label: 'Gerente', name: 'uid', jsonmap: 'nombre_lider', width: 200,
            },
            { label: 'Fecha inicio', name: 'plan_start_date',width: 180,
            },
            { label: 'Fecha lanzamiento',   name: 'plan_end_date', width: 180,
            },
            { label: '% Avance', name: 'pai', width: 150,
            },
            { label: '% Plan', name: 'pae', width: 150,
            },
            { label: 'SPI', name: 'spi', width: 50,
            },
            { label: 'CPI', name: 'cpi', width: 50,
            },
            { label: 'Consumidas', name: 'hours', width: 150,
            },
            { label: 'Asignadas', name: 'allocation', width: 150,
            }
        ];

	var modelTaskSubGrid=[
            { label: 'id', name: 'task_id', key: true, hidden:true },
            { label: 'Tareas', name: 'program_name', width: 350,formatter: returnTaskLink },
            { label: 'Propietario', name: 'uid', jsonmap: 'nombre_lider', width: 200,
            },
            { label: 'Fecha Inicio', name: 'plan_start_date',width: 180,
            },
            { label: 'Fecha Término',   name: 'plan_end_date', width: 180,
            },
            { label: '% Avance', name: 'pai', width: 150,
            },
            { label: '% Plan', name: 'pae', width: 150,
            },
            { label: 'SPI', name: 'spi', width: 50,
            },
            { label: 'CPI', name: 'cpi', width: 50,
            },
            { label: 'Consumidas', name: 'hours', width: 150,
            },
            { label: 'Asignadas', name: 'allocation', width: 150,
            }
        ];

	var modelSubTaskSubGrid=[
            { label: 'id', name: 'subtask_id', key: true, hidden:true },
            { label: 'Sub-Tareas', name: 'program_name', width: 350,formatter: returnSubTaskLink },
            { label: 'Gerente', name: 'uid', jsonmap: 'nombre_lider', width: 200,hidden:true,
            },
            { label: 'Inicio Planificado', name: 'plan_start_date',width: 180,
            },
            { label: 'Término Planificado',   name: 'plan_end_date', width: 180,
            },
            { label: 'Inicio Real', name: 'real_start_date',width: 180,
            },
            { label: 'Término Real',   name: 'real_end_date', width: 180,
            },
            { label: '% Avance Informado', name: 'pai', width: 150,
            },
            { label: '% Plan', name: 'pae', width: 150,
            },
            { label: 'Consumidas', name: 'hours', width: 150,
            },
            { label: 'Asignadas', name: 'allocation', width: 150,
            }
        ];
		
	function grillaProgramaDepa(did,name){
		var chuurl='/panelDepa?did=' + did;

		$("#jqGridDepa").jqGrid({
	        mtype: "GET",
	        datatype: "json",
	        page: 1,
	        colModel: modelPieDepa,
			viewrecords: true,
			regional : "es",
			height: 'auto',
	        autowidth:true,
	        rowNum: 20,
	        pager: "#jqGridPagerDepa",
	        ignoreCase: true
	    });			
		$("#jqGridDepa").jqGrid('setCaption', name).jqGrid('setGridParam', { url: chuurl, page: 1}).jqGrid("setGridParam", {datatype: "json"}).trigger("reloadGrid");
	}		

	function showProjectSubGrid(parentRowID, parentRowKey) {
              	    var childGridID = parentRowID + "_table";
              	    var childGridPagerID = parentRowID + "_pager";
              	    var childGridURL = "/report/H/1/" + parentRowKey;

              	    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

              	    $("#" + childGridID).jqGrid({
              	        url: childGridURL,
              	        mtype: "GET",
              	        datatype: "json",
              	        colModel: modelProjectSubGrid,
              			height: 'auto',
              	        autowidth:true,
                        shrinkToFit:false,
                        forceFit:true,
        		        subGrid: true,
                        subGridRowExpanded: showTaskSubGrid,
              	        regional : "es",
                        rowList: [],
			            pgbuttons: false,
			            pgtext: null,
			            viewrecords: false,
              	        pager: "#" + childGridPagerID
              	    });
              	}

	function showTaskSubGrid(parentRowID, parentRowKey) {
     	    var childGridID = parentRowID + "_table";
     	    var childGridPagerID = parentRowID + "_pager";
     	    var childGridURL = "/report/H/2/" + parentRowKey;

     	    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

     	    $("#" + childGridID).jqGrid({
     	        url: childGridURL,
     	        mtype: "GET",
     	        datatype: "json",
     	        colModel: modelTaskSubGrid,
     			height: 'auto',
     	        autowidth:true,
                shrinkToFit:false,
                forceFit:true,
                subGrid: true,
                subGridRowExpanded: showSubTaskSubGrid,
     	        regional : "es",
                rowList: [],
		        pgbuttons: false,
		        pgtext: null,
		        viewrecords: false,
     	        pager: "#" + childGridPagerID
     	    });

     	}

	function showSubTaskSubGrid(parentRowID, parentRowKey) {
     	    var childGridID = parentRowID + "_table";
     	    var childGridPagerID = parentRowID + "_pager";
     	    var childGridURL = "/report/H/3/" + parentRowKey;

     	    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

     	    $("#" + childGridID).jqGrid({
     	        url: childGridURL,
     	        mtype: "GET",
     	        datatype: "json",
     	        colModel: modelSubTaskSubGrid,
     			height: 'auto',
     	        autowidth:true,
                shrinkToFit:false,
                forceFit:true,
     	        regional : "es",
                rowList: [],
                pgbuttons: false,
	            pgtext: null,
	            viewrecords: false,
     	        pager: "#" + childGridPagerID
     	    });

     	}

    $("#tabs").tabs({
        active: 0,
        create: function (event, ui) {
            var grid =	$("#jqGrid").jqGrid({
                    mtype: "GET",
                    url: "/report/H/0/0",
                    datatype: "json",
                    page: 1,
                    colModel: modelProgramGrid,
                    viewrecords: true,
                    regional : "es",
                    height: 'auto',
                    autowidth:true,
                    //width: 950,
                    //loadonce: true,
                    rowNum: 25,
                    shrinkToFit:false,
                    forceFit:true,
                    pager: "#jqGridPager",
                    subGrid: true,
                    caption : 'Programas',
                    subGridRowExpanded: showProjectSubGrid,
                    ignoreCase: true
                }).jqGrid('filterToolbar', {stringResult: true,searchOperators: true, searchOnEnter: false, defaultSearch: 'cn'});

            grid.jqGrid('navGrid','#jqGridPager',{edit: false, add: false, del: false,refresh:true,search: false, position: "left", cloneToTop: false }
            );

            grid.navButtonAdd('#jqGridPager', {
                buttonicon: "ui-icon-circle-triangle-e",
                title: "Excel",
                caption: "Excel",
                position: "last",
                onClickButton: function() {
                    var postData = grid.jqGrid("getGridParam", "postData")
                    if(postData._search)
                    {
                        var query = "";
                        for (key in postData) {
                            query += encodeURIComponent(key)+"="+encodeURIComponent(postData[key])+"&";
                        }
                        //console.log(query)
                        var url = '/report/X/0/0?'+query;
                        grid.jqGrid('excelExport',{"url":url});

                    }else{
                        //archivo generado
                        grid.jqGrid('excelExport',{"url":'/report_full'});
                    }

                }
            });

       	}, activate: function( event, ui ) {

        if(ui.newTab.text()==='Reporte Fabricas'){
            var mytab=ui.newTab.text();
            console.log('tab:'+mytab);
            $("#jqGrid").jqGrid('setCaption', name).jqGrid('setGridParam', { url: '/report/H/0/0', page: 1}).jqGrid("setGridParam", {datatype: "json"}).trigger("reloadGrid");
        } else if(ui.newTab.text()==='Dashboard') {
            var mytab=ui.newTab.text();
            console.log('tab:'+mytab);
            $.ajax({
				  url: '/burbujas/1',
				  type: 'GET',
				  success: function(data) {
				    optionsChart.chart.renderTo = 'container_c1'
				    optionsChart.title.text = data.name
					optionsChart.series.push(data);
					var chart = new Highcharts.Chart(optionsChart);
				  }
			});
            $.ajax({
				  url: '/pie/1',
				  type: 'GET',
				  success: function(data) {
				    optionsPie_1.chart.renderTo = 'container_c2'
				    optionsPie_1.title.text = data.name
					optionsPie_1.series.push(data)
					var chartPie_1 = new Highcharts.Chart(optionsPie_1)
					//chartPie_1.setSize(400, 300);
				  }
			});
            $.ajax({
				  url: '/pie/2',
				  type: 'GET',
				  success: function(data) {
				    optionsPie_2.chart.renderTo = 'container_c3'
				    optionsPie_2.title.text = data.name
					optionsPie_2.series.push(data)
					var chartPie_2 = new Highcharts.Chart(optionsPie_2)
					//chartPie_2.setSize(400, 300);
				  }
			});
            $.ajax({
				  url: '/pie/3',
				  type: 'GET',
				  success: function(data) {
				    optionsPie_3.chart.renderTo = 'container_c4'
				    optionsPie_3.title.text = data.name
					optionsPie_3.series.push(data)
					var chartPie_3 = new Highcharts.Chart(optionsPie_3)
					//chartPie_3.setSize(400, 300);
				  }
			});

            $.ajax({
				  url: '/pie/4',
				  type: 'GET',
				  success: function(data) {
				    optionsPie_4.chart.renderTo = 'container_c5'
				    optionsPie_4.title.text = data.name
					optionsPie_4.series.push(data)
					var chartPie_4 = new Highcharts.Chart(optionsPie_4)
					//chartPie_2.setSize(400, 300);
				  }
			});
            $.ajax({
				  url: '/pie/5',
				  type: 'GET',
				  success: function(data) {
				    optionsPie_5.chart.renderTo = 'container_c6'
				    optionsPie_5.title.text = data.name
					optionsPie_5.series.push(data)
					var chartPie_5 = new Highcharts.Chart(optionsPie_5)
					//chartPie_3.setSize(400, 300);
				  }
			});

            $.ajax({
				  url: '/pie/6',
				  type: 'GET',
				  success: function(data) {
				    optionsPie_6.chart.renderTo = 'container_c7'
				    optionsPie_6.title.text = data.name
					optionsPie_6.series.push(data)
					var chartPie_6 = new Highcharts.Chart(optionsPie_6)
					//chartPie_1.setSize(400, 300);
				  }
			});

            $.ajax({
				  url: '/pie/7',
				  type: 'GET',
				  success: function(data) {
				    optionsPie_7.chart.renderTo = 'container_c8'
				    optionsPie_7.title.text = data.name
					optionsPie_7.series.push(data)
					var chartPie_7 = new Highcharts.Chart(optionsPie_7)
					//chartPie_1.setSize(400, 300);
				  }
			});

        }else if(ui.newTab.text()==='Programas y Sub Tareas') {
				if($('#jqGrid2').html() == "") {
					$("#jqGrid2").jqGrid({
				        url: '/reportProgram',
				        mtype: "GET",
				        datatype: "json",
				        page: 1,
				        colModel: [
				            { label: 'Codigo',
				               name: 'codigo',
				               width: 100,
				               key: true,
				               hidden:true
				            },                   
				            { label: 'Nivel',
				              name: 'nivel',
				              width: 100,
				            },
				            { label: 'Estado',
					              name: 'estado',
					              width: 150, 
					              stype: 'select',searchoptions: {dataUrl: '/listaEstado',
			  	  	            		buildSelect: function (response) {
			  	  	            			var data = JSON.parse(response);
			  	  	            		    var s = "<select>";
			  	  	            		    s += '<option value="0">--Sin Estado--</option>';
			  	  	            		    $.each(data, function(i, item) {
			  	  	            		    	s += '<option value="' + data[i].id + '">' + data[i].workflow_status + '</option>';
			  	  	            		    });
			  	  	            		    return s + "</select>";
			  	  	            		}},
				            },
				            { label: 'Nombre', name: 'programa', width: 250,formatter: returnProgramLink },
				            { label: 'Responsable', name: 'responsable', width: 150 },
				            { label: 'Fecha Inicio Planeada',
				              name: 'pfecini',
				              width: 120,
				              formatter: 'date',
				              formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
				              searchoptions:{
					              dataInit:function(el){
						              	$(el).datepicker({
							              	dateFormat:'yy-mm-dd',
							              	changeYear: true,
					                        changeMonth: true,                            
					                        onSelect: function (dateText, inst) {
					                            setTimeout(function () {
					                                $('#jqGrid2')[0].triggerToolbar();
					                            }, 100);
					                        }
								        });
						              },sopt: ["gt","lt","eq"]
				             }
				            },
				            { label: 'Fecha Termino Planeada',
				              name: 'pfecter',
				              width: 120,
				              sorttype:'date',
				              formatter: 'date',
				              formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
				              searchoptions:{
					              dataInit:function(el){
						              	$(el).datepicker({
							              	dateFormat:'yy-mm-dd',
							              	changeYear: true,
					                        changeMonth: true,                            
					                        onSelect: function (dateText, inst) {
					                            setTimeout(function () {
					                                $('#jqGrid2')[0].triggerToolbar();
					                            }, 100);
					                        }
								        });
						              },sopt: ["gt","lt","eq"]
				             }
				            },
				            { label: 'Fecha Inicio Real',
				              name: 'rfecini',
				              width: 120,
				              sorttype:'date',
				              formatter: 'date',
				              formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
				              searchoptions:{
					              dataInit:function(el){
						              	$(el).datepicker({
							              	dateFormat:'yy-mm-dd',
							              	changeYear: true,
					                        changeMonth: true,                            
					                        onSelect: function (dateText, inst) {
					                            setTimeout(function () {
					                                $('#jqGrid2')[0].triggerToolbar();
					                            }, 100);
					                        }
								        });
						              },sopt: ["gt","lt","eq"]
				             }
				            },
				            { label: 'Fecha Termino Real',
				              name: 'rfecter',
				              width: 120,
				              sorttype:'date',
				              formatter: 'date',
				              formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
				              searchoptions:{
					              dataInit:function(el){
						              	$(el).datepicker({
							              	dateFormat:'yy-mm-dd',
							              	changeYear: true,
					                        changeMonth: true,                            
					                        onSelect: function (dateText, inst) {
					                            setTimeout(function () {
					                                $('#jqGrid2')[0].triggerToolbar();
					                            }, 100);
					                        }
								        });
						              },sopt: ["gt","lt","eq"]
				             }
				            },
				            { label: 'Horas Planificadas', name: 'hplan', width: 100,searchoptions: {sopt:["gt","lt","eq"] } },
				            { label: 'Horas Consumidas', name: 'hreal', width: 100,searchoptions: {sopt:["gt","lt","eq"] } }              
				        ],
				        rowNum: 20,
				        viewrecords: true,
            	        rowList: [5, 10, 20, 50],
            	        gridview: true,
				        regional : 'es',
				        height: 'auto',
				        autowidth:true,        
				        subGrid: true, 
				        subGridRowExpanded: showChildGrid, 
				        pager: "#jqGridPager2",
				        loadComplete: findWithColor
				    });	
 
					$("#jqGrid2").jqGrid('filterToolbar', {stringResult: true,searchOperators: true, searchOnEnter: false, defaultSearch: 'cn'});
					$("#jqGrid2").jqGrid('navGrid','#jqGridPager2',{add:false,edit:false,del:false,search: false});
				
            		$("#jqGrid2").jqGrid('navButtonAdd','#jqGridPager2',{
         		       caption:"",
         		       buttonicon : "ui-icon-gear",//silk-icon-cog
         		       onClickButton : function() { 
         		    	   var grid = $("#jqGrid2");
         		           var rowKey = grid.getGridParam("selrow");
         		           var rowData = grid.getRowData(rowKey);
         		           var titulo = rowData.program_name;
         		           
         		           if(rowKey === null && typeof rowKey === "object"){
         			           alert('debe seleccionar un programa');
         		           }else{
         		        	  var iurl = 'indicadores/' + rowKey;
         		        	  
         		        	 $.ajax({
									type: "GET",
									url: iurl,
									dataType: "json",
									async: false,
									success: function( data ) {
										$("#cell_spi").text(data[0].spi);
										$("#cell_cpi").text(data[0].cpi);
										$("#dialog-modal").dialog({
								              height: 140,
								              modal: true
								        });
										$( "#dialog-modal" ).show();
									},
									error: function(model, response, options) {
										alert(response);
									}
         		        	 });
         		        	 
         		        	 
         		           }
         		       } 
         		});		
            		
					$("#jqGrid2").jqGrid('navButtonAdd','#jqGridPager2',{
					       caption:"",
					       buttonicon : "silk-icon-page-excel",
					       title: "Exportar a Excel", 
					       onClickButton : function () { 
					    	   var grid = $("#jqGrid2");
					           var rowKey = grid.getGridParam("selrow");
					           if(rowKey === null && typeof rowKey === "object"){
						           alert('debe seleccionar un programa');
					           }else{
						           var url = 'getProgramExcel/' + rowKey;
						    	   $("#jqGrid2").jqGrid('excelExport',{"url":url});
					           }
					       } 
					});            		
				}
		
		}else if(ui.newTab.text()==='Sub Tareas') {
			if($('#jqGrid3').html() == "") {
				$("#jqGrid3").jqGrid({
					url: '/reportStateSubTask',
					mtype: "GET",
					datatype: "json",
					page: 1,
					colModel: [
						{ label: 'sub_task_id', name: 'sub_task_id', width: 100, key: true, hidden:true }, 
						{ label: 'Programa', name: 'programa', width: 250 },
						{ label: 'Proyecto', name: 'proyecto', width: 250 },
						{ label: 'Sub Tarea', name: 'subtarea', width: 250 },
						{ label: 'Lider', name: 'lider', width: 150 },
						{ label: 'Responsable', name: 'responsable', width: 150 },
						{ label: 'Asignadas', name: 'asignadas', width: 50 },
						{ label: 'Consumidas', name: 'consumidas', width: 50 },				            
						{ label: 'Fecha Inicio Planeada',
						  name: 'pfecini',
						  width: 100,
						  formatter: 'date',
						  formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
						  searchoptions:{
							  dataInit:function(el){
									$(el).datepicker({
										dateFormat:'yy-mm-dd',
										changeYear: true,
										changeMonth: true,                            
										onSelect: function (dateText, inst) {
											setTimeout(function () {
												$('#jqGrid3')[0].triggerToolbar();
											}, 100);
										}
									});
								  },sopt: ["gt","lt","eq"]
						 }
						},
						{ label: 'Fecha Termino Planeada',
						  name: 'pfecter',
						  width: 100,
						  sorttype:'date',
						  formatter: 'date',
						  formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
						  searchoptions:{
							  dataInit:function(el){
									$(el).datepicker({
										dateFormat:'yy-mm-dd',
										changeYear: true,
										changeMonth: true,                            
										onSelect: function (dateText, inst) {
											setTimeout(function () {
												$('#jqGrid3')[0].triggerToolbar();
											}, 100);
										}
									});
								  },sopt: ["gt","lt","eq"]
						 }
						},
						{ label: 'Fecha Inicio Real',
						  name: 'rfecini',
						  width: 100,
						  sorttype:'date',
						  formatter: 'date',
						  formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
						  searchoptions:{
							  dataInit:function(el){
									$(el).datepicker({
										dateFormat:'yy-mm-dd',
										changeYear: true,
										changeMonth: true,                            
										onSelect: function (dateText, inst) {
											setTimeout(function () {
												$('#jqGrid3')[0].triggerToolbar();
											}, 100);
										}
									});
								  },sopt: ["gt","lt","eq"]
						 }
						},
						{ label: 'Fecha Termino Real',
						  name: 'rfecter',
						  width: 100,
						  sorttype:'date',
						  formatter: 'date',
						  formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
						  searchoptions:{
							  dataInit:function(el){
									$(el).datepicker({
										dateFormat:'yy-mm-dd',
										changeYear: true,
										changeMonth: true,                            
										onSelect: function (dateText, inst) {
											setTimeout(function () {
												$('#jqGrid3')[0].triggerToolbar();
											}, 100);
										}
									});
								  },sopt: ["gt","lt","eq"]
						 }
						},
						{ label: 'Porcentaje Avance Informado', name: 'pai', width: 50,searchoptions: {sopt:["gt","lt","eq"] } },
						{ label: 'Estado', name: 'estado', width: 100 }              
					],
					rowNum: 20,
					regional : 'es',
					height: 'auto',
					autowidth:true,        
					pager: "#jqGridPager3",
					loadComplete: findWithColor
				});	
				$("#jqGrid3").jqGrid('filterToolbar', {stringResult: true,searchOperators: true, searchOnEnter: false, defaultSearch: 'cn'});
				$("#jqGrid3").jqGrid('navGrid','#jqGridPager3',{add:false,edit:false,del:false,search: false});
				$("#jqGrid3").jqGrid('navButtonAdd','#jqGridPager3',{
					   caption:"",
					   buttonicon : "silk-icon-page-excel",
					   title: "Exportar a Excel", 
					   onClickButton : function () { 
						   var grid = $("#jqGrid3");
						   var rowKey = grid.getGridParam("selrow");
						   var url = 'status-subtask';
						   $("#jqGrid3").jqGrid('excelExport',{"url":url});
					   } 
				});
			}		
		} else if(ui.newTab.text()==='Por Departamentos') {
			if($('#containerDepa').html() == "") {	
				$.ajax({
					  url: '/pieDepa',
					  type: 'GET',
					  success: function(data) {
						  optionsPieDepa.series.push(JSON.parse(data));
							var charPieDepa = new Highcharts.Chart(optionsPieDepa);

							$("#jqGridDepa").jqGrid({
								url: '/panelDepa?did=6079',
								mtype: "GET",
								datatype: "json",
								page: 1,
								colModel: modelPieDepa,
								viewrecords: true,
								regional : "es",
								height: 'auto',
								autowidth:true,
								rowNum: 20,
								pager: "#jqGridPagerDepa",
								ignoreCase: true,
								gridComplete: function() {
									var id= $("#jqGridDepa").getDataIDs()[0];
									var rowData = $("#jqGridDepa").getRowData(id);
									var val_division = rowData.division;
									$("#jqGridDepa").jqGrid('setCaption', val_division)
								}
							});
							$("#jqGridDepa").jqGrid('filterToolbar', {stringResult: true,searchOperators: true, searchOnEnter: false, defaultSearch: 'cn'});
							$("#jqGridDepa").jqGrid('navGrid','#jqGridPagerDepa',{add:false,edit:false,del:false,search: false});
							$("#jqGridDepa").jqGrid('navButtonAdd','#jqGridPagerDepa',{
								   caption:"",
								   buttonicon : "silk-icon-page-excel",
								   title: "Exportar a Excel", 
								   onClickButton : function () { 
									   var grid = $("#jqGridDepa");
									   var rowKey = grid.getGridParam("selrow");
									   var url = 'depa-excel';
									   $("#jqGridDepa").jqGrid('excelExport',{"url":url});
								   } 
							});								
						
					  },
					  error: function(e) {

					  }
				});
			}		
		}else if(ui.newTab.text()==='Por Departamentos') {


		}
      }
    });

});

