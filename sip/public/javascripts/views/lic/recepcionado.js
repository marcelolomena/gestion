function renderGrid(loadurl, tableId) {
    var $table = $('#' + tableId);

    var viewModel = [{
            label: 'ID',
            name: 'id',
            key: true,
            hidden: true,
            editable: true
        },
        {
            label: 'Producto',
            name: 'idProducto',
            jsonmap: 'producto',
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
                }
            },
            editrules: {
                required: false
            },
            search: false
        },
        {
            label: 'Fabricante',
            name: 'idFabricante',
            // jsonmap: 'fabricante',
            width: 180,
            align: 'center',
            sortable: true,
            hidden: true,
            editable: false,
            editrules: {
                required: false
            },
            search: false,
        },
        {
            label: 'Fecha Inicio',
            name: 'fechaInicio',
            width: 100,
            align: 'center',
            sortable: true,
            editable: true,
            editoptions: {
                'data-provide': 'datepicker',
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
        }, {
            label: 'Fecha Término',
            name: 'fechaTermino',
            width: 110,
            align: 'center',
            sortable: true,
            editable: true,
            editoptions: {
                'data-provide': 'datepicker',
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
        }, {
            label: 'Fecha Control',
            name: 'fechaControl',
            width: 100,
            align: 'center',
            sortable: true,
            editable: true,
            editoptions: {
                'data-provide': 'datepicker',
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
        }, {
            label: 'Cantidad',
            name: 'cantidad',
            hidden: false,
            editable: true,
            search: false
        }, {
            label: 'Moneda',
            name: 'idMoneda',
            // jsonmap: 'moneda.nombre',
            width: 100,
            align: 'center',
            editable: true,
            search: false
        }, {
            label: 'Monto',
            name: 'monto',
            width: 80,
            align: 'center',
            sortable: true,
            hidden: false,
            editable: true,
            editoptions: {
                defaultValue: '0'
            },
            editrules: {
                number: true
            },
            search: false
        }, {
            label: 'Comentario',
            name: 'comentario',
            hidden: true,
            editable: true,
            edittype: 'textarea',
            editoptions: {
                fullRow: true
            }
        }

    ];
    var grid = new zs.SimpleGrid(tableId, 'p_' + tableId, 'Detalle Recepcionado', 'Editar Recepcionado', 'Agregar Recepcionado', loadurl, viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
    grid.navParameters.add = false;
    grid.navParameters.edit = false;
    grid.navParameters.del = false;
    grid.build();
}

var recepcionadoGrid = {
    renderGrid: renderGrid
};