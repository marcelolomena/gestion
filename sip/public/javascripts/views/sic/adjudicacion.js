//doc.js
var gridAdjudicacion = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        //var $gridTab = $(targ + "_t")
        var $gridTab = $(targ + "_t_" + parentRowKey)

        var tmplServ = "<div id='responsive-form' class='clearfix'>";

        tmplServ += "<hr style='width:100%;'/>";
        tmplServ += "<div> {sData} {cData}  </div>";
        tmplServ += "</div>";

        var colmodel = [];
        $.ajax({
            type: "GET",
            url: "/sic/adjudicacion/" + parentRowKey + "/cols",
            success: function (jsonData) {
                colmodel.push({ label: 'idserviciorequerido', name: 'idserviciorequerido', key: true, hidden: true })
                colmodel.push({ label: 'idsolicitudcotizacion', name: 'idsolicitudcotizacion', key: false, hidden: true })
                colmodel.push({ label: 'Servicio', name: 'nombre', index: 'nombre', width: 250, editable: true, editoptions: { size: 10 } }
                )
                colmodel.push({ label: 'Glosa', name: 'glosaservicio', index: 'glosaservicio', width: 150, editable: true, editoptions: { size: 25 }, editrules: { required: true } }
                )
                colmodel.push({
                    label: '% Servicio', name: 'porcentajeservicio', index: 'porcentajeservicio', width: 80, align: 'left',
                    formatoptions: { decimalPlaces: 0 },
                    editoptions: {
                        dataInit: function (el) {
                            $(el).mask('000', { reverse: true, placeholder: "___" });
                        }
                    },
                    formatter: function (cellvalue, options, rowObject) {
                        var dato = '';
                        var val = rowObject.porcentajeservicio;
                        dato = val * 100;
                        return dato;
                    },
                    search: false, editable: true, hidden: false,
                    editrules: { edithidden: false, required: true },
                })
                colmodel.push({
                    label: '% Económico', name: 'porcentajeeconomico', index: 'porcentajeeconomico', width: 100, align: 'left',
                    formatoptions: { decimalPlaces: 0 },
                    formatter: function (cellvalue, options, rowObject) {
                        var dato = '';
                        var val = rowObject.porcentajeeconomico;
                        dato = val * 100;
                        return dato;
                    },
                    search: false, editable: true, hidden: false,
                    editrules: { edithidden: false, required: true },


                })
                colmodel.push({
                    label: '% Técnico', name: 'porcentajetecnico', index: 'porcentajetecnico', width: 80, align: 'left',
                    formatoptions: { decimalPlaces: 0 },
                    editoptions: {
                        dataInit: function (el) {
                            $(el).mask('000', { reverse: true, placeholder: "___" });
                        }
                    },
                    formatter: function (cellvalue, options, rowObject) {
                        var dato = '';
                        var val = rowObject.porcentajeeconomico;
                        dato = 100 - (val * 100);
                        return dato;
                    },
                    search: false, editable: true, hidden: false,
                    editrules: { edithidden: false, required: true },
                })
                colmodel.push({
                    name: 'claseevaluaciontecnica', search: false, editable: true, hidden: true,
                })
                colmodel.push({ label: 'Clase Evaluación', name: 'clase', index: 'clase', width: 150, editable: false, editoptions: { size: 10 } })


                for (i = 0; i < jsonData.length; i++) {
                    colmodel.push({
                        label: jsonData[i].razonsocial, name: jsonData[i].razonsocial, key: false, hidden: false,
                        //formatter: 'number', formatoptions: { decimalPlaces: 2 }})
                        formatter: function (cellvalue, options, rowObject) {
                            var total = parseFloat(cellvalue).toFixed(2);

                            if (isNaN(total)) {
                                color = 'transparent';
                                total = '0'
                            } else {
                                color = 'transparent';
                            }


                            return '<span class="cellWithoutBackground" style="background-color:' + color + '; display:block; width: 50px; height: 16px;">'+total+'</span>';
                        }
                    }
                    )
                }


            }
        });
        console.dir(colmodel);
        setTimeout(function () {
            $gridTab.jqGrid({
                url: loadurl,
                datatype: "json",
                mtype: "GET",
                colModel: colmodel,
                rowNum: 10,
                rowList: [3, 6],
                pager: '#navGridAdj',

                subGrid: true,
                subGridRowExpanded: showSubGridsAdj,
                subGridOptions: {
                    plusicon: "glyphicon-hand-right",
                    minusicon: "glyphicon-hand-down"
                },
                styleUI: "Bootstrap",
                sortname: 'id',
                sortorder: "asc",
                shrinkToFit: false,
                height: "auto",
                onSelectRow: function (id) {
                    var getID = $(this).jqGrid('getCell', id, 'id');
                },
                viewrecords: true,
                caption: "Servicios",
                loadComplete: function (data) {
                    var thisId = $.jgrid.jqID(this.id);
                    $.get('/sic/getsession', function (data) {
                        $.each(data, function (i, item) {
                            console.log("EL ROL ES: " + item.glosarol)
                            if (item.glosarol != 'Administrador SIC' && item.glosarol != 'Negociador SIC') {
                                //$("#add_" + thisId).addClass('ui-disabled');
                                //$("#add_gridMaster").hide();
                                $("#edit_" + thisId).addClass('ui-disabled');
                                //$("#edit__gridMaster").hide();
                                //$("#del_" + thisId).addClass('ui-disabled');
                                //$("#del__gridMaster").hide();
                            }
                        });
                    });
                }
            });
            $gridTab.jqGrid('navGrid', '#navGridAdj', { edit: false, add: false, del: false, search: false },
                {
                    editCaption: "Modifica Servicio",
                    mtype: 'POST',
                    url: '/sic/criterios/action',
                    closeAfterEdit: true,
                    recreateForm: true,
                    template: tmplServ,
                    ajaxEditOptions: sipLibrary.jsonOptions,
                    serializeEditData: sipLibrary.createJSON,
                    beforeShowForm: function (form) {
                        $('input#notacriticidad', form).attr('readonly', 'readonly');
                        setTimeout(function () {
                            $("#idclasecriticidad", form).attr('disabled', 'disabled');
                            var porcentajeeconomico = $("input#porcentajeeconomico").val();
                            console.log("el % eco: " + porcentajeeconomico)
                            var porcentajetecnico = 100 - parseInt(porcentajeeconomico)
                            console.log("el % tec: " + porcentajetecnico)
                            $("input#porcentajetecnico").val(porcentajetecnico);
                        }, 450);



                    },
                    beforeSubmit: function (postdata, formid) {
                        if (postdata.idservicio == 0) {
                            return [false, "Servicio: Campo obligatorio", ""];
                        } if (postdata.claseevaluaciontecnica == 0) {
                            return [false, "Clase Evaluación Técnica : Campo obligatorio", ""];
                        } if (postdata.porcentajeeconomico > 100) {
                            return [false, "Porcentaje Económico no puede ser mayor a 100", ""];
                        } if (postdata.porcentajeservicio > 100) {
                            return [false, "Porcentaje Servicio no puede ser mayor a 100", ""];
                        } else {


                            return [true, "", ""]
                        }
                    }
                }, {
                    addCaption: "Agrega Servicio",
                    mtype: 'POST',
                    url: '/sic/servicios/action',
                    closeAfterAdd: true,
                    recreateForm: true,
                    template: tmplServ,
                    mtype: 'POST',
                    ajaxEditOptions: sipLibrary.jsonOptions,
                    serializeEditData: sipLibrary.createJSON,
                    beforeShowForm: function (form) {
                        $('input#notacriticidad', form).attr('readonly', 'readonly');
                    },
                    beforeSubmit: function (postdata, formid) {
                        if (postdata.idservicio == 0) {
                            return [false, "Servicio: Campo obligatorio", ""];
                        } if (postdata.idclasecriticidad == 0) {
                            return [false, "Clase Criticidad : Campo obligatorio", ""];
                        } if (postdata.idsegmento == 0) {
                            return [false, "Segmento Proveedor : Campo obligatorio", ""];
                        } else {
                            return [true, "", ""]
                        }
                    },
                    onclickSubmit: function (rowid) {
                        return { idsolicitudcotizacion: parentRowKey };
                    }

                },
                {
                    closeAfterDelete: true,
                    recreateForm: true,
                    ajaxEditOptions: sipLibrary.jsonOptions,
                    serializeEditData: sipLibrary.createJSON,
                    addCaption: "Eliminar Servicio",
                    mtype: 'POST',
                    url: '/sic/servicios/action',
                    errorTextFormat: function (data) {
                        return 'Error: ' + data.responseText
                    }
                }

            );

        }, 1000);

    }

}


function showSubGridsAdj(subgrid_id, row_id) {
    gridAdjudicados(subgrid_id, row_id, 'adjudica');
}



