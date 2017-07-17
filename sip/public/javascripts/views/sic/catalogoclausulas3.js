function gridCuerpos(parentRowID, parentRowKey, suffix) {
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
    tmplPF += "<div class='column-full'><span style='color: red'>*</span>Título {titulo}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-full'><span style='color: red'>*</span>Glosa {glosa}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-full'><span style='color: red'>*</span>Grupo {idgrupo}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-full' id='d_titulo'>Anexo<span style='color:red'>*</span>{anexo}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-full'><span style='color: red'>*</span>Tipo Adjunto {tipoadjunto}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row' id='modificar'>";
    tmplPF += "<div class='column-full' id='archivoactual'>Archivo Actual{nombreadjunto}</div>";
    tmplPF += "<div class='column-full' id='tablaactual'>Tabla Actual{nombreadjunto}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row' id='subirarchivo'>";
    tmplPF += "<div class='column-full'  >Subir Archivo {fileToUpload}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row' id='latabla'>"
    tmplPF += "<div class='column-full' >Elegir Tabla {elegirtabla}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row' >";

    tmplPF += "</div>";

    tmplPF += "<div class='form-row' style='display: none;'>";
    tmplPF += "</div>";

    tmplPF += "<hr style='width:100%;'/>";
    tmplPF += "<div> {sData} {cData}  </div>";
    tmplPF += "</div>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    var childGridURL = "/sic/catalogoclausulas3/" + parentRowKey + "/list";

    var modelCatClausulas = [
        { label: 'id', name: 'id', key: true, hidden: true },

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
                }
            }
        },
        { label: 'Grupo', name: 'valore.nombre', width: 150, editable: true, editoptions: { size: 10 } },

        { label: 'Título', name: 'titulo', width: 200, align: 'left', search: false, editable: true, editrules: { required: true } },
        {
            label: 'Glosa', name: 'glosa', width: 400, align: 'left', search: false, editable: true,
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
            name: 'fileToUpload',
            hidden: true,
            editable: true,
            edittype: 'file',
            editrules: { edithidden: true },
            editoptions: {
                enctype: "multipart/form-data"
            },
            search: false
        },
        {
            name: 'elegirtabla', index: 'elegirtabla', hidden: true, width: 100, align: "left", editable: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/sic/parametros/tablaanexo',
                buildSelect: function (response) {
                    var rowKey = $("#" + childGridID).getGridParam("selrow");
                    var rowData = $("#" + childGridID).getRowData(rowKey);
                    var thissid = rowData.nombreadjunto;
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger una Tabla--</option>';
                    $.each(data, function (i, item) {

                        if (data[i].nombre == thissid) {
                            s += '<option value="' + data[i].nombre + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].nombre + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }
        },
        
        {
            name: 'tipoadjunto', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/sic/parametros/tipoadjunto',
                buildSelect: function (response) {
                    var rowKey = $("#" + childGridID).getGridParam("selrow");
                    var rowData = $("#" + childGridID).getRowData(rowKey);
                    var thissid = rowData.tipoadjunto;
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger un Tipo--</option>';
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
                        var tipoadjunto = $('option:selected', this).text();
                        console.log(tipoadjunto);

                        if (tipoadjunto == "Archivo") {
                            $("#latabla").css("display", "none");
                            $("#subirarchivo").css("display", "block");

                            $("#elegirtabla").css("display", "none");
                            $("#fileToUpload").css("display", "block");

                        } else {
                            if (tipoadjunto == "Tabla") {
                                $("#subirarchivo").css("display", "none");
                                $("#latabla").css("display", "block");

                                $("#fileToUpload").css("display", "none");
                                $("#elegirtabla").css("display", "block");
                            }

                        }

                    }
                }],
            }
        },
        {
            label: 'Tipo Adjunto', name: 'nombretipoadjunto.nombre', hidden: false, width: 100, align: "left", editable: true,
            editoptions: {
                custom_element: labelEditFunc,
                custom_value: getLabelValue
            }
        },
        {
            label: 'Nombre Adjunto', name: 'nombreadjunto', hidden: false, width: 100, align: "left", editable: true,
            formatter: function (cellvalue, options, rowObject) { return returnDocLink(cellvalue, options, rowObject); },
            editoptions: {
                custom_element: labelEditFunc,
                custom_value: getLabelValue
            }
        },
{
            label: 'Anexo', name: 'anexo', width: 60, align: 'left',
            search: true, editable: true, hidden: false,
            edittype: "custom",
            editoptions: {
                custom_value: sipLibrary.getRadioElementValue,
                custom_element: sipLibrary.radioElemAnexo
            },
            formatter: function (cellvalue, options, rowObject) {
                var dato = '';
                var val = rowObject.anexo;
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
        caption: 'Cuerpo de Cláusulas',
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
        editurl: '/sic/catalogoclausulas3/action',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "id": 0, "codigo": "No hay datos" });
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
            editCaption: "Modificar Cuerpo Cláusula",
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
                $("#modificar").show();
                setTimeout(function () {
                    //$("#tipoadjunto", form).attr('disabled', 'disabled');
                }, 250);
                $('input#nombreadjunto', form).attr('readonly', 'readonly');

                var rowKey = $("#" + childGridID).getGridParam("selrow");
                var rowData = $("#" + childGridID).getRowData(rowKey);
                var thissid = rowData.tipoadjunto;


                if (thissid == 47) {
                    $("#tablaactual").hide();
                    $("#archivoactual").show();
                    var archivo = rowData.nombreadjunto;
                    $("#archivoactual").html("Archivo Actual: " + archivo)
                    $("#latabla").css("display", "none");
                    $("#elegirtabla").css("display", "none");
                    $("#subirarchivo").css("display", "block");
                    $("#fileToUpload").css("display", "block");


                } else {
                    if (thissid == 48) {
                        $("#archivoactual").hide();
                        $("#tablaactual").hide();
                        //var tabla = rowData.nombreadjunto;
                        //$("#tablaactual").html("Tabla Actual: " + tabla)
                        $("#subirarchivo").css("display", "none");
                        $("#fileToUpload").css("display", "none");
                        $("#latabla").css("display", "block");
                        $("#elegirtabla").css("display", "block");

                    }
                }
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


            }, afterSubmit: UploadDoc



        },
        {
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            width: 800,
            checkOnUpdate: true,
            saveData: "¿Desea guardar los cambios antes de salir?",
            bYes: "Sí",
            bNo: "",
            bExit: "No",
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agregar Cuerpo Cláusula",
            template: tmplPF,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentRowKey };
            },
            beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                $("#modificar").hide();
                $("#subirarchivo").css("display", "none");
                $("#latabla").css("display", "none");
                $("#elegirtabla").css("display", "none");
                $("#fileToUpload").css("display", "none");
            },


            afterShowForm: function (form) {
                oldRadio = $("#elradio").html();
                console.log("radio antes: " + oldRadio);
            },
            afterSubmit: UploadDoc
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Eliminar Cuerpo Cláusula",
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }
        },
        {
            recreateFilter: true
        }
    );


    function labelEditFunc(value, opt) {
        return "<span>" + value + "</span";
    }
    function getLabelValue(e, action, textvalue) {
        if (action == 'get') {

            return e.innerHTML;
        } else {
            if (action == 'set') {
                $(e).html(textvalue);

            }

        }
    }
    function UploadDoc(response, postdata) {

        var data = $.parseJSON(response.responseText);
        //console.log(data)
        if (data.success) {
            if ($("#fileToUpload").val() != "") {
                ajaxDocUpload(data.id);
            }
        }

        return [data.success, data.message, data.id];
    }

    function ajaxDocUpload(id) {
        //console.log(id)
        var dialog = bootbox.dialog({
            title: 'Se inicia la transferencia',
            message: '<p><i class="fa fa-spin fa-spinner"></i> Esto puede durar varios minutos...</p>'
        });
        dialog.init(function () {
            $.ajaxFileUpload({
                url: '/sic/catalogoclausulas/upload',
                secureuri: false,
                fileElementId: 'fileToUpload',
                dataType: 'json',
                data: { id: id },
                success: function (data, status) {
                    if (typeof (data.success) != 'undefined') {
                        if (data.success == true) {
                            dialog.find('.bootbox-body').html(data.message);
                            $("#" + childGridID).trigger('reloadGrid');
                        } else {
                            dialog.find('.bootbox-body').html(data.message);
                        }
                    }
                    else {
                        dialog.find('.bootbox-body').html(data.message);
                    }
                },
                error: function (data, status, e) {
                    dialog.find('.bootbox-body').html(e);
                }
            })
        });
    }
    function returnDocLink(cellValue, options, rowdata) {
        if (rowdata.tipoadjunto == 47) {
            return "<a href='/docs/anexosclausulas/" + rowdata.nombreadjunto + "' >" + rowdata.nombreadjunto + "</a>";
        } else {
            return rowdata.nombreadjunto
        }

    }
}
