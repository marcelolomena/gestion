
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
            editable: false
        },
        {
            label: 'Producto',
            name: 'idProducto',
            //jsonmap: 'invetario',
            width: 300,
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
            label: 'Fecha Inicio',
            name: 'fechaInicio',
            width: 200,
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
            width: 200,
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
            width: 200,
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
            label: 'Monto',
            name: 'monto',
            hidden: true,
            hidden: false,
            editable: true
        },
        {
            label: 'Moneda',
            name: 'idMoneda',
            jsonmap: 'moneda.nombre',
            width: 70,
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
            label: 'Nombre',
            name: 'nombre',
            hidden: true,
            hidden: false,
            editable: true
        },
        {
            label: 'Número', 
            name: 'numero',
            hidden: true,
            hidden: false,
            editable: true
        },
        {
            label: 'Comentario',
            name: 'comentario',
            hidden: true,
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




