var gridDoc = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var $gridTab = $(targ + "_t_" + parentRowKey)
        console.log(targ + "_t_" + parentRowKey)

        var tmpl = "<div id='responsive-form' class='clearfix'>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Tipo<span style='color:red'>*</span>{idtipodocumento}</div>";
        tmpl += "</div>";

        tmpl += "<div class='form-row', id='laplantilla'>";

        tmpl += "</div>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-half'>Nombre Documento<span style='color:red'>*</span>{nombrecorto}</div>";
        tmpl += "<div class='column-half'>Responsable<span style='color:red'>*</span>{nombreresponsable}</div>";
        tmpl += "</div>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Descripción<span style='color:red'>*</span>{descripcionlarga}</div>";
        tmpl += "</div>";

        tmpl += "<div class='form-row', id='elarchivo'>";
        tmpl += "<div class='column-full'>Archivo Actual<span style='color:red'>*</span>{nombrearchivo}</div>";
        tmpl += "</div>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Subir Archivo<span style='color:red'>*</span>{fileToUpload}</div>";
        tmpl += "</div>";

        tmpl += "<hr style='width:100%;'/>";
        tmpl += "<div> {sData} {cData}  </div>";
        tmpl += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['Doc', 'Nombre Documento', 'Descripción', 'Tipo', 'Tipo', 'Responsable', 'Archivo', 'Archivo'],
            colModel: [
                {
                    name: 'id', index: 'id', key: true, hidden: true, width: 10,
                    editable: true, hidedlg: true, sortable: false, editrules: { edithidden: false },
                },

                { name: 'nombrecorto', index: 'nombrecorto', width: 50, align: "left", editable: true },

                {
                    name: 'descripcionlarga', index: 'descripcionlarga', width: 100, hidden: true,
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
                                    plugins: "link"
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
                    editable: true, editrules: { edithidden: true }
                },
                { name: 'tipodocumento.nombrecorto', width: 50, editable: false, align: "left", hidden: false },

                {
                    name: 'idtipodocumento', search: false, editable: true, hidden: true,
                    edittype: "select",
                    editoptions: {
                        dataUrl: '/sic/gettipodocumentos',
                        buildSelect: function (response) {
                            var rowKey = $gridTab.getGridParam("selrow");
                            var rowData = $gridTab.getRowData(rowKey);
                            var thissid = rowData.idtipodocumento;
                            var data = JSON.parse(response);
                            var s = "<select>";
                            s += '<option value="0">--Escoger un Tipo--</option>';
                            $.each(data, function (i, item) {

                                if (data[i].id == thissid) {
                                    s += '<option value="' + data[i].id + '" selected>' + data[i].nombrecorto + '</option>';
                                } else {
                                    s += '<option value="' + data[i].id + '">' + data[i].nombrecorto + '</option>';
                                }
                            });
                            return s + "</select>";
                        },
                        dataEvents: [{
                            type: 'change', fn: function (e) {
                                var nombretipodocumento = $('option:selected', this).text();
                                var idtipodocumento = $('option:selected', this).val();

                                $.ajax({
                                    type: "GET",
                                    url: '/sic/getplantillatipo/' + idtipodocumento,
                                    async: false,
                                    success: function (data) {
                                        if (data.length > 0 && data[0].nombrearchivo != null) {
                                            $("#laplantilla").empty().html("<div class='column-full'>Plantilla: <a href='/docs/tipodocumento/" + data[0].nombrearchivo + "'>" + data[0].nombrearchivo + "</a></div>");
                                            //$("input#program_id").val(data[0].nombrearchivo);
                                        } else {
                                            $("#laplantilla").empty().html("<div class='column-full'><span>Tipo de Documento no tiene plantilla</span></div>");
                                        }
                                    }
                                });




                            }
                        }],
                    }
                },


                { name: 'nombreresponsable', index: 'nombreresponsable', width: 100, align: "left", editable: true },
                {
                    name: 'nombrearchivo', index: 'nombrearchivo', hidden: false, width: 100, align: "left", editable: true,
                    editoptions: {
                        custom_element: labelEditFunc,
                        custom_value: getLabelValue
                    },
                    formatter: function (cellvalue, options, rowObject) { return returnDocLinkDoc(cellvalue, options, rowObject, parentRowKey); },
                    unformat: function (cellvalue, options, rowObject) { return returnDocLinkDoc2(cellvalue, options, rowObject, parentRowKey); },

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
                }
            ],
            rowNum: 20,
            pager: '#navGrid',
            subGrid: true,
            subGridRowExpanded: showSubGridaprobaciondoc,
            subGridOptions: {
                plusicon: "glyphicon glyphicon-hand-right",
                minusicon: "glyphicon glyphicon-hand-down"
            },
            styleUI: "Bootstrap",
            sortname: 'id',
            sortorder: "asc",
            height: "auto",
            //shrinkToFit: true,
            //autowidth: true,
            width: 1200,
            rownumbers: true,
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
                var recs = $gridTab.getGridParam("reccount");
                var thisId = $.jgrid.jqID(this.id);
                $.ajax({
                    type: "GET",
                    url: '/sic/documentousuario/' + getID,
                    async: false,
                    success: function (data) {
                        var validado = data.validado
                        console.log(validado)
                        if (validado != "1") {
                            //("#add_" + thisId).addClass('ui-disabled');
                            $("#edit_" + thisId).addClass('ui-disabled');
                            $("#del_" + thisId).addClass('ui-disabled');
                            //$("#refresh_" + thisId).addClass('ui-disabled');
                        } else {
                            //$("#add_" + thisId).removeClass('ui-disabled');
                            $("#edit_" + thisId).removeClass('ui-disabled');
                            $("#del_" + thisId).removeClass('ui-disabled');
                            //$("#refresh_" + thisId).removeClass('ui-disabled');
                        }

                    }
                });
            },
            viewrecords: true,
            caption: "Documentos",
            loadComplete: function (data) {
                var thisId = $.jgrid.jqID(this.id);
                $.get('/sic/getsession', function (data) {
                    $.each(data, function (i, item) {
                        console.log("EL ROL ES: " + item.glosarol)
                        if (item.glosarol != 'Administrador SIC' && item.glosarol != 'Negociador SIC') {
                            //$("#add_" + thisId).addClass('ui-disabled');
                            //$("#add_gridMaster").hide();
                            $("#edit_" + thisId).addClass('ui-disabled');
                            //$("#edit__gridMaster").hide();
                            $("#del_" + thisId).addClass('ui-disabled');
                            //$("#del__gridMaster").hide();
                        }
                    });
                });
            }
        });

        $gridTab.jqGrid('navGrid', '#navGrid', { edit: true, add: true, del: true, search: false },
            {
                editCaption: "Modifica Documento",
                closeAfterEdit: true,
                recreateForm: true,
                template: tmpl,
                mtype: 'POST',
                url: '/sic/documentos/action',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                beforeShowForm: function (form) {
                    var rowKey = $gridTab.getGridParam("selrow");
                    var rowData = $gridTab.getRowData(rowKey);
                    var thissid = rowData.nombrearchivo;
                    if (thissid != "") {
                        var lol = jQuery(thissid).attr('href');
                        var numero = jQuery(thissid).attr('href').split("/", 3).join("/").length;
                        $('#elarchivo').html("<div class='column-full'>Archivo Actual: " + thissid + "</div>");
                        $('input#nombrearchivo', form).attr('readonly', 'readonly');
                    } else {
                        $('#elarchivo').html("<div class='column-full'>Archivo Actual: </div>");
                        $('input#nombrearchivo', form).attr('readonly', 'readonly');
                    }
                },
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                }, beforeSubmit: function (postdata, formid) {
                    if (parseInt(postdata.idtipodocumento) == 0) {
                        return [false, "Tipo Documento: Debe escoger un valor", ""];
                    } if (postdata.nombrecorto.trim().length == 0) {
                        return [false, "Nombre: El documento debe tener nombre", ""];
                    } if (postdata.nombreresponsable.trim().length == 0) {
                        return [false, "Responsable: Debe ingresar un nombre de responsable", ""];
                    } else {
                        return [true, "", ""]
                    }
                }, afterSubmit: UploadDoc
            }, {
                addCaption: "Agrega Documento",
                closeAfterAdd: true,
                recreateForm: true,
                template: tmpl,
                mtype: 'POST',
                url: '/sic/documentos/action',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                beforeShowForm: function (form) {
                    $("#elarchivo").empty().html('');
                },
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                }, beforeSubmit: function (postdata, formid) {
                    if (parseInt(postdata.idtipodocumento) == 0) {
                        return [false, "Tipo Documento: Debe escoger un valor", ""];
                    } if (postdata.nombrecorto.trim().length == 0) {
                        return [false, "Nombre: El documento debe tener nombre", ""];
                    } if (postdata.nombreresponsable.trim().length == 0) {
                        return [false, "Responsable: Debe ingresar un nombre de responsable", ""];
                    } else {
                        return [true, "", ""]
                    }
                }, afterSubmit: UploadDoc
            }, {
                mtype: 'POST',
                url: '/sic/documentos/action',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                },
                beforeShowForm: function (form) {
                    ret = $gridTab.getRowData($gridTab.jqGrid('getGridParam', 'selrow'));
                    $("td.delmsg", form).html("<b>Usted borrará el documento:</b><br><b>" + ret.nombrearchivo + "</b> ?");

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
    }
}

