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
                editable: false
            },
            {
                label: 'Estado',
                name: 'estado',
                width: 90,
                align: 'center',
                editable: false,
                edittype: "custom",
                editoptions: {
                    custom_value: sipLibrary.getRadioElementValue,
                    custom_element: sipLibrary.radioElemReserva
                    //defaultValue: "Aprobar"
                    // fullRow: true
                },
                search: false
            },
            {
                label: 'Producto',
                name: 'idProducto',
                jsonmap: 'nombre',
                align: 'center',
                width: 200,
                editable: true,
                editoptions: {
                    fullRow: true,
                    readonly: 'readonly'
                },
                editrules: {
                    required: false,
                    edithidden: false
                },
                search: false
            },
            {
                label: 'Cantidad',
                name: 'numlicencia',
                align: 'center',
                width: 70,
                editable: true,
                editoptions: {
                    readonly: 'readonly'
                },
                editrules: {
                    required: false,
                    edithidden: false
                },
                search: false
            },
            {
                label: 'Fecha de Uso',
                name: 'fechauso',
                width: 110,
                align: 'center',
                sortable: false,
                editable: true,
                formatter: function (cellvalue, options, rowObject) {
                    //2017-12-31T00:00:00.000Z
                    var val = rowObject.fechauso;
                    if (val != null) {
                        val = val.substring(0,10);
                        var fechaok = val.substring(8)+'-'+val.substring(5,7)+'-'+val.substring(0,4);
                        return fechaok;
                    } else {
                        return '';
                    }
                },
                search: false
            },

            {
                label: 'CUI',
                name: 'cui',
                jsonmap: 'cui',
                width: 50,
                align: 'center',
                sortable: false,
                editable: true,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/cuibchres',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.id;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione el CUI', thissid).template;
                    },
                },
                editrules: {
                    required: true
                },
                search: false
            },
            {
                label: 'SAP',
                name: 'sap',
                align: 'center',
                width: 50,
                editable: true,
                search: false
            }, {
                label: 'Comentario de Solicitud',
                name: 'comentariosolicitud',
                width: 300,
                hidden: false,
                editable: true,
                edittype: 'textarea',
                editoptions: {
                    fullRow: true,
                    readonly: 'readonly'
                },
                editrules: {
                    required: false,
                    edithidden: false
                },
                search: false
            }, {
                label: 'Estado',
                name: 'estado',
                width: 90,
                align: 'center',
                editable: true,
                hidden: true,
                edittype: "custom",
                editoptions: {
                    custom_value: sipLibrary.getRadioElementValue,
                    custom_element: sipLibrary.radioElemReserva
                    //defaultValue: "Aprobar"
                    // fullRow: true
                },
                search: false
            },
            {
                label: 'Comentario de Aprobación',
                name: 'comentarioaprobacion',
                width: 300,
                hidden: false,
                editable: true,
                edittype: 'textarea',
                // editoptions: {
                //     fullRow: true
                // },
                editrules: {
                    required: true
                },
                search: false
            }
        ];
        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Aprobación de Reserva', 'Editar Aprobación', 'Agregar Aprobación', '/lic/reserva-aprobacion', viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
        grid.build();
    });

})(jQuery, _);