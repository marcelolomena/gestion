$(document).ready(function () {
    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
    var currentYear = (new Date).getFullYear();
    var idcui = 0;
    var data = sipLibrary.currentPeriod();
    var listOfColumnModels = listColumnModels(data);
    var listOfColumnNames = listColumnNames(data);

    var newColModel = [
        { label: 'ID', name: 'idcui', key: true, hidden: true },
        { label: 'CUI Gerencia', name: 'gerencia', width: 150 },
        { label: 'CUI Departamento', name: 'departamento', width: 150 },
        { label: 'CUI Sección', name: 'seccion', width: 150 },
        { label: 'cui', name: 'cui', hidden: true },
        {
            label: 'Estado',
            name: 'diferencia',
            width: 60,
            cellattr: function (rowId, val, rawObject, cm, rdata) {
                var val = rawObject.idcui;
                if (val > 0) {
                    //console.log(val)
                    color = 'green';
                } else {
                    color = 'red';
                }
                return "style='background-color:" + color + "'";
            },
        }
    ], $grid = $("#gridMaster"),
        initDate = function (elem) {
            $(elem).datepicker({
                dateFormat: 'dd-M-yy',
                autoSize: true,
                changeYear: true,
                changeMonth: true,
                showButtonPanel: true,
                showWeek: true
            });
        },
        numberTemplate = {
            formatter: 'number', align: 'right', sorttype: 'number', editable: true/*,
                    searchoptions: { sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'nu', 'nn', 'in', 'ni'] }*/},
        dateTemplate = {
            width: 80, align: 'center', sorttype: 'date',
            formatter: 'date', formatoptions: { newformat: 'd-M-Y' }, editable: true, datefmt: 'd-M-Y',
            editoptions: { dataInit: initDate },
            searchoptions: { sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'], dataInit: initDate }
        },
        yesNoTemplate = {
            align: 'center', editable: true, formatter: 'checkbox',
            edittype: 'checkbox', editoptions: { value: 'Yes:No', defaultValue: 'No' },
            stype: 'select', searchoptions: { sopt: ['eq', 'ne'], value: ':Any;true:Yes;false:No' }
        },
        myDefaultSearch = 'cn',
        getColumnIndex = function (columnIndex) {
            var cm = this.jqGrid('getGridParam', 'colModel'), i, l = cm.length;
            for (i = 0; i < l; i++) {
                if ((cm[i].index || cm[i].name) === columnIndex) {
                    return i; // return the colModel index
                }
            }
            return -1;
        },
        refreshSerchingToolbar = function (myDefaultSearch) {
            var filters, i, l, rules, rule, iCol, cmi, control, tagName,
                $this = $(this),
                postData = $this.jqGrid('getGridParam', 'postData'),
                cm = $this.jqGrid('getGridParam', 'colModel');

            for (i = 0, l = cm.length; i < l; i++) {
                control = $("#gs_" + $.jgrid.jqID(cm[i].name));
                if (control.length > 0) {
                    tagName = control[0].tagName.toUpperCase();
                    if (tagName === "SELECT") { // && cmi.stype === "select"
                        control.find("option[value='']")
                            .attr('selected', 'selected');
                    } else if (tagName === "INPUT") {
                        control.val('');
                    }
                }
            }

            if (typeof (postData.filters) === "string" &&
                typeof (this.ftoolbar) === "boolean" && this.ftoolbar) {

                filters = $.parseJSON(postData.filters);
                if (filters && filters.groupOp === "AND" && typeof (filters.groups) === "undefined") {
                    // only in case of advance searching without grouping we import filters in the
                    // searching toolbar
                    rules = filters.rules;
                    for (i = 0, l = rules.length; i < l; i++) {
                        rule = rules[i];
                        iCol = getColumnIndex.call($this, rule.field);
                        if (iCol >= 0) {
                            cmi = cm[iCol];
                            control = $("#gs_" + $.jgrid.jqID(cmi.name));
                            if (control.length > 0 &&
                                (((typeof (cmi.searchoptions) === "undefined" ||
                                    typeof (cmi.searchoptions.sopt) === "undefined")
                                    && rule.op === myDefaultSearch) ||
                                    (typeof (cmi.searchoptions) === "object" &&
                                        $.isArray(cmi.searchoptions.sopt) &&
                                        cmi.searchoptions.sopt.length > 0 &&
                                        cmi.searchoptions.sopt[0] === rule.op))) {
                                tagName = control[0].tagName.toUpperCase();
                                if (tagName === "SELECT") { // && cmi.stype === "select"
                                    control.find("option[value='" + $.jgrid.jqID(rule.data) + "']")
                                        .attr('selected', 'selected');
                                } else if (tagName === "INPUT") {
                                    control.val(rule.data);
                                }
                            }
                        }
                    }
                }
            }
        },
        templateClosed = {
            groupOp: "AND",
            rules: [
                { field: "closed", op: "eq", data: "true" }
            ]
        },
        templateLastWeek = {
            groupOp: "AND",
            rules: [
                { field: "invdate", op: "ge", "data": "13-Feb-2012" },
                { field: "invdate", op: "le", "data": "16-Feb-2012" }
            ]
        },
        templateLastMonth = {
            groupOp: "AND",
            rules: [
                { field: "invdate", op: "ge", "data": "16-Jan-2012" },
                { field: "invdate", op: "le", "data": "16-Feb-2012" }
            ]
        },
        myFilterTemplateExerciseNames = function (callback) {
            $.getJSON("/hyperion/ejercicios", function (json) {
                callback(json);
            });
        },
        myFilterTemplateLabel = 'Ejercicios:&nbsp;',
        myFilterTemplateNames = ['Cerrado', 'Última semana', 'Último mes'],
        myFilterTemplates = [templateClosed, templateLastWeek, templateLastMonth],
        myDynamicFilterTemplates = function (id) {
            var rule = {
                groupOp: "AND",
                rules: [
                    { field: "idejercicio", op: "eq", data: id }
                ]
            };
            return rule;
        },
        iTemplate,
        cTemplates = myFilterTemplateNames.length,
        templateOptions = '',
        reloadWithNewFilterTemplate = function () {
            var iTemplate = parseInt($('#filterTemplates').val(), 10),
                postData = $grid.jqGrid('getGridParam', 'postData');
            console.log(iTemplate);
            if (isNaN(iTemplate)) {
                $grid.jqGrid('setGridParam', { search: false });
            } else if (iTemplate >= 0) {
                $.extend(postData, {
                    //filters: JSON.stringify(myFilterTemplates[iTemplate])
                    filters: JSON.stringify(myDynamicFilterTemplates(iTemplate))
                });
                $grid.jqGrid('setGridParam', { search: true });
            }
            $grid.trigger('reloadGrid', [{ current: true, page: 1 }]);
        };


    $grid.jqGrid({
        url: '/hyperion/presupuesto',
        datatype: "json",
        colModel: newColModel,
        page: 1,
        rowNum: 20,
        regional: 'es',
        height: 'auto',
        width: 600,
        shrinkToFit: true,
        viewrecords: true,
        //multiselect: true,
        caption: 'Presupuestos para Hyperion',
        styleUI: "Bootstrap",
        onSelectRow: function (rowid, selected) {
            if (rowid != null) {
                var wsParams = { idcui: rowid }
                var rowData = $("#gridMaster").getRowData(rowid);
                var cui = rowData.cui;
                var gridDetailParam = { postData: wsParams };
                $("#gridDetail").jqGrid('setGridParam', gridDetailParam);
                $("#gridDetail").jqGrid('setCaption', 'CUI :: ' + cui);
                $("#gridDetail").trigger("reloadGrid");
            }
        },
        onSortCol: clearSelection,
        onPaging: clearSelection,
        pager: "#pagerMaster",
        toolbar: [true, "top"],
        loadComplete: function () {
            var $this = $(this);

            if (typeof (this.ftoolbar) !== "boolean") {
                // create toolbar if needed
                $this.jqGrid('filterToolbar',
                    { stringResult: true, searchOnEnter: true, defaultSearch: myDefaultSearch });
            }
            refreshSerchingToolbar.call(this, myDefaultSearch);
        }

    });

    $.extend($.jgrid.search, {
        multipleSearch: true,
        multipleGroup: true,
        recreateFilter: true,
        closeOnEscape: true,
        closeAfterSearch: true,
        overlay: 0,
        tmplLabel: myFilterTemplateLabel,
        tmplNames: myFilterTemplateNames,
        tmplFilters: myFilterTemplates
    });
    //$grid.jqGrid('navGrid', '#pagerMaster', { edit: false, add: false, del: false });
    $grid.jqGrid('navGrid', '#pagerMaster', { edit: false, add: false, del: false, search: false }, {}, {}, {}, {});
    $grid.jqGrid('navButtonAdd', '#pagerMaster', {
        caption: "",
        buttonicon: "glyphicon glyphicon glyphicon-cog",
        title: "Procesar Hyperion",
        position: "last",
        onClickButton: function () {
            //var grid = $("#gridMaster");
            var rowKey = $grid.getGridParam("selrow");

            //var grid = $('#gridDetail');
            //var rowKey = grid.getGridParam("selrow");
            var url = '/hyperion/csv';
            $grid.jqGrid('excelExport', { "url": url });

            /*
                        if (!rowKey)
                            alert("No hay filas seleccionadas");
                        else {
                            var selectedIDs = grid.getGridParam("selarrrow");
                            var result = "";
                            for (var i = 0; i < selectedIDs.length; i++) {
                                result += selectedIDs[i] + ",";
                            }
            
                            alert(result);
                        }
            */
        }
    });

    myFilterTemplateExerciseNames(function (retorno) {
        $.each(retorno, function (i, item) {
            templateOptions += '<option value="' + retorno[i].id + '">' +
                retorno[i].glosaejercicio + '</option>';
        });
        $('#t_' + $.jgrid.jqID($grid[0].id)).append('<label for="filterTemplates">' +
            myFilterTemplateLabel + '</label>' +
            '<select id="filterTemplates"><option value="">Sin filtro</option>' +
            templateOptions + '</select>');
        $('#filterTemplates').change(reloadWithNewFilterTemplate).keyup(function (e) {
            // some web browsers like Google Chrome don't fire "change" event
            // if the select will be "scrolled" by keybord. Moreover some browsers
            // like Internet Explorer don't change the select option on pressing
            // of LEFT or RIGHT key. Another web browsers like Google Chrome do this.
            // We make refrech of the grid in any from the cases. If needed one
            // could modify the code to reduce unnneded reloading of the grid,
            // but for the demo with a few local rows it's such optimization
            // isn't really needed
            var keyCode = e.keyCode || e.which;

            if (keyCode === $.ui.keyCode.PAGE_UP || keyCode === $.ui.keyCode.PAGE_DOWN ||
                keyCode === $.ui.keyCode.END || keyCode === $.ui.keyCode.HOME ||
                keyCode === $.ui.keyCode.UP || keyCode === $.ui.keyCode.DOWN ||
                keyCode === $.ui.keyCode.LEFT || keyCode === $.ui.keyCode.RIGHT) {

                reloadWithNewFilterTemplate();
            }
        });
    });


    /*
        for (iTemplate = 0; iTemplate < cTemplates; iTemplate++) {
            templateOptions += '<option value="' + iTemplate + '">' +
                myFilterTemplateNames[iTemplate] + '</option>';
        }
    
        $('#t_' + $.jgrid.jqID($grid[0].id)).append('<label for="filterTemplates">' +
            myFilterTemplateLabel + '</label>' +
            '<select id="filterTemplates"><option value="">Sin filtro</option>' +
            templateOptions + '</select>');
    
    
        $('#filterTemplates').change(reloadWithNewFilterTemplate).keyup(function (e) {
            // some web browsers like Google Chrome don't fire "change" event
            // if the select will be "scrolled" by keybord. Moreover some browsers
            // like Internet Explorer don't change the select option on pressing
            // of LEFT or RIGHT key. Another web browsers like Google Chrome do this.
            // We make refrech of the grid in any from the cases. If needed one
            // could modify the code to reduce unnneded reloading of the grid,
            // but for the demo with a few local rows it's such optimization
            // isn't really needed
            var keyCode = e.keyCode || e.which;
    
            if (keyCode === $.ui.keyCode.PAGE_UP || keyCode === $.ui.keyCode.PAGE_DOWN ||
                keyCode === $.ui.keyCode.END || keyCode === $.ui.keyCode.HOME ||
                keyCode === $.ui.keyCode.UP || keyCode === $.ui.keyCode.DOWN ||
                keyCode === $.ui.keyCode.LEFT || keyCode === $.ui.keyCode.RIGHT) {
    
                reloadWithNewFilterTemplate();
            }
        });
    */
    $("#gridDetail").jqGrid({
        url: '/hyperion/list',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colNames: listOfColumnNames,
        colModel: listOfColumnModels,
        rowNum: 50,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        caption: "CUI :: ",
        pager: "#pagerDetail",
        viewrecords: true,
        rowList: [50, 100, 1000],
        styleUI: "Bootstrap",
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $("#gridDetail").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {
                $("#gridDetail").addRowData("blankRow", { "nombre": "No hay datos" });
            }
        },
        postData: { ano: currentYear, idcui: idcui },
        grouping: true,
        groupingView: {
            groupField: ["cuentacontable"],
            groupColumnShow: [true],
            groupText: ["<b>{0}</b>"],
            groupOrder: ["asc"],
            groupSummary: [true],
            groupCollapse: false
        }, loadComplete: function () {
            gridParentWidth = $(".gcontainer").width();
            $("#gridDetail").jqGrid('setGridWidth', gridParentWidth, true);
        },
    });

    $('#gridDetail').jqGrid('navGrid', '#pagerDetail', {
        edit: false,
        add: false,
        del: false,
        search: false
    },
        {},
        {},
        {},
        { closeAfterSearch: true });

    $('#gridDetail').jqGrid('navButtonAdd', '#pagerDetail', {
        caption: "",
        buttonicon: "glyphicon glyphicon-download-alt",
        title: "Exportar Hyperion",
        position: "last",
        onClickButton: function () {
            var grid = $('#gridDetail');
            var rowKey = grid.getGridParam("selrow");
            var url = '/hyperion/csv';
            $('#gridDetail').jqGrid('excelExport', { "url": url });
        }
    });

    $("#pager_left").css("width", "");

});

