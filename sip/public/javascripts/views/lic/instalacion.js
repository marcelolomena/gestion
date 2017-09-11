var instalacionGrid = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var tabName = 'instalacion';
        var tableName = tabName + '_t_' + parentRowKey;
        var table = targ + '_t_' + parentRowKey;
        var $grid = $(table);
        var viewModel = [{
            label: 'ID',
            name: 'id',
            key: true,
            hidden: true,
            editable: false
        },{
            label:'CUI',
            name:'cui',
            editable: true
        },{
            label:'Usuario',
            name:'usuario',
            editable: true
        },{
            label:'Cantidad',
            name:'cantidad',
            editable: true
        }  
    
    
    ];

        var tabGrid = new zs.SimpleGrid(tableName, 'navGrid' + tabName, 'Instalaciones', 'Editar Instalación', 'Agregar Instalación', 'lic/' + tabName, viewModel, 'fabricante', '/lic/getsession', ['Administrador LIC']);
        tabGrid.build();
    }
};