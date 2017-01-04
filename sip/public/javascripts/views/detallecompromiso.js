function gridDetail(parentRowID, parentRowKey) {
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    var templateDetalle = "<div id='responsive-form' class='clearfix'>";

    templateDetalle += "<div class='form-row'>";
    templateDetalle += "<div class='column-three'>Periodo{periodo}</div>";
    templateDetalle += "<div class='column-three'>Neto{valorcuota}</div>";

    templateDetalle += "</div>";

    templateDetalle += "<hr style='width:100%;'/>";
    templateDetalle += "<div> {sData} {cData}  </div>";
    templateDetalle += "</div>";

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    $("#" + childGridID).jqGrid({
        url: '/compromisos/' + parentRowKey,
        mtype: "POST",
        datatype: "json",
        page: 1,
        rowNum: 100,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        shrinkToFit: false,
        caption: 'Compromisos',
        colModel: [
            { label: 'id', name: 'id', key: true, hidden: true },
            {
                label: 'Período', name: 'periodo', width: 100, editable: true,
                editoptions: { size: 10, readonly: 'readonly'}  
            },
            {
                label: 'Neto', name: 'valorcuota', width: 150, editable: true,
                formatter: 'number', formatoptions: { decimalPlaces: 0 }
            },            
            {
                label: 'Caja', name: 'montoorigen', width: 150, editable: false,
                formatter: 'number', formatoptions: { decimalPlaces: 2 },
                editoptions: { size: 10, readonly: 'readonly'} 
            },
            {
                label: 'Impacto Operacional', name: 'costoorigen', width: 200, editable: false,
                formatter: 'number', formatoptions: { decimalPlaces: 2 },
                editoptions: { size: 10, readonly: 'readonly'} 
            }
        ],
        pager: "#" + childGridPagerID,
        //regional: "es",
        rowList: [],
        pgbuttons: false,
        pgtext: null,
        viewrecords: false,
        styleUI: "Bootstrap",
        editurl: '/compromisos/' + parentRowKey + '/action',
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $("#grid").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#grid").addRowData("blankRow", { "periodo": "No hay datos" });
            }
        }
    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: true, add: true, del: true, search: false, refresh: true,
        view: false, position: "left", cloneToTop: false
    },
        {
            editCaption: "Modifica Periodo",
            closeAfterEdit: false,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                var grid = $("#" + childGridID);
                var rowKey = grid.getGridParam("selrow");
                var idxsel = grid.getInd(rowKey);
                var rowData = grid.getRowData(rowKey);
                postdata.idx = idxsel;
                var cuota = new Number(postdata.valorcuota);

                if (isNaN(cuota) || cuota < 0) {
                    return [false, "Debe ingresar un numero y con valor  mayor o igual a 0", ""];
                } else {

                    postdata.montoorigen=cuota*1.19;
                    rowData.montoorigen=cuota*1.19;

                    postdata.costoorigen=cuota + (cuota*0.19*0.77);
                    rowData.costoorigen=cuota + (cuota*0.19*0.77);                   
                }
                return [true, "", ""]
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code == 10)
                     return [false, "Contrato Aprobado, no se puede modificar, ", ""];                
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }           
        },        
        {
            addCaption: "Agrega Periodo",
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: templateDetalle,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },beforeSubmit: function (postdata, formid) {
                var grid = $("#" + childGridID);
                var rowKey = grid.getGridParam("selrow");
                var idxsel = grid.getInd(rowKey);
                var rowData = grid.getRowData(rowKey);
                postdata.idx = idxsel;
                var cuota = new Number(postdata.valorcuota);

                if (isNaN(cuota) || cuota < 0) {
                    return [false, "Debe ingresar un numero y con valor  mayor o igual a 0", ""];
                }            
                return [true, "", ""];
            }, onclickSubmit: function (rowid) {
                var subgrid = $("#" + childGridID);
                var ids = subgrid.jqGrid('getDataIDs');
                var parentTable = "grid_" + parentRowID.split("_")[1] + "_t";
                var parentGrid = $('#' + parentTable);
                var parentRowData = parentGrid.getRowData(parentRowKey);
                
                var extraparam = {
                    pk: parentRowKey,
                    //valorcuota: parentRowData.valorcuota,
                    idmoneda: parentRowData.idmoneda,
                    impuesto: parentRowData.impuesto,
                    factorimpuesto: parentRowData.factorimpuesto
                }             
                return extraparam;
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code == 10){
                    return [false, "Periodo ya existe", ""];
                } else if (result.error_code != 0){
                    return [false, result.error_text, ""];
                }else{
                    return [true, "", ""]
                }
            }, beforeShowForm: function (form) {
                $("#periodo", form).removeAttr("readonly");
                //sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }
        },
        {
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code == 10){
                    return [false, "Periodo ya existe", ""];
                } else if (result.error_code != 0){
                    return [false, result.error_text, ""];
                }else{
                    return [true, "", ""]
                }
            }
        },
        {
            recreateFilter: true
        }
    );

    $('#' + childGridID).closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").css("background-color", "#0431B4");

    $("#" + childGridPagerID + "_left").css("width", "");
}