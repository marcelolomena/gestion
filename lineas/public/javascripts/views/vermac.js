var gridVermac = {

    renderGrid: function (loadurl, targ) {
        var $gridTab = $(targ + "_t")

        var tmpl = "<div id='responsive-form' class='clearfix'>";

        tmpl += "<div class='form-row'>";
        tmpl += `<div id="garantiascliente" class='column-full'>Garantías Disponibles: <br />
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
            colNames: ['Id', 'MacIndividual_Id', 'N° Aprob', 'T. Riesgo', 'Tipo Límite','Descripción', 'P. Residual', 'Moneda','Aprobado', 'Deuda', 'Some. Aprob', 'G. Estatal'],
            colModel: [
                {
                    name: 'Id', index: 'Id', key: true, hidden: true, width: 10,
                    editable: true, hidedlg: true, sortable: false, editrules: { edithidden: false },
                },
                { name: 'MacIndividual_Id', hidden: true, editable: true },
                { name: 'Numero', width: 60, hidden: false, search: true, editable: true, editrules: { required: true } },
                { name: 'TipoRiesgo', width: 60, hidden: false, search: true, editable: true, editrules: { required: true } },
                { name: 'Tipolimite', width: 100, hidden: false, search: true, editable: true, editrules: { required: true } },
                { name: 'Comentario', width: 250, hidden: false, search: true, editable: true, editrules: { required: true } },
                { name: 'PlazoResudual', width: 120, hidden: false, search: true, editable: true, editrules: { required: true } },
                { name: 'Moneda', width: 60, hidden: false, search: true, editable: true, editrules: { required: true } },
                { name: 'MontoAprobado', width: 100, hidden: false, search: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 2 }, editrules: { required: true } },
                { name: 'DeudaActual', width: 100, hidden: false, search: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 2 }, editrules: { required: true } },
                { name: 'MontoAprobacion', width: 100, hidden: false, search: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 2 }, editrules: { required: true } },
                
                
                { name: 'Garantiaestatal', width: 60, hidden: false, search: true, editable: true, editrules: { required: true } },
                
            ],
            rowNum: 20,
            pager: '#navGridVermac',
            styleUI: "Bootstrap",
            //sortname: 'fecha',
            //sortorder: "desc",
            height: "auto",
            //shrinkToFit: true,
            //autowidth: true,
            width: 1350,
            subGrid: true,
            subGridRowExpanded: subGridSublimite,
            subGridOptions: {
                plusicon: "glyphicon-hand-right",
                minusicon: "glyphicon-hand-down"
            },
            rownumbers: false,
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Descripción de los Limites",
            loadComplete: function (data) {
                var thisId = $.jgrid.jqID(this.id);
            },
            
        });

        $gridTab.jqGrid('navGrid', '#navGridVermac', { edit: false, add: false, del: false, search: false },
            {
                editCaption: "Modificar Límite",
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
                addCaption: "Agregar Límite",
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

    }
}
function subGridSublimite(subgrid_id, row_id) {
    gridSublimiteOp(subgrid_id, row_id, 'sublimite');
    //gridGarantia(subgrid_id, row_id, 'garantia');
}