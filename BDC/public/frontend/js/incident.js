$(document).ready(function(){
	/*
	var template = "<div class='contenedor'>";
	template += "<div id='incidencia'> Tipo de incidencia </div><div id='confId'> {configuration_id} </div>";
	template += "<div id='sistema1'> Sistema: </div><div id='program'>{program_id} </div>";
	template += "<div id='fecha'> Fecha Creación: </div><div id='dateCre'>{date_creation} </div>";
	template += "<div id='numeroIR'> Número IR',: </div><div id='irNumb'>{ir_number} </div>";
	template += "<div id='usuario'> Usuario:</div><div id='userSponsor'> {user_sponsor_id} </div>";
	template += "<div id='descCorta'> Descripción Corta:</div><div id='briefDesc'> {brief_description} </div>";
	template += "<div id='descExte'> Descripción Extensa:</div><div id='extDesc'> {extended_description} </div>";
	template += "<div id='prioridad'> Prioridad:</div><div id='severityId'> {severity_id} </div>";
	template += "<div id='fechaTerm'> Fecha Término:</div><div id='dateEnd'> {date_end} </div>";
	template += "<div id='responsable'> Responsable:</div><div id='taskOwner'> {task_owner_id} </div>";
	template += "<hr style='width:100%;'/>";
	template += "<div> {sData} {cData}  </div></div>";
	*/
	
	function showGridStatus(parentRowID, parentRowKey) {
	    var childGridID = parentRowID + "_table";
	    var childGridPagerID = parentRowID + "_pager";
	    var childGridURL = "/listStatus/" + parentRowKey;

	    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

	    $("#" + childGridID).jqGrid({
	        url: childGridURL,
	        mtype: "GET",
	        datatype: "json",
	        //page: 1,
	        colModel: [
	                   { label: '[log_id]', name: '[log_id]', key: true, hidden:true },                   
	                   { label: 'incident_id', name: 'incident_id', hidden:true},
	                   { label: 'Estado', name: 'status_name', width: 150 },
	                   { label: 'Fecha', name: 'log_date', width: 150, formatter: 'date', formatoptions: { srcformat: 'U/1000', newformat: 'Y-m-d h:i:s A' } },
	                   { label: 'Usuario', name: 'user_creation_name', width: 150 },
	                   { label: 'Nota', name: 'note', width: 200 }           
	        ],
	        //rowNum: 20,
			height: 'auto',
	        autowidth:true,
	        regional : "es",
	        rowList: [],        // disable page size dropdown
			pgbuttons: false,     // disable page control like next, back button
			pgtext: null,         // disable pager text like 'Page 0 of 10'
			viewrecords: false,    // disable current view record text like 'View 1-10 of 100' 
	        pager: "#" + childGridPagerID
	    });
		
	    $("#" + childGridID).jqGrid('navGrid',"#" + childGridPagerID,{add:false,edit:false,del:false,search: false,refresh:false});	
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
	              { label: 'Tarea', name: 'task_title', width: 200,editable: false,formatter: returnTaskLink, search:false },
	              { label: 'incident_id', name: 'incident_id', key: true, hidden:true },
	              { label: 'Tipo de incidencia', width: 300, name: 'configuration_name', editable: true, hidden: true, editrules: {edithidden: true} },
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
	            	                   $(elem).width(200);  
	            	               }
	            	  }
	              },
	              { label: 'Sistema', name: 'program_name', width: 400, editable: true, hidden: true, editrules: {edithidden: true} },
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
	            	                   $(elem).width(200);  
	            	               }
	            		  }
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
	            	                   $(elem).width(200);  
	            	               }
	            		  }
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
			             }
	              },
	              { label: 'Fecha Término', name: 'date_end',width: 100,editable: true,
	            	  formatter: 'date',
	            	  formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' },
	            	  editoptions: {size: 10, readonly: "readonly" },
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
		             }
	              },	              
	              { label: 'Número IR', name: 'ir_number', width: 100,editable: true,
	            	  editrules:{required:true},
	            	  editoptions: {size: 10, maxlengh: 10},
	            	  searchoptions: {sopt:["gt","lt","eq"] }
	              },
	              { label: 'Usuario', width: 200, name: 'sponsor_name', editable: true, hidden: true, editrules: {edithidden: true} },
	              { label: 'Usuario', name: 'user_sponsor_id', 
	            	  editable: true,hidden: true, editrules: {edithidden: true}, edittype: "select", 
	            	  editoptions: {dataUrl: '/incident_program_default',dataInit: function(elem) {
   	                   $(elem).width(200);  
   	               }}
	              },	              
	              { label: 'Descripción Corta', name: 'brief_description', editable: true,editrules:{required:true} },
	              { label: 'Descripción Extensa', name: 'extended_description', editable: true,hidden: true, editrules: {edithidden: true},edittype: "textarea", editoptions: { rows: "5", cols: "25"} },
	              { label: 'Responsable', width: 200, name: 'owner_name', editable: true, hidden: true, editrules: {edithidden: true} },
	              { label: 'Responsable', name: 'task_owner_id', 
	            	  editable: true,hidden: true, editrules: {edithidden: true}, edittype: "select", 
	            	  editoptions: {dataUrl: '/incident_program_default',dataInit: function(elem) {
   	                   $(elem).width(200);  
   	               }}
	              },	
	              { label: 'user_creation_id', name: 'user_creation_id', hidden:true }, 
	              { label: 'task_id', name: 'task_id', hidden:true },
	              { label: 'Estado', name: 'status_id', 
	            	  editable: true,hidden: true, editrules: {edithidden: true}, edittype: "select", 
	            	  editoptions: {dataUrl: '/incidentStatusList',dataInit: function(elem) {
   	                   $(elem).width(200);  
   	               }}
	              },
	              { label: 'Observación', name: 'note', editable: true,hidden: true, editrules: {edithidden: true},edittype: "textarea", editoptions: { rows: "5", cols: "25"} },

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
        //shrinkToFit: false,
        subGrid: true, 
        subGridRowExpanded: showGridStatus,
        caption:'Lista de Incidentes',
        pager: "#jqGridIncidentPager",
        loadComplete: findWithColor,
        editurl:"/incidentSave"
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
            beforeShowForm: function($form) {
            	var form=$form;
            	$('#tr_configuration_id', form).hide();
            	$('#tr_program_id',form).hide();
            	$('#tr_user_sponsor_id',form).hide();
            	$('#tr_severity_id',form).hide();
            	$('#tr_task_owner_id',form).hide();

            	$('input#configuration_name',form).attr('readonly','readonly');
            	$('input#program_name',form).attr('readonly','readonly');
            	$('input#sponsor_name',form).attr('readonly','readonly');
            	$('input#owner_name',form).attr('readonly','readonly');
            	$('input#brief_description',form).attr('readonly','readonly');
            	$('textarea#extended_description',form).attr('readonly','readonly');
            	$('input#date_creation',form).attr('readonly','readonly');
            	$('input#ir_number',form).attr('readonly','readonly');
            	
            	/*
            	$form.find(".FormElement[readonly]")
                .prop("disabled", true)
                .addClass("ui-state-disabled")
                .closest(".DataTD")
                .prev(".CaptionTD")
                .prop("disabled", true)
                .addClass("ui-state-disabled")
                */
               
            },afterShowForm: function($form) {
                $form.closest(".ui-jqdialog").closest(".ui-jqdialog").position({
                    my: 'center',
                    at: 'center',
                    of: window
                  });
            },afterSubmit : function(response,postdata){
                var json   = response.responseText; 
                var result = JSON.parse(json); 
                //console.log(result);
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
            		return [false,"Número IR: Ya existe",""];
            	} else {
            		return [true,"",""]
            	}
            },beforeShowForm: function($form) {
            	var form=$form;
            	$('#tr_configuration_name', form).hide();
            	$('#tr_program_name',form).hide();
            	$('#tr_sponsor_name',form).hide();
            	$('#tr_owner_name',form).hide();
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
});