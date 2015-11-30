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
	
	var programaModel = [
	                    { label: 'program_id', name: 'program_id', width: 100, key: true, hidden:true }, 
	                    { label: 'Estado', name: 'spi', width: 50,search:false, 
			            	formatter: function (cellvalue) {
                            	var color;
                            	var val = Number(cellvalue);
                            	if (val < 0.8) {
                             	   color = 'red';
                            	} else if (val >= 0.8 && val < 0.95) {
                             	   color = 'yellow';
                            	} else if (val >= 0.95) {
                             	   color = 'green';
                            	}
                            	console.log(color);
                        		return '<span class="cellWithoutBackground" style="background-color:' + color + ';"></span>';
                        	}
			            	
			            },  	                    
	                    { label: 'Programa', name: 'program_name', width: 300,formatter: returnProgramLink, search:false },
	                    { label: 'División', name: 'division', width: 250,editable: false, hidden: false, editrules: {edithidden: true},
	  	            	  stype: 'select',searchoptions: {dataUrl: '/listaDivisiones',
	  	            		buildSelect: function (response) {
	  	            			var data = JSON.parse(response);
	  	            		    var s = "<select>";
	  	            		    s += '<option value="0">--Sin División--</option>';
	  	            		    $.each(data, function(i, item) {
	  	            		    	s += '<option value="' + data[i].dId + '">' + data[i].division + '</option>';
	  	            		    });
	  	            		    return s + "</select>";
	  	            		}
	  	            		  } },
	                    { label: 'Tipo de Programa', name: 'program_type', width: 150,editable: false, hidden: false, editrules: {edithidden: true},
	  	  	            	  stype: 'select',searchoptions: {dataUrl: '/listaTipo',
	  	  	            		buildSelect: function (response) {
	  	  	            			var data = JSON.parse(response);
	  	  	            		    var s = "<select>";
	  	  	            		    s += '<option value="0">--Sin Tipo--</option>';
	  	  	            		    $.each(data, function(i, item) {
	  	  	            		    	s += '<option value="' + data[i].id + '">' + data[i].program_type + '</option>';
	  	  	            		    });
	  	  	            		    return s + "</select>";
	  	  	            		}
	  	  	            		  } },
	                    { label: 'Foco Estratégico', name: 'sub_type', width: 150,editable: false, hidden: false, editrules: {edithidden: true},
	  		  	  	            	  stype: 'select',searchoptions: {dataUrl: '/listaFoco',
	  		  	  	            		buildSelect: function (response) {
	  		  	  	            			var data = JSON.parse(response);
	  		  	  	            		    var s = "<select>";
	  		  	  	            		    s += '<option value="0">--Sin Foco--</option>';
	  		  	  	            		    $.each(data, function(i, item) {
	  		  	  	            		    	s += '<option value="' + data[i].id + '">' + data[i].sub_type + '</option>';
	  		  	  	            		    });
	  		  	  	            		    return s + "</select>";
	  		  	  	            		}
	  		  	  	            } },
	                    { label: 'Estado', name: 'workflow_status', width: 150,editable: false, hidden: false, editrules: {edithidden: true},
		  	  	            	  stype: 'select',searchoptions: {dataUrl: '/listaEstado',
		  	  	            		buildSelect: function (response) {
		  	  	            			var data = JSON.parse(response);
		  	  	            		    var s = "<select>";
		  	  	            		    s += '<option value="0">--Sin Estado--</option>';
		  	  	            		    $.each(data, function(i, item) {
		  	  	            		    	s += '<option value="' + data[i].id + '">' + data[i].workflow_status + '</option>';
		  	  	            		    });
		  	  	            		    return s + "</select>";
		  	  	            		}
		  	  	            } },
	                    { label: 'Fecha Entrega',
	                      name: 'release_date',
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
	        	                                $('#jqGridProgram')[0].triggerToolbar();
	        	                            }, 100);
	        	                        }
	        				        });
	        		              },sopt: ["gt","lt","eq"]
	                     }
	                    },
	                    { label: '% Avance', name: 'pai', width: 100,editable: false, searchoptions: {sopt:["gt","lt","eq"] }},
	                    { label: '% Esperado', name: 'pae', width: 100,editable: false, searchoptions: {sopt:["gt","lt","eq"] } },
	                    { label: 'SPI', name: 'spi', width: 100,editable: false, searchoptions: {sopt:["gt","lt","eq"] } },
	                    { label: 'CPI', name: 'cpi', width: 100,editable: false, searchoptions: {sopt:["gt","lt","eq"] } },
	                ];
	
	$("#jqGridProgram").jqGrid({
        url: '/listadoPrograma',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: programaModel,
        rowNum: 20,
        regional : 'es',
        height: 'auto',
        autowidth:true, 
        shrinkToFit: false,
        forceFit:true,
        caption:'Lista de Programas',
        pager: "#jqGridProgramPager",
        loadComplete: findWithColor,
        editurl:"/programaSave",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        gridview: true,
    });	
	$("#jqGridProgram").jqGrid('filterToolbar', {stringResult: true,searchOperators: true, searchOnEnter: false, defaultSearch: 'cn'});
	$("#jqGridProgram").jqGrid('navGrid','#jqGridProgramPager',{add:false,edit:false,del:false,search: false});

});