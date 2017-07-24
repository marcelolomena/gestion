var gridoperacionmac = {

    renderGrid: function (loadurl, targ) {
        var $gridTab = $(targ + "_t")

        var tmpl = "<div id='responsive-form' class='clearfix'>";
        tmpl += "<div class='form-row'>";
        tmpl += `<div id="operacionmac" class='column-full'>Garantías Disponibles: <br />
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
            //colNames: ['Id', 'Nombre', 'Rut', 'ActividadEconomica','RatingGrupal', 'NivelAtribucion','RatingIndividual', 'Clasificacion', 'Vigilancia','FechaInformacionFinanciera', 'PromedioSaldoVista', 'DeudaSbif', 'AprobadoVinculado','EquipoCobertura','Oficina','FechaCreacion','FechaVencimiento','FechaVencimientoMacAnterior','Empresa_Id'],
            colModel: [
                {
                    name: 'Id', index: 'Id', key: true, hidden: true, width: 10,
                    editable: true, hidedlg: true, sortable: false, editrules: { edithidden: false },
                },
                { label: 'Nombre', name: 'Nombre', hidden: true, editable: true },
                { label: 'Rut', name: 'Rut', width: 60, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'ActividadEconomica',name: 'ActividadEconomica', width: 60, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'RatingGrupal', name: 'RatingGrupal', width: 60, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'NivelAtribucion', name: 'NivelAtribucion', width: 60, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'RatingIndividual', name: 'RatingIndividual', width: 60, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'Clasificacion', name: 'Clasificacion', width: 60, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'Vigilancia', name: 'Vigilancia', width: 60, hidden: false, search: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 2 }, editrules: { required: true } },
                { label: 'FechaInformacion', name: 'FechaInformacion', width: 60, hidden: false, search: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 2 }, editrules: { required: true } },
                { label: 'PromedioSaldoVista', name: 'PromedioSaldoVista', width: 60, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'DeudaSbif', name: 'DeudaSbif', width: 60, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'AprovadoVinculado', name: 'AprovadoVinculado', width: 60, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'EquipoCobertura', name: 'EquipoCobertura', width: 60, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'Oficina', name: 'Oficina', width: 60, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'FechaCreacion', name: 'FechaCreacion', width: 60, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'FechaVencimiento', name: 'FechaVencimiento', width: 60, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'FechaVencimientoMacAnterior', name: 'FechaVencimientoMacAnterior', width: 60, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'Empresa_Id', name: 'Empresa_Id', width: 60, hidden: false, search: true, editable: true, editrules: { required: true } },

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
            subGridRowExpanded: subGridSublimite, //se llama la funcion de abajo
            subGridOptions: {
                plusicon: "glyphicon-hand-right",
                minusicon: "glyphicon-hand-down"
            },
            rownumbers: false,
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Resumen Mac",
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
                url: '/operacionmac/1',
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

                    
                    
                    if (parseInt(postdata.fechavencimiento) == 0) {
                        return [false, "Color: Debe escoger un valor", ""];
                    } if (postdata.comentario.trim().length == 0) {
                        return [false, "Comentario: Debe ingresar un comentario", ""];
                    } else {
                    return [true, "", ""]
                    }
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
      //gridSublimiteOp(subgrid_id, row_id, 'sublimite');
      //gridOperacion(subgrid_id, row_id, 'veroperacion');
      //gridGarantias(subgrid_id, row_id, 'vergarantias');
}
      