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
            width: 300,
            editable: false,
            search: false
        },
        {
            label: 'Cantidad',
            name: 'numlicencia',
            width: 300,
            editable: true,
            align: 'center',
            search: false
        },
        {
            label: 'Fecha de Solicitud',
            name: 'fechaSolicitud',
            width: 300,
            align: 'center',
            search: false,
            formatter: 'date',
            formatoptions: {
                srcformat: 'ISO8601Long',
                newformat: 'd-m-Y'
            },
            editable: true,
            editrules: {
                required: true
            },
            searchoptions: {
                dataInit: function (el) {
                    $(el).datepicker({
                        language: 'es',
                        format: 'dd-mm-yyyy',
                        autoclose: true,
                        onSelect: function (dateText, inst) {
                            setTimeout(function () {
                                $gridTab[0].triggerToolbar();
                            }, 100);
                        }
                    });
                },
                sopt: ["eq", "le", "ge"]
            },
            editoptions: {
                size: 10,
                maxlengh: 10,
                dataInit: function (element) {
                    $(element).mask("00-00-0000", {
                        placeholder: "__-__-____"
                    });
                    $(element).datepicker({
                        language: 'es',
                        format: 'dd-mm-yyyy',
                        autoclose: true
                    })
                }
            },
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