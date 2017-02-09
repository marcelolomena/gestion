$(document).ready(function () {
    var cuiusr = [];

    $.ajax({
        url: "/cuiuser",
        dataType: 'json',
        async: false,
        success: function (j) {
            if (j.length > 0) {
                var nivel0 = j[0].nivel;
                $.each(j, function (i, item) {
                    console.log("nivel:" + item.nivel + "," + nivel0);
                    if (item.nivel == nivel0) {
                        cuiusr.push(item.cui);
                    }
                    console.log('***user cui:' + cuiusr);
                });
            } else {
                cuiusr.push("0");
            }
            console.log('** cui final:' + cuiusr);
        }
    });

    $('#cui').append('<option value="0"> - Escoger CUI - </option>');
    for (var i = 0; i < cuiusr.length; i++) {
        $.getJSON("/cuisprefactura/" + cuiusr[i] + "/" + getPeriodo(), function (j) {

            $.each(j, function (i, item) {
                console.log("cui:" + item.nombre + "," + item.cui);
                $('#cui').append('<option value="' + item.id + '">' + item.cui + "-" + item.nombre.substring(0, 35) + '</option>');
            });
        });
    }

    $('#periodo').val(getPeriodo());
    //$('#periodo').val("201702");

    $("#cui").change(function () {
        scui = $(this).val();
        $.getJSON("/prefactura/proveedores/" + scui + "/" + getPeriodo(), function (j) {
            $('#proveedor option').remove();
            $('#proveedor').append('<option value="0"> - Escoger Proveedor - </option>');
            $.each(j, function (i, item) {
                $('#proveedor').append('<option value="' + item.idproveedor + '">' + item.razonsocial.substring(0, 35) + '</option>');
            });
        });
    });

    $("#buscar").click(function () {
        var idcui = $('#cui').val();
        var periodo = $('#periodo').val();
        var proveedor = $('#proveedor').val();
        loadGrid(idcui, periodo, proveedor);
    });


});

function getPeriodo() {
    var d = new Date();
    var anio = d.getFullYear();
    console.log("anio:" + anio);
    var mes = parseInt(d.getMonth()) + 1;
    console.log("mes:" + mes);
    var mesok = mes < 10 ? '0' + mes : mes;
    console.log("mesok:" + mesok);
    return anio + '' + mesok;

}

function cancelId(id) {
    bootbox.confirm({
        title: "¿Anula solicitud de aprobación?",
        message: "¿Desea anular inmediatamente la solicitud de aprobación?. Posteriormente no puede ser revertido",
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> Cancelar'
            },
            confirm: {
                label: '<i class="fa fa-check"></i> Confirmar'
            }
        },
        callback: function (confirmed) {
            if (confirmed == true) {
                $.ajax({
                    url: '/solicitud/anular/' + id
                }).done(function () {
                    bootbox.alert("Solicitud anulada ...", function () { /* your callback code */ })
                    $("#grid").trigger("reloadGrid");
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    bootbox.alert("Error!!…", function () { /* your callback code */ })
                }).always(function () {
                    bootbox.alert("Anulando solicitud ...", function () { /* your callback code */ })
                });
            }
        }
    });
}

var cancelBtn = function (cellVal, options, rowObject) {
    return "<input style='height:22px;' type='button' value='Anular' onclick=\"return cancelId(" + rowObject.id + ")\"  />";
};

var leida = false;
function loadGrid(cui, periodo, proveedor) {
    var url = "/prefacturasolicitud/" + cui + "/" + periodo + "/" + proveedor;
    var formatter = new Intl.NumberFormat();
    if (leida) {
        $("#grid").setGridParam({ postData: { page: 1, rows: 10 } });
        $("#grid").jqGrid('setCaption', "Facturas Proveedor por CUI").jqGrid('setGridParam', { url: url, page: 1 }).jqGrid("setGridParam", { datatype: "json" }).trigger("reloadGrid");
    } else {
        showDocumentos(cui, periodo, proveedor);
    }
}

