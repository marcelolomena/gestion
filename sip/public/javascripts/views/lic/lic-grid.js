(function ($, _) {
    'use strict';

    var licLibrary = {
        jsonOptions: {
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
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
        var s = '<select><option value="">--' + caption + '--</option>';
        var selected;
        _.each(data, function (item, key) {
            selected = item.id == selectedId ? '" selected>' : '">';
            s += '<option value="' + item.id + selected + item.nombre + '</option>';
        });
        this.template = s + '</select>';
    }

    function SimpleGrid(tableName, pagerName, caption, editCaption, addCaption, url, viewModel, sortField, sessionUrl, authorizedRoles) {
        var tableId = '#' + tableName;
        var $table = $(tableId);
        this.loadComplete = function (data) {
            var thisId = $.jgrid.jqID(this.id);
            $.get(sessionUrl, function (data) {
                if (!_.intersection(authorizedRoles, _.map(data, function (item) {
                    return item.glosarol;
                }))) {
                    $('#add_' + thisId).addClass('ui-disabled');
                    $('#edit_' + thisId).addClass('ui-disabled');
                    $('#del_' + thisId).addClass('ui-disabled');
                }
            });
        }
        this.config = {
            url: url,
            datatype: 'json',
            mtype: 'GET',
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
            sortorder: 'desc',
            shrinkToFit: false,
            styleUI: 'Bootstrap',
            loadComplete: this.loadComplete
        };
        this.filterOptions = {
            stringResult: true,
            searchOperators: true,
            searchOnEnter: false,
            defaultSearch: 'cn'
        };
        this.addErrorTextFormat = function (data) {
            return 'Error: ' + data.responseText
        };
        this.addBeforeShowForm = function (form) {
        };
        this.addBeforeSubmit = function (postdata, formid) {
            //valido formulario
            return [true, '', ''];
        };
        this.addAfterSubmit = function (response, postdata) {
            // var json = response.responseText;
            var result = response.responseJSON;//JSON.parse(json);
            if (result.error != 0) {
                return [false, result.glosa, ""];
            } else {
                // var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"descripcion\",\"op\":\"cn\",\"data\":\"" + postdata.descripcion + "\"}]}";
                // $table.jqGrid('setGridParam', {
                //     search: true,
                //     postData: {
                //         filters
                //     }
                // }).trigger("reloadGrid");
                return [true, "", ""];
            }
        };
        this.editErrorTextFormat = function (data) {
            return 'Error: ' + data.responseText
        };
        this.editBeforeShowForm = function (form) {
            var rowData = $table.getRowData($table.getGridParam('selrow'));
        };
        this.editBeforeSubmit = function (postdata, formid) {
            //valido formulario
            return [true, '', ''];
        };
        this.editAfterSubmit = function (response, postdata) {
            var result = response.responseJSON;//JSON.parse(json);
            if (result.error != 0) {
                return [false, result.glosa, ""];
            } else {
                // var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"descripcion\",\"op\":\"cn\",\"data\":\"" + postdata.descripcion + "\"}]}";
                // $table.jqGrid('setGridParam', {
                //     search: true,
                //     postData: {
                //         filters
                //     }
                // }).trigger("reloadGrid");
                return [true, "", ""];
            }
        };
        this.deleteAfterSubmit = function (response, postdata) {
            var json = response.responseText;
            var result = JSON.parse(json);
            if (!result.success)
                return [false, result.message, ""];
            else
                return [true, "", ""]
        };
        this.navParameters = {
            edit: true,
            add: true,
            del: true,
            search: false,
            view: false
        };
        this.itemTemplate = new ModelItemTemplate(viewModel);
        this.prmEdit = {
            editCaption: editCaption,
            closeAfterEdit: true,
            recreateForm: true,
            mtype: 'POST',
            url: this.config.url,
            ajaxEditOptions: licLibrary.jsonOptions,
            serializeEditData: licLibrary.createJSON,
            template: this.itemTemplate.template,
            beforeShowForm: this.editBeforeShowForm,
            errorTextFormat: this.editErrorTextFormat,
            beforeSubmit: this.editBeforeSubmit,
            afterSubmit: this.editAfterSubmit
        };
        this.prmAdd = {
            addCaption: addCaption,
            closeAfterAdd: true,
            recreateForm: true,
            mtype: 'POST',
            url: this.config.url,
            ajaxEditOptions: licLibrary.jsonOptions,
            serializeEditData: licLibrary.createJSON,
            template: this.itemTemplate.template,
            beforeShowForm: this.addBeforeShowForm,
            errorTextFormat: this.addErrorTextFormat,
            beforeSubmit: this.addBeforeSubmit,
            afterSubmit: this.addAfterSubmit

        };
        this.prmDel = {
            mtype: 'POST',
            url: this.config.url,
            ajaxEditOptions: licLibrary.jsonOptions,
            serializeEditData: licLibrary.createJSON,
            afterSubmit: this.deleteAfterSubmit
        };
        this.build = function () {
            var uno = $table.jqGrid(this.config);
            var filtro = $table.jqGrid('filterToolbar', this.filterOptions);
            var navegador = $table.jqGrid('navGrid', this.config.pager, this.navParameters, this.prmEdit, this.prmAdd, this.prmDel);
        };
        this.addExportButton = function (title, icon, url) {
            $table.jqGrid('navButtonAdd', this.config.pager, {
                caption: '',
                // id: 'download_' + $(targ + '_t_' + parentRowKey).attr('id'),
                buttonicon: icon,
                title: title,
                position: 'last',
                onClickButton: function (e) {
                    try {
                        $table.jqGrid('excelExport', { 'url': url });
                    } catch (e) {
                        console.log('error: ' + e)
                    }
                }
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
})(jQuery, _);