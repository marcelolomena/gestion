$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
    var $grid = $("#grid");

    var modelsysadmin = [
        { label: 'id', name: 'id', key: true, hidden: true },
        {
            label: 'Nombre', name: 'nombre', hidden: false,
            search: false, editable: false, width: 10, align: 'left'
        },
        {
            label: 'Contenido', name: 'contenido', width: 10, align: 'left',
            search: true, editable: false, hidden: false, jsonmap: "contenido.nombre", stype: 'select',
            searchoptions: {
                dataUrl: '/sysadmin/contenido',
                buildSelect: function (response) {
                    var s = "<select>";
                    s += '<option value="0">--Escoger Contenido--</option>';
                    $.each(response, function (i, item) {
                        s += '<option value="' + response[i].id + '">' + response[i].nombre + '</option>';
                    });
                    return s + "</select>";
                }
            }
        },
        {
            label: 'Sistema', name: 'sistema', hidden: false,
            search: true, editable: false, width: 10, align: 'left',
            jsonmap: "sistema.sistema", stype: 'select',
            searchoptions: {
                dataUrl: '/sysadmin/sistema',
                buildSelect: function (response) {
                    var s = "<select>";
                    s += '<option value="0">--Escoger Sistema--</option>';
                    $.each(response, function (i, item) {
                        s += '<option value="' + response[i].id + '">' + response[i].sistema + '</option>';
                    });
                    return s + "</select>";
                }
            }
        },
        {
            label: 'Titulo', name: 'title', width: 10, align: 'left',
            search: false, editable: false, hidden: false
        },
        {
            label: 'Script', name: 'script', width: 30, align: 'left',
            search: false, editable: false, hidden: false,
            edittype: "textarea"
        },

    ];

    $grid.jqGrid({
        url: '/sysadmin',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelsysadmin,
        rowNum: 25,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        caption: 'Administrador de páginas',
        pager: "#pager",
        viewrecords: true,
        rowList: [10, 100, 500, 1000],
        styleUI: "Bootstrap",
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        editurl: '/sysadmin',
        ajaxSelectOptions: {
            data: {},
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }
    }).jqGrid('filterToolbar', {
        stringResult: true,
        searchOnEnter: true,
        defaultSearch: "cn",
        searchOperators: true,
        beforeSearch: function () {
            var postData = $grid.jqGrid('getGridParam', 'postData');
            console.log(postData)
            var searchData = jQuery.parseJSON(postData.filters);
            for (var iRule = 0; iRule < searchData.rules.length; iRule++) {
                if (searchData.rules[iRule].field === "sistema") {
                    var valueToSearch = searchData.rules[iRule].data;
                    searchData.rules[iRule].field = 'sistema.id'
                } else if (searchData.rules[iRule].field === "contenido") {
                    var valueToSearch = searchData.rules[iRule].data;
                    searchData.rules[iRule].field = 'contenido.id'
                }
            }
            //return false;
            postData.filters = JSON.stringify(searchData);
        },
        afterSearch: function () {

        }
    });

    $("#pager_left").css("width", "");


});