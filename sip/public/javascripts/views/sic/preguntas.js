var gridPreguntas = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var $gridTab = $(targ + "_t_" + parentRowKey)
        var tmpl = "<div id='responsive-form' class='clearfix'>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Proveedor<span style='color:red'>*</span>{idproveedor}</div>";
        tmpl += "<div class='column-full'>Archivo<span style='color:red'>*</span>{fileToUpload}</div>";
        tmpl += "</div>";

        tmpl += "<hr style='width:100%;'/>";
        tmpl += "<div> {sData} {cData}  </div>";
        tmpl += "</div>";

     /*   $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['id', 'Rut', 'idproveedor', 'Proveedor', 'Archivo'],
            colModel: [
                {
                    name: 'id', index: 'id', key: true, hidden: true, width: 10, editable: false
                },
                {
                    name: 'rut', index: 'rut', hidden: false, width: 10, editable: false, jsonmap: "proveedor.numrut",
                },
                {
                    name: 'idproveedor', search: false, editable: true, hidden: true, jsonmap: "proveedor.id",
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
                                    s += '<option value="' + data[i].proveedor.id + '" selected>' + data[i].proveedor.razonsocial + '</option>';
                                } else {
                                    s += '<option value="' + data[i].proveedor.id + '">' + data[i].proveedor.razonsocial + '</option>';
                                }
                            });
                            return s + "</select>";
                        }
                    }
                },

                { name: 'proveedor', width: 150, search: false, editable: false, hidden: false, jsonmap: "proveedor.razonsocial" },
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
            pager: '#navGridPre',
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
            caption: "Preguntas"
        });

        */

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
                        return [false, "Tipo Documento: Debe escoger un valor", ""];
                    } else {
                        return [true, "", ""]
                    }
                }, afterSubmit: UploadPre

            }, {
                mtype: 'POST',
                url: '/sic/preguntaproveedor/action',
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
    }
}

function UploadPre(response, postdata) {
    //console.log(postdata)
    var data = $.parseJSON(response.responseText);
    if (data.success) {
        if ($("#fileToUpload").val() != "") {
            ajaxDocUpload(data.id);
        }
    }

    return [data.success, data.message, data.id];
}

function ajaxDocUpload(id) {
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
            data: { id: id },
            success: function (data, status) {
                if (typeof (data.success) != 'undefined') {
                    if (data.success == true) {
                        dialog.find('.bootbox-body').html(data.message);
                        $("#preguntas_t_" + parent).trigger('reloadGrid');
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



