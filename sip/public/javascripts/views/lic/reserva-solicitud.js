(function ($, _) {
    'use strict';
    var zs = window.zs;

    function showChildGrid(divid, rowid) {
        var url = '/lic/estado/' + rowid;
        var gridID = divid + '_t';
        var pagerID = 'p_' + gridID;
        $('#' + divid).append('<table id=' + gridID + '></table><div id=' + pagerID + ' class=scroll></div>');
        viewreservaaprobacionGrid.renderGrid(url, gridID);
    }

    function beforeShowForm(form) {
        $.ajax({
            type: "GET",
            url: '/lic/usuariocui',
            async: false,
            success: function (data) {
                if (data) {
                    $("input#cui").val(data[0].cui);
                    $("#cui").attr('disabled', true);
                } else {
                    alert("No existe CUI asociado al Usuario");

                }
            }
        });
    }

    function beforeShowFormEdit(form) {
        var grid = $("#gridMaster");
        var rowKey = grid.getGridParam("selrow");
        var rowData = grid.getRowData(rowKey);
        var estad = rowData.estado;
        if (estad != 'A la Espera') {
            setTimeout(function () {
                $("#idProducto").attr('disabled', true);
                $("#numlicencia").attr('disabled', true);
                $("#fechaUso").attr('disabled', true);
                $("#cui").attr('disabled', true);
                $("#sap").attr('disabled', true);
                $("#comentarioSolicitud").attr('disabled', true);
            }, 500);

        }

    }


    var initGrid = function (viewModel) {
        var grid = new zs.StackGrid('gridMaster', 'pagerMaster', 'Solicitud de Reserva', 'Editar Solicitud', 'Agregar Solicitud', '/lic/reserva', viewModel, 'estado', '/lic/getsession', ['Administrador LIC'], showChildGrid);
        grid.prmAdd.beforeShowForm = beforeShowForm;
        grid.prmEdit.beforeShowForm = beforeShowFormEdit;

        grid.build();
    };


    function returnTaskLink(cellValue, options, rowdata, action) {
        if (rowdata.estado === 'Autorizado') {
            return "<a target='_blank' href='/lic/solicitudReservaPDF/" + rowdata.id + "/' >" + cellValue + " <img src='../../../../images/export_pdf.png' alt='PDF'></a>";
        } else {
            return ''
        }
    }

    $(function () {
        var $table = $('#gridMaster');
        var viewModel = [{
                label: 'ID',
                name: 'id',
                key: true,
                hidden: true,
                editable: false
            }, {
                label: 'Estado',
                name: 'estado',
                align: 'center',
                width: 100,
                editable: false,
                search: false
            }, {
                label: 'Código Autorización',
                name: 'codAutoriza',
                align: 'center',
                width: 140,
                editable: false,
                search: false,
                formatter: returnTaskLink
            }, {
                label: 'Producto',
                name: 'idProducto',
                jsonmap: 'producto.nombre',
                width: 250,
                align: 'center',
                sortable: false,
                editable: true,
                edittype: 'select',
                editoptions: {
                    fullRow: true,
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
            }, {
                label: 'Cantidad Lic.',
                name: 'numlicencia',
                align: 'center',
                width: 100,
                editable: true,
                editrules: {
                    required: true
                },
                search: false
            },
            // {
            //     label: 'Fecha de Uso',
            //     name: 'fechaUso',
            //     width: 110,
            //     align: 'center',
            //     sortable: false,
            //     editable: true,
            //     editoptions: {
            //         fullRow: true,
            //         readonly: 'readonly'
            //     },        
            //     formatter: function (cellvalue, options, rowObject) {
            //         //2017-12-31T00:00:00.000Z
            //         var val = rowObject.fechaUso;
            //         if (val != null) {
            //             val = val.substring(0,10);
            //             var fechaok = val.substring(8)+'-'+val.substring(5,7)+'-'+val.substring(0,4);
            //             return fechaok;
            //         } else {
            //             return '';
            //         }
            //     },
            //     search: false
            // }



            {
                label: 'Fecha de Uso',
                name: 'fechaUso',
                width: 100,
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
                width: 60,
                editable: true,
                editrules: {
                    required: true
                },
                search: false
            }, {
                label: 'SAP',
                name: 'sap',
                align: 'center',
                width: 60,
                editable: true,
                search: false
            }, {
                label: 'Comentario',
                name: 'comentarioSolicitud',
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
            }, {
                label: 'Usuario',
                name: 'idUsuario',
                jsonmap: 'user.first_name' + 'user.last_name',
                align: 'center',
                width: 100,
                hidden: true,
                editable: false,
                search: false
            }, {
                label: 'Usuario',
                name: 'idUsuarioJefe',
                jsonmap: 'userJefe.first_name' + 'user.last_name',
                align: 'center',
                width: 100,
                hidden: true,
                editable: false,
                search: false
            }
        ];
        initGrid(viewModel);
    });

})(jQuery, _);