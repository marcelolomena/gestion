var gridPreguntas = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var $gridTab = $(targ + "_t_" + parentRowKey)
        var tmpl = "<div id='responsive-form' class='clearfix'>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Proveedor<span style='color:red'>*</span>{idproveedor}</div>";
        tmpl += "</div>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Archivo<span style='color:red'>*</span>{fileToUpload}</div>";
        tmpl += "</div>";

        tmpl += "<hr style='width:100%;'/>";
        tmpl += "<div> {sData} {cData}  </div>";
        tmpl += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['id', 'idproveedor', 'Proveedor', 'Tipo', 'Responsable', 'Preguntas', 'Pregunta', 'Respuestas'],
            colModel: [
                { name: 'id', index: 'id', key: true, hidden: true, width: 10, editable: false },
                {
                    name: 'idproveedor', width: 50, search: false, editable: true, hidden: true, jsonmap: "proveedor.id",
                    edittype: "select",
                    editoptions: {
                        dataUrl: '/sic/proveedorespre/' + $("#gridMaster").getRowData(parentRowKey).id,
                        buildSelect: function (response) {
                            var grid = $("#grid");
                            var rowKey = grid.getGridParam("selrow");
                            var rowData = grid.getRowData(rowKey);
                            var thissid = rowData.idproveedor;

                            var data = JSON.parse(response);
                            var s = "<select>";//el default
                            s += '<option value="0">--Escoger Proveedor--</option>';
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
                { name: 'proveedor', width: 250, search: false, editable: false, hidden: false, jsonmap: "proveedor.razonsocial" },
                { name: 'tipo', width: 100, search: false, editable: false, hidden: false },





                { name: 'responsable', width: 100, search: false, editable: true, hidden: false, formatter: returnResponsable, },
                { name: 'pregunta', width: 350, search: false, editable: false, hidden: false },
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
                { name: 'respuesta', width: 350, search: false, editable: false, hidden: false },
            ],
            rowNum: 20,
            pager: '#navGridPre',
            //subGrid: true,
            //subGridRowExpanded: showSubGridsRespuesta,
            //subGridOptions: {
            //    plusicon: "glyphicon glyphicon-hand-right",
            //    minusicon: "glyphicon glyphicon-hand-down"
            //},
            styleUI: "Bootstrap",
            sortname: 'id',
            sortorder: "asc",
            height: "auto",
            autowidth: true,
            shrinkToFit: true,
            //loadonce: true,
            //onSelectRow: editRow,
            //width: 1000,
            //rownumbers: true,
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Preguntas"
        });

        /*
        var lastSelection;

        function editRow(id) {
            if (id && id !== lastSelection) {
                var grid = $gridTab;
                grid.jqGrid('restoreRow', lastSelection);
                grid.jqGrid('editRow', id, { keys: true, focusField: 4 });
                lastSelection = id;
            }
        }*/

        $gridTab.jqGrid('navGrid', '#navGridPre', { edit: false, add: true, del: true, search: false },
            {
            }, {
                addCaption: "Carga Preguntas",
                closeAfterAdd: true,
                recreateForm: true,
                template: tmpl,
                mtype: 'POST',
                url: '/sic/pre/falsa',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                }, beforeSubmit: function (postdata, formid) {
                    if (parseInt(postdata.idproveedor) == 0) {
                        return [false, "Tipo Documento: Debe escoger un Valor", ""];
                    } else {
                        return [true, "", ""]
                    }
                }, afterSubmit: UploadPre

            }, {
                mtype: 'POST',
                url: '/sic/pre/falsa',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                onclickSubmit: function (rowid) {
                    return { idsolicitud: parentRowKey };
                },
                beforeShowForm: function (form) {
                    ret = $gridTab.getRowData($gridTab.jqGrid('getGridParam', 'selrow'));
                    $("td.delmsg", form).html("<b>Usted borrará el proveedor:</b><br><b>" + ret.proveedor + "</b> ?");

                },
                afterSubmit: function (response, postdata) {
                    var json = response.responseText;
                    var result = JSON.parse(json);
                    if (!result.success)
                        return [false, result.message, ""];
                    else
                        return [true, "", ""]
                }
            });

        $gridTab.jqGrid('navButtonAdd', '#navGridPre', {
            caption: "",
            id: "download_" + $(targ + "_t_" + parentRowKey).attr('id'),
            buttonicon: "glyphicon glyphicon-download-alt",
            title: "Generar Documento",
            position: "last",
            onClickButton: function () {
                //var rowKey = $gridTab.getGridParam("selrow");
                //var parentRowData = $("#gridMaster").getRowData(parentRowKey);
                //console.log(parentRowData.idtipo)
                //console.log(parentRowData.idgrupo)
                try {
                    var url = '/sic/descargarespuestas/' + parentRowKey;
                    $gridTab.jqGrid('excelExport', { "url": url });
                } catch (e) {
                    console.log("error: " + e)

                }

            }
        });

    }
}

