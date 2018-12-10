(function ($, _) {
    'use strict';

    var zs = window.zs;

    var initMainGrid = function (_url, _colModel, _sortname, tabs) {
        var table = 'gridMaster';
        var tableId = '#' + table;
        var grid = new zs.SimpleGrid(table, 'pagerMaster', 'Inventario de licencias', 'Modificar Licencia', 'Agtregar Licencia', _url, _colModel, _sortname, '/lic/getsession', ['Administrador LIC']);
        grid.navParameters.edit = false;
        grid.navParameters.add = false;
        grid.navParameters.del = false;
        grid.navParameters.view = false;
        grid.config.styleUI=  "Bootstrap",
        grid.config.subGrid = true;
        grid.config.subGridRowExpanded = function (parentRowID, parentRowKey) {
            showChildGrid(parentRowID, parentRowKey, tabs);
        };
        grid.config.subGridBeforeExpand = function (divid, rowid) {
            var expanded = jQuery("td.sgexpanded", tableId)[0];
            if (expanded) {
                setTimeout(function () {
                    $(expanded).trigger("click");
                }, 100);
            }
        };
        grid.config.rowNum = 20;
        grid.build();
    };

    var tabs = [{
        id: 'compra',
        nom: 'Compra'
    }, {
        id: 'recepcion',
        nom: 'Recepciones'
    }, {
        id: 'tramite',
        nom: 'Compra Trámite'
    }, {
        id: 'instalacion',
        nom: 'Utilizadas'
    }, {
        id: 'reserva',
        nom: 'Reserva'
    }, {
        id: 'snow',
        nom: 'SNOW'
    }, {
        id: 'addm',
        nom: 'ADDM'
    }, {
        id: 'traduccion',
        nom: 'Traducciones'
    }];

    function showChildGrid(parentRowID, parentRowKey, tabs) {
        
        var tabTemplate = new zs.TabTemplate(parentRowID, parentRowKey, tabs).template;

        // console.log(tabTemplate);
        $('#' + parentRowID).append(tabTemplate);
        $(function () {
            $(".nav a").on("click", function(){
                $(".nav").find(".active").removeClass("active");
            });
        });
        $('#' + tabs[0].id + '_tab_' + parentRowKey).addClass('media_node active span ');
        $('.active[data-toggle="tab_' + parentRowKey + '"]').each(function (e) {
            
            var $this = $(this),
                loadurl = $this.attr('href'),
                targ = $this.attr('data-target'),
                tabGrid = selectTabGrid(targ);

                 
            tabGrid.renderGrid(loadurl, parentRowKey, targ);
            console.log($this);
            $this.tab('show');
            return false;
        });
        $('[data-toggle="tab_' + parentRowKey + '"]').click(function (e) {
            var $this = $(this),
                loadurl = $this.attr('href'),
                targ = $this.attr('data-target'),
                tabGrid = selectTabGrid(targ);
            tabGrid.renderGrid(loadurl, parentRowKey, targ);
            console.log($this);
            $this.tab('show');
            return false;
        });
    };
    function selectTabGrid(targ) {
        switch (targ) {
            case '#compra':
                return compraGrid;
            case '#tramite':
                return tabdetalleCompraTramiteGrid;
            case '#recepcion':
                return recepcionGrid;
            case '#ajuste':
                return ajusteGrid;
            case '#traduccion':
                return tabtraduccionGrid;
            case '#snow':
                return tabSnowGrid;
            case '#bitacora':
                return bitacoraGrid;
            case '#addm':
                return tabAddmGrid;
            case '#reserva':
                return tabReservaGrid;
            case '#instalacion':
                return tabInstalacionGrid;
        }
    };

    $(function () {

        var $table = $('#gridMaster');
        var viewModel = [{
                label: 'ID',
                name: 'id',
                key: true,
                hidden: true,
                editable: false,
                editoptions: {
                    fullRow: true
                }
            }, {
                label: 'Fabricante',
                name: 'idFabricante',
                jsonmap: 'nombreFab',
                width: 202,
                align: 'center',
                sortable: false,
                editable: true,
                edittype: 'select',
                editoptions: {
                    fullRow: true,
                    dataUrl: '/lic/listAllFabricante',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.fabricante;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione Fabricante', thissid).template;
                    }
                },
                search: true,
                stype: 'select',
                searchoptions: {
                    dataUrl: '/lic/listAllFabricante',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.idFabricante;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
                    }
                }
            }, {
                label: 'Software',
                name: 'nombre',
                width: 204,
                align: 'center',
                sortable: false,
                editable: true,
                editoptions: {
                    fullRow: true
                }
            }, {
                label: 'Cant. Compradas',
                name: 'licstock',
                width: 144,
                align: 'center',
                formatter: function (cellvalue, options, rowObject) {
                    return rowObject.ilimitado ? 'Ilimitado' : cellvalue;
                },
                editable: false,
                search: false,
                editoptions: {
                    fullRow: true
                }
            }, {
                label: 'Ilimitado',
                name: 'ilimitado',
                align: 'center',
                hidden: true,
                search: false,
                editoptions: {
                    fullRow: true
                }
            }, {
                label: 'Recepcionar',
                name: 'lictramite',
                width: 120,
                align: 'center',
                // formatter: 'integer',
                editable: false,
                search: false,
                editoptions: {
                    fullRow: true
                }
            }, {
                label: 'Utilizadas',
                name: 'licocupadas',
                width: 90,
                align: 'center',
                editable: false,
                search: false,
                editoptions: {
                    fullRow: true
                }
            },
            {
                label: 'Reserva',
                name: 'licReserva',
                width: 90,
                align: 'center',
                formatter: 'integer',
                editable: false,
                search: false,
                editoptions: {
                    fullRow: true
                }
            }, {
                label: 'Snow',
                width: 84,
                name: 'snow',
                align: 'center',
                hidden: false,
                search: false,
                editoptions: {
                    fullRow: true
                }
            }, {
                label: 'Addm',
                width: 84,
                name: 'addm',
                align: 'center',
                hidden: false,
                search: false,
            }, {
                label: 'Disponible',
                name: 'disponible',
                width: 89,
                align: 'center',
                formatter: function (cellvalue, options, rowObject) {
                    var compradas = rowObject.licstock;
                    var ilimitado = rowObject.ilimitado;
                    var instaladas = rowObject.licocupadas;
                    var reservadas = rowObject.licReserva;
                    var disponible = compradas - instaladas - reservadas
                    if (ilimitado == '1') {
                        return disponible = 'Ilimitado'
                    } else {
                        return disponible
                    }
                },
                editable: false,
                search: false
            },
            {
                label: 'Alerta Renovación',
                name: 'alertarenovacion',
                width: 95,
                hidden: false,
                search: false,
                editable: true,
                align: 'right',
                align: 'center',
                formatter: function (cellvalue, options, rowObject) {
                    var rojo = '<span><img src="../../../../images/redcircle.png" width="19px"/></span>';
                    var amarillo = '<span><img src="../../../../images/yellowcircle.png" width="19px"/></span>';
                    var verde = '<span><img src="../../../../images/greencircle.png" width="19px"/></span>';
                    var gris = '<span><img src="../../../../images/greycircle.png" width="19px"/></span>';
                    if (rowObject.alertarenovacion === 'aGris') {
                        return gris;
                    } else {
                        if (rowObject.alertarenovacion === 'Vencida') {
                            return rojo;
                        } else {
                            if (rowObject.alertarenovacion === 'Renovar') {
                                return amarillo;
                            } else {
                                if (rowObject.alertarenovacion === 'bAl Dia')


                                    return verde;
                            }
                        }
                    }
                }
            }, {
                label: '¿Donde está instalada?',
                name: 'idTipoInstalacion',
                jsonmap: 'nombreTipoInst',
                width: 191,
                align: 'center',
                sortable: false,
                editable: true,
                hidden: false,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/tiposInstalacion',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.tipoInstalacion;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
                    }
                },
                search: true,
                stype: 'select',
                searchoptions: {
                    dataUrl: '/lic/tiposInstalacion',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.tipoInstalacion;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
                    }
                }
            }, {
                label: 'Tipo de Licenciamiento',
                name: 'idTipoLicenciamiento',
                jsonmap: 'nombreTipoLic',
                width: 203,
                align: 'center',
                sortable: false,
                editable: true,
                hidden: false,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/tiposLicenciamiento',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.tipoLicenciamiento;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione Tipo de Licencia', thissid).template;
                    }
                },
                search: true,
                stype: 'select',
                searchoptions: {
                    dataUrl: '/lic/tiposLicenciamiento',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.tipoLicenciamiento;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
                    }
                }
            },
            {
                label: 'Clasificación',
                name: 'idClasificacion',
                jsonmap: 'nombreClas',
                width: 179,
                align: 'center',
                sortable: false,
                editable: true,
                hidden: false,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/clasificaciones',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.clasificacion;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione Clasificación', thissid).template;
                    }
                },
                search: true,
                stype: 'select',
                searchoptions: {
                    dataUrl: '/lic/clasificaciones',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.clasificacion;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
                    }
                }
            }, {
                label: 'Comentarios',
                name: 'comentarios',
                hidden: true,
                sortable: false,
                editable: true,
                edittype: 'textarea'
            }
        ];

        initMainGrid('/lic/grid_inventario', viewModel, 'nombre', tabs);
    });
})(jQuery, _);