function clearSelection() {
    var wsParams = { idcui: 0 }
    var gridDetailParam = { postData: wsParams };
    $("#gridDetail").jqGrid('setGridParam', gridDetailParam);
    $("#gridDetail").jqGrid('setCaption', 'CUI :: none');
    $("#gridDetail").trigger("reloadGrid");
}

function listColumnModels(data) {
    var _listOfColumnModels = [];
    _listOfColumnModels.push({
        name: 'cuentacontable',
        width: 100,
        sortable: true,
        hidden: false,
        search: true,
        searchoptions: { sopt: ["eq", "le", "ge"] }
    });

    _listOfColumnModels.push({
        name: 'gerencia',
        width: 100,
        sortable: true,
        hidden: false,
        search: true,
        stype: 'select',
        searchoptions: {
            sopt: ["eq"],
            dataUrl: '/hyperion/listcui',
            buildSelect: function (response) {
                var data = JSON.parse(response);
                var s = "<select>";
                s += '<option value="0">--Escoger Cui--</option>';
                $.each(data, function (i, item) {
                    s += '<option value="' + data[i].idcui + '">' + data[i].estructuracui.cui + '</option>';
                });
                return s + "</select>";
            }
        },

    });

    _listOfColumnModels.push({
        name: 'departamento',
        width: 100,
        sortable: true,
        hidden: false,
        search: false,
        searchoptions: { sopt: ["eq", "le", "ge"] }
    });

    _listOfColumnModels.push({
        name: 'seccion',
        width: 100,
        sortable: true,
        hidden: false,
        search: false,
        searchoptions: { sopt: ["eq", "le", "ge"] }
    });

    _listOfColumnModels.push({
        name: 'ano',
        width: 100,
        sortable: true,
        hidden: true,
        searchoptions: { searchhidden: true, sopt: ["eq", "le", "ge"] }
    });
    $.each(data, function (i, item) {
        _listOfColumnModels.push({
            name: data[i].toString(),
            width: 100,
            sortable: true,
            hidden: false,
            align: 'right',
            search: false,
            summaryType: 'sum',
            formatter: sipLibrary.currencyFormatter
        });
    });
    return _listOfColumnModels;
}

function listColumnNames(data) {
    var _listOfColumnNames = [];
    _listOfColumnNames.push('Cuenta');
    _listOfColumnNames.push('Gerencia');
    _listOfColumnNames.push('Departamento');
    _listOfColumnNames.push('Sección');
    _listOfColumnNames.push('Periodo');
    $.each(data, function (i, item) {
        _listOfColumnNames.push(data[i].toString().substring(4, 6) + '/' + data[i].toString().substring(0, 4));
    })

    return _listOfColumnNames;
}