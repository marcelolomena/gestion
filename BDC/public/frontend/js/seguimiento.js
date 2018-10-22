$(document).ready(function(){
	console.log("REady:");
	var subgrid2;
	var maingrid;
	
	//Llena combo con PMOs
	$.getJSON("/documentPMOList/8", function (j) {
		$('#pmo option').remove();
		$('#pmo').append('<option value="0" selected="selected">- Escoger PMO -</option>');
		$.each(j.rows, function (i, item) {
			$('#pmo').append('<option value="' + item.id + '">' + item.nombre +' '+ item.apellido+ '</option>');
		});
	});

	//Llena combo con Lider
	$.getJSON("/documentPMOList/7", function (j) {
		$('#lider option').remove();
		$('#lider').append('<option value="0" selected="selected">- Escoger Lider -</option>');
		$.each(j.rows, function (i, item) {
			$('#lider').append('<option value="' + item.id + '">' + item.nombre +' '+ item.apellido+ '</option>');
		});
	});
	
	$("#buscar").click(function () {
		console.log("click");
		loadGrid();
	
	});

	$("#lider").change(function () {
        $("#pmo").val("0");
	});

	$("#pmo").change(function () {
        $("#lider").val("0");
	});
	
	function loadGrid() {
		console.log("loadGrid");
		var pmo= $("#pmo").val();
		var lider= $("#lider").val();
		var art = $("#art").val();
		art = (art.length > 0) ? art : '0';
		var url = "/seguimientoPrograms/" + pmo + "/"+ lider + "/"+ art;
		$("#jqGridIncident").jqGrid('setCaption', "Programas ").jqGrid('setGridParam', { url: url, page: 1}).jqGrid("setGridParam", {datatype: "json"}).trigger("reloadGrid");		
	}	
	
	$( "#tabs" ).tabs();
		$("#container2").hide();
		 //program_id	program_code	program_name	responsable	workflow_status
		var modelFacturas = [
			{ label: 'id', name: 'program_id', key: true, hidden: true },
			{ label: 'ART', name: 'program_code', width: 100, align: 'left', search: false, sortable: false, editable: true },
			{ label: 'Programa', name: 'program_name', width: 400, align: 'left', search: false, sortable: false, editable: true },
			{ label: 'Responsable', name: 'responsable', width: 200, align: 'left', search: false, sortable: false, editable: true },
			{ label: 'Estado', name: 'workflow_status', width: 100, align: 'left', search: false, sortable: false, editable: true }
		];		
		$("#jqGridIncident").jqGrid({
			url: '/seguimientoPrograms/0/0/0',
			mtype: "GET",
			datatype: "json",
			page: 1,
			colModel: modelFacturas,
			rowNum: 10,
			regional: 'es',
			height: 'auto',
			sortable: "true",
			width: null,
			autowidth: true, 
			shrinkToFit: true, 	
			height: 'auto',
			caption: 'Lista de Programas Disponibles',
			pager: "#jqGridIncidentPager",
			viewrecords: true,
			rowList: [5, 10, 20, 50],
			//styleUI: "Bootstrap",
			editurl: '/reportProgram/action',
			subGrid: true, 
			subGridRowExpanded: showDocumentsTypesAndAll 
		});	

		$('#jqGridIncident').jqGrid('navGrid', "#jqGridIncidentPager", {
			edit: false,
			add: false,
			del: false,
			refresh: true,
			search: false, // show search button on the toolbar        
			cloneToTop: false
		});

        $('#jqGridIncident').jqGrid('navButtonAdd',"#jqGridIncidentPager",{
               caption:"",
               buttonicon : "silk-icon-page-excel",
               title: "Excel con Todos los Docs.",
               onClickButton : function () {
                   var url = 'allDocumentByProgramExcel';
                   $('#jqGridIncident').jqGrid('excelExport',{"url":url});
               }
        });

});

