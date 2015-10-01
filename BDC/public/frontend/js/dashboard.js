/**
 * 2015 - ZRISMART S.A.
 */
	function returnProgramLink(cellValue, options, rowdata, action) 
	{
	    return "<a href='/program-details/" + options.rowId + "' >" + cellValue +"</a>";
	}  
	

	
$(document).ready(function(){
	$( "button" )
    .button()
    .click(function( event ) {
      event.preventDefault();
      var volver = "programs";
      $(location).attr('href',volver);
    });

	function grillaPrograma(did,name){
		//console.log("codigo de div: " + did);
		var chuurl='/panel?did=' + did;

	$("#jqGrid").jqGrid({
        //url: '/panel?did=' + did,
        mtype: "GET",
        datatype: "json",
		//datatype: "local",
        page: 1,
        colModel: [
            { label: 'pId', name: 'program_id', width: 50, key: true, hidden:true },  
            { label: 'Programa', name: 'programa', width: 250,formatter: returnProgramLink },
            { label: 'Responsable', name: 'responsable', width: 200 },
            { label: 'Fecha Inicio',
	          name: 'fecini',
	          width: 180,
	          formatter: 'date',
	          formatoptions: { 
		          srcformat: 'Y-m-d',
		          newformat: 'Y-m-d'
			  },searchoptions:{
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
		              },sopt: ["gt","lt","eq"]
                  }
            },
            { label: 'Fecha Comprometida',
	             name: 'feccom',
	             width: 180,
	             formatter: 'date',
	             formatoptions: { 
		             srcformat: 'Y-m-d',
		              newformat: 'Y-m-d' 
            	 },searchoptions:{
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
			              },sopt: ["gt","lt","eq"]
	             }
            },
            { label: '% Avance', name: 'pai', width: 150,searchoptions: {sopt:["gt","lt","eq"] } },
            { label: '% Plan', name: 'pae', width: 150,searchoptions: {sopt:["gt","lt","eq"] } },
            { label: 'SPI', name: 'spi', width: 150,searchoptions: {sopt:["gt","lt","eq"] } },
            { label: 'CPI', name: 'cpi', width: 150,searchoptions: {sopt:["gt","lt","eq"] } },
            { label: 'Inversión', name: 'inversion', width: 150,searchoptions: {sopt:["gt","lt","eq"] } },  
            { label: 'Gasto', name: 'gasto', width: 150,searchoptions: {sopt:["gt","lt","eq"] } }                      
        ],
		viewrecords: true,
		regional : "es",
		height: 'auto',
        autowidth:true,
        rowNum: 20,
        pager: "#jqGridPager",
        ignoreCase: true
    });	
	$("#jqGrid").jqGrid('setCaption', name).jqGrid('setGridParam', { url: chuurl, page: 1}).jqGrid("setGridParam", {datatype: "json"}).trigger("reloadGrid");
	}		

		/*
		
		
		$("#jqGrid").jqGrid('filterToolbar', {stringResult: true, searchOperators: true,searchOnEnter: false, defaultSearch: 'cn'});
		$("#jqGrid").jqGrid('navGrid','#jqGridPager',{add:false,edit:false,del:false,search:false});
		$("#jqGrid").jqGrid('navButtonAdd','#jqGridPager',{
		       caption:"",
		       buttonicon : "silk-icon-page-excel",
		       title: "Exportar a Excel", 
		       onClickButton : function () { 
		    	   $("#jqGrid").jqGrid('excelExport',{"url":"getExcel"});
		       } 
		});	
		*/
	
	

	
	// the event handler on expanding parent row receives two parameters
	// the ID of the grid tow  and the primary key of the row
	function showChildGrid(parentRowID, parentRowKey) {
	    var childGridID = parentRowID + "_table";
	    var childGridPagerID = parentRowID + "_pager";

	    // send the parent row primary key to the server so that we know which grid to show
	    var childGridURL = "/reportProyect/" + parentRowKey;

	    // add a table and pager HTML elements to the parent grid row - we will render the child grid here
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
	        subGrid: true, // set the subGrid property to true to show expand buttons for each row
	        subGridRowExpanded: showThirdLevelChildGrid, // javascript function that will take care of showing the child grid
	        regional : "es",
	        pager: "#" + childGridPagerID
	    });
	    
		function returnProjectLink(cellValue, options, rowdata, action) 
		{
		    return "<a href='/project-details/" + options.rowId + "' >" + cellValue +"</a>";
		} 
		


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
										},
										title: {
									            text: 'Gráfico Porcentaje de Avance'
									    },
										xAxis : {
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
								        },
										series : [ {
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
										},
											   title: {
									            text: 'Gráfico Valor Ganado'
									        },
		
										xAxis : {
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
								        },
										series : [ {
											name: 'HC (100%)',
											data : items3
										}, {
							            	name: 'VG (100%)',
							            	data: items4
		       						 	} ,{
		       						 		name :'Horas Asignadas',
		       						 		data: items5
		       						 	},{
		       						 		name :'HC (% Avance)',
		       						 		data: items10
		       						 	}
		       						 ,{
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
										},
						                
						                plotOptions: {
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
						                },
							            
										title: {
									            text: 'Gráfico de Sub-Tareas'
									    },
										xAxis : {
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
										},
										yAxis: {
								            title: {
								                text: 'sub-tareas'
								            }
								        },
										series : [ {
										 	name: 'Sub-Tarea Atrasada',
											data : items11
										}, {
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
	
	function mostrarSegundoNivel(parentRowID, parentRowKey) {
	    var childGridID = parentRowID + "_table";
	    var childGridPagerID = parentRowID + "_pager";

	    // send the parent row primary key to the server so that we know which grid to show
	    var childGridURL = "/reportProgramSubTarea/" + parentRowKey;

	    // add a table and pager HTML elements to the parent grid row - we will render the child grid here
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
	                   { label: 'Nombre', name: 'programa', width: 250 },
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
	        subGrid: true, // set the subGrid property to true to show expand buttons for each row
	        subGridRowExpanded: mostrarTercerNivel, // javascript function that will take care of showing the child grid
	        regional : "es",
	        pager: "#" + childGridPagerID
	    });
	    $("#" + childGridID).jqGrid('navGrid',"#" + childGridPagerID,{add:false,edit:false,del:false,search: false,refresh:false});
	}	
	
	function mostrarTercerNivel(parentRowID, parentRowKey) {
	    var childGridID = parentRowID + "_table";
	    var childGridPagerID = parentRowID + "_pager";

	    // send the parent row primary key to the server so that we know which grid to show
	    var childGridURL = "/reportRecurso/" + parentRowKey;

	    // add a table and pager HTML elements to the parent grid row - we will render the child grid here
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
	                   { label: 'Nombre', name: 'programa', width: 250,hidden:true },
	                   { label: 'Responsable', name: 'responsable', width: 150 },
	                   { label: 'Fecha Inicio Planeada',
	                     name: 'pfecini',
	                     width: 120,
	                     formatter: 'date',hidden:true,
	                     formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
	                   },
	                   { label: 'Fecha Termino Planeada',
	                     name: 'pfecter',
	                     width: 120,
	                     sorttype:'date',
	                     formatter: 'date',hidden:true,
	                     formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
	                     
	                   },
	                   { label: 'Fecha Inicio Real',
	                     name: 'rfecini',
	                     width: 120,
	                     sorttype:'date',
	                     formatter: 'date',hidden:true,
	                     formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
	                     
	                   },
	                   { label: 'Fecha Termino Real',
	                     name: 'rfecter',
	                     width: 120,
	                     sorttype:'date',
	                     formatter: 'date',hidden:true,
	                     formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
	                     
	                   },
	                   { label: 'Horas Asignadas', name: 'pai', width: 100 },
	                   { label: 'Horas Consumidas', name: 'pae', width: 100 }              
	        ],
	        rowNum: 10,
	 		height: 'auto',
	        autowidth:true,       
	        regional : "es",
	        pager: "#" + childGridPagerID
	    });

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
		function returnSubTaskLink(cellValue, options, rowdata, action) 
		{
		    return "<a href='/sub-task-details/" + options.rowId + "' >" + cellValue +"</a>";
		} 
	}
	
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
	var getColumnIndexByName = function (grid, columnName) {
        var cm = grid.jqGrid('getGridParam', 'colModel'), i, l = cm.length;
        for (i = 0; i < l; i += 1) {
            if (cm[i].name === columnName) {
                return i; // return the index
            }
        }
        return -1;
    }
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

	var options = {
		    chart: {
		        renderTo: 'container',
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
	        },
	        plotOptions: {
	            series: {
	                cursor: 'pointer',
	                events: {
	                    click: function (e) {
	                    	window.location.href = full + e.point.z;
	                    }
	                }
	            }
	        },
	        yAxis: {
	            title: {
	                text: 'SPI'
	            },plotLines:[{value:0.7,color: 'red',width:2},{value:0.9,color: 'red',width:2}]
	        },
		    series: []
	};
	
	var optionsPie ={
			chart: {
				renderTo: 'container2',
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            type: 'pie'
	        },
	        title: {
	            text: 'Programas por División'
	        },
	        tooltip: {
	            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	        },
	        plotOptions: {
	            pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                point: {
	                    events: {
	                       click: function(event) {
	                          //alert('Person who like' + this.options.name + ' ' + this.options.y);
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
	        },
	        series: []			
	};

	$( "#accordion" ).accordion({
		collapsible: true,
        active: false,
        heightStyle: "content",
		activate: function (e, ui) {
	        var currentHeaderID = ui.newHeader.find("a").attr("id");
			if(currentHeaderID=='burbujas'){
				if($('#container').html() == "") {
					$.ajax({
						  url: '/burbujas',
						  type: 'GET',
						  success: function(data) {
								options.series.push(JSON.parse(data));
								var chart = new Highcharts.Chart(options);
						  },
						  error: function(e) {

						  }
					}); 
				}

			}else if(currentHeaderID=='panel'){
				if($('#container2').html() == "") {
				    
					$.ajax({
						  url: '/pie',
						  type: 'GET',
						  success: function(data) {
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
							  optionsPie.series.push(JSON.parse(data));
								var chartPie = new Highcharts.Chart(optionsPie);

						  },
						  error: function(e) {

						  }
					}); 
					
				}			
			}else if(currentHeaderID=='sub'){
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
				            { label: 'Porcentaje Avance Informado', name: 'pai', width: 100,searchoptions: {sopt:["gt","lt","eq"] } },
				            { label: 'Porcentaje Avance Esperado', name: 'pae', width: 100,searchoptions: {sopt:["gt","lt","eq"] } }              
				        ],
				        rowNum: 20,
				        regional : 'es',
				        height: 'auto',
				        autowidth:true,        
				        subGrid: true, // set the subGrid property to true to show expand buttons for each row
				        subGridRowExpanded: showChildGrid, // javascript function that will take care of showing the child grid
				        pager: "#jqGridPager2",
				        loadComplete: function () {
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
				    });	
 
					$("#jqGrid2").jqGrid('filterToolbar', {stringResult: true,searchOperators: true, searchOnEnter: false, defaultSearch: 'cn'});
					$("#jqGrid2").jqGrid('navGrid','#jqGridPager2',{add:false,edit:false,del:false,search: false});
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
			}else if(currentHeaderID=='ter'){
				if($('#jqGrid3').html() == "") {
					$("#jqGrid3").jqGrid({
				        url: '/reportStateSubTask',
				        mtype: "GET",
				        datatype: "json",
				        page: 1,
				        colModel: [
				            { label: 'sub_task_id',
				               name: 'sub_task_id',
				               width: 100,
				               key: true,
				               hidden:true
				            },                   
				            { label: 'Programa',
				              name: 'programa',
				              width: 250,
				            },
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
				        //subGrid: true, // set the subGrid property to true to show expand buttons for each row
				        //subGridRowExpanded: mostrarSegundoNivel, // javascript function that will take care of showing the child grid
				        pager: "#jqGridPager3",
				        loadComplete: function () {
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
			}
	    }
	});	

});

