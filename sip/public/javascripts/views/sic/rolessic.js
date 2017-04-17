$(document).ready(function () {

    var modelRoles = [
        { label: 'id', name: 'uid', key: true, hidden: true },
        {
            label: 'Nombre', name: 'first_name', width: 300, align: 'left',
            search: true, editable: true, hidden: false,
            jsonmap: 'first_name'
        },
        {
            label: 'Apellido', name: 'last_name', width: 300, align: 'left',
            search: true, editable: true, hidden: false,
            jsonmap: 'last_name'
        },
        {
            label: 'Nombre de usuario', name: 'uname', width: 300, align: 'left',
            search: true, editable: true, hidden: false
        },
        {
            label: 'E-mail', name: 'email', width: 300, align: 'left',
            search: true, editable: true, hidden: false
        },
    ];

    $("#table_roles").jqGrid({
        url: '/sic/roles/list',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelRoles,
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
        caption: 'Lista de Usuarios',
        pager: "#pager_roles",
        viewrecords: true,
        rowList: [10, 20, 50,100],
        editurl: '/sic/roles/action',
        styleUI: "Bootstrap",
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }
    });
    $("#table_roles").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $('#table_roles').jqGrid('navGrid', "#pager_roles", { edit: false, add: false, del: false, search: false, refresh: true, view: false, position: "left", cloneToTop: false },
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

    $("#pager_roles_left").css("width", "");

    function showSubGrids(subgrid_id, row_id) {
        gridRoles2(subgrid_id, row_id, 'roles2');
    }
});