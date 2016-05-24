var month = [
             "Enero","Febrero","Marzo","Abril","Mayo","Junio",
             "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
         ];  
         now = new Date();
         selectMes= document.getElementById( 'mesHistograma' );
var numeroMes = now.getMonth()+1;
         var nombreMes = month[now.getMonth()];
var opt = document.createElement('option');
opt.value = numeroMes;
    opt.innerHTML = nombreMes;
selectMes.appendChild(opt);
now.setMonth( now.getMonth() - 1 );
	while(now.getFullYear()=='2016'){
         numeroMes = now.getMonth()+1;
         nombreMes = month[now.getMonth()];

    opt = document.createElement('option');
    opt.value = numeroMes;
    opt.innerHTML = nombreMes;
    selectMes.appendChild(opt);

now.setMonth( now.getMonth() - 1 );

     }
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
	$("#HistogramaDialog").dialog({
		bgiframe: true,
		autoOpen: false,
        modal: true,
        resizable: true,
        width: 'auto',
        height: 'auto',
        //minHeight:'550',
        open: function(event, ui) {
        	$('.ui-widget-overlay').addClass('overlay-hidden');
           	$("#jqGridHistograma").setGridWidth($(this).width(), true);
        	$("#jqGridHistograma").setGridHeight($(this).height()); 
    	},resizeStop: function(event, ui) {
		    $("#jqGridHistograma").setGridWidth($(this).width(), true);
		    $("#jqGridHistograma").setGridHeight($(this).height());
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
				alert('Debe seleccionar un usuario');
			}else{
				$("#jqGridSubTask").jqGrid('setGridParam', { url: '/listSubTaskFromUser/' + id});
				$("#jqGridSubTask").trigger('reloadGrid');
				$("#subtaskListDialog").dialog({title:titulo}).dialog("open");  	
			}
	    } 
	}); 	
	
	$("#jqGridPersonal").jqGrid('navButtonAdd','#jqGridPersonalPager',{
	    caption:"",
	    buttonicon : "ui-icon-clock",//silk-icon-cog
	    onClickButton : function() { 
			var grid = $("#jqGridPersonal");
			var rowKey = grid.getGridParam("selrow");
			var rowData = grid.getRowData(rowKey);
			var id = rowData.id;
			var titulo = rowData.nombre;

			if(rowKey === null && typeof rowKey === "object"){
				alert('Debe seleccionar un usuario');
			}else{
				var now = new Date();
				var numeroMes = now.getMonth()+1;
				$("#jqGridHistograma").jqGrid('setGridParam', { url: '/listadoHistograma?mes='+numeroMes+'&id=' + id});
				$("#jqGridHistograma").trigger('reloadGrid');
				$("#HistogramaDialog").dialog({title:titulo}).dialog("open");  	
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
	
	var modelHistograma=[
	           		{ 
	           		label: 'Programa', 
	           		name: 'programa', 
	           		width: 118,
	           		editable: false,
	           		search:true 
	           		},	  
	           		{ 
	           		label: 'Proyecto', 
	           		name: 'proyecto', 
	           		width: 118,
	           		editable: false,
	           		search:true
	           	    },
	           	    { 
	           		label: 'Tarea', 
	           		name: 'tarea', 
	           		width: 118,
	           		editable: false,
	           		search:true
	           	    },
	           	    { 
	           		label: 'Subtarea', 
	           		name: 'subtarea', 
	           		width: 118,
	           		editable: false,
	           		search:true
	           	    }, 
	           	{label:'1',name:'1',width: 21,editable:false,search:true},
	           	{label:'2',name:'2',width: 21,editable:false,search:true},
	           	{label:'3',name:'3',width: 21,editable:false,search:true},
	           	{label:'4',name:'4',width: 21,editable:false,search:true},
	           	{label:'5',name:'5',width: 21,editable:false,search:true},
	           	{label:'6',name:'6',width: 21,editable:false,search:true},
	           	{label:'7',name:'7',width: 21,editable:false,search:true},
	           	{label:'8',name:'8',width: 21,editable:false,search:true},
	           	{label:'9',name:'9',width: 21,editable:false,search:true},
	           	{label:'10',name:'10',width: 21,editable:false,search:true},
	           	{label:'11',name:'11',width: 21,editable:false,search:true},
	           	{label:'12',name:'12',width: 21,editable:false,search:true},
	           	{label:'13',name:'13',width: 21,editable:false,search:true},
	           	{label:'14',name:'14',width: 21,editable:false,search:true},
	           	{label:'15',name:'15',width: 21,editable:false,search:true},
	           	{label:'16',name:'16',width: 21,editable:false,search:true},
	           	{label:'17',name:'17',width: 21,editable:false,search:true},
	           	{label:'18',name:'18',width: 21,editable:false,search:true},
	           	{label:'19',name:'19',width: 21,editable:false,search:true},
	           	{label:'20',name:'20',width: 21,editable:false,search:true},
	           	{label:'21',name:'21',width: 21,editable:false,search:true},
	           	{label:'22',name:'22',width: 21,editable:false,search:true},
	           	{label:'23',name:'23',width: 21,editable:false,search:true},
	           	{label:'24',name:'24',width: 21,editable:false,search:true},
	           	{label:'25',name:'25',width: 21,editable:false,search:true},
	           	{label:'26',name:'26',width: 21,editable:false,search:true},
	           	{label:'27',name:'27',width: 21,editable:false,search:true},
	           	{label:'28',name:'28',width: 21,editable:false,search:true},
	           	{label:'29',name:'29',width: 21,editable:false,search:true},
	           	{label:'30',name:'30',width: 21,editable:false,search:true},
	           	{label:'31',name:'31',width: 21,editable:false,search:true},
	           	{label:'Total',name:'32',width: 38,editable:false,search:true},
	           	];	
	
		
	$("#jqGridHistograma").jqGrid({
        mtype: 'GET',
        datatype: 'json',
        page: 1,
        colModel: modelHistograma,
        rowNum: 10000,
        regional : 'es',
		height:'260',
	        caption: "Histograma",
		pager: "#jqGridHistogramaPager",
		viewrecords: true,
		gridview: true,
		footerrow:true,
		
		loadComplete : function(){
			var $grid = $('#jqGridHistograma');
			var colSum = $grid.jqGrid('getCol','4',false,'sum'); $grid.jqGrid('footerData','set',{1 : colSum});
			var colSum = $grid.jqGrid('getCol','5',false,'sum'); $grid.jqGrid('footerData','set',{2 : colSum});
			var colSum = $grid.jqGrid('getCol','6',false,'sum'); $grid.jqGrid('footerData','set',{3 : colSum});
			var colSum = $grid.jqGrid('getCol','7',false,'sum'); $grid.jqGrid('footerData','set',{4 : colSum});
			var colSum = $grid.jqGrid('getCol','8',false,'sum'); $grid.jqGrid('footerData','set',{5 : colSum});
			var colSum = $grid.jqGrid('getCol','9',false,'sum'); $grid.jqGrid('footerData','set',{6 : colSum});
			var colSum = $grid.jqGrid('getCol','10',false,'sum'); $grid.jqGrid('footerData','set',{7 : colSum});
			var colSum = $grid.jqGrid('getCol','11',false,'sum'); $grid.jqGrid('footerData','set',{8 : colSum});
			var colSum = $grid.jqGrid('getCol','12',false,'sum'); $grid.jqGrid('footerData','set',{9 : colSum});
			var colSum = $grid.jqGrid('getCol','13',false,'sum'); $grid.jqGrid('footerData','set',{10 : colSum});
			var colSum = $grid.jqGrid('getCol','14',false,'sum'); $grid.jqGrid('footerData','set',{11 : colSum});
			var colSum = $grid.jqGrid('getCol','15',false,'sum'); $grid.jqGrid('footerData','set',{12 : colSum});
			var colSum = $grid.jqGrid('getCol','16',false,'sum'); $grid.jqGrid('footerData','set',{13 : colSum});
			var colSum = $grid.jqGrid('getCol','17',false,'sum'); $grid.jqGrid('footerData','set',{14 : colSum});
			var colSum = $grid.jqGrid('getCol','18',false,'sum'); $grid.jqGrid('footerData','set',{15 : colSum});
			var colSum = $grid.jqGrid('getCol','19',false,'sum'); $grid.jqGrid('footerData','set',{16 : colSum});
			var colSum = $grid.jqGrid('getCol','20',false,'sum'); $grid.jqGrid('footerData','set',{17 : colSum});
			var colSum = $grid.jqGrid('getCol','21',false,'sum'); $grid.jqGrid('footerData','set',{18 : colSum});
			var colSum = $grid.jqGrid('getCol','22',false,'sum'); $grid.jqGrid('footerData','set',{19 : colSum});
			var colSum = $grid.jqGrid('getCol','23',false,'sum'); $grid.jqGrid('footerData','set',{20 : colSum});
			var colSum = $grid.jqGrid('getCol','24',false,'sum'); $grid.jqGrid('footerData','set',{21 : colSum});
			var colSum = $grid.jqGrid('getCol','25',false,'sum'); $grid.jqGrid('footerData','set',{22 : colSum});
			var colSum = $grid.jqGrid('getCol','26',false,'sum'); $grid.jqGrid('footerData','set',{23 : colSum});
			var colSum = $grid.jqGrid('getCol','27',false,'sum'); $grid.jqGrid('footerData','set',{24 : colSum});
			var colSum = $grid.jqGrid('getCol','28',false,'sum'); $grid.jqGrid('footerData','set',{25 : colSum});
			var colSum = $grid.jqGrid('getCol','29',false,'sum'); $grid.jqGrid('footerData','set',{26 : colSum});
			var colSum = $grid.jqGrid('getCol','30',false,'sum'); $grid.jqGrid('footerData','set',{27 : colSum});
			var colSum = $grid.jqGrid('getCol','31',false,'sum'); $grid.jqGrid('footerData','set',{28 : colSum});
			var colSum = $grid.jqGrid('getCol','32',false,'sum'); $grid.jqGrid('footerData','set',{29 : colSum});
			var colSum = $grid.jqGrid('getCol','33',false,'sum'); $grid.jqGrid('footerData','set',{30 : colSum});
			var colSum = $grid.jqGrid('getCol','34',false,'sum'); $grid.jqGrid('footerData','set',{31 : colSum});
			var colSum = $grid.jqGrid('getCol','35',false,'sum'); $grid.jqGrid('footerData','set',{32 : colSum});
			
			$("#mesHistograma").change(function() {
				var elmes = $("#mesHistograma option:selected").val();
				
				var grid = $("#jqGridPersonal");
				var rowKey = grid.getGridParam("selrow");
				var rowData = grid.getRowData(rowKey);
				var id = rowData.id;
				//var id = 341;
				  $grid.setGridParam({ caption: elmes,url: '/listadoHistograma?mes='+elmes+'&id=' + id}).trigger("reloadGrid");
			});
		}
		
});	 

$("#jqGridHistograma").jqGrid('navGrid','#jqGridHistogramaPager',{refresh: false, add: false, edit: false, del: false, search: false})
.jqGrid('navButtonAdd', '#jqGridHistogramaPager', {
	caption:"",
	position: "first",
	buttonicon : "silk-icon-page-excel",
	title: "Exportar a Excel",
	onClickButton : function () {
		var elmes = $("#mesHistograma option:selected").val();
		var grid = $("#jqGridHistograma");
		var grid2 = $("#jqGridPersonal");
		var rowKey = grid2.getGridParam("selrow");
		var rowData = grid2.getRowData(rowKey);
		var id = rowData.id;
		var url = 'histograma-excel?mes='+elmes+'&id=' + id;
		grid.jqGrid('excelExport',{"url":url});
   } 
});   
});