function showDocumentos(cui, periodo, proveedor) {

    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full' style='display: none;'>Periodo {iddetallecompromiso}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Periodo {periodocompromiso}</div>";
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
    tmpl += "<div class='column-half'>Moneda Origen {moneda}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'><span style='color:red'>*</span>Estado Solicitud {aprobado}</div>";
    tmpl += "<div class='column-half'><span style='color:red'>*</span>Monto Neto Aprobado {montoaprobado}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-full'>Glosa Estado {glosaaprobacion}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>Glosa Abono {glosaabono}</div>";
    tmpl += "<div class='column-half'>Monto Neto Abono {montoabono}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>Causa Descuento {idcausalmulta}</div>";
    tmpl += "<div class='column-half'>Monto Neto Descuento {montomulta}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' >";
    tmpl += "<div class='column-half'>Glosa Descuento {glosamulta}</div>";
    tmpl += "<div class='column-half'>Calificación de Servicio {idcalificacion}</div>";
    tmpl += "</div>";

    tmpl += "<hr style='width:100%;'/>";
    tmpl += "<div align='left'> {sData} {cData}  </div>";
    tmpl += "</div>";
    // send the parent row primary key to the server so that we know which grid to show
    var childGridURL = "/prefacturasolicitud/" + cui + "/" + periodo + "/" + proveedor;
    var $grid = $("#grid");
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
                label: 'Anular',
                name: 'Anular',
                width: 60,
                align: 'center',
                search: false,
                formatter: cancelBtn
            },
            {
                label: 'Periodo',
                name: 'periodocompromiso',
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
                name: 'glosaservicio',
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
                align: 'right',
                width: 120,
                editable: true,
                formatter: 'number', formatoptions: { decimalPlaces: 2 },
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
                    } else if (val == 3) {
                        dato = 'Provisionado';
                    } else if (val == 4) {
                        dato = 'Factura ya emitida';
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
                                s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
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
                align: 'right',
                editable: true,
                formatter: 'number', formatoptions: { decimalPlaces: 2 }
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
                label: 'Monto Descuento',
                name: 'montomulta',
                width: 100,
                search: false,
                align: 'right',
                editable: true,
                formatter: 'number', formatoptions: { decimalPlaces: 2 }
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
                        s += '<option value="0">--Escoger Causal Descuento--</option>';
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
                label: 'Monto Abono',
                name: 'montoabono',
                width: 100,
                search: false,
                align: 'right',
                editable: true,
                formatter: 'number', formatoptions: { decimalPlaces: 2 }
            },
            {
                label: 'Glosa Abono',
                name: 'glosaabono',
                width: 200,
                search: false,
                align: 'left',
                editable: true,
                hidden: true,
                //edittype: "textarea"
            },
            {
                label: 'Monto Total',
                name: 'montoapagar',
                width: 100,
                search: false,
                align: 'right',
                editable: true,
                formatter: 'number', formatoptions: { decimalPlaces: 2 }
            },
            {
                label: 'Calificación', name: 'calificacion', width: 120, align: 'left', sortable: false, search: false, editable: true,
                editrules: { edithidden: false }, hidedlg: true
            }

        ],
        caption: "Solicitud de Aprobación",
        height: 'auto',
        styleUI: "Bootstrap",
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
        subGrid: false,
        loadComplete: function (data) {
            var thisId = $.jgrid.jqID(this.id);
            $.get('/sic/getsession', function (data) {
                $.each(data, function (i, item) {

                    if (item.glosarol === "Administrador DIVOT") {
                        $grid.jqGrid("showCol", "Anular")
                    }
                });
            });
        }
    });

    $("#grid").jqGrid("setLabel", "Anular", "", { "text-align": "center" });

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
                postdata.montoneto = postdata.montoneto.replace(",", ".");
                postdata.montoaprobado = postdata.montoaprobado.replace(",", ".");
                postdata.montomulta = postdata.montomulta.replace(",", ".");
                var monto = new Number(postdata.montoaprobado);
                var apagar = new Number(postdata.montoneto);
                var montomulta = new Number(postdata.montomulta);

                console.log("num:" + monto);
                if (monto < 0) {
                    return [false, "Monto: El monto no puede ser menor a cero", ""];
                }
                console.log("num2:" + monto);
                if (monto > apagar) {
                    return [false, "Monto: El monto aprobado no puede ser mayor al monto a pagar", ""];
                }
                console.log("num3:" + monto);
                if (postdata.aprobado == 0) {
                    return [false, "Estado: El estado deber ser Aprobado, Rechazado o Provisionado", ""];
                }
                console.log("num4:" + monto);
                if (postdata.idcalificacion == 0) {
                    return [false, "Calificación: Debe elegir una calificación", ""];
                }
                console.log("num5:" + monto);
                if (montomulta > monto) {
                    return [false, "Error: Monto descuento es mayor a monto aprobado", ""];
                }
                console.log("num6:" + monto);
                return [true, "", ""]


            }
        }, {}

    );

    leida = true;
}

