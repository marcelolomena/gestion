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
                { label: 'Descripcion Producto', name: 'DescripcionProducto', width: 6, hidden: false, editable: true, align: 'left' },
                { label: 'Tipo Operacion', name: 'TipoOperacion', width: 3, hidden: false, editable: true, align: 'center' },
                { label: 'NumeroProducto', name: 'NumeroProducto', width: 3, hidden: false, editable: true, align: 'center' },

                { label: 'Moneda', name: 'Moneda', width: 3, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
                { label: 'Monto Inicial', name: 'MontoInicial', width: 3, hidden: false, search: true, editable: true, align: 'right', editrules: { required: true } },
                { label: 'Monto Actual', name: 'MontoActual', width: 3, hidden: false, search: true, editable: true, align: 'right', editrules: { required: true } },
                { label: 'Asignar Operacion', name: 'n', width: 3, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true },
                
                formatter: function (cellvalue, options, rowObject) {
                        var dato = '<span role="button" class="glyphicon glyphicon-import" aria-hidden="true"></span>';
            
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


