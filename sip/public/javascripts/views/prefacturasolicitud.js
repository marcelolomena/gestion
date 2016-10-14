$(document).ready(function () {
    var cuiusr = [];
   
    $.ajax({
        url: "/cuiuser", 
        dataType: 'json', 
        async: false, 
        success: function(j){ 
            if (j.length > 0){
                var nivel0 = j[0].nivel;
                $.each(j,function(i,item) {
                    console.log("nivel:"+item.nivel+","+nivel0);
                    if (item.nivel == nivel0){
                        cuiusr.push(item.cui);
                    }
                    console.log('***user cui:'+cuiusr);  
                });
            } else {
                cuiusr.push("0");
            }
            console.log('** cui final:'+cuiusr); 
        } 
    });    

    for (var i=0; i<cuiusr.length; i++ ){    
	    $.getJSON("/troyacui/"+cuiusr[i], function (j) {
            $.each(j, function (i, item) {
                console.log("cui:"+item.nombre+","+item.cui);
                $('#cui').append('<option value="' + item.id + '">' + item.cui + "-"+ item.nombre +'</option>');
            });
	    });  
    }  
  
    $('#periodo').val(getPeriodo());
    
    $("#cui").change(function(){
        var idcui = $(this).val();  
        var periodo = $('#periodo').val();
        loadGrid(idcui, periodo);
    });
    

});

function getPeriodo() {
    var d = new Date();
    var anio = d.getFullYear();
    console.log("anio:"+anio);
    var mes = parseInt(d.getMonth()) + 1;  
    console.log("mes:"+mes);
    var mesok = mes < 10 ? '0' + mes : mes;
    console.log("mesok:"+mesok);
    return anio+''+mesok;
    
}

var leida = false;
function loadGrid(cui, periodo) {
	var url = "/prefacturasolicitud/"+cui+"/"+periodo;
	var formatter = new Intl.NumberFormat();
	if (leida){
        $("#grid").setGridParam({ postData: {page:1, rows:10} });
        $("#grid").jqGrid('setCaption', "Facturas Proveedor por CUI").jqGrid('setGridParam', { url: url, page: 1}).jqGrid("setGridParam", {datatype: "json"}).trigger("reloadGrid");
	} else {
		showDocumentos(cui,periodo);
	}
}

