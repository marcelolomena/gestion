$(document).ready(function () {

    $.get('/sic/getsession', function (data) {
       console.log('ROL : ' + data);
    });

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
                    color = 'green';
                } else {
                    color = 'red';
                }
                return "style='background-color:" + color + "'";
            },
        }
    ], $grid = $("#gridMaster");

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
        caption: 'Presupuestos para Hyperion',
        styleUI: "Bootstrap",
        onSelectRow: function (rowid, selected) {
            if (rowid != null) {
                console.log("rowid : " + rowid)
                var wsParams = { idcui: rowid }
                var rowData = $("#gridMaster").getRowData(rowid);
                var cui = rowData.cui;
                var gridDetailParam = { postData: wsParams };
                console.dir(gridDetailParam)
            }
        },
        pager: "#pagerMaster"
    });

    function clearSelection() {
        var wsParams = { idcui: 0 }
        var gridDetailParam = { postData: wsParams };
    }

    $('.active[data-toggle="ctm"]').each(function (e) {
        var $this = $(this),
            loadurl = $this.attr('href'),
            targ = $this.attr('data-target');

        $.get(loadurl, function (data) {
            $(targ).html(data);
        });

        $this.tab('show');
        return false;
    });

    $('[data-toggle="ctm"]').click(function (e) {
        var $this = $(this),
            loadurl = $this.attr('href'),
            targ = $this.attr('data-target');

        $.get(loadurl, function (data) {
            $(targ).html(data);
        });

        $this.tab('show');
        return false;
    });
})