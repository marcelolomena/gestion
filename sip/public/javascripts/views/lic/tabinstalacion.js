var tabInstalacionGrid = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var tabName = 'instalacion';
        var tableName = tabName + '_t_' + parentRowKey;
        var table = targ + '_t_' + parentRowKey;
        var $table = $(table);

        function labelEditFunc(value, opt) {
            return "<span>" + value + "</span";
        }

        function getLabelValue(e, action, textvalue) {
            if (action == 'get') {
                console.log("esto es?")
                return e.innerHTML;
            } else {
                if (action == 'set') {
                    $(e).html(textvalue);
                    console.log("o no??")
                }
                console.log("o nada??")
            }
        }
        var viewModel = [{
                label: 'Plantilla',
                name: 'id',
                key: true,
                hidden: true,
                width: 50,
                editable: true,
                hidedlg: true,
                sortable: false,
                editrules: {
                    edithidden: false
                }

            }, {
                label: 'Producto',
                name: 'idProducto',
                jsonmap: 'producto.nombre',
                width: 400,
                align: 'center',
                sortable: false,
                editable: false,
                search: false
            }, {
                label: 'Numero Licencias',
                name: 'numlicencia',
                align: 'center',
                width: 120,
                editable: false,
                search: false
            }, {
                label: 'Código de Autorización',
                name: 'codAutorizacion',
                align: 'center',
                width: 200,
                editable: false,
                formatter: function (cellvalue, options, rowObject) {
                    var estado = rowObject.estado;
                    if (estado == 'Historico') {
                        return codauto = 'Historico'
                    }else{
                        return cellvalue
                    }
                },
                search: false,
                
            }, 
            {
                label: 'Instalador',
                name: 'instalador',
                align: 'center',
                width: 120,
                editable: false,
                search: false
            },
            {
                label: 'Fecha de Instalación',
                name: 'fechaInstalacion',
                width: 200,
                align: 'center',
                sortable: false,
                editable: true,
                editoptions: {
                    fullRow: true,
                    readonly: 'readonly'
                },        
                formatter: function (cellvalue, options, rowObject) {
                    //2017-12-31T00:00:00.000Z
                    var val = rowObject.fechaInstalacion;
                    if (val != null) {
                        val = val.substring(0,10);
                        var fechaok = val.substring(8)+'-'+val.substring(5,7)+'-'+val.substring(0,4);
                        return fechaok;
                    } else {
                        return '';
                    }
                },
                search: false
            }
        ];

        function returnDocLinkDoc(cellValue, options, rowdata) {
            if (rowdata.nombrearchivo != "") {
                return "<a href='/docs/lic/" + rowdata.nombrearchivo + "' >" + rowdata.nombrearchivo + "</a>";
            } else {
                return "";
            }

        }

        function returnDocLinkDoc2(cellValue, options, rowdata) {
            if (rowdata.nombrearchivo != "") {
                return rowdata.nombrearchivo;
                //return "<a href='/docs/" + parentRowKey + "/" + rowdata.nombrearchivo + "' >"+rowdata.nombrearchivo+"</a>";
            } else {
                return "";
            }

        }

        var tabGrid = new zs.SimpleGrid(tableName, 'navGrid' + tabName, 'Instalaciones', 'Editar Instalación', 'Agregar Instalación', loadurl, viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
        tabGrid.navParameters.edit = false;
        tabGrid.navParameters.add = false;
        tabGrid.navParameters.del = false;
        tabGrid.navParameters.view = false;

        tabGrid.build();
    }

};