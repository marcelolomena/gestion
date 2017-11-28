$(document).ready(function () {
    var tmpl = "<div id='responsive-form' class='clearfix'>";
    //numero, idproveedor, fecha, montoneto, impuesto, montototal
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color:red'>*</span>Producto {idProducto}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'><span style='color:red'>*</span>Cantidad {numlicencia}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'><span style='color:red'>*</span>Fecha {fechauso}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>CUI {cui}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>SAP {sap}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Comentario Solicitud {comentariosolicitd}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-half'>";
    tmpl += "<div class='column-half'>Estado {estado}</div>";
    tmpl += "</div>";    

    tmpl += "<div class='form-half'>";
    tmpl += "<div class='column-half'>Comentario Aprobación {comentarioaprobacion}</div>";
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
        label: 'Cantidad',
        name: 'numlicencia',
        align: 'center',
        width: 70,
        editable: true,
        editoptions: {
            readonly: 'readonly'
        },
        editrules: {
            required: false,
            edithidden: false
        },
        search: false
    },
    {
        label: 'Fecha de Uso',
        name: 'fechauso',
        width: 110,
        align: 'center',
        sortable: false,
        editable: true,
        formatter: function (cellvalue, options, rowObject) {
            //2017-12-31T00:00:00.000Z
            var val = rowObject.fechauso;
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
        label: 'CUI',
        name: 'cui',
        jsonmap: 'cui',
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
            dataUrl: '/lic/cuisjefe',
            buildSelect: function (response) {
                var grid = $("#grid");
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                var thissid = rowData.cui;
                var data = JSON.parse(response);
                var s = "<select>";
                var sel=false;
                s += '<option value="0">--Escoger CUI--</option>';
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
    {
        label: 'SAP',
        name: 'sap',
        align: 'center',
        width: 50,
        editable: true,
        search: false
    }, {
        label: 'Comentario de Solicitud',
        name: 'comentariosolicitud',
        width: 300,
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
    }, {
        label: 'Estado',
        name: 'estado',
        width: 90,
        align: 'center',
        editable: true,
        edittype: "custom",
        editoptions: {
            custom_value: sipLibrary.getRadioElementValue,
            custom_element: sipLibrary.radioElemReserva
            //defaultValue: "Aprobar"
            // fullRow: true
        },
        search: false
    },
    {
        label: 'Comentario de Aprobación',
        name: 'comentarioaprobacion',
        width: 300,
        hidden: false,
        editable: true,
        edittype: 'textarea',
        // editoptions: {
        //     fullRow: true
        // },
        editrules: {
            required: true
        },
        search: false
    }
];
    $("#grid").jqGrid({
        url: '/lic/reserva-aprobacion',
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
        editurl: '/lic/reserva-aprobacion',
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
            editCaption: "Modifica Asignación",
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
            },
            afterShowForm :  function (formid){
                console.log("beforeSubmit");
            },
            afterComplete : function (response, postdata, formid) {
                console.log("afterComplete");
            },
            onclickSubmit : function(params, posdata) { 
                console.log("onclickSubmit");
                return null;
            }            

        },   
        {}
    );

    $("#pager_left").css("width", "");
});
