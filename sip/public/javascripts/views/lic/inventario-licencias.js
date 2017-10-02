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
            case '#instalacion':
                return instalacionGrid;
            case '#ajuste':
                return ajusteGrid;
            case '#traduccion':
                return traduccionGrid;
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
        var licenciasModel = [
            {
                label: 'ID',
                name: 'id',
                key: true,
                hidden: true,
                editable: false
            }, {
                label: 'Fabricante',
                name: 'idFabricante',
                jsonmap: 'fabricante.nombre',
                width: 180,
                align: 'center',
                sortable: false,
                editable: true,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/fabricante',
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
                    dataUrl: '/lic/fabricante',
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
                width: 200,
                align: 'center',
                sortable: false,
                editable: true
            }, {
                label: '¿Donde está instalada?',
                name: 'idTipoInstalacion',
                jsonmap: 'tipoInstalacion.nombre',
                width: 160,
                align: 'center',
                sortable: false,
                editable: true,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/tipoInstalacion',
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
                    dataUrl: '/lic/tipoInstalacion',
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
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/clasificacion',
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
                    dataUrl: '/lic/clasificacion',
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
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/tipoLicenciamiento',
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
                    dataUrl: '/lic/tipoLicenciamiento',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.tipoLicenciamiento;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
                    }
                }
            }, {
                label: 'Cantidad Lic. Compradas',
                name: 'licStock',
                width: 125,
                align: 'center',
                formatter: 'integer',
                editable: false,
                search: false
            }, {
                label: 'Licencias Instaladas',
                name: 'licOcupadas',
                width: 125,
                align: 'center',
                formatter: 'integer',
                editable: false,
                search: false
            }, {
                label: 'Alerta de Renovación',
                name: 'alertaRenovacion',
                sortable: false,
                editable: false,
                search: false
            }, {
                label: 'Utilidad',
                name: 'utilidad',
                hidden: true,
                sortable: false,
                editable: true,
                edittype: 'textarea'
            }, {
                label: 'Comentarios',
                name: 'comentarios',
                hidden: true,
                sortable: false,
                editable: true,
                edittype: 'textarea'
            }
        ];

        var tabs = [{
            id: 'compra',
            nom: 'Compras'
        },/*  {
            id: 'instalacion',
            nom: 'Instalaciones'
        }, {
            id: 'ajuste',
            nom: 'Ajustes'
        }, */ {
            id: 'traduccion',
            nom: 'Traducciones'
        }];

        initMainGrid('/lic/grid_inventario', licenciasModel, 'nombre', tabs);
    });
})(jQuery, _);