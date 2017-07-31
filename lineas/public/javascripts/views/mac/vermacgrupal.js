var gridVermacgrupal = {

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
        tmpl += "<hr style='width:100%;'/>";
        tmpl += "<div> {sData} {cData}  </div>";
        tmpl += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            //colNames: ['Id', 'Nombre Grupo', 'Credito', 'Tipo Límite','Descripción', 'Plazo Residual', 'Moneda','Aprobado', 'Deuda', 'Some. Aprob', 'Condicion'],
            colModel: [
                { label: 'ID', name: 'Id', key: true, hidden: true },
                {
                    label: 'Rut',
                    name: 'Rut',
                    width: 80,
                    align: 'left',
                    search: false,
                    editable: true,
                    hidden: false
                },
                {
                    label: 'Cliente', name: 'Nombre', width: 150, hidden: false, search: true, editable: true, editrules: { required: true }
                },

                { label: 'R. Individ.', name: 'RatingIndividual', width: 80, hidden: false, search: true, editable: true, editrules: { required: true } },

                { label: 'Clasif.', name: 'Clasificacion', width: 70, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'Vigil.', name: 'Vigilancia', width: 70, hidden: false, search: true, editable: true, editrules: { required: true } },
                {
                    label: 'Directo', name: 'Directo', width: 100, hidden: false, search: true, editable: true,
                    formatter: function (cellvalue, options, rowObject) {
                        dato = parseInt(Math.floor((Math.random() * 200000) + 1000));
                        return dato
                    }
                },
                {
                    label: 'Contingente', name: 'Contingente', width: 100, hidden: false, search: true, editable: true,
                    formatter: function (cellvalue, options, rowObject) {
                        dato = Math.floor((Math.random() * 200000) + 1000);
                        return dato
                    }
                },
                {
                    label: 'Derivados', name: 'Derivados', width: 100, hidden: false, search: true, editable: true,
                    formatter: function (cellvalue, options, rowObject) {
                        dato = Math.floor((Math.random() * 200000) + 1000);
                        return dato
                    }
                },
                {
                    label: 'Entrega Dif.', name: 'Diferida', width: 100, hidden: false, search: true, editable: true,
                    formatter: function (cellvalue, options, rowObject) {
                        dato = Math.floor((Math.random() * 200000) + 1000);
                        return dato
                    }
                },
                {
                    label: 'Total', name: 'Total', width: 100, hidden: false, search: true, editable: true,
                    formatter: function (cellvalue, options, rowObject) {
                        dato = Math.floor((Math.random() * 200000) + 1000);
                        return dato
                    }
                },
                {
                    label: 'Var Aprob.', name: 'VarAprobacion', width: 100, hidden: false, search: true, editable: true,
                    formatter: function (cellvalue, options, rowObject) {
                        dato = Math.floor((Math.random() * 200000) + 1000);
                        return dato
                    }
                },
                {
                    label: 'Deuda Banco', name: 'DeudaBanco', width: 120, hidden: false, search: true, editable: true,
                    formatter: function (cellvalue, options, rowObject) {
                        dato = Math.floor((Math.random() * 200000) + 1000);
                        return dato
                    }
                },
                {
                    label: 'Gar. Real', name: 'GarantiaReal', width: 100, hidden: false, search: true, editable: true,
                    formatter: function (cellvalue, options, rowObject) {
                        dato = Math.floor((Math.random() * 200000) + 1000);
                        return dato
                    }
                },
                {
                    label: 'SBIF+ACHEL', name: 'SBIFACHEL', width: 100, hidden: false, search: true, editable: true,
                    formatter: function (cellvalue, options, rowObject) {
                        dato = Math.floor((Math.random() * 200000) + 1000);
                        return dato
                    }
                },
                {
                    label: 'Penetración', name: 'Penetracion', width: 100, hidden: false, search: true, editable: true,
                    formatter: function (cellvalue, options, rowObject) {
                        dato = Math.floor((Math.random() * 100) + 0);
                        return dato + '%'
                    }
                },




            ],
            rowNum: 20,
            pager: '#navGridVermacGrupal',
            styleUI: "Bootstrap",
            //sortname: 'fecha',
            //sortorder: "desc",
            height: "auto",
            //shrinkToFit: true,
            //autowidth: true,
            width: 1350,
            rownumbers: false,
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            loadComplete: function (data) {
                var thisId = $.jgrid.jqID(this.id);
            },
            gridComplete: function () {
                var rowIds = $gridTab.getDataIDs();
                $.each(rowIds, function (index, rowId) {
                    $gridTab.expandSubGridRow(rowId);
                });
            }

        });

        $gridTab.jqGrid('navGrid', '#navGridVermacGrupal', { edit: false, add: false, del: false, search: false },
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

function subGridMacIndividual(subgrid_id, row_id) {
    gridMacIndividual(subgrid_id, row_id, 'macindividual');
    //gridOperacion(subgrid_id, row_id, 'veroperacion');
}