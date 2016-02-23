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
            { label: 'id', name: 'id', width: 1, key: true, hidden: true},
            { label: 'Uname', name: 'uname', width: 1, hidden: true}, 
            { label: 'Nombre', name: 'nombre', width: 300,editable: false,search:false},
            { label: 'Area', name: 'area', width: 300,editable: false,search:false},
            { label: 'Departamento', name: 'departamento', width: 300,editable: false,search:false},
                       
    ]
	
	$("#jqGridPersonal").jqGrid({
	        url: '/listadoAsignacion',
	        mtype: 'GET',
	        datatype: 'json',
	        colModel: programaSubalternos,
	        regional : 'es',
			height:'auto',
			ExpandColumn:'nombre',
			treeGrid:true,
			treeGridModel:'adjacency',
   	        caption: "Personal",
			pager: "#jqGridPersonalPager",
			treeIcons: {leaf:'ui-icon-document-b'}/*,
			loadComplete: function () {
                var $grid = $(this), columnNames, name,
                    userdata = $grid.jqGrid('getGridParam', 'userData');

                if (userdata) {
                    if (userdata.daterang) {
                        $grid.jqGrid('setCaption', userdata.daterang);
                    }                	
                }
            }*/
    });	  
	
	$('#jqGridPersonal').navGrid("#jqGridPersonalPager", {                
        search: false, 
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
	
	$("#jqGridPersonal").jqGrid('navButtonAdd','#jqGridPersonalPager',{
	    caption:"",
	    buttonicon : "ui-icon-gear",//silk-icon-cog
	    onClickButton : function() { 
			var grid = $("#jqGridPersonal");
			var rowKey = grid.getGridParam("selrow");
			var rowData = grid.getRowData(rowKey);
			var id = rowData.id;
			var titulo = rowData.nombre;

			if(rowKey === null && typeof rowKey === "object"){
				alert('debe seleccionar un usuario');
			}else{
				$("#jqGridSubTask").jqGrid('setGridParam', { url: '/listSubTaskFromUser/' + id});
				$("#jqGridSubTask").trigger('reloadGrid');
				$("#subtaskListDialog").dialog({title:titulo}).dialog("open");  	
			}
	    } 
	}); 	
	
    $("#jqGridSubTask").jqGrid({
        datatype: "json",
        mtype: "GET",
        autowidth:true,
        colNames: ["sub_task_id","Estado","Programa","Proyecto", "Tarea", "Subtarea","Planeadas", "Trabajadas", "% Avance","Fecha Inicio Planeada","Fecha Término Planeada","Fecha Inicio Real","Fecha Término Real"],
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
           { name: "programa", width: 200, align: "left", editable:false,search:false },
           { name: "proyecto", width: 200, align: "left", editable:false,search:false },
           { name: "tarea", width: 200, align: "left", editable:false,search:false },
           { name: "subtarea", width: 200, align: "left", editable:false,search:false },
           { name: "planeadas", width: 100, align: "center",editable:false,search:false },
           { name: "trabajadas", width: 100, align: "center", editable:false,search:false },
           { name: "porcentaje", width: 100, align: "center",editable:false,search:false },
           { name: 'plan_start_date', editable: false, hidden:false,
           	searchoptions: {searchhidden: false,
                   dataInit: function (element) {
                       $(element).datepicker({
                           id: 'Fecha Inicio',
                           dateFormat: 'yy-mm-dd',
                           showOn: 'focus'
                       });
                   }
               }
           },
           { name: 'plan_end_date', editable: false, hidden:false,
           	searchoptions: {searchhidden: false,
                   dataInit: function (element) {
                       $(element).datepicker({
                           id: 'Fecha Término',
                           dateFormat: 'yy-mm-dd',
                           showOn: 'focus'
                       });
                   }
               }           	
           },
           { name: "rfecini", width: 100,formatter: 'date', search:false,formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' } },	
           { name: "rfecfin", width: 100,formatter: 'date', search:false,formatoptions: { srcformat: 'Y-m-d', newformat: 'Y-m-d' } }           
        ],
		regional : "es",
		rowList: [],        
		pgbuttons: false,     
		pgtext: null,         
		viewrecords: false, 
		pager:"jqGridSubTaskPager",
        ajaxRowOptions: { contentType: "application/json" },
        serializeRowData: function (data) { return JSON.stringify(data); },        
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
    
	$('#jqGridSubTask').navGrid("#jqGridSubTaskPager", {refresh: false, add: false, edit: false, del: false, search: true },
    {}, 
    {}, 
    {}, 
    { closeAfterSearch:true, closeOnEscape: true, sopt: ['eq'], multipleSearch: true } 
    );    
});