var gridvertabasignaciones = {

    renderGrid: function (loadurl, targ) {
        var $gridTab4 = $(targ + "_t")
        /*
        $gridTab2.prepend(`
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

        $gridTab4.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            //colNames: ['Id', 'Nombre', 'Rut', 'ActividadEconomica','RatingGrupal', 'NivelAtribucion','RatingIndividual', 'Clasificacion', 'Vigilancia','FechaInformacionFinanciera', 'PromedioSaldoVista', 'DeudaSbif', 'AprobadoVinculado','EquipoCobertura','Oficina','FechaCreacion','FechaVencimiento','FechaVencimientoMacAnterior','Empresa_Id'],
            colModel: [
                {
                    label: 'Id', name: 'Id', index: 'Id', key: true, hidden: true, width: 10,
                    editable: true, hidedlg: true, sortable: false, editrules: { edithidden: false },
                },
                { label: 'Rut', name: 'RutEmpresa', width: 6, hidden: true, editable: true, align: 'left' },
                { label: 'Descripcion Producto', name: 'DescripcionProducto', width: 6, hidden: false, editable: true, align: 'left' },
                { label: 'Tipo Operacion', name: 'TipoOperacion', width: 3, hidden: false, editable: true, align: 'center' },
                { label: 'NumeroProducto', name: 'NumeroProducto', width: 3, hidden: false, editable: true, align: 'center' },

                { label: 'Moneda', name: 'Moneda', width: 3, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
                { label: 'Monto Inicial', name: 'MontoInicial', width: 3, hidden: false, search: true, editable: true, align: 'right', editrules: { required: true } },
                { label: 'Monto Actual', name: 'MontoActual', width: 3, hidden: false, search: true, editable: true, align: 'right', editrules: { required: true } },
                {
                    label: 'Asignar Operacion', name: 'n', width: 3, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true },

                    formatter: function (cellvalue, options, rowObject) {
                        var dato = '<span role="button" class="glyphicon glyphicon-import asignar" href="#' + rowObject.RutEmpresa + '" aria-hidden="true"></span>';

                        return dato;
                    }
                },


                //{ label: '', name: 'PlazoResudual', width: 30, hidden: false, search: true, editable: true, editrules: { required: true } },
                //{ label: 'Moneda', name: 'Moneda', width: 5, hidden: false, search: true, editable: true,align: 'right', editrules: { required: true } },
                //{ label: 'Monto Inicial', name: 'MontoInicial', width: 5, hidden: false, search: true, editable: true,align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                //{ label: 'Monto Actual', name: 'MontoActual', width: 10, hidden: false, search: true, editable: true,align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                //{ label: 'Monto Actual Equiv.M /Linea', name: 'MontoActualMLinea', width: 15, hidden: false, search: true, editable: true,align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                /*{
                    label: 'Monto Actual Equiv. M/N M$', name: 'Condicion', width: 15, hidden: false, search: true, editable: true, align: 'center',
                */

            ],

            rowNum: 20,
            pager: '#navGridveroperaciones2',
            styleUI: "Bootstrap",
            //sortname: 'fecha',
            //sortorder: "desc",
            height: "auto",
            shrinkToFit: true,
            //autowidth: true,
            width: 1350,

            subGrid: false,
            subGridRowExpanded: subGridOperaciones2, //se llama la funcion de abajo
            subGridOptions: {
                plusicon: "glyphicon-hand-right",
                minusicon: "glyphicon-hand-down",
                expandOnLoad: true
            },
            rownumbers: false,
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Asignar Operaciones",
            footerrow: false,
            gridComplete: function () {
                $gridTab4.jqGrid('navButtonAdd', '#navGridveroperaciones', {
                    caption: "IMPRIMIR",
                    buttonicon: "",
                    title: "Imprimir",
                    position: "last",
                    onClickButton: function () {
                        var grid = $gridTab4
                        var rowKey = grid.getGridParam("selrow");
                        var url = '#';
                        $gridTab4.jqGrid('excelExport', { "url": url });
                    }
                });
            },
            loadComplete: function () {

                $gridTab4.append(`
                <div class="modal fade" id="myModalAsignar" role="dialog">
                    <div class="modal-dialog modal-lg" style="width:90%; >
                        <div class="modal-content">
                            <div class="modal-body">
                                <div class="panel panel-default" >
                                    <div class="panel-heading" style="background-color: #002464;color: #fff;">Asignar Operaciones</div>
                                        <div class="panel-body">
                                            <div class="gcontainer">
                                                <table id="grid"></table>
                                                <div id="pager"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    `);

                $('.asignar').click(function () {

                    $("#myModalAsignar").modal();
                    var elrutqueviene = $(this).attr('href');
                    var elrutquenecesito = elrutqueviene.substring(1)

                    var elcaption = "Límites";

                    var template = "";
                    var modelLimites = [
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
                            formatter: function (cellvalue, options, rowObject) {
                                var idlimite = rowObject.Id;
                                var dato = cellvalue;
                                //var dato = '<a class="muestraop" href="#' + idlimite + '">' + cellvalue + '</a>';
                                return dato;
                            }
                        },
                        //{ label: '', name: 'PlazoResudual', width: 30, hidden: false, search: true, editable: true, editrules: { required: true } },
                        { label: 'Moneda', name: 'Moneda', width: 25, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
                        { label: 'Aprobado (Miles)', name: 'Aprobado', width: 30, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                        { label: 'Utilizado (Miles)', name: 'Utilizado', width: 30, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                        { label: 'Reservado (Miles)', name: 'Reservado', width: 30, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                        {
                            label: 'Disponible', name: 'Disponible2', width: 30, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true },
                            formatter: function (cellvalue, options, rowObject) {
                                var bloq = 0;
                                var disp = 0;
                                $.ajax({
                                    type: "GET",
                                    url: '/verdetalleslim/' + rowObject.Id,
                                    async: false,
                                    success: function (data) {
                                        if (data.length > 0) {
                                            bloq = data[0].Bloqueado;
                                            disp = data[0].Disponible;
                                            //console.log("valor de bloqueo " + bloq);
                                        }
                                    }
                                })
                                return (disp - bloq);
                            }
                        },



                    ];

                    $("#grid").jqGrid({
                        url: '/limite/' + elrutquenecesito,
                        mtype: "GET",
                        datatype: "json",
                        rowNum: 20,
                        pager: "#pager",
                        height: 'auto',
                        shrinkToFit: true,
                        width: 1250,
                        subGrid: true,
                        subGridRowExpanded: subGridsublimite2, //se llama la funcion de abajo
                        subGridOptions: {
                            plusicon: "glyphicon-hand-right",
                            minusicon: "glyphicon-hand-down"
                        },
                        page: 1,
                        colModel: modelLimites,
                        regional: 'es',
                        //autowidth: true,
                        caption: elcaption,
                        viewrecords: true,
                        rowList: [5, 10, 20, 50],
                        styleUI: "Bootstrap",
                        editurl: '/grupoempresa',
                        loadError: sipLibrary.jqGrid_loadErrorHandler,
                        gridComplete: function () {
                            var recs = $("#grid").getGridParam("reccount");
                            if (isNaN(recs) || recs == 0) {

                                $("#grid").addRowData("blankRow", { "nombre": "No hay datos" });
                            }
                        }
                    });

                    $("#grid").jqGrid('navGrid', "#pager", {
                        edit: false, add: false, del: false, search: false,
                        refresh: false, view: false, position: "left", cloneToTop: false
                    },
                        {
                            closeAfterEdit: true,
                            recreateForm: true,
                            ajaxEditOptions: sipLibrary.jsonOptions,
                            serializeEditData: sipLibrary.createJSON,
                            editCaption: "Modifica Grupo",
                            //template: template,
                            errorTextFormat: function (data) {
                                return 'Error: ' + data.responseText
                            }
                        },
                        {
                            closeAfterAdd: true,
                            recreateForm: true,
                            ajaxEditOptions: sipLibrary.jsonOptions,
                            serializeEditData: sipLibrary.createJSON,
                            addCaption: "Agregar Empresa",
                            template: template,
                            errorTextFormat: function (data) {
                                return 'Error: ' + data.responseText
                            },
                            beforeShowForm: function (form) {
                                $("input#Nombre").prop('disabled', true);
                                $("input#RazonSocial").prop('disabled', true);
                            },
                            afterSubmit: function (response, postdata) {
                                var json = response.responseText;
                                var result = JSON.parse(json);
                                if (result.error != "0")
                                    return [false, "Error en llamada a Servidor", ""];
                                else
                                    return [true, "", ""]

                            }, afterShowForm: function (form) {
                                sipLibrary.centerDialog($("#grid").attr('Id'));

                            },
                            onclickSubmit: function (rowid) {
                                return { grupo: "1" };
                            }
                        },
                        {
                            closeAfterDelete: true,
                            recreateForm: true,
                            ajaxEditOptions: sipLibrary.jsonOptions,
                            serializeEditData: sipLibrary.createJSON,
                            addCaption: "Eliminar Empresa",
                            errorTextFormat: function (data) {
                                return 'Error: ' + data.responseText
                            }, afterSubmit: function (response, postdata) {
                                var json = response.responseText;
                                var result = JSON.parse(json);
                                if (result.success != true)
                                    return [false, result.error_text, ""];
                                else
                                    return [true, "", ""]
                            },
                            onclickSubmit: function (rowid) {
                                var rowKey = $("#grid").getGridParam("selrow");
                                var rowData = $("#grid").getRowData(rowKey);
                                var thissid = rowData.idrelacion;
                                return { idrelacion: thissid };
                            }
                        },
                        {
                            recreateFilter: true
                        }
                    );


                });
            }


        });


        $gridTab4.jqGrid('navGrid', '#navGridtabverlimites', { edit: false, add: false, del: false, search: false },
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
                    var rowKey = $gridTab4.getGridParam("selrow");
                    var rowData = $gridTab4.getRowData(rowKey);
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
                    ret = $gridTab2.getRowData($gridTab2.jqGrid('getGridParam', 'selrow'));
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

        $gridTab4.jqGrid('setLabel', 'DescripcionProducto', '', { 'text-align': 'center' });
        $gridTab4.jqGrid('setLabel', 'TipoOperacion', '', { 'text-align': 'center' });
        $gridTab4.jqGrid('setLabel', 'NumeroProducto', '', { 'text-align': 'center' });
        $gridTab4.jqGrid('setLabel', 'Moneda', '', { 'text-align': 'center' });
        $gridTab4.jqGrid('setLabel', 'MontoInicial', '', { 'text-align': 'center' });
        $gridTab4.jqGrid('setLabel', 'MontoActual', '', { 'text-align': 'center' });
        $gridTab4.jqGrid('setLabel', 'n', '', { 'text-align': 'center' });

        function subGridOperaciones2(subgrid_id, row_id) {
            gridOperaciones2(subgrid_id, row_id, 'operaciones2');
        }




    }
}


