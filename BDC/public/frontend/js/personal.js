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
	
	var programaSubalternos = [
            { label: 'uid', name: 'uid', width: 10, key: true, hidden:true }, 
            { label: 'Nombre', name: 'nombre', width: 300,editable: false,search:false},
            { label: 'Area', name: 'area', width: 300,editable: false,search:false},
            { label: 'Departamento', name: 'departamento', width: 300,editable: false,search:false},
            { label: 'Horas Asignadas', name: 'asignado', width: 100,editable: false,search:false},
            { label: 'Horas Avanzadas', name: 'avanzado', width: 100,editable: false,search:false},
            { label: 'Fecha Inicio', name: 'plan_start_date', editable: false, hidden:true,
            	searchoptions: {searchhidden: true,
                    dataInit: function (element) {
                        $(element).datepicker({
                            id: 'Fecha Inicio',
                            dateFormat: 'yy-mm-dd',
                            showOn: 'focus'
                        });
                    }
                }
            },
            { label: 'Fecha Término', name: 'plan_end_date', editable: false, hidden:true,
            	searchoptions: {searchhidden: true,
                    dataInit: function (element) {
                        $(element).datepicker({
                            id: 'Fecha Final',
                            dateFormat: 'yy-mm-dd',
                            showOn: 'focus'
                        });
                    }
                }           	
            }            
    ]
	
	$("#jqGridPersonal").jqGrid({
	        url: '/listadoAsignacion',
	        mtype: "GET",
	        datatype: "json",
	        page: 1,
	        colModel: programaSubalternos,
	        rowNum: 20,
	        regional : 'es',
	        height: 'auto',
	        autowidth:true, 
   	        viewrecords: true,
   	        rowList: [5, 10, 20, 50],
   	        gridview: true,
   	        subGrid: true, 
   	        caption: "Fecha",
   	        subGridRowExpanded: showGridSubTask,   	        
			pager: "#jqGridPersonalPager",
			loadComplete: function () {
                var $grid = $(this), columnNames, name,
                    userdata = $grid.jqGrid('getGridParam', 'userData');

                if (userdata) {
                    if (userdata.daterang) {
                        $grid.jqGrid('setCaption', userdata.daterang);
                    }                	
                }
            }
			
    });	  
	
	
	$('#jqGridPersonal').navGrid("#jqGridPersonalPager", {                
        search: true, 
        add: false,
        edit: false,
        del: false,
        refresh: false
    },
    {}, 
    {}, 
    {}, 
    { closeAfterSearch:true,
      sopt: ['eq'],
      multipleSearch: true } 
    );
	
	function showGridSubTask(parentRowID, parentRowKey) {
		//var rowData = $('#jqGridPersonal').jqGrid('getRowData', parentRowID)
		//console.log("lala:" + rowData.nombre)
	    var childGridID = parentRowID + "_table";
	    var childGridPagerID = parentRowID + "_pager";
	    var childGridURL = "/listSubTaskFromUser/" + parentRowKey;

	    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

	    $("#" + childGridID).jqGrid({
	        url: childGridURL,
	        mtype: "GET",
	        datatype: "json",
	        colNames: ["sub_task_id","Estado","Recurso","Proyecto", "Tarea", "Subtarea","Planeadas", "Trabajadas", "% Avance","Fecha Inicio Planeada","Fecha Término Planeada","Fecha Inicio Real","Fecha Término Real"],
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
	           { name: "rfecini", width: 100,formatter: 'date', formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' } },	
	           { name: "rfecfin", width: 100,formatter: 'date', formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' } },		           
	        ],
			height: 'auto',
			page: 1,
	        rowNum: 20,
	        regional : 'es',
	        autowidth:true, 
   	        viewrecords: true,
   	        rowList: [5, 10, 20, 50],
   	        gridview: true,     
			viewrecords: true,    
	        pager: "#" + childGridPagerID
	    });
		
	    $("#" + childGridID).jqGrid('navGrid',"#" + childGridPagerID,{add:false,edit:false,del:false,search: false,refresh:false});	
	}	

});