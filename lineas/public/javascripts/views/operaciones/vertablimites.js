var gridvertablimites = {

    renderGrid: function (loadurl, targ) {
        var $gridTab2 = $(targ + "_t")
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





        $gridTab2.jqGrid({
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
                {
                    label: 'Descripcion', name: 'Descripcion', width: 40, hidden: false, search: true, editable: true, editrules: { required: true },
                    formatter: function (cellvalue, options, rowObject) {
                        var idlimite = rowObject.Id;
                        var dato = '<a class="muestraop" href="#' + idlimite + '">' + cellvalue + '</a>';
                        return dato;
                    }
                },
                //{ label: '', name: 'PlazoResudual', width: 30, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'Moneda', name: 'Moneda', width: 25, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'Aprobado', name: 'Aprobado', width: 30, hidden: false, search: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                { label: 'Utilizado', name: 'Utilizado', width: 30, hidden: false, search: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                { label: 'Reservado', name: 'Reservado', width: 30, hidden: false, search: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                { label: 'Disponible', name: 'Disponible', width: 30, hidden: false, search: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                {
                    label: 'Condicion', name: 'Condicion', width: 20, hidden: false, search: true, editable: true, align: 'center',
                    formatter: function (cellvalue, options, rowObject) {
                        rojo = '<span role="button" class="muestracond" href="#'+ rowObject.Id +'" aria-hidden="true" ><img src="../../../../images/redcircle.png" width="19px"/></span>';
                        //console.log(rowObject.Id);
                        amarillo = '<span role="button" class="muestracond" href="#'+ rowObject.Id +'" aria-hidden="true" ><img src="../../../../images/yellowcircle.png" width="19px"/></span>';
                        verde = '<span role="button" class="muestracond" href="#'+ rowObject.Id +'" aria-hidden="true" ><img src="../../../../images/greencircle.png" width="25px"/></span>';
                        //console.log(cellvalue);
                        if (cellvalue === 'Rojo') {
                            return rojo
                        }
                        else {
                            if (cellvalue === 'Verde') {
                                return verde
                            } 
                            else {
                                return amarillo
                            }
                        }
                    }
                },
                {
                    label: 'Bloqueo', name: 'Bloqueo_N', width: 15, hidden: false, search: true, editable: true, align: 'center',
                    formatter: function (cellvalue, options, rowObject) {
                        dato = '<span role="button" class="glyphicon glyphicon-lock bloqueo" aria-hidden="true" href="#' + rowObject.Id + 'style= "font-size: 15px"></span>'
                        return dato;
                    }
                },
                {
                    label: 'Detalle', name: 'Detalle_N', width: 15, hidden: false, search: true, editable: true, align: 'center',
                    formatter: function (cellvalue, options, rowObject) {
                        var dato = '<span role="button" class="glyphicon glyphicon-th-list muestradet" href="#' + rowObject.Id + '"></span>';
                        //dato = `<span role="button" class="glyphicon glyphicon-th-list" aria-hidden="true onclick="yourFunction()"></span>`
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
            gridComplete: function () {
                $gridTab2.jqGrid('navButtonAdd', '#navGridtabverlimites', {
                    caption: "IMPRIMIR",
                    buttonicon: "",
                    title: "Imprimir",
                    position: "last",
                    onClickButton: function () {
                        var grid = $gridTab2
                        var rowKey = grid.getGridParam("selrow");
                        var url = '#';
                        $gridTab2.jqGrid('excelExport', { "url": url });
                    }
                });
            },
            loadComplete: function () {

                $gridTab2.append(`
                    <div class="modal fade" id="myModal" role="dialog">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    <h4 class="modal-title">Operaciones</h4>
                                </div>
                                <div class="modal-body">
                                    <p>Aqui muestro las operaciones del limite: <span id="ellimite"></span></p>
                                    <div id="operaciones"></div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal fade" id="myModal2" role="dialog">
                        <div class="modal-dialog modal-sm">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    <h4 class="modal-title">Detalle Limite</h4>
                                </div>
                                <div class="modal-body">
                                    <p>Detalles del Limite N°: <span id="ellimite2"></span></p>
                                    <p>Plazo: <span id="Plazo"></span></p>
                                    <p>FechaVencimiento: <span id="FechaVencimiento"></span></p>
                                    <p>Comentarios: <span id="Comentarios"></span></p>
                                    <p>Condiciones: <span id="Condiciones"></span></p>

                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal fade" id="myModalbloqueo" role="dialog">
                        <div class="modal-dialog modal-sm">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    <h4 class="modal-title">Bloqueo de Linea</h4>
                                </div>
                                <div class="modal-body">
                                    <div class="form-group">
                                        <label class="radio-inline"><input type="radio" name="optradio">Total</label>
                                        <label class="radio-inline"><input type="radio" name="optradio">Parcial</label>
                                    </div>
                                        
                                        <div class="form-group">
                                        <label for="monto">Monto:</label>
                                        <input type="text" class="form-control" id="monto">
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Aceptar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal fade" id="myModalCondicionL" role="dialog">
                        <div class="modal-dialog modal-sm">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    <h4 class="modal-title">Detalle Condicion</h4>
                                </div>
                                <div class="modal-body">
                                    <p>Condiciones del Limite N°: <span id="ellimite3"></span></p>
                                    <p>Condicion: <span id="Condicion2"></span></p>
                                    <p>Condiciones: <span id="Condiciones2"></span></p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div> 
        `);



                $('.muestraop').click(function () {
                    var idlimite = $(this).attr('href');
                    $('#ellimite').html(idlimite.substring(1))
                    console.log("estamos listos")
                    $.ajax({
                        type: "GET",
                        url: '/veroperacionesmodal/' + idlimite.substring(1),
                        async: false,
                        success: function (data) {
                            if (data.length > 0) {

                                var operaciones = `
                                <div class="table-responsive clear">
	<table class="table">
		<thead>
			<tr>
				<th width="10%" ng-click="predicate = 'dato1'; reverse=!reverse">
					Tipo OP
					<i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato1', 'ion-ios-arrow-up': predicate == 'dato1'}"></i>
				</th>
				<th width="10%" ng-click="predicate = 'dato2'; reverse=!reverse">
					N° Producto
					<i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato2', 'ion-ios-arrow-up': predicate == 'dato2'}"></i>
				</th>
				<th width="15%" ng-click="predicate = 'dato3'; reverse=!reverse">
					F. Otorgamiento
					<i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato3', 'ion-ios-arrow-up': predicate == 'dato3'}"></i>
				</th>
				<th width="15%" ng-click="predicate = 'dato4'; reverse=!reverse">
					F. Prox. Venc.
					<i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato4', 'ion-ios-arrow-up': predicate == 'dato4'}"></i>
				</th>
				<th width="10%" ng-click="predicate = 'dato5'; reverse=!reverse">
					Moneda
					<i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato5', 'ion-ios-arrow-up': predicate == 'dato5'}"></i>
                </th>
                <th width="10%" ng-click="predicate = 'dato5'; reverse=!reverse">
					Monto Inic.
					<i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato6', 'ion-ios-arrow-up': predicate == 'dato5'}"></i>
                </th>
                <th width="10%" ng-click="predicate = 'dato5'; reverse=!reverse">
					Monto Act.
					<i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato7', 'ion-ios-arrow-up': predicate == 'dato5'}"></i>
                </th>
                <th width="10%" ng-click="predicate = 'dato5'; reverse=!reverse">
					Monto Act. Eq. M/Lin
					<i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato8', 'ion-ios-arrow-up': predicate == 'dato5'}"></i>
                </th>
                <th width="10%" ng-click="predicate = 'dato5'; reverse=!reverse">
					Monto Act. Eq. M/N M$
					<i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato9', 'ion-ios-arrow-up': predicate == 'dato5'}"></i>
				</th>
			</tr>
		</thead>
		<tbody>
                                `
                                for (var i = 0; i < data.length; i++) {
                                    operaciones += "<tr ng-repeat='dato in manual.demoListado | orderBy:predicate:reverse'>"
                                    operaciones += "<td>"
                                    operaciones += data[i].TipoOperacion
                                    operaciones += "</td>"
                                    operaciones += "<td>"
                                    operaciones += data[i].NumeroProducto
                                    operaciones += "</td>"
                                    operaciones += "<td>"
                                    operaciones += data[i].FechaOtorgamiento
                                    operaciones += "</td>"
                                    operaciones += "<td>"
                                    operaciones += data[i].FechaProxVenc
                                    operaciones += "</td>"
                                    operaciones += "<td>"
                                    operaciones += data[i].Moneda
                                    operaciones += "</td>"
                                    operaciones += "<td>"
                                    operaciones += data[i].MontoInicial
                                    operaciones += "</td>"
                                    operaciones += "<td>"
                                    operaciones += data[i].MontoActual
                                    operaciones += "</td>"
                                    operaciones += "<td>"
                                    operaciones += data[i].MontoActualMLinea
                                    operaciones += "</td>"
                                    operaciones += "<td>"
                                    operaciones += data[i].MontoActualMNac
                                    operaciones += "</td>"
                                    operaciones += "</tr>"
                                }
                                operaciones += "</tbody></table></div>"
                                $("#operaciones").html(operaciones)
                            } else {
                                alert("No existe cliente en Base de Datos");
                            }
                        }
                    });
                    $("#myModal").modal();
                });

                $('.muestradet').click(function () {
                    var idlimite = $(this).attr('href');
                    $('#ellimite2').html(idlimite.substring(1))
                    $.ajax({
                        type: "GET",
                        url: '/verdetalleslim/' + idlimite.substring(1),
                        async: false,
                        success: function (data) {
                            if (data.length > 0) {
                                $("#Riesgo").html(data[0].Riesgo)
                                $("#Descripcion").html(data[0].Descripcion)
                                $("#Moneda").html(data[0].Moneda)
                                $("#Aprobado").html(data[0].Aprobado)
                                $("#Utilizado").html(data[0].Utilizado)
                                $("#Reservado").html(data[0].Reservado)
                                $("#Disponible").html(data[0].Disponible)
                                $("#Condicion").html(data[0].Condicion)
                                $("#Plazo").html(data[0].Plazo)
                                $("#FechaVencimiento").html(data[0].FechaVencimiento)
                                $("#Comentarios").html(data[0].Comentarios)
                                $("#Condiciones").html(data[0].Condiciones)
                            }
                            else {
                                alert("No existe cliente en Base de Datos");
                            }
                        }
                    });
                    $("#myModal2").modal();
                });

                $('.muestracond').click(function () {
                    var idlimite = $(this).attr('href');
                    $('#ellimite3').html(idlimite.substring(1))
                    $.ajax({
                        type: "GET",
                        url: '/verdetalleslim/' + idlimite.substring(1),
                        async: false,
                        success: function (data) {
                            if (data.length > 0) {               
                                $("#Condicion2").html(data[0].Condicion)
                                $("#Condiciones2").html(data[0].Condiciones)
                            }
                            else {
                                //alert("No existe cliente en Base de Datos");
                            }
                        }
                    });
                    $("#myModalCondicionL").modal();
                });

                $('.bloqueo').click(function () {
                    var idlimite = $(this).attr('href');

                    $("#myModalbloqueo").modal();
                });

                var thisId = $.jgrid.jqID(this.id);

                var sum1 = $gridTab2.jqGrid('getCol', 'Aprobado', false, 'sum');
                var sum2 = $gridTab2.jqGrid('getCol', 'Utilizado', false, 'sum');
                var sum3 = $gridTab2.jqGrid('getCol', 'Reservado', false, 'sum');
                var sum4 = $gridTab2.jqGrid('getCol', 'Disponible', false, 'sum');
                /*var sum5 = $("#" + childGridID).jqGrid('getCol', 'Total', false, 'sum');
                var sum6 = $("#" + childGridID).jqGrid('getCol', 'VarAprobacion', false, 'sum');
                var sum7 = $("#" + childGridID).jqGrid('getCol', 'DeudaBanco', false, 'sum');
                var sum8 = $("#" + childGridID).jqGrid('getCol', 'GarantiaReal', false, 'sum');
                var sum9 = $("#" + childGridID).jqGrid('getCol', 'SBIFACHEL', false, 'sum');
                var sum10 = $("#" + childGridID).jqGrid('getCol', 'Penetracion', false, 'avg');
                */

                $gridTab2.jqGrid('footerData', 'set',
                    {
                        Moneda: 'Total (MM$) :',
                        Aprobado: sum1,
                        Utilizado: sum2,
                        Reservado: sum3,
                        Disponible: sum4,
                        Bloqueo_N: 'CANDADO'
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

        $gridTab2.jqGrid('navGrid', '#navGridtabverlimites', { edit: false, add: false, del: false, search: false },
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
                    var rowKey = $gridTab2.getGridParam("selrow");
                    var rowData = $gridTab2.getRowData(rowKey);
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




    }
}

function subGridsublimite2(subgrid_id, row_id) {//cambiar el nombre a la funcion si se copia la plantilla!!!!
    //console.log('hola');
    gridvertabsublimites(subgrid_id, row_id, 'sublimite'); //sublimite es el nombre con el que quedaran los divs en la subgrilla (/verlimite.js)
    //gridOperacion(subgrid_id, row_id, 'veroperacion');
    //gridGarantias(subgrid_id, row_id, 'vergarantias');
}
