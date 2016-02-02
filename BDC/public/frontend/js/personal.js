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
            { label: 'Nombre', name: 'nombre', width: 300,editable: false},
            { label: 'Horas Asignadas', name: 'asignado', width: 300,editable: false}
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
			pager: "#jqGridPersonal"
    });	           		

});