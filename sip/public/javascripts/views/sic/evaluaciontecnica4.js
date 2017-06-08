function gridCotizaciones4(parentRowID, parentRowKey, suffix) {
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
    tmplPF += "<div class='column-full'><span style='color: red'>*</span>Pregunta {idcriterioevaluacion3}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-full'><span style='color: red'>*</span>Proveedor {idproveedor}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-full'><span style='color: red'>*</span>Respuesta {respuesta}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-full'>Nota<span style='color:red'>*</span>{nota}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-full'><span style='color: red'>*</span>Comentario {comentario}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row' style='display: none;'>";
    tmplPF += "</div>";

    tmplPF += "<hr style='width:100%;'/>";
    tmplPF += "<div> {sData} {cData}  </div>";
    tmplPF += "</div>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    var childGridURL = "/sic/notaevaluaciontecnica3/" + parentRowKey + "/list";

    var grillapadre = subgrid_id.substring(0, subgrid_id.lastIndexOf("_"));
    //console.log("la grilla padre: " + grillapadre)
    var rowData = $("#" + grillapadre).getRowData(parentRowKey);
    //console.log("la rowData : " + rowData)
    var parentCriterio = rowData.idserviciorequerido;
    //console.log("la parentCriterio : " + parentCriterio)

    var grillaabuelo = grillapadre.substring(0, grillapadre.lastIndexOf("_"));
    grillaabuelo = grillaabuelo.substring(0, grillaabuelo.lastIndexOf("_"));
    //console.log("la grilla abuelo: " + grillaabuelo)
    var rowData2 = $("#" + grillaabuelo).getRowData(parentCriterio);
    //console.log("la rowData2 : " + rowData2)
    var parentClaseEvaluacionTecnica = rowData2.claseevaluaciontecnica;

    //console.log("la parentAbuelo : " + parentClaseEvaluacionTecnica)
    var bisabuelo = rowData.idnotaevaluacion;
    var parenabuelo = rowData2.id
    var parentbisabuelo = rowData.id
    var rowData1000 = $("#" + grillaabuelo).getRowData(bisabuelo);

    //console.log("la PARENABUELO : " + parenabuelo)
    //console.log("la PARENBISABULO : " + bisabuelo)
    //console.dir(rowData1000[0].id)
    var parent_bisabuelo = rowData1000[0].id


    var modelSubcriterios = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'idserviciorequerido', name: 'idserviciorequerido', hidden: true },
        { label: 'idnotaevaluaciontecnica2', name: 'idnotaevaluaciontecnica2', hidden: true },
        {
            name: 'idcriterioevaluacion3', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/sic/criterios3/' + parentRowKey,
                buildSelect: function (response) {
                    var rowKey = $('#' + childGridID).getGridParam("selrow");
                    var rowData = $('#' + childGridID).getRowData(rowKey);
                    var thissid = rowData.idcriterioevaluacion2;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Seleccione criterio a evaluar--</option>';
                    $.each(data, function (i, item) {

                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].pregunta + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].pregunta + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }
        },
        {
            name: 'idproveedor', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/sic/proveedoressugeridosserviciodesdenota2/' + parentRowKey,
                buildSelect: function (response) {
                    var rowKey = $('#' + childGridID).getGridParam("selrow");
                    var rowData = $('#' + childGridID).getRowData(rowKey);
                    var thissid = rowData.idproveedor;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Seleccione Proveedor--</option>';
                    $.each(data, function (i, item) {

                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].razonsocial + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].razonsocial + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }
        },
        {
            label: 'Nombre Criterio', name: 'criterioevaluacion3.pregunta', width: 120, align: 'left', search: true, editable: true,
            editrules: { edithidden: false, required: true }, hidedlg: true
        },
        {
            label: 'Porcentaje', name: 'criterioevaluacion3.porcentaje', width: 50, align: 'left', search: true, editable: true,
            editrules: { edithidden: false, required: true }, hidedlg: true
        },

        {
            label: 'Nombre Proveedor', name: 'proveedor.razonsocial', width: 300, align: 'left', search: true, editable: true,
            editrules: { edithidden: false, required: true }, hidedlg: true
        },



        {
            label: 'Nota', name: 'nota', width: 80, align: 'right',
            search: false, editable: true, hidden: false,
            formatter: 'number', formatoptions: { decimalPlaces: 0 },
            editrules: { required: false },

        },

        {
            label: 'Respuesta', name: 'respuesta', width: 300, align: 'left', search: false, editable: true,
            edittype: 'custom',
            editoptions: {
                custom_element: function (value, options) {
                    var elm = $("<textarea></textarea>");
                    elm.val(value);
                    setTimeout(function () {
                        //tinymce.remove();
                        //var ctr = $("#" + options.id).tinymce();
                        //if (ctr !== null) {
                        //    ctr.remove();
                        //}
                        try {
                            tinymce.remove("#" + options.id);
                        } catch (ex) { }
                        tinymce.init({
                            menubar: false,
                            statusbar: false,
                            selector: "#" + options.id,
                            plugins: "link",
                            height: 200,
                        });
                    }, 50);
                    return elm;
                },
                custom_value: function (element, oper, gridval) {
                    var id;
                    if (element.length > 0) {
                        id = element.attr("id");
                    } else if (typeof element.selector === "string") {
                        var sels = element.selector.split(" "),
                            idSel = sels[sels.length - 1];
                        if (idSel.charAt(0) === "#") {
                            id = idSel.substring(1);
                        } else {
                            return "";
                        }
                    }
                    if (oper === "get") {
                        return tinymce.get(id).getContent({ format: "row" });
                    } else if (oper === "set") {
                        if (tinymce.get(id)) {
                            tinymce.get(id).setContent(gridval);
                        }
                    }
                }
            },
        },

        {
            label: 'Comentario', name: 'comentario', width: 300, align: 'left', search: false, editable: true,
            edittype: 'custom',
            editoptions: {
                custom_element: function (value, options) {
                    var elm = $("<textarea></textarea>");
                    elm.val(value);
                    setTimeout(function () {
                        //tinymce.remove();
                        //var ctr = $("#" + options.id).tinymce();
                        //if (ctr !== null) {
                        //    ctr.remove();
                        //}
                        try {
                            tinymce.remove("#" + options.id);
                        } catch (ex) { }
                        tinymce.init({
                            menubar: false,
                            statusbar: false,
                            selector: "#" + options.id,
                            plugins: "link",
                            height: 200,
                        });
                    }, 50);
                    return elm;
                },
                custom_value: function (element, oper, gridval) {
                    var id;
                    if (element.length > 0) {
                        id = element.attr("id");
                    } else if (typeof element.selector === "string") {
                        var sels = element.selector.split(" "),
                            idSel = sels[sels.length - 1];
                        if (idSel.charAt(0) === "#") {
                            id = idSel.substring(1);
                        } else {
                            return "";
                        }
                    }
                    if (oper === "get") {
                        return tinymce.get(id).getContent({ format: "row" });
                    } else if (oper === "set") {
                        if (tinymce.get(id)) {
                            tinymce.get(id).setContent(gridval);
                        }
                    }
                }
            },
        }

    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        rowNum: 20,
        datatype: "json",
        caption: 'Nota Evaluación Técnica (Nivel 3)',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        page: 1,
        colModel: modelSubcriterios,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,

        editurl: '/sic/notaevaluaciontecnica3/action',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "id": 0, "proveedor.razonsocial": "No hay datos" });
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
            editCaption: "Modificar Nota Respuesta ",
            template: tmplPF,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentRowKey, idnota1: parent_bisabuelo/*, idsolicitudcotizacion: parentSolicitud*/ };
            },
        },
        {
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agregar Nota Respuesta",
            template: tmplPF,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentRowKey, idnota1: parent_bisabuelo/*, idsolicitudcotizacion: parentSolicitud*/ };
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
            addCaption: "Eliminar Nota Respuesta",
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
                return { parent_id: parentRowKey, idnota1: parent_bisabuelo/*, idsolicitudcotizacion: parentSolicitud*/ };
            },
        },
        {
            recreateFilter: true
        }
    );




}