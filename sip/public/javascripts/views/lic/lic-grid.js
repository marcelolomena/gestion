(function ($, _) {
    'use strict';
    $.fn.datepicker.defaults.format = "dd-mm-yyyy";
    moment.defaultFormat = 'DD-MM-YYYY'

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

    function decoraleLabel(item) {
        if (item.editrules && item.editrules.required) {
            return item.label + '<span style="color:red">*</span>';
        } else {
            return item.label;
        }

    }

    function ModelItemTemplate(model) {
        var result = '<div id="responsive-form" class="clearfix">';
        var editables = _.filter(model, function (item) {
            return item.editable && !item.zsHidden;
        })
        var left = true;
        _.each(editables, function (item, key) {
            if (item.editoptions && item.editoptions.fullRow) {
                result += '<div class="form-row">';
                result += '<div  id="d_' + item.name + '">' + decoraleLabel(item) + '{' + item.name + '}</div>';
                result += '</div>';
                left = true;
            } else
                if (left) {
                    result += '<div class="form-row">';
                    result += '<div class="column-half" id="d_' + item.name + '">' + decoraleLabel(item) + '{' + item.name + '}</div>';
                    left = false;
                } else {
                    result += '<div class="column-half" id="d_' + item.name + '">' + decoraleLabel(item) + '{' + item.name + '}</div>';
                    result += '</div>';
                    left = true;
                }
        });
        result += '<hr style="width:100%"/>';
        result += '<div> {sData} {cData} </div>';
        result += '</div>';
        var hiddens = _.filter(model, function (item) {
            return item.zsHidden;
        });
        _.each(hiddens, function (item) {
            result += '<div style="display: none;">{' + item.name + '}</div>';
        });

        this.template = result;
    }

    function TabTemplate(parentRowID, parentRowKey, tabs) {
        
        var nav = "<br><ul class='nav nav-tabs tabs-up' id='myTab'>";
        var pane = "<div class='tab-content'>";
        var paneClass, navClass;
        var activo = '';
        _.each(tabs, function (item, key) {
            // console.log (parentRowID)
             
            paneClass = key ? 'tab-pane' : 'tab-pane active';
            
            if (paneClass === 'tab-pane active')
                {activo = "active show";}
            nav += '<li class="nav-item" data-toggle="tab"><a class="nav-link '+ activo+' " href="/lic/' + item.id + '/' + parentRowKey + '" data-target="#' + item.id + '" id="' + item.id + '_tab_' + parentRowKey + '" data-toggle="tab_' + parentRowKey + '">' + item.nom + '</a></li>';
            activo = '';
            pane += '<div class="tab-pane ' + paneClass + '" id="' + item.id + '"><div class="container-fluid"><table id="' + item.id + '_t_' + parentRowKey + '"></table><div id="navGrid' + item.id + '"></div></div></div>';
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
            if (item) {
                selected = item.id == selectedId ? '" selected>' : '">';
                s += '<option value="' + item.id + selected + item.nombre + '</option>';
            }
        });
        this.template = s + '</select>';
    }

    function SelectTemplateIdCompra(data, caption, selectedId) {
        selectedId = selectedId || 0;
        var s = '<select><option value="">--' + caption + '--</option>';
        var selected;
        _.each(data, function (item, key) {
            if (item) {
                selected = item.id == selectedId ? '" selected>' : '">';
                // s += '<option value="' + item.id + selected + item.id + '</option>';
                s += '<option value="' + item.id + selected + 'Contrato: ' + item.contrato + ' - OrdenCompra: ' + item.ordenCompra + ' - FechaCompra: ' + item.fechaCompra + ' - Factura: ' + item.factura + '</option>';
            }
        });
        this.template = s + '</select>';
    }

    function SimpleGrid(tableName, pagerName, caption, editCaption, addCaption, url, viewModel, sortField, sessionUrl, authorizedRoles) {
        var tableId = '#' + tableName;
        var $table = $(tableId);
        var _grid = this;
        this.dataRows = [];
        this.parentRowData = {};
        this.loadComplete = function (data) {
            _grid.dataRows = data.rows;
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
            rowList: [10, 20, 30, 40, 50],
            sortname: sortField,
            caption: caption,
            regional: 'es',
            height: 'auto',
            width: null,
            shrinkToFit: true,
            viewrecords: true,
            gridComplete: function () {
                $("table.ui-jqgrid-htable").css('width','100%'); $('#' + pagerName+"_left").css("width", ""); $("table.ui-jqgrid-btable").css('width','100%');
            },
            page: 1,
            forceFit: true,
            hidegrid: false,
            viewrecords: true,
            restoreCellonFail : true,
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
        this.errorTextFormat = function (data) {
            return 'Error: ' + data.responseText
        };
        this.beforeShowForm = function (form) {
            console.log('beforeShowForm');
        };
        this.afterShowForm = function (form) {
            console.log('afterShowForm');
        };
        this.afterComplete = function (response, postdata, formid, a) {
            console.log('afterComplete');
        };
        this.onInitializeForm = function (formid) {
            console.log('onInitializeForm');
        };
        this.beforeSubmit = function (postdata, formid) {
            console.log('beforeSubmit');
            //valido formulario
            return [true, '', ''];
        };

        this.beforeSubmitDel = function (postdata, formid) {
            console.log('beforeSubmit');
            //valido formulario
            return [true, '', ''];
        };
        this.afterSubmit = function (response, postdata) {
            console.log('afterSubmit');
            var result = response.responseJSON;//JSON.parse(json);
            if (result && result.error != 0) {
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
            var result = JSON.parse(response.responseText);
            // console.log(result);
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
            afterShowForm: this.editAfterShowForm,
            afterComplete: this.afterComplete,
            errorTextFormat: this.errorTextFormat,
            beforeSubmit: this.editBeforeSubmit,
            afterSubmit: this.editAfterSubmit,
            onInitializeForm: this.onInitializeForm
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
            beforeShowForm: this.beforeShowForm,
            errorTextFormat: this.addErrorTextFormat,
            beforeSubmit: this.beforeSubmit,
            afterSubmit: this.afterSubmit,
            onInitializeForm: this.onInitializeForm

        };
        this.prmDel = {
            mtype: 'POST',
            url: this.config.url,
            ajaxEditOptions: licLibrary.jsonOptions,
            serializeEditData: licLibrary.createJSON,
            afterSubmit: this.deleteAfterSubmit,
            beforeSubmit: this.beforeSubmitDel
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
        this.getRowData = function (rowid) {
            return _.find(_grid.dataRows, function (item) {
                return item.id === parseInt(rowid);
            });
        }
    }

    function StackGrid(tableName, pagerName, caption, editCaption, addCaption, url, viewModel, sortField, sessionUrl, authorizedRoles, showChildGrid) {
        var ar = arguments;
        SimpleGrid.call(this, tableName, pagerName, caption, editCaption, addCaption, url, viewModel, sortField, sessionUrl, authorizedRoles, showChildGrid);
        var tableId = '#' + tableName;
        this.config.subGrid = true;
        this.config.subGridOptions = {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        };
        this.config.subGridRowExpanded = function (divid, rowid) {
            showChildGrid(divid, rowid);
        };
        this.config.subGridBeforeExpand = function (divid, rowid) {
            var expanded = $('td.sgexpanded', tableId)[0];
            if (expanded) {
                setTimeout(function () {
                    $(expanded).trigger('click');
                }, 100);
            }
        };
    }

    function TabGrid(tableName, pagerName, caption, editCaption, addCaption, url, viewModel, sortField, sessionUrl, authorizedRoles, showChildGrid, tabs) {
        var ar = arguments;
        StackGrid.call(this, tableName, pagerName, caption, editCaption, addCaption, url, viewModel, sortField, sessionUrl, authorizedRoles, showChildGrid);
        this.config.subGridRowExpanded = function (divid, rowid) {
            showChildGrid(divid, rowid, tabs);
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
        SimpleGrid: SimpleGrid,
        StackGrid: StackGrid,
        TabGrid: TabGrid,
        SelectTemplateIdCompra: SelectTemplateIdCompra

    });
})(jQuery, _);