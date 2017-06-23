var gridLineas = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var $gridTab = $(targ + "_t_" + parentRowKey)

        var tmpl = "<div id='responsive-form' class='clearfix'>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Color<span style='color:red'>*</span>{idcolor}</div>";
        tmpl += "</div>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Comentario<span style='color:red'>*</span>{comentario}</div>";
        tmpl += "</div>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full' style='display: none;'>Fecha {fecha}</div>";
        tmpl += "</div>";
        tmpl += "<div class='form-row', id='mensajefecha'>";
        tmpl += "<div class='column-full'></div>";
        tmpl += "</div>";

        tmpl += "<hr style='width:100%;'/>";
        tmpl += "<div> {sData} {cData}  </div>";
        tmpl += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['Id', 'ID Mac', 'N° Aprob', 'Tipo de Riesgo', 'Descripción', 'Plazo Residual', 'Aprob Actual', 'Deuda Actual', 'Sometido Aprob'],
            colModel: [
                {
                    name: 'id', index: 'id', key: true, hidden: true, width: 10,
                    editable: true, hidedlg: true, sortable: false, editrules: { edithidden: false },
                },
                { name: 'idmac', hidden: true, editable: true },
                { name: 'numero', width: 60, hidden: false, search: true, editable: true, editrules: { required: true } },
                { name: 'tiporiesgo', width: 100, hidden: false, search: true, editable: true, editrules: { required: true } },
                { name: 'descripcion', width: 250, hidden: false, search: true, editable: true, editrules: { required: true } },
                { name: 'plazoresidual', width: 120, hidden: false, search: true, editable: true, editrules: { required: true } },
                { name: 'abrobactualmonto', width: 100, hidden: false, search: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 2 }, editrules: { required: true } },
                { name: 'deudaactualmonto', width: 100, hidden: false, search: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 2 }, editrules: { required: true } },
                { name: 'someaprobmonto', width: 100, hidden: false, search: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 2 }, editrules: { required: true } },
            ],
            rowNum: 20,
            pager: '#navGridLineas',
            styleUI: "Bootstrap",
            //sortname: 'fecha',
            //sortorder: "desc",
            height: "auto",
            //shrinkToFit: true,
            //autowidth: true,
            width: 950,
            rownumbers: false,
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Descripción de los Créditos",
            loadComplete: function (data) {
                var thisId = $.jgrid.jqID(this.id);
            },
            footerrow: true,
            gridComplete: function () {
                /*
                var $this = $(this)
                var colSum = $(this).jqGrid('getCol', 'abrobactualmonto', false, 'sum');
                $footerRow = $(this.grid.sDiv).find("tr.footrow")
                $this.jqGrid('footerData', 'set', { plazoresidual: "DIRECTO:", abrobactualmonto: colSum }, false);
                */
                var $this = $(this),
                    sum = $this.jqGrid("getCol", "abrobactualmonto", false, "sum"),
                    sum2 = $this.jqGrid("getCol", "deudaactualmonto", false, "sum"),
                    sum3 = $this.jqGrid("getCol", "someaprobmonto", false, "sum"),
                    $footerRow = $(this.grid.sDiv).find("tr.footrow"),
                    localData = $this.jqGrid("getGridParam", "data"),
                    totalRows = localData.length,
                    totalSum = 0,
                    $newFooterRow,
                    $newFooterRow2,
                    $newFooterRow3,
                    i;

                $newFooterRow = $(this.grid.sDiv).find("tr.myfootrow");
                $newFooterRow2 = $(this.grid.sDiv).find("tr.myfootrow");
                $newFooterRow3 = $(this.grid.sDiv).find("tr.myfootrow");
                if ($newFooterRow.length === 0) {
                    // add second row of the footer if it's not exist
                    $newFooterRow = $footerRow.clone();
                    $newFooterRow.removeClass("footrow").addClass("myfootrow ui-widget-content");
                    $newFooterRow.children("td").each(function () {
                        this.style.width = ""; // remove width from inline CSS
                    });
                    $newFooterRow.insertAfter($footerRow);
                }
                if ($newFooterRow2.length === 0) {
                    // add second row of the footer if it's not exist
                    $newFooterRow2 = $newFooterRow.clone();
                    $newFooterRow2.removeClass("footrow").addClass("myfootrow ui-widget-content");
                    $newFooterRow2.children("td").each(function () {
                        this.style.width = ""; // remove width from inline CSS
                    });
                    $newFooterRow2.insertAfter($newFooterRow);
                }
                if ($newFooterRow3.length === 0) {
                    // add second row of the footer if it's not exist
                    $newFooterRow3 = $newFooterRow2.clone();
                    $newFooterRow3.removeClass("footrow").addClass("myfootrow ui-widget-content");
                    $newFooterRow3.children("td").each(function () {
                        this.style.width = ""; // remove width from inline CSS
                    });
                    $newFooterRow3.insertAfter($newFooterRow2);
                }
                $this.jqGrid("footerData", "set", { plazoresidual: "Directo", abrobactualmonto: sum, deudaactualmonto: sum2, someaprobmonto: sum3  });

                // calculate the value for the second footer row
                
                $newFooterRow.find(">td[aria-describedby=" + this.id + "_plazoresidual]").text("Contingente:");
                $newFooterRow.find(">td[aria-describedby=" + this.id + "_abrobactualmonto]").text(
                    0
                );
                $newFooterRow.find(">td[aria-describedby=" + this.id + "_deudaactualmonto]").text(
                    0
                );
                $newFooterRow.find(">td[aria-describedby=" + this.id + "_someaprobmonto]").text(
                    0
                );

                $newFooterRow2.find(">td[aria-describedby=" + this.id + "_plazoresidual]").text("Derivados (EC):");
                $newFooterRow2.find(">td[aria-describedby=" + this.id + "_abrobactualmonto]").text(
                    0
                );
                $newFooterRow2.find(">td[aria-describedby=" + this.id + "_deudaactualmonto]").text(
                    0
                );
                $newFooterRow2.find(">td[aria-describedby=" + this.id + "_someaprobmonto]").text(
                    0
                );

                $newFooterRow3.find(">td[aria-describedby=" + this.id + "_plazoresidual]").text("Entrega Diferida:");
                $newFooterRow3.find(">td[aria-describedby=" + this.id + "_abrobactualmonto]").text(
                    0
                );
                $newFooterRow3.find(">td[aria-describedby=" + this.id + "_deudaactualmonto]").text(
                    0
                );
                $newFooterRow3.find(">td[aria-describedby=" + this.id + "_someaprobmonto]").text(
                    0
                );
                




            }
        });

        $gridTab.jqGrid('navGrid', '#navGridLineas', { edit: true, add: true, del: true, search: false },
            {
                editCaption: "Modificar Linea",
                closeAfterEdit: true,
                recreateForm: true,
                template: tmpl,
                mtype: 'POST',
                url: '/lineas/action',
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
                addCaption: "Agregar Linea",
                closeAfterAdd: true,
                recreateForm: true,
                template: tmpl,
                mtype: 'POST',
                url: '/lineas/action',
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
                    return { idsolicitudcotizacion: parentRowKey, fecha: lafechastring };
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
                url: '/lineas/action',
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
    }
}