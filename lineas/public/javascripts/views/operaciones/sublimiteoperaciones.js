function gridsublimiteoperaciones(parentRowID, parentRowKey, suffix) {
    //console.log('hola');
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

    var oldRadio = ""

    var tmplPF = "<div id='responsive-form' class='clearfix'>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-full'>Pregunta<span style='color:red'>*</span>{ArchivoUpload}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row' style='display: none;'>";
    tmplPF += "</div>";

    tmplPF += "<hr style='width:100%;'/>";
    tmplPF += "<div> {sData} {cData}  </div>";
    tmplPF += "</div>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    var childGridURL = "/getsublimitesoperaciones/" + parentRowKey;

    var modelOperacion = [
        {
            label: 'Id', name: 'Id', index: 'Id', key: true, hidden: true, width: 10,
            editable: true, hidedlg: true, sortable: false, editrules: { edithidden: false },
        },

        { label: 'Tipo Operacion', name: 'TipoOperacion', width: 8, hidden: false, editable: true, align: 'center' },
        { label: 'Nro Producto', name: 'NumeroProducto', width: 8, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
        { label: 'Fecha Otorgamiento', name: 'FechaOtorgamiento', width: 10, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
        //{ label: 'TipoLimite', name: 'Tipolimite', width: 30, hidden: false, search: true, editable: true, editrules: { required: true } },
        {
            label: 'Fecha Prox Vencimiento', name: 'FechaProxVenc', width: 9, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true },
        },
        //{ label: '', name: 'PlazoResudual', width: 30, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Moneda', name: 'Moneda', width: 5, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
        { label: 'Monto Inicial', name: 'MontoInicial', width: 8, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
        { label: 'Monto Actual', name: 'MontoActual', width: 6, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
        // { label: 'Monto Actual Equiv.M /Linea', name: 'MontoActualMLinea', width: 15, hidden: false, search: true, editable: true,align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
        {
            label: 'Monto Actual Equiv. M/N', name: 'MontoActualMNac', width: 10, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 },
        },
    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        rowNum: 100,
        datatype: "json",
        //caption: 'Resumen Sub-Limites',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        page: 1,
        colModel: modelOperacion,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        //pager: "#" + childGridPagerID,
        /*
        subGrid: true,
        subGridRowExpanded: showSubGrids3,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        */

        editurl: '/limite/action3',
        loadComplete: function () {
            
        },

        gridComplete: function () {
            //$("#" + childGridID).css("margin-left", "6px");

            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {
                //$("#" + childGridID).addRowData("blankRow", { "id": 0, "Descripcion": " ", "Aprobado": "0" });
                $("#" + childGridID).parent().parent().remove();
                $("#" + childGridPagerID).hide();

            }
            var rows = $("#" + childGridID).getDataIDs();
            for (var i = 0; i < rows.length; i++) {

                $("#" + childGridID).jqGrid('setRowData', rows[i], false, { background: '#f5f5f5' });

            }


        },
        footerrow: false,

    });

    $("#" + childGridID).jqGrid('setLabel', 'TipoOperacion', '', { 'text-align': 'center' });
    $("#" + childGridID).jqGrid('setLabel', 'NumeroProducto', '', { 'text-align': 'center' });
    $("#" + childGridID).jqGrid('setLabel', 'FechaOtorgamiento', '', { 'text-align': 'center' });
    $("#" + childGridID).jqGrid('setLabel', 'FechaProxVenc', '', { 'text-align': 'center' });
    $("#" + childGridID).jqGrid('setLabel', 'Moneda', '', { 'text-align': 'center' });
    $("#" + childGridID).jqGrid('setLabel', 'MontoInicial', '', { 'text-align': 'center' });
    $("#" + childGridID).jqGrid('setLabel', 'MontoActual', '', { 'text-align': 'center' });
    $("#" + childGridID).jqGrid('setLabel', 'MontoActualMNac', '', { 'text-align': 'center' });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false, add: false, del: false, search: false, refresh: true, view: false, position: "left", cloneToTop: false,
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            width: 800,
            editCaption: "Modificar Pregunta de Evaluación",
            template: tmplPF,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            },
            beforeSubmit: function (postdata, formid) {
                var elporcentaje = parseFloat(postdata.porcentaje);
                //console.log('porcentaje: ' + elporcentaje);
                if (elporcentaje > 100) {
                    return [false, "Porcentaje no puede ser mayor a 100", ""];
                }
                else {
                    return [true, "", ""]
                }
            },
        },
        {
            addCaption: "Agrega Preguntas",
            mtype: 'POST',
            url: '/sic/criteriosevaluacion/action3',
            closeAfterAdd: true,
            recreateForm: true,
            template: tmplPF,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            beforeShowForm: function (form) {
                //$('input#notacriticidad', form).attr('readonly', 'readonly');
            },

            onclickSubmit: function (rowid) {
                return { idclaseevaluaciontecnica: parentbisabuelo, childGridID: childGridID, idcriterioevaluacion2: parentRowKey };
            }

        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Eliminar Pregunta",
            mtype: 'POST',
            url: '/sic/criteriosevaluacion/action3',
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }
        },
        {
            recreateFilter: true
        }
    );

    /*
        function showSubGrids3(subgrid_id, row_id) {
            gridCriterios3(subgrid_id, row_id, 'criterios2');
        }
        */


}