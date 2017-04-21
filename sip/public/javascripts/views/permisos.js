$(document).ready(function () {

    var modelPermisos = [
        { label: 'id', name: 'id', key: true, hidden: true },
        {
            label: 'Glosa rol', name: 'glosarol', width: 300, align: 'left',
            search: true, editable: true, hidden: false,
            jsonmap: 'glosarol'
        }
    ];

    $("#grid").jqGrid({
        url: '/permisos/list',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelPermisos,
        rowNum: 20,
        regional: 'es',
        height: 'auto',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        subGrid: true,
        subGridRowExpanded: showSubGrids,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        caption: 'Lista de Roles',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        editurl: '/permisos/action',
        styleUI: "Bootstrap",
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }
    });
    $("#grid").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $('#grid').jqGrid('navGrid', "#pager", { edit: false, add: false, del: false, search: false, refresh: true, view: false, position: "left", cloneToTop: false },
        {
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }
        },
        {
            recreateFilter: true
        }
    );

    $("#pager_left").css("width", "");

    function showSubGrids(subgrid_id, row_id) {
        gridPermisos2(subgrid_id, row_id, 'permisos2');
    }
});