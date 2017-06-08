function gridAdjudicados(parentRowID, parentRowKey, suffix) {
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
    tmplPF += "<div class='column-full'><span style='color: red'>*</span>Proveedor {idproveedor}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-full'><span style='color: red'>*</span>Comentario {descripcion}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-full' style='display: none;'>Fecha adjudicación {fechaadjudicacion}</div>";
    tmplPF += "</div>";
    tmplPF += "<div class='form-row', id='mensajefecha'>";
    tmplPF += "<div class='column-full'></div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row' style='display: none;'>";
    tmplPF += "</div>";

    tmplPF += "<hr style='width:100%;'/>";
    tmplPF += "<div> {sData} {cData}  </div>";
    tmplPF += "</div>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    var childGridURL = "/sic/adjudicados/" + parentRowKey + "/list";

    var grillapadre = subgrid_id.substring(0, subgrid_id.lastIndexOf("_"));
    console.log("la grilla padre: " + grillapadre)
    var rowData = $("#" + grillapadre).getRowData(parentRowKey);
    console.log("la rowData : " + rowData)
    var parentSolicitud = rowData.idsolicitudcotizacion;
    var parentClaseEvaluacionTecnica = rowData.claseevaluaciontecnica;
    console.log("la parentClaseEvaluacionTecnica : " + parentClaseEvaluacionTecnica)

    var modelSubcriterios = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'idserviciorequerido', name: 'idserviciorequerido', hidden: true },
        {
            name: 'idproveedor', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/sic/proveedoressugeridosservicio/' + parentRowKey,
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
            label: 'Nombre Proveedor', name: 'proveedor.razonsocial', width: 300, align: 'left', search: true, editable: true,
            editrules: { edithidden: false, required: true }, hidedlg: true
        },
        {
            label: 'Fecha Adjudicación', name: 'fechaadjudicacion', width: 250, align: 'left', search: false,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
            editable: true,
            editoptions: {
                size: 10, maxlengh: 10,

            },
        },
        {
            label: 'Comentario', name: 'descripcion', width: 300, align: 'left', search: false, editable: true,
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
        caption: 'Proveedores Adjudicados',
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
        /*
        subGrid: true,
        subGridRowExpanded: showSubGridsCot3,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        */
        editurl: '/sic/adjudicados/action',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "id": 0, "proveedor.razonsocial": "No hay datos" });
            }
        }
    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            editCaption: "Modificar Nota ",
            template: tmplPF,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentRowKey, abuelo: parentSolicitud };
            },
        },
        {
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agregar Proveedor",
            template: tmplPF,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeShowForm: function (form) {
                var lafechaactual = new Date();
                var elanoactual = lafechaactual.getFullYear();
                var elmesactual = (lafechaactual.getMonth() + 1);
                if (elmesactual < 10) {
                    elmesactual = "0" + elmesactual
                }
                var eldiaactual = lafechaactual.getDate();
                if (eldiaactual < 10) {
                    eldiaactual = "0" + eldiaactual
                }

                var lafechastring = eldiaactual + "-" + elmesactual + "-" + elanoactual
                $('input#fechaadjudicacion').html(lafechastring);
                $('input#fechaadjudicacion').attr('value', lafechastring);
                $('#mensajefecha').html("<div class='column-full'>La adjudicación se guardará con fecha: " + lafechastring + "</div>");

            },
            onclickSubmit: function (rowid) {
                var lafechaactual = new Date();
                var elanoactual = lafechaactual.getFullYear();
                var elmesactual = (lafechaactual.getMonth() + 1);
                if (elmesactual < 10) {
                    elmesactual = "0" + elmesactual
                }
                var eldiaactual = lafechaactual.getDate();
                if (eldiaactual < 10) {
                    eldiaactual = "0" + eldiaactual
                }

                var lafechastring = eldiaactual + "-" + elmesactual + "-" + elanoactual
                return { parent_id: parentRowKey, abuelo: parentSolicitud, fechaadjudicacion: lafechastring };
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
            addCaption: "Eliminar Proveedor",
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
                return { parent_id: parentRowKey, abuelo: parentSolicitud };
            },
        },
        {
            recreateFilter: true
        }
    );


}