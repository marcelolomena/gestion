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
                width: 400,
                editable: false,
                search: false
            }
            // , {
            //     label: 'Nombre de Archivo',
            //     name: 'nombrearchivo',
            //     index: 'nombrearchivo',
            //     hidden: false,
            //     width: 250,
            //     align: "left",
            //     editable: false,
            //     editoptions: {
            //         custom_element: labelEditFunc,
            //         custom_value: getLabelValue
            //     },
            //     formatter: function (cellvalue, options, rowObject) {
            //         return returnDocLinkDoc(cellvalue, options, rowObject);
            //     },
            //     unformat: function (cellvalue, options, rowObject) {
            //         return returnDocLinkDoc2(cellvalue, options, rowObject);
            //     },
            //     search: false
            // },
            // {
            //     name: 'fileToUpload',
            //     label: 'Subir Archivo',
            //     hidden: true,
            //     editable: true,
            //     edittype: 'file',
            //     editrules: {
            //         edithidden: true,
            //         required: true
            //     },
            //     editoptions: {
            //         enctype: "multipart/form-data"
            //     },
            //     search: false
            // },
            // {
            //     label: 'Comentario',
            //     name: 'informacion',
            //     width: 400,
            //     hidden: false,
            //     editable: false,
            //     edittype: 'textarea',
            //     search: false
            // }
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