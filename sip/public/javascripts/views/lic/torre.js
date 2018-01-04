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
        }, {
            label: 'Nombre',
            name: 'nombre',
            width: 200,
            editable: true,
            editrules: {
                required: true
            },
            editoptions: {
                fullRow: true
            },
            search: false
        }, {
            label: 'Correo',
            name: 'correo',
            width: 900,
            editable: true,
            editrules: {
                required: true
            },
            editoptions: {
                fullRow: true
            },
            search: false
        }];

        function beforeSubmit(postdata, formid) {
            if (!postdata.nombre) {
                return [false, 'Debe ingresar el nombre'];
            }
            if (!postdata.correo) {
                return [false, 'Debe ingresar el correo'];
            }
            return [true, '', ''];
        }

        function beforeSubmitDel(postdata, formid) {
            var rowData = $table.getRowData($table.getGridParam('selrow'));
            var thissid = rowData.id;
            if (thissid == '1' || thissid == '2') {
                return [false, 'La torre no se puede eliminar.', ''];
            } else {
                return [true, '', ''];
            }
        }



        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Torre', 'Editar Torre', 'Agregar Torre', '/lic/torre', viewModel, 'nombre', '/lic/getsession', ['Administrador LIC']);
        grid.prmAdd.beforeSubmit = beforeSubmit;
        grid.prmEdit.beforeSubmit = beforeSubmit;
        grid.prmDel.beforeSubmit = beforeSubmitDel;
        grid.build();
    });

})(jQuery, _);