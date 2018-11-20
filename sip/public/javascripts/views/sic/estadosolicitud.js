var gridEstado = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var $gridTab = $(targ + "_t_" + parentRowKey)
        var tmpl = "<div id='responsive-form' class='clearfix'>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Etapa<span style='color:red'>*</span>{idclasificacionsolicitud}</div>";
        tmpl += "</div>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-half'>Fecha Inicio<span style='color:red'>*</span>{fechaInicio}</div>";
        tmpl += "<div class='column-half'>Fecha Esperada<span style='color:red'>*</span>{fechaestadoesperada}</div>";
        tmpl += "</div>";


        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Comentario<span style='color:red'>*</span>{comentario}</div>";
        tmpl += "</div>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>{estado}</div>";
        tmpl += "</div>";

        tmpl += "<hr style='width:100%;'/>";
        tmpl += "<div> {sData} {cData}  </div>";
        tmpl += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['Id', 'Color', 'Etapa', 'Etapa', 'Comentario', 'Fecha Inicio', 'Fecha Esperada', 'Fecha Cierre', 'Estado', ''],
            colModel: [{
                    name: 'id',
                    index: 'id',
                    key: true,
                    hidden: true,
                    width: 10,
                    editable: true,
                    hidedlg: true,
                    sortable: false,
                    editrules: {
                        edithidden: false
                    },
                },
                {
                    label: 'Color',
                    name: 'colorestado',
                    width: 48,
                    hidden: false,
                    search: false,
                    editable: true,
                    align: 'center',
                    formatter: function (cellvalue, options, rowObject) {
                        var rojo = '<span><img src="../../../../images/redcircle.png" width="19px"/></span>';
                        var amarillo = '<span><img src="../../../../images/yellowcircle.png" width="19px"/></span>';
                        var verde = '<span><img src="../../../../images/greencircle.png" width="19px"/></span>';
                        var gris = '<span><img src="../../../../images/greycircle.png" width="19px"/></span>';
                        if (rowObject.colorestado === 'aGris') {
                            return gris;
                        } else {
                            if (rowObject.colorestado === 'Vencida') {
                                return rojo;
                            } else {
                                if (rowObject.colorestado === 'Renovar') {
                                    return amarillo;
                                } else {
                                    if (rowObject.colorestado === 'bAl Dia')


                                        return verde;
                                }
                            }
                        }
                    }
                },
                {
                    name: 'idclasificacionsolicitud',
                    search: false,
                    editable: true,
                    hidden: true,
                    edittype: "select",
                    editoptions: {
                        dataUrl: '/sic/etaparol',
                        buildSelect: function (response) {
                            var grid = $("#grid");
                            var rowKey = grid.getGridParam("selrow");
                            var rowData = grid.getRowData(rowKey);
                            var thissid = rowData.idclasificacionsolicitud;
                            var data = JSON.parse(response);
                            var s = "<select>";
                            s += '<option value="0">--Escoger una Etapa--</option>';
                            $.each(data, function (i, item) {

                                if (data[i].id == thissid) {
                                    s += '<option value="' + data[i].idetapa + '" selected>' + data[i].valore.nombre + '</option>';
                                } else {
                                    s += '<option value="' + data[i].idetapa + '">' + data[i].valore.nombre + '</option>';
                                }
                            });
                            return s + "</select>";
                        }
                    }
                },
                {
                    label: 'Etapa',
                    name: 'clasificacion',
                    jsonmap: "clasificacion.nombre",
                    width: 100,
                    align: 'center',
                    search: false,
                    editable: true,
                    hidden: false
                },
                {
                    name: 'comentario',
                    index: 'comentario',
                    width: 500,
                    hidden: false,
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
                                } catch (ex) {}
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
                                return tinymce.get(id).getContent({
                                    format: "row"
                                });
                            } else if (oper === "set") {
                                if (tinymce.get(id)) {
                                    tinymce.get(id).setContent(gridval);
                                }
                            }
                        }
                    },
                    editable: true,
                    editrules: {
                        edithidden: true
                    }
                },
                {
                    label: 'Fecha Inicio',
                    name: 'fechaInicio',
                    width: 120,
                    align: 'center',
                    search: true,
                    editable: true,
                    hidden: false,
                    formatter: 'date',
                    formatoptions: {
                        srcformat: 'ISO8601Long',
                        newformat: 'd-m-Y'
                    },
                    searchoptions: {
                        dataInit: function (el) {
                            $(el).datepicker({
                                language: 'es',
                                format: 'dd-mm-yyyy',
                                autoclose: true,
                                onSelect: function (dateText, inst) {
                                    setTimeout(function () {
                                        $('#' + subgrid_table_id)[0].triggerToolbar();
                                    }, 100);
                                }
                            });
                        },
                        sopt: ["eq", "le", "ge"]
                    },
                    editoptions: {
                        size: 10,
                        maxlengh: 10,
                        dataInit: function (element) {
                            $(element).mask("00-00-0000", {
                                placeholder: "__-__-____"
                            });
                            $(element).datepicker({
                                language: 'es',
                                format: 'dd-mm-yyyy',
                                autoclose: true
                            })
                        }
                    }
                },
                {
                    label: 'Fecha Esperada',
                    name: 'fechaestadoesperada',
                    width: 120,
                    align: 'center',
                    search: true,
                    editable: true,
                    hidden: false,
                    formatter: 'date',
                    formatoptions: {
                        srcformat: 'ISO8601Long',
                        newformat: 'd-m-Y'
                    },
                    searchoptions: {
                        dataInit: function (el) {
                            $(el).datepicker({
                                language: 'es',
                                format: 'dd-mm-yyyy',
                                autoclose: true,
                                onSelect: function (dateText, inst) {
                                    setTimeout(function () {
                                        $('#' + subgrid_table_id)[0].triggerToolbar();
                                    }, 100);
                                }
                            });
                        },
                        sopt: ["eq", "le", "ge"]
                    },
                    editoptions: {
                        size: 10,
                        maxlengh: 10,
                        dataInit: function (element) {
                            $(element).mask("00-00-0000", {
                                placeholder: "__-__-____"
                            });
                            $(element).datepicker({
                                language: 'es',
                                format: 'dd-mm-yyyy',
                                autoclose: true
                            })
                        }
                    }
                },
                {
                    name: 'fechaCierre',
                    width: 120,
                    align: 'center',
                    search: false,
                    formatter: 'date',
                    formatoptions: {
                        srcformat: 'ISO8601Long',
                        newformat: 'd-m-Y'
                    },
                    editable: true,
                    searchoptions: {
                        dataInit: function (el) {
                            $(el).datepicker({
                                language: 'es',
                                format: 'dd-mm-yyyy',
                                autoclose: true,
                                onSelect: function (dateText, inst) {
                                    setTimeout(function () {
                                        $gridTab[0].triggerToolbar();
                                    }, 100);
                                }
                            });
                        },
                        sopt: ["eq", "le", "ge"]
                    },
                    editoptions: {
                        size: 10,
                        maxlengh: 10,

                    },
                },
                {
                    label: 'Estado',
                    name: 'estado',
                    width: 130,
                    align: 'center',
                    editable: true,
                    hidden: true,
                    edittype: "custom",
                    editoptions: {
                        custom_value: sipLibrary.getRadioElementValue,
                        custom_element: sipLibrary.radioElemEstadoSolici,
                        defaultValue: "Abierto"
                        // fullRow: true
                    },
                    search: false,
                    sortable: false
                },
                {
                    label: '',
                    name: 'estado',
                    width: 100,
                    align: 'center',
                    search: false,
                    editable: false
                }
            ],
            rowNum: 20,
            pager: '#navGridEst',
            styleUI: "Bootstrap",
            sortname: 'fechaestadoesperada',
            sortorder: "asc",
            width: '100%',
            forceFit: true,
            hidegrid: false,
            responsive: true,
            autowidth: true,
            responsive: true,
            viewrecords: true,
            restoreCellonFail : true,
            height: "auto",
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');

            },
            viewrecords: true,
            caption: "Etapa",
            loadComplete: function (data) {
                var thisId = $.jgrid.jqID(this.id);
                $.get('/sic/getsession', function (data) {
                    $.each(data, function (i, item) {
                        console.log("EL ROL ES: " + item.glosarol)
                        if (item.glosarol != 'Administrador SIC' && item.glosarol != 'Negociador SIC' && item.glosarol != 'Ejecutivo Administracion SIC' && item.glosarol != 'Encargado Administracion SIC' ) {
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

        $gridTab.jqGrid('navGrid', '#navGridEst', {
            edit: true,
            add: true,
            del: true,
            search: false
        }, {
            editCaption: "Edita Etapa",
            closeAfterEdit: true,
            recreateForm: true,
            template: tmpl,
            mtype: 'POST',
            url: '/sic/estadosolicitud/action',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            beforeShowForm: function (form) {
                setTimeout(function () {
                    $("#idclasificacionsolicitud").attr('disabled', true);
                }, 450);



            },
            onclickSubmit: function (rowid) {
                return {
                    idsolicitudcotizacion: parentRowKey
                };
            },
            beforeSubmit: function (postdata, formid) {
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
                var fechahoy = elanoactual + elmesactual + eldiaactual
                var f1 = postdata.fechaestadoesperada;
                var f2 = postdata.fechaInicio
                var f1compare = f1.substr(6) + f1.substr(3, 2) + f1.substr(0, 2);
                var f2compare = f2.substr(6) + f2.substr(3, 2) + f2.substr(0, 2);
                if (parseInt(postdata.idclasificacionsolicitud) == 0) {
                    return [false, "Etapa: Debe escoger un valor", ""];
                } else if (postdata.comentario.trim().length == 0) {
                    return [false, "Comentario: Debe ingresar un comentario", ""];
                } else if (postdata.fechaInicio.length == 0) {
                    return [false, "Fecha Inicio: Debe escoger una fecha", ""];
                } else if (postdata.fechaestadoesperada.length == 0) {
                    return [false, "Fecha Esperada: Debe escoger un valor", ""];
                } else if (fechahoy > f1compare) {
                    return [false, "La fecha Esperada no puede ser menor a la fecha de Hoy", ""];
                } else if (fechahoy > f2compare) {
                    return [false, "La fecha Inicio no puede ser menor a la fecha de Hoy", ""];
                } else if (f2compare > f1compare) {
                    return [false, "La fecha de Inicio no puede ser menor que la fecha Esperada", ""];
                } else {
                    return [true, "", ""]
                }
            }
        }, {
            addCaption: "Agrega Etapa",
            closeAfterAdd: true,
            recreateForm: true,
            template: tmpl,
            mtype: 'POST',
            url: '/sic/estadosolicitud/action',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            beforeShowForm: function (form) {
                $("#fechaInicio").attr('disabled', true);
            },
            onclickSubmit: function (rowid) {
                return {
                    idsolicitudcotizacion: parentRowKey
                };
            },
            beforeSubmit: function (postdata, formid) {
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
                var fechahoy = elanoactual + elmesactual + eldiaactual
                var f1 = postdata.fechaestadoesperada;
                var f1compare = f1.substr(6) + f1.substr(3, 2) + f1.substr(0, 2);
                if (parseInt(postdata.idclasificacionsolicitud) == 0) {
                    return [false, "Etapa: Debe escoger un valor", ""];
                } else if (postdata.fechaestadoesperada.length == 0) {
                    return [false, "Fecha Esperada: Debe escoger una fecha", ""];
                } else if (fechahoy > f1compare) {
                    return [false, "La fecha Esperada no puede ser menor a la fecha de Hoy", ""];
                } else if (postdata.comentario.trim().length == 0) {
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
                return {
                    idsolicitudcotizacion: parentRowKey
                };
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
            caption: "",
            id: "download_" + $(targ + "_t_" + parentRowKey).attr('id'),
            buttonicon: "glyphicon glyphicon-download-alt",
            title: "Generar Documento",
            position: "last",
            onClickButton: function () {
                var parentRowData = $("#gridMaster").getRowData(parentRowKey);
                try {
                    var url = '/sic/documentowordfinal/' + parentRowKey + '/' + parentRowData.idtipo;
                    $gridTab.jqGrid('excelExport', {
                        "url": url
                    });
                } catch (e) {
                    console.log("error: " + e)

                }

            }
        });
        
    }
}