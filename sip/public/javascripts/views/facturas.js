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

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>Monto Neto {subtotal}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>Impuesto {impuesto}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
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
        { label: 'Fecha', name: 'fecha', width: 100, align: 'left', search: false, sortable: false, editable: true, 
            formatter: 'date',
            formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' },
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).mask("0000-00-00", { placeholder: "____-__-__" });
                    $(element).datepicker({ language: 'es', format: 'yyyy-mm-dd', autoclose: true })
                }
            }        
        },
        { label: 'Monto Neto', name: 'subtotal', width: 200, align: 'right', search: false, sortable: false, editable: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 } },
        {label: 'Impuesto', name: 'impuesto', width: 80, align: 'right', sortable: false, search: false, editable: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 } },      
        { label: 'Total', name: 'total', width: 200, align: 'right', search: false, sortable: false, editable: true,
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
                if (postdata.numero == "") {
                    return [false, "Ingrese número de factura", ""];
                } else if (postdata.idproveedor == "0") { 
                    return [false, "Ingrese proveedor", ""];
                } else if (postdata.fecha == "") { 
                    return [false, "Ingrese fecha", ""];
                } else if (postdata.subtotal == "") { 
                    return [false, "Ingrese subtotal", ""];
                } else if (postdata.impuesto == "") { 
                    return [false, "Ingrese impuesto", ""];
                } else if (postdata.total == "") { 
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
    tmpl += "<div class='column-full'><span style='color:red'>*</span>ID Facturación {idfacturacion}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Glosa Prefatura {glosaserviciopf}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>Monto Neto Prefactura {montonetopf}</div>";
    tmpl += "<div class='column-half'>Monto Pesos Prefactura {montopesospf}</div>";
    tmpl += "</div>";
    
    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>Cantidad Prefactura {cantidadpf}</div>";
    tmpl += "<div class='column-half'>Total Prefactura {totalpf}</div>";
    tmpl += "</div>";
    
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color:red'>*</span>Glosa Servicio {glosaservicio}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'><span style='color:red'>*</span>Monto Neto a Pagar {montoneto}</div>";
    tmpl += "<div class='column-half'><span style='color:red'>*</span>Monto Pesos {montopesos}</div>";
    tmpl += "</div>";
    
    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'><span style='color:red'>*</span>Cantidad {cantidad}</div>";
    tmpl += "<div class='column-half'><span style='color:red'>*</span>Total {total}</div>";
    tmpl += "</div>";    

    tmpl += "<hr style='width:100%;'/>";
    tmpl += "<div align='left'> {sData} {cData}  </div>";
    tmpl += "</div>";
    
    var childGridURL = "/facturasdetalle/"  + parentRowKey;
    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');
    
    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        colModel: [
            {//idfactura, idprefactura, idfacturacion, montoneto, montopesos, cantidad, total, borrado)
                label: 'id',
                name: 'id',
                width: 50,
                hidden: true,
                key: true
            },
            {
                label: 'ID Prefactura',
                name: 'idprefactura',
                width: 50,
                hidden: true,
                editable: true
            },
            {
                label: 'ID Facturación',
                name: 'idfacturacion',
                width: 150,
                align: 'left',
                search: false,
                editable: true,
                hidden: false,
                editoptions: {
                    size: 5,
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            var thissid = $(this).val();
                            $.ajax({
                                type: "GET",
                                url: '/getsolicitud/' + thissid,
                                async: false,
                                success: function (data) {
                                    if (data.length > 0){
                                        console.log("glosa:"+data[0].glosaservicio);
                                        $("textarea#glosaserviciopf").val(data[0].glosaservicio);
                                        $("input#montonetopf").val(data[0].montoneto);
                                        $("input#montopesospf").val(data[0].montoapagarpesos);
                                        $("input#cantidadpf").val(1);
                                        $("input#totalpf").val(data[0].montoapagarpesos);
                                        $("input#idprefactura").val(data[0].idprefactura);
                                        $("textarea#glosaservicio").val(data[0].glosaservicio);
                                        $("input#montoneto").val(data[0].montoneto);
                                        $("input#montopesos").val(data[0].montoapagarpesos);
                                        $("input#cantidad").val(1);
                                        $("input#total").val(data[0].montoapagarpesos);                                      
                                    } else {
                                        alert("No existe id en una prefactura");
                                    }
                                }
                            });
                            
                        }
                    }],                    
                }                
            },
            {
                label: 'Glosa Servicio',
                name: 'glosaserviciopf',
                width: 250,
                align: 'left',
                search: false,
                editable: true,
                hidden: true,
                edittype: "textarea",
                editoptions: { size: 5, readonly: 'readonly' }
            },            
            {
                label: 'Monto Neto',
                name: 'montonetopf',
                width: 100,
                align: 'left',
                search: false,
                editable: true,
                hidden: true,
                formatter: 'number',
                formatoptions: { decimalPlaces: 0 },
                editoptions: { size: 5 , readonly: 'readonly' }
            },            
            {
                label: 'Monto Pesos',
                name: 'montopesospf',
                width: 100,
                align: 'left',
                search: false,
                editable: true,
                hidden: true,
                formatter: 'number',
                formatoptions: { decimalPlaces: 0 },
                editoptions: { size: 5 , readonly: 'readonly' }
            },
            {
                label: 'Cantidad',
                name: 'cantidadpf',
                width: 50,
                align: 'left',
                search: false,
                hidden: true,
                formatter: 'number',
                editable: true,
                editoptions: { size: 5 , readonly: 'readonly' }
            },
            {
                label: 'Total',
                name: 'totalpf',
                width: 100,
                align: 'left',
                search: false,
                hidden: true,
                editable: true,
                formatter: 'number',
                formatoptions: { decimalPlaces: 0 },
                editoptions: { size: 5 , readonly: 'readonly' }
            },
            {
                label: 'Glosa Servicio',
                name: 'glosaservicio',
                width: 250,
                align: 'left',
                search: false,
                editable: true,
                hidden: false,
                edittype: "textarea",
                editoptions: { size: 5}
            },            
            {
                label: 'Monto Neto',
                name: 'montoneto',
                width: 100,
                align: 'left',
                search: false,
                editable: true,
                hidden: false,
                formatter: 'number',
                formatoptions: { decimalPlaces: 0 },
                editoptions: { size: 5 }
            },            
            {
                label: 'Monto Pesos',
                name: 'montopesos',
                width: 100,
                align: 'left',
                search: false,
                editable: true,
                formatter: 'number',
                formatoptions: { decimalPlaces: 0 },
                editoptions: { size: 5 }
            },
            {
                label: 'Cantidad',
                name: 'cantidad',
                width: 100,
                align: 'left',
                search: false,
                formatter: 'number',
                formatoptions: { decimalPlaces: 0 },
                editable: true,
                editoptions: { size: 5 }
            },
            {
                label: 'Total',
                name: 'total',
                width: 200,
                align: 'left',
                search: false,
                editable: true,
                formatter: 'number',
                formatoptions: { decimalPlaces: 0 },
                editoptions: { size: 5 }
            }                 

        ],
        height: 'auto',
        styleUI: "Bootstrap",
        sortable: "true",
        pager: "#" + childGridPagerID,
        page: 1,
        shrinkToFit: false,
        rowNum: 10,
        rowList: [5, 10, 20, 50],
        sortname: 'id',
        sortorder: 'asc',
        viewrecords: true,
        editurl: '/facturas/actionDetalle/' + parentRowKey,
        regional: "es",
        subGrid: true, // set the subGrid property to true to show expand buttons for each row
        subGridRowExpanded: showDesgloseContable, // javascript function that will take care of showing the child grid        
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }

    });

    $("#" + childGridID).jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: true,
        add: true,
        del: true,
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
            beforeShowForm: function (postdata, formid) {
                var grid = $("#" + childGridID);
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                $.ajax({
                    type: "GET",
                    url: '/getsolicitud/' + rowData.idfacturacion,
                    async: false,
                    success: function (data) {
                        if (data.length > 0){
                            console.log("glosa:"+data[0].glosaservicio);
                            $("textarea#glosaserviciopf").val(data[0].glosaservicio);
                            $("input#montonetopf").val(data[0].montoneto);
                            $("input#montopesospf").val(data[0].montoapagarpesos);
                            $("input#cantidadpf").val(1);
                            $("input#totalpf").val(data[0].montoapagarpesos);                                     
                        } else {
                            //nada
                        }
                    }                
                });
                
                //$("#glosaserviciopf").val(rowData.glosaservicio);
                //$("#montonetopf").val(rowData.montoneto);
                //$("#montopesospf").val(rowData.montopesos);
                //$("#cantidadpf").val(rowData.cantidad);
                //$("#totalpf").val(rowData.total);

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

            },
        },
        {
            addCaption: "Agrega Detalle Factura",
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                //alert("postdata:"+postdata.idproveedor);
                var num = new Number(postdata.cuota);
                console.log("num:"+num);
                if (postdata.glosaservicio == "") {
                    return [false, "Glosa: Debe ingresar una glosa de servicio", ""];
                } if (postdata.montoneto == "") {
                    return [false, "Debe ingresar monto neto", ""];
                } if (postdata.montopesos == "") {
                    return [false, "Debe ingresar monto pesos", ""];
                } if (postdata.cantidad == "") {
                    return [false, "Debe ingresar cantidad", ""];
                } if (postdata.total == "") {
                    return [false, "Debe ingresar total", ""];
                } else {
                    return [true, "", ""]
                }
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code == 10)
                     return [false, "Error, no se pudo ingresar detalle, ", ""];                
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }            
        }, {}

    );
}