function UploadPre(response, postdata) {
    //console.log(postdata)
    var data = $.parseJSON(response.responseText);
    if (data.success) {
        if ($("#fileToUpload").val() != "") {
            ajaxDocUpload(data.id, data.idproveedor);
        }
    }

    return [data.success, data.message, data.id];
}

function ajaxDocUpload(id, idproveedor) {
    var dialog = bootbox.dialog({
        title: 'Se inicia la transferencia',
        message: '<p><i class="fa fa-spin fa-spinner"></i> Esto puede durar varios minutos...</p>'
    });
    dialog.init(function () {
        $.ajaxFileUpload({
            url: '/sic/preguntas/upload',
            secureuri: false,
            fileElementId: 'fileToUpload',
            dataType: 'json',
            data: { id: id, idproveedor: idproveedor },
            success: function (data, status) {
                if (typeof (data.success) != 'undefined') {
                    if (data.success == true) {
                        dialog.find('.bootbox-body').html(data.message);
                        $("#preguntas_t_" + id).trigger('reloadGrid');
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

function showSubGridsRespuesta(subgrid_id, row_id) {
    gridRespuestasnew(subgrid_id, row_id, 'respuestas');
}

function gridRespuestasnew(parentRowID, parentRowKey, suffix) {
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

    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Tipo<span style='color:red'>*</span>{tipo}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Pregunta<span style='color:red'>*</span>{pregunta}</div>";
    tmpl += "</div>";


    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Responsable<span style='color:red'>*</span>{idresponsable}</div>";
    tmpl += "</div>";

    tmpl += "<hr style='width:100%;'/>";
    tmpl += "<div> {sData} {cData}  </div>";
    tmpl += "</div>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    console.log("la subgrid_id : " + subgrid_id)
    var parentSolicitud = subgrid_id.split("_")[2]
    console.log("la parentSolicitud : " + parentSolicitud)
    /*
var grillapadre = subgrid_id.substring(0, subgrid_id.lastIndexOf("_"));

console.log("la grilla padre: " + grillapadre)
var rowData = $("#" + grillapadre).getRowData(parentRowKey);
console.log("la rowData : " + rowData)
var parentSolicitud = rowData.idsolicitudcotizacion;
console.log("la parentSolicitud : " + parentSolicitud)
*/

    var childGridURL = "/sic/asignarpreguntas/" + parentRowKey;



    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        datatype: "json",
        mtype: "GET",
        colNames: ['id', 'Proveedor', 'Tipo', 'Responsable', 'Preguntas', 'idresponsable',],
        colModel: [
            { name: 'id', index: 'id', key: true, hidden: true, width: 10, editable: false },
            { name: 'proveedor', width: 300, search: false, editable: false, hidden: false, jsonmap: "proveedor.razonsocial" },
            { name: 'tipo', width: 100, search: false, editable: true, hidden: false },
            { name: 'pregunta', width: 450, search: false, editable: true, hidden: false, edittype: "textarea", editoptions: { rows: "4" } },
            {
                name: 'idresponsable', width: 120, search: false, editable: true, hidden: true, edittype: "select",
                editrules: { edithidden: true },
                editoptions: {
                    dataUrl: '/sic/getresponsablessolicitud/' + parentSolicitud,
                    buildSelect: function (response) {
                        var rowKey = $("#" + childGridID).getGridParam("selrow");
                        var rowData = $("#" + childGridID).getRowData(rowKey);
                        var thissid = rowData.idresponsable;
                        var data = JSON.parse(response);
                        var s = "<select>";
                        s += '<option value="0">--Escoger Responsable--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].uid == thissid) {
                                s += '<option value="' + data[i].uid + '" selected>' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                            } else {
                                s += '<option value="' + data[i].uid + '">' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                            }
                        });
                        return s + "</select>";
                    }
                }
            },
            { name: 'responsable', width: 120, search: false, editable: false, hidden: false, formatter: returnResponsable, },
        ],
        rowNum: 20,
        pager: childGridPagerID,
        styleUI: "Bootstrap",
        sortname: 'id',
        sortorder: "asc",
        height: "auto",
        autowidth: true,
        rownumbers: true,
        onSelectRow: function (id) {
            var getID = $(this).jqGrid('getCell', id, 'id');
        },
        viewrecords: true,
        caption: "Asignación",
        subGrid: true,
        subGridRowExpanded: showSubGridsRespuestanew1,
        subGridOptions: {
            plusicon: "glyphicon glyphicon-hand-right",
            minusicon: "glyphicon glyphicon-hand-down"
        },

    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: true, add: false, del: false, search: false
    },
        {
            editCaption: "Asignar Responsable",
            closeAfterEdit: false,
            recreateForm: true,
            //template: tmpl,
            mtype: 'POST',
            url: '/sic/asignar',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            onclickSubmit: function (rowid) {
                return { idsolicitudcotizacion: parentSolicitud };
            }, beforeSubmit: function (postdata, formid) {
                if (parseInt(postdata.idproveedor) == 0) {
                    return [false, "Tipo Documento: Debe escoger un valor", ""];
                } else {
                    return [true, "", ""]
                }
            },
            beforeShowForm: function (form) {
                $("#tipo", form).attr('readonly', 'readonly');
                $("#pregunta", form).attr('readonly', 'readonly');
            },
        },
        {
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agregar Respuesta",
            template: tmpl,
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
}


function returnResponsable(cellValue, options, rowdata, action) {
    if (rowdata.user != null)
        return rowdata.user.first_name + ' ' + rowdata.user.last_name;
    else
        return '';
}

function showSubGridsRespuestanew1(subgrid_id, row_id) {
    gridRespuestasnew1(subgrid_id, row_id, 'respuestas2');
}

function gridRespuestasnew1(parentRowID, parentRowKey, suffix) {
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

    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Tipo<span style='color:red'>*</span>{tipo}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Pregunta<span style='color:red'>*</span>{pregunta}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Respuesta<span style='color:red'>*</span>{respuesta}</div>";
    tmpl += "</div>";

    tmpl += "<hr style='width:100%;'/>";
    tmpl += "<div> {sData} {cData}  </div>";
    tmpl += "</div>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    console.log("la subgrid_id : " + subgrid_id)
    var parentSolicitud = subgrid_id.split("_")[2]
    console.log("la parentSolicitud : " + parentSolicitud)
    /*
var grillapadre = subgrid_id.substring(0, subgrid_id.lastIndexOf("_"));

console.log("la grilla padre: " + grillapadre)
var rowData = $("#" + grillapadre).getRowData(parentRowKey);
console.log("la rowData : " + rowData)
var parentSolicitud = rowData.idsolicitudcotizacion;
console.log("la parentSolicitud : " + parentSolicitud)
*/

    var childGridURL = "/sic/preguntasresponsablenew/" + parentRowKey;



    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        datatype: "json",
        mtype: "GET",
        colNames: ['id', 'Proveedor', 'Tipo', 'Preguntas', 'idresponsable', 'Responsable', 'Respuestas'],
        colModel: [
            {
                name: 'id', index: 'id', key: true, hidden: true, width: 10, editable: false
            },
            {
                name: 'proveedor', width: 250, search: false, editable: false, hidden: false, jsonmap: "proveedor.razonsocial"
            },
            {
                name: 'tipo', width: 100, search: false, editable: true, hidden: false
            },
            {
                name: 'pregunta', width: 340, search: false, editable: true, hidden: false, edittype: "textarea", editoptions: { rows: "2" }
            },
            {
                name: 'idresponsable', search: false, editable: false, hidden: true,
            },
            { name: 'responsable', width: 110, search: false, editable: false, hidden: false, formatter: returnResponsable, },
            {
                name: 'respuesta', width: 340, search: false, editable: true, hidden: false,
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
                                //plugins: "link",
                                plugins: [
                                    'link print'
                                ],
                                toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
                                toolbar2: 'print preview media | forecolor backcolor emoticons | codesample',
                                image_advtab: true,
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
        ],
        rowNum: 20,
        pager: childGridPagerID,
        styleUI: "Bootstrap",
        sortname: 'id',
        sortorder: "asc",
        height: "auto",
        autowidth: true,
        rownumbers: true,
        onSelectRow: function (id) {
            var getID = $(this).jqGrid('getCell', id, 'id');
        },
        viewrecords: true,
        caption: "Respuestas"

    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: true, add: false, del: false, search: false
    },
        {
            editCaption: "Responder",
            closeAfterEdit: true,
            recreateForm: true,
            template: tmpl,
            mtype: 'POST',
            url: '/sic/responder',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            onclickSubmit: function (rowid) {
                return { idsolicitudcotizacion: parentRowKey };
            }, beforeSubmit: function (postdata, formid) {
                if (postdata.respuesta.lenght == 0) {
                    return [false, "Debe ingresar una respuesta", ""];
                } else {
                    return [true, "", ""]
                }
            },
            beforeShowForm: function (form) {
                $("#tipo", form).attr('readonly', 'readonly');
                $("#pregunta", form).attr('readonly', 'readonly');
            },
        },
        {
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agregar Respuesta",
            template: tmpl,
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
}