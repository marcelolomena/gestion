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
            }, {
                label: 'Producto',
                name: 'idProducto',
                jsonmap: 'producto.nombre',
                align: 'center',
                width: 200,
                editable: true,
                editoptions: {
                    fullRow: true,
                },
                search: false
            },
            {
                label: 'Número de Licencias',
                name: 'numLicencia',
                align: 'center',
                width: 135,
                editable: true,
                search: false
            }, {
                label: 'Fecha de Uso',
                name: 'fechaUso',
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
                search: false
            }, {
                label: 'CUI',
                name: 'cui',
                align: 'center',
                width: 100,
                editable: true,
                search: false
            }, {
                label: 'SAP',
                name: 'sap',
                align: 'center',
                width: 100,
                editable: true,
                search: false
            }, {
                label: 'Comentario de Solicitud',
                name: 'comentarioSolicitud',
                width: 400,
                hidden: false,
                editable: true,
                edittype: 'textarea',
                editoptions: {
                    fullRow: true
                },
                search: false
            },
            {
                label: 'Estado de Aprobación',
                name: 'estadoAprobacion',
                width: 90,
                align: 'center',
                hidden: false,
                editable: false,
                edittype: "custom",
                editoptions: {
                    custom_value: sipLibrary.getRadioElementValue,
                    custom_element: sipLibrary.radioElemReserva,
                    defaultValue: "Aprobado",
                    fullRow: true
                },
                formatter: function (cellvalue, options, rowObject) {
                    var dato = '';
                    var val = rowObject.estado;
                    if (val == 'Aprobado') {
                        dato = 'Aprobado';

                    } else if (val == 'Rechazado') {
                        dato = 'Rechazado';
                    }
                    return dato;
                },
                search: false
            },
            {
                label: 'Comentario de Aprobación',
                name: 'comentarioAprobacion',
                width: 400,
                hidden: false,
                editable: true,
                edittype: 'textarea',
                editoptions: {
                    fullRow: true
                },
                search: false
            }, {
                label: 'Estado de Autorización',
                name: 'estadoAutorizacion',
                width: 90,
                align: 'center',
                editable: true,
                edittype: "custom",
                editoptions: {
                    custom_value: sipLibrary.getRadioElementValue,
                    custom_element: sipLibrary.radioElemReservaAutorizacion,
                    defaultValue: "Autorizado",
                },
                formatter: function (cellvalue, options, rowObject) {
                    var dato = '';
                    var val = rowObject.estado;
                    if (val == 1) {
                        dato = 'Autorizado';

                    } else if (val == 0) {
                        dato = 'Denegado';
                    }
                    return dato;
                },
                search: false
            },
            {
                label: 'Comentario de Autorización',
                name: 'comentarioAutorizacion',
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
        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Autorización de Reserva', 'Editar Autorización', 'Agregar Autorización', '/lic/reservaAutorizado', viewModel, 'estado', '/lic/getsession', ['Administrador LIC']);
        grid.navParameters.add = false;
        grid.prmEdit.onInitializeForm = function (formid, action) {
            if (action === 'edit') {
                setTimeout(function () {
                    $('input#idFabricante').attr('readonly', 'readonly');
                    $('input#otroFabricante').attr('readonly', 'readonly');
                    $('select#idProducto').attr('readonly', 'readonly');
                    $('input#otroProducto').attr('readonly', 'readonly');
                    $('select#idClasificacion').attr('readonly', 'readonly');
                    $('select#idTipoInstalacion').attr('readonly', 'readonly');
                    $('select#idTipoLicenciamiento').attr('readonly', 'readonly');
                }, 500);
            }
        };
        grid.build();
    });

})(jQuery, _);