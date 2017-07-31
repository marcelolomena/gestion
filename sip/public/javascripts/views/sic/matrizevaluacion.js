//doc.js
var gridMatrizEvaluacion = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        //var $gridTab = $(targ + "_t")
        var $gridTab = $(targ + "_t_" + parentRowKey)

        var tmplServ = "<div id='responsive-form' class='clearfix'>";

        tmplServ += "<hr style='width:100%;'/>";
        tmplServ += "<div> {sData} {cData}  </div>";
        tmplServ += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['id', 'idsolicitudcotizacion', 'idServicio', 'Servicio', 'Porcentaje Servicio', 'Glosa Servicio', 'Porcentaje Económico', 'Porcentaje Técnico', 'Clase Evaluación Técnica', 'Clase Evaluación Técnica'],
            colModel: [
                { name: 'id', index: 'id', key: true, hidden: true },

                { name: 'idsolicitudcotizacion', index: 'idsolicitudcotizacion', hidden: true },
                {
                    name: 'idservicio', search: false, editable: true, hidden: true,
                    edittype: "select",
                    editoptions: {
                        dataUrl: '/sic/servicios/' + parentRowKey + '/list',
                        buildSelect: function (response) {
                            var rowKey = $gridTab.getGridParam("selrow");
                            var rowData = $gridTab.getRowData(rowKey);
                            var thissid = rowData.idservicio;
                            var data = JSON.parse(response);
                            var s = "<select>";//el default
                            s += '<option value="0">--Seleccione un Servicio--</option>';
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
                { name: 'servicio.nombre', index: 'servicio', width: 350, editable: true, editoptions: { size: 10 } },
                {
                    name: 'porcentajeservicio', index: 'porcentajeservicio', width: 150, align: 'left',
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
                },
                { name: 'glosaservicio', index: 'glosaservicio', width: 250, editable: true, editoptions: { size: 25 }, editrules: { required: true } },
                {
                    name: 'porcentajeeconomico', index: 'porcentajeeconomico', width: 180, align: 'left',
                    formatoptions: { decimalPlaces: 0 },
                    editoptions: {
                        dataInit: function (el) {
                            $(el).mask('000', { reverse: true, placeholder: "___" });
                        },
                        dataEvents: [{
                            type: 'change', fn: function (e) {
                                var porcentajeeconomico = $(this).val();
                                console.log("el % eco: " + porcentajeeconomico)
                                var porcentajetecnico = 100 - parseInt(porcentajeeconomico)
                                console.log("el % tec: " + porcentajetecnico)
                                $("input#porcentajetecnico").val(porcentajetecnico);

                            }
                        }]
                    },
                    formatter: function (cellvalue, options, rowObject) {
                        var dato = '';
                        var val = rowObject.porcentajeeconomico;
                        dato = val * 100;
                        return dato;
                    },
                    search: false, editable: true, hidden: false,
                    editrules: { edithidden: false, required: true },


                },
                {
                    name: 'porcentajetecnico', index: 'porcentajetecnico', width: 160, align: 'left',
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
                },
                {
                    name: 'claseevaluaciontecnica', search: false, editable: true, hidden: true,
                    edittype: "select",
                    editoptions: {
                        dataUrl: '/sic/clasesevaluacion',
                        buildSelect: function (response) {
                            var rowKey = $gridTab.getGridParam("selrow");
                            var rowData = $gridTab.getRowData(rowKey);
                            var thissid = rowData.claseevaluaciontecnica;
                            var data = JSON.parse(response);
                            var s = "<select>";//el default
                            s += '<option value="0">--Seleccione una Clase--</option>';
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
                { name: 'claseevaluacion.nombre', index: 'claseevaluacion.nombre', width: 200, editable: false, editoptions: { size: 10 } },

            ],
            rowNum: 10,
            rowList: [3, 6],
            pager: '#navGridMatriz',
            subGrid: true,
            subGridRowExpanded: showSubGridsEva1,
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
        $gridTab.jqGrid('navGrid', '#navGridMatriz', { edit: false, add: false, del: false, search: false },
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



    }
}

function showSubGridsEva1(subgrid_id, row_id) {
    gridEva1E(subgrid_id, row_id, 'evaeco');

    //gridEvaTotalEco(subgrid_id, row_id, 'evatotaleco');

    gridEva1(subgrid_id, row_id, 'evatec');

    //gridEvaTotalTec(subgrid_id, row_id, 'evatotaltec');
    //gridEvaTotalTec2(subgrid_id, row_id, 'evatotaltec2');

}


