var tabdetalleCompraTramiteGrid = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var tabName = 'tramite';
        var tableName = tabName + '_t_' + parentRowKey;
        var table = targ + '_t_' + parentRowKey;
        var $table = $(table);

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
            label: 'Cantidad',
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
        
        // {
        //     label: 'Moneda',
        //     name: 'idMoneda',
        //     jsonmap: 'moneda.moneda',
        //     width: 100,
        //     align: 'center',
        //     sortable: false,
        //     editable: true,
        //     edittype: 'select',
        //     editoptions: {
        //         dataUrl: '/lic/moneda',
        //         buildSelect: function (response) {
        //             var rowData = $table.getRowData($table.getGridParam('selrow'));
        //             var thissid = rowData.moneda;
        //             var data = JSON.parse(response);
        //             return new zs.SelectTemplate(data, 'Seleccione Moneda', thissid).template;
        //         }
        //     },
        //     editrules: {
        //         required: true
        //     },
        //     search: false
        // },
        
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
        
    ];

        var tabGrid = new zs.SimpleGrid(tableName, 'navGrid' + tabName, 'Detalle Compra Trámite', 'Editar Compra en Trámite', 'Agregar Compra en Trámite', loadurl, viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
        tabGrid.navParameters.edit = false;
        tabGrid.navParameters.add = false;
        tabGrid.navParameters.del = false;
        tabGrid.navParameters.view = false;

        tabGrid.build();
    }
};