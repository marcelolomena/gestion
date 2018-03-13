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

	var modelProgramGrid=[
            { label: 'id', name: 'program_id', key: true, hidden:true },
            { label: 'Programa', name: 'program_name', width: 350,formatter: returnProgramLink },
            { label: 'Estado', name: 'work_flow_status', jsonmap: 'work_flow_status', width: 200,
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
            { label: 'Tipo', name: 'program_type', jsonmap: 'program_type', width: 150,
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
            { label: 'Numero', name: 'pcod', width: 100,
                  searchoptions:{
                      sopt: ["ge","le","eq"]
                  }
            },
            { label: 'Foco', name: 'foco', width: 150,
                            		    stype: 'select',
                            			searchoptions: {
                            				dataUrl: '/list-all-sub-type',
                            				buildSelect: function (response) {
                            					var data = JSON.parse(response);
                            					var s = "<select>";
                            					s += '<option value="0">--Escoger Foco--</option>';
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
                                        s += '<option value="0">--Escoger Tamaño--</option>';
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
            { label: 'Departamento', name: 'cod_dep', jsonmap: 'name_dep', width: 250,
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
            { label: 'Lider', name: 'uid', jsonmap: 'nombre_lider', width: 200,
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
            { label: 'Fecha Inicio', name: 'plan_start_date',width: 150, align: 'center',
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
            { label: 'Fecha Cierre',   name: 'plan_end_date', width: 150, align: 'center',
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
                }
            },
            { label: '% Esperado', name: 'pae', width: 100, align: 'right',
                searchoptions:{
                    sopt: ["ge","le","eq"]
                }

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
                subGridRowExpanded: showProjectSubGrid,
		        ignoreCase: true
		    }).jqGrid('filterToolbar', {stringResult: true,searchOperators: true, searchOnEnter: false, defaultSearch: 'cn'});

        grid.jqGrid('setCaption', name).jqGrid('setGridParam', { url: tourl, page: 1}).jqGrid("setGridParam", {datatype: "json"}).trigger("reloadGrid");

        grid.jqGrid('navGrid','#jqGridPager',{edit: false, add: false, del: false,refresh:true,search: false, position: "left", cloneToTop: false }
        );
/*
        grid.navButtonAdd('#jqGridPager', {
            buttonicon: "ui-icon-circle-triangle-e",
            title: "Excel",
            caption: "Excel",
            position: "last",
            onClickButton: function() {
                grid.jqGrid("exportToExcel", {
                    includeLabels: true,
                    includeGroupHeader: true,
                    includeFooter: true,
                    fileName: "prueba.xlsx"
                })
            }
        });
*/

        grid.navButtonAdd('#jqGridPager', {
            buttonicon: "ui-icon-circle-triangle-e",
            title: "Excel",
            caption: "Excel",
            position: "last",
            onClickButton: function() {
                //var grid = $("#jqGrid");
                //var rowKey = grid.getGridParam("selrow");
                var url = '/report/X/0/0';
                grid.jqGrid('excelExport',{"url":url});
            }
        });

/*
        grid.jqGrid('navButtonAdd','#jqGridPager',{
            caption:"",
            buttonicon : "silk-icon-page-excel",
            title: "Exportar a Excel",
            onClickButton : function () {
                var grid = $("#jqGrid");
                var rowKey = grid.getGridParam("selrow");
                var url = '/report/X/0/0';
                $("#jqGrid").jqGrid('excelExport',{"url":url});
           }
        });
*/
        return false;

        ui.jqXHR.fail(function() {
          ui.panel.html(
            "Couldn't load this tab. We'll try to fix this as soon as possible." );
        });
      }
    });


});