function showSubGridaprobaciondoc(subgrid_id, row_id) {
    gridabrobaciondoc(subgrid_id, row_id, 'aprobacionesdoc');
}

function gridabrobaciondoc(parentRowID, parentRowKey, suffix) {
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
    tmplPF += "<div class='column-half'><span style='color: red'>*</span>Tipo Aprobación {tipoaprobacion}</div>";
    tmplPF += "<div class='column-half'><span style='color: red'>*</span>Observación {observacion}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row' style='display: none;'>";
    tmplPF += "</div>";

    tmplPF += "<hr style='width:100%;'/>";
    tmplPF += "<div> {sData} {cData}  </div>";
    tmplPF += "</div>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    var childGridURL = "/sic/listaaprobaciondocumento/" + parentRowKey + "/list";

    var grillapadre = subgrid_id.substring(0, subgrid_id.lastIndexOf("_"));
    console.log("la grilla padre: " + grillapadre)
    var rowData = $("#" + grillapadre).getRowData(parentRowKey);
    console.log("la rowData : " + rowData)
    var parentClase = rowData.id;
    console.log("la parentClase : " + parentClase)
    var parentSolicitud = subgrid_id.split("_")[2]
    console.log("la parentSolicitud : " + parentSolicitud)
    
    var modelSubcriterios = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'iddocumentocotizacion', name: 'iddocumentocotizacion', hidden: true },
        { name: 'Nombre', width: 100, search: false, editable: true, hidden: false, formatter: returnResponsable, },
        {
            label: 'Tipo Aprobación', name: 'tipoaprobacion', search: false, editable: true, hidden: false,
            edittype: "custom",
            editoptions: {
                custom_value: sipLibrary.getRadioElementValue,
                custom_element: sipLibrary.radioElemAprobacion
            },
            formatter: function (cellvalue, options, rowObject) {
                var dato = '';
                var val = rowObject.tipoaprobacion;
                if (val == 1) {
                    dato = 'Aceptado';
                } else if (val == 0) {
                    dato = 'Rechazado';
                }
                return dato;
            }
        },
        {
            label: 'Observación', name: 'observacion', width: 250, align: 'left',
            search: true, editable: true, editoptions: { rows: "2", cols: "50" },
            editrules: { required: true }, edittype: "textarea", hidden: false

        },

    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        rowNum: 20,
        datatype: "json",
        caption: 'Aprobaciones',
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

        editurl: '/sic/actionaprobaciondoc/' + parentSolicitud + '/' + parentClase,
        //editurl: '/sic/listaaprobaciondocumento/action',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "id": 0, "nombre": "No hay datos" });
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
            editCaption: "Modificar Aprobación",
            template: tmplPF,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentClase, abuelo: parentSolicitud };
            },
            
            
        },
        {
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            width: 800,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agregar Aprobación",
            template: tmplPF,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentClase, abuelo: parentSolicitud };
            },
            beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            },



        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Eliminar Aprobación",
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentClase, abuelo: parentSolicitud };
            },
        },
        {
            recreateFilter: true
        }
    );


}



