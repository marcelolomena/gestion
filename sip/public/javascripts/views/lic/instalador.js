$(document).ready(function () {
    var tmpl = "<div id='responsive-form' class='clearfix'>";
    
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Producto {idProducto}</div>";
    tmpl += "</div>";
    
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Usuario {idusuario}</div>";
    tmpl += "</div>";    

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Fecha {fechasolicitud}</div>";
    tmpl += "<div class='column-half' style='display: none;'>Torre {idtorre}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Comentario Solicitud {informacion}</div>";
    tmpl += "</div>";
    
    tmpl += "<div class='form-half'>";
    tmpl += "<div class='column-full'>Comentario Visación {comentariovisacion}</div>";
    tmpl += "</div>";  
	
    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'><span style='color:red'>*</span>Estado {estado}</div>";
    tmpl += "</div>";
    
    tmpl += "<div class='form-half'>";
    tmpl += "<div class='column-half'><span style='color:red'>*</span>Comentario Instalación {comentarioinstalacion}</div>";
    tmpl += "</div>"; 
	
    tmpl += "<div class='form-row' style='display: none;'>";
    tmpl += "<div class='column-full'>Archivo {nombrearchivo2}</div>";
    tmpl += "</div>";   
    
    tmpl += "<div class='form-row' style='display: none;'>";
    tmpl += "<div class='column-full'>Producto {producto}</div>";
    tmpl += "</div>";     

    tmpl += "<hr style='width:100%;'/>";
    tmpl += "<div> {sData} {cData}  </div>";
    tmpl += "</div>";

    var viewModel = [{
        label: 'ID',
        name: 'id',
        key: true,
        hidden: true,
        editable: false
    }
    , {
        label: 'Estado',
        name: 'estado',
        width: 225,
        align: 'center',
        editable: true,
        edittype: "custom",
        sortable: false,
        editoptions: {
            custom_value: sipLibrary.getRadioElementValue,
            custom_element: sipLibrary.radioElemInstalacion
        },
        search: false
    },
    {
        label: 'Producto',
        name: 'idProducto',
        jsonmap: 'nombre',
        align: 'center',
        width: 225,
        editable: true,
        sortable: false,
        editoptions: {
            fullRow: true,
            readonly: 'readonly'
        },
        editrules: {
            required: false,
            edithidden: false
        },
        search: true,
        stype: 'select',
        searchoptions: {
            dataUrl: '/lic/getProductoInst',
            buildSelect: function (response) {
                var data = JSON.parse(response);
                var s = "<select>";
                s += '<option value="0">--Escoger Producto--</option>';
                $.each(data, function (i, item) {
                    s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                });
                return s + "</select>";
            }
        }          
    },
    {
        label: 'IDProducto',
        name: 'producto',
        jsonmap: 'idproducto',
        width: 225,
        hidden: true,
        sortable: false,
        editable: true,
        search: false
    },    
    {
        label: 'Usuario',
        name: 'idusuario',
        jsonmap: 'usuario',
        align: 'center',
        width: 225,
        editable: true,
        search: true,
        sortable: false,
        editoptions: {
            fullRow: true,
            readonly: 'readonly'
        },
        stype: 'select',
        searchoptions: {
            dataUrl: '/lic/getUsuariosInst',
            buildSelect: function (response) {
                var data = JSON.parse(response);
                var s = "<select>";
                s += '<option value="0">--Escoger Usuario--</option>';
                $.each(data, function (i, item) {
                    s += '<option value="' + data[i].uid + '">' + data[i].nombre + '</option>';
                });
                return s + "</select>";
            }
        }                     
    },    
    {
        label: 'Fecha',
        name: 'fechasolicitud',
        width: 225,
        align: 'center',
        sortable: false,
        editable: true,
        sortable: false,
        editoptions: {
            fullRow: true,
            readonly: 'readonly'
        },        
        formatter: function (cellvalue, options, rowObject) {
            //2017-12-31T00:00:00.000Z
            var val = rowObject.fechasolicitud;
            if (val != null) {
                val = val.substring(0,10);
                var fechaok = val.substring(8)+'-'+val.substring(5,7)+'-'+val.substring(0,4);
                return fechaok;
            } else {
                return '';
            }
        },
        search: false
    },
    {
        label: 'Comentario de Solicitud',
        name: 'informacion',
        width: 225,
        hidden: false,
        editable: true,
        edittype: 'textarea',
        editoptions: {
            fullRow: true,
            readonly: 'readonly'
        },
        editrules: {
            edithidden: false
        },
        sortable: false,
        search: false
    },
    {
        label: 'Tipo Instalación',
        name: 'idtipoinstalacion',
        width: 225,
        hidden: true,
        sortable: false,
        editable: false,
        search: false
    },    
    {
        label: 'Adjunto',
        name: 'nombrearchivo',
        width: 225,
        hidden: false,
        editable: true,
        sortable: false,
        search: false,
        formatter: function (cellvalue, options, rowObject) {
            var nombre = rowObject.nombrearchivo;
            var id = rowObject.id;
            if (nombre != null) {
                return "<a href='/lic/downfile/"+id+"'>"+nombre+"</a>" ;
            } else {
                return "Sin Adjunto";
            }
        },        
    },   
    {
        label: 'Nombre2',
        name: 'nombrearchivo2',
        jsonmap: 'nombrearchivo',
        width: 225,
        hidden: true,
        sortable: false,
        editable: true,
        search: false
    },       
    {
        label: 'Comentario de Visación',
        name: 'comentariovisacion',
        width: 225,
        hidden: false,
        editable: true,
        sortable: false,
        edittype: 'textarea',
        editoptions: {
            fullRow: true,
            readonly: 'readonly'
        },		
        search: false
    },
    {
        label: 'Torre',
        name: 'idtorre',
        jsonmap: 'idtorre',
        width: 225,
        align: 'center',
        sortable: false,
        editable: true,
        search: false,
        hidden: true        
    }, 
    {
        label: 'Comentario de Instalación',
        name: 'comentarioinstalacion',
        width: 225,
        hidden: false,
        editable: true,
        sortable: false,
        edittype: 'textarea',
        editrules: {
            required: true
        },
        search: false
    },	
];
    $("#grid").jqGrid({
        url: '/lic/instalador',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: viewModel,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        sortable: "true",
        width: null,
        shrinkToFit: false,
        caption: 'Instalación Software',
        pager: "#pager",
        viewrecords: true,
        rowList: [10, 20, 30, 40, 50],
        styleUI: "Bootstrap",
        editurl: '/lic/instalador',
        subGrid: false // set the subGrid property to true to show expand buttons for each row
    });

    $("#grid").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $('#grid').jqGrid('navGrid', "#pager", {
        edit: true,
        add: false,
        del: false,    
        refresh: true,
        search: false, // show search button on the toolbar        
        cloneToTop: false
    },

        {
            editCaption: "Modifica Instalación",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return [true,'Error: ' + data.responseText, ""];
            },
            beforeSubmit: function (postdata, formid) {
                console.log("beforeSubmit");
                var grid = $('#grid');
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                if (rowData.estado == 'Instalado') {
                    return [false, "No puede editar asignación en estado Instalado", ""];
                } else {
                    return [true, "", ""]
                }

            }

        },   
        {}
    );

    $("#pager_left").css("width", "");
});

