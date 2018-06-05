
$(document).ready(function () {
    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color:red'>*</span>Producto {idProducto}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'><span style='color:red'>*</span>Cantidad {numlicencia}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'><span style='color:red'>*</span>Fecha {fechaUso}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>CUI {cui}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>SAP {sap}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Comentario Solicitud {comentarioSolicitud}</div>";
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
    }, {
        label: 'Estado',
        name: 'estado',
        align: 'center',
        width: 100,
        editable: false,
        search: false
    }, {
        label: 'Código Autorización',
        name: 'codAutoriza',
        align: 'center',
        width: 140,
        editable: false,
        search: false,
        formatter: returnTaskLink
    }, {
        label: 'Producto',
        name: 'idProducto',
        jsonmap: 'producto.nombre',
        width: 250,
        align: 'center',
        sortable: false,
        editable: true,
        edittype: 'select',
        editoptions: {
            fullRow: true,
            dataUrl: '/lic/getProductoCompra',
            buildSelect: function (response) {
                var grid = $("#grid");
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                var thissid = rowData.nombre;
                var data = JSON.parse(response);
                var s = "<select>";//el default
                s += '<option value="0">--Escoger Producto--</option>';
                $.each(data, function (i, item) {
                    if (data[i].id == thissid) {
                        s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                    } else {
                        s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                    }
                });
                return s + "</select>";
            },
        },
        editrules: {
            required: true
        },
        search: false
    }, {
        label: 'Cantidad Lic.',
        name: 'numlicencia',
        align: 'center',
        width: 100,
        editable: true,
        editrules: {
            required: true
        },
        search: false
    },
    {
        label: 'Fecha de Uso',
        name: 'fechaUso',
        width: 100,
        align: 'center',
        search: false,
        formatter: function (cellvalue, options, rowObject) {
            //2017-12-31T00:00:00.000Z
            var val = rowObject.fechaUso;
            if (val != null) {
                val = val.substring(0, 10);
                var fechaok = val.substring(8) + '-' + val.substring(5, 7) + '-' + val.substring(0, 4);
                return fechaok;
            } else {
                return '';
            }
        },
        formatoptions: {
            srcformat: 'ISO8601Long',
            newformat: 'd-m-Y'
        },
        editable: true,
        editrules: {
            required: true
        },
        searchoptions: {
            dataInit: function (el) {
                $(el).datepicker({
                    language: 'es',
                    format: 'dd-mm-yyyy',
                    autoclose: true,
                    onSelect: function (dateText, inst) {
                        setTimeout(function () {
                            $gridTab[0].triggerToolbar();
                        }, 100);
                    }
                });
            },
            sopt: ["eq", "le", "ge"]
        },
        editoptions: {
            size: 10,
            maxlengh: 10,
            dataInit: function (element) {
                $(element).mask("00-00-0000", {
                    placeholder: "__-__-____"
                });
                $(element).datepicker({
                    language: 'es',
                    format: 'dd-mm-yyyy',
                    autoclose: true
                })
            }
        },
    }, {
        label: 'CUI',
        name: 'cui',
        align: 'center',
        width: 60,
        editable: true,
        editrules: {
            required: true
        },
        search: false
    }, {
        label: 'SAP',
        name: 'sap',
        align: 'center',
        width: 60,
        editable: true,
        search: false
    }, {
        label: 'Comentario',
        name: 'comentarioSolicitud',
        width: 400,
        hidden: false,
        editable: true,
        edittype: 'textarea',
        editoptions: {
            fullRow: true
        },
        editrules: {
            required: true
        },
        search: false
    }, {
        label: 'Usuario',
        name: 'idUsuario',
        jsonmap: 'user.first_name' + 'user.last_name',
        align: 'center',
        width: 100,
        hidden: true,
        editable: false,
        search: false
    }, {
        label: 'Usuario',
        name: 'idUsuarioJefe',
        jsonmap: 'userJefe.first_name' + 'user.last_name',
        align: 'center',
        width: 100,
        hidden: true,
        editable: false,
        search: false
    }
    ];

    $("#grid").jqGrid({
        url: '/lic/reserva',
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
        caption: 'Reservas',
        pager: "#pager",
        viewrecords: true,
        rowList: [10, 20, 30, 40, 50],
        styleUI: "Bootstrap",
        editurl: '/lic/reserva',
        subGrid: true,
        subGridRowExpanded: showChildGrid
    });

    $("#grid").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $('#grid').jqGrid('navGrid', "#pager", {
        edit: true,
        add: true,
        del: true,
        refresh: true,
        search: false, // show search button on the toolbar        
        cloneToTop: false
    },

        {
            editCaption: "Modifica Solicitud",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return [true, 'Error: ' + data.responseText, ""];
            },
            beforeShowForm: function (form) {
                var grid = $("#grid");
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                var estad = rowData.estado;
                if (estad != 'A la Espera') {
                    setTimeout(function () {
                        $("#idProducto").attr('disabled', true);
                        $("#numlicencia").attr('disabled', true);
                        $("#fechaUso").attr('disabled', true);
                        $("#cui").attr('disabled', true);
                        $("#sap").attr('disabled', true);
                        $("#comentarioSolicitud").attr('disabled', true);
                    }, 500);

                } else {
                    $("#cui").attr('disabled', true);
                }
            },
            beforeSubmit: function (postdata, formid) {
                console.log("beforeSubmit");
                var grid = $('#grid');
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                if (rowData.estado != 'A la Espera') {
                    return [false, "No puede editar asignación debe estar en estado A la Espera", ""];
                } else if (!(postdata.numlicencia > 0)) {
                    return [false, "CUI debe ser numérico", ""];
                } else if (!(postdata.cui > 0)) {
                    return [false, "CUI debe ser numérico", ""];
                } else if (!(postdata.sap >= 0)) {
                    return [false, "SAP debe ser numérico", ""];
                } else {
                    return [true, "", ""]
                }
            }

        },
        {
            addCaption: "Agrega Solicitud",
            closeAfterAdd: true,
            recreateForm: true,
            mtype: 'POST',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,

            beforeShowForm: function (form) {
                $.ajax({
                    type: "GET",
                    url: '/lic/usuariocui',
                    async: false,
                    success: function (data) {
                        if (data) {
                            $("input#cui").val(data[0].cui);
                            $("#cui").attr('disabled', true);
                        } else {
                            alert("No existe CUI asociado al Usuario");

                        }
                    }
                });
            },
            beforeSubmit: function (postdata, formid) {
                console.log("beforeSubmit");
                var grid = $('#grid');
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                if (rowData.estado != 'A la Espera') {
                    return [false, "No puede editar asignación debe estar en estado A la Espera", ""];
                } else if (!(postdata.numlicencia > 0)) {
                    return [false, "CUI debe ser numérico", ""];
                } else if (!(postdata.cui > 0)) {
                    return [false, "CUI debe ser numérico", ""];
                } else if (!(postdata.sap >= 0)) {
                    return [false, "SAP debe ser numérico", ""];
                } else {
                    return [true, "", ""]
                }
            },
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
        }, {

        }
    );

    $("#pager_left").css("width", "");
});

