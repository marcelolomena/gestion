$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";


    $.jgrid.defaults.width = 780;
    $.jgrid.defaults.responsive = true;
    $.jgrid.defaults.styleUI = 'Bootstrap';

    var gridId = 'grid'

    $('#' + gridId).jqGrid({
        url: '/reporte/testtroya',
        mtype: "GET",
        datatype: "json",
        //height: 'auto',
        styleUI: "Bootstrap",
        width: 780,
        height: 250,
        rowNum: 20,
        rowList: [100, 200, 500],
        colNames: ['ID', 'GERENCIA', 'DEPARTAMENTO', 'SECCION', 'MONTO'],
        colModel: [
            { name: 'id', key: true, hidden: true },
            { name: 'nuevagerencia', width: 250, align: 'left', search: false, editable: false, sortable: false },
            { name: 'nuevodepartamento', width: 250, align: 'left', search: false, editable: false, sortable: false },
            { name: 'seccion', width: 250, align: 'left', search: false, editable: false, sortable: false },
            {
                name: 'monto', width: 100, align: 'right', search: false, editable: false, sortable: false,
                summaryTpl: "Sum: {0}", // set the summary template to show the group summary
                summaryType: "sum" // set the formula to calculate the summary type
            }
        ],
        pager: '#pager',
        viewrecords: true,
        //sortname: 'nuevagerencia',
        grouping: true,
        groupingView: {
            groupField: ["nuevagerencia"],
            groupColumnShow: [true],
            groupText: ["<b>{0}</b>"],
            groupOrder: ["asc"],
            groupSummary: [false],
            groupCollapse: false

        },
        caption: 'Troya'
        //footerrow: true, // the footer will be used for Grand Total
        //userDataOnFooter: true, // show custom data from JSON response to the footer - the Grand Total

    });

     $('#' + gridId).jqGrid("navGrid","#pager",{add:false, edit:false, del:false});

    jQuery("#chngroup").change(function () {
        var vl = $(this).val();
        if (vl) {
            if (vl === "clear") {
                $('#' + gridId).jqGrid('groupingRemove', true);
            } else {
                $('#' + gridId).jqGrid('groupingGroupBy', vl);
            }
        }
    });
    /*
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
                //console.log($('#groups ol li:not(.placeholder)').map(function () { return $(this).attr('data-column'); }).get());
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
    */

});