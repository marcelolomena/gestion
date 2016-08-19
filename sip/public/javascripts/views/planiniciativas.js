$(document).ready(function () {
    var tmpl = "<div id='responsive-form' class='clearfix'>";

    var modelPlanIniciativas = [
        { label: 'id', name: 'id', key: true, hidden: true },
        {
            label: 'C. ART', name: 'codigoart', width: 75, align: 'left',
            search: true, editable: true, hidden: false,
        },
        {
            label: 'Nombre', name: 'nombre', width: 200, align: 'left',
            search: true, editable: true, hidden: false,
        },
        {
            label: 'Estado', name: 'estado', width:110, align: 'left',
            search: true, editable: true, hidden: false,
        },
        {
            label: 'C Total Est US$', name: 'costototalestimadoUS', width: 90, align: 'left',
            search: true, editable: true, hidden: false,
            formatter: 'number',
            formatoptions: { decimalPlaces: 0 },
        },
        {
            label: 'Pres Aprob US$', name: 'pptoaprobadodolares', width: 90, align: 'left',
            search: true, editable: true, hidden: false,
            formatter: 'number',
            formatoptions: { decimalPlaces: 0 },
        },
        {
            label: 'Q Prop', name: 'QPROPUESTODIVOT', width: 50, align: 'left',
            search: true, editable: true, hidden: false,
        },
        {
            label: 'Sponsor Gerente Responsable', name: 'nombregerente', width: 100, align: 'left',
            search: true, editable: true, hidden: false,
        },
        {
            label: 'PMO Responsable', name: 'nombrepmo', width: 100, align: 'left',
            search: true, editable: true, hidden: false,
        },
        {
            label: 'Año inicio previsto', name: 'anoinicioprevisto', width: 100, align: 'left',
            search: true, editable: true, hidden: true,
        },
        {
            label: 'Mes inicio previsto', name: 'mesinicioprevisto', width: 100, align: 'left',
            search: true, editable: true, hidden: true,
        },
        {
            label: 'Julio', name: 'JULIO', width: 80, align: 'left',
            search: true, editable: true, hidden: false,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
        },
        {
            label: 'Agosto', name: 'AGOSTO', width: 80, align: 'left',
            search: true, editable: true, hidden: false,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
        },
        {
            label: 'Septiembre', name: 'SEPTIEMBRE', width: 80, align: 'left',
            search: true, editable: true, hidden: false,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
        },
        {
            label: 'Octubre', name: 'OCTUBRE', width: 80, align: 'left',
            search: true, editable: true, hidden: false,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
        },
        {
            label: 'Noviembre', name: 'NOVIEMBRE', width: 80, align: 'left',
            search: true, editable: true, hidden: false,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
        },
        {
            label: 'Diciembre', name: 'DICIEMBRE', width: 80, align: 'left',
            search: true, editable: true, hidden: false,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
        },
        {
            label: '2017', name: '2017', width: 80, align: 'left',
            search: true, editable: true, hidden: false,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
        },

        
    ];
    $("#table_planiniciativas").jqGrid({
        url: '/planiniciativas/list',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelPlanIniciativas,
        rowNum: 1000,
        regional: 'es',
        height: 'auto',
        caption: 'Plan Iniciativas',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        pager: "#pager_planiniciativas",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        editurl: '',
        styleUI: "Bootstrap",
        
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }
    });

    $('#table_planiniciativas').jqGrid('navGrid', "#pager_planiniciativas", {
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
                sipLibrary.centerDialog($('#table_planiniciativas').attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#table_planiniciativas").attr('id'));
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
    $("#pager_planiniciativas").css("width", "");
});