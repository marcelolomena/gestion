(function ($, _) {
    'use strict';
    var zs = window.zs;

    $(function () {
        var $table = $('#gridMaster');
        var viewModel = [{
                label: 'ID',
                name: 'id',
                key: true,
                hidden: true,
                editable: false,
                search: false
            },
            {
                label: 'Tipo de Instalación',
                name: 'tipoinstalacion',
                width: 90,
                align: 'center',
                editable: true,
                edittype: "custom",
                editoptions: {
                    fullRow: true,
                    custom_value: sipLibrary.getRadioElementValue,
                    custom_element: sipLibrary.radioElemInstalacion
                },
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
                    dataUrl: '/lic/getProductoCompra',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.nombre;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione el Producto', thissid).template;
                    },
                },
                editrules: {
                    required: true
                },
                search: false
            },
            {
                label: 'Código de Autorización',
                name: 'codautorizacion',
                align: 'center',
                width: 100,
                editable: true,
                editrules: {
                    required: true
                },
                search: false
            },
            {
                label: '¿Quien soy Yo?',
                name: 'informacion',
                width: 400,
                hidden: false,
                editable: true,
                edittype: 'textarea',
                editoptions: {
                    fullRow: true
                },
                editrules: {
                    required: true
                },
                search: false
            }
        ];
        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Solicitud de Instalación', 'Editar Instalación', 'Agregar Instalación', '/lic/instalacionSolicitud', viewModel, 'estado', '/lic/getsession', ['Administrador LIC']);
        grid.build();
    });

})(jQuery, _);