function gridcompromisosporcuiflujos(parentRowID, parentRowKey, suffix) {
    var subgrid_id = parentRowID;
    var row_id = parentRowKey;
    var subgrid_table_id, pager_id, toppager_id;
    subgrid_table_id = subgrid_id + '_t';
    pager_id = 'p_' + subgrid_table_id;
    toppager_id = subgrid_table_id + '_toppager';
    if (suffix) {
        subgrid_table_id += suffix;
        pager_id += suffix;
    }

    var template = "<div id='responsive-form' class='clearfix'>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    var childGridURL = "/compromisosporcuiflujos/list/" + parentRowKey;

    var modelflujos = [
        {
            label: 'id',
            name: 'id',
            key: true,
            hidden: true
        },
        {
            label: 'Periodo', name: 'periodo', width: 100, align: 'left',
            search: true, editable: true, hidden: false,
            editrules: { required: true },
        },

        {
            label: 'Monto Origen', name: 'montoorigen', width: 100, align: 'left',
            search: true, editable: true, hidden: false,
            editrules: { required: true },
            formatter: 'number', 
            formatoptions: { decimalPlaces: 2 },
        },

    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "POST",
        datatype: "json",
        // caption: 'Flujo',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        page: 1,
        rowNum: 10,
        rowList: [5, 10, 20, 50],
        sortable: "true",
        colModel: modelflujos,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,
        editurl: '',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {
                $("#" + childGridID).addRowData("blankRow", { "id": 0, "beneficioscuantitativos": "No hay datos", "porcentaje1": " ", "porcentaje2": " ", "dolar": " ", "uf": " " });
            }
        }
    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false, add: false, del: false, search: false, refresh: true, view: false, position: "left", cloneToTop: false
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            editCaption: "Modificar Presupuesto Iniciativa",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            
        },
        {
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agregar Presupuesto Iniciativa",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Eliminar Presupuesto Iniciativa",
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
        },
        {
            recreateFilter: true
        }
    );
}