function returnDocLinkDoc(cellValue, options, rowdata, parentRowKey) {
    if (rowdata.nombrearchivo != "") {
        return "<a href='/docs/" + parentRowKey + "/" + rowdata.nombrearchivo + "' >" + rowdata.nombrearchivo + "</a>";
    } else {
        return "";
    }

}
function returnDocLinkDoc2(cellValue, options, rowdata, parentRowKey) {
    if (rowdata.nombrearchivo != "") {
        return rowdata.nombrearchivo;
        //return "<a href='/docs/" + parentRowKey + "/" + rowdata.nombrearchivo + "' >"+rowdata.nombrearchivo+"</a>";
    } else {
        return "";
    }

}

function UploadDoc(response, postdata) {
    //console.log(postdata)
    var data = $.parseJSON(response.responseText);
    if (data.success) {
        if ($("#fileToUpload").val() != "") {
            ajaxDocUpload(data.id, data.parent);
        }
    }

    return [data.success, data.message, data.id];
}

function ajaxDocUpload(id, parent) {
    var dialog = bootbox.dialog({
        title: 'Se inicia la transferencia',
        message: '<p><i class="fa fa-spin fa-spinner"></i> Esto puede durar varios minutos...</p>'
    });
    dialog.init(function () {
        $.ajaxFileUpload({
            url: '/sic/documentos/upload',
            secureuri: false,
            fileElementId: 'fileToUpload',
            dataType: 'json',
            data: { id: id, parent: parent },
            success: function (data, status) {
                if (typeof (data.success) != 'undefined') {
                    if (data.success == true) {
                        dialog.find('.bootbox-body').html(data.message);
                        $("#documentos_t_" + parent).trigger('reloadGrid');
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
function labelEditFunc(value, opt) {
    return "<span>" + value + "</span";
}
function getLabelValue(e, action, textvalue) {
    if (action == 'get') {
        console.log("esto es?")
        return e.innerHTML;
    } else {
        if (action == 'set') {
            $(e).html(textvalue);
            console.log("o no??")
        }
        console.log("o nada??")
    }
}

function returnResponsable(cellValue, options, rowdata, action) {
    if (rowdata.user != null)
        return rowdata.user.first_name + ' ' + rowdata.user.last_name;
    else
        return '';
}

