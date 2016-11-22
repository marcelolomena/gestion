$(document).ready(function () {

    $.get('/sic/getsession', function (data) {
       console.log('ROL : ' + data);
    });

    var solicitudcotizacionModel = [
        { label: 'ID', name: 'id', key: true, hidden: true },
        { label: 'Descripción', name: 'descripcion', width: 150 },
    ], $grid = $("#gridMaster");

    $grid.jqGrid({
        url: '/sic/solicitudcotizacion/list',
        datatype: "json",
        colModel: solicitudcotizacionModel,
        page: 1,
        rowNum: 20,
        regional: 'es',
        height: 'auto',
        width: 600,
        shrinkToFit: true,
        viewrecords: true,
        caption: 'Solicitud de Cotización',
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