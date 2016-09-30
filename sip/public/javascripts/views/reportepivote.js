$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";


    $.jgrid.no_legacy_api = true;
    $.jgrid.useJSON = true;

    var gridId = 'grid';

    $('#' + gridId).jqGrid({
        url: '/reporte/testtroya',
        mtype: "GET",
        datatype: "json",
        height: 'auto',
        styleUI: "Bootstrap",
        rowNum: 30,
        page: 1,
        rowList: [100, 200, 500],
        colNames: ['ID', 'GERENCIA', 'DEPARTAMENTO', 'SECCION', 'MONTO'],
        colModel: [
            { name: 'id', key: true, hidden: true },
            { name: 'nuevagerencia', width: 250, align: 'left', search: true, editable: false },
            { name: 'nuevodepartamento', width: 250, align: 'left', search: true, editable: false },
            { name: 'seccion', width: 250, align: 'left', search: true, editable: false },
            { name: 'monto', width: 100, align: 'right', search: true, editable: false }
        ],
        pager: '#pager',
        viewrecords: true,
        sortname: 'nuevagerencia',
        grouping: true,
        caption: 'Troya'
    });

    $('tr.ui-jqgrid-labels th div').draggable({
        appendTo: 'body',
        helper: 'clone'
    });

    $('#groups ol').droppable({
        activeClass: 'ui-state-default',
        hoverClass: 'ui-state-hover',
        accept: ':not(.ui-sortable-helper)',
        drop: function (event, ui) {
            var $this = $(this);
            $this.find('.placeholder').remove();
            var groupingColumn = $('<li></li>').attr('data-column', ui.draggable.attr('id').replace('jqgh_' + gridId + '_', ''));
            $('<span class="ui-icon ui-icon-close"></span>').click(function () {
                $(this).parent().remove();
                $('#' + gridId).jqGrid('groupingRemove');
                $('#' + gridId).jqGrid('groupingGroupBy', $('#groups ol li:not(.placeholder)').map(function () { return $(this).attr('data-column'); }).get());
                if ($('#groups ol li:not(.placeholder)').length === 0) {
                    $('<li class="placeholder">Borrar cabeceras</li>').appendTo($this);
                }
            }).appendTo(groupingColumn);
            groupingColumn.append(ui.draggable.text());
            groupingColumn.appendTo($this);
            $('#' + gridId).jqGrid('groupingRemove');
            $('#' + gridId).jqGrid('groupingGroupBy', $('#groups ol li:not(.placeholder)').map(function () { return $(this).attr('data-column'); }).get());
        }
    }).sortable({
        items: 'li:not(.placeholder)',
        sort: function () {
            $(this).removeClass('ui-state-default');
        },
        stop: function () {
            $('#' + gridId).jqGrid('groupingRemove');
            $('#' + gridId).jqGrid('groupingGroupBy', $('#groups ol li:not(.placeholder)').map(function () { return $(this).attr('data-column'); }).get());
        }
    });


});