function showDocumentsTypesAndAll(parentRowID, parentRowKey) {
	showDocumentsTypes(parentRowID, parentRowKey, 'docstype');
	showDocumentsAll(parentRowID, parentRowKey, 'docsall');
}

function showDocumentsTypes(parentRowID, parentRowKey, suffix) {
    console.log("en documentos");
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
	childGridID += suffix;
	childGridPagerID += suffix;	
	subgrid2=childGridID;
	var modelDocs = [
			{ label: 'programa', name: 'programa' , hidden: true },
			{ label: 'id', name: 'id', key: true, align: 'left', hidden: true, search: false, sortable: false},
			{ label: 'Nombre', name: 'nombre', width: 300, align: 'left', search: false, sortable: false},
			{ label: 'Cantidad', name: 'cantidad', width: 100, align: 'left', search: false, sortable: false },
			{ label: 'Descripción', name: 'description', width: 500, align: 'left', search: false, sortable: false }
	];

	var childGridURL = "/documentByProgramType/"+parentRowKey;
    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
		colModel: modelDocs,
        height: 'auto',
        caption: 'Documentos Requeridos en Programa',
        pager: "#" + childGridPagerID,
        page: 1,
        autowidth: true, 
        shrinkToFit: true, 	
		height: 'auto',
        rowNum: 10,
        rowList: [5, 10, 20, 50],
        sortname: 'id',
        sortorder: 'asc',
        viewrecords: true,
        editurl: '/facturas/actionDetalle/' + parentRowKey,
		subGrid: true, // set the subGrid property to true to show expand buttons for each row
		subGridRowExpanded: showDocuments, // javascript function that will take care of showing the child grid        		
        regional: "es",
        footerrow: true,
        userDataOnFooter: true,		
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }

    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false,
        add: false,
        del: false,
        search: false,
        refresh: true,
        cloneToTop: false
    });
}

function showDocuments(parentRowID, parentRowKey) {
    console.log("en documentos");
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
	var rowData = $("#" + subgrid2).getRowData(parentRowKey);
	console.log("row:"+JSON.stringify(rowData));
	console.log("rowK:"	+ parentRowKey);
	var tipo = parentRowKey.substring(0,parentRowKey.indexOf('_'));
	console.log("tipo:"+tipo);
	var programa = rowData.programa;
	var modelDocs = [
			{ label: 'id', name: 'id', key: true, hidden: true },
			{ label: 'file_name', name: 'file_name', hidden: true },
			{ label: 'Documento', name: 'title', width: 300, align: 'left', search: false, sortable: false, editable: true,
				formatter: function (cellvalue, options, rowObject) {
					var nombre = rowObject.file_name;
					var id = rowObject.id;
					if (nombre != null) {
						return "<a href='documents/"+nombre+"'>"+cellvalue+"</a>" ;
					} else {
						return "Sin Adjunto";
					}
				}		
			},
			{ label: 'Version', name: 'version', width: 70, align: 'left', search: false, sortable: false, editable: true },
			{ label: 'Fecha', name: 'fecha', width: 90, align: 'left', search: false, sortable: false, editable: true,                      
				formatter: function (cellvalue, options, rowObject) {
					//Some(2017-02-21 11:13:32.0)
					var val = rowObject.fecha;
					if (val != null) {
						val = val.substring(5,15);
						var fechaok = val.substring(8)+'-'+val.substring(5,7)+'-'+val.substring(0,4);
						//var fechaok = val.substring(14,16)+'-'+val.substring(11,13)+'-'+val.substring(5,9);
						return fechaok;
					} else {
						return '';
					}
				}, 
			},
			{ label: 'Responsable', name: 'encargado', width: 150, align: 'left', search: false, sortable: false, editable: true },
			{ label: 'Extensión', name: 'extension', width: 80, align: 'left', search: false, sortable: false, editable: true },
			{ label: 'Nivel', name: 'parent_type', width: 100, align: 'left', search: false, sortable: false, editable: true },
			{ label: 'Detalle', name: 'version_notes', width: 200, align: 'left', search: false, sortable: false, editable: true }
	];

	var childGridURL = '/documentByProgram/'+ programa+ '/' +parentRowKey.substring(0,parentRowKey.indexOf('_'));
    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
		colModel: modelDocs,
        height: 'auto',
        caption: 'Documentos',
        pager: "#" + childGridPagerID,
        page: 1,
        autowidth: true, 
        shrinkToFit: true, 	
		height: 'auto',
        rowNum: 10,
        rowList: [5, 10, 20, 50],
        sortname: 'id',
        sortorder: 'asc',
        viewrecords: true,
        regional: "es",
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }

    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false,
        add: false,
        del: false,
        search: false,
        refresh: true,
        cloneToTop: false
    });
}

