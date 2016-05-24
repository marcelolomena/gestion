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
	    var childGridURL = "/listScenario/" + parentRowKey;

	    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

	    $("#" + childGridID).jqGrid({
	        url: childGridURL,
	        mtype: "GET",
	        datatype: "json",
	        colModel: [
	                   { label: 'uss_id', name: 'uss_id', key: true, hidden:true },                   
	                   { label: 'Cod Escenario', name: 'uss_code', width: 50},
	                   { label: 'us_id', name: 'us_id', hidden:true},
	                   { label: 'Titulo', name: 'titulo', width: 150,resizable: false,
                	    editable: true,
	               	    editrules:{required:true},
	               		edittype: "textarea",
	               	    editoptions: { rows: "3", cols: "25", maxlength: "60"},
	               	    formoptions: {rowpos:1,colpos:1}},
	                   { label: 'Contexto', name: 'contexto', width: 220,
                	    editable: true,
	               	    editrules:{required:true},
	               		edittype: "textarea",
	               	    editoptions: { rows: "3", cols: "25", maxlength: "60"},
	               	    formoptions: {rowpos:1,colpos:2}},
	                   { label: 'Evento', name: 'evento', width: 220,
                	    editable: true,
	               	    editrules:{required:true},
	               		edittype: "textarea",
	               	    editoptions: { rows: "3", cols: "25", maxlength: "60"},
	               	    formoptions: {rowpos:2,colpos:1}},
	                   { label: 'Resultado', name: 'resultado', width: 250 ,
                	    editable: true,
	               	    editrules:{required:true},
	               		edittype: "textarea",
	               	    editoptions: { rows: "3", cols: "25", maxlength: "60"},
	               	    formoptions: {rowpos:2,colpos:2}},
	                   { label: 'created_by', name: 'created_by', hidden:true },
	                   { label: 'Creador', name: 'created_by_name', width: 80 }
	        ],
			height: 'auto',
	        //autowidth:true,
	        regional : "es",
	        height: 'auto',
	        autowidth:true, 
	        rowList: [],        
			pgbuttons: false,     
			pgtext: null,        
			viewrecords: true,    
			gridview: true,
			beforeSelectRow: function (rowid) {
				var userScenarioGrid = $("#" + childGridID);
	            var tr = $(this.rows.namedItem(rowid)), thisId = $.jgrid.jqID(this.id);
				var rowData = userScenarioGrid.getRowData(rowid);
				var task_owner_id = rowData.created_by;
				//console.log('task owner: '+task_owner_id);
				//console.log('id normal: '+uid);
				//var project_manager_id = rowData.project_manager_id;
				//var program_manager_id = rowData.program_manager_id;

	           	if ( (task_owner_id==uid) ) {//|| (project_manager_id==uid) || (program_manager_id==uid) ) {            	
	                $("#edit_" + thisId).removeClass('ui-state-disabled');
	                $("#del_" + thisId).removeClass('ui-state-disabled');
	            } else {
	                $("#edit_" + thisId).addClass('ui-state-disabled');
	                $("#del_" + thisId).addClass('ui-state-disabled');
	            }
	            return true; 
	        },
	        pager: "#" + childGridPagerID
	    });
		
	    $("#" + childGridID).jqGrid('navGrid',"#" + childGridPagerID,{edit: true, add: true, del: true,search: false},
			    {
					mtype: 'POST',
			        height: 'auto',
			        width: 'auto',
			        editCaption: "Modificar Escenario",
			        recreateForm: true,
			        closeAfterEdit: true,
			        afterSubmit : function(response,postdata){
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
			    	addCaption: "Agregar Escenario",
			        height: 'auto',
			        width: 'auto',
			        modal: true,
			        ajaxEditOptions: jsonOptions,
			        serializeEditData: createJSON,
			        closeAfterAdd: true,
			        recreateForm: true,
			        afterSubmit : function(response,postdata){
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
	}
	
    var lastSelection;
	
	var modelUserStory=[
		{
		label: 'us_id', 
		name: 'us_id', 
		key: true, 
		hidden:true 
		},
		{
		label: 'Codigo Historia', 
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
	    {
		label: 'Epica', 
		name: 'epica', 
		width: 120,
		editable: true,
	    editrules:{required:true},
		edittype: "textarea",
	    editoptions: { rows: "3", cols: "25", maxlength: "60"},
	    formoptions: {rowpos:3,colpos:1}
	    },
	    {
		label: 'Tema', 
		name: 'tema', 
		width: 120,
		editable: true,
	    editrules:{required:true},
		edittype: "textarea",
	    editoptions: { rows: "3", cols: "25", maxlength: "60"},
	    formoptions: {rowpos:3,colpos:2}
	    },
	    {
		label: 'Creador', 
		name: 'created_by_name', 
		width: 80,
		editable: true,
	    editrules:{required:true},
		edittype: "textarea",
	    editoptions: { rows: "3", cols: "25", maxlength: "60"},
	    formoptions: {rowpos:4,colpos:1}
	    },
	    {
		label: 'created_by', 
		name: 'created_by',
		hidden:true 
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
			var task_owner_id = rowData.created_by;
			//var project_manager_id = rowData.project_manager_id;
			//var program_manager_id = rowData.program_manager_id;

           	if ( (task_owner_id==uid) ) {//|| (project_manager_id==uid) || (program_manager_id==uid) ) {            	
                $("#edit_" + thisId).removeClass('ui-state-disabled');
                $("#del_" + thisId).removeClass('ui-state-disabled');
            } else {
                $("#edit_" + thisId).addClass('ui-state-disabled');
                $("#del_" + thisId).addClass('ui-state-disabled');
            }
            return true; 
        }
    });

	$("#jqGridUserStory").jqGrid('filterToolbar', {stringResult: true,searchOperators: true, searchOnEnter: false, defaultSearch: 'cn'});
	$("#jqGridUserStory").jqGrid('navGrid','#jqGridUserStoryPager',{edit: true, add: true, del: true,search: false},
		    {
				mtype: 'POST',
		        height: 'auto',
		        width: 'auto',
		        editCaption: "Modificar Historia de Usuario",
		        recreateForm: true,
		        closeAfterEdit: true,
		        afterSubmit : function(response,postdata){
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
		    	addCaption: "Agregar Historia de Usuario",
		        height: 'auto',
		        width: 'auto',
		        modal: true,
		        ajaxEditOptions: jsonOptions,
		        serializeEditData: createJSON,
		        closeAfterAdd: true,
		        recreateForm: true,
		        afterSubmit : function(response,postdata){
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

});