function showDesgloseContable(parentRowID, parentRowKey) {
    console.log("en desglose");
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    var childGridURL = "/getdesglosecontable/"  + parentRowKey;
    
    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');
    
    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        colModel: [
            {//id, iddetallefactura, idcui, idcuentacontable, monto, porcentaje, borrado
                label: 'id',
                name: 'id',
                width: 50,
                hidden: true,
                key: true
            },
            {
                label: 'ID Prefactura',
                name: 'iddetallefactura',
                width: 50,
                hidden: true,
                editable: true
            },
            {
                label: 'idcui',
                name: 'idcui',
                width: 150,
                align: 'left',
                search: false,
                editable: false,
                hidden: true,
            },
            {
                label: 'CUI',
                name: 'cui',
                width: 50,
                align: 'left',
                search: false,
                editable: false,
                hidden: false,
            },            
            {
                label: 'idcuenta',
                name: 'idcuentacontable',
                width: 250,
                align: 'left',
                search: false,
                editable: true,
                hidden: true
            },      
            {
                label: 'Cuenta',
                name: 'cuentacontable',
                width: 100,
                align: 'left',
                search: false,
                editable: true,
                hidden: false
            },    
            {
                label: 'Nombre Cuenta',
                name: 'nombrecuenta',
                width: 250,
                align: 'left',
                search: false,
                editable: true,
                hidden: false
            },                               
            {
                label: 'Monto',
                name: 'monto',
                width: 100,
                align: 'left',
                search: false,
                editable: true,
                hidden: false,
                formatter: 'number',
                formatoptions: { decimalPlaces: 0 }                
            },   
            {
                label: 'Costo',
                name: 'costo',
                width: 100,
                align: 'left',
                search: false,
                editable: true,
                hidden: false,
                formatter: 'number',
                formatoptions: { decimalPlaces: 0 }                
            },                        
            {
                label: 'Porcentaje',
                name: 'porcentaje',
                width: 100,
                align: 'left',
                search: false,
                editable: true,
                hidden: false
            }
        ],
        height: 'auto',
        styleUI: "Bootstrap",
        sortable: "true",
        pager: "#" + childGridPagerID,
        page: 1,
        shrinkToFit: false,
        rowNum: 10,
        rowList: [5, 10, 20, 50],
        sortname: 'id',
        sortorder: 'asc',
        viewrecords: true,
        editurl: '/facturas/actionDetalle/' + parentRowKey,
        regional: "es",
        subGrid: false

    });

    $("#" + childGridID).jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false,
        add: false,
        del: false,
        search: false,
        refresh: true
    },
     {}

    );
}