function showDocumentsAll(parentRowID, parentRowKey, suffix) {
    console.log("en documentos");
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
	childGridID += suffix;
	childGridPagerID += suffix;			
	var rowData = $("#jqGridIncident").getRowData(parentRowKey);
	console.log("rowAll:"+JSON.stringify(rowData));
						
	var programa = parentRowKey;
	var modelDocs = [
			{ label: 'id', name: 'id', key: true, hidden: true },
			{ label: 'file_name', name: 'file_name', hidden: true },
			{ label: 'Documento', name: 'title', width: 300, align: 'left', search: false, sortable: false, editable: true,
				formatter: function (cellvalue, options, rowObject) {
					var nombre = rowObject.file_name;
					var id = rowObject.id;
					if (nombre != null) {
						return "<a href='documents/"+nombre+"'>"+cellvalue+"</a>" ;
					} else {
						return "Sin Adjunto";
					}
				}			
			},
			{ label: 'Version', name: 'version', width: 70, align: 'left', search: false, sortable: false, editable: true },
			{ label: 'Fecha', name: 'fecha', width: 90, align: 'left', search: false, sortable: false, editable: true,                      
				formatter: function (cellvalue, options, rowObject) {
					//Some(2017-02-21 11:13:32.0)
					var val = rowObject.fecha;
					if (val != null) {
						val = val.substring(5,15);
						var fechaok = val.substring(8)+'-'+val.substring(5,7)+'-'+val.substring(0,4);
						//var fechaok = val.substring(14,16)+'-'+val.substring(11,13)+'-'+val.substring(5,9);
						return fechaok;
					} else {
						return '';
					}
				}, 
			},
			{ label: 'Encargado', name: 'encargado', width: 150, align: 'left', search: false, sortable: false, editable: true },
			{ label: 'Extensión', name: 'extension', width: 80, align: 'left', search: false, sortable: false, editable: true },
			{ label: 'Nivel', name: 'parent_type', width: 100, align: 'left', search: false, sortable: false, editable: true },
			{ label: 'Detalle', name: 'version_notes', width: 200, align: 'left', search: false, sortable: false, editable: true },
			{ label: 'Tipo', name: 'document_type', width: 200, align: 'left', search: false, sortable: false, editable: true }
	];

	var childGridURL = '/documentByProgramAll/'+ programa;
    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
		colModel: modelDocs,
        height: 'auto',
        pager: "#" + childGridPagerID,
        autowidth: true, 
        shrinkToFit: true, 	
		height: 'auto',
        page: 1,
        rowNum: 10,
        rowList: [5, 10, 20, 50],
        sortname: 'id',
        sortorder: 'asc',
        viewrecords: true,
        regional: "es",
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }

    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false,
        add: false,
        del: false,
        search: false,
        refresh: true,
        cloneToTop: false
    });
	
	$("#" + childGridID).jqGrid('navButtonAdd',"#" + childGridPagerID,{
		   caption:"",
		   buttonicon : "silk-icon-page-excel",
		   title: "Excel con Docs. de Programa",
		   onClickButton : function () { 
			   var url = 'documentByProgramExcel/' + programa;
			   $("#" + childGridID).jqGrid('excelExport',{"url":url});
		   } 
	});     	
}