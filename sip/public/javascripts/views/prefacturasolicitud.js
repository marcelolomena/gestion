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
    var mes = parseInt(d.getMonth()) + 1;  
    var mesok = mes < 10 ? '0' + mes : mes;
    return anio+mesok;
    
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
    tmpl += "<div class='column-full'>CUI {idcui}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Servicio {idservicio}</div>";
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
    tmpl += "<div class='column-half'>Causa Multa {idcausamulta}</div>";
    tmpl += "</div>";        

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>Glosa Multa {glosamulta}</div>";
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
        postData: {
            page: function () {
                return 1;
            },
            rows: function () {
                return 10;
            }                                          
        },        
        colModel: [
                   { label: 'id',
                      name: 'id',
                      width: 50,
                      hidden:true
                   },
                   { label: 'Proveedor',
                     name: 'razonsocial',  
                     search: false,
                     key: true, 
                     align: 'left',                 
                     width: 50
                   },        
                   { label: 'Periodo',
                     name: 'periodocompromiso',
                     width: 100,
                     align: 'right',
                     search: false
                   },  
                   { label: 'Servicio',
                     name: 'servicio',
                     width: 100,
                     align: 'right',
                     search: false
                   },  
                   { label: 'Glosa Servicio',
                     name: 'glosaservicio',
                     width: 100,
                     align: 'right',
                     search: false
                   },         
                   { label: 'Monto a Pagar',
                     name: 'montoapagar',  
                     search: false,
                     align: 'left',                 
                     width: 100                   
                    },                                                     
                   { label: 'Aprobado',
                     name: 'aprobado',
                     search: false,
                     align: 'left',
                     width: 80
                   },
                   { label: 'Monto Aprobado',
                     name: 'montoaprobado',
                     width: 100,
                     search: false,
                     align: 'left'
                   },
                   { label: 'Glosa Aprobación',
                     name: 'glosaaprobacion',
                     width: 200,
                     search: false,
                     align: 'left'
                   },
                   { label: 'Calificación',
                     name: 'idcalificacion',
                     width: 100,
                     search: false,
                     align: 'left'
                   },   
                   { label: 'Monto Multa',
                     name: 'montomulta',
                     width: 100,
                     search: false,
                     align: 'left'
                   },         
                   { label: 'Causal Multa',
                     name: 'idcausalmulta',
                     width: 100,
                     search: false,
                     align: 'left'
                   },
                   { label: 'Glosa Multa',
                     name: 'glosamulta',
                     width: 200,
                     search: false,
                     align: 'left'
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
        regional : "es",
        loadComplete: function () {
            var $grid = $("#grid");
            var colSum = $grid.jqGrid('getCol', 'monto', false, 'sum');
            $grid.jqGrid('footerData', 'set', { monto: colSum });
        },               
        subGrid: false, 
        footerrow: true,
        userDataOnFooter: true                        
    });

    $("#grid").jqGrid('filterToolbar', {stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#grid").jqGrid('navGrid', "#pager", {
        edit: true,        
        add: false,
        del: false,
        search: false, // show search button on the toolbar
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
            },
            beforeSubmit: function (postdata, formid) {
                var grid = $('#grid');
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                /*if (rowData.estado == 'Aprobado') {
                    return [false, "No puede editar presupuestos en estado Aprobado", ""];
                } else { 
                    if (rowData.idcui != postdata.idcui) {
                        return [false, "NO puede cambiar el CUI base", ""];
                    } if (rowData.idejercicio != postdata.idejercicio) {
                        return [false, "NO puede cambiar el Ejercicio base", ""];
                    }
                    return [true, "", ""]
                }*/
            },
            beforeShowForm: function (postdata, formid) {
                var grid = $('#grid');
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                var s = grid.jqGrid('getGridParam', 'selarrrow');
                /*window.setTimeout(function () {
                    $("#idcui").attr('disabled', true);
                    $("#idejercicio").attr('disabled', true);
                }, 1000);*/

            }
        },{}
    
    );  

	leida = true;
}

