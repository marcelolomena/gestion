(function ($, _) {
    'use strict';
    var zs = window.zs;

    function showChildGrid(divid, rowid) {
        var url = '/lic/estado/' + rowid;
        var gridID = divid + '_t';
        var pagerID = 'p_' + gridID;
        $('#' + divid).append('<table id=' + gridID + '></table><div id=' + pagerID + ' class=scroll></div>');
        detalleCompraTramiteGrid.renderGrid(url, gridID);
    }

    function beforeShowForm(form){
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
    var initGrid = function (viewModel) {
        var grid = new zs.StackGrid('gridMaster', 'pagerMaster', 'Solicitud de Reserva', 'Editar Solicitud', 'Agregar Solicitud', '/lic/reserva', viewModel, 'idEstado', '/lic/getsession', ['Administrador LIC'], showChildGrid);
        grid.prmAdd.beforeShowForm = beforeShowForm;
        grid.build();
    };

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
                name: 'idEstado',
                jsonmap: 'estado.nombre',
                align: 'center',
                width: 100,
                editable: false,
                search: false
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
                    dataUrl: '/lic/producto',
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
            {
                label: 'Fecha de Uso',
                name: 'fechaUso',
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
                label: 'CUI',
                name: 'cui',
                align: 'center',
                width: 60,
                editable: true,
                editrules: {
                    required: true
                },
                search: false
            },
            {
                label: 'SAP',
                name: 'sap',
                align: 'center',
                width: 60,
                editable: true,
                search: false
            },
            {
                label: 'Comentario',
                name: 'comentarioSolicitud',
                width: 500,
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
        initGrid(viewModel);
    });

})(jQuery, _);