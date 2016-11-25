//doc.js
var gridDoc = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var $gridTab = $(targ + "_t")

        var tmpl = "<div id='responsive-form' class='clearfix'>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Tipo<span style='color:red'>*</span>{idtipodocumento}</div>";
        tmpl += "</div>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-half'>Nombre<span style='color:red'>*</span>{nombrecorto}</div>";
        tmpl += "<div class='column-half'>Responsable<span style='color:red'>*</span>{nombreresponsable}</div>";
        tmpl += "</div>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Descripción<span style='color:red'>*</span>{descripcionlarga}</div>";
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
            colNames: ['id', 'Tipo', 'Tipo', 'Nombre', 'Descripción', 'Responsable', 'Archivo', 'Archivo'],
            colModel: [
                {
                    name: 'id', index: 'id', key: true, hidden: false, width: 10,
                    editable: true, hidedlg: true, sortable: false, editrules: { edithidden: false }, formatter: returnDocLink
                },
                { name: 'valore.tipo', width: 50, editable: false, align: "left", hidden: false },
                {
                    name: 'idtipodocumento', search: false, editable: true, hidden: true,
                    edittype: "select",
                    editoptions: {
                        dataUrl: '/sic/documentos/' + parentRowKey + '/tipos',
                        buildSelect: function (response) {
                            var rowKey = $gridTab.getGridParam("selrow");
                            var rowData = $gridTab.getRowData(rowKey);
                            var thissid = rowData.idtipodocumento;
                            var data = JSON.parse(response);
                            var s = "<select>";//el default
                            s += '<option value="0">--Escoger un Tipo--</option>';
                            $.each(data, function (i, item) {

                                if (data[i].id == thissid) {
                                    s += '<option value="' + data[i].id + '" selected>' + data[i].tipo + '</option>';
                                } else {
                                    s += '<option value="' + data[i].id + '">' + data[i].tipo + '</option>';
                                }
                            });
                            return s + "</select>";
                        }
                    }
                },
                { name: 'nombrecorto', index: 'nombrecorto', width: 50, align: "left", editable: true },
                {
                    name: 'descripcionlarga', index: 'descripcionlarga', hidden: true,
                    //edittype: "textarea",
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
                { name: 'nombreresponsable', index: 'nombreresponsable', width: 100, align: "left", editable: true },
                { name: 'nombrearchivo', index: 'nombrearchivo', hidden: false, width: 100, align: "left", editable: false },
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
            styleUI: "Bootstrap",
            sortname: 'id',
            sortorder: "asc",
            height: "auto",
            shrinkToFit: true,
            autowidth: true,
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Documentos"
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

            }, {

            });

    }
}


function returnDocLink(cellValue, options, rowdata, action) {
    //return "<a href='hola.html' class='btn btn-lg btn-primary' data-toggle='modal' data-target='#docModal'>K</a>";
    return "<a href='/sic/documentos/" + rowdata.id + "' >" + cellValue + "</a>";
}

function UploadDoc(response, postdata) {

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