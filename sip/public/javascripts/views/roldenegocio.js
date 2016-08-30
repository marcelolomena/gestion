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
        {
            label: 'Rol de Negocio', name: 'rolnegocio', width: 300, align: 'left',
            search: true, editable: true, hidden: false
        },
        {
            label: 'ID Delegado', name: 'uiddelegado', width: 300, align: 'left',
            search: true, editable: true, hidden: true
        },
        {
            label: 'Delegado', name: 'nombredelegado', width: 300, align: 'left',
            search: true, editable: true, hidden: false
        },
    ];

    $("#table_roldenegocio").jqGrid({
        url: '/roldenegocio/list',
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
        caption: 'Lista de Usuarios',
        pager: "#pager_roldenegocio",
        viewrecords: true,
        rowList: [10, 20, 50,100],
        editurl: '/roles/action',
        styleUI: "Bootstrap",
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }
    });
    $("#table_roldenegocio").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $('#table_roldenegocio').jqGrid('navGrid', "#pager_roldenegocio", { edit: false, add: false, del: false, search: false, refresh: true, view: false, position: "left", cloneToTop: false },
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

    $("#pager_roldenegocio_left").css("width", "");

    
});