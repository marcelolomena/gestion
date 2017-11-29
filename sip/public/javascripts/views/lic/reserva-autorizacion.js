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
                label: 'Estado Aprobación',
                name: 'estadoAprobacion',
                width: 130,
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
                jsonmap: 'producto.nombre',
                width: 200,
                align: 'center',
                editable: true,
                edittype: 'select',
                editoptions: {
                    fullRow: true,
                    dataUrl: '/lic/producto',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.nombre;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione el Producto', thissid).template;
                    },
                },
                search: false
            },
            // {
            //     label: 'Producto',
            //     name: 'idProducto',
            //     jsonmap: 'producto.nombre',
            //     align: 'center',
            //     width: 200,
            //     editable: true,
            //     editoptions: {
            //         fullRow: true,
            //     },
            //     search: false
            // },
            {
                label: 'Número Licencias',
                name: 'numLicencia',
                align: 'center',
                width: 120,
                editable: true,
                search: false
            }, {
                label: 'Fecha de Uso',
                name: 'fechaUso',
                width: 95,
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
                width: 50,
                editable: true,
                search: false
            }, {
                label: 'SAP',
                name: 'sap',
                align: 'center',
                width: 50,
                editable: true,
                search: false
            }, {
                label: 'Solicitante',
                name: 'idUsuario',
                jsonmap: 'user.first_name',
                align: 'center',
                width: 100,
                editable: false,
                search: false
            },
            {
                label: 'Comentario de Solicitud',
                name: 'comentarioSolicitud',
                width: 300,
                hidden: false,
                editable: true,
                edittype: 'textarea',
                editoptions: {
                    fullRow: true
                },
                search: false
            },
            {
                label: 'Aprobador',
                name: 'idUsuarioJefe',
                jsonmap: 'userJefe',
                align: 'center',
                width: 100,
                editable: false,
                search: false
            },
            {
                label: 'Comentario de Aprobación',
                name: 'comentarioAprobacion',
                width: 300,
                hidden: false,
                editable: true,
                edittype: 'textarea',
                editoptions: {
                    fullRow: true
                },
                search: false
            },
            {
                label: 'Estado Autorización',
                name: 'estadoAutorizacion',
                width: 130,
                align: 'center',
                editable: true,
                hidden: true,
                edittype: "custom",
                editoptions: {
                    custom_value: sipLibrary.getRadioElementValue,
                    custom_element: sipLibrary.radioElemReservaAutorizacion
                    //defaultValue: "Aprobar"
                    // fullRow: true
                },
                search: false
            },

            // {
            //     label: 'Estado Autorización',
            //     name: 'estadoAutorizacion',
            //     width: 130,
            //     align: 'center',
            //     editable: true,
            //     hidden: true,
            //     edittype: "custom",
            //     editoptions: {
            //         custom_value: sipLibrary.getRadioElementValue,
            //         custom_element: sipLibrary.radioElemReservaAutorizacion
            //     },
            //     formatter: function (cellvalue, options, rowObject) {
            //         var dato = '';
            //         var val = rowObject.estado;
            //         if (val == 1) {
            //             dato = 'Autorizado';

            //         } else if (val == 0) {
            //             dato = 'Denegado';
            //         }
            //         return dato;
            //     },
            //     search: false
            // },
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
                    $("#idProducto").attr('disabled', true);
                    $("#fechaUso").attr('disabled', true);
                    $('input#numLicencia').attr('readonly', 'readonly');
                    $('input#cui').attr('readonly', 'readonly');
                    $('input#sap').attr('readonly', 'readonly');
                    $('textarea#comentarioSolicitud').attr('readonly', 'readonly');
                    $('textarea#comentarioAprobacion').attr('readonly', 'readonly');
                }, 500);
            }
        };
        grid.build();
    });

})(jQuery, _);