$(document).ready(function(){
	$("#subtaskListDialog").dialog({
		autoOpen: false,
        modal: true,
        resizable: true,
        width: 'auto',
        minHeight:'auto',
        open: function(event, ui) {
           	$("#jqGridSubTask").setGridWidth($(this).width(), true);
        	$("#jqGridSubTask").setGridHeight($(this).height()-54); 
    	},resizeStop: function(event, ui) {
		    $("#jqGridSubTask").setGridWidth($(this).width(), true);
		    $("#jqGridSubTask").setGridHeight($(this).height()-54);
		}
	});

	function validatePositive(value, column) {
        if (value < 0)
            return [false, "Please enter a positive value"];
        else
            return [true, ""];
    } 
	
	function showGridStatus(parentRowID, parentRowKey) {
	    var childGridID = parentRowID + "_table";
	    var childGridPagerID = parentRowID + "_pager";
	    var childGridURL = "/listStatus/" + parentRowKey;

	    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

	    $("#" + childGridID).jqGrid({
	        url: childGridURL,
	        mtype: "GET",
	        datatype: "json",
	        colModel: [
	                   { label: '[log_id]', name: '[log_id]', key: true, hidden:true },                   
	                   { label: 'incident_id', name: 'incident_id', hidden:true},
	                   { label: 'Estado', name: 'status_name', width: 150 },
	                   { label: 'Fecha', name: 'log_date', width: 150, formatter: 'date', formatoptions: { srcformat: 'U/1000', newformat: 'Y-m-d h:i:s A' } },
	                   { label: 'Usuario', name: 'user_creation_name', width: 150 },
	                   { label: 'Nota', name: 'note', width: 200 }           
	        ],
			height: 'auto',
	        autowidth:true,
	        regional : "es",
	        rowList: [],        
			pgbuttons: false,     
			pgtext: null,        
			viewrecords: false,    
	        pager: "#" + childGridPagerID
	    });
		
	    $("#" + childGridID).jqGrid('navGrid',"#" + childGridPagerID,{add:false,edit:false,del:false,search: false,refresh:false});	
	}

    var lastSelection;

	function showGridWorker(parentRowID, parentRowKey) {
	    var childGridID = parentRowID + "_table";
	    var childGridPagerID = parentRowID + "_pager";
	    var childGridURL = "/listWorker/" + parentRowKey;

	    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

	    $("#" + childGridID).jqGrid({
	        url: childGridURL,
	        mtype: "GET",
	        datatype: "json",
	        colModel: [
	                   { label: 'task_id', name: 'task_id', key: true, hidden:true },                   
	                   { label: 'sub_task_id', name: 'sub_task_id', hidden:true},
	                   { label: 'uid', name: 'uid', hidden:true },
	                   { label: 'nombre', name: 'nombre', width: 150,editable:false },
	                   { label: 'planeadas', name: 'planeadas', width: 50,editable:false },
	                   { label: 'trabajadas', name: 'trabajadas', width: 50,editable:false },
	                   { label: 'ingresadas', name: 'ingresadas', width: 50,editable: true, edittype:"text", editrules:{custom_func: validatePositive,custom: true,required: true} }
	        ],
			height: 'auto',
	        autowidth:true,
	        regional : "es",
	        rowList: [],        
			pgbuttons: false,     
			pgtext: null,        
			viewrecords: false,
			loadonce : true,
	        pager: "#" + childGridPagerID,
	        onSelectRow: function (id) {
	        	
	        	if (id && id !== lastSelection) {
                    var subgrid = $("#" + childGridID);
	        		subgrid.jqGrid('restoreRow',lastSelection);
	        		subgrid.jqGrid('editRow',id, {keys:true, focusField: 4});
                    lastSelection = id;
                }        	
	        },ajaxRowOptions: { contentType: "application/json" },
	        serializeRowData: function (data) { return JSON.stringify(data); }
	        
	    });
		
	    $("#" + childGridID).jqGrid('navGrid',"#" + childGridPagerID,{add:false,edit:false,del:false,search: false,refresh:false});	
	    
        $("#" + childGridID).jqGrid('navButtonAdd', '#' + childGridPagerID, {
            caption: "Guardar", buttonicon: "ui-icon-disk",
            onClickButton: function () {
            	
 	            var rowKey = $("#" + childGridID).getGridParam("selrow");
	            var rowData = $("#" + childGridID).getRowData(rowKey);
	            var ingresadas = $("#" + childGridID).jqGrid('getCell',rowKey,'ingresadas');
	            var usr = rowData.uid;

            	$("#" + childGridID).jqGrid('saveRow',rowKey,{
                    "succesfunc": function(response) { 
                        return true;                
                    },                                  
                    "url": '/incidentSaveHours',
                    "mtype": "POST",
                    "extraparam": {"uid" : rowData.uid,  
                        "task_id" : rowData.task_id,  
                        "sub_task_id" : rowData.sub_task_id,  
                        "ingresadas" : $("#" + rowKey + "_ingresadas").val()
                    },
                    "aftersavefunc":function reload(rowid, result) { $('#' + parentRowID).trigger("reloadGrid"); } 
                });
            }
        });

	}	
	
	function ValidateCodIR(id){
		var count;
        $.ajax({
            type: "GET",
            url: "/incident_valid_ir/" + id,
            async:false,
            success: function (data) {                            
                count = data;
            } 
        });
        return count;
	}
	
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

	var modelIncident=[
	              { label: 'Tarea', name: 'task_title', width: 200,editable: false
	            	  ,formatter: returnTaskLink, search:false },
	              { label: 'incident_id', name: 'incident_id', key: true, hidden:true },
	              { label: 'Tipo de incidencia', width: 200, name: 'configuration_name', editable: true,
	            	  hidden: false, editrules: {edithidden: true},
	            	  editoptions: {dataInit: function(elem) {$(elem).width(165);$(elem).addClass("ui-state-highlight y_configuration_name");}},
	            	  formoptions: {rowpos:1,colpos:1,label: "<span class='x_configuration_name'>Tipo de incidencia</span>"}
	              },
	              { label: 'Tipo de incidencia', name: 'configuration_id', 
	            	  editable: true,hidden: true, editrules: {edithidden: true}, edittype: "select", 
	            	  editoptions: {dataUrl: '/incident_configuration',
	            	  				dataEvents: [{ type: 'change', fn: function(e) {
	            	  									 var thisval= $(this).val();
	            	  									 $.get('/incidentProgramType/'+thisval, 
                                                                 function(datum)
                                                                 { 
	       	            	  									 $.get('/incident_program/'+datum, 
	                                                                     function(data)
	                                                                     { 
	    	            	  										 		$("select#program_id").html(data);
	                                                                     }); 
                                                                 }); 
	            	  								}
	            	  							 }
	            	               ],dataInit: function(elem) {
	            	                   $(elem).width(180);$(elem).addClass("y_configuration_id");  
	            	               }
	            	  },formoptions: {rowpos:1,colpos:1,label: "<span class='x_configuration_id'>Tipo de incidencia</span>"}
	              },
	              { label: 'Sistema', name: 'program_name', width: 300, editable: true, hidden: false,
	            	  editoptions: {dataInit: function(elem) {$(elem).width(165);$(elem).addClass("ui-state-highlight y_program_name");}},
	            	  formoptions: {rowpos:1,colpos:2,label: "<span class='x_program_name'>Sistema</span>"},
	            	  editrules: {edithidden: true} },
	              { label: 'Sistema', name: 'program_id',
	            	  editable: true,hidden: true, editrules: {edithidden: true}, edittype: "select", 
	            	  editoptions: {dataUrl: '/incident_program_default',
	            		  dataEvents: [{ type: 'change', fn: function(e) {
								 var thispid= $(this).val();
								 $.get('/incidentBusinessMember/'+thispid, 
                                      function(data)
                                      { 
									 		$("select#user_sponsor_id").html(data);
                                      }); 
								 $.get('/incidentNoBusinessMember/'+thispid, 
	                                      function(data)
	                                      { 
										 		$("select#task_owner_id").html(data);
	                                      }); 
									}
	            		  			}
	            		  		],dataInit: function(elem) {
	            	                   $(elem).width(180);$(elem).addClass("y_program_id");  
	            	               }
	            		  },formoptions: {rowpos:1,colpos:2,label: "<span class='x_program_id'>Sistema</span>"}
	              },
	              { label: 'Usuario', width: 150, name: 'sponsor_name',
	            	  editable: true, hidden: false, editrules: {edithidden: true},
	            	  editoptions: {dataInit: function(elem) {$(elem).width(165);$(elem).addClass("ui-state-highlight y_sponsor_name");}},
	            	  formoptions: {rowpos:2,colpos:1,label: "<span class='x_sponsor_name'>Usuario</span>"},
	              },
	              { label: 'Usuario', name: 'user_sponsor_id',
	            	  editable: true, hidden: true, editrules: {edithidden: true}, edittype: "select",
	            	  editoptions: {dataUrl: '/incident_program_default',
	            		  dataInit: function(elem) {$(elem).width(180);$(elem).addClass("y_user_sponsor_id");
	            		  }
	            	  },formoptions: {rowpos:2,colpos:1,label: "<span class='x_user_sponsor_id'>Usuario</span>"}
   	              },	    
	              { label: 'Responsable', name: 'owner_name', width: 150,editable: true, hidden: false, editrules: {edithidden: true},
	            	  editoptions: {dataInit: function(elem) {$(elem).width(165);$(elem).addClass("ui-state-highlight y_owner_name");}},
	            	  formoptions: {rowpos:2,colpos:2,label: "<span class='x_owner_name'>Responsable</span>"},
	              },
	              { label: 'Responsable', name: 'task_owner_id', 
	            	  editable: true,hidden: true, editrules: {edithidden: true}, edittype: "select", 
	            	  editoptions: {dataUrl: '/incident_program_default',
	            		  dataInit: function(elem) {$(elem).width(180);$(elem).addClass("y_task_owner_id");
	            		  }
	            	  },formoptions: {rowpos:2,colpos:2,label : "<span class='x_task_owner_id'>Responsable</span>"}
	              },
	              { label: 'Prioridad', name: 'severity_description', width: 150,
	            	  editable: false, hidden: false, editrules: {edithidden: true},
	            	  stype: 'select',searchoptions: {dataUrl: '/incidentSeverityList'}
	              },              
	              { label: 'Prioridad', name: 'severity_id', 
	            	  editable: true,hidden: true, editrules: {edithidden: true}, edittype: "select", 
	            	  editoptions: {dataUrl: '/incidentSeverityList',
	            		  dataEvents: [{ type: 'change', fn: function(e) {
								 var thistid= $(this).val();
								 		$.get('/incidentSeverityDays/'+thistid, 
	                                      function(data)
	                                      { 
								 				var dateFrom = $("input#date_creation").val();
								 				var from = dateFrom.split('-');
								 				var to = new Date(from[0], from[1] - 1, from[2]);
								 				to.setTime(to.getTime() +  (data * 24 * 60 * 60 * 1000));
								 				var dd = to.getDate(); 
								 				var mm = to.getMonth()+1; 
								 				var yyyy = to.getFullYear(); 
								 				if(dd<10){dd='0'+dd} 
								 				if(mm<10){mm='0'+mm} 
										 		$("input#date_end").val(yyyy+"-"+mm+"-"+dd);
	                                      }); 
									}
	            		  			}
	            		  		],dataInit: function(elem) {
	            	                   $(elem).width(180);  
	            	               }
	            		  },formoptions: {rowpos:3,colpos:1}
	              },	              
	              { label: 'Fecha Creación', name: 'date_creation',width: 100,editable: true,editrules:{required:true},
	            	  editoptions: {
	            	      size: 10, maxlengh: 10,
	            	      dataInit: function(element) {
	            	        $(element).datepicker({dateFormat: 'yy-mm-dd', maxDate: 0})
	            	      },defaultValue: function(){ 
	                          var currentTime = new Date(); 
	                          var month = parseInt(currentTime.getMonth() + 1); 
	                          month = month <= 9 ? "0"+month : month; 
	                          var day = currentTime.getDate(); 
	                          day = day <= 9 ? "0"+day : day; 
	                          var year = currentTime.getFullYear(); 
	                          return year+"-"+month + "-"+day; 
	                        } 
	            	    },formatter: 'date',formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
	            	    searchoptions:{
				              dataInit:function(el){
					              	$(el).datepicker({
						              	dateFormat:'yy-mm-dd',
						              	changeYear: true,
				                        changeMonth: true,                            
				                        onSelect: function (dateText, inst) {
				                            setTimeout(function () {
				                                $('#jqGridIncident')[0].triggerToolbar();
				                            }, 100);
				                        }
							        });
					              },sopt: ["gt","lt","eq"]
			             },formoptions: {rowpos:4,colpos:1}
	              },
	              { label: 'Fecha Término', name: 'date_end',width: 100,editable: true,
	            	  formatter: 'date',
	            	  formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
	            	  editoptions: {size: 10, readonly: "readonly",dataInit: function (domElem) {$(domElem).addClass("ui-state-highlight"); } },
	            	  searchoptions:{
			              dataInit:function(el){
				              	$(el).datepicker({
					              	dateFormat:'yy-mm-dd',
					              	changeYear: true,
			                        changeMonth: true,                            
			                        onSelect: function (dateText, inst) {
			                            setTimeout(function () {
			                                $('#jqGridIncident')[0].triggerToolbar();
			                            }, 100);
			                        }
						        });
				              },sopt: ["gt","lt","eq"]
		             },formoptions: {rowpos:4,colpos:2}
	              },	              
	              { label: 'Número IR', name: 'ir_number', width: 100,editable: true,
	            	  editrules:{required:true},
	            	  editoptions: {size: 10, maxlengh: 10},
	            	  searchoptions: {sopt:["gt","lt","eq"] },
	            	  formoptions: {rowpos:5,colpos:1}
	              },
	              { label: 'Descripción Corta', name: 'brief_description', editable: true,
	            	  editrules:{required:true},edittype: "textarea",
	            	  editoptions: { rows: "3", cols: "25"},
	            	  formoptions: {rowpos:6,colpos:1}
	              },
	              { label: 'Descripción Extensa', name: 'extended_description', editable: true,
	            	  hidden: true, editrules: {edithidden: true},edittype: "textarea",
	            	  editoptions: { rows: "3", cols: "25"},
	            	  formoptions: {rowpos:6,colpos:2}
	              },
	              { label: 'user_creation_id', name: 'user_creation_id', hidden:true }, 
	              { label: 'task_id', name: 'task_id', hidden:true },
	              { label: 'Estado', name: 'status_name', width: 150,
	            	  editable: false, hidden: false, editrules: {edithidden: true},
	            	  stype: 'select',searchoptions: {dataUrl: '/incidentStatusList'},
	            	  
	              },	              
	              { label: 'Estado', name: 'status_id', 
	            	  editable: true,hidden: true, editrules: {edithidden: true}, edittype: "select", 
	            	  editoptions: {dataUrl: '/incidentStatusList',dataInit: function(elem) {
   	                   $(elem).width(180);  
   	               }},formoptions: {rowpos:7,colpos:1,label: "<span style='vertical-align: top;'>Estado</span>"}
	              },
	              { label: 'Observación', name: 'note', editable: true,hidden: true, 
	            	  editrules: {edithidden: true},edittype: "textarea", editoptions: { rows: "3", cols: "25"},formoptions: {rowpos:7,colpos:2} },
	          ];	
	
	$("#jqGridIncident").jqGrid({
        url: '/incidentList',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelIncident,
        rowNum: 20,
        regional : 'es',
        height: 'auto',
        autowidth:true, 
        shrinkToFit: false,
        forceFit:true,
        subGrid: true, 
        subGridRowExpanded: showGridStatus,
        caption:'Lista de Incidentes',
        pager: "#jqGridIncidentPager",
        loadComplete: findWithColor,
        editurl:"/incidentSave",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        gridview: true,
    });	
	$("#jqGridIncident").jqGrid('filterToolbar', {stringResult: true,searchOperators: true, searchOnEnter: false, defaultSearch: 'cn'});
	$("#jqGridIncident").jqGrid('navGrid','#jqGridIncidentPager',{edit: true, add: true, del: true,search: false, position: "left", cloneToTop: false },
        {
    		mtype: 'POST',
    		url: '/incidentUpdate',
            height: 'auto',
            width: 'auto',
            editCaption: "Actualizar Incidencia",
            recreateForm: true,
            closeAfterEdit: true,
            ajaxEditOptions: jsonOptions,
            serializeEditData: createJSON,
            beforeShowForm: function(form) {
            	$('.x_configuration_id',form).show();
            	$('.y_configuration_id',form).hide();
            	$('.x_program_id',form).show();
            	$('.y_program_id',form).hide();

            	$('.x_user_sponsor_id',form).show();
            	$('.y_user_sponsor_id',form).hide();
            	
            	$('.x_task_owner_id',form).show();
            	$('.y_task_owner_id',form).hide();

            	$('input#configuration_name',form).attr('readonly','readonly');
            	$('input#program_name',form).attr('readonly','readonly');
            	
            	$('input#sponsor_name',form).attr('readonly','readonly');
            	$('input#owner_name',form).attr('readonly','readonly');
            	$('textarea#brief_description',form).attr('readonly','readonly');
            	$('textarea#extended_description',form).attr('readonly','readonly');
            	$('input#date_creation',form).attr('readonly','readonly');
            	$('input#ir_number',form).attr('readonly','readonly');
            	
            	$('input#date_creation',form).datepicker( "destroy" );
            	
            	$('<tr class="FormData"><td class="CaptionTD ui-widget-content" colspan="4">' +
            	           '<div style="padding:3px" class="ui-widget-header ui-corner-all">' +
            	           '<b>Ingreso de Estado</b></div></td></tr>')
            	           .insertBefore('#tr_status_id');
               
            },afterShowForm: function($form) {
                $form.closest(".ui-jqdialog").closest(".ui-jqdialog").position({
                    my: 'center',
                    at: 'center',
                    of: window
                  });
            },afterSubmit : function(response,postdata){
                var json   = response.responseText; 
                var result = JSON.parse(json); 

                if(result.error_code!=0)
                	return [false,result.error_text,""]; 
                else
                	return [true,"",""]
            },beforeSubmit : function (postdata, formid) {
            	if( postdata.status_id == 0) {
            		return [false,"Estado: Debe escoger un valor",""];
            	} if( $.trim(postdata.note) == '') {//.length
            		return [false,"Observación: Debe ingresar un texto",""];
            	} else {
            		return [true,"",""]
            	}
            },errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }
        },
        {
        	//template: template,
        	addCaption: "Agregar Incidencia",
            height: 'auto',
            width: 'auto',
            modal: true,
            ajaxEditOptions: jsonOptions,
            serializeEditData: createJSON,
            closeAfterAdd: true,
            recreateForm: true,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },afterSubmit : function(response,postdata){
                var json   = response.responseText; 
                var result = JSON.parse(json); 
                if(result.error_code!=0)
                	return [false,result.error_text,""]; 
                else
                	return [true,"",""]
            },beforeSubmit : function (postdata, formid) {
            	if( postdata.configuration_id == 0) {
            		return [false,"Tipo de incidencia: Debe escoger un valor",""];
            	} if( postdata.program_id == 0) {
            		return [false,"Sistema: Debe escoger un valor",""];
            	} if( postdata.user_sponsor_id == 0) {
            		return [false,"Usuario: Debe escoger un valor",""];
            	} if( postdata.severity_id == 0) {
            		return [false,"Prioridad: Debe escoger un valor",""];
            	} if( postdata.task_owner_id == 0) {
            		return [false,"Responsable: Debe escoger un valor",""];
            	} if( ValidateCodIR(postdata.ir_number) == 0) {
            		//return [false,"Número IR: Ya existe",""];
            		alert('El número IR : ' + postdata.ir_number + ' ya existe en el sistema. Se creo un nuevo incidente con este mismo código IR');
            		return [true,"",""]
            	} else {
            		return [true,"",""]
            	}
            },beforeShowForm: function(form) {
            	$('.x_configuration_name', form).hide();
            	$('.y_configuration_name', form).hide();
            	$('.x_program_name',form).hide();
            	$('.y_program_name',form).hide();
            	
            	$('.x_sponsor_name',form).hide();
            	$('.y_sponsor_name',form).hide();
            	$('.x_owner_name',form).hide();
            	$('.y_owner_name',form).hide();
            	
            	$('#tr_status_id', form).hide();
            	$('#tr_note', form).hide();
            	
            },afterShowForm: function($form) {
                $form.closest(".ui-jqdialog").closest(".ui-jqdialog").position({
                    my: 'center',
                    at: 'center',
                    of: window
                  });
            },
        },
        {
        	mtype: 'GET',
        	url: '/incidentDelete',
            height: 'auto',
            width: 'auto',
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }
        }		
	);
	$("#jqGridIncident").jqGrid('navButtonAdd','#jqGridIncidentPager',{
	       caption:"",
	       buttonicon : "silk-icon-page-excel",
	       title: "Exportar a Excel", 
	       onClickButton : function () { 
	    	   var grid = $("#jqGridIncident");
	           var rowKey = grid.getGridParam("selrow");
	           var url = 'incident-excel';
	    	   $("#jqGridIncident").jqGrid('excelExport',{"url":url});
	       } 
	});
	$("#jqGridIncident").jqGrid('navButtonAdd','#jqGridIncidentPager',{
	       caption:"",
	       buttonicon : "ui-icon-gear",//silk-icon-cog
	       onClickButton : function() { 

	    	   var grid = $("#jqGridIncident");
	           var rowKey = grid.getGridParam("selrow");
	           var rowData = grid.getRowData(rowKey);
	           var tId = rowData.task_id;
	           var titulo = $(rowData.task_title).text();
	           
	           if(rowKey === null && typeof rowKey === "object"){
		           alert('debe seleccionar una tarea');
	           }else{
		           $("#jqGridSubTask").jqGrid({
		                url: 'incidentSubTask/' + tId,
		                datatype: "json",
		                mtype: "GET",
		                autowidth:true,
		                colNames: ["sub_task_id","Sub-Tarea", "Inicio Planeado", "Término Planeado", "% Avance"],
		                colModel: [
		                   { name: "sub_task_id", width: 10, align: "center", key: true, hidden:true },
		                   { name: "task", width: 200, editable:false },
		                   { name: "plan_start_date", width: 100, formatter: 'date', formatoptions: { srcformat: 'U/1000', newformat: 'Y-m-d' },editable:false },
		                   { name: "plan_end_date", width: 100, formatter: 'date', formatoptions: { srcformat: 'U/1000', newformat: 'Y-m-d' },editable:false },
		                   { name: "completion_percentage", width: 50, editable:false }
		                ],
		       			regional : "es",
		       			rowList: [],        
		       			pgbuttons: false,     
		       			pgtext: null,         
		       			viewrecords: false,    
		                loadonce: true,
		                subGrid: true, 
		                subGridRowExpanded: showGridWorker,
		           });
		           $("#jqGridSubTask").jqGrid("navGrid","#jqGridSubTaskPager",{edit:false,add:false,del:false});

		           $("#subtaskListDialog").dialog({title:titulo}).dialog("open");  	
	           }
	       } 
	});   		

});