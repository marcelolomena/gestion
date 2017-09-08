(function ($, _) {
    'use strict';

    var licLibrary = {
        jsonOptions: {
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        },
        createJSON: function (postdata) {
            if (postdata.id === '_empty')
                postdata.id = null;
            return JSON.stringify(postdata)
        }
    };

    function ModelItemTemplate(model) {
        var result = '<div id="responsive-form" class="clearfix">';
        var editables = _.filter(model, function (item) {
            return item.editable;
        })
        _.each(editables, function (item, key) {
            if (key + 1 % 2) {
                result += '<div class="form-row">';
                result += '<div class="column-half" id="d_' + item.name + '">' + item.label + '{' + item.name + '}</div>';
            } else {
                result += '<div class="column-half" id="d_' + item.name + '">' + item.label + '{' + item.name + '}</div>';
                result += '</div>';
            }
        });
        result += '<hr style="width:100%"/>';
        result += '<div> {sData} {cData} </div>';
        result += '</div>';
        this.template = result;
    }

    function TabTemplate(parentRowID, parentRowKey, tabs) {
        var nav = '<ul class="nav nav-tabs tabs-up" id="myTab">';
        var pane = '<div class="tab-content">';
        var paneClass, navClass;
        _.each(tabs, function (item, key) {
            paneClass = key ? 'tab-pane' : 'tab-pane active';
            nav += '<li><a href="/lic/' + item.id + '/' + parentRowKey + '" data-target="#' + item.id + '" id="' + item.id + '_tab_' + parentRowKey + '" data-toggle="tab_' + parentRowKey + '">' + item.nom + '</a></li>';
            pane += '<div class="' + paneClass + '" id="' + item.id + '"><div class="container-fluid"><table id="' + item.id + '_t_' + parentRowKey + '"></table><div id="navGrid' + item.id + '"></div></div></div>';
        });
        nav += '</ul>';
        pane += '</div>';
        this.template = nav + pane;
    }

    function SelectTemplate(data, caption, selectedId) {
        selectedId = selectedId || 0;
        var s = '<select><option value="0">--' + caption + '--</option>';
        var selected;
        _.each(data, function (item, key) {
            selected = item.id == selectedId ? '" selected>' : '">';
            s += '<option value="' + item.id + selected + item.nombre + '</option>';
        });
        this.template = s + '</select>';
    }

    function SimpleGrid(tableName, pagerName, caption, editCaption, addCaption, url, viewModel, sortField, sessionUrl, authorizedRoles) {
     var   tableId = '#' + tableName;
     var   $table = $(tableId);

        function errorTextFormat (data) {
            return 'Error: ' + data.responseText
        }

        this.loadComplete = function (data) {
            var thisId = $.jgrid.jqID(this.id);
            $.get(sessionUrl, function (data) {
                if (!_.intersection(authorizedRoles, _.map(data, function (item) {
                        return item.glosarol;
                    }))) {
                    $("#add_" + thisId).addClass('ui-disabled');
                    $("#edit_" + thisId).addClass('ui-disabled');
                    $("#del_" + thisId).addClass('ui-disabled');
                }
            });
        }
        this.config = {
            url: url,
            datatype: "json",
            mtype: "GET",
            colModel: viewModel,
            pager: '#' + pagerName,
            rowNum: 10,
            sortname: sortField,
            viewrecords: true,
            caption: caption,
            autowidth: true,
            page: 1,
            forceFit: true,
            height: 'auto',
            regional: 'es',
            sortorder: "desc",
            shrinkToFit: false,
            styleUI: "Bootstrap",
            loadComplete: this.loadComplete
        };
        this.beforeSubmit =errorTextFormat;
        this.itemTemplate = new ModelItemTemplate(viewModel);
        this.editErrorTextFormat = function (data) {
            return 'Error: ' + data.responseText
        };
        this.editBeforeShowForm =function (form) {
            var rowData = $table.getRowData($table.getGridParam("selrow"));
        };
        this.editAfterSubmit =  function (response, postdata) {
            var json = response.responseText;
            var result = JSON.parse(json);
            if (result.error != 0) {
                return [false, result.glosa, ""];
            } else {
                var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"nombre\",\"op\":\"cn\",\"data\":\"" + postdata.nombre + "\"}]}";
                $table.jqGrid('setGridParam', {
                    search: true,
                    postData: {
                        filters
                    }
                }).trigger("reloadGrid");
                return [true, "", ""];
            }
        };
        this.addErrorTextFormat = errorTextFormat;
        this.addBeforeSubmit = function (postdata, formid) {
            //valido formulario
        };
        this.addAfterSubmit= function (response, postdata) {
            var json = response.responseText;
            var result = JSON.parse(json);
            if (result.error != 0) {
                return [false, result.glosa, ""];
            } else {
                var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"descripcion\",\"op\":\"cn\",\"data\":\"" + postdata.descripcion + "\"}]}";
                $table.jqGrid('setGridParam', {
                    search: true,
                    postData: {
                        filters
                    }
                }).trigger("reloadGrid");
                return [true, "", ""];
            }
        };
        this.addBeforeShowForm= function (form) {};
        this.addAfterSubmit= function (response, postdata) {
            var json = response.responseText;
            var result = JSON.parse(json);
            if (!result.success)
                return [false, result.message, ""];
            else
                return [true, "", ""]
        };
        this.build = function () {
            $table.jqGrid(this.config);
            $table.jqGrid('filterToolbar', {
                stringResult: true,
                searchOperators: true,
                searchOnEnter: false,
                defaultSearch: 'cn'
            });
            $table.jqGrid('navGrid', this.config.pager, {
                edit: true,
                add: true,
                del: true,
                search: false
            }, {
                editCaption: editCaption,
                closeAfterEdit: true,
                recreateForm: true,
                ajaxEditOptions: licLibrary.jsonOptions,
                serializeEditData: licLibrary.createJSON,
                template: this.itemTemplate.template,
                errorTextFormat: this.editErrorTextFormat,
                beforeSubmit: this.editBeforeSubmit,
                afterSubmit:this.editAfterSubmit,
                beforeShowForm: this.editBeforeShowForm
            }, {
                addCaption: addCaption,
                closeAfterAdd: true,
                recreateForm: true,
                mtype: 'POST',
                ajaxEditOptions: licLibrary.jsonOptions,
                serializeEditData: licLibrary.createJSON,
                template: this.itemTemplate.template,
                errorTextFormat: this.addErrorTextFormat,
                beforeSubmit: this.addBeforeSubmit ,
                afterSubmit: this.addAfterSubmit,
                beforeShowForm: this.addBeforeShowForm
            }, {
                ajaxEditOptions: licLibrary.jsonOptions,
                serializeEditData: licLibrary.createJSON,
                mtype: 'POST',
                afterSubmit: this.addAfterSubmit
            });
        };
    }

    var zs = window['zs'];
    if (!zs) {
        window['zs'] = {};
    }
    _.assign(window['zs'], {
        ModelItemTemplate: ModelItemTemplate,
        TabTemplate: TabTemplate,
        SelectTemplate: SelectTemplate,
        SimpleGrid: SimpleGrid
    });

    var zs = window.zs;

    var initMainGrid = function (_url, _colModel, _sortname, tabs) {
        var table = 'gridMaster';
        var tableId = '#'+table;
        var grid = new zs.SimpleGrid(table,'pagerMaster', 'Inventario de licencias', 'Modificar Licencia', 'Agtregar Licencia', _url, _colModel, _sortname, '/lic/getsession', ['Administrador LIC']);
        grid.config.subGrid = true;
        grid.config.subGridRowExpanded = function (divid, rowid) {
            showChildGrid(divid, rowid, tabs);
        };
        grid.config.subGridBeforeExpand = function (divid, rowid) {
            //JPS:bad selector not working
            var expanded = $('td.sgexpanded',tableId )[0];
            if (expanded) {
                setTimeout(function () {
                    $(expanded).trigger("click");
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

    function selectTab (e) {
        var $this = $(this),
        loadurl = $this.attr('href'),
        targ = $this.attr('data-target'),
        tabGrid = selectTabGrid(targ);
    tabGrid.renderGrid(loadurl, parentRowKey, targ);
    $this.tab('show');
    return false;
    };

    function showChildGrid(parentRowID, parentRowKey, tabs) {
        var tabTemplate = new TabTemplate(parentRowID, parentRowKey, tabs).template;
        $('#' + parentRowID).append(tabTemplate);
        $('#' + tabs[0].id + '_tab_' + parentRowKey).addClass('media_node active span')
        $('.active[data-toggle="tab_' + parentRowKey + '"]').each(selectTab);
        $('[data-toggle="tab_' + parentRowKey + '"]').click(selectTab);
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
            name: 'fabricante',
            editable: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/lic/fabricante',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam("selrow"));
                    var thissid = rowData.fabricante;
                    var data = JSON.parse(response);
                    return new SelectTemplate(data, 'Seleccione Fabricante', thissid).template;
                }
            }
        }, {
            label: 'Software',
            name: 'software',
            editable: true
        }, {
            label: '¿Donde está instalada?',
            name: 'tipoInstalacion',
            editable: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/lic/tipoInstalacion',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam("selrow"));
                    var thissid = rowData.fabricante;
                    var data = JSON.parse(response);
                    return new SelectTemplate(data, 'Seleccione', thissid).template;
                }
            }
        }, {
            label: 'Clasificacion',
            name: 'clasificacion',
            editable: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/lic/clasificacion',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam("selrow"));
                    var thissid = rowData.fabricante;
                    var data = JSON.parse(response);
                    return new SelectTemplate(data, 'Seleccione Clasificación', thissid).template;
                }
            }
        }, {
            label: 'Tipo de Licenciamiento',
            name: 'tipoLicenciamiento',
            editable: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/lic/tipoLicenciamiento',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam("selrow"));
                    var thissid = rowData.fabricante;
                    var data = JSON.parse(response);
                    return new SelectTemplate(data, 'Seleccione Tipo de Licencia', thissid).template;
                }
            }
        }, {
            label: 'Cantidad Lic. Compradas',
            name: 'licStock',
            search: false,
            formatter: 'integer',
            editable: false
        }, {
            label: 'Licencias Disponibles',
            name: 'licDisponibles',
            search: false,
            formatter: 'integer',
            editable: false
        }, {
            label: 'Alerta de Renovación',
            name: 'alertaRenovacion',
            editable: false
        }, {
            label: 'Utilidad',
            name: 'utilidad',
            hidden: true,
            editable: true,
            edittype: "textarea"
        }, {
            label: 'Comentaios',
            name: 'comentarios',
            hidden: true,
            editable: true,
            edittype: "textarea"
        }
    ];

        var tabs = [{
                id: 'compra',
                nom: 'Compras'
            },
            {
                id: 'instalacion',
                nom: 'Instalaciones'
            },
            {
                id: 'ajuste',
                nom: 'Ajustes'
            },
            {
                id: 'traduccion',
                nom: 'Traducciones'
            }
        ];

        initMainGrid('/lic/grid_inventario', licenciasModel, 'fabricante', tabs);
    });
})(jQuery, _);