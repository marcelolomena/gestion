var gridvertablimites = {

    renderGrid: function (loadurl, targ) {
        var $gridTab = $(targ + "_t")
        /*
        $gridTab.prepend(`
            <div class='form-row'>
                <div class="panel-body">
                    <button type="button" class="btn btn-primary btn-md">Medium</button>
                </div>
            </div>
        `);
        */
        var tmpl = "<div id='responsive-form' class='clearfix'>";
        tmpl += "<div class='form-row'>";
        tmpl += `<div id="operacionmac" class='column-full'>Garantías Disponibles: <br />
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
            //colNames: ['Id', 'Nombre', 'Rut', 'ActividadEconomica','RatingGrupal', 'NivelAtribucion','RatingIndividual', 'Clasificacion', 'Vigilancia','FechaInformacionFinanciera', 'PromedioSaldoVista', 'DeudaSbif', 'AprobadoVinculado','EquipoCobertura','Oficina','FechaCreacion','FechaVencimiento','FechaVencimientoMacAnterior','Empresa_Id'],
            colModel: [
                {
                    label: 'Id', name: 'Id', index: 'Id', key: true, hidden: true, width: 10,
                    editable: true, hidedlg: true, sortable: false, editrules: { edithidden: false },
                },
                { label: 'Mac Individual', name: 'MacIndividual_Id', hidden: true, editable: true },
                { label: 'N°', name: 'Numero', width: 15, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'Riesgo', name: 'Riesgo', width: 20, hidden: false, search: true, editable: true, editrules: { required: true } },
                //{ label: 'TipoLimite', name: 'Tipolimite', width: 30, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'Descripcion', name: 'Descripcion', width: 40, hidden: false, search: true, editable: true, editrules: { required: true } },
                //{ label: '', name: 'PlazoResudual', width: 30, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'Moneda', name: 'Moneda', width: 25, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'Aprobado', name: 'Aprobado', width: 30, hidden: false, search: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                { label: 'Utilizado', name: 'Utilizado', width: 30, hidden: false, search: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                { label: 'Reservado', name: 'Reservado', width: 30, hidden: false, search: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                { label: 'Disponible', name: 'Disponible', width: 30, hidden: false, search: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                {
                    label: 'Condicion', name: 'Condicion', width: 20, hidden: false, search: true, editable: true, align: 'center',
                    formatter: function (cellvalue, options, rowObject) {
                        dato = '<span class="glyphicon glyphicon-asterisk" aria-hidden="true" style="color: Green ; font-size: 15px; text-align: center;"></span>';
                        dato2 = '<span class="glyphicon glyphicon-asterisk" aria-hidden="true" style="color: Red ; font-size: 15px"></span>';
                        dato3 = '<span class="glyphicon glyphicon-asterisk" aria-hidden="true" style="color: Yellow ; font-size: 15px"></span>';
                        console.log(cellvalue);
                        if (cellvalue === 'Rojo') {
                            return dato2
                        }
                        else {
                            if (cellvalue === 'Verde') {
                                return dato
                            }
                            else {
                                return dato3
                            }
                        }
                    }
                },
                {
                    label: 'Bloqueo', name: 'Bloqueo_N', width: 15, hidden: false, search: true, editable: true, align: 'center',
                    formatter: function (cellvalue, options, rowObject) {
                        dato = '<span class="glyphicon glyphicon-lock" aria-hidden="true" style= "font-size: 15px"></span>'
                        return dato;
                    }
                },
                {
                    label: 'Detalle', name: 'Detalle_N', width: 15, hidden: false, search: true, editable: true, align: 'center',
                    formatter: function (cellvalue, options, rowObject) {
                        dato = '<span class="glyphicon glyphicon-align-justify" aria-hidden="true" style= "font-size: 15px"></span>'
                        return dato;
                    }
                },

            ],

            rowNum: 20,
            pager: '#navGridtabverlimites',
            styleUI: "Bootstrap",
            //sortname: 'fecha',
            //sortorder: "desc",
            height: "auto",
            //shrinkToFit: true,
            //autowidth: true,
            width: 1350,
            subGrid: true,
            subGridRowExpanded: subGridsublimite2, //se llama la funcion de abajo
            subGridOptions: {
                plusicon: "glyphicon-hand-right",
                minusicon: "glyphicon-hand-down"
            },
            rownumbers: false,
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Detalle Limites",
            footerrow: true,
            loadComplete: function () {
                var thisId = $.jgrid.jqID(this.id);
                console.log("estamos listos")
                var sum1 = $gridTab.jqGrid('getCol', 'Aprobado', false, 'sum');
                var sum2 = $gridTab.jqGrid('getCol', 'Utilizado', false, 'sum');
                var sum3 = $gridTab.jqGrid('getCol', 'Reservado', false, 'sum');
                var sum4 = $gridTab.jqGrid('getCol', 'Disponible', false, 'sum');
                /*var sum5 = $("#" + childGridID).jqGrid('getCol', 'Total', false, 'sum');
                var sum6 = $("#" + childGridID).jqGrid('getCol', 'VarAprobacion', false, 'sum');
                var sum7 = $("#" + childGridID).jqGrid('getCol', 'DeudaBanco', false, 'sum');
                var sum8 = $("#" + childGridID).jqGrid('getCol', 'GarantiaReal', false, 'sum');
                var sum9 = $("#" + childGridID).jqGrid('getCol', 'SBIFACHEL', false, 'sum');
                var sum10 = $("#" + childGridID).jqGrid('getCol', 'Penetracion', false, 'avg');
                */

                $gridTab.jqGrid('footerData', 'set',
                    {
                        Moneda: 'Total (MM$) :',
                        Aprobado: sum1,
                        Utilizado: sum2,
                        Reservado: sum3,
                        Disponible: sum4
                        /*Total : sum5,
                        VarAprobacion : sum6,
                        DeudaBanco: sum7,
                        GarantiaReal: sum8,
                        SBIFACHEL: sum9,
                        Penetracion: sum10
                        */
                    });
            },


        });

        $gridTab.jqGrid('navGrid', '#navGridtabverlimites', { edit: false, add: false, del: false, search: false },
            {
                editCaption: "Modificar Límite",
                closeAfterEdit: true,
                recreateForm: true,
                template: tmpl,
                mtype: 'POST',
                url: '/vertablimites/1',
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
        $gridTab.jqGrid('navButtonAdd', '#navGridtabverlimites', {
            caption: "IMPRIMIR",
            buttonicon: "",
            title: "Imprimir",
            position: "last",
            onClickButton: function () {
                var grid = $gridTab
                var rowKey = grid.getGridParam("selrow");
                var url = '#';
                $gridTab.jqGrid('excelExport', { "url": url });
            }
        });


    }
}

function subGridsublimite2(subgrid_id, row_id) {//cambiar el nombre a la funcion si se copia la plantilla!!!!
    console.log('hola');
    gridvertabsublimites(subgrid_id, row_id, 'sublimite'); //sublimite es el nombre con el que quedaran los divs en la subgrilla (/verlimite.js)
    //gridOperacion(subgrid_id, row_id, 'veroperacion');
    //gridGarantias(subgrid_id, row_id, 'vergarantias');
}
