function gridEva1(parentRowID, parentRowKey, suffix) {
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

    tmplPF += "<hr style='width:100%;'/>";
    tmplPF += "<div> {sData} {cData}  </div>";
    tmplPF += "</div>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    var childGridURL = "/sic/matriznivel1/" + parentRowKey + "/list";

    var grillapadre = subgrid_id.substring(0, subgrid_id.lastIndexOf("_"));
    //console.log("la grilla padre: " + grillapadre)
    var rowData = $("#" + grillapadre).getRowData(parentRowKey);
    //console.log("la rowData : " + rowData)
    var parentSolicitud = rowData.idsolicitudcotizacion;
    var parentClaseEvaluacionTecnica = rowData.claseevaluaciontecnica;
    console.log("la parentClaseEvaluacionTecnica : " + parentClaseEvaluacionTecnica)
    var colmodel = [];
    $.ajax({
        type: "GET",
        url: "/sic/matriznivel1/" + parentRowKey + "/cols",
        success: function (jsonData) {
            colmodel.push({ label: 'idcriterio', name: 'idcriterioevaluacion', key: true, hidden: true })
            colmodel.push({ label: 'idserviciorequerido', name: 'idserviciorequerido', key: false, hidden: true })
            colmodel.push({ label: 'Criterio', name: 'nombre', key: false, hidden: false })
            colmodel.push({ label: 'Porcentaje', name: 'porcentaje', key: false, hidden: false })
            for (i = 0; i < jsonData.length; i++) {
                colmodel.push({ label: jsonData[i].razonsocial, name: jsonData[i].razonsocial, key: false, hidden: false })
            }


        }
    });
    console.dir(colmodel);


    $('#' + parentRowID).append('<br><table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    setTimeout(function () {
        $("#" + childGridID).jqGrid({
            url: childGridURL,
            mtype: "GET",
            rowNum: 20,
            datatype: "json",
            // caption: 'Evaluación Técnica (Nivel 1)',
            width: null,
            shrinkToFit: true,
            // autowidth: true,  // set 'true' here
            // shrinkToFit: true, // well, it's 'true' by default
            page: 1,
            colModel: colmodel,
            viewrecords: true,
            styleUI: "Bootstrap",
            regional: 'es',
            height: 'auto',
            //pager: "#" + childGridPagerID,
            subGrid: true,
            footerrow: true,
            //userDataOnFooter: true,
            subGridRowExpanded: showSubGridsEva2,
            subGridOptions: {
                plusicon: "glyphicon-hand-right",
                minusicon: "glyphicon-hand-down"
            },
            editurl: '/sic/cotizacionservicio/action',
            gridComplete: function () {
                $.ajax({
                    type: "GET",
                    url: "/sic/matriztotalajustada/" + parentRowKey + "/list",
                    success: function (data) {
                        var elfooter = '<tr role="row" class="jqgrow ui-row-ltr" >'
                            + '<td role=\"gridcell\" style=\"width: 25px;\">&nbsp;</td>'
                            + '<td role=\"gridcell\">&nbsp;</td>'
                            + '<td role=\"gridcell\">Calificación Técnica No Ajustada</td>'
                        jQuery.each(data.rows2[0], function (key, val) {
                            elfooter += '<td role=\"gridcell\">' + val + '</td>'
                        });
                        elfooter += '</tr>'

                        $("[id*='evatec'] .ui-jqgrid-ftable").find('tbody')
                            .append(elfooter
                            );
                        /*
                                                $(".ui-jqgrid-ftable").find('tbody')
                                                    .append(elfooter
                                                    );
                        */
                        var elfooter2 = '<tr role="row" class="jqgrow ui-row-ltr" >'
                            + '<td role=\"gridcell\" style=\"width: 25px;\">&nbsp;</td>'
                            + '<td role=\"gridcell\">&nbsp;</td>'
                            + '<td role=\"gridcell\"><b>Calificación Técnica Ajustada</b></td>'
                        jQuery.each(data.rows[0], function (key, val) {
                            elfooter2 += '<td role=\"gridcell\"><b>' + val.toFixed(2) + '</b></td>'
                        });
                        elfooter2 += '</tr>'

                        $("[id*='evatec'] .ui-jqgrid-ftable").find('tbody')
                            .append(elfooter2
                            );
/*
                        $(".ui-jqgrid-ftable").find('tbody')
                            .append(elfooter2
                            );
*/                            
                        $('.footrow').hide();
                    }
                });
                $("table.ui-jqgrid-htable").css('width','100%');      $("table.ui-jqgrid-btable").css('width','100%');
                $("#" + childGridPagerID+"_left").css("width", "");
           
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
                editCaption: "Modificar Cotización ",
                template: tmplPF,
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                },
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentSolicitud };
                },
            },
            {
                closeAfterAdd: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                addCaption: "Agregar Cotización",
                template: tmplPF,
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                },
                onclickSubmit: function (rowid) {
                    return { parent_id: parentRowKey, idsolicitudcotizacion: parentSolicitud };
                },
                beforeSubmit: function (postdata, formid) {
                    if (parseInt(postdata.idproveedor) == 0) {
                        return [false, "Proveedor: Seleccionar un proveedor", ""];
                    } else {
                        return [true, "", ""]
                    }
                },

            },
            {
                closeAfterDelete: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                addCaption: "Eliminar Respuesta",
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                }, afterSubmit: function (response, postdata) {
                    var json = response.responseText;
                    var result = JSON.parse(json);
                    console.dir(result);
                    if (result.sucess) {
                        return [true, "", ""];
                    } else {
                        return [false, result.error_text, ""];

                    }

                },
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentSolicitud };
                },
            },
            {
                recreateFilter: true
            }
        );
    }, 1000);
    function showSubGridsEva2(subgrid_id, row_id) {
        var nivel = 0;
        $.ajax({
            type: "GET",
            url: '/sic/nivelclase/' + parentClaseEvaluacionTecnica,
            success: function (data) {
                //console.log(data[0].niveles)
                nivel = (data[0].niveles);
            }
        });
        setTimeout(function () {
            if (nivel > 1) {
                gridEva2(subgrid_id, row_id, 'eva2');
            }

        }, 500);
    }


}