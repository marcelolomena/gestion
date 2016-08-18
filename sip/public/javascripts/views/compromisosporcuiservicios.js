function gridServicios(parentRowID, parentRowKey) {
    var tmplP = "<div id='responsive-form' class='clearfix'>";

    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    var childGridURL = "/compromisosporcuiservicios/list/" + parentRowKey;

    var modelcompromisosporcuiservicios = [
        { label: 'id', name: 'Id', key: true, hidden: true },
        {
            label: 'Proveedor', name: 'razonsocial', width: 300, align: 'left',
            search: true, editable: true, hidden: false,
            editrules: { required: true }
        },
        
        {
            label: 'Servicio', name: 'nombre', width: 150, align: 'left',
            search: true, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true }
        },

        {
            label: 'Glosa Servicio', name: 'glosaservicio', width: 150, align: 'left',
            search: true, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true }
        },

        {
            label: 'N° Contrato', name: 'numero', width: 150, align: 'left',
            search: true, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true }
        },

        {
            label: 'N° Solicitud Contrato', name: 'solicitudcontrato', width: 150, align: 'left',
            search: true, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true }
        },
        {
            label: 'Estado Contrato', name: 'estadocontrato', width: 150, align: 'left',
            search: true, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true }
        },
        {
            label: 'Moneda', name: 'glosamoneda', width: 150, align: 'left',
            search: true, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true }
        },

        {
            label: 'Valor Cuota', name: 'valorcuota', width: 150, align: 'left',
            search: true, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true },
            formatter: 'number', 
            formatoptions: { decimalPlaces: 2 },
        },

        {
            label: 'Con IVA', name: 'impuesto', width: 150, align: 'left',
            search: true, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true },
            formatter: function (cellvalue, options, rowObject) {
                var dato = '';
                var val = rowObject.impuesto;
                if (val == 1) {
                    dato = 'Sí';

                } else if (val == 0) {
                    dato = 'No';
                }
                return dato;
            }
        },

        {
            label: 'Factor', name: 'factorimpuesto', width: 150, align: 'left',
            search: true, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true },
            formatter: 'number', 
            formatoptions: { decimalPlaces: 2 },
        },

    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "POST",
        datatype: "json",
        page: 1,
        rowNum: 1000,
        caption: 'Servicios ',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        colModel: modelcompromisosporcuiservicios,
        viewrecords: true,
        styleUI: "Bootstrap",
        subGrid: true,
        subGridRowExpanded: showSubGrids,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        regional: 'es',
        height: 'auto',
        pager: "#" ,
        editurl: '',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "codigoart": "", "nombre": "No hay datos" });
            }
        }
    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: true, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            editCaption: "Modifica Iniciativa Programa",
            template: tmplP,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
        },
        {
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agregar Iniciativa Programa",
            template: tmplP,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Elimina Iniciativa",
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

}
function showSubGrids(subgrid_id, row_id) {
    gridcompromisosporcuiflujos(subgrid_id, row_id, 'compromisosporcuiflujos');
}