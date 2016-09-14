$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var modelGerencias = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'Gerencia', name: 'nombre', width: 250, align: 'left', search: false, editable: false },
        { label: 'Presupuesto', name: 'ejerciciouno', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
        { label: 'Presupuesto', name: 'ejerciciodos', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
        { label: 'Diferencia', name: 'diferencia', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
        { label: 'Porcentaje', name: 'porcentaje', width: 100, align: 'right', search: false, editable: false }
    ], $grid = $("#grid");

    $grid.jqGrid({
        datatype: 'local',
        page: 1,
        colModel: modelGerencias,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        caption: 'Gerencias',
        viewrecords: true,
        footerrow: true,
        userDataOnFooter: true,
        styleUI: "Bootstrap",
        subGrid: true,
        subGridRowExpanded: departamentSubGrid,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        loadError: sipLibrary.jqGrid_loadErrorHandler
    });


    var modelConceptoGasto = [
        { label: 'id', name: 'nombre', key: true, hidden: true },
        { label: 'Concepto Gasto', name: 'nombre', width: 250, align: 'left', search: false },
        { label: 'Presupuesto', name: 'ejerciciouno', width: 100, align: 'right', formatter: 'number', search: false },
        { label: 'Presupuesto', name: 'ejerciciodos', width: 100, align: 'right', formatter: 'number', search: false },
        { label: 'Diferencia', name: 'diferencia', width: 100, align: 'right', formatter: 'number', search: false },
        { label: 'Porcentaje', name: 'porcentaje', width: 100, align: 'right', search: false, stype: "select" }
    ], $gridConceptoGasto = $("#gridConceptoGasto"),
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
            //console.dir(postData.filters)
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
        myFilterTemplateExerciseNames = function (callback) {
            $.getJSON("/reporte/names", function (json) {
                callback(json);
            });
        },
        myFilterTemplateLabel = 'Gerencias:&nbsp;',
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
        templateOptions = '',
        reloadWithNewFilterTemplate = function () {
            try {
                var iTemplate = parseInt($('#filterTemplates').val(), 10),
                    postData = $gridConceptoGasto.jqGrid('getGridParam', 'postData');
                if (isNaN(iTemplate)) {
                    $gridConceptoGasto.jqGrid('setGridParam', { search: false });
                } else if (iTemplate >= 0) {
                    //console.log("---->>" + JSON.stringify(myDynamicFilterTemplates(iTemplate)));
                    $.extend(postData, {
                        filters: JSON.stringify(myDynamicFilterTemplates(iTemplate))
                    });
                    $gridConceptoGasto.jqGrid('setGridParam', { search: true });
                }
                $gridConceptoGasto.trigger('reloadGrid', [{ current: true, page: 1 }]);
            } catch (e) {
                console.log(e)
            }
        };

    $gridConceptoGasto.jqGrid({
        url: '/reporte/lstConceptoGasto',
        datatype: "json",        
        //datatype: 'local',
        page: 1,
        colModel: modelConceptoGasto,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        //shrinkToFit: true,
        viewrecords: true,
        footerrow: true,
        userDataOnFooter: true,
        caption: 'Concepto Gasto',
        styleUI: "Bootstrap",
        toolbar: [true, "top"],
        loadComplete: function () {
            var $this = $(this);

            if (typeof (this.ftoolbar) !== "boolean") {

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
    });

    myFilterTemplateExerciseNames(function (retorno) {
        $.each(retorno, function (i, item) {
            templateOptions += '<option value="' + retorno[i].cui + '">' +
                retorno[i].nombre + '</option>';
        });

        $('#t_' + $.jgrid.jqID($gridConceptoGasto[0].id)).append('<label for="filterTemplates">' +
            myFilterTemplateLabel + '</label>' +
            '<select id="filterTemplates"><option value="0">Sin filtro</option>' +
            templateOptions + '</select>');
        $('#filterTemplates').change(reloadWithNewFilterTemplate).keyup(function (e) {
            var keyCode = e.keyCode || e.which;

            if (keyCode === $.ui.keyCode.PAGE_UP || keyCode === $.ui.keyCode.PAGE_DOWN ||
                keyCode === $.ui.keyCode.END || keyCode === $.ui.keyCode.HOME ||
                keyCode === $.ui.keyCode.UP || keyCode === $.ui.keyCode.DOWN ||
                keyCode === $.ui.keyCode.LEFT || keyCode === $.ui.keyCode.RIGHT) {

                reloadWithNewFilterTemplate();
            }
        });
    });

    var graphArrayData = [];
    var graph_1ArrayData = [];
    var categorias = [];
    var categorias_1 = [];
    var serie1 = {};
    var serie2 = {};
    var serie1_1 = {};
    var serie2_1 = {};

    fetchGridData();

    function fetchGridData() {
        var gridArrayData = [];
        var grid_1ArrayData = [];
        var serie1ArrayData = [];
        var serie2ArrayData = [];
        var serie1_1ArrayData = [];
        var serie2_1ArrayData = [];

        $grid[0].grid.beginReq();
        $.ajax({
            url: "/reporte/lstGerencias",
            success: function (result) {

                for (var i = 0; i < result.rows.length; i++) {
                    var item = result.rows[i];
                    gridArrayData.push({
                        id: item.id,
                        nombre: item.nombre,
                        ejerciciouno: item.ejerciciouno,
                        ejerciciodos: item.ejerciciodos,
                        diferencia: item.diferencia,
                        porcentaje: item.porcentaje
                    });
                    serie1ArrayData.push(item.ejerciciouno);
                    serie2ArrayData.push(item.ejerciciodos);
                    categorias.push(item.nombre)
                }

                serie1 = { name: '2016', data: serie1ArrayData };
                serie2 = { name: '2017', data: serie2ArrayData };

                graphArrayData.push(serie1)
                graphArrayData.push(serie2)

                $grid.jqGrid('setGridParam', { data: gridArrayData });
                $grid.jqGrid('footerData', 'set', result.userdata);
                $grid[0].grid.endReq();
                $grid.trigger('reloadGrid');


                $('#grafico_1').highcharts({
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: 'Presupuesto'
                    },
                    subtitle: {
                        text: 'Fuente: Sistema de Información Presupuestario'
                    },
                    xAxis: {
                        categories: categorias,
                        title: {
                            text: null
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Monto (Millones)',
                            align: 'high'
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    tooltip: {
                        valueSuffix: ' millones'
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -40,
                        y: 80,
                        floating: true,
                        borderWidth: 1,
                        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                        shadow: true
                    },
                    credits: {
                        enabled: false
                    },
                    series: graphArrayData
                });
            }
        });


        $gridConceptoGasto[0].grid.beginReq();
        $.ajax({
            url: "/reporte/lstConceptoGasto",
            success: function (result) {

                for (var i = 0; i < result.rows.length; i++) {
                    var item = result.rows[i];
                    grid_1ArrayData.push({
                        //id: item.id,
                        nombre: item.nombre,
                        ejerciciouno: item.ejerciciouno,
                        ejerciciodos: item.ejerciciodos,
                        diferencia: item.diferencia,
                        porcentaje: item.porcentaje
                    });
                    serie1_1ArrayData.push(item.ejerciciouno);
                    serie2_1ArrayData.push(item.ejerciciodos);
                    categorias_1.push(item.nombre)
                }

                serie1_1 = { name: '2016', data: serie1_1ArrayData };
                serie2_1 = { name: '2017', data: serie2_1ArrayData };

                graph_1ArrayData.push(serie1_1)
                graph_1ArrayData.push(serie2_1)
/*
                $gridConceptoGasto.jqGrid('setGridParam', { data: grid_1ArrayData });
                $gridConceptoGasto.jqGrid('footerData', 'set', result.userdata);
                $gridConceptoGasto[0].grid.endReq();
                $gridConceptoGasto.trigger('reloadGrid');
*/

                $('#grafico_2').highcharts({
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: 'Concepto Gasto'
                    },
                    subtitle: {
                        text: 'Fuente: Sistema de Información Presupuestario'
                    },
                    xAxis: {
                        categories: categorias_1,
                        title: {
                            text: null
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Monto (Millones)',
                            align: 'high'
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    tooltip: {
                        valueSuffix: ' millones'
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -40,
                        y: 80,
                        floating: true,
                        borderWidth: 1,
                        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                        shadow: true
                    },
                    credits: {
                        enabled: false
                    },
                    series: graph_1ArrayData
                });

            }
        });


    }

    function departamentSubGrid(parentRowID, parentRowKey) {
        var childGridID = parentRowID + "_table";
        var childGridPagerID = parentRowID + "_pager";
        var childGridURL = "/reporte/lstDepartamentos/" + parentRowKey;
        $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

        $("#" + childGridID).jqGrid({
            url: childGridURL,
            mtype: "GET",
            datatype: "json",
            page: 1,
            colModel: [
                { label: 'id', name: 'id', key: true, hidden: true },
                { label: 'Departamento', name: 'nombre', width: 100 },
                { label: 'Presupuesto', name: 'ejerciciouno', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
                { label: 'Presupuesto', name: 'ejerciciodos', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
                { label: 'Diferencia', name: 'diferencia', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
                { label: 'Porcentaje', name: 'porcentaje', width: 100, align: 'right', search: false, editable: false }
            ],
            autowidth: true,
            height: '100%',
            styleUI: "Bootstrap",
            footerrow: true,
            userDataOnFooter: true,
            subGrid: true,
            subGridRowExpanded: serviceSubGrid,
            subGridOptions: {
                plusicon: "glyphicon-hand-right",
                minusicon: "glyphicon-hand-down"
            },
        });
    }

    function serviceSubGrid(parentRowID, parentRowKey) {
        var childGridID = parentRowID + "_table";
        var childGridPagerID = parentRowID + "_pager";
        var childGridURL = "/reporte/lstServices/" + parentRowKey;
        $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

        $("#" + childGridID).jqGrid({
            url: childGridURL,
            mtype: "GET",
            datatype: "json",
            page: 1,
            colModel: [
                { label: 'id', name: 'id', key: true, hidden: true },
                { label: 'Servicio', name: 'nombre', width: 100 },
                { label: 'Presupuesto', name: 'ejerciciouno', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
                { label: 'Presupuesto', name: 'ejerciciodos', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
                { label: 'Diferencia', name: 'diferencia', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
                { label: 'Porcentaje', name: 'porcentaje', width: 100, align: 'right', search: false, editable: false }
            ],
            autowidth: true,
            height: '100%',
            styleUI: "Bootstrap",
            footerrow: true,
            userDataOnFooter: true
        });
    }

});