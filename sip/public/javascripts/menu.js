$(document).ready(function () {
    $("#sidebar ul li").click(function (e) {

        var id = $('a', this).attr('id');
        e.stopPropagation();
        e.preventDefault();
        var model = [];
        var turl = '';

        if (id === 'proveedor') {
            model = [
                { label: 'id', name: 'id', key: true, hidden: true },
                { label: 'RUT', name: 'numrut', width: 100, align: 'center', search: false },
                { label: 'Razón Social', name: 'razonsocial', width: 400, align: 'left', search: true },
            ];
            turl = '/proveedoreslist';
        } else if (id === 'iniciativa') {
            model = [
                { label: 'id', name: 'id', key: true, hidden: true },
                { label: 'Art', name: 'codigoart', width: 100, align: 'center', search: false },
                { label: 'Proyecto', name: 'nombreproyecto', width: 400, align: 'left', search: true },
                { label: 'División', name: 'divisionsponsor', width: 200, align: 'left', search: true },
                { label: 'Sponsor', name: 'sponsor1', width: 200, align: 'left', search: true },
                { label: 'Gerente', name: 'gerenteresponsable', width: 200, align: 'left', search: true },
                { label: 'PMO', name: 'pmoresponsable', width: 200, align: 'left', search: true },
            ];
            turl = '/iniciativaslist';
        }

        $('#jqTable').jqGrid("clearGridData");
        $('#jqTable').jqGrid("GridUnload");
        $('#jqTable').remove();
        $('#jqWrapper').empty();

        var table = document.createElement('table');
        table.id = 'jqTable';
        $('#jqWrapper').append(table);

        $("#jqTable").jqGrid({
            url: turl,
            mtype: "GET",
            datatype: "json",
            page: 1,
            colModel: model,
            rowNum: 10,
            regional: 'es',
            height: 'auto',
            autowidth: true,
            shrinkToFit: false,
            caption: 'Lista de proveedores',
            pager: "#jqPager",
            viewrecords: true,
            rowList: [5, 10, 20, 50]
        });
        //$("#jqPager").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });
        //$("#jqWrapper").show();
        /*
        $table.jqGrid('setGridParam', {
            url: turl,
            colModel: model,
            datatype: "json"
        }).trigger("reloadGrid");
        */
    });
});