(function ($, _) {
    'use strict';

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
        this.template =  result;
    };

    function TabTemplate(parentRowID, parentRowKey, tabs) {
        var nav = '<ul class="nav nav-tabs tabs-up" id="myTab">';
        var pane = '<div class="tab-content">';
        var paneClass, navClass;
        _.each(tabs, function (item, key) {
            paneClass = key ? 'tab-pane' : 'tab-pane active';
            nav += '<li><a href="/lic/' + item.id + '/' + parentRowKey + '" data-target="#' + item.id + '" id="' + item.id + '_tab_' + parentRowKey + '" data-toggle="tab_' + parentRowKey + '">' + item.nom + '</a></li>';
            pane += '<div class="' + paneClass + '" id="' + item.id + '"><div class="container-fluid"><table id="' + item.id + '_t_' + parentRowKey + '"></table><div id="navGridEst"></div></div></div>';
        });
        nav += '</ul>';
        pane += '</div>';
        this.template =  nav + pane;
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
    };


    var initGrid = function ($grid, _url, _colModel, _sortname, tabs) {

        $grid.jqGrid({
            url: _url,
            datatype: "json",
            mtype: "GET",
            colModel: _colModel,
            page: 1,
            rowNum: 10,
            regional: 'es',
            height: 'auto',
            autowidth: true,
            sortname: _sortname,
            sortorder: "desc",
            shrinkToFit: false,
            forceFit: true,
            viewrecords: true,
            caption: 'Inventario de licencias',
            styleUI: "Bootstrap",
            pager: "#pagerMaster",
            subGrid: true,
            subGridRowExpanded: function (divid, rowid) {
                showChildGrid(divid, rowid, tabs);
            },
            subGridBeforeExpand: function (divid, rowid) {
                var expanded = $("td.sgexpanded", "#gridMaster")[0];
                if (expanded) {
                    setTimeout(function () {
                        $(expanded).trigger("click");
                    }, 100);
                }
            },
            loadComplete: function (data) {
                var thisId = $.jgrid.jqID(this.id);
                $.get('/lic/getsession', function (data) {
                    $.each(data, function (i, item) {
                        if (item.glosarol != 'Administrador LIC') {
                            $("#add_" + thisId).addClass('ui-disabled');
                            $("#edit_" + thisId).addClass('ui-disabled');
                            $("#del_" + thisId).addClass('ui-disabled');
                        }
                    });
                });
            }
        });

        $grid.jqGrid('filterToolbar', {
            stringResult: true,
            searchOperators: true,
            searchOnEnter: false,
            defaultSearch: 'cn'
        });

        var itemTemplate = new ModelItemTemplate(_colModel).template;

        $grid.jqGrid('navGrid', '#pagerMaster', {
            edit: true,
            add: true,
            del: true,
            search: false
        }, {
            editCaption: "Modifica Licencia",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: itemTemplate,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                //valido formulario
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error != 0) {
                    return [false, result.glosa, ""];
                } else {
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"nombre\",\"op\":\"cn\",\"data\":\"" + postdata.nombre + "\"}]}";
                    $grid.jqGrid('setGridParam', {
                        search: true,
                        postData: {
                            filters
                        }
                    }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            },
            beforeShowForm: function (form) {
                var grid = $("#grid");
                var rowKey = $grid.getGridParam("selrow");
                var rowData = $grid.getRowData(rowKey);
                var tipocontrato = rowData.tipocontrato;
                var thisidcui = rowData.idcui;
                var thisidtecnico = rowData.idtecnico;
            }
        }, {
            addCaption: "Agrega Licencia",
            closeAfterAdd: true,
            recreateForm: true,
            mtype: 'POST',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: itemTemplate,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                //valido formulario
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error != 0) {
                    return [false, result.glosa, ""];
                } else {
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"descripcion\",\"op\":\"cn\",\"data\":\"" + postdata.descripcion + "\"}]}";
                    $grid.jqGrid('setGridParam', {
                        search: true,
                        postData: {
                            filters
                        }
                    }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            },
            beforeShowForm: function (form) {}
        }, {
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            mtype: 'POST',
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (!result.success)
                    return [false, result.message, ""];
                else
                    return [true, "", ""]
            }
        });
    };


    function selectTabGrid(targ) {
        switch (targ) {
            case compra:
                return compraGrid;
            case instalacion:
                return instalacionGrid;
            case ajuste:
                return ajusteGrid;
            case traduccion:
                return traduccionGrid;
            case bitacora:
                return bitacoraGrid;
        }
    };


    function showChildGrid(parentRowID, parentRowKey, tabs) {
        var tabTemplate = new TabTemplate(parentRowID, parentRowKey, tabs).template;
        $('#' + parentRowID).append(tabTemplate);
        $('#estadosolicitud_tab_' + parentRowKey).addClass('media_node active span')
        $('.active[data-toggle="tab_' + parentRowKey + '"]').each(function (e) {
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
        var $grid = $('#gridMaster');
        var licenciasModel = [{
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
                    var rowData = $grid.getRowData($grid.getGridParam("selrow"));
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
                    var rowData = $grid.getRowData($grid.getGridParam("selrow"));
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
                    var rowData = $grid.getRowData($grid.getGridParam("selrow"));
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
        }];

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
            },
            {
                id: 'bitacora',
                nom: 'Bitácora'
            }
        ];

        initGrid($grid, '/lic/grid_inventario', licenciasModel, 'fabricante', tabs);
    })
})(jQuery, _);