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
            label: 'Producto',
            name: 'idProducto',
            jsonmap: 'producto.nombre',
            width: 250,
            align: 'center',
            sortable: false,
            editable: true,
            edittype: 'select',
            editoptions: {
                dataUrl: '/lic/producto',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.nombre;
                    var data = JSON.parse(response);
                    return new zs.SelectTemplate(data, 'Seleccione el Producto', thissid).template;
                },
                dataEvents: [{
                    type: 'change',
                    fn: function (e) {
                        var rowKey = $table.getGridParam("selrow");
                        var rowData = $table.getRowData(rowKey);
                        var thissid = $(this).val();
                        $("input#idFabricante").val($('option:selected', this).text());
                        var idFabricante = $('option:selected', this).val();
                        if (idFabricante) {

                            $.ajax({
                                type: "GET",
                                url: '/lic/getFabricante/' + thissid,
                                async: false,
                                success: function (data) {
                                    if (data) {
                                        $("select#idFabricante").val(data.idFabric);
                                        $("#idFabricante").attr('disabled', true);
                                        $("#otroFabricante").attr('disabled', true);
                                    } else {
                                        alert("No existe Fabricante para este Producto");
                                        $("select#idFabricante").val("");
                                    }
                                }

                            });
                        } else {
                            $("#idFabricante").attr('disabled', false);
                            $("#otroFabricante").attr('disabled', false);

                        }
                    }
                }],
            },
            editrules: {
                required: false
            },
            search: true
        }, {
            label: 'Nombre',
            name: 'nombre',
            width: 300,
            editable: true
        }];
        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Traducciones', 'Editar Traducción', 'Agregar Traducción', '/lic/traduccion', viewModel, 'idProducto', '/lic/getsession', ['Administrador LIC']);
        grid.build();
    });

})(jQuery, _);