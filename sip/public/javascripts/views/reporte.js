$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var options = {
        chart: {
            renderTo: '',
            type: 'bar'
        },
        title: {
            text: 'Presupuesto'
        },
        subtitle: {
            text: 'Fuente: Sistema de Información Presupuestario'
        },
        xAxis: {
            categories: [],
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
        series: []
    };

    var modelGerencias = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'Gerencia', name: 'nombre', width: 250, align: 'left', search: false, editable: false },
        { label: 'Presupuesto 2016', name: 'ejerciciouno', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
        { label: 'Presupuesto 2017', name: 'ejerciciodos', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
        { label: 'Diferencia', name: 'diferencia', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
        { label: 'Porcentaje', name: 'porcentaje', width: 100, align: 'right', search: false, editable: false }
    ], $grid = $("#grid");

    $grid.jqGrid({
        datatype: 'local',
        //page: 1,
        colModel: modelGerencias,
        //rowNum: 10,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        caption: 'Gerencias',
        viewrecords: false,
        footerrow: true,
        userDataOnFooter: true,
        styleUI: "Bootstrap",
        pager: "#pager",
        pgbuttons: false,
        pgtext: "",
        pginput: false,
        subGrid: true,
        subGridRowExpanded: departamentSubGrid,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        loadError: sipLibrary.jqGrid_loadErrorHandler
    });

    $grid.jqGrid('navGrid', '#pager', { edit: false, add: false, del: false, search: false }, {}, {}, {}, {});
    $grid.jqGrid('navButtonAdd', '#pager', {
        caption: "",
        buttonicon: "glyphicon glyphicon-dashboard",
        title: "Reporte Gerencias",
        position: "last",
        onClickButton: function () {
            PDFObject.embed("/reporte/repo1", "#outerDiv");
        }
    });


    var modelConceptoGasto = [
        { label: 'id', name: 'nombre', key: true, hidden: true },
        { label: 'Concepto Gasto', name: 'nombre', width: 200, align: 'left', search: false },
        { label: 'Presupuesto 2016', name: 'ejerciciouno', width: 100, align: 'right', formatter: 'number', search: false },
        { label: 'Presupuesto 2017', name: 'ejerciciodos', width: 100, align: 'right', formatter: 'number', search: false },
        { label: 'Diferencia', name: 'diferencia', width: 100, align: 'right', formatter: 'number', search: false },
        { label: 'Porcentaje', name: 'porcentaje', width: 100, align: 'right', search: false, stype: "select" }
    ], $gridConceptoGasto = $("#gridConceptoGasto"),
        myDefaultSearch = 'cn',
        getColumnIndex = function (columnIndex) {
            var cm = this.jqGrid('getGridParam', 'colModel'), i, l = cm.length;
            for (i = 0; i < l; i++) {
                if ((cm[i].index || cm[i].name) === columnIndex) {
                    return i; // return el colModel index
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
            var iTemplate = parseInt($('#filterTemplates').val(), 10),
                postData = $gridConceptoGasto.jqGrid('getGridParam', 'postData');
            if (isNaN(iTemplate)) {
                $gridConceptoGasto.jqGrid('setGridParam', { search: false });
            } else if (iTemplate >= 0) {
                $.extend(postData, {
                    filters: JSON.stringify(myDynamicFilterTemplates(iTemplate))
                });
                $gridConceptoGasto.jqGrid('setGridParam', { search: true });
            }
            if (postData)
                paintBar(options, '/reporte/lstConceptoGasto?filters=' + encodeURIComponent(postData.filters));
            $gridConceptoGasto.trigger('reloadGrid', [{ current: true, page: 1 }]);
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
        //viewrecords: true,
        footerrow: true,
        userDataOnFooter: true,
        caption: 'Concepto Gasto',
        styleUI: "Bootstrap",
        //guiStyle: "bootstrap",
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

    fetchGridData();

    function fetchGridData() {
        var categorias = [];
        var serie1 = {};
        var serie2 = {};
        var gridArrayData = [];
        var serie1ArrayData = [];
        var serie2ArrayData = [];

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

                $grid.jqGrid('setGridParam', { data: gridArrayData });
                $grid.jqGrid('footerData', 'set', result.userdata);
                $grid[0].grid.endReq();
                $grid.trigger('reloadGrid');

                options.series[0] = serie1;
                options.series[1] = serie2;
                options.xAxis.categories = categorias;
                options.chart.renderTo = 'grafico_1';
                var chart = new Highcharts.Chart(options);
            }
        });

        paintBar(options, '/reporte/lstConceptoGasto');
    }

});

function paintBar(options, url) {
    var serie1_1 = {};
    var serie2_1 = {};
    var categorias_1 = [];
    var serie1_1ArrayData = [];
    var serie2_1ArrayData = [];

    $.ajax({
        url: url,
        success: function (result) {

            for (var i = 0; i < result.rows.length; i++) {
                var item = result.rows[i];

                serie1_1ArrayData.push(item.ejerciciouno);
                serie2_1ArrayData.push(item.ejerciciodos);
                categorias_1.push(item.nombre)
            }

            serie1_1 = { name: '2016', data: serie1_1ArrayData };
            serie2_1 = { name: '2017', data: serie2_1ArrayData };

            options.series[0] = serie1_1;
            options.series[1] = serie2_1;
            options.xAxis.categories = categorias_1;
            options.chart.renderTo = 'grafico_2';
            var chart1 = new Highcharts.Chart(options);

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
        //guiStyle: "bootstrap",
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
        //guiStyle: "bootstrap",
        footerrow: true,
        userDataOnFooter: true
    });
}