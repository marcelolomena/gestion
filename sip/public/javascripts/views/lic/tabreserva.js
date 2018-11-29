var tabReservaGrid = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var tabName = 'reserva';
        var tableName = tabName + '_t_' + parentRowKey;
        var table = targ + '_t_' + parentRowKey;
        var $grid = $(table);
        var viewModel = [{
            label: 'ID',
            name: 'id',
            key: true,
            hidden: true,
            editable: false
        }, {
            label: 'Id Producto',
            name: 'idProducto',
            hidden: true,
            editable: false
        }, {
            label: 'Estado',
            name: 'estado',
            align: 'center',
            width: 352,
            editable: false,
            search: false
        },
        {
            label: 'Cantidad',
            name: 'numlicencia',
            width: 352,
            editable: true,
            align: 'center',
            search: false
        },
        {
            label: 'Fecha de Solicitud',
            name: 'fechaSolicitud',
            width: 352,
            align: 'center',
            sortable: false,
            editable: false,
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
            label: 'Solicitante',
            name: 'idUsuario',
            jsonmap: 'solicitante.nombre',
            align: 'center',
            width: 352,
            editable: false,
            search: false
        },
        {
            label: 'Aprobador',
            name: 'idUsuarioJefe',
            jsonmap: 'aprobador.nombre',
            align: 'center',
            width: 352,
            editable: false,
            search: false
        }
    ];

        var tabGrid = new zs.SimpleGrid(tableName, 'navGrid' + tabName, 'Reserva', 'Editar Reserva', 'Agregar Reserva', loadurl, viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
        tabGrid.navParameters.edit = false;
        tabGrid.navParameters.add = false;
        tabGrid.navParameters.del = false;
        tabGrid.navParameters.view = false;

        tabGrid.build();
    }
};