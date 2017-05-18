function gridEva1E(parentRowID, parentRowKey, suffix) {
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
    var childGridURL = "/sic/matrizeco/" + parentRowKey + "/list";

    var grillapadre = subgrid_id.substring(0, subgrid_id.lastIndexOf("_"));
    //console.log("la grilla padre: " + grillapadre)
    var rowData = $("#" + grillapadre).getRowData(parentRowKey);
    //console.log("la rowData : " + rowData)
    var parentSolicitud = rowData.idsolicitudcotizacion;
    var colmodel = [];
    $.ajax({
        type: "GET",
        url: "/sic/matrizeco/" + parentRowKey + "/cols",
        success: function (jsonData) {
            colmodel.push({ label: ' ', name: ' ', key: false, hidden: false })
            colmodel.push({ label: 'Moneda', name: 'moneda', key: false, hidden: false })

            for (i = 0; i < jsonData.length; i++) {
                colmodel.push({ label: jsonData[i].razonsocial, name: jsonData[i].razonsocial, key: false, hidden: false })
            }


        }
    });
    console.dir(colmodel);


    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    setTimeout(function () {
        $("#" + childGridID).jqGrid({
            url: childGridURL,
            mtype: "GET",
            rowNum: 20,
            datatype: "json",
            caption: 'Evaluación Económica',
            //width: null,
            //shrinkToFit: false,
            autowidth: true,  // set 'true' here
            shrinkToFit: true, // well, it's 'true' by default
            page: 1,
            colModel: colmodel,
            viewrecords: true,
            styleUI: "Bootstrap",
            regional: 'es',
            height: 'auto',
            footerrow: true,
            //pager: "#" + childGridPagerID,

            editurl: '/sic/cotizacionservicio/action',
            gridComplete: function () {
                $.ajax({
                    type: "GET",
                    url: "/sic/matriztotaleco/" + parentRowKey + "/list",
                    success: function (data) {
                        console.log(data.rows[0])


                        //$("#" + childGridID).jqGrid('footerData', 'set', data.rows[0]);


                        var elfooter = '<tr role="row" class="jqgrow ui-row-ltr" >'
                            + '<td role=\"gridcell\">&nbsp;</td>'
                            + '<td role=\"gridcell\"><b>Calificación Económica Ajustada</b></td>'
                        jQuery.each(data.rows[0], function (key, val) {
                            elfooter += '<td role=\"gridcell\"><b>' + val.toFixed(2) + '</b></td>'
                        });
                        elfooter += '</tr>'

                        $("[id*='evaeco'] .ui-jqgrid-ftable").find('tbody')
                            .append(elfooter
                            );
/*
                        $(".ui-jqgrid-ftable").find('tbody')
                            .append(elfooter
                            );
*/
                    }
                });
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


}