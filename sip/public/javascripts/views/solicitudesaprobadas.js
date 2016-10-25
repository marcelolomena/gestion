$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var template = "<div id='responsive-form' class='clearfix'>";

    var modelSolicitudes = [
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
                label: 'Moneda',
                name: 'glosamoneda',
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


    ], $grid = $("#grid");

    $grid.jqGrid({
        url: '/solicitudesaprobadas',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelSolicitudes,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        caption: 'Solicitudes Aprobadas',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        loadError: sipLibrary.jqGrid_loadErrorHandler
    }).jqGrid('filterToolbar', {
        stringResult: true,
        searchOnEnter: true,
        defaultSearch: "cn",
        searchOperators: true,
        beforeSearch: function () { },
        afterSearch: function () { }
    });

    $grid.jqGrid('navGrid', '#pager', { edit: false, add: false, del: false, search: false }, {}, {}, {}, {});
    $grid.jqGrid('navButtonAdd', '#pager', {
        caption: "",
        buttonicon: "glyphicon glyphicon glyphicon-send",
        title: "Generar Prefacturas",
        position: "last",
        onClickButton: function () {
            bootbox.confirm("¿Esta seguro que desea generar las prefacturas para el periodo actual?", function (confirmed) {
                if (confirmed == true) {
                    $.ajax({
                        url: '/generarprefacturas'
                    }).done(function () {
                        bootbox.alert("Se han generado las prefacturas del periodo", function () { /* your callback code */ })
                        $grid.trigger("reloadGrid");
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        bootbox.alert("Error!!…", function () { /* your callback code */ })
                    }).always(function () {
                        bootbox.alert("Ha comenzado la generación", function () { /* your callback code */ })
                    });
                }
            });
        }
    });

});