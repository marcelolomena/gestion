$(document).ready(function () {
    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color:red'>*</span>Producto {idProducto}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color:red'>*</span>Usuario {usuario}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'><span style='color:red'>*</span>Fecha {fechasolicitud}</div>";
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

    tmpl += "<div class='form-row' style='display: none;'>";
    tmpl += "<div class='column-full'>Archivo {nombrearchivo2}</div>";
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
            width: 90,
            align: 'center',
            editable: true,
            edittype: "custom",
            editoptions: {
                custom_value: sipLibrary.getRadioElementValue,
                custom_element: sipLibrary.radioElemReserva
            },
            search: false,
            sortable: false
        },
        {
            label: 'Producto',
            name: 'idProducto',
            jsonmap: 'nombre',
            align: 'center',
            width: 200,
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
            label: 'Usuario',
            name: 'idusuario',
            jsonmap: 'usuario',
            align: 'center',
            width: 100,
            editable: true,
            search: true,
            editoptions: {
                fullRow: true,
                readonly: 'readonly'
            },
            sortable: false,
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
                    val = val.substring(0, 10);
                    var fechaok = val.substring(8) + '-' + val.substring(5, 7) + '-' + val.substring(0, 4);
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
            search: false,
            sortable: false
        },
        {
            label: 'Tipo Instalación',
            name: 'idtipoinstalacion',
            width: 200,
            hidden: true,
            editable: false,
            search: false,
            sortable: false
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
                    return "<a href='/lic/downfileconsulta/" + id + "'>" + nombre + "</a>";
                } else {
                    return "Sin Adjunto";
                }
            },
            sortable: false
        },
        {
            label: 'Nombre2',
            name: 'nombrearchivo2',
            jsonmap: 'nombrearchivo',
            width: 200,
            hidden: true,
            editable: true,
            search: false,
            sortable: false
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
            search: false,
            sortable: false
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
                    var sel = false;
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
            },
            dataInit: function (elem) {
                $(elem).width(200);
            }
        },
        {
            label: 'Codigo Autorización',
            name: 'codautorizacion',
            width: 200,
            hidden: false,
            editable: false,
            search: true,
            sortable: false
        },
        {
            name: 'idprod',
            width: 200,
            hidden: true,
            editable: false,
            search: false,
            sortable: false
        }
    ];
    $("#grid").jqGrid({
        url: '/lic/instalacion-consulta',
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
        caption: 'Consulta Instalaciones',
        pager: "#pager",
        viewrecords: true,
        rowList: [10, 20, 30, 40, 50],
        styleUI: "Bootstrap",
        editurl: '/lic/instalacion-consulta',
        subGrid: true,
        subGridRowExpanded: showChildGrid
        // subGridOptions: {
        //     plusicon: "glyphicon-hand-right",
        //     minusicon: "glyphicon-hand-down"
        // },
        // subGridBeforeExpand: function (divid, rowid) {
        //     var expanded = jQuery("td.sgexpanded", "#grid")[0];
        //     if (expanded) {
        //         setTimeout(function () {
        //             $(expanded).trigger("click");
        //         }, 100);
        //     }
        // },
    });

    $("#grid").jqGrid('filterToolbar', {
        stringResult: true,
        searchOperators: true,
        searchOnEnter: false,
        defaultSearch: 'cn'
    });

    $('#grid').jqGrid('navGrid', "#pager", {
            edit: false,
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
                return [true, 'Error: ' + data.responseText, ""];
            },
            beforeShowForm: function (postdata, formid) {
                var grid = $('#grid');
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                if (rowData.idtipoinstalacion == 13 || rowData.idtipoinstalacion == 15) { //Deshabilita torre en caso de tipo PC
                    window.setTimeout(function () {
                        $("#torre").attr('disabled', true);
                    }, 1000);
                    $("#torre", formid).hide();
                }
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

        }, {}
    );

    $("#pager_left").css("width", "");


});

