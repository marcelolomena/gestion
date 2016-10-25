$(document).ready(function () {
    var tmpl = "<div id='responsive-form' class='clearfix'>";
            //numero, idproveedor, fecha, subtotal, impuesto, total
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color:red'>*</span>Numero {numero}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color:red'>*</span>Proveedor {idproveedor}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color:red'>*</span>Fecha {fecha}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' style='display: none;'>";
    tmpl += "<div class='column-half'>Subtotal {subtotal}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' style='display: none;'>";
    tmpl += "<div class='column-half'>Impuesto {impuesto}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' style='display: none;'>";
    tmpl += "<div class='column-half'>Total {total}</div>";
    tmpl += "</div>";
        
    tmpl += "<hr style='width:100%;'/>";
    tmpl += "<div> {sData} {cData}  </div>";
    tmpl += "</div>";

    var modelFacturas = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'Numero', name: 'numero', width: 100, align: 'left', search: true, sortable: false, editable: true },
        {
            label: 'Proveedor', name: 'razonsocial', width: 250, align: 'left', search: true,sortable: false, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Proveedor', name: 'idproveedor', width: 80, align: 'left', search: false,sortable: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/facturas/proveedores',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idcui;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Proveedor--</option>';
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
        { label: 'Fecha', name: 'fecha', width: 100, align: 'left', search: true, sortable: false, editable: true, 
            formatter: 'date', formatoptions: { decimalPlaces: 0 }},
        { label: 'Subtotal', name: 'subtotal', width: 200, align: 'right', search: true, sortable: false, editable: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 } },
        {label: 'Impuesto', name: 'impuesto', width: 80, align: 'right', sortable: false, search: true, editable: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 } },      
        { label: 'Total', name: 'total', width: 200, align: 'right', search: true, sortable: false, editable: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 } }
        
    ];
    $("#grid").jqGrid({
        url: '/facturaslist',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelFacturas,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        sortable: "true",
        width: null,
        shrinkToFit: false,
        caption: 'Lista de Facturas',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        editurl: '/facturas/action',
        subGrid: true, // set the subGrid property to true to show expand buttons for each row
        subGridRowExpanded: showItemsFacturas, // javascript function that will take care of showing the child grid        
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }
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
        },
        {
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
                var grid = $('#grid');
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                if (rowKey == null) {
                    //alert("Esta opción agrega presupuesto para un nuevo CUI.\nPara una nueva versión de presupuesto:\n   1.-Seleccione versión base\n   2.-Presione boton agregar");
                    //return [false, "", ""];
                } else {
                    if (rowData.idcui != postdata.idcui) {
                        return [false, "NO puede cambiar el CUI base", ""];
                    }
                }
                console.log("*** selrow:" + rowKey);
                console.log("***Ejercicio:" + postdata.idejercicio + "," + rowData.idejercicio);
                postdata.id = rowKey;
                //Obtiene version
                var ver = getVersion(postdata.idcui, postdata.idejercicio);
                console.log("Version:" + ver);
                if (ver > 0) {
                    postdata.version = parseInt(ver) + 1;
                    console.log("v+1:" + postdata.version);
                } else {
                    postdata.version = 1;
                }

                postdata.ejercicio = rowData.ejercicio;
                postdata.montoforecast = rowData.montoforecast;
                postdata.montoanual = rowData.montoanual;
                if (postdata.idcui == 0) {
                    return [false, "CUI: Debe escoger un valor", ""];
                } if (postdata.idejercicio == 0) {
                    return [false, "Ejercicio: Debe escoger un valor", ""];
                } if (postdata.descripcion == 0) {
                    return [false, "Descripción: Debe escoger un valor", ""];
                } else {
                    return [true, "", ""]
                }

            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                console.log(result)  
                if (result.error_code == 10) {
                    return [false, "Ya existe un presuspuesto Aprobado o Confirmado para el CUI", ""];
                } else if (result.error_code == 0) {
                    console.log("exitoso");  
                    alert("Presupuesto creado en forma exitosa");                 
                    return [true, "listo", ""];
                }

            }, 
            beforeShowForm: function (postdata, formid) {
                var grid = $('#grid');
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                if (rowKey == null) {
                    //alert("Esta opción agrega presupuesto para un nuevo CUI.\nPara una nueva versión de presupuesto:\n   1.-Seleccione versión base\n   2.-Presione boton agregar");
                    //return [false, "", ""];
                } else {
                    window.setTimeout(function () {
                        $("#idcui").attr('disabled', true);
                    }, 1000);
                }                


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
            }, beforeSubmit: function (postdata, formid) {
                var grid = $('#grid');
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }
        }, {}
    );

    $("#pager_left").css("width", "");
});


