function gridClausulas(parentRowID, parentRowKey, suffix) {
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
    tmplPF += "<div class='column-four'><span style='color: red'>*</span>Código {codigo}</div>";
    tmplPF += "<div class='column-five'><span style='color: red'>*</span>Título {nombrecorto}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-half'><span style='color: red'>*</span>Grupo {idgrupo}</div>";
    tmplPF += "<div class='column-half'><span style='color: red'>*</span>Tipo {idtipoclausula}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row' id='elradio'>";
    tmplPF += "<div class='column-full'><span style='color: red'>*</span>Crítica {critica}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-full'><span style='color: red'>*</span>Glosa Cláusula {glosaclausula}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row' style='display: none;'>";
    tmplPF += "</div>";

    tmplPF += "<hr style='width:100%;'/>";
    tmplPF += "<div> {sData} {cData}  </div>";
    tmplPF += "</div>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    var childGridURL = "/sic/catalogoclausulas2/" + parentRowKey + "/list";

    var modelCatClausulas = [
        { label: 'id', name: 'id', key: true, hidden: true },

        {
            label: 'Código', name: 'codigo', width: 60, align: 'left', search: false, editable: true,
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("00.00", { placeholder: "__.__" });
                }
            },
            editrules: { required: true }
        },
        { label: 'Título', name: 'nombrecorto', width: 200, align: 'left', search: false, editable: true, editrules: { required: true } },
        {
            label: 'Grupo', name: 'idgrupo', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/sic/grupoclausula',
                buildSelect: function (response) {
                    var rowKey = $("#" + childGridID).getGridParam("selrow");
                    var rowData = $("#" + childGridID).getRowData(rowKey);
                    var thissid = rowData.idgrupo;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Seleccione un Grupo--</option>';
                    $.each(data, function (i, item) {

                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {

                        var elgrupo = $('option:selected', this).val();
                        //var oldRadio = $("#elradio").html();
                        console.log("radio despues: " + oldRadio);


                        if (parseInt(elgrupo) != 15) {
                            console.log("aqui estoy");

                            $("#elradio").html("");
                        } else {
                            $("#elradio").html(oldRadio);
                        }


                    }
                }]
            }
        },
        { label: 'Grupo', name: 'grupo.nombre', width: 150, editable: true, editoptions: { size: 10 } },
        {
            label: 'Tipo', name: 'idtipoclausula', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/sic/tipoclausula',
                buildSelect: function (response) {
                    var rowKey = $("#" + childGridID).getGridParam("selrow");
                    var rowData = $("#" + childGridID).getRowData(rowKey);
                    var thissid = rowData.idgrupo;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Seleccione un Tipo--</option>';
                    $.each(data, function (i, item) {

                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }
        },
        { label: 'Tipo', name: 'tipo.nombre', width: 70, editable: true, editoptions: { size: 10 } },
        {
            label: 'Glosa Cláusula', name: 'glosaclausula', width: 600, align: 'left', search: false, editable: true,
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
                            height: 300,
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
            label: 'Crítica', name: 'critica', width: 60,
            search: false, editable: true, hidden: false,
            //editrules: { required: true },
            edittype: "custom",
            editoptions: {
                custom_value: sicLibrary.getRadioElementValue,
                custom_element: sicLibrary.radioElemCritica
            },
            formatter: function (cellvalue, options, rowObject) {
                var dato = '';
                var val = rowObject.critica;
                if (val == 1) {
                    dato = 'Sí';

                } else if (val == 0) {
                    dato = 'No';
                }
                return dato;
            }
        },

    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        rowNum: 20,
        datatype: "json",
        caption: 'Catálogo de Cláusulas',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        page: 1,
        colModel: modelCatClausulas,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        checkOnUpdate: true,
        pager: "#" + childGridPagerID,
        editurl: '/sic/catalogoclausulas2/action',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "id": 0, "glosaclausula": "No hay datos" });
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
            width: 800,
            editCaption: "Modificar Plantilla Cláusula",
            template: tmplPF,
            checkOnUpdate: true,
            saveData: "¿Desea guardar los cambios antes de salir?",
            bYes: "Sí",
            bNo: "",
            bExit: "No",
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            },
            afterShowForm: function (form) {
                oldRadio = $("#elradio").html();
                console.log("radio antes: " + oldRadio);
                var rowKey = $("#" + childGridID).getGridParam("selrow");
                var rowData = $("#" + childGridID).getRowData(rowKey);
                var thissid = rowData.idgrupo;
                if (parseInt(thissid) != 15) {
                    $("#elradio").html("");
                } else {
                    $("#elradio").html(oldRadio);
                }


            },
            beforeSubmit: function (postdata, formid) {
                if (postdata.idtipoclausula == 0) {
                    return [false, "Tipo Clausula: Campo obligatorio", ""];
                } if (postdata.idgrupo == 0) {
                    return [false, "Grupo Clausula: Campo obligatorio", ""];
                } else {
                    return [true, "", ""]
                }
            }
        },
        {
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            width: 800,
            checkOnUpdate: true,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agregar Plantilla Cláusula",
            template: tmplPF,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentRowKey };
            },
            beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            },
            afterShowForm: function (form) {
                oldRadio = $("#elradio").html();
                console.log("radio antes: " + oldRadio);
            },
            beforeSubmit: function (postdata, formid) {
                if (postdata.idtipoclausula == 0) {
                    return [false, "Tipo Clausula: Campo obligatorio", ""];
                } if (postdata.idgrupo == 0) {
                    return [false, "Grupo Clausula: Campo obligatorio", ""];
                } else {
                    return [true, "", ""]
                }
            }
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Eliminar Plantilla Cláusula",
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }
        },
        {
            recreateFilter: true
        }
    );
}