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
    var full = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + '/program-details/';
	var optionsChart = {
		    chart: {
		        renderTo: 'container_bubble',
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
	            },plotLines:[{value:0.75,color: 'red',width:2},{value:0.95,color: 'red',width:2}]
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
	        },series: []
	};

	var modelProgramGrid=[
            { label: 'id', name: 'program_id', key: true, hidden:true },
            { label: 'Programa', name: 'program_name', width: 350,formatter: returnProgramLink },
            { label: 'Numero', name: 'pcod', width: 120, align: 'center',
                  searchoptions:{
                      sopt: ["eq","ge","le"]
                  }
            },
            { label: 'Estado', name: 'work_flow_status', jsonmap: 'work_flow_status', width: 150,
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

              	    //$("#" + childGridID).jqGrid('navGrid',"#" + childGridPagerID,{add:false,edit:false,del:false,search: false,refresh:false});
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

     	    //$("#" + childGridID).jqGrid('navGrid',"#" + childGridPagerID,{add:false,edit:false,del:false,search: false,refresh:false});
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
    var chart
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
            $.ajax({
				  url: '/burbujas',
				  type: 'GET',
				  success: function(data) {
					optionsChart.series.push(data);
					chart = new Highcharts.Chart(optionsChart);
				  }
			});
       	}, activate: function( event, ui ) {

        if(ui.newTab.index()===0){
            $("#jqGrid").jqGrid('setCaption', name).jqGrid('setGridParam', { url: '/report/H/0/0', page: 1}).jqGrid("setGridParam", {datatype: "json"}).trigger("reloadGrid");
        } else if(ui.newTab.index()===1) {
            $.ajax({
				  url: '/burbujas',
				  type: 'GET',
				  success: function(data) {
                          chart.update({
                              title: {
                              text:  data.name
                              },
                              series:data
                          });
				  }
    		});
        }
      }
    });


});