function showItemsFacturas(parentRowID, parentRowKey) {
    console.log("en shoitem");
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    var childGridURL = "/presupuestoservicios/" + parentRowKey;
    var urlServicios = '/serviciospre/' + parentRowKey;
    var urlProveedores = '/proveedorespre/' + parentRowKey;
    var urlProveedoresServ = '/proveedorespreserv/' + parentRowKey;
    var urlFrecuencia = '/serviciosfrecuencia/';
    var urlPeriodo = '/serviciosperiodos/';
    var urlRecupera = '/tiporecupera/';

    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full' style='display: none;'>Periodo {iddetallecompromiso}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Periodo {periodo}</div>";
    tmpl += "<div class='column-half'>Proveedor {razonsocial}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Servicio {nombre}</div>";
    tmpl += "</div>";


    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-full'>Glosa Servicio {glosaservicio}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>Monto Neto a Pagar {montoneto}</div>";
    tmpl += "<div class='column-half'>Moneda {moneda}</div>";
    tmpl += "</div>";
    
    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'><span style='color:red'>*</span>Estado Solicitud {aprobado}</div>";
    tmpl += "<div class='column-half'><span style='color:red'>*</span>Monto Neto Aprobado {montoaprobado}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-full'>Glosa Estado {glosaaprobacion}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>Causa Multa {idcausalmulta}</div>";
    tmpl += "<div class='column-half'>Monto Neto Multa {montomulta}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>Glosa Multa {glosamulta}</div>";
    tmpl += "<div class='column-half'>Calificación {idcalificacion}</div>";
    tmpl += "</div>";

    tmpl += "<hr style='width:100%;'/>";
    tmpl += "<div align='left'> {sData} {cData}  </div>";
    tmpl += "</div>";
    // send the parent row primary key to the server so that we know which grid to show
    var grid = $("#grid");
    var rowKey = grid.getGridParam("selrow");
    var rowData = grid.getRowData(rowKey);
    var proveedor = rowData.idproveedor;   
    var cui =  rowData.idcui;
    var childGridURL = "/facturasdetalle/" + cui + "/" + proveedor;
    $("#grid").jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        colModel: [
            {
                label: 'id',
                name: 'id',
                width: 50,
                hidden: true,
                key: true
            },
            {
                label: 'iddetallecompromiso',
                name: 'iddetallecompromiso',
                width: 50,
                hidden: true,
                editable: true
            },
            {
                label: 'Periodo',
                name: 'periodo',
                width: 70,
                align: 'left',
                search: false,
                editable: true,
                hidden: false,
                editoptions: { size: 5, readonly: 'readonly' }
            },
            {
                label: 'CUI',
                name: 'cui',
                width: 50,
                align: 'left',
                search: false,
                editable: true,
                hidden: false,
                editoptions: { size: 5, readonly: 'readonly' }
            },            
            {
                label: 'Proveedor',
                name: 'razonsocial',
                width: 220,
                align: 'left',
                search: false,
                editable: true,
                editoptions: { size: 5, readonly: 'readonly' }
            },
            {
                label: 'Servicio',
                name: 'nombre',
                width: 220,
                align: 'left',
                search: false,
                editable: true,
                editoptions: { size: 5, readonly: 'readonly' }
            },
            {
                label: 'Glosa Servicio',
                name: 'glosaservicio',
                width: 250,
                align: 'left',
                search: false,
                editable: true,
                hidden: true,
                edittype: "textarea",
                editoptions: { size: 5, readonly: 'readonly' }
            },
            {
                label: 'Monto a Pagar',
                name: 'montoneto',
                search: false,
                align: 'left',
                width: 120,
                editable: true,
                formatter: 'number', formatoptions: { decimalPlaces: 0 },
                editoptions: { size: 5, readonly: 'readonly' }
            },
            {
                label: 'Moneda',
                name: 'moneda',
                search: false,
                align: 'left',
                width: 100,
                editable: true,
                editoptions: { size: 5, readonly: 'readonly' }
            },            
            {
                label: 'Estado',
                name: 'aprobado',
                search: false,
                align: 'left',
                width: 80,
                editable: true,
                formatter: function (cellvalue, options, rowObject) {
                    var dato = '';
                    var val = rowObject.aprobado;
                    if (val == 0) {
                        dato = 'Pendiente';
                    } else if (val == 1) {
                        dato = 'Aprobado';
                    } else if (val == 2) {
                        dato = 'Rechazado';
                    }
                    return dato;
                },
                edittype: "select",
                editoptions: {
                    dataUrl: "/prefacturasolicitud/estadosolicitud",
                    buildSelect: function (response) {
                        var grid = $("#grid");
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.idproveedor;
                        console.log(response);
                        var data = JSON.parse(response);
                        console.log(data);
                        var s = "<select>";//el default
                        //s += '<option value="0">--Escoger Estado--</option>';
                        $.each(data, function (i, item) {
                            console.log("***proveedor:" + data[i].id + ", " + thissid);
                            if (data[i].id == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i]+ '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i] + '</option>';
                            }
                        });
                        console.log(s);
                        return s + "</select>";
                    },
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            var estado = $('option:selected', this).val()
                            console.log("Change");
                            var grid = $("#grid");
                            var rowKey = grid.getGridParam("selrow");
                            var rowData = grid.getRowData(rowKey);
                            var monto = rowData.montoneto;
                            console.log("monto:" + monto);
                            console.log("estado:" + estado);
                            if (estado == "1") {
                                $("input#montoaprobado").val(monto);
                            } else {
                                $("input#montoaprobado").val("0");
                            }
                        }
                    }],
                }, dataInit: function (elem) { $(elem).width(200); }

            },
            {
                label: 'Monto Aprobado',
                name: 'montoaprobado',
                width: 100,
                search: false,
                align: 'left',
                editable: true,
                formatter: 'number', formatoptions: { decimalPlaces: 0 }
            },
            {
                label: 'Glosa Aprobación',
                name: 'glosaaprobacion',
                width: 200,
                search: false,
                align: 'left',
                hidden: true,
                editable: true,
                edittype: "textarea"
            },         
            {
                label: 'Calificación',
                name: 'idcalificacion',
                width: 150,
                search: false,
                align: 'left',
                editable: true, hidden: true,
                edittype: "select",
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
            {
                label: 'Glosa Multa',
                name: 'glosamulta',
                width: 200,
                search: false,
                align: 'left',
                editable: true,
                hidden: true,
                edittype: "textarea"
            },
            {
                label: 'Monto Multa',
                name: 'montomulta',
                width: 100,
                search: false,
                align: 'left',
                editable: true,
                formatter: 'number', formatoptions: { decimalPlaces: 0 }
            },
            {
                label: 'Causal Multa',
                name: 'idcausalmulta',
                width: 100,
                search: false,
                align: 'left',
                editable: true, hidden: true, edittype: "select",
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
            {
                label: 'Calificación', name: 'calificacion', width: 120, align: 'left', sortable: false, search: false, editable: true,
                editrules: { edithidden: false }, hidedlg: true
            }            

        ],
        caption: "Solicitud de Aprobación",
        height: 'auto',
        styleUI: "Bootstrap",
        multiselect: true,
        sortable: "true",
        pager: "#pager",
        page: 1,
        shrinkToFit: false,
        rowNum: 10,
        rowList: [5, 10, 20, 50],
        sortname: 'id',
        sortorder: 'asc',
        viewrecords: true,
        editurl: '/prefacturasolicitud/action',
        regional: "es",
        subGrid: false
    });

    $("#grid").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#grid").jqGrid('navGrid', "#pager", {
        edit: true,
        add: false,
        del: false,
        search: false,
        refresh: true,
        cloneToTop: false
    },
        {
            editCaption: "Modifica Solicitud Aprobación",
            closeAfterEdit: true,
            recreateForm: true,
            top: 10,
            left: 10,
            width: 850,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                var monto = new Number(postdata.montoaprobado);
                console.log("num:" + monto);
                if (monto < 0) {
                    return [false, "Monto: El monto no puede ser menor a cero", ""];
                } else if (postdata.aprobado == 0) {
                    return [false, "Estado: El estado deber ser Aprobado o Rechazado", ""];
                } else {
                    return [true, "", ""]
                }

            }
        }, {}

    );

}

