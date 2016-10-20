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
                $('#cui').append('<option value="' + item.id + '">' + item.cui + "-" + item.nombre + '</option>');
            });
        });
    }

    $('#periodo').val(getPeriodo());

    $("#cui").change(function () {
        scui = $(this).val();
        $.getJSON("/prefactura/proveedores/" + scui + "/" + getPeriodo(), function (j) {
            $('#proveedor option').remove();
            $('#proveedor').append('<option value="0"> - Escoger Proveedor - </option>');
            $.each(j, function (i, item) {
                $('#proveedor').append('<option value="' + item.idproveedor + '">' + item.razonsocial + '</option>');
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
    tmpl += "<div class='column-full'>Monto Neto a Pagar {montoneto}</div>";
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
    var childGridURL = "/prefacturasolicitud/" + cui + "/" + periodo + "/" + proveedor;
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
                label: 'Proveedor',
                name: 'razonsocial',
                width: 200,
                align: 'left',
                search: false,
                editable: true,
                editoptions: { size: 5, readonly: 'readonly' }
            },
            {
                label: 'Servicio',
                name: 'nombre',
                width: 200,
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
                edittype: "textarea",
                editoptions: { size: 5, readonly: 'readonly' }
            },
            {
                label: 'Monto a Pagar',
                name: 'montoneto',
                search: false,
                align: 'left',
                width: 100,
                editable: true,
                formatter: 'number', formatoptions: { decimalPlaces: 0 },
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
                editable: true,
                edittype: "textarea"
            },
            {
                label: 'Calificación',
                name: 'idcalificacion',
                width: 100,
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

    leida = true;
}

