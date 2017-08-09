function gridsublimiteoperaciones(parentRowID, parentRowKey, suffix) {
    //console.log('hola');
    var subgrid_id = parentRowID;
    var row_id = parentRowKey;
    var subgrid_table_id, pager_id, toppager_id;
    subgrid_table_id = subgrid_id + '_t';
    pager_id = 'p_' + subgrid_table_id;
    toppager_id = subgrid_table_id + '_toppager';
    if (suffix) {
        subgrid_table_id += suffix;
        pager_id += suffix;
    }

    var oldRadio = ""

    var tmplPF = "<div id='responsive-form' class='clearfix'>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-full'>Pregunta<span style='color:red'>*</span>{ArchivoUpload}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row' style='display: none;'>";
    tmplPF += "</div>";

    tmplPF += "<hr style='width:100%;'/>";
    tmplPF += "<div> {sData} {cData}  </div>";
    tmplPF += "</div>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    var childGridURL = "/getsublimitesoperaciones/" + parentRowKey;

    var modelOperacion = [
        {
            label: 'Id', name: 'Id', index: 'Id', key: true, hidden: true, width: 10,
            editable: true, hidedlg: true, sortable: false, editrules: { edithidden: false },
        },
        
        { label: 'Tipo Operacion', name: 'TipoOperacion', width: 8, hidden: false, editable: true,align: 'right' },
        { label: 'Nro Producto', name: 'NumeroProducto', width: 8, hidden: false, search: true, editable: true,align: 'right', editrules: { required: true } },
        { label: 'Fecha Otorgamiento', name: 'FechaOtorgamiento', width: 10, hidden: false, search: true, editable: true,align: 'right', editrules: { required: true } },
        //{ label: 'TipoLimite', name: 'Tipolimite', width: 30, hidden: false, search: true, editable: true, editrules: { required: true } },
        {
            label: 'Fecha Prox Vencimiento', name: 'FechaProxVenc', width: 12, hidden: false, search: true, editable: true,align: 'right', editrules: { required: true },
        },
        //{ label: '', name: 'PlazoResudual', width: 30, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Moneda', name: 'Moneda', width: 5, hidden: false, search: true, editable: true,align: 'right', editrules: { required: true } },
        { label: 'Monto Inicial', name: 'MontoInicial', width: 5, hidden: false, search: true, editable: true,align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
        { label: 'Monto Actual', name: 'MontoActual', width: 10, hidden: false, search: true, editable: true,align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
        { label: 'Monto Actual Equiv.M /Linea', name: 'MontoActualMLinea', width: 15, hidden: false, search: true, editable: true,align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
        {
            label: 'Monto Actual Equiv. M/N M$', name: 'MontoActualMNac', width: 15, hidden: false, search: true, editable: true, align: 'right',formatter: 'number', formatoptions: { decimalPlaces: 0 },
        },
    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        rowNum: 100,
        datatype: "json",
        //caption: 'Resumen Sub-Limites',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        page: 1,
        colModel: modelOperacion,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        //pager: "#" + childGridPagerID,
        /*
        subGrid: true,
        subGridRowExpanded: showSubGrids3,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        */

        editurl: '/limite/action3',
        loadComplete: function () {
            $("#" + childGridID).append(`
                    <div class="modal fade" id="myModal3" role="dialog">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    <h4 class="modal-title">Operaciones</h4>
                                </div>
                                <div class="modal-body">
                                    <p>Sub-Limite: <span id="ellimite"></span></p>
                                    <div id="operaciones"></div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal fade" id="myModal4" role="dialog">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    <h4 class="modal-title"></h4>
                                </div>
                                <div class="modal-body">
                                    <p>Sub-Limite N°: <span id="ellimite2"></span></p>
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
                    <div class="modal fade" id="myModalbloqueo2" role="dialog">
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
        `);


            $('.muestraop2').click(function () {
                var idlimite = $(this).attr('href');
                $('#ellimite').html(idlimite.substring(1))
                console.log("estamos listos")
                $.ajax({
                    type: "GET",
                    url: '/veroperacionesmodal2/' + idlimite.substring(1),
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
                $("#myModal3").modal();
            });

            $('.muestradet2').click(function () {
                var idlimite = $(this).attr('href');
                $('#ellimite2').html(idlimite.substring(1))
                $.ajax({
                    type: "GET",
                    url: '/verdetalleslim2/' + idlimite.substring(1),
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
                $("#myModal4").modal();
            });

            $('.bloqueo2').click(function () {
                    var idlimite = $(this).attr('href');

                    $("#myModalbloqueo2").modal();
                });
        },

        gridComplete: function () {
            //$("#" + childGridID).css("margin-left", "6px");
            
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {
                //$("#" + childGridID).addRowData("blankRow", { "id": 0, "Descripcion": " ", "Aprobado": "0" });
                $("#" + childGridID).parent().parent().remove();
                $("#" + childGridPagerID).hide();

            }
            var rows = $("#" + childGridID).getDataIDs();
            for (var i = 0; i < rows.length; i++) {

                $("#" + childGridID).jqGrid('setRowData', rows[i], false, { background: '#f5f5f5' });

            }
            

        },
        footerrow: false,
        /*
        loadComplete: function () {
            var sum1 = $("#" + childGridID).jqGrid('getCol', 'Directo', false, 'sum');
            var sum2 = $("#" + childGridID).jqGrid('getCol', 'Contingente', false, 'sum');
            var sum3 = $("#" + childGridID).jqGrid('getCol', 'Derivados', false, 'sum');
            var sum4 = $("#" + childGridID).jqGrid('getCol', 'Diferida', false, 'sum');
            var sum5 = $("#" + childGridID).jqGrid('getCol', 'Total', false, 'sum');
            var sum6 = $("#" + childGridID).jqGrid('getCol', 'VarAprobacion', false, 'sum');
            var sum7 = $("#" + childGridID).jqGrid('getCol', 'DeudaBanco', false, 'sum');
            var sum8 = $("#" + childGridID).jqGrid('getCol', 'GarantiaReal', false, 'sum');
            var sum9 = $("#" + childGridID).jqGrid('getCol', 'SBIFACHEL', false, 'sum');
            var sum10 = $("#" + childGridID).jqGrid('getCol', 'Penetracion', false, 'avg');

            $("#" + childGridID).jqGrid('footerData', 'set',
                {
                    Vigilancia: 'Totales:',
                    Directo: sum1,
                    Contingente: sum2,
                    Derivados: sum3,
                    Diferida: sum4,
                    Total: sum5,
                    VarAprobacion: sum6,
                    DeudaBanco: sum7,
                    GarantiaReal: sum8,
                    SBIFACHEL: sum9,
                    Penetracion: sum10

                });
        } */

    });
/*
    $("#" + childGridID).closest("div.ui-jqgrid-view")
        .children("div.ui-jqgrid-hdiv")
        .hide();
*/

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false, add: false, del: false, search: false, refresh: true, view: false, position: "left", cloneToTop: false,
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            width: 800,
            editCaption: "Modificar Pregunta de Evaluación",
            template: tmplPF,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            },
            beforeSubmit: function (postdata, formid) {
                var elporcentaje = parseFloat(postdata.porcentaje);
                //console.log('porcentaje: ' + elporcentaje);
                if (elporcentaje > 100) {
                    return [false, "Porcentaje no puede ser mayor a 100", ""];
                }
                else {
                    return [true, "", ""]
                }
            },
        },
        {
            addCaption: "Agrega Preguntas",
            mtype: 'POST',
            url: '/sic/criteriosevaluacion/action3',
            closeAfterAdd: true,
            recreateForm: true,
            template: tmplPF,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            beforeShowForm: function (form) {
                //$('input#notacriticidad', form).attr('readonly', 'readonly');
            },

            onclickSubmit: function (rowid) {
                return { idclaseevaluaciontecnica: parentbisabuelo, childGridID: childGridID, idcriterioevaluacion2: parentRowKey };
            }

        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Eliminar Pregunta",
            mtype: 'POST',
            url: '/sic/criteriosevaluacion/action3',
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }
        },
        {
            recreateFilter: true
        }
    );

    /*
        function showSubGrids3(subgrid_id, row_id) {
            gridCriterios3(subgrid_id, row_id, 'criterios2');
        }
        */


}