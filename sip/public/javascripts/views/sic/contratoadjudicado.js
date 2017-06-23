var gridSolicitudContrato = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var $gridTab = $(targ + "_t_" + parentRowKey)
        //console.log(targ + "_t_" + parentRowKey)

        var tmpl = "<div id='responsive-form' class='clearfix'>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'><span style='color: red'>*</span>Comentario {descripcion}</div>";
        tmpl += "</div>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Fecha adjudicación {fechaadjudicacion}</div>";
        tmpl += "</div>";

        tmpl += "<hr style='width:100%;'/>";
        tmpl += "<div> {sData} {cData}  </div>";
        tmpl += "</div>";
        var modelSolicitudContrato = [
            { label: 'id', name: 'id', key: true, hidden: true },
            { label: 'idserviciorequerido', name: 'idserviciorequerido', hidden: true },
            { label: 'idsolicitudcotizacion', name: 'idsolicitudcotizacion', key: false, hidden: true },
            { label: 'Servicio', name: 'serviciosrequerido.servicio.nombre', index: 'serviciosrequerido.servicio.nombre', width: 250, editable: true, editoptions: { size: 10 } },

            { label: 'Glosa', name: 'serviciosrequerido.glosaservicio', index: 'serviciosrequerido.glosaservicio', width: 250, editable: true, editoptions: { size: 25 }, editrules: { required: true } },
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
            },


        ];

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            //colNames: ['Id', 'Color', 'Color', 'Comentario', 'Fecha'],
            colModel: modelSolicitudContrato,
            rowNum: 20,
            pager: '#navGridSolCon',
            styleUI: "Bootstrap",
            sortname: 'fecha',
            sortorder: "desc",
            height: "auto",
            //shrinkToFit: true,
            //autowidth: true,
            width: 850,
            rownumbers: true,
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Solicitudes de Contrato",
            loadComplete: function (data) {
                var thisId = $.jgrid.jqID(this.id);
                $.get('/sic/getsession', function (data) {
                    $.each(data, function (i, item) {
                        console.log("EL ROL ES: " + item.glosarol)
                        if (item.glosarol != 'Administrador SIC' && item.glosarol != 'Negociador SIC') {
                            $("#add_" + thisId).addClass('ui-disabled');
                            //$("#add_gridMaster").hide();
                            $("#edit_" + thisId).addClass('ui-disabled');
                            //$("#edit__gridMaster").hide();
                            $("#del_" + thisId).addClass('ui-disabled');
                            //$("#del__gridMaster").hide();
                            $("#download_" + thisId).addClass('ui-disabled');
                        }
                    });
                });
            }

        });

        $gridTab.jqGrid('navGrid', '#navGridSolCon', { edit: true, add: false, del: false, search: false },
            {
                editCaption: "Modifica Solicitud de Contrato",
                closeAfterEdit: true,
                recreateForm: true,
                template: tmpl,
                mtype: 'POST',
                url: '/sic/solicitudcontrato/action',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,

                beforeShowForm: function (form) {
                    setTimeout(function () {
                        $("#idproveedor", form).attr('disabled', 'disabled');
                        $("#fechaadjudicacion", form).attr('disabled', 'disabled');

                    }, 450);
                },

                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                }, beforeSubmit: function (postdata, formid) {
                    if (postdata.descripcion.trim().length == 0) {
                        return [false, "Comentario: Debe ingresar un comentario", ""];
                    } else {
                        return [true, "", ""]
                    }
                }
            }, {
                addCaption: "Agrega Estado",
                closeAfterAdd: true,
                recreateForm: true,
                template: tmpl,
                mtype: 'POST',
                url: '/sic/estadosolicitud/action',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                beforeShowForm: function (form) {
                    setTimeout(function () {
                        $("#idproveedor", form).attr('disabled', 'disabled');
                        $("#fechaadjudicacion", form).attr('disabled', 'disabled');

                    }, 450);
                },
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                }, beforeSubmit: function (postdata, formid) {
                    if (parseInt(postdata.idcolor) == 0) {
                        return [false, "Color: Debe escoger un valor", ""];
                    } if (postdata.comentario.trim().length == 0) {
                        return [false, "Comentario: Debe ingresar un comentario", ""];
                    } else {
                        return [true, "", ""]
                    }
                }
            }, {
                mtype: 'POST',
                url: '/sic/estadosolicitud/action',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                },
                beforeShowForm: function (form) {
                    ret = $gridTab.getRowData($gridTab.jqGrid('getGridParam', 'selrow'));
                    $("td.delmsg", form).html("<b>Usted borrará el estado:</b><br><b>" + ret.comentario + "</b> ?");

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
        $gridTab.jqGrid('navButtonAdd', '#navGridEst', {
            caption: "Generar Documento RFC",
            id: "download_" + $(targ + "_t_" + parentRowKey).attr('id'),
            buttonicon: "glyphicon glyphicon-download-alt",
            title: "Generar Documento RFC",
            position: "last",
            onClickButton: function () {
                //var rowKey = $gridTab.getGridParam("selrow");
                var parentRowData = $("#gridMaster").getRowData(parentRowKey);
                //console.log(parentRowData.idtipo)
                //console.log(parentRowData.idgrupo)
                try {
                    var url = '/sic/documentowordfinal/' + parentRowKey + '/' + parentRowData.idgrupo;
                    $gridTab.jqGrid('excelExport', { "url": url });
                } catch (e) {
                    console.log("error: " + e)

                }

            }
        });

/*
        $gridTab.jqGrid('navButtonAdd', '#navGridSolCon', {
            caption: "",
            //id: "download_" + $(targ + "_t_" + parentRowKey).attr('id'),
            buttonicon: "glyphicon glyphicon-floppy-save",

            title: "Generar Contratos",
            position: "last",
            onClickButton: function () {
                //var rowKey = $gridTab.getGridParam("selrow");
                //var parentRowData = $("#gridMaster").getRowData(parentRowKey);
                //console.log(parentRowData.idtipo)
                //console.log(parentRowData.idgrupo)
                console.log("esto es una solicitud: " + parentRowKey)
                try {
                    var url = '/sic/guardarcontrato/' + parentRowKey;
                    $gridTab.jqGrid('excelExport', { "url": url });
                } catch (e) {
                    console.log("error: " + e)

                }

            }
        });
        */

        $gridTab.jqGrid('navButtonAdd', '#navGridSolCon', {
            caption: "",
            id: "pushpin_" + $(targ + "_t_" + parentRowKey).attr('id'),
            buttonicon: "glyphicon glyphicon-floppy-save",
            title: "Generar Contratos",
            position: "last",
            onClickButton: function () {
                var parentRowData = $("#gridMaster").getRowData(parentRowKey);
                //console.log(parentRowData.idtipo)
                //console.log(parentRowData.idgrupo)

                var dialog = bootbox.dialog({
                    title: 'Generando Contratos',
                    message: '<p><i class="fa fa-spin fa-spinner"></i> Esto puede durar segundos...</p>'
                });
                dialog.init(function () {
                    $.getJSON('/sic/guardarcontrato/' + parentRowKey, function (res) {
                        $gridTab.trigger("reloadGrid");
                        dialog.find('.bootbox-body').html(res.message);
                    });
                });

            }
        });
    }
}