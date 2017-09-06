(function ($) {

    var populateSelect = function (data, caption, selectedId) {
        var s = '<select><option value="0">--' + caption + '--</option>';
        var selected;
        $.each(data, function (i, item) {
            selected = item.id == selectedId ? '" selected>' : '">';
            s += '<option value="' + item.id + selected + item.nombre + '</option>';
        });
        return s + '</select>';
    };

    var initGrid = function(_url, _colModel,_sortname )
    {
        var $grid = $('#gridMaster');
        $grid.jqGrid({
            url: _url,
            datatype: "json",
            mtype: "GET",
            colModel: _colModel,
            page: 1,
            rowNum: 10,
            regional: 'es',
            height: 'auto',
            autowidth: true,
            sortname: _sortname,
            sortorder: "desc",
            shrinkToFit: false,
            forceFit: true,
            viewrecords: true,
            caption: 'Inventario de licencias',
            styleUI: "Bootstrap",
            pager: "#pagerMaster",
        });

        $grid.jqGrid('filterToolbar', {
            stringResult: true,
            searchOperators: true,
            searchOnEnter: false,
            defaultSearch: 'cn'
        });

        $grid.jqGrid('navGrid', '#pagerMaster', {
            edit: true,
            add: true,
            del: true,
            search: false
        });

    };

    $(function () {
        var licenciasModel = [{
            name: 'id',
            key: true,
            hidden: true
        }, {
            label: 'Fabricante',
            name: 'fabricante',
        }, {
            label: 'Software',
            name: 'software',
        }, {
            label: '¿Donde está instalada?',
            name: 'tipoInstalacion',
        }, {
            label: 'Clasificacion',
            name: 'clasificacion',
        }, {
            label: 'Tipo de Licenciamiento',
            name: 'tipoLicenciamiento',
        }, {
            label: 'Cantidad Lic. Compradas',
            name: 'licStock',
        }, {
            label: 'Licencias Disponibles',
            name: 'licDisponibles',
        }, {
            label: 'Alerta de Renovación',
            name: 'alertaRenovacion',
        }, {
            name: 'utilidad',
            hidden: true
        }, {
            name: 'comentarios',
            hidden: true
        }];

        
        initGrid('/lic/grid_inventario', licenciasModel,'fabricante' );
    })
})(jQuery);