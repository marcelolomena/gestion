var gridEstado = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var $gridTab = $(targ + "_t_" + parentRowKey)
        //console.log(targ + "_t_" + parentRowKey)

        var tmpl = "<div id='responsive-form' class='clearfix'>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-half'>Etapa<span style='color:red'>*</span>{idclasificacionsolicitud}</div>";
        tmpl += "<div class='column-half'>Fecha Esperada<span style='color:red'>*</span>{fechaestadoesperada}</div>";
        tmpl += "</div>";

        // tmpl += "<div class='form-row'>";
        // tmpl += "<div class='column-full'>Color<span style='color:red'>*</span>{idcolor}</div>";
        // tmpl += "</div>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Comentario<span style='color:red'>*</span>{comentario}</div>";
        tmpl += "</div>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>{estado}</div>";
        tmpl += "</div>";


        // tmpl += "<div class='form-row'>";
        // tmpl += "<div class='column-full' style='display: none;'>Fecha {fecha}</div>";
        // tmpl += "</div>";
        // tmpl += "<div class='form-row', id='mensajefecha'>";
        // tmpl += "<div class='column-full'></div>";
        // tmpl += "</div>";

        tmpl += "<hr style='width:100%;'/>";
        tmpl += "<div> {sData} {cData}  </div>";
        tmpl += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['Id', 'Color', 'Etapa', 'Etapa', 'Comentario', 'Fecha Esperada', 'Fecha Cierre', 'Estado', ''],
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
                // {
                //     label: 'Color',
                //     name: 'valore.nombre',
                //     width: 50,
                //     align: 'center',
                //     search: false,
                //     editable: true,
                //     hidedlg: true,
                //     editrules: {
                //         edithidden: false,
                //         required: true
                //     },
                //     formatter: function (cellvalue, options, rowObject) {
                //         var color = rowObject.valore.nombre;

                //         if (color == 'Rojo') {
                //             color = 'red';
                //         } else if (color == 'Verde') {
                //             color = 'green';
                //         } else if (color == 'Amarillo') {
                //             color = 'yellow';
                //         } else if (color == 'Azul') {
                //             color = 'blue';
                //         } else if (color == 'indefinido') {
                //             color = 'gray';
                //         }
                //         return '<span class="cellWithoutBackground" style="background-color:' + color + '; display:block; width: 50px; height: 16px;"></span>';
                //     }
                // },
                {
                    name: 'idclasificacionsolicitud',
                    search: false,
                    editable: true,
                    hidden: true,
                    edittype: "select",
                    editoptions: {
                        dataUrl: '/sic/parametros/clasificacionsolicitud',
                        buildSelect: function (response) {
                            var grid = $("#grid");
                            var rowKey = grid.getGridParam("selrow");
                            var rowData = grid.getRowData(rowKey);
                            var thissid = rowData.idclasificacionsolicitud;
                            var data = JSON.parse(response);
                            var s = "<select>";
                            s += '<option value="0">--Escoger una Clasificación--</option>';
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
                // {
                //     name: 'idcolor', index: 'idcolor', editable: true, hidden: true,
                //     edittype: "select",
                //     editoptions: {
                //         dataUrl: '/sic/clasecriticidad/color',
                //         buildSelect: function (response) {
                //             var grid = $("#grid");
                //             var rowKey = grid.getGridParam("selrow");
                //             var rowData = grid.getRowData(rowKey);
                //             var thissid = rowData.idcolor;
                //             var data = JSON.parse(response);
                //             var s = "<select>";//el default
                //             s += '<option value="0">--Escoger Color--</option>';
                //             $.each(data, function (i, item) {
                //                 if (data[i].nombre == thissid) {
                //                     s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                //                 } else {
                //                     s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                //                 }
                //             });
                //             return s + "</select>";
                //         },
                //         dataEvents: [{
                //             type: 'change', fn: function (e) {
                //                 var thistid = $(this).val();
                //                 $("input#idcolor").val($('option:selected', this).text());
                //             }
                //         }],
                //     }
                // },

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
                    name: 'fecha', width: 120, align: 'center', search: false,
                    formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
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
                        size: 10, maxlengh: 10,

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
            height: "auto",
            //shrinkToFit: true,
            //autowidth: true,
            // width: 850,
            // rownumbers: true,
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
                





            },
            gridComplete: function () {
                // var recs = $gridTab.getGridParam("reccount");
                // var thisId = $.jgrid.jqID(this.id);
                // console.log("este es el id po: " + thisId)

                // //$("#add_" + thisId).addClass('ui-disabled');
                // $("#edit_" + thisId).addClass('ui-disabled');
                // $("#del_" + thisId).addClass('ui-disabled');
                // //$("#refresh_" + thisId).addClass('ui-disabled');
                var recs = $gridTab.getGridParam("reccount");
                var thisId = $.jgrid.jqID(this.id);
                $.ajax({
                    type: "GET",
                    url: '/sic/estadoCerrado/' + parentRowKey,
                    async: false,
                    success: function (data) {
                        var validado = data.validado
                        console.log(validado)
                        if (validado != "1") {
                            $("#add_" + thisId).addClass('ui-disabled');
                            // $("#edit_" + thisId).addClass('ui-disabled');
                            // $("#del_" + thisId).addClass('ui-disabled');
                            // //$("#refresh_" + thisId).addClass('ui-disabled');
                        } else {
                            $("#add_" + thisId).removeClass('ui-disabled');
                            // $("#edit_" + thisId).removeClass('ui-disabled');
                            // $("#del_" + thisId).removeClass('ui-disabled');
                            //$("#refresh_" + thisId).removeClass('ui-disabled');
                        }

                    }
                });
            },



            viewrecords: true,
            caption: "Estado",
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

        $gridTab.jqGrid('navGrid', '#navGridEst', {
            edit: true,
            add: true,
            del: true,
            search: false
        }, {
            editCaption: "Modifica Estado",
            closeAfterEdit: true,
            recreateForm: true,
            template: tmpl,
            mtype: 'POST',
            url: '/sic/estadosolicitud/action',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            beforeShowForm: function (form) {
                var rowKey = $gridTab.getGridParam("selrow");
                var rowData = $gridTab.getRowData(rowKey);
                var thissid = rowData.fecha;
                $('#mensajefecha').html("<div class='column-full'>Estado con fecha: " + thissid + "</div>");
            },
            onclickSubmit: function (rowid) {
                return {
                    idsolicitudcotizacion: parentRowKey
                };
            },
            beforeSubmit: function (postdata, formid) {
                if (postdata.comentario.trim().length == 0) {
                    return [false, "Comentario: Debe ingresar un comentario", ""];
                } else if (parseInt(postdata.idclasificacionsolicitud) == 0) {
                    return [false, "Clasificación: Debe escoger un valor", ""];
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
                $('input#fecha').html(lafechastring);
                $('input#fecha').attr('value', lafechastring);
                $('#mensajefecha').html("<div class='column-full'>El estado se guardará con fecha: " + lafechastring + "</div>");

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
                return {
                    idsolicitudcotizacion: parentRowKey,
                    fecha: lafechastring
                };
            },
            beforeSubmit: function (postdata, formid) {
                if (postdata.comentario.trim().length == 0) {
                    return [false, "Comentario: Debe ingresar un comentario", ""];
                } else if (parseInt(postdata.idclasificacionsolicitud) == 0) {
                    return [false, "Clasificación: Debe escoger un valor", ""];
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
            caption: "Generar Documento",
            id: "download_" + $(targ + "_t_" + parentRowKey).attr('id'),
            buttonicon: "glyphicon glyphicon-download-alt",
            title: "Generar Documento",
            position: "last",
            onClickButton: function () {
                //var rowKey = $gridTab.getGridParam("selrow");
                var parentRowData = $("#gridMaster").getRowData(parentRowKey);
                //console.log(parentRowData.idtipo)
                //console.log(parentRowData.idgrupo)
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