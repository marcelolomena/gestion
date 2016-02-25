$(document).ready(function(){
	$("#subtaskListDialog").dialog({
		bgiframe: true,
		autoOpen: false,
        modal: true,
        resizable: true,
        width: 'auto',
        minHeight:'auto',
        open: function(event, ui) {
        	$('.ui-widget-overlay').addClass('overlay-hidden');
           	$("#jqGridSubTask").setGridWidth($(this).width(), true);
        	$("#jqGridSubTask").setGridHeight($(this).height()); 
    	},resizeStop: function(event, ui) {
		    $("#jqGridSubTask").setGridWidth($(this).width(), true);
		    $("#jqGridSubTask").setGridHeight($(this).height());
		}
	});
	
    var lastSel, subTaskDelOptions = {
		mtype: 'GET',
		onclickSubmit: function(options, rowid) {
			var rowData = $(this).jqGrid("getRowData", rowid);
			options.url += "/incidentDelSubTask?" + $.param({
				sub_task_id: rowData.sub_task_id
			});
			return {};
		}
    };
	
    var workerDelOptions = {
		mtype: 'GET',
		onclickSubmit: function(options, rowid) {
			var rowData = $(this).jqGrid("getRowData", rowid);
			options.url += "/incidentDelMember?" + $.param({
				sub_task_id: rowData.sub_task_id,
				uid: rowData.uid,
				task_id:rowData.task_id 
			});
			return {};
		}
    };    

    $("#jqGridSubTask").jqGrid({
        datatype: "json",
        mtype: "GET",
        autowidth:true,
        colNames: ["Acciones","sub_task_id","Sub-Tarea", "Inicio Planeado", "Término Planeado","Inicio Real", "Último Ingreso", "% Avance","% Esperado","Horas Totales","fecini"],
        colModel: [
			{name:'act',index:'act',width:55,align:'center',sortable:false,formatter:'actions',resize: false,
			    formatoptions:{
			        keys: true, 
			        delbutton:true,
			        onEdit:function(rowid) {
			        },
			        onSuccess:function(jqXHR) {
			            return true;
			        },
			        onError:function(rowid, jqXHR, textStatus) {
			        	/*
			            alert("in onError used only for remote editing:"+
			                  "\nresponseText="+jqXHR.responseText+
			                  "\nstatus="+jqXHR.status+
			                  "\nstatusText"+jqXHR.statusText+
			                  "\n\nNo necesitamos devolver nada");
			            */
			        },
			        afterSave:function(rowid) {
			        	$("#jqGridSubTask").trigger("reloadGrid"); 
			        },
			        afterRestore:function(rowid) {
			        },
			        delOptions: subTaskDelOptions
			    }},
           { name: "sub_task_id", width: 10, align: "center", key: true, hidden:true },
           { name: "title", width: 200, hidden:false, editable: false},
           { name: "plan_start_date", width: 85, align: "center",formatter: 'text',
				formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },editable:true,
				editoptions: {
					size: 10, maxlengh: 10,
					dataInit: function(element) {
         	        $(element).datepicker({dateFormat: 'yy-mm-dd'})
					}
				}
       	   },
           { name: "plan_end_date", width: 85, align: "center", formatter: 'text',
				formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },editable:true,
				editoptions: {
               	    size: 10, maxlengh: 10,
               	    dataInit: function(elemento) {
						$(elemento).datepicker({dateFormat: 'yy-mm-dd'})
					}
				}
       	   },
           { name: "real_start_date", width: 150, align: "center", formatter: 'date',
				formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },editable:false
       	   },
           { name: "real_end_date", width: 150, align: "center", formatter: 'date',
				formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },editable:false
       	   }, 
           { name: "completion_percentage", width: 50, align: "center", editable:true, editrules:{required:false} },
           { name: "expected_percentage", width: 50, align: "center", editable:false },
           { name: "hours", width: 50, align: "center", editable:false },
           { name: "fecini", hidden:true,editable:true,editrules: {edithidden: true} }
        ],
		regional : "es",
		height:'auto',
		viewrecords: true,
        rowList: [5, 10, 20, 50],
        gridview: true,
        page: 1,
        rowNum: 20,
		pager:"jqGridSubTaskPager",
        subGrid: true, 
        ajaxRowOptions: { contentType: "application/json" },
        serializeRowData: function (data) { return JSON.stringify(data); },        
        subGridOptions: { 
			"plusicon" : "ui-icon-triangle-1-e", 
            "minusicon" : "ui-icon-triangle-1-s", 
            "openicon" : "ui-icon-arrowreturn-1-e",
            "reloadOnExpand" : true
        }, 
        subGridRowExpanded: showGridWorker,
        editurl: '/incidentSaveSubTask',
        onSelectRow: function(id) {
            if (id && id !== lastSel) {
                if (typeof lastSel !== "undefined") {
                	$("#jqGridSubTask").jqGrid('restoreRow',lastSel);
                }
                lastSel = id;
            }
        },
        gridComplete: function() {
            var recs = parseInt($("#jqGridSubTask").getGridParam("records"),10);
            if (isNaN(recs) || recs == 0) {
                $("#subTaskWrapper").hide();
            }
            else {
                $('#subTaskWrapper').show();
            }
        }
   });
    
   $("#jqGridSubTask").jqGrid("navGrid","#jqGridSubTaskPager",{edit: false, add: false, del: false,search: false, refresh: false,position: "left", cloneToTop: false },
		{},
		{
		addCaption: "Agregar Sub-Tarea",
		height: 'auto',
		width: 'auto',
		modal:true,
		ajaxEditOptions: jsonOptions,
		serializeEditData: createJSON,
		closeAfterAdd: true,
		recreateForm: true,
		errorTextFormat: function (data) {
			return 'Error: ' + data.responseText
		},
		beforeShowForm:function (form) {
			$('#tr_plan_start_date',form).hide();
			$('#tr_plan_end_date',form).hide();
			$('#tr_completion_percentage',form).hide();
		},
		afterShowForm:function(){

		},
		onClose:function(){

		}
		},
		{}
   );
   $("#jqGridSubTask").bind("jqGridInlineSuccessSaveRow",
   	    function (e, jqXHR, rowid, options) {
   	        var ret=JSON.parse(jqXHR.responseText);
   	        if(ret.error_code>0)alert(ret.error_text);
   	        return [true, jqXHR.responseText];
   	    }
   );   
   
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
	                   { label: 'Estado', name: 'status_name', width: 120,resizable: false },
	                   { label: 'Fecha', name: 'log_date', width: 150, formatter: 'date', formatoptions: { srcformat: 'U/1000', newformat: 'Y-m-d h:i:s A' } },
	                   { label: 'Usuario', name: 'user_creation_name', width: 180 },
	                   { label: 'Nota', name: 'note', width: 460 }           
	        ],
			height: 'auto',
	        //autowidth:true,
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
				{label: 'Acciones',name:'act',index:'act',width:25,align:'center',sortable:false,formatter:'actions',
				formatoptions:{
					keys: true, // we want use [Enter] key to save the row and [Esc] to cancel editing.
					delbutton:true,
					onEdit:function(rowid) {
						//console.log("in onEdit: rowid="+rowid);
					},
					onSuccess:function(jqXHR) {
						return true;
					},
					onError:function(rowid, jqXHR, textStatus) {
						alert("in onError used only for remote editing:"+
							  "\nresponseText="+jqXHR.responseText+
							  "\nstatus="+jqXHR.status+
							  "\nstatusText"+jqXHR.statusText+
							  "\n\nNo necesitamos devolver nada");
					},
					afterSave:function(rowid, response, postdata, options) {
						//console.log('rowid:' + rowid);
						//alert("en afterSave (Submit): rowid="+rowid+"\nNo necesitamos devolver nada");
						$("#jqGridSubTask").trigger("reloadGrid"); 
					},
					afterRestore:function(rowid) {
						//alert("en afterRestore (Cancel): rowid="+rowid+"\nNo necesitamos devolver nada");
					},
					delOptions: workerDelOptions
					
			   }},	                   
			   { label: 'sub_task_id', name: 'sub_task_id', hidden:true,editable: true, editrules: { edithidden: false },editoptions:{value:parentRowKey, defaultValue:parentRowKey}, hidedlg: true},
			   { label: 'task_id', name: 'task_id', hidden:true, editable: true, editrules: { edithidden: false }, hidedlg: true },   
			   { label: 'uid', name: 'uid', key: true, hidden:true },
			   { label: 'Nombre', name: 'nombre', width: 100,editable:true,edittype:"text", editrules:{required: true},
					editoptions: {
						dataInit: function (element) {
							window.setTimeout(function () {
								$(element).autocomplete({
									id: 'AutoComplete',
								source: function(request, response){
									this.xhr = $.ajax({
										type: "GET",
										url: '/incidentAddMember',
										data: request,
										dataType: "json",
										success: function( data ) {
											response( data );
										},
										error: function(model, response, options) {
											response([]);
										}
									});
								},
								autoFocus: true
								});
							}, 100);
						}
					}
				},
				{ label: 'Asignadas', name: 'planeadas', width: 50,align: "center",editable:true, edittype:"text", editrules:{number: true, required: true} },
				{ label: 'Trabajadas', name: 'trabajadas', width: 50,align: "center",editable:false, edittype:"text",  },
				{ label: 'Fecha', name: 'task_for_date',width: 85,align: "center",editable: true,
				  editoptions: {
					  size: 10, maxlengh: 10,
					  dataInit: function(element) {
						$(element).datepicker({dateFormat: 'yy-mm-dd'})
					  }
					},formatter: 'date',formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' }
				},
				{ label: 'Ingresadas', name: 'ingresadas', width: 50,align: "center",editable: true, edittype:"text" },
				{ label: 'Nota', name: 'nota', width: 50,editable: true, edittype:"textarea", editoptions:{ rows:"1",cols:"10"},
				}
	        ],
			height: 'auto',
	        autowidth:true,
	        regional : "es",
	        rowList: [],        
			pgbuttons: false,     
			pgtext: null,        
			viewrecords: false,
			loadonce : true,
			height: '100%',
			emptyDataText:'No hay datos',
	        pager: "#" + childGridPagerID,
	        ondblClickRow: function(id, ri, ci) {
	        	$("#" + childGridID).jqGrid('editRow',id,true,null,null, '/incidentSaveHours');
	        },
	        editurl: '/incidentSaveHours',
	        onSelectRow: function(id) {
	            if (id && id !== lastSelection) {
	            	
	                if (typeof lastSelection !== "undefined") {
	                	$("#" + childGridID).jqGrid('restoreRow',lastSelection);
	                }
	                lastSelection = id;
	            }
	        },
	        ajaxRowOptions: { contentType: "application/json" },
	        serializeRowData: function (data) { return JSON.stringify(data); },
	        gridComplete: function(){
	    	    if ($("#" + childGridID).getGridParam('records') == 0){ 
	    	        $("#" + childGridID).closest("div.ui-jqgrid-view").children("div.ui-jqgrid-hdiv").hide();
	    	        //$("#" + childGridID + "_save_button").hide();
	    	    }	    	    
	        }	
	    });
	    
	    $("#" + childGridID).jqGrid('inlineNav', "#" + childGridPagerID, {
	    	edit: false,
	        editicon: "ui-icon-pencil",
	        add: true,
	        addicon:"ui-icon-plus",
	        save: true,
	        saveicon:"ui-icon-disk",
	        cancel: true,
	        cancelicon:"ui-icon-cancel",
	        edittext: "Editar",
	        addtext: "Agregar",
	        savetext: "Guardar",
	        canceltext: "Cancelar",
	        addParams: {
	            position: "afterSelected", 
	            useDefValues:true,
	            addRowParams: {
	                keys: true,
	                extraparam: {
	                    "task_name": $("#subtaskListDialog").dialog( "option", "title" ),
	                },
		            oneditfunc: function (rowid) {
	                    //console.log("new row with rowid=" + rowid + " are added.");
	                },
			        aftersavefunc: function (rowid, response, options) {
			        	//console.log('response:' + response);
			        	$("#jqGridSubTask").trigger("reloadGrid"); 
			        },
	            }
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
	
	
	formatDate=function() {
	    var d = new Date(),
	        month = '' + (d.getMonth() + 1),
	        day = '' + d.getDate(),
	        year = d.getFullYear();
	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;
	    return [year, month, day].join('-');
	}
	
	restaFechas = function(f1,f2)
	 {
	 var aFecha1 = f1.split('-'); 
	 var aFecha2 = f2.split('-'); 
	 var fFecha1 = Date.UTC(aFecha1[0],aFecha1[1]-1,aFecha1[2]); 
	 var fFecha2 = Date.UTC(aFecha2[0],aFecha2[1]-1,aFecha2[2]); 
	 var dif = fFecha2 - fFecha1;
	 var dias = Math.floor(dif / (1000 * 60 * 60 * 24)); 
	 return dias;
	 }

	var modelIncident=[
		{ 
		label: 'Atraso', 
		name: 'diferencia',
		search:false, 
		editable: false,
		width: 60,
		resizable: false,
		formatter: function (cellvalue, options, rowObject) {
			var color;
			var val = restaFechas(formatDate(),rowObject.date_end);
			if (val > 0) {
			   color = 'green';
			} else if (val == 0) {
			   color = 'yellow';
			} else if (val < 0 ) {
			   color = 'red';
			}
			return '<span class="cellWithoutBackground" style="background-color:' + color + ';"></span>';
		}
		},     
		{ 
		label: 'Tarea', 
		name: 'task_title', 
		width: 200,
		editable: false,
		formatter: returnTaskLink,
		search:false 
		},
		{
		label: 'incident_id', 
		name: 'incident_id', 
		key: true, 
		hidden:true 
		},
		{
		label: 'Tipo de incidencia', 
		width: 200, 
		name: 'configuration_name', 
		editable: true,
		hidden: false, 
		editrules: {edithidden: true},
		editoptions: {
			dataInit: function(elem) {$(elem).width(165);$(elem).addClass("ui-state-highlight y_configuration_name");}
		},
		formoptions: {
			rowpos:1,colpos:1,label: "<span class='x_configuration_name'>Tipo de incidencia</span>"
		}
		},
		{//Tipo de Incidencia (Configuration_ID) 
		label: 'Tipo de incidencia', 
		name: 'configuration_id', 
		editable: true,
		hidden: true, 
		editrules: {edithidden: true}, 
		edittype: "select", 
		editoptions: {
			dataUrl: '/incident_configuration',
			dataEvents: [{ type: 'change', fn: function(e) {
				var thisval= $(this).val();
				if(thisval!=0){
					$.ajax({
						type: "GET",
						url: '/incidentProgramType/'+thisval,
						async:false,
						success: function (datum) {                            
							$.ajax({
								type: "GET",
								url: '/incident_program/'+datum,
								async:false,
								success: function (data) {  
									$("select#program_id").html(data);
								} 
							});
						} 
					});

					$.ajax({
						type: "GET",
						url: '/incidentSeverityConfigurationList?id='+thisval,
						async:false,
						success: function (data) { 
							var s = "<select>";
							s += '<option value="0">--Escoger Severidad--</option>';
							$.each(data, function(i, item) {
								s += '<option value="' + data[i].severity_id + '">' + data[i].severity_description + '</option>';
							});
							s += "</select>";
							$("select#severity_id").html(s);
						}
					});		            	  							        
				}
			}}],
			dataInit: function(elem) {
				$(elem).width(180);$(elem).addClass("y_configuration_id");  
			}
		},
		formoptions: {rowpos:1,colpos:1,label: "<span class='x_configuration_id'>Tipo de incidencia</span>"}
		}, //Fin Tipo de Incidencia
	    {
		label: 'Sistema', name: 'program_name', width: 300, editable: true, hidden: false,
		editoptions: {
			dataInit: function(elem) {$(elem).width(165);$(elem).addClass("ui-state-highlight y_program_name");}
		},
		formoptions: {rowpos:1,colpos:2,label: "<span class='x_program_name'>Sistema</span>"},
	    editrules: {edithidden: true} 
		},
	    { 
		label: 'Sistema', 
		name: 'program_id',
		editable: true,
		hidden: true, 
		editrules: {edithidden: true}, 
		edittype: "select", 
		editoptions: {
			//dataUrl: '/incident_program_default',
			dataUrl: '/incidentProgramConfigurationList',
				postData:function(rowid){
					var idConf=$("#jqGridIncident").getRowData($("#jqGridIncident").getGridParam("selrow")).configuration_id;
					if (idConf!=undefined){
						return {id:idConf};
					}else{
						return {id:1};
					}
				},
				buildSelect: function (response) {
					var grid = $("#jqGridIncident");
					var rowKey = grid.getGridParam("selrow");
					var rowData = grid.getRowData(rowKey);
					var thissid = rowData.program_name;
					var data = JSON.parse(response);
					var s = "<select>";//el default
					s += '<option value="0">--Escoger Programa--</option>';
					$.each(data, function(i, item) {
						if(data[i].program_name==thissid){
							s += '<option value="' + data[i].program_id + '" selected>' + data[i].program_name + '</option>';
						}else{
							s += '<option value="' + data[i].program_id + '">' + data[i].program_name + '</option>';
						}
					});
					return s + "</select>";
	  	        },			
			dataEvents: [{ type: 'change', fn: function(e) {
							var thispid= $(this).val();
							$.ajax({
								type: "GET",
								url: '/incidentNoBusinessMember/'+thispid,
								async:false,
								success: function (data) {                            
									$("select#task_owner_id").html(data);
								} 
							});	
						}}],
			dataInit: function(elem) {$(elem).width(180);$(elem).addClass("y_program_id");}
			},
		formoptions: {rowpos:1,colpos:2,label: "<span class='x_program_id'>Sistema</span>"}
	    },
	    { 
		label: 'Usuario', 
		width: 150, 
		name: 'sponsor_name',
	    editable: true, 
		hidden: false, 
		editrules: {edithidden: true},
	    editoptions: {dataInit: function(elem) {$(elem).width(165);$(elem).addClass("ui-state-highlight y_sponsor_name");}},
	    formoptions: {rowpos:2,colpos:1,label: "<span class='x_sponsor_name'>Usuario</span>"},
	    },
        { 
		label: 'Usuario', 
		name: 'user_sponsor_id',
        editable: true, 
		hidden: true, 
		editrules: {edithidden: true},
		edittype: "text",
        editoptions: {
            dataInit: function (element) {
				$(element).width(170);
				$(element).addClass("y_user_sponsor_id");
				window.setTimeout(function () {
						$(element).autocomplete({
							appendTo:"body",
							disabled:false,
							delay:300,
							minLength:1,
                            source: function(request, response){
								this.xhr = $.ajax({
									type: "GET",
									url: '/incidentAddUser',
									data: request,
									dataType: "json",
									async: false,
									success: function( data ) {
										response( data );
									},
									error: function(model, response, options) {
										response([]);
									}
								});
								$(element).autocomplete('widget').css('font-size','11px');
								$(element).autocomplete('widget').css('z-index','1000');
							},
                            autoFocus: true
                        });
                },100);
            }
        },
		formoptions: {rowpos:2,colpos:1,label: "<span class='x_user_sponsor_id'>Usuario</span>"}
        },	              
	    {
		label: 'Responsable', 
		name: 'owner_name', 
		width: 150,
		editable: true, 
		hidden: false, 
		editrules: {edithidden: true},
	    editoptions: {
			dataInit: function(elem) {
				$(elem).width(165);
				$(elem).addClass("ui-state-highlight y_owner_name");
			}
		},
	    formoptions: {rowpos:2,colpos:2,label: "<span class='x_owner_name'>Responsable</span>"},
	    },
	    {
		label: 'Responsable', 
		name: 'task_owner_id', 
	    editable: true,
		hidden: true, 
		editrules: {edithidden: true}, 
		edittype: "select", 
	    editoptions: {
			//dataUrl: '/incident_program_default',
			dataUrl: '/incidentResponsable',
			postData:function(rowid){
				var idProgram=$("#jqGridIncident").getRowData($("#jqGridIncident").getGridParam("selrow")).program_id;
				if (idProgram!=undefined){
					return {id:idProgram};
				}else{
					return {id:2496};
				}
			},
			buildSelect: function (response) {
				var grid = $("#jqGridIncident");
				var rowKey = grid.getGridParam("selrow");
				var rowData = grid.getRowData(rowKey);
				var thissid = rowData.program_name;
				var data = JSON.parse(response);
				var s = "<select>";//el default
				s += '<option value="0">--Seleccione Responsable--</option>';
				$.each(data, function(i, item) {
					if(data[i].user_name==thissid){
						s += '<option value="' + data[i].uid + '" selected>' + data[i].first_name + " " + data[i].last_name + '</option>';
					}else{
						s += '<option value="' + data[i].uid + '">' + data[i].first_name + " " + data[i].last_name + '</option>';
					}
				});
				return s + "</select>";
	  	    },
	        dataInit: function(elem) {
				$(elem).width(180);
				$(elem).addClass("y_task_owner_id");
	        }
	    },formoptions: {rowpos:2,colpos:2,label : "<span class='x_task_owner_id'>Responsable</span>"}
	    },
		{ 
		label: 'Prioridad', 
		name: 'severity_description', 
		width: 150,
	    editable: false, 
		hidden: false, 
		editrules: {edithidden: true},
	    stype: 'select',
		searchoptions: {
			dataUrl: '/incidentSeverityList',
			buildSelect: function (response) {
				var data = JSON.parse(response);
				var s = "<select>";
				s += '<option value="0">--Escoger Severidad--</option>';
				$.each(data, function(i, item) {
					s += '<option value="' + data[i].severity_id + '">' + data[i].severity_description + '</option>';
				});
				return s + "</select>";
			}	            		  
	    }
	    },              
	    { 
			label: 'Prioridad', 
			name: 'severity_id', 
	        editable: true,
			hidden: true, 
			editrules: {edithidden: true}, 
			edittype: "select", 
	        editoptions: {
				dataUrl: '/incidentSeverityConfigurationList',
				postData:function(rowid){
					var idConf=$("#jqGridIncident").getRowData($("#jqGridIncident").getGridParam("selrow")).configuration_id;
					if (idConf!=undefined){
						return {id:idConf};
					}else{
						return {id:1};
					}
				},
				buildSelect: function (response) {
					var grid = $("#jqGridIncident");
					var rowKey = grid.getGridParam("selrow");
					var rowData = grid.getRowData(rowKey);
					var thissid = rowData.severity_id;
					//console.log(thissid);
					var data = JSON.parse(response);
					var s = "<select>";//el default
					s += '<option value="0">--Escoger Severidad--</option>';
					$.each(data, function(i, item) {
						if(data[i].severity_id==thissid){
							s += '<option value="' + data[i].severity_id + '" selected>' + data[i].severity_description + '</option>';
						}else{
							s += '<option value="' + data[i].severity_id + '">' + data[i].severity_description + '</option>';
						}
					});
					return s + "</select>";
	  	        },
	            dataEvents: [{ type: 'change', fn: function(e) {
					var thistid= $(this).val();
					$.get('/incidentSeverityDays/'+thistid + '/'+ $("input#date_creation").val(), 
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
						}
					); 
				}}],
				dataInit: function(elem) {$(elem).width(180);}
	        },
			formoptions: {rowpos:3,colpos:1}
	    },
		{ 
		label: 'Número de ALM', 
		name: 'alm_number', 
		width: 100,
		editable: true,
		editrules:{required:false},
		editoptions: {size: 10, maxlengh: 10},
		searchoptions: {sopt:["eq"] },
		formoptions: {rowpos:5,colpos:2}
	    },	              
	    { 
		label: 'Fecha Creación', 
		name: 'date_creation',
		width: 100,
		editable: true,
		editrules:{required:true},
	    editoptions: {
			size: 10, 
			maxlengh: 10,
	        dataInit: function(element) {
				$(element).datepicker({dateFormat: 'yy-mm-dd', maxDate: 0})
	        },
			defaultValue: function(){ 
				var currentTime = new Date(); 
				var month = parseInt(currentTime.getMonth() + 1); 
				month = month <= 9 ? "0"+month : month; 
				var day = currentTime.getDate(); 
				day = day <= 9 ? "0"+day : day; 
				var year = currentTime.getFullYear(); 
				return year+"-"+month + "-"+day; 
	        } 
	    },
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
							$('#jqGridIncident')[0].triggerToolbar();
						}, 100);
					}
				});
			},
			sopt: ["eq"]
		},
		formoptions: {rowpos:4,colpos:1}
		},
	    { 
		label: 'Fecha Término', 
		name: 'date_end',
		width: 100,
		editable: true,
	    formatter: 'date',
	    formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
	    editoptions: {
			size: 10, 
			readonly: "readonly",
			dataInit: function (domElem) {$(domElem).addClass("ui-state-highlight"); } 
		},
		searchoptions:{
			dataInit:function(el){
				$(el).datepicker({
					dateFormat:'yy-mm-dd',
					changeYear: true,
					changeMonth: true,                            
					onSelect: function (dateText, inst) {
						setTimeout(function () {
							$('#jqGridIncident')[0].triggerToolbar();
						},100);
					}
				});
			},
			sopt: ["eq"]
		},
		formoptions: {rowpos:4,colpos:2}
	    },	              
	    { 
		label: 'Número IR', 
		name: 'ir_number', 
		width: 100,
		editable: true,
		editrules:{required:true, number:true},
		editoptions: {size: 10, maxlengh: 10},
		searchoptions: {sopt:["eq"] },
		formoptions: {rowpos:5,colpos:1}
	    },
	    { 
		label: 'Descripción Corta', 
		name: 'brief_description', 
		editable: true,
	    editrules:{required:true},
		edittype: "textarea",
	    editoptions: { rows: "3", cols: "25", maxlength: "60"},
	    formoptions: {rowpos:6,colpos:1}
	    },
	    { 
		label: 'Descripción Extensa', 
		name: 'extended_description', 
		editable: true,
	    hidden: true, 
		editrules: {edithidden: true},
		edittype: "textarea",
	    editoptions: { rows: "3", cols: "25", maxlength: "160"},
	    formoptions: {rowpos:6,colpos:2}
	    },
	    { 
		label: 'user_creation_id', 
		name: 'user_creation_id', 
		hidden:true 
		}, 
	    { 
		label: 'task_id', 
		name: 'task_id', 
		hidden:true 
		},
	    { 
		label: 'Estado', 
		name: 'status_name', 
		width: 150,
	    editable: false, 
		hidden: false, 
		editrules: {edithidden: true},
	    stype: 'select',
		searchoptions: {dataUrl: '/incidentStatusList'},
	    },	              
	    { 
		label: 'Estado', 
		name: 'status_id', 
	    editable: true,
		hidden: true, 
		editrules: {edithidden: true}, 
		edittype: "select", 
	    editoptions: {
			dataUrl: '/incidentStatusList',
			dataInit: function(elem) {$(elem).width(180);}
		},
		formoptions: {
			rowpos:7,
			colpos:1,
			label: "<span style='vertical-align: top;'>Estado</span>"
		}
	    },
	    { 
		label: 'Observación', 
		name: 'note', 
		editable: true,
		hidden: true, 
	    editrules: {edithidden: true},
		edittype: "textarea",
	    editoptions: { rows: "3", cols: "25"},
		formoptions: {rowpos:7,colpos:2}
	    },
	    { 
		label: 'Departamento', 
		name: 'department', 
		width: 150,
	    editable: false, 
		hidden: false, 
		editrules: {edithidden: true},
	    stype: 'select',
		searchoptions: {dataUrl: '/incidentDepartamentList'},
	    },		              
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
				$('.y_configuration_name',form).hide();
            	$('.y_configuration_id',form).show();
				
				$('.y_program_name',form).hide();
            	$('.x_program_id',form).show();
            	$('.y_program_id',form).show();

            	$('.x_user_sponsor_id',form).show();
            	$('.y_user_sponsor_id',form).hide();
            	
				$('.y_owner_name',form).hide();
            	$('.x_task_owner_id',form).show();
            	$('.y_task_owner_id',form).show();

            	//$('input#configuration_name',form).attr('readonly','readonly');
            	$('input#program_name',form).attr('readonly','readonly');
            	
            	$('input#sponsor_name',form).attr('readonly','readonly');
            	//$('input#owner_name',form).attr('readonly','readonly');
            	$('textarea#brief_description',form).attr('readonly','readonly');
            	$('textarea#extended_description',form).attr('readonly','readonly');
            	$('input#date_creation',form).attr('readonly','readonly');
            	$('input#ir_number',form).attr('readonly','readonly');
				//$('input#alm_number',form).attr('readonly','readonly');
            	
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
				$("#jqGridSubTask").jqGrid('setGridParam', { url: 'incidentSubTask/' + tId});
				$("#jqGridSubTask").trigger('reloadGrid');
				$("#subtaskListDialog").dialog({title:titulo}).dialog("open");  	
			}
	    } 
	}); 	
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
});