$(document).ready(function () {
    var tmpl = "<div id='responsive-form' class='clearfix'>";
    //numero, idproveedor, fecha, montoneto, impuesto, montototal
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color:red'>*</span>Producto {idProducto}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color:red'>*</span>Cantidad {numlicencia}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color:red'>*</span>Fecha {fechauso}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>CUI {cui}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>SAP {sap}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Comentario Solicitud {comentariosolicitd}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Estado {estado}</div>";
    tmpl += "</div>";    

    tmpl += "<div class='form-row'>";
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
        editoptions: {
            dataUrl: '/lic/cuisjefe',
            buildSelect: function (response) {
                var rowData = $table.getRowData($table.getGridParam('selrow'));
                var thissid = rowData.id;
                var data = JSON.parse(response);
                return new zs.SelectTemplate(data, 'Seleccione el CUI', thissid).template;
            },
        },
        editrules: {
            required: true
        },
        search: false
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
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        editurl: '/facturas/action',
        subGrid: false // set the subGrid property to true to show expand buttons for each row
    });

    $("#grid").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $('#grid').jqGrid('navGrid', "#pager", {
        edit: true,
        refresh: true,
        search: false, // show search button on the toolbar        
        cloneToTop: false
    },

        {
            editCaption: "Modifica Factura",
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
                if (rowData.estado == 'Aprobado') {
                    return [false, "No puede editar presupuestos en estado Aprobado", ""];
                } else {
                    if (rowData.idcui != postdata.idcui) {
                        return [false, "NO puede cambiar el CUI base", ""];
                    } if (rowData.idejercicio != postdata.idejercicio) {
                        return [false, "NO puede cambiar el Ejercicio base", ""];
                    }
                    return [true, "", ""]
                }
            },
            beforeShowForm: function (postdata, formid) {
                var grid = $('#grid');
                var rowKey = grid.getGridParam("selrow");
                //alert("rowKey:"+rowKey);
                var rowData = grid.getRowData(rowKey);
                //alert("rowData:"+rowData);
                var s = grid.jqGrid('getGridParam', 'selarrrow');
                //alert("SS:"+s);
                window.setTimeout(function () {
                    $("#idcui").attr('disabled', true);
                    $("#idejercicio").attr('disabled', true);
                }, 1000);

            }
        },{
            addCaption: "Agrega Factura",
            closeAfterAdd: true,
            recreateForm: true,
            //mtype: 'GET',
            //url: '/iniciativas/add',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                if (postdata.numero == "") {
                    return [false, "Ingrese número de factura", ""];
                } else if (postdata.idproveedor == "0") {
                    return [false, "Ingrese proveedor", ""];
                } else if (postdata.fecha == "") {
                    return [false, "Ingrese fecha", ""];
                } else if (postdata.montoneto == "") {
                    return [false, "Ingrese subtotal", ""];
                } else if (postdata.impuesto == "") {
                    return [false, "Ingrese impuesto", ""];
                } else if (postdata.montototal == "") {
                    return [false, "Ingrese total", ""];
                } else {
                    return [true, "", ""];
                }
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                console.log(result)
                if (result.error_code == 10) {
                    return [false, "Ya existe una Factura con ese mismo numero", ""];
                } else if (result.error_code == 0) {
                    console.log("exitoso");
                    //alert("Presupuesto creado en forma exitosa");                 
                    return [true, "listo", ""];
                }

            },
            beforeShowForm: function (postdata, formid) {
                var grid = $('#grid');
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);

            }
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Elimina Factura",
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }
        },        
        {}
    );

    $("#pager_left").css("width", "");
});
