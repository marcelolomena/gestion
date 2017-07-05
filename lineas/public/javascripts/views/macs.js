var gridMacs = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var $gridTab = $(targ + "_t_" + parentRowKey)

        var tmpl = "<div id='responsive-form' class='clearfix'>";

        tmpl += "<div class='form-row'>";
        tmpl += `<div class='column-full'>Garantías Disponibles: <br />
        <br />   
        <input type="checkbox" name="chk_group" value="1" />  Terreno<br />
        <input type="checkbox" name="chk_group" value="2" />  Máquina <br />
        <input type="checkbox" name="chk_group" value="3" />  Propiedad <br />`
        tmpl += "</div>";

        /*
                tmpl += "<div class='form-row'>";
                tmpl += "<div class='column-full'>Comentario<span style='color:red'>*</span>{comentario}</div>";
                tmpl += "</div>";
        
                tmpl += "<div class='form-row'>";
                tmpl += "<div class='column-full' style='display: none;'>Fecha {fecha}</div>";
                tmpl += "</div>";
                tmpl += "<div class='form-row', id='mensajefecha'>";
                tmpl += "<div class='column-full'></div>";
                tmpl += "</div>";
        */
        tmpl += "<hr style='width:100%;'/>";
        tmpl += "<div> {sData} {cData}  </div>";
        tmpl += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            //colNames: ['Id', 'ID Mac Grupal', 'N° Aprob', 'Tipo de Riesgo', 'Tipo Límite', 'Plazo Residual', 'Aprob Actual', 'Deuda Actual', 'Sometido Aprob', 'Moneda', 'Comentario', 'Garantía Estatal', 'Fecha Venc'],
            colModel: [
                {
                    name: 'id', index: 'id', key: true, hidden: true, width: 10,
                    editable: true, hidedlg: true, sortable: false, editrules: { edithidden: false },
                },
                { name: 'idmacgrupal', hidden: true, editable: true },
                {
                    label: ' ', name: 'marca', key: false, hidden: false, width: 30,
                    formatter: function (cellvalue, options, rowObject) {

                        dato = '<input type="checkbox" name="chk_group" value="1" />'

                        return dato
                    }
                },
                {
                    label: 'Rut',
                    name: 'rut',
                    width: 80,
                    align: 'left',
                    search: false,
                    editable: true,
                    hidden: false,
                    editoptions: {
                        dataEvents: [{
                            type: 'change', fn: function (e) {
                                var grid = $grid
                                var rowKey = grid.getGridParam("selrow");
                                var rowData = grid.getRowData(rowKey);
                                //console.log("rowData:" + rowData);
                                var thissid = $(this).val();
                                $.ajax({
                                    type: "GET",
                                    url: '/getdatoscliente/' + thissid,
                                    async: false,
                                    success: function (data) {
                                        if (data.length > 0) {
                                            //console.log("glosa:" + data[0].glosaservicio);
                                            $("input#nombre").val(data[0].razonsocial);
                                            $("input#actividad").val("INMOBILIARIA");
                                            $("input#oficina").val("CENTRAL");
                                            $("input#ejecutivo").val("SERGIO VALENZUELA");;
                                            $("input#fechacreacion").val("2016-05-21");
                                            $("input#fechaproxvenc").val("2016-06-31");
                                            $("input#fechavencant").val("2016-05-22");
                                            $("input#ratinggrupo").val("0");
                                            $("input#nivelatr").val("R3");
                                            $("input#ratingind").val("0");
                                            $("input#clasificacion").val("A5");
                                            $("input#vigilancia").val("NO");
                                            $("input#fechainf").val("2016-06-22");
                                            $("input#promediosaldovista").val("650");
                                            $("input#deudasbif").val("350");
                                            $("input#aprobvinculado").val("NO");

                                        } else {
                                            alert("No existe cliente en Base de Datos");
                                        }
                                    }
                                });

                            }
                        }],
                    }
                },

                //{ label: 'Rut', name: 'rut', width: 80, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'Nombre', name: 'nombre', width: 250, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'Actividad', name: 'actividad', width: 150, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'Oficina', name: 'oficina', width: 80, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'Ejecutivo', name: 'ejecutivo', width: 100, hidden: false, search: true, editable: true, editrules: { required: true } },
                {
                    label: 'Creación', name: 'fechacreacion', width: 80, align: 'left', search: false,
                    formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
                    editable: true, editrules: { required: true },
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
                        dataInit: function (element) {
                            $(element).mask("00-00-0000", { placeholder: "__-__-____" });
                            $(element).datepicker({ language: 'es', format: 'dd-mm-yyyy', autoclose: true })
                        }
                    },
                },
                {
                    label: 'Vencimiento', name: 'fechaproxvenc', width: 80, align: 'left', search: false,
                    formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
                    editable: true, editrules: { required: true },
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
                        dataInit: function (element) {
                            $(element).mask("00-00-0000", { placeholder: "__-__-____" });
                            $(element).datepicker({ language: 'es', format: 'dd-mm-yyyy', autoclose: true })
                        }
                    },
                },
                {
                    label: 'Venc. Anterior', name: 'fechavencant', width: 100, align: 'left', search: false,
                    formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
                    editable: true, editrules: { required: true },
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
                        dataInit: function (element) {
                            $(element).mask("00-00-0000", { placeholder: "__-__-____" });
                            $(element).datepicker({ language: 'es', format: 'dd-mm-yyyy', autoclose: true })
                        }
                    },
                },
                { label: 'R. Indiv.', name: 'ratingind', width: 80, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'R. Grupal', name: 'ratinggrupo', width: 90, hidden: false, search: true, editable: true, editrules: { required: true } },

                { label: 'N. Atrib.', name: 'nivelatr', width: 110, hidden: false, search: true, editable: true, editrules: { required: true } },

                { label: 'Clasific.', name: 'clasificacion', width: 90, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'Vigilancia', name: 'vigilancia', width: 70, hidden: false, search: true, editable: true, editrules: { required: true } },
                {
                    label: 'Info al', name: 'fechainf', width: 90, align: 'left', search: false,
                    formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
                    editable: true, editrules: { required: true },
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
                        dataInit: function (element) {
                            $(element).mask("00-00-0000", { placeholder: "__-__-____" });
                            $(element).datepicker({ language: 'es', format: 'dd-mm-yyyy', autoclose: true })
                        }
                    },
                },
                { label: 'Prom Saldo V', name: 'promediosaldovista', width: 100, hidden: false, search: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 2 }, editrules: { required: true } },
                { label: 'Deuda SBIF', name: 'deudasbif', width: 100, hidden: false, search: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 2 }, editrules: { required: true } },
                { label: 'Aprobación', name: 'aprobvinculado', width: 70, hidden: false, search: true, editable: true, editrules: { required: true } },

            ],
            rowNum: 20,
            pager: '#navGridMacs',
            styleUI: "Bootstrap",
            //sortname: 'fecha',
            //sortorder: "desc",
            height: "auto",
            //shrinkToFit: true,
            //autowidth: true,
            width: 1350,
            subGrid: true,
            subGridRowExpanded: showChildGrid2,
            subGridBeforeExpand: function (divid, rowid) {
                var expanded = jQuery("td.sgexpanded", $gridTab)[0];
                if (expanded) {
                    setTimeout(function () {
                        $(expanded).trigger("click");
                    }, 100);
                }
            },
            rownumbers: false,
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "MACs Individuales",
            loadComplete: function (data) {
                var thisId = $.jgrid.jqID(this.id);
            },
            footerrow: false
        });

        $gridTab.jqGrid('navGrid', '#navGridMacs', { edit: false, add: true, del: true, search: false },
            {
                editCaption: "Modificar MAC",
                closeAfterEdit: true,
                recreateForm: true,
                template: tmpl,
                mtype: 'POST',
                url: '/limite',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                beforeShowForm: function (form) {
                    var rowKey = $gridTab.getGridParam("selrow");
                    var rowData = $gridTab.getRowData(rowKey);
                    var thissid = rowData.fecha;
                    $('#mensajefecha').html("<div class='column-full'>Estado con fecha: " + thissid + "</div>");
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
                addCaption: "Agregar MAC",
                closeAfterAdd: true,
                recreateForm: true,
                //template: tmpl,
                mtype: 'POST',
                url: '/limite',
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
                    return { parent_id: parentRowKey };
                }, beforeSubmit: function (postdata, formid) {
                    /*
                    if (parseInt(postdata.fechavencimiento) == 0) {
                        return [false, "Color: Debe escoger un valor", ""];
                    } if (postdata.comentario.trim().length == 0) {
                        return [false, "Comentario: Debe ingresar un comentario", ""];
                    } else {*/
                    return [true, "", ""]
                    //}
                }
            }, {
                mtype: 'POST',
                url: '/limite',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                },
                beforeShowForm: function (form) {
                    ret = $gridTab.getRowData($gridTab.jqGrid('getGridParam', 'selrow'));
                    $("td.delmsg", form).html("<b>Usted borrará el limite:</b><br><b>" + ret.tipolimite + "</b> ?");

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
        /*
               $gridTab.jqGrid('navButtonAdd', "#navGridLimite", {
                    caption: "",
                    buttonicon: "glyphicon glyphicon-download-alt",
                    title: "Excel",
                    position: "last",
                    onClickButton: function () {
                        var s;
                        s = $gridTab.jqGrid('getGridParam', 'selarrrow');
        
                        if (s.length > 0) {
                            // Make AJAX call to get the dynamic form content
                            $.ajax({
                                cache: false,
                                async: true,
                                type: 'POST',
                                url: "/TargetItems/MarkPurchasesPaidRequest",
                                data: {
                                    PurchaseIds: JSON.stringify(s)
                                },
                                success: function (content) {
                                    // Add the content to the div
                                    $('#MarkPurchasePaidModal').html(content);
                                    // Display the modal
                                    $("#MarkPurchasePaidModal").dialog("open");
                                },
                                error: function (res, status, exception) {
                                    alert(status + ": " + exception);
                                },
                                modal: true
                            });
                        }
                    }
                });
                */
    }
}
function showChildGrid2(parentRowID, parentRowKey) {
    var grillapadre = parentRowID.substring(0, parentRowID.lastIndexOf("_"));
    console.log("la grilla padre: " + grillapadre)
    var rowData = $("#" + grillapadre).getRowData(parentRowKey);
    console.log("la rowData : " + rowData)
    var parentRUT = rowData.rut;
    console.log("la parentRUT : " + parentRUT)
    var tabs = "<ul class='nav nav-tabs tabs-up' id='myTab'>"
    tabs += "<li><a href='/limite/" + parentRowKey + "' data-target='#limite' id='limite_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Límites</a></li>"
    //tabs += "<li><a href='/responsables/" + parentRowKey + "' data-target='#responsables' id='responsables_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Responsables</a></li>"
    //tabs += "<li><a href='/aprobaciones/" + parentRowKey + "' data-target='#aprobaciones' id='aprobaciones_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Aprobaciones</a></li>"
    tabs += "<li><a href='/garantia/" + parentRUT + "' data-target='#garantia' id='garantia_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Garantías</a></li>"
    tabs += "<li><a href='/bitacora/" + parentRowKey + "' data-target='#bitacora' id='bitacora_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Bitacora</a></li>"
    tabs += "</ul>"

    tabs += "<div class='tab-content'>"
    tabs += "<div class='tab-pane active' id='limite'><div class='container-fluid'><table id='limite_t_" + parentRowKey + "'></table><div id='navGridLimite'></div></div></div>"
    //tabs += "<div class='tab-pane' id='responsables'><table id='responsables_t_" + parentRowKey + "'></table><div id='navGridResp'></div></div>"
    //tabs += "<div class='tab-pane' id='aprobaciones'><table id='aprobaciones_t_" + parentRowKey + "'></table><div id='navGridAprob'></div></div>"
    tabs += "<div class='tab-pane' id='garantia'><table id='garantia_t_" + parentRowKey + "'></table><div id='navGridGar'></div></div>"
    tabs += "<div class='tab-pane' id='bitacora'><table id='bitacora_t_" + parentRowKey + "'></table><div id='navGridBita'></div></div>"
    tabs += "</div>"

    $("#" + parentRowID).append(tabs);
    $('#limite_tab_' + parentRowKey).addClass('media_node active span')
    $('.active[data-toggle="tab_' + parentRowKey + '"]').each(function (e) {
        var $this = $(this),
            loadurl = $this.attr('href'),
            targ = $this.attr('data-target');
        if (targ === '#limite') {
            gridLimite.renderGrid(loadurl, parentRowKey, targ)
        } else if (targ === '#garantia') {
            gridGarantia.renderGrid(loadurl, parentRowKey, targ)
        }

        $this.tab('show');
        return false;
    });

    $('[data-toggle="tab_' + parentRowKey + '"]').click(function (e) {
        var $this = $(this),
            loadurl = $this.attr('href'),
            targ = $this.attr('data-target');
        if (targ === '#limites') {
            gridLimite.renderGrid(loadurl, parentRowKey, targ)
        } else if (targ === '#garantia') {
            gridGarantia.renderGrid(loadurl, parentRowKey, targ)
        }

        $this.tab('show');
        return false;
    });

}