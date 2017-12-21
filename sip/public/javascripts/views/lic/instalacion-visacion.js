$(document).ready(function () {
    var tmpl = "<div id='responsive-form' class='clearfix'>";
    
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color:red'>*</span>Producto {idProducto}</div>";
    tmpl += "</div>";
    
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color:red'>*</span>Usuario {usuario}</div>";
    tmpl += "</div>";    

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'><span style='color:red'>*</span>Fecha {fechauso}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Comentario Solicitud {informacion}</div>";
    tmpl += "</div>";
    
    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>Estado {estado}</div>";
    tmpl += "</div>";
    
    tmpl += "<div class='form-half'>";
    tmpl += "<div class='column-half'>Comentario Visación {comentariovisacion}</div>";
    tmpl += "</div>"; 

    tmpl += "<div class='form-half'>";
    tmpl += "<div class='column-full'>Torre {torre}</div>";
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
        width: 90,
        align: 'center',
        editable: true,
        edittype: "custom",
        editoptions: {
            custom_value: sipLibrary.getRadioElementValue,
            custom_element: sipLibrary.radioElemReserva
        },
        search: false
    },
    {
        label: 'Producto',
        name: 'idProducto',
        jsonmap: 'nombre',
        align: 'center',
        width: 200,
        editable: true,
        editoptions: {
            fullRow: true,
            readonly: 'readonly'
        },
        editrules: {
            required: false,
            edithidden: false
        },
        search: false
    },
    {
        label: 'Usuario',
        name: 'usuario',
        align: 'center',
        width: 100,
        editable: true,
        search: false,
        editoptions: {
            fullRow: true,
            readonly: 'readonly'
        }        
    },    
    {
        label: 'Fecha',
        name: 'fechasolicitud',
        width: 110,
        align: 'center',
        sortable: false,
        editable: true,
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
        width: 200,
        hidden: false,
        editable: true,
        edittype: 'textarea',
        editoptions: {
            fullRow: true,
            readonly: 'readonly'
        },
        editrules: {
            required: false,
            edithidden: false
        },
        search: false
    },
    {
        label: 'Adjunto',
        name: 'nombrearchivo',
        width: 200,
        hidden: false,
        editable: true,
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
        label: 'Comentario de Visación',
        name: 'comentariovisacion',
        width: 200,
        hidden: false,
        editable: true,
        edittype: 'textarea',
        editrules: {
            required: true
        },
        search: false
    },
    {
        label: 'Torre',
        name: 'torre',
        jsonmap: 'torre',
        width: 50,
        align: 'center',
        sortable: false,
        editable: true,
        edittype: 'select', 
        editrules: {
            required: true
        },
        search: false,
        editoptions: {
            dataUrl: '/lic/torres',
            buildSelect: function (response) {
                var grid = $("#grid");
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                var thissid = rowData.torre;
                var data = JSON.parse(response);
                var s = "<select>";
                var sel=false;
                s += '<option value="0">--Escoger Torre--</option>';
                $.each(data, function (i, item) {
                    if (data[i].id == thissid) {
                        s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                    } else {
                        s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                    }
                });
                return s + "</select>";
            }
        }, dataInit: function (elem) { $(elem).width(200); }        
    }, 
];
    $("#grid").jqGrid({
        url: '/lic/instalacion-visacion',
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
        caption: 'Aprobación Reservas',
        pager: "#pager",
        viewrecords: true,
        rowList: [10, 20, 30, 40, 50],
        styleUI: "Bootstrap",
        editurl: '/lic/instalacion-visacion',
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
            editCaption: "Modifica Visación",
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
                if (rowData.estado == 'Autorizado') {
                    return [false, "No puede editar asignación en estado Autorizado", ""];
                } else {
                    return [true, "", ""]
                }
            }

        },   
        {}
    );

    $("#pager_left").css("width", "");
});
