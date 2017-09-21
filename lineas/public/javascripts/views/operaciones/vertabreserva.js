var gridvertabreserva = {

    renderGrid: function (loadurl, targ) {
        var $gridTabreserva = $(targ + "_t")

        var formatear = 
        {
            formatearNumero: function (nStr) {
                nStr += '';
                x = nStr.split('.');
                x1 = x[0];
                x2 = x.length > 1 ? ',' + x[1] : '';
                var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + '.' + '$2');
                }
                return x1 + x2;
            }
        }
        /*
        $gridTabreserva.prepend(`
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

        $gridTabreserva.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            //colNames: ['Id', 'Nombre', 'Rut', 'ActividadEconomica','RatingGrupal', 'NivelAtribucion','RatingIndividual', 'Clasificacion', 'Vigilancia','FechaInformacionFinanciera', 'PromedioSaldoVista', 'DeudaSbif', 'AprobadoVinculado','EquipoCobertura','Oficina','FechaCreacion','FechaVencimiento','FechaVencimientoMacAnterior','Empresa_Id'],
            colModel: [
                {
                    label: 'Id', name: 'Id', index: 'Id', key: true, hidden: true, width: 10,
                    editable: true, hidedlg: true, sortable: false, editrules: { edithidden: false },
                },
                { label: 'Mac Individual', name: 'MacIndividual_Id', hidden: true, editable: true, align: 'right' },
                { label: 'N°', name: 'Numero', width: 6, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
                { label: 'Riesgo', name: 'Riesgo', width: 20, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
                //{ label: 'TipoLimite', name: 'Tipolimite', width: 30, hidden: false, search: true, editable: true, editrules: { required: true } },
                {
                    label: 'Descripcion', name: 'Descripcion', width: 40, hidden: false, search: true, editable: true, align: 'left', editrules: { required: true },
                },
                //{ label: '', name: 'PlazoResudual', width: 30, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'Moneda', name: 'Moneda', width: 25, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
                { label: 'Aprobado (Miles)', name: 'Aprobado', width: 30, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                { label: 'Utilizado (Miles)', name: 'Utilizado', width: 30, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                { label: 'Reservado (Miles)', name: 'Reservado', width: 30, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                { label: 'DisponiblePesos', name: 'DisponiblePesos', hidden: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true }, },
                { label: 'AprobadoPesos', name: 'AprobadoPesos', hidden: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true }, },
                { label: 'UtilizadoPesos', name: 'UtilizadoPesos', hidden: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true }, },
                {
                    label: 'Disponible', name: 'Disponible', width: 30, hidden: false, search: true, editable: true, align: 'right', editrules: { required: true },
                    formatter: function (cellvalue, options, rowObject) {
                        var bloq = 0;
                        //var coment = "";
                        $.ajax({
                            type: "GET",
                            url: '/verdetallebloqueo/' + rowObject.Id,
                            async: false,
                            success: function (data) {
                                if (data.length > 0) {
                                    bloq = data[0].Monto;
                                   // coment = data[0].Comentario;
                                }
                            }
                        })  
                        var disponible = rowObject.Disponible;
                        var dispo = disponible - bloq;
                        return formatear.formatearNumero(dispo);
                    }
                },
                {
                    label: 'Condicion', name: 'ColorCondicion', width: 20, hidden: true, search: true, editable: true, align: 'right', align: 'center'
                },
                {
                    label: 'Bloqueo', name: 'Bloqueo_N', width: 15, hidden: true, search: true, editable: true, align: 'right', align: 'center'
                },
                {
                    label: 'Detalle', name: 'Detalle_N', width: 15, hidden: true, search: true, editable: true, align: 'right', align: 'center'
                },
                {
                    label: 'Reservar', name: 'Reservar', width: 15, hidden: true, search: true, editable: true, align: 'right', align: 'center' 
                },

            ],

            rowNum: 20,
            pager: '#navGridReseravar',
            styleUI: "Bootstrap",
            //sortname: 'fecha',
            //sortorder: "desc",
            height: "auto",
            shrinkToFit: true,
            //autowidth: true,
            width: 1500,
            subGrid: true,
            subGridRowExpanded: subGridsublimite3, //se llama la funcion de abajo
            subGridOptions: {
                plusicon: "glyphicon-hand-right",
                minusicon: "glyphicon-hand-down"
            },
            rownumbers: false,
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Generar Reserva",
            footerrow: true,
            userDataOnFooter : false,
            gridComplete: function () {
                $gridTabreserva.jqGrid('navButtonAdd', '#navGridtabverlimites', {
                    caption: "IMPRIMIR",
                    buttonicon: "",
                    title: "Imprimir",
                    position: "last",
                    onClickButton: function () {
                        var grid = $gridTabreserva
                        var rowKey = grid.getGridParam("selrow");
                        var url = '#';
                        $gridTabreserva.jqGrid('excelExport', { "url": url });
                    }
                });
            },
            loadComplete: function () {

                var recs = $gridTabreserva.getGridParam("reccount");
                if (isNaN(recs) || recs == 0) {
                    //$("#" + childGridID).addRowData("blankRow", { "id": 0, "Descripcion": " ", "Aprobado": "0" });
                    $gridTabreserva.parent().parent().remove();
                    //$gridTabreservaPagerID.hide();

                }

                var rows = $gridTabreserva.getDataIDs();
                for (var i = 0; i < rows.length; i++) {
                    var eldisponible = $gridTabreserva.getRowData(rows[i]).Disponible;
                    if (parseInt(eldisponible) < 0) {
                        $gridTabreserva.jqGrid('setCell', rows[i], "Disponible", "", { formatter: 'number', color: 'red' });
                    }  
                }

          
                var thisId = $.jgrid.jqID(this.id);
                var sum1 = $gridTabreserva.jqGrid('getCol', 'AprobadoPesos', false, 'sum');
                var sum2 = $gridTabreserva.jqGrid('getCol', 'UtilizadoPesos', false, 'sum');
                var sum3 = $gridTabreserva.jqGrid('getCol', 'Reservado', false, 'sum');
                var sum4 = $gridTabreserva.jqGrid('getCol', 'DisponiblePesos', false, 'sum');


                $gridTabreserva.jqGrid('footerData', 'set',
                    {
                        Moneda: 'Total (CLP) :',
                        Aprobado: (formatear.formatearNumero(sum1)),
                        Utilizado: (formatear.formatearNumero(sum2)),
                        Reservado: (formatear.formatearNumero(sum3)),
                        Disponible: (formatear.formatearNumero(sum4)),
                        Bloqueo_N: '<span role="button" class="fa fa-lock bloqueartodo" aria-hidden="true" href="#" style= "font-size: 20px;"></span>'
                        /*Total : sum5,
                        VarAprobacion : sum6,
                        DeudaBanco: sum7,
                        GarantiaReal: sum8,
                        SBIFACHEL: sum9,
                        Penetracion: sum10
                        */
                    },false);
            },
        });
        $gridTabreserva.jqGrid('setLabel', 'Numero', '', { 'text-align': 'center' });
        $gridTabreserva.jqGrid('setLabel', 'Riesgo', '', { 'text-align': 'center' });
        $gridTabreserva.jqGrid('setLabel', 'Descripcion', '', { 'text-align': 'center' });
        $gridTabreserva.jqGrid('setLabel', 'Moneda', '', { 'text-align': 'center' });
        $gridTabreserva.jqGrid('setLabel', 'Aprobado', '', { 'text-align': 'center' });
        $gridTabreserva.jqGrid('setLabel', 'Utilizado', '', { 'text-align': 'center' });
        $gridTabreserva.jqGrid('setLabel', 'Disponible', '', { 'text-align': 'center' });
        $gridTabreserva.jqGrid('setLabel', 'ColorCondicion', '', { 'text-align': 'center' });
        $gridTabreserva.jqGrid('setLabel', 'Bloqueo_N', '', { 'text-align': 'center' });
        $gridTabreserva.jqGrid('setLabel', 'Detalle_N', '', { 'text-align': 'center' });
        $gridTabreserva.jqGrid('setLabel', 'Reservar', '', { 'text-align': 'center' });

        $gridTabreserva.jqGrid('navGrid', '#navGridReseravar', { edit: false, add: true, del: false, search: false },
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
                    var rowKey = $gridTabreserva.getGridParam("selrow");
                    var rowData = $gridTabreserva.getRowData(rowKey);
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
                    ret = $gridTabreserva.getRowData($gridTabreserva.jqGrid('getGridParam', 'selrow'));
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

function subGridsublimite3(subgrid_id, row_id) {//cambiar el nombre a la funcion si se copia la plantilla!!!!
    //console.log('hola');
    gridvertreservasublimites(subgrid_id, row_id, 'sublimite'); //sublimite es el nombre con el que quedaran los divs en la subgrilla (/verlimite.js)
}
