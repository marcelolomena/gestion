
function renderGrid(loadurl, tableId) {
    var $table = $('#' +tableId);

    var viewModel = [
        {
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
                }
            },
            editrules: {
                required: true
            },
            search: false
        },
        {
            label: 'Otro',
            name: 'nombre',
            hidden: false,
            editable: false,
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
            width: 100,
            hidden: false,
            editable: true,
            search: false
        },
        
        {
            label: 'Número', 
            name: 'numero',
            hidden: false,
            editable: true,
            search: false
        },
        {
            label: 'Comentario',
            name: 'comentario',
            width: 500,
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




