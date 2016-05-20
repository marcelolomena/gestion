$(document).ready(function(){
	var rawCookie = $.cookie('PLAY_SESSION');
	var hashes = rawCookie.substring(rawCookie.indexOf('-') + 1).split('&');
	var hash,uid;
	for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        if(hash[0]=='uId'){
        	uid=hash[1];
        	break;
        }
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
						var rowData = $(this).jqGrid("getRowData", rowid);
						var task_for_date= rowData.task_for_date;
						var ingresadas= rowData.ingresadas;
						var result=response.responseJSON;
							
		                if(result.error_code!=0){
		                	alert(result.error_text);
		                }else{
		                	$("#jqGridSubTask").trigger("reloadGrid");
		                }
					},
					afterRestore:function(rowid) {
						//alert("en afterRestore (Cancel): rowid="+rowid+"\nNo necesitamos devolver nada");
					},
					delOptions: workerDelOptions
					
			   }},	
			   { label: 'task_owner_id', name: 'task_owner_id', hidden:true },
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
				{ label: 'Trabajadas', name: 'trabajadas', width: 50,align: "center",editable:false, edittype:"text"},
				{ label: 'Fecha', name: 'task_for_date',width: 85,editable: true, edittype:"text",
				  editoptions: {
					  size: 10, maxlengh: 10,
					  dataInit: function(element) {
						$(element).datepicker({dateFormat: 'yy-mm-dd',
							beforeShow:function(input,inst){
						          setTimeout(function(){
						         $(".ui-datepicker").css("z-index", 2000);}, 10);
							}
						})
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
				var id= $("#jqGridSubTask").getDataIDs()[0];
	            var rowData = $("#jqGridSubTask").getRowData(id);	            
	            var val_task_owner_id = rowData.task_owner_id;  
	            var val_project_manager_id = rowData.project_manager_id;  
	            var val_program_manager_id = rowData.program_manager_id;  
	            var thisId = $.jgrid.jqID(this.id);

	            if ((val_task_owner_id==uid) || (val_project_manager_id==uid) || (val_program_manager_id==uid)) {            	
	                $("#" + thisId + "_iladd").show();
	                $(this).find("div.ui-inline-del").show();
	                $(this).find("div.ui-inline-edit").show();
	            } else {
	            	$("#" + thisId + "_iladd").hide();
	                $(this).find("div.ui-inline-del").hide();
	                $(this).find("div.ui-inline-edit").hide();
	            }	        	
	        	/*
	    	    if ($("#" + childGridID).getGridParam('records') == 0){ 
	    	        $("#" + childGridID).closest("div.ui-jqgrid-view").children("div.ui-jqgrid-hdiv").hide();
	    	        //$("#" + childGridID + "_save_button").hide();
	    	    }
	    	    */
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

	var modelUserStory=[
		{
		label: 'us_id', 
		name: 'us_id', 
		key: true, 
		hidden:true 
		},
		{
		label: 'US Code', 
		name: 'us_code', 
		width: 80,
		editable: false
		},
		{ 
		label: 'Rol', 
		name: 'rol', 
		width: 120,
		editable: true,
	    editrules:{required:true},
		edittype: "textarea",
	    editoptions: { rows: "3", cols: "25", maxlength: "60"},
	    formoptions: {rowpos:1,colpos:1}
		},              
	    {
		label: 'Función', 
		name: 'funcion',
		width: 220,
		editable: true,
	    editrules:{required:true},
		edittype: "textarea",
	    editoptions: { rows: "3", cols: "25", maxlength: "60"},
	    formoptions: {rowpos:1,colpos:2}
	    },
	    {
		label: 'Resultado', 
		name: 'resultado', 
		width: 220,
		editable: true,
	    editrules:{required:true},
		edittype: "textarea",
	    editoptions: { rows: "3", cols: "25", maxlength: "60"},
	    formoptions: {rowpos:2,colpos:1}
	    },
	    {
		label: 'Descripción', 
		name: 'descripcion', 
		width: 220,
		editable: true,
	    editrules:{required:true},
		edittype: "textarea",
	    editoptions: { rows: "3", cols: "25", maxlength: "60"},
	    formoptions: {rowpos:2,colpos:2}
	    },
	];	
	
	var userStoryGrid = $("#jqGridUserStory"), userStoryGridId = $.jgrid.jqID(userStoryGrid[0].id);

	$("#jqGridUserStory").jqGrid({
        url: '/userStoryList',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelUserStory,
        rowNum: 20,
        regional : 'es',
        height: 'auto',
        autowidth:true, 
        shrinkToFit: false,
        forceFit:true,
        subGrid: true, 
        subGridRowExpanded: showGridStatus,
        caption:'Lista de Historias de Usuario',
        pager: "#jqGridUserStoryPager",
        loadComplete: findWithColor,
        editurl:"/incidentSave",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        gridview: true,
        beforeSelectRow: function (rowid) {
            var tr = $(this.rows.namedItem(rowid)), thisId = $.jgrid.jqID(this.id);
			var rowData = userStoryGrid.getRowData(rowid);
			var task_owner_id = rowData.task_owner_id;
			var project_manager_id = rowData.project_manager_id;
			var program_manager_id = rowData.program_manager_id;

           	if ( (task_owner_id==uid) || (project_manager_id==uid) || (program_manager_id==uid) ) {            	
                $("#edit_" + thisId).removeClass('ui-state-disabled');
                $("#del_" + thisId).removeClass('ui-state-disabled');
            } else {
                $("#edit_" + thisId).addClass('ui-state-disabled');
                $("#del_" + thisId).addClass('ui-state-disabled');
            }
            return true; 
        },
        loadComplete: function () {
        	$("tr.jqgrow:odd", this).addClass('not-editable-row');
            $("tr.jqgrow:even", this).addClass('not-editable-row');
        }
    });

	$("#jqGridUserStory").jqGrid('filterToolbar', {stringResult: true,searchOperators: true, searchOnEnter: false, defaultSearch: 'cn'});
	$("#jqGridUserStory").jqGrid('navGrid','#jqGridIncidentPager',{edit: true, add: true, del: true,refresh:true,search: false, position: "left", cloneToTop: false },
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
            	//$('.x_configuration_id',form).show();
				//$('.y_configuration_name',form).hide();
            	//$('.y_configuration_id',form).show();
            	
            	$('.x_configuration_id',form).show();
            	$('.y_configuration_id',form).hide();
				
				$('.y_program_name',form).hide();
            	$('.x_program_id',form).show();
            	$('.y_program_id',form).show();

            	$('.x_user_sponsor_id',form).show();
            	$('.y_user_sponsor_id',form).hide();
            	
            	
            	
				$('.y_owner_name',form).hide();
            	$('.x_task_owner_id',form).show();
            	$('.y_task_owner_id',form).show();

            	$('input#program_name',form).attr('readonly','readonly');
            	$('input#configuration_name',form).attr('readonly','readonly');
            	
            	//$('input#sponsor_name',form).attr('readonly','readonly');
            	$('textarea#brief_description',form).attr('readonly','readonly');
            	$('textarea#extended_description',form).attr('readonly','readonly');
            	$('input#date_creation',form).attr('readonly','readonly');
            	$('input#ir_number',form).attr('readonly','readonly');
            	
            	$('input#severity_description',form).attr('readonly','readonly');
            	$('.y_severity_id',form).hide();
            	
            	
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
            	} if( postdata.task_owner_id == 0) {
            		return [false,"Responsable: Debe escoger un valor",""];
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
            	} if( postdata.uname.length == 0) {
            		return [false,"Usuario: El usuario no existe",""];
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
            	//$('#tr_uname', form).hide();
            	$('input#severity_description',form).hide();
            	
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
        },
        {
            recreateFilter:true
        }
	);
	$("#jqGridUserStory").jqGrid('navButtonAdd','#jqGridIncidentPager',{
	    caption:"",
	    buttonicon : "ui-icon-gear",//silk-icon-cog
	    onClickButton : function() { 
			var grid = $("#jqGridUserStory");
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
	$("#jqGridUserStory").jqGrid('navButtonAdd','#jqGridIncidentPager',{
		caption:"",
		buttonicon : "silk-icon-page-excel",
		title: "Exportar a Excel", 
		onClickButton : function () { 
			var grid = $("#jqGridUserStory");
			var rowKey = grid.getGridParam("selrow");
			var url = 'userStory-excel';
			$("#jqGridUserStory").jqGrid('excelExport',{"url":url});
	   } 
	});
	
	$("#edit_" + userStoryGridId).addClass('ui-state-disabled');
    $("#del_" + userStoryGridId).addClass('ui-state-disabled');

});