function renderGrid(loadurl, tableId) {
    var $table = $('#' + tableId);

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
                                            $("#nombre").attr('disabled', true);
                                        } else {
                                            alert("No existe Fabricante para este Producto");
                                            $("select#idFabricante").val("0");
                                        }
                                    }
    
                                });
                        }else { 
                            $("#idFabricante").attr('disabled', false);
                            $("#nombre").attr('disabled', false);

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
            name: 'nombre',
            width: 250,
            hidden: true,
            editable: true,
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
                }
            },
            editrules: {
                required: true
            },
            search: false
            // stype: 'select',
            // searchoptions: {
            //     dataUrl: '/lic/fabricantes',
            //     buildSelect: function (response) {
            //         var rowData = $table.getRowData($table.getGridParam('selrow'));
            //         var thissid = rowData.nombre;
            //         var data = JSON.parse(response);
            //         return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
            //     }
            // }
        },
        {
            label: 'Fecha Inicio',
            name: 'fechaInicio',
            width: 100,
            align: 'center',
            sortable: false,
            editable: true,
            editoptions: {
                size: 10,
                maxlengh: 10,
                dataInit: function (element) {
                    $(element).mask('00-00-0000', {
                        placeholder: 'DD-MM-YYYY'
                    });
                }
            },
            editrules: {
                required: true
            },
            search: false
        },
        {
            label: 'Fecha Término',
            name: 'fechaTermino',
            width: 110,
            align: 'center',
            sortable: false,
            editable: true,
            editoptions: {
                size: 10,
                maxlengh: 10,
                dataInit: function (element) {
                    $(element).mask('00-00-0000', {
                        placeholder: 'DD-MM-YYYY'
                    });
                }
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
                size: 10,
                maxlengh: 10,
                dataInit: function (element) {
                    $(element).mask('00-00-0000', {
                        placeholder: 'DD-MM-YYYY'
                    });
                }
            },
            editrules: {
                required: true
            },
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
            label: 'Comentario',
            name: 'comentario',
            width: 400,
            hidden: false,
            editable: true,
            edittype: 'textarea',
            search: false
        },
    ];
    var grid = new zs.SimpleGrid(tableId, 'p_' + tableId, 'Detalle de Compra en Trámite', 'Editar Detalle', 'Agregar Detalle', loadurl, viewModel, 'id', '/lic/getsession', ['Administrador LIC']);

    grid.build();
}

var detalleCompraTramiteGrid = {
    renderGrid: renderGrid
};