function showDocumentos(cui, periodo) {
    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Periodo {periodo}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Servicio {nombre}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Glosa Servicio {glosaservicio}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>Monto a Pagar {montoapagar}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'><span style='color:red'>*</span>Aprobado {aprobado}</div>";
    tmpl += "</div>";
    
    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'><span style='color:red'>*</span>Monto a Aprobado {montoaprobado}</div>";
    tmpl += "</div>";
    
    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>Glosa Aprobación {glosaaprobacion}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>Calificación {idcalificacion}</div>";
    tmpl += "</div>";
    
    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>Monto Multa {montomulta}</div>";
    tmpl += "</div>";    
    
    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>Causa Multa {idcausalmulta}</div>";
    tmpl += "</div>";        

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>Glosa Multa {glosamulta}</div>";
    tmpl += "</div>";
    
    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'> </div>";
    tmpl += "</div>";
        
    tmpl += "<hr style='width:100%;'/>";
    tmpl += "<div> {sData} {cData}  </div>";
    tmpl += "</div>";    
    // send the parent row primary key to the server so that we know which grid to show
    var childGridURL = "/prefacturasolicitud/"+cui+"/"+periodo;
    $("#grid").jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",    
        colModel: [
                   { label: 'id',
                      name: 'id',
                      width: 50,
                      hidden:true,
                      key: true
                   },
                   { label: 'Proveedor',
                     name: 'razonsocial',  
                     search: false,
                     key: true, 
                     align: 'left',                 
                     width: 250,
                     editable: true,
                     editoptions: { size: 10, readonly: 'readonly'}  
                   },        
                   { label: 'Periodo',
                     name: 'periodo',
                     width: 70,
                     align: 'right',
                     search: false,
                     editable: true,
                     editoptions: { size: 10, readonly: 'readonly'}                       
                   },  
                   { label: 'Servicio',
                     name: 'nombre',
                     width: 200,
                     align: 'left',
                     search: false,
                     editable: true,
                     editoptions: { size: 10, readonly: 'readonly'}                       
                   },  
                   { label: 'Glosa Servicio',
                     name: 'glosaservicio',
                     width: 250,
                     align: 'left',
                     search: false,
                     editable: true,
                     editoptions: { size: 10, readonly: 'readonly'}                       
                   },         
                   { label: 'Monto a Pagar',
                     name: 'montoapagar',  
                     search: false,
                     align: 'left',                 
                     width: 100,
                     editable: true,
                     formatter: 'number', formatoptions: { decimalPlaces: 0 },
                     editoptions: { size: 10, readonly: 'readonly'}                                    
                    },                                                     
                   { label: 'Aprobado',
                     name: 'aprobado',
                     search: false,
                     align: 'left',
                     width: 50,
                     editable: true,
                     edittype: "checkbox", editoptions: {value: "1:0", defaultValue: "0"}                     
                   },
                   { label: 'Monto Aprobado',
                     name: 'montoaprobado',
                     width: 100,
                     search: false,
                     align: 'left',
                     editable: true,
                     formatter: 'number', formatoptions: { decimalPlaces: 0 }
                   },
                   { label: 'Glosa Aprobación',
                     name: 'glosaaprobacion',
                     width: 200,
                     search: false,
                     align: 'left',
                     editable: true,
                     edittype: "textarea"
                   },
                   { label: 'Calificación',
                     name: 'idcalificacion',
                     width: 100,
                     search: false,
                     align: 'left',
                     editable: true,hidden: true,edittype: "select",
                    editoptions: {
                        dataUrl: "/prefacturasolicitud/calificacion",
                        buildSelect: function (response) {
                            var grid = $("#grid");
                            var rowKey = grid.getGridParam("selrow");
                            var rowData = grid.getRowData(rowKey);
                            var thissid = rowData.idproveedor;
                            console.log(response);
                            var data = JSON.parse(response);
                            console.log(data);
                            var s = "<select>";//el default
                            s += '<option value="0">--Escoger Calificación--</option>';
                            $.each(data, function (i, item) {
                                console.log("***proveedor:" + data[i].id + ", " + thissid);
                                if (data[i].id == thissid) {
                                    s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                                } else {
                                    s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                                }
                            });
                            console.log(s);
                            return s + "</select>";
                        }
                    }, dataInit: function (elem) { $(elem).width(200); }                     
                   },   
                   { label: 'Monto Multa',
                     name: 'montomulta',
                     width: 100,
                     search: false,
                     align: 'left',
                     editable: true,
                     formatter: 'number', formatoptions: { decimalPlaces: 0 }                     
                   },         
                   { label: 'Causal Multa',
                     name: 'idcausalmulta',
                     width: 100,
                     search: false,
                     align: 'left',
                     editable: true,hidden: true,edittype: "select",
                    editoptions: {
                        dataUrl: "/prefacturasolicitud/causalmulta",
                        buildSelect: function (response) {
                            var grid = $("#grid");
                            var rowKey = grid.getGridParam("selrow");
                            var rowData = grid.getRowData(rowKey);
                            var thissid = rowData.idproveedor;
                            console.log(response);
                            var data = JSON.parse(response);
                            console.log(data);
                            var s = "<select>";//el default
                            s += '<option value="0">--Escoger Causal Multa--</option>';
                            $.each(data, function (i, item) {
                                console.log("***proveedor:" + data[i].id + ", " + thissid);
                                if (data[i].id == thissid) {
                                    s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                                } else {
                                    s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                                }
                            });
                            console.log(s);
                            return s + "</select>";
                        }
                    }, dataInit: function (elem) { $(elem).width(200); }                     
                     
                   },
                   { label: 'Glosa Multa',
                     name: 'glosamulta',
                     width: 200,
                     search: false,
                     align: 'left',
                     editable: true,
                     edittype: "textarea"
                   }
                              
        ],
		caption: "Solicitud de Aprobación",
 		height: 'auto',
        styleUI: "Bootstrap",         
        autowidth:false, 
        sortable: "true",
        pager: "#pager",
        jsonReader: {cell:""},
        page: 1,
        rowNum: 10,  
        rowList: [5, 10, 20, 50],
        sortname: 'id',
        sortorder: 'asc',
        viewrecords: true, 
        editurl: '/prefacturasolicitud/action',           
        regional : "es",             
        subGrid: false                      
    });

    $("#grid").jqGrid('filterToolbar', {stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#grid").jqGrid('navGrid', "#pager", {
        edit: true,        
        add: false,
        del: false,
        search: false,
        refresh: true
    },
        {
            editCaption: "Modifica Solicitud",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,            
            template: tmpl,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }
        },{}
    
    );  

	leida = true;
}

