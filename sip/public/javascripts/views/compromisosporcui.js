$(document).ready(function () {
    var tmpl = "<div id='responsive-form' class='clearfix'>";

    var modelCompromisosporCui = [
        { label: 'idcui', name: 'idcui', key: true, hidden: true },
        {
            label: 'Nombre', name: 'nombre', width: 600, align: 'left',
            search: true, editable: true, hidden: false,
        },
        
    ];



    $("#table_compromisosporcui").jqGrid({
        url: '/compromisosporcui/list',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelCompromisosporCui,
        rowNum: 1000,
        regional: 'es',
        height: 'auto',
        sortable: "true",
        width: null,
        shrinkToFit: false,
        caption: 'Lista de Compromisos por CUI',
        // autowidth: true,  // set 'true' here
        // shrinkToFit: true, // well, it's 'true' by default
        pager: "#pager_compromisosporcui",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        editurl: '',
        subGrid: true,
        subGridRowExpanded: gridServicios,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }
    });
    $("#table_iniciativa").jqGrid({regional: 'es'},'filterToolbar', {
        stringResult: true, searchOperators: true,
        searchOnEnter: false, defaultSearch: 'cn'
    });

    $('#table_iniciativa').jqGrid({regional: 'es'},'navGrid', "#pager_iniciativa", {
        edit: true, add: true, del: true, search: false, refresh: true,
        view: false, position: "left", cloneToTop: false
    },
        {
            editCaption: "Modifica Iniciativa",
            closeAfterEdit: true,
            recreateForm: true,
            //mtype: 'POST',
            //url: '/iniciativas/update',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }, beforeShowForm: function (form) {
                sipLibrary.centerDialog($('#table_iniciativa').attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#table_iniciativa").attr('id'));
            }
        },
        {
            addCaption: "Agrega Iniciativa",
            closeAfterAdd: true,
            recreateForm: true,
            //mtype: 'POST',
            //url: '/iniciativas/add',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            
        },
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
    
    $("table.ui-jqgrid-htable").css('width','100%');      $("table.ui-jqgrid-btable").css('width','100%');
    $("#pager_iniciativa_left").css("width", "");
});