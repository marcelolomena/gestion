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
        grid.config.subGrid = true;
        grid.config.subGridRowExpanded = function (divid, rowid) {
            showChildGrid(divid, rowid, tabs);
        };
        grid.config.subGridBeforeExpand = function (divid, rowid) {
            var expanded = $('td.sgexpanded', tableId)[0];
            if (expanded) {
                setTimeout(function () {
                    $(expanded).trigger('click');
                }, 100);
            }
        };
        grid.build();
    };

    function selectTabGrid(targ) {
        switch (targ) {
            case '#compra':
                return compraGrid;
            case '#tramite':
                return tabdetalleCompraTramiteGrid;
            case '#recepcion':
                return recepcionGrid;
            // case '#instalacion':
            //     return instalacionGrid;
            case '#ajuste':
                return ajusteGrid;
            case '#traduccion':
                return tabtraduccionGrid;
            case '#bitacora':
                return bitacoraGrid;
        }
    };

    function showChildGrid(parentRowID, parentRowKey, tabs) {
        var tabTemplate = new zs.TabTemplate(parentRowID, parentRowKey, tabs).template;
        $('#' + parentRowID).append(tabTemplate);
        $('#' + tabs[0].id + '_tab_' + parentRowKey).addClass('media_node active span')
        $('.active[data-toggle="tab_' + parentRowKey + '"]').each(function (item) {
            var $this = $(this),
                loadurl = $this.attr('href'),
                targ = $this.attr('data-target'),
                tabGrid = selectTabGrid(targ);
            tabGrid.renderGrid(loadurl, parentRowKey, targ);
            $this.tab('show');
            return false;
        });
        $('[data-toggle="tab_' + parentRowKey + '"]').click(function (e) {
            var $this = $(this),
                loadurl = $this.attr('href'),
                targ = $this.attr('data-target'),
                tabGrid = selectTabGrid(targ);
            tabGrid.renderGrid(loadurl, parentRowKey, targ);
            $this.tab('show');
            return false;
        });
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
            label: 'Fabricante',
            name: 'idFabricante',
            jsonmap: 'fabricante.nombre',
            width: 380,
            align: 'center',
            sortable: false,
            editable: true,
            edittype: 'select',
            editoptions: {
                dataUrl: '/lic/fabricantes',
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
                dataUrl: '/lic/fabricantes',
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
            width: 380,
            align: 'center',
            sortable: false,
            editable: true
        }, {
            label: 'Cantidad Lic. Compradas',
            name: 'licStock',
            width: 125,
            align: 'center',
            formatter: function (cellvalue, options, rowObject) {
                return rowObject.ilimitado ? 'Ilimitado' : cellvalue;
            },
            editable: false,
            search: false
        }, {
            label: 'Ilimitado',
            name: 'ilimitado',
            align: 'center',
            hidden: true,
            search: false    
        }, {
            label: 'Por Recepcionar',
            name: 'licTramite',
            width: 125,
            align: 'center',
            formatter: 'integer',
            editable: false,
            search: false
        }, {
            label: 'Instaladas',
            name: 'licOcupadas',
            width: 150,
            align: 'center',
            formatter: 'integer',
            editable: false,
            search: false
        }, {
            label: 'Alerta de Renovación',
            name: 'alertaRenovacion',
            jsonmap: 'alertaRenovacion.nombre',
            align: 'center',
            sortable: false,
            editable: false,
            search: false
        }, {
            label: '¿Donde está instalada?',
            name: 'idTipoInstalacion',
            jsonmap: 'tipoInstalacion.nombre',
            width: 160,
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
            label: 'Clasificación',
            name: 'idClasificacion',
            jsonmap: 'clasificacion.nombre',
            width: 150,
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
            label: 'Tipo de Licenciamiento',
            name: 'idTipoLicenciamiento',
            jsonmap: 'tipoLicenciamiento.nombre',
            width: 170,
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
        }, {
            label: 'Comentarios',
            name: 'comentarios',
            hidden: true,
            sortable: false,
            editable: true,
            edittype: 'textarea'
        }];

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
            id: 'traduccion',
            nom: 'Traducciones'
        }];

        initMainGrid('/lic/grid_inventario', viewModel, 'nombre', tabs);
    });
})(jQuery, _);
