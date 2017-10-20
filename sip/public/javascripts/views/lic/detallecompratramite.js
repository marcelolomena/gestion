function renderGrid(loadurl, tableId) {
    var $table = $('#' + tableId);

    function showChildGrid(divid, rowid) {
        var url = '/lic/recepcionado/' + rowid;
        var gridID = divid + '_t';
        var pagerID = 'p_' + gridID;
        $('#' + divid).append('<table id=' + gridID + '></table><div id=' + pagerID + ' class=scroll></div>');
        recepcionadoGrid.renderGrid(url, gridID);
    }

    var viewModel = [{
            label: 'ID',
            name: 'id',
            key: true,
            hidden: true,
            editable: false
        }, {
            label: 'idCompraTramite',
            name: 'idcompratramite',
            hidden: true,
            editable: false,
            search: false
        },
        {
            label: 'Fabricante',
            name: 'idFabricante',
            jsonmap: 'fabricante.nombre',
            width: 180,
            align: 'center',
            sortable: false,
            editable: true,
            edittype: 'select',
            editoptions: {
                dataUrl: '/lic/fabricantes',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.fabricante;
                    var data = JSON.parse(response);
                    return new zs.SelectTemplate(data, 'Seleccione Fabricante', thissid).template;
                },
                dataEvents: [{
                    type: 'change',
                    fn: function (e) {
                        var rowKey = $table.getGridParam("selrow");
                        var rowData = $table.getRowData(rowKey);
                        var thissid = $(this).val();
                        $("input#idProducto").val($('option:selected', this).text());
                        var idProducto = $('option:selected', this).val();
                        if (idProducto) {
                            var s = "<select>";
                            s += '<option value="0">--Seleccionar Producto--</option>'
                            $.ajax({
                                type: "GET",
                                url: '/lic/getProducto/' + thissid,
                                async: false,
                                success: function (data) {
                                    if (data) {
                                        $.each(data, function (i, item) {
                                            if (data[i].idFabricante == thissid) {
                                                s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                                            } else {
                                                s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                                            }
                                        });
                                        s += '</select>';
                                        $('select#idProducto').empty().html(s);
                                        // $("#idProducto").attr('disabled', true);
                                        // $("#otroProducto").attr('disabled', true);
                                    } else {
                                        alert("No existe Fabricante para este Producto");
                                        $("select#idProducto").val("");
                                    }
                                }
                            });
                        } else {
                            $("#idProducto").attr('disabled', false);
                            $("#otroProducto").attr('disabled', false);

                        }
                    }
                }],
            },
            editrules: {
                required: false
            },
            search: false
        },
        {
            label: 'Otro Fabricante',
            name: 'otroFabricante',
            width: 250,
            hidden: true,
            editable: true,
            search: false
        },
        {
            label: 'Producto',
            name: 'idProducto',
            jsonmap: 'producto.nombre',
            width: 250,
            align: 'center',
            sortable: false,
            editable: true,
            edittype: 'select',
            editoptions: {
                dataUrl: '/lic/producto',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.nombre;
                    var data = JSON.parse(response);
                    return new zs.SelectTemplate(data, 'Seleccione el Producto', thissid).template;
                },
                dataEvents: [{
                    type: 'change',
                    fn: function (e) {
                        var rowKey = $table.getGridParam("selrow");
                        var rowData = $table.getRowData(rowKey);
                        var thissid = $(this).val();
                        $("input#idFabricante").val($('option:selected', this).text());
                        var idFabricante = $('option:selected', this).val();
                        if (idFabricante) {

                            $.ajax({
                                type: "GET",
                                url: '/lic/getFabricante/' + thissid,
                                async: false,
                                success: function (data) {
                                    if (data) {
                                        $("select#idFabricante").val(data.idFabric);
                                        $("#idFabricante").attr('disabled', true);
                                        $("#otroFabricante").attr('disabled', true);
                                    } else {
                                        alert("No existe Fabricante para este Producto");
                                        $("select#idFabricante").val("");
                                    }
                                }

                            });
                        } else {
                            $("#idFabricante").attr('disabled', false);
                            $("#otroFabricante").attr('disabled', false);

                        }
                    }
                }],
            },
            editrules: {
                required: false
            },
            search: false
        },
        {
            label: 'Otro Producto',
            name: 'otroProducto',
            width: 250,
            hidden: true,
            editable: true,
            search: false
        },
        {
            label: 'Fecha Inicio',
            name: 'fechaInicio',
            width: 100,
            align: 'center',
            sortable: false,
            editable: true,
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
                }
            },
            editrules: {
                required: true
            },
            search: false
        },
        {
            label: 'Fecha Termino',
            name: 'fechaTermino',
            width: 110,
            align: 'center',
            sortable: false,
            editable: true,
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
        },
        {
            label: 'Fecha Control',
            name: 'fechaControl',
            width: 100,
            align: 'center',
            sortable: false,
            editable: true,
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
                }
            },
            editrules: {
                required: true
            },
            search: false
        },
        {
            label: 'Número Licencias',
            name: 'numero',
            width: 80,
            align: 'center',
            hidden: false,
            editrules: {
                required: true,
                integer: true
            },
            editable: true,
            search: false
        },
        {
            label: 'Moneda',
            name: 'idMoneda',
            jsonmap: 'moneda.nombre',
            width: 100,
            align: 'center',
            sortable: false,
            editable: true,
            edittype: 'select',
            editoptions: {
                dataUrl: '/lic/moneda',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.moneda;
                    var data = JSON.parse(response);
                    return new zs.SelectTemplate(data, 'Seleccione Moneda', thissid).template;
                }
            },
            editrules: {
                required: true
            },
            search: false
        },
        {
            label: 'Monto',
            name: 'monto',
            width: 80,
            align: 'center',
            hidden: false,
            editrules: {
                number: true
            },
            editoptions: {
                defaultValue: '0'
            },
            editable: true,
            search: false
        },
        {
            label: 'Comentario',
            name: 'comentario',
            width: 400,
            hidden: false,
            editable: true,
            edittype: 'textarea',
            editoptions: {
                fullRow: true
            },
            search: false
        },
        {
            label: 'Estado',
            name: 'estado',
            width: 90,
            align: 'center',
            editable: true,
            edittype: "custom",
            editoptions: {
                custom_value: sipLibrary.getRadioElementValue,
                custom_element: sipLibrary.radioElemCompraTramite,
                defaultValue: "En Trámite",
            },
            formatter: function (cellvalue, options, rowObject) {
                var dato = '';
                var val = rowObject.estado;
                if (val == 1) {
                    dato = 'En Trámite';

                } else if (val == 0) {
                    dato = 'Recepcionado';
                }
                return dato;
            },
            search: false
        }
    ];
    var grid = new zs.StackGrid(tableId, 'p_' + tableId, 'Detalle de Compra en Trámite', 'Editar Detalle', 'Agregar Detalle', loadurl, viewModel, 'id', '/lic/getsession', ['Administrador LIC'], showChildGrid);

    function beforeSubmit(postdata, formid) {
        if (!(postdata.idFabricante || postdata.otroFabricante)) {
            return [false, 'Debe seleccionar Fabricante o ingresar Otro Fabricante', ''];
        }
        if (!(postdata.idProducto || postdata.otroProducto)) {
            return [false, 'Debe seleccionar Producto o ingresar Otro Producto', ''];
        }
        var f1 = postdata.fechaInicio;
        var f2 = postdata.fechaTermino;
        var f3 = postdata.fechaControl;
        var f1compare = f1.substring(6) + f1.substring(3, 4) + f1.substring(0, 1);
        var f2compare = f2.substring(6) + f2.substring(3, 4) + f2.substring(0, 1);
        var f3compare = f3.substring(6) + f3.substring(3, 4) + f3.substring(0, 1);
        if (f1compare > f2compare) {
            return [false, 'La fecha de Termino debe ser mayor a la fecha de Inicio'];
        } else if (f2compare < f3compare) {
            return [false, 'La fecha de Control debe ser menor a la fecha de Termino']
        } else if (f3compare < f1compare) {
            return [false, 'La fecha de Control debe ser mayor a la fecha de Inicio']
        } else {
            return [true, '', ''];
        }
    }
    grid.prmAdd.beforeSubmit = beforeSubmit;
    grid.prmEdit.beforeSubmit = beforeSubmit;
    grid.build();
}

var detalleCompraTramiteGrid = {
    renderGrid: renderGrid
};