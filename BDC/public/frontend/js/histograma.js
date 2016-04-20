$(document).ready(function(){
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
	           		width: 250,
	           		editable: false,
	           		search:true 
	           		},	  
	           		{ 
	           		label: 'Proyecto', 
	           		name: 'proyecto', 
	           		width: 200,
	           		editable: false,
	           		search:true
	           	    },
	           	    { 
	           		label: 'Tarea', 
	           		name: 'tarea', 
	           		width: 200,
	           		editable: false,
	           		search:true
	           	    },
	           	    { 
	           		label: 'Subtarea', 
	           		name: 'subtarea', 
	           		width: 200,
	           		editable: false,
	           		search:true
	           	    }, 
	           	{label:'1',name:'1',width: 20,editable:false,search:true},
	           	{label:'2',name:'2',width: 20,editable:false,search:true},
	           	{label:'3',name:'3',width: 20,editable:false,search:true},
	           	{label:'4',name:'4',width: 20,editable:false,search:true},
	           	{label:'5',name:'5',width: 20,editable:false,search:true},
	           	{label:'6',name:'6',width: 20,editable:false,search:true},
	           	{label:'7',name:'7',width: 20,editable:false,search:true},
	           	{label:'8',name:'8',width: 20,editable:false,search:true},
	           	{label:'9',name:'9',width: 20,editable:false,search:true},
	           	{label:'10',name:'10',width: 20,editable:false,search:true},
	           	{label:'11',name:'11',width: 20,editable:false,search:true},
	           	{label:'12',name:'12',width: 20,editable:false,search:true},
	           	{label:'13',name:'13',width: 20,editable:false,search:true},
	           	{label:'14',name:'14',width: 20,editable:false,search:true},
	           	{label:'15',name:'15',width: 20,editable:false,search:true},
	           	{label:'16',name:'16',width: 20,editable:false,search:true},
	           	{label:'17',name:'17',width: 20,editable:false,search:true},
	           	{label:'18',name:'18',width: 20,editable:false,search:true},
	           	{label:'19',name:'19',width: 20,editable:false,search:true},
	           	{label:'20',name:'20',width: 20,editable:false,search:true},
	           	{label:'21',name:'21',width: 20,editable:false,search:true},
	           	{label:'22',name:'22',width: 20,editable:false,search:true},
	           	{label:'23',name:'23',width: 20,editable:false,search:true},
	           	{label:'24',name:'24',width: 20,editable:false,search:true},
	           	{label:'25',name:'25',width: 20,editable:false,search:true},
	           	{label:'26',name:'26',width: 20,editable:false,search:true},
	           	{label:'27',name:'27',width: 20,editable:false,search:true},
	           	{label:'28',name:'28',width: 20,editable:false,search:true},
	           	{label:'29',name:'29',width: 20,editable:false,search:true},
	           	{label:'30',name:'30',width: 20,editable:false,search:true},
	           	{label:'31',name:'31',width: 20,editable:false,search:true},
	           	];	
	$("#jqGridHistograma").jqGrid({
	        url: '/listadoHistograma?mes=04',
	        mtype: 'GET',
	        datatype: 'json',
	        page: 1,
	        colModel: modelHistograma,
	        rowNum: 100,
	        regional : 'es',
			height:'auto',
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
				
				$("#mesHistograma").change(function() {
					var elmes = $("#mesHistograma option:selected").val();
					  $grid.setGridParam({ caption: elmes,url: '/listadoHistograma?mes='+elmes}).trigger("reloadGrid");
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
			var url = 'histograma-excel?mes='+elmes;
			grid.jqGrid('excelExport',{"url":url});
	   } 
	});   
});