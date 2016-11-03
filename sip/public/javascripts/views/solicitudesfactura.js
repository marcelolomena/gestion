function gridSolicitudes(parentRowID, parentRowKey) {
    var tmplP = "<div id='responsive-form' class='clearfix'>";

    tmplP += "<div class='form-row'>";
    tmplP += "<div class='column-half'>Priorización{priorizacion}</div>";
    tmplP += "<div class='column-half'>Criterio Rechazo{idcriteriorechazo}</div>";
    tmplP += "</div>";

    tmplP += "<div class='form-row' style='display: none;'>";
    tmplP += "<div class='column-half'>estado {estado}</div>";
    tmplP += "<div class='column-half'>categoria {categoria}</div>";
    tmplP += "<div class='column-half'>subcategoria {subcategoria}</div>";
    tmplP += "<div class='column-half'>pmoresponsable {pmoresponsable}</div>";
    tmplP += "<div class='column-half'>gerenteresponsable {gerenteresponsable}</div>";
    tmplP += "<div class='column-half'>divisionsponsor {divisionsponsor}</div>";
    tmplP += "</div>";

    tmplP += "<hr style='width:100%;'/>";
    tmplP += "<div> {sData} {cData}  </div>";
    tmplP += "</div>";

    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    var childGridURL = "/solicitudesporfactura/" + parentRowKey;

    var modelSolicitudes = [
        { label: 'Id', name: 'id', width: 50, key: true, hidden: false, search: false },  
        { label: 'Glosa Servicio',
            name: 'glosaservicio',
            width: 400,
            align: 'left',
            search: false,
            editable: true,
            editoptions: { size: 10, readonly: 'readonly'}                       
        },  
        { label: 'Monto Aprobado',
                     name: 'montoaprobado',
                     width: 100,
                     search: false,
                     align: 'left',
                     editable: true,
                     formatter: 'number', formatoptions: { decimalPlaces: 2 }
                   },
                   { label: 'Glosa Aprobación',
            name: 'glosaaprobacion',
            width: 200,
            search: false,
            align: 'left',
            editable: true,
            edittype: "textarea"
        },
        { label: 'Descuento',
                     name: 'montomulta',
                     width: 80,
                     search: false,
                     align: 'left',
                     editable: true,
                     formatter: 'number', formatoptions: { decimalPlaces: 2 }
                   },  
                   { label: 'Glosa Multa',
            name: 'glosamulta',
            width: 200,
            search: false,
            align: 'left',
            editable: true,
            edittype: "textarea"
        },     
        
        
    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "POST",
        datatype: "json",
        page: 1,
        caption: 'Items',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        colModel: modelSolicitudes,
        viewrecords: true,
        styleUI: "Bootstrap",
        subGrid: true,
        subGridRowExpanded: gridDesglose,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,
        editurl: '/iniciativaprograma/action',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "codigoart": "", "nombre": "No hay datos" });
            }
        }
    });

    $("#" + childGridID).jqGrid('filterToolbar', {
        stringResult: true, searchOperators: true,
        searchOnEnter: false, defaultSearch: 'cn'
    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false, add: false, del: false, search: false, refresh: true, view: false, position: "left", cloneToTop: false
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
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    $.ajax({
                        type: "GET",
                        url: '/actualizamontos/' + parentRowKey,
                        async: false,
                        success: function (data) {
                            return [true, "", ""]
                        }
                    });
                return [true, "", ""]
            },
            beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));

                setTimeout(function () {
                    var grid = $("#" + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thisiddivision = rowData.iddivision;
                    var thisprogramid = rowData.program_id;

                    $.ajax({
                        type: "GET",
                        url: '/programas/' + thisiddivision,
                        success: function (data) {
                            var s = "<select>";//el default
                            s += '<option value="0">--Escoger Programa--</option>';
                            $.each(data, function (i, item) {
                                //console.log('comparando program_id que viene '+data[i].program_id+' con program_id que tengo '+thisprogramid);
                                if (data[i].program_id == thisprogramid) {
                                    s += '<option value="' + data[i].program_id + '" selected>' + data[i].program_name + '</option>';
                                    //console.log('lo encontre');
                                } else {
                                    s += '<option value="' + data[i].program_id + '">' + data[i].program_name + '</option>';
                                    //console.log('no lo encontre');
                                }
                            });
                            s += "</select>";
                            $("select#program_id").html(s);
                        }
                    });
                    
                }, 500);

                $('input#codigoart', form).attr('readonly', 'readonly');
            },
            afterShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }
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
            onclickSubmit: function (rowid) {
                return { parent_id: parentRowKey };
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    $.ajax({
                        type: "GET",
                        url: '/actualizamontos/' + parentRowKey,
                        async: false,
                        success: function (data) {
                            return [true, "", ""]
                        }
                    });
                return [true, "", ""]
            },
            beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            },
            afterShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }
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
