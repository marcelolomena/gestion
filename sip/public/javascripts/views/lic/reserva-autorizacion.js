(function ($, _) {
    'use strict';
    var zs = window.zs;

    function returnSolicitante(cellValue, options, rowdata, action) {
        if (rowdata.solicitante != null)
            return rowdata.solicitante.first_name + ' ' + rowdata.solicitante.last_name;
        else
            return '';
    }

    function returnAprobador(cellValue, options, rowdata, action) {
        if (rowdata.aprobador != null)
            return rowdata.aprobador.first_name + ' ' + rowdata.aprobador.last_name;
        else
            return '';
    }




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
                name: 'estado',
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
            {
                label: 'Número Licencias',
                name: 'numlicencia',
                align: 'center',
                width: 120,
                editable: true,
                search: false
            },
            {
                label: 'Fecha de Uso',
                name: 'fechaUso',
                width: 150,
                align: 'center',
                search: false,
                formatter: function (cellvalue, options, rowObject) {
                    //2017-12-31T00:00:00.000Z
                    var val = rowObject.fechaUso;
                    if (val != null) {
                        val = val.substring(0, 10);
                        var fechaok = val.substring(8) + '-' + val.substring(5, 7) + '-' + val.substring(0, 4);
                        return fechaok;
                    } else {
                        return '';
                    }
                },
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
                jsonmap: 'solicitante.first_name',
                align: 'center',
                width: 100,
                editable: false,
                formatter: returnSolicitante,
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
                jsonmap: 'aprobador.first_name',
                align: 'center',
                width: 100,
                editable: false,
                formatter: returnAprobador,
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
                    $("#fechaUso").attr('disabled', true);
                    $('input#numlicencia').attr('readonly', 'readonly');
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