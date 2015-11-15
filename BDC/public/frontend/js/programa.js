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
	
	$("#jqGridProgram").jqGrid({
        url: '/reportStateSubTask',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: [
            { label: 'program_id', name: 'program_id', width: 100, key: true, hidden:true }, 
            { label: 'División', name: 'division', width: 250 },
            { label: 'Tipo Programa', name: 'tipo', width: 250 },
            { label: 'Programa', name: 'programa', width: 250 },
            { label: 'Fecha Entrega',
              name: 'pfecini',
              width: 100,
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
	                                $('#jqGrid3')[0].triggerToolbar();
	                            }, 100);
	                        }
				        });
		              },sopt: ["gt","lt","eq"]
             }
            },
        ],
        rowNum: 20,
        regional : 'es',
        height: 'auto',
        autowidth:true,        
        pager: "#jqGridProgramPager",
        loadComplete: findWithColor
    });	
	$("#jqGridProgram").jqGrid('filterToolbar', {stringResult: true,searchOperators: true, searchOnEnter: false, defaultSearch: 'cn'});
	$("#jqGridProgram").jqGrid('navGrid','#jqGridProgramPager',{add:false,edit:false,del:false,search: false});
	$("#jqGridProgram").jqGrid('navButtonAdd','#jqGridProgram',{
	       caption:"",
	       buttonicon : "silk-icon-page-excel",
	       title: "Exportar a Excel", 
	       onClickButton : function () { 
	    	   var grid = $("#jqGridProgram");
	           var rowKey = grid.getGridParam("selrow");
	           var url = 'status-subtask';
	    	   $("#jqGridProgram").jqGrid('excelExport',{"url":url});
	       } 
	});	
});