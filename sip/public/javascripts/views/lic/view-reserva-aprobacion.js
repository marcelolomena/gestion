function renderGrid(loadurl, tableId) {
    var $table = $('#' + tableId);

    var viewModel = [{
        label: 'ID',
        name: 'id',
        key: true,
        hidden: true,
        editable: true
    }, {
        label: 'Estado',
        name: 'estado',
        align: 'center',
        width: 100,
        editable: false,
        search: false
    }, {
        label: 'Fecha de Aprobación',
        name: 'fechaAprobacion',
        width: 150,
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
    }, {
        label: 'Aprobador',
        name: 'idUsuarioJefe',
        jsonmap: 'userJefe',
        align: 'center',
        width: 100,
        editable: false,
        search: false
    }, {
        label: 'Comentario de Aprobación',
        name: 'comentarioAprobacion',
        width: 500,
        hidden: false,
        editable: false,
        edittype: 'textarea',
        editoptions: {
            fullRow: true
        },
        editrules: {
            required: true
        },
        search: false
    }, {
        label: 'Fecha de Autorización',
        name: 'fechaAutorizacion',
        width: 150,
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
    }, {
        label: 'Comentario de Autorización',
        name: 'comentarioAutorizacion',
        width: 500,
        hidden: false,
        editable: false,
        edittype: 'textarea',
        editoptions: {
            fullRow: true
        },
        editrules: {
            required: true
        },
        search: false
    }];
    var grid = new zs.SimpleGrid(tableId, 'p_' + tableId, 'Detalle Aprobación', 'Editar Aprobación', 'Agregar Aprobación', loadurl, viewModel, 'estado', '/lic/getsession', ['Administrador LIC']);
    grid.navParameters.add = false;
    grid.navParameters.edit = false;
    grid.navParameters.del = false;
    grid.build();
}

var viewreservaaprobacionGrid = {
    renderGrid: renderGrid
};