function showChildGrid(parentRowID, parentRowKey, suffix) {
    var subgrid_id = parentRowID;
    var row_id = parentRowKey;
    var subgrid_table_id, pager_id, toppager_id;
    subgrid_table_id = subgrid_id + '_t';
    pager_id = 'p_' + subgrid_table_id;
    toppager_id = subgrid_table_id + '_toppager';
    if (suffix) {
        subgrid_table_id += suffix;
        pager_id += suffix;
    }

    var tmpl2 = "<div id='responsive-form' class='clearfix'>";

    tmpl2 += "<div class='form-row'>";
    tmpl2 += "<div class='column-half'>Usuario<span style='color:red'>*</span>{nombre}</div>";
    tmpl2 += "<div class='column-half'>Ubicación<span style='color:red'>*</span>{ubicacion}</div>";
    tmpl2 += "</div>";

    tmpl2 += "<div class='form-row'>";
    tmpl2 += "<div class='column-full'>Código Interno <span style='color:red'>*</span>{codigoInterno}</div>";
    tmpl2 += "</div>";

    tmpl2 += "<hr style='width:100%;'/>";
    tmpl2 += "<div> {sData} {cData}  </div>";
    tmpl2 += "</div>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    // console.log("la subgrid_id : " + subgrid_id)
    var parentSolicitud = subgrid_id.split("_")[1]
    // console.log("la parentSolicitud : " + parentSolicitud)

    var parentRowData = $("#grid").getRowData(parentRowKey);
    var prod = parentRowData.idprod;

    var childGridURL = '/lic/listUbicacionInstaladas/' + parentSolicitud + '/' + prod;



    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        colNames: ['id', 'Usuario', 'Ubicación', 'Código Interno'],
        colModel: [{
                label: 'ID',
                name: 'id',
                key: true,
                hidden: true,
                editable: false
            },
            {
                name: 'nombre',
                width: 50,
                search: false,
                editable: true,
                hidden: false,
                sortable: false
            },
            {
                name: 'ubicacion',
                width: 50,
                search: false,
                editable: true,
                hidden: false,
                sortable: false
            },
            {
                name: 'codigoInterno',
                width: 50,
                search: false,
                editable: true,
                hidden: false,
                sortable: false
            }
        ],
        url: childGridURL,
        mtype: "GET",
        rowNum: 20,
        datatype: "json",
        caption: "Ubicación",
        autowidth: true,
        rownumbers: true,
        page: 1,
        viewrecords: true,
        styleUI: "Bootstrap",
        sortname: 'id',
        sortorder: "asc",
        height: "auto",
        pager: '#' + childGridPagerID,
        // editurl: '/lic/actionUbicacionInstalacion',
        subGrid: false
    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: true,
        add: true,
        del: true,
        search: false
    }, {
        editCaption: "Editar Ubicación",
        closeAfterEdit: true,
        recreateForm: true,
        mtype: 'POST',
        template: tmpl2,
        url: '/lic/actionUbicacionInstalacion',
        ajaxEditOptions: sipLibrary.jsonOptions,
        serializeEditData: sipLibrary.createJSON,
        errorTextFormat: function (data) {
            return 'Error: ' + data.responseText
        }
    }, {
        addCaption: "Agregar Ubicación",
        closeAfterAdd: true,
        recreateForm: true,
        template: tmpl2,
        mtype: 'POST',
        url: '/lic/actionUbicacionInstalacion',
        ajaxEditOptions: sipLibrary.jsonOptions,
        serializeEditData: sipLibrary.createJSON,
        onclickSubmit: function (rowid) {
            return {
                parent_id: parentSolicitud
            };
        },
        errorTextFormat: function (data) {
            return 'Error: ' + data.responseText
        }
    }, {
        closeAfterDelete: true,
        recreateForm: true,
        ajaxEditOptions: sipLibrary.jsonOptions,
        serializeEditData: sipLibrary.createJSON,
        addCaption: "Eliminar Ubicación",
        mtype: 'POST',
        url: '/lic/actionUbicacionInstalacion',
        errorTextFormat: function (data) {
            return 'Error: ' + data.responseText
        }
    });
}