function returnTaskLink(cellValue, options, rowdata, action) {
    if (rowdata.estado === 'Autorizado') {
        return "<a target='_blank' href='/lic/solicitudReservaPDF/" + rowdata.id + "/' >" + cellValue + " <img src='../../../../images/export_pdf.png' alt='PDF'></a>";
    } else {
        return ''
    }
}


function showChildGrid(parentRowID, parentRowKey) {
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";

    var grid = $("#" + childGridID);
    var rowKey = grid.getGridParam("selrow");

    var childGridURL = '/lic/estado/' + parentRowKey;

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        colModel:[{
            label: 'ID',
            name: 'id',
            key: true,
            hidden: true,
            editable: true
        }, {
            label: 'Estado',
            name: 'estado',
            align: 'center',
            width: 100,
            editable: false,
            search: false
        }, {
            label: 'Fecha de Aprobación',
            name: 'fechaAprobacion',
            width: 150,
            align: 'center',
            sortable: false,
            editable: false,
            editoptions: {
                'data-provide': 'datepicker',
                dataInit: function (element) {
                    $(element).mask("00-00-0000", {
                        placeholder: "DD-MM-AAAA"
                    });
                    $(element).datepicker({
                        language: 'es',
                        weekStart: 1,
                        format: 'dd-mm-yyyy',
                        autoclose: true
                    })
                },
                dataEvents: [{
                    type: 'change',
                    fn: function (e) {
    
                    }
                }],
            },
            editrules: {
                required: true
            },
            search: false
        }, {
            label: 'Aprobador',
            name: 'idUsuarioJefe',
            jsonmap: 'userJefe',
            align: 'center',
            width: 100,
            editable: false,
            search: false
        }, {
            label: 'Comentario de Aprobación',
            name: 'comentarioAprobacion',
            width: 500,
            hidden: false,
            editable: false,
            edittype: 'textarea',
            editoptions: {
                fullRow: true
            },
            editrules: {
                required: true
            },
            search: false
        }, {
            label: 'Fecha de Autorización',
            name: 'fechaAutorizacion',
            width: 150,
            align: 'center',
            sortable: false,
            editable: false,
            editoptions: {
                'data-provide': 'datepicker',
                dataInit: function (element) {
                    $(element).mask("00-00-0000", {
                        placeholder: "DD-MM-AAAA"
                    });
                    $(element).datepicker({
                        language: 'es',
                        weekStart: 1,
                        format: 'dd-mm-yyyy',
                        autoclose: true
                    })
                },
                dataEvents: [{
                    type: 'change',
                    fn: function (e) {
    
                    }
                }],
            },
            editrules: {
                required: true
            },
            search: false
        }, {
            label: 'Comentario de Autorización',
            name: 'comentarioAutorizacion',
            width: 500,
            hidden: false,
            editable: false,
            edittype: 'textarea',
            editoptions: {
                fullRow: true
            },
            editrules: {
                required: true
            },
            search: false
        }],
        styleUI: "Bootstrap",
        regional: "es",
        pgbuttons: false,
        pgtext: null,
        height: 'auto',
        viewrecords: false,
        width: null,
        shrinkToFit: false,
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        pager: "#" + childGridPagerID
        //colMenu:true
    });
    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false,
        add: false,
        del: false,
        search: false,
        refresh: true,
        view: false, position: "left", cloneToTop: false
    },
        {
        },
         {}
    );

}    