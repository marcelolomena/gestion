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
        subGridRowExpanded: showPresupuestoServicios, // javascript function that will take care of showing the child grid        
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


function showPresupuestoServicios(parentRowID, parentRowKey, titulo) {
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    var childGridURL = "/presupuestoservicios/" + parentRowKey;
    var urlServicios = '/serviciospre/' + parentRowKey;
    var urlProveedores = '/proveedorespre/' + parentRowKey;
    var urlProveedoresServ = '/proveedorespreserv/' + parentRowKey;
    var urlFrecuencia = '/serviciosfrecuencia/';
    var urlPeriodo = '/serviciosperiodos/';
    var urlRecupera = '/tiporecupera/';

    var tmplServ = "<div id='responsive-form' class='clearfix'>";

    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-full'><span style='color:red'>*</span>Servicio {idservicio}</div>";
    tmplServ += "</div>";

    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-half'><span style='color:red'>*</span>Glosa Servicio {glosaservicio}</div>";
    tmplServ += "</div>";

    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-full'><span style='color:red'>*</span>Moneda {idmoneda}</div>";
    tmplServ += "</div>";

    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-full'><span style='color:red'>*</span>Proveedor {idproveedor}</div>";
    tmplServ += "</div>";

    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-half'>Comentario {comentario}</div>";
    tmplServ += "</div>";

    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-half'><span style='color:red'>*</span>Cuota {cuota}</div>";
    tmplServ += "</div>";    

    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-half'><span style='color:red'>*</span>Número Cuotas {numerocuota}</div>";
    tmplServ += "</div>";
    
    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-half'><span style='color:red'>*</span>Meses entre cuotas {mesesentrecuotas}</div>";
    tmplServ += "</div>";

    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-half'><span style='color:red'>*</span>Mes Primera Cuota {desde}</div>";
    tmplServ += "</div>";
   
    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-half'><span style='color:red'>*</span>Mes Inicio Servicio {desdediferido}</div>";
    tmplServ += "</div>";        
                           
    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-half'>Tipo Recuperación {ivarecuperable}</div>";
    tmplServ += "</div>";
    
    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-half'>Mas IVA {masiva}</div>";
    tmplServ += "</div>";

    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-half'>Gasto Diferido {gastodiferido}</div>";
    tmplServ += "</div>";    
                                                     
    tmplServ += "<hr style='width:100%;'/>";
    tmplServ += "<div> {sData} {cData}  </div>";
    tmplServ += "</div>";

    var modelPresupuestoServ = [
        {
            label: 'id', name: 'id', width: 50, key: true, hidden: true
        },
        {
            label: 'Servicio', name: 'nombre', search: true, width: 290,
            editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Servicio', name: 'idservicio', search: false, width: 200,
            editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: urlServicios,
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idservicio;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Servicio--</option>';
                    $.each(data, function (i, item) {
                        console.log("***data:" + data[i].id + ", " + thissid);
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        var servicio = $('option:selected', this).val()
                        if (servicio != "0") {
                            $.ajax({
                                type: "GET",
                                url: urlProveedoresServ + '/' + servicio,
                                async: false,
                                success: function (data) {
                                    var s = "<select>";//el default
                                    s += '<option value="0" selected>--Escoger Proveedor--</option>';
                                    $.each(data, function (i, item) {
                                        s += '<option value="' + data[i].id + '">' + data[i].nombreproveedor + '</option>';
                                    });
                                    s += "</select>";
                                    $("select#idproveedor").html(s);
                                }
                            });
                        }
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }

        },
        {
            label: 'Glosa Servicio', name: 'glosaservicio', width: 300,
            search: true, editable: true, edittype: "textarea"
        },
        {
            label: 'Proveedor', name: 'razonsocial', width: 250, align: 'right',
            search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Proveedor', name: 'idproveedor', width: 100, align: 'right',
            search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: urlProveedores,
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idproveedor;
                    console.log(response);
                    var data = JSON.parse(response);
                    console.log(data);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Proveedor--</option>';
                    $.each(data, function (i, item) {
                        console.log("***proveedor:" + data[i].id + ", " + thissid);
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombreproveedor + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombreproveedor + '</option>';
                        }
                    });
                    console.log(s);
                    return s + "</select>";
                }
            }, dataInit: function (elem) { $(elem).width(200); }
        },        
        {
            label: 'Moneda', name: 'moneda', width: 100, align: 'right',
            search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Moneda', name: 'idmoneda', width: 100, align: 'right',
            search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/monedas',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idmoneda;
                    console.log(response);
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Moneda--</option>';
                    $.each(data, function (i, item) {
                        console.log("***monedas:" + data[i].id + ", " + thissid);
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].moneda + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].moneda + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }, dataInit: function (elem) { $(elem).width(200); }

        },
        {
            label: 'Comentario', name: 'comentario',
            search: false, editable: true, edittype: "textarea", hidden: true,
        },
        {
            label: 'Forecast',
            name: 'montoforecast',
            width: 130,
            align: 'right',
            search: false,
            editable: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Ppto. Solicitado',
            name: 'montoanual',
            width: 130,
            align: 'right',
            search: false,
            editable: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Costo Forecast',
            name: 'costoforecast',
            width: 130,
            align: 'right',
            search: false,
            editable: true,
            hidden: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Costo Anual',
            name: 'costoanual',
            width: 130,
            align: 'right',
            search: false,
            editable: true,
            hidden: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },        
        {
            label: 'Cuota', name: 'cuota', search: false, editable: true, hidden: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },        
        {
            label: '# Cuotas', name: 'numerocuota', search: false, editable: true, hidden: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },   
        {
            label: 'Meses entre cuotas', name: 'mesesentrecuotas', search: false, editable: true, hidden: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },      
        {
            label: 'Mes Primera Cuota', name: 'desde', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: urlPeriodo,
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.desde;
                    console.log(response);
                    var data = JSON.parse(response);
                    console.log(data);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Periodo--</option>';
                    $.each(data, function (i, item) {
                        console.log("***desde:" + data[i].id + ", " + thissid);
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    //console.log(s);
                    return s + "</select>";
                }
            }, dataInit: function (elem) { $(elem).width(200); }            
        },
        {
            label: 'Mes Inicio Servicio', name: 'desdediferido', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: urlPeriodo,
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.desdediferido;
                    console.log(response);
                    var data = JSON.parse(response);
                    console.log(data);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Periodo--</option>';
                    $.each(data, function (i, item) {
                        console.log("***proveedor:" + data[i].id + ", " + thissid);
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    //console.log(s);
                    return s + "</select>";
                }
            }, dataInit: function (elem) { $(elem).width(200); }            
        },         
        {
            label: 'Tipo Recuperación', name: 'ivarecuperable', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: urlRecupera,
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.ivarecuperable;
                    console.log(response);
                    var data = JSON.parse(response);
                    console.log(data);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Recuperación--</option>';
                    $.each(data, function (i, item) {
                        console.log("***tipoRecupera:" + data[i].id + ", " + thissid);
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    //console.log(s);
                    return s + "</select>";
                }
            }, dataInit: function (elem) { $(elem).width(200); }            
        },
        {
            label: 'Mas IVA', name: 'masiva', search: false, editable: true, hidden: true,
            edittype: "checkbox", editoptions: {value: "1:0", defaultValue: "1"}
        },          
        {
            label: 'Gasto Diferido', name: 'gastodiferido', search: false, editable: true, hidden: true,
            edittype: "checkbox", editoptions: {value: "1:0", defaultValue: "1"}
        },                 
          
    ];

    // add a table and pager HTML elements to the parent grid row - we will render the child grid here
    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelPresupuestoServ,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        width: null,
        shrinkToFit: false,
        rowNum: 10,
        rowList: [5, 10, 20, 50],
        editurl: '/presupuestoservicios/action/' + parentRowKey,
        subGrid: true, // set the subGrid property to true to show expand buttons for each row
        subGridRowExpanded: showPresupuestoPeriodos, // javascript function that will take care of showing the child grid                
        pager: "#" + childGridPagerID
    });

    $("#" + childGridID).jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: true,
        add: true,
        del: true,
        refresh: true,
        search: false
    },
        {
            editCaption: "Modifica Servicio",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmplServ,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                var num = new Number(postdata.cuota);
                console.log("num:"+num);
              
                if (postdata.idservicio == 0) {
                    return [false, "Servicio: Debe escoger un servicio", ""];
                } if (postdata.glosaservicio == "") {
                    return [false, "Glosa: Debe ingresar una glosa de servicio", ""];
                } if (postdata.idmoneda == 0) {
                    return [false, "Moneda: Debe escoger una moneda", ""];
                } if (postdata.idproveedor == 0) {
                    return [false, "Proveedor: Debe escoger un proveedor", ""];
                } if (isNaN(num) || postdata.cuota <= 0) {
                    return [false, "Cuota: Debe ingresar la cuota con valor mayor a cero", ""];
                } if (postdata.numerocuota <= 0) {
                    return [false, "Num. Cuotas: Debe ingresar el número de cuotas mayor a 0", ""];
                } if (postdata.mesesentrecuotas <= 0) {
                    return [false, "Meses Entre: Debe ingresar meses entre cuotas mayor a 0", ""];
                } if (postdata.desde == 0) {
                    return [false, "Desde: Debe ingresar mes de inicio de cuotas", ""];
                } if (postdata.desdediferido == 0) {
                    return [false, "Desde: Debe ingresar mes de inicio de servicio", ""];                    
                } else {
                    return [true, "", ""]
                }

            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code == 10)
                     return [false, "Presupuesto Aprobado, no se puede modificar, ", ""];
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }
        },
        {
            addCaption: "Agrega Servicio",
            closeAfterAdd: true,
            recreateForm: true,
            //mtype: 'GET',
            //url: '/iniciativas/add',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmplServ,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                //alert("postdata:"+postdata.idproveedor);
                var num = new Number(postdata.cuota);
                console.log("num:"+num);
              
                if (postdata.idservicio == 0) {
                    return [false, "Servicio: Debe escoger un servicio", ""];
                } if (postdata.glosaservicio == "") {
                    return [false, "Glosa: Debe ingresar una glosa de servicio", ""];
                } if (postdata.idmoneda == 0) {
                    return [false, "Moneda: Debe escoger una moneda", ""];
                } if (postdata.idproveedor == 0) {
                    return [false, "Proveedor: Debe escoger un proveedor", ""];
                } if (isNaN(num) || postdata.cuota <= 0) {
                    return [false, "Cuota: Debe ingresar la cuota con valor mayor a cero", ""];
                } if (postdata.numerocuota <= 0) {
                    return [false, "Num. Cuotas: Debe ingresar el número de cuotas mayor a cero", ""];
                } if (postdata.mesesentrecuotas <= 0) {
                    return [false, "Meses Entre: Debe ingresar meses entre cuotas mayor a cero", ""];
                } if (postdata.desde == 0) {
                    return [false, "Desde: Debe ingresar mes de inicio de cuotas", ""];
                } if (postdata.desdediferido == 0) {
                    return [false, "Desde: Debe ingresar mes de inicio de servicio", ""];
                } else {
                    return [true, "", ""]
                }
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code == 10)
                     return [false, "Presupuesto Aprobado, no se puede modificar, ", ""];                
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Elimina Servicio",
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code == 10)
                     return [false, "Presupuesto Aprobado, no se puede modificar, ", ""];                
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }
        }, {}

    );

}

