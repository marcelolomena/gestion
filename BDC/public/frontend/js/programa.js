$(document).ready(function(){
	$("#recursosListDialog").dialog({
		bgiframe: true,
		autoOpen: false,
        modal: true,
        resizable: true,
        width: 'auto',
        minHeight:'auto',
        open: function(event, ui) {
        	$('.ui-widget-overlay').addClass('overlay-hidden');
           	$("#jqGridRecursos").setGridWidth($(this).width(), true);
        	$("#jqGridRecursos").setGridHeight($(this).height()); 
    	},resizeStop: function(event, ui) {
		    $("#jqGridRecursos").setGridWidth($(this).width(), true);
		    $("#jqGridRecursos").setGridHeight($(this).height());
		}
	});	
	
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
	
	var jsonOptions = {
		    type :"POST",
		    contentType :"application/json; charset=utf-8",
		    dataType :"json"
		};

	function createJSON(postdata) {
		    if (postdata.id === '_empty')
		        postdata.id = null; 
		    return JSON.stringify(postdata)
	}
	
	function unaddlink (cellvalue,options,cell)
	{
	        return cellvalue;
	}

	check = function (value,colname) {
		if (value == 0) 
			   return [false,"Seleccione un valor para : " + colname ];
			else 
			   return [true,""];
	};
	
	checkNum = function (value,colname) {
		var num = new Number(value);
        if(isNaN(num))
		   return [false,"Ingrese horas válidas"];
		else 
		   return [true,""];
	};
	
	var programaModel = [
		                    { label: 'program_id', name: 'program_id', width: 100, key: true, hidden:true }, 
		                    { label: 'Estado', name: 'spi', width: 50,search:false, 
				            	formatter: function (cellvalue) {
	                            	var color;
	                            	var val = Number(cellvalue);
	                            	if (val < 0.8) {
	                             	   color = 'red';
	                            	} else if (val >= 0.8 && val < 0.95) {
	                             	   color = 'yellow';
	                            	} else if (val >= 0.95) {
	                             	   color = 'green';
	                            	}
	                        		return '<span class="cellWithoutBackground" style="background-color:' + color + ';"></span>';
	                        	}
				            	
				            },  	                    
		                    { label: 'Programa', name: 'program_name', width: 300,editoptions: { rows: "1", cols: "50"},formatter: returnProgramLink, unformat:unaddlink,
				            	editable: true, editrules: {edithidden: true,required: true},edittype: "textarea",formoptions: {rowpos:1,colpos:1}
			            	},
		                    { label: 'Descripción', name: 'program_description', width: 300, editoptions: { rows: "3", cols: "50"},hidden: true,
				            	editable: true, editrules: {edithidden: true,required: true},edittype: "textarea",formoptions: {rowpos:2,colpos:1}
			            	},
		                    { label: 'Horas Planeadas', name: 'planned_hours',width: 50,hidden: true,
				            	editable: true, editrules: {edithidden: true,required: true,custom: true, custom_func: checkNum},edittype: "text",
				            	editoptions: {dataInit: function (element) {$(element).width(170);}},formoptions: {rowpos:3,colpos:1}
			            	},
		                    { label: 'Número Programa', name: 'program_code',width: 100,hidden: false,
				            	editable: false, formoptions: {rowpos:3,colpos:2}
			            	},
			            	{ label: 'Gestor de la Demanda', name: 'demand_manager_name',
			            		editable: true,hidden: true, editrules: {edithidden: true,required: true},edittype: "text",
		                        editoptions: {
		                            dataInit: function (element) {$(element).width(170);$(element).addClass("y_demand_manager_name");
		                                window.setTimeout(function () {
		                                    $(element).autocomplete({
		                                  	  appendTo:"body",disabled:false,delay:300,minLength:1,
		                                    source: function(request, response){
		  										this.xhr = $.ajax({
		  											type: "GET",
		  											url: '/listadoPersonal',
		  											data: request,
		  											dataType: "json",
		  											async: false,
		  											success: function( data ) {
		  												response( data );
		  											},
		  											error: function(model, response, options) {
		  												response([]);
		  											}
		  										});$(element).autocomplete('widget').css('font-size','11px');$(element).autocomplete('widget').css('z-index','1000');
		  									},
		                                    autoFocus: true
		                                    });
		                                }, 100);
		                            }
		                        },formoptions: {rowpos:4,colpos:1,label: "<span class='x_demand_manager_name'>Gestor de la Demanda</span>"}
		            		},
		                    { label: 'Lider de Programa', name: 'program_manager_name',
		                    	editable: true,hidden: true, editrules: {edithidden: true,required: true},edittype: "text",
		                        editoptions: {
		                            dataInit: function (element) {$(element).width(170);$(element).addClass("y_program_manager_name");
		                                window.setTimeout(function () {
		                                    $(element).autocomplete({
		                                  	  appendTo:"body",disabled:false,delay:300,minLength:1,
		                                    source: function(request, response){
		  										this.xhr = $.ajax({
		  											type: "GET",
		  											url: '/listadoPersonal',
		  											data: request,
		  											dataType: "json",
		  											async: false,
		  											success: function( data ) {
		  												response( data );
		  											},
		  											error: function(model, response, options) {
		  												response([]);
		  											}
		  										});$(element).autocomplete('widget').css('font-size','11px');$(element).autocomplete('widget').css('z-index','1000');
		  									},
		                                    autoFocus: true
		                                    });
		                                }, 100);
		                            }
		                        },formoptions: {rowpos:4,colpos:2,label: "<span class='x_program_manager_name'>Lider de Programa</span>"}
	                    	},	                    
		                    { label: 'División', name: 'division', width: 250,editable: false, hidden: false, editrules: {edithidden: true},
		  	            	  stype: 'select',searchoptions: {dataUrl: '/listaDivisiones',
		  	            		buildSelect: function (response) {
		  	            			var data = JSON.parse(response);
		  	            		    var s = "<select>";
		  	            		    s += '<option value="0">--Sin División--</option>';
		  	            		    $.each(data, function(i, item) {
		  	            		    	s += '<option value="' + data[i].dId + '">' + data[i].division + '</option>';
		  	            		    });
		  	            		    return s + "</select>";
		  	            		}}  	            			
		                    },
		                    { label: 'Tipo de Programa', name: 'program_type', width: 150,editable: true, hidden: false,
		                    	editrules: {edithidden: true,required: true,custom: true, custom_func: check},edittype: "select", 
		  	  	            	  stype: 'select',searchoptions: {dataUrl: '/listaTipo',
		  	  	            		buildSelect: function (response) {
		  	  	            			var data = JSON.parse(response);
		  	  	            		    var s = "<select>";
		  	  	            		    s += '<option value="0">--Sin Tipo--</option>';
		  	  	            		    $.each(data, function(i, item) {
		  	  	            		    	s += '<option value="' + data[i].id + '">' + data[i].program_type + '</option>';
		  	  	            		    });
		  	  	            		    return s + "</select>";
		  	  	            		}},
		  	  	            	editoptions: {dataUrl: '/listaTipo',
		  	  	            		buildSelect: function (response) {
		  	  	            			var data = JSON.parse(response);
		  	  	            		    var s = "<select>";
		  	  	            		    s += '<option value="0">--Sin Tipo--</option>';
		  	  	            		    $.each(data, function(i, item) {
		  	  	            		    	s += '<option value="' + data[i].id + '">' + data[i].program_type + '</option>';
		  	  	            		    });
		  	  	            		    return s + "</select>";
		  	  	            		},dataInit: function(elem) {$(elem).width(180);}}, formoptions: {rowpos:5,colpos:1} 	  	            		
		                    },
		                    { label: 'Foco Estratégico', name: 'sub_type', width: 150,editable: true,
		                    	hidden: false, editrules: {edithidden: true,required: true,custom: true, custom_func: check},edittype: "select",
		  		  	  	            	  stype: 'select',searchoptions: {dataUrl: '/listaFoco',
		  		  	  	            		buildSelect: function (response) {
		  		  	  	            			var data = JSON.parse(response);
		  		  	  	            		    var s = "<select>";
		  		  	  	            		    s += '<option value="0">--Sin Foco--</option>';
		  		  	  	            		    $.each(data, function(i, item) {
		  		  	  	            		    	s += '<option value="' + data[i].id + '">' + data[i].sub_type + '</option>';
		  		  	  	            		    });
		  		  	  	            		    return s + "</select>";
		  		  	  	            		}},
		  		  	  	            	editoptions: {dataUrl: '/listaFoco',
		  		  	  	            		buildSelect: function (response) {
		  		  	  	            			var data = JSON.parse(response);
		  		  	  	            		    var s = "<select>";
		  		  	  	            		    s += '<option value="0">--Sin Foco--</option>';
		  		  	  	            		    $.each(data, function(i, item) {
		  		  	  	            		    	s += '<option value="' + data[i].id + '">' + data[i].sub_type + '</option>';
		  		  	  	            		    });
		  		  	  	            		    return s + "</select>";
		  		  	  	            		},dataInit: function(elem) {$(elem).width(180);}}, formoptions: {rowpos:5,colpos:2}	  		  	  	            		
	                    	},
		                    { label: 'Estado', name: 'workflow_status', width: 150,editable: true,
	                    		hidden: false, editrules: {edithidden: true,required: true,custom: true, custom_func: check},edittype: "select",
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
			  	  	            	editoptions: {dataUrl: '/listaEstado',
			  	  	            		buildSelect: function (response) {
			  	  	            			var data = JSON.parse(response);
			  	  	            		    var s = "<select>";
			  	  	            		    s += '<option value="0">--Sin Estado--</option>';
			  	  	            		    $.each(data, function(i, item) {
			  	  	            		    	s += '<option value="' + data[i].id + '">' + data[i].workflow_status + '</option>';
			  	  	            		    });
			  	  	            		    return s + "</select>";
			  	  	            		}, dataInit: function(elem) {$(elem).width(180);}}, formoptions: {rowpos:6,colpos:1}	  	  	            		
		                    },
		                    { label: 'Impacto', name: 'impact_type', width: 150,editable: true,
	                    		hidden: false, editrules: {edithidden: true,required: true,custom: true, custom_func: check},edittype: "select",
			  	  	            	  stype: 'select',searchoptions: {dataUrl: '/listaImpacto',
			  	  	            		buildSelect: function (response) {
			  	  	            			var data = JSON.parse(response);
			  	  	            		    var s = "<select>";
			  	  	            		    s += '<option value="0">--Sin Impacto--</option>';
			  	  	            		    $.each(data, function(i, item) {
			  	  	            		    	s += '<option value="' + data[i].id + '">' + data[i].impact_type + '</option>';
			  	  	            		    });
			  	  	            		    return s + "</select>";
			  	  	            		}},
			  	  	            	editoptions: {dataUrl: '/listaImpacto',
			  	  	            		buildSelect: function (response) {
			  	  	            			var data = JSON.parse(response);
			  	  	            		    var s = "<select>";
			  	  	            		    s += '<option value="0">--Sin Impacto--</option>';
			  	  	            		    $.each(data, function(i, item) {
			  	  	            		    	s += '<option value="' + data[i].id + '">' + data[i].impact_type + '</option>';
			  	  	            		    });
			  	  	            		    return s + "</select>";
			  	  	            		}, dataInit: function(elem) {$(elem).width(180);}}, formoptions: {rowpos:6,colpos:2}	  	  	            		
		                    },	                    
		                    { label: 'Fecha Inicio', name: 'initiation_planned_date',hidden: true,
			                      width: 100,editable: true,editrules: {edithidden: true,required: true},
			                      formatter: 'date',
			                      formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
			                     editoptions: {
				            	      size: 10, maxlengh: 10,
				            	      dataInit: function(element) {
				            	        $(element).datepicker({dateFormat: 'yy-mm-dd'})
				            	      },defaultValue: function(){ 
				                          var currentTime = new Date(); 
				                          var month = parseInt(currentTime.getMonth() + 1); 
				                          month = month <= 9 ? "0"+month : month; 
				                          var day = currentTime.getDate(); 
				                          day = day <= 9 ? "0"+day : day; 
				                          var year = currentTime.getFullYear(); 
				                          return year+"-"+month + "-"+day; 
				                        } 
				            	    },formoptions: {rowpos:7,colpos:1}
		                    },	                    
		                    { label: 'Fecha Entrega', name: 'release_date',
		                      width: 100,editable: true,
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
		        	                                $('#jqGridProgram')[0].triggerToolbar();
		        	                            }, 100);
		        	                        }
		        				        });
		        		              },sopt: ["gt","lt","eq"]
		                     },
		                     editoptions: {
			            	      size: 10, maxlengh: 10,
			            	      dataInit: function(element) {
			            	        $(element).datepicker({dateFormat: 'yy-mm-dd'})
			            	      },defaultValue: function(){ 
			                          var currentTime = new Date(); 
			                          var month = parseInt(currentTime.getMonth() + 1); 
			                          month = month <= 9 ? "0"+month : month; 
			                          var day = currentTime.getDate(); 
			                          day = day <= 9 ? "0"+day : day; 
			                          var year = currentTime.getFullYear(); 
			                          return year+"-"+month + "-"+day; 
			                        } 
			            	    },formoptions: {rowpos:7,colpos:2}
		                    },
		                    { label: 'Fecha Cierre', name: 'closure_date',hidden: true,
			                      width: 100,editable: true,editrules: {edithidden: true},
			                      formatter: 'date',
			                      formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
			                     editoptions: {
				            	      size: 10, maxlengh: 10,
				            	      dataInit: function(element) {
				            	        $(element).datepicker({dateFormat: 'yy-mm-dd'})
				            	      },defaultValue: function(){ 
				                          var currentTime = new Date(); 
				                          var month = parseInt(currentTime.getMonth() + 1); 
				                          month = month <= 9 ? "0"+month : month; 
				                          var day = currentTime.getDate(); 
				                          day = day <= 9 ? "0"+day : day; 
				                          var year = currentTime.getFullYear(); 
				                          return year+"-"+month + "-"+day; 
				                        } 
				            	    },formoptions: {rowpos:8,colpos:1}
		                    },		                    
		                    { label: '% Avance', name: 'pai', width: 80,editable: false, formatter: 'number', formatoptions: { decimalPlaces: 2 },searchoptions: {sopt:["gt","lt","eq"] }},
		                    { label: '% Esperado', name: 'pae', width: 80,editable: false, formatter: 'number', formatoptions: { decimalPlaces: 2 },searchoptions: {sopt:["gt","lt","eq"] } },
		                    { label: 'SPI', name: 'spi', width: 80,editable: false, formatter: 'number', formatoptions: { decimalPlaces: 2 },searchoptions: {sopt:["gt","lt","eq"] } },
		                    { label: 'CPI', name: 'cpi', width: 80,editable: false, formatter: 'number', formatoptions: { decimalPlaces: 2 },searchoptions: {sopt:["gt","lt","eq"] } },
		                    { label: 'Número SAP', name: 'sap_number',width: 100,hidden: false,editable: false, searchoptions: {sopt:["gt","lt","eq"] } },
		                    { label: 'Número PPM', name: 'sap_code',width: 100,hidden: true,editable: true,editoptions: {size: 10, maxlengh: 10},formoptions: {rowpos:8,colpos:2} },
		                    { label: 'uname_demand', name: 'uname', editable: true, hidden: true },
		                    { label: 'uname_program', name: 'uname', editable: true, hidden: true },	
		                ];	

            		$("#jqGridProgram").jqGrid({
            	        url: '/listadoPrograma',
            	        mtype: "GET",
            	        datatype: "json",
            	        page: 1,
            	        colModel: programaModel,
            	        rowNum: 10,
            	        regional : 'es',
            	        height: 'auto',
            	        autowidth:true, 
            	        shrinkToFit: false,
            	        forceFit:true,
            	        caption:'Lista de Programas',
            	        pager: "#jqGridProgramPager",
            	        loadComplete: findWithColor,
            	        editurl:"/programaGrabar",
            	        viewrecords: true,
            	        rowList: [5, 10, 20, 50],
            	        gridview: true,
            	        gridComplete: function() {
            	            var recs = parseInt($("#jqGridProgram").getGridParam("records"),10);
            	            if (isNaN(recs) || recs == 0) {
            	                $("#programasWrapper").hide();
            	            }
            	            else {
            	                $('#programasWrapper').show();
            	            }
            	        }
            	    });	
            		$("#jqGridProgram").jqGrid('filterToolbar', {stringResult: true,searchOperators: true, searchOnEnter: false, defaultSearch: 'cn'});
            		$("#jqGridProgram").jqGrid('navGrid','#jqGridProgramPager',{edit: true, add: true, del: true,search: false},
            		    {
            				mtype: 'POST',
            		        height: 'auto',
            		        width: 'auto',
            		        editCaption: "Actualizar Programa",
            		        recreateForm: true,
            		        closeAfterEdit: true,
            		        beforeShowForm: function(form) {

            		        	var $tr = $("#tr_program_name")
            		            $label = $tr.children("td.CaptionTD"),
            		            $data = $tr.children("td.DataTD");
	            		        $data.attr("colspan", "3");
	            		        $data.children("input").css("width", "75%");
	            		        
            		        	var $trs = $("#tr_program_description")
            		            $label = $trs.children("td.CaptionTD"),
            		            $data = $trs.children("td.DataTD");
	            		        $data.attr("colspan", "3");
	            		        $data.children("input").css("width", "75%");	            		        
            	            	
            		        },afterSubmit : function(response,postdata){
            	                var json   = response.responseText; 
            	                var result = JSON.parse(json); 

            	                if(result.error_code>=66100)
            	                	return [false,result.error_text,""]; 
            	                else
            	                	return [true,"",""]
            		        },ajaxEditOptions: jsonOptions,
            		        serializeEditData: createJSON,
            		        errorTextFormat: function (data) {
            		            return 'Error: ' + data.responseText
            		        }
            		    },
            		    {
            		    	mtype: 'POST',
            		    	addCaption: "Agregar Programa",
            		        height: 'auto',
            		        width: 'auto',
            		        modal: true,
            		        ajaxEditOptions: jsonOptions,
            		        serializeEditData: createJSON,
            		        closeAfterAdd: true,
            		        recreateForm: true,
            		        beforeShowForm: function(form) {
            		        	
            		        	var $tr = $("#tr_program_name")
            		            $label = $tr.children("td.CaptionTD"),
            		            $data = $tr.children("td.DataTD");
	            		        $data.attr("colspan", "3");
	            		        $data.children("input").css("width", "75%");

            		        	var $trs = $("#tr_program_description")
            		            $label = $trs.children("td.CaptionTD"),
            		            $data = $trs.children("td.DataTD");
	            		        $data.attr("colspan", "3");
	            		        $data.children("input").css("width", "75%");	            		        
            		        	
            		        },afterSubmit : function(response,postdata){
            	                var json   = response.responseText; 
            	                var result = JSON.parse(json); 

            	                if(result.id<0)
            	                	return [false,result.error_text,""]; 
            	                else
            	                	return [true,"",""]
            		        },
            		        errorTextFormat: function (data) {
            		            return 'Error: ' + data.responseText
            		        }
            		    },
            		    {
            		    	mtype: 'POST',
            		        height: 'auto',
            		        width: 'auto',
            		        afterSubmit : function(response,postdata){
            	                var json   = response.responseText; 
            	                var result = JSON.parse(json); 

            	                if(result.error_code>0)
            	                	return [false,result.error_text,""]; 
            	                else
            	                	return [true,"",""]
            		        },
            		        errorTextFormat: function (data) {
            		            return 'Error: ' + data.responseText
            		        }
            		    }			
            		);
            		$("#jqGridProgram").jqGrid('navButtonAdd','#jqGridProgramPager',{
            		       caption:"",
            		       buttonicon : "ui-icon-gear",//silk-icon-cog
            		       onClickButton : function() { 
            		    	   var grid = $("#jqGridProgram");
            		           var rowKey = grid.getGridParam("selrow");
            		           var rowData = grid.getRowData(rowKey);
            		           var titulo = rowData.program_name;
            		           
            		           if(rowKey === null && typeof rowKey === "object"){
            			           alert('debe seleccionar un programa');
            		           }else{
            					   $("#jqGridRecursos").jqGrid('setGridParam', { url: 'listaRecursos/' + rowKey});
            					   $("#jqGridRecursos").trigger('reloadGrid');
            			           $("#recursosListDialog").dialog({title:titulo}).dialog("open");  	
            		           }
            		       } 
            		});         
	
    $("#jqGridRecursos").jqGrid({
        datatype: "json",
        mtype: "GET",
        autowidth:true,
        colNames: ["sub_task_id","Estado","Recurso","Proyecto", "Tarea", "Subtarea","Planeadas", "Trabajadas", "% Avance","Fecha Inicio","Fecha Termino"],
        colModel: [
           { name: "sub_task_id", width: 10, align: "center", key: true, hidden:true },
           { label: 'Estado', name: 'estado', width: 50,search:false, 
           	formatter: function (cellvalue) {
               	var color;
               	if (cellvalue == 'ATRASADA') {
                	   color = 'red';
               	} else if (cellvalue == 'EN EJECUCION') {
                	   color = 'yellow';
               	} else if (cellvalue == 'TERMINADA A TIEMPO') {
                	   color = 'green';
               	} else if (cellvalue == 'TERMINADA ADELANTADA') {
                	   color = 'blue';
               	} else if (cellvalue == '') {
                	   color = 'white';
               	}

           		return '<span class="cellWithoutBackground" style="background-color:' + color + ';"></span>';
           	}
           	
           },             
           { name: "recurso", width: 200, align: "left", editable:false },
           { name: "proyecto", width: 200, align: "left", editable:false },
           { name: "tarea", width: 200, align: "left", editable:false },
           { name: "subtarea", width: 200, align: "left", editable:false },
           { name: "planeadas", width: 100, align: "center",editable:false },
           { name: "trabajadas", width: 100, align: "center", editable:false },
           { name: "porcentaje", width: 100, align: "center",editable:false },
           { name: "plan_start_date", width: 100,formatter: 'date', formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' } },	
           { name: "plan_end_date", width: 100,formatter: 'date', formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' } },	
        ],
		regional : "es",
        page: 1,
        rowNum: 10,
        viewrecords: true,
        rowList: [10, 20, 50, 100],
        gridview: true,
		pager:"jqGridRecursosPager",
        ajaxRowOptions: { contentType: "application/json" },
        serializeRowData: function (data) { return JSON.stringify(data); },        
   });	

});