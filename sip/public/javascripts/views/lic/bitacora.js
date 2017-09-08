var bitacoraGrid = {
    renderGrid: function (loadurl, parentRowKey, targ) {
        var table = targ + '_t_' + parentRowKey;
        var $grid = $(table);
        var compraModel = [{
            label: 'ID',
            name: 'id',
            key: true,
            hidden: true,
            editable: false
        }, {
            label: 'Fabricante',
            name: 'fabricante',
            editable: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/lic/fabricante',
                buildSelect: function (response) {
                    var rowData = $grid.getRowData($grid.getGridParam("selrow"));
                    var thissid = rowData.fabricante;
                    var data = JSON.parse(response);
                    return new SelectTemplate(data, 'Seleccione Fabricante', thissid).template;
                }
            }
        }];

        var tabGrid = new zs.SimpleGrid(table,'navGridcompra' , 'Compras', 'Editar Compra', 'Agregar compra', 'lic/compra', compraModel, 'Fabricante', '/lic/getsession', ['Administrador LIC']);
        tabGrid.build();
    }
};
