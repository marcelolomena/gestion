function gridvertabsublimites(parentRowID, parentRowKey, suffix) {
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
    var rut = $("#param").text();
    var childGridURL = "/sublimite/" + parentRowKey+'/'+rut;

    var modelSublinea = [
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
                if (cellvalue != null) {
                    //var dato = '<a class="muestraop2" href="#' + idlimite + '">' + cellvalue + '</a>';
                    var dato = cellvalue
                }
                else {
                    var dato = "no existe sub limite";
                }
                return dato;
            }
        },
        //{ label: '', name: 'PlazoResudual', width: 30, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Moneda', name: 'Moneda', width: 25, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
        { label: 'Aprobado', name: 'Aprobado', width: 30, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
        { label: 'Utilizado', name: 'Utilizado', width: 30, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
        { label: 'Reservado', name: 'Reservado', width: 30, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
        { label: 'Disponible', name: 'Disponible', width: 30, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
        {
            label: 'Condicion', name: 'ColorCondicion', width: 20, hidden: false, search: true, editable: true, align: 'right', align: 'center',
            formatter: function (cellvalue, options, rowObject) {
                rojo = '<span><img src="../../../../images/redcircle.png" width="19px"/></span>';
                amarillo = '<span><img src="../../../../images/yellowcircle.png" width="19px"/></span>';
                verde = '<span><img src="../../../../images/greencircle.png" width="25px"/></span>';
                //console.log(" carlos ql " +cellvalue);
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
            label: 'Bloqueo', name: 'Bloqueo_N', width: 15, hidden: false, search: true, editable: true, align: 'right', align: 'center',
            formatter: function (cellvalue, options, rowObject) {
                dato = '<span role="button" class="fa fa-unlock-alt bloqueo" aria-hidden="true" href="#' + rowObject.Id + '" style= "font-size: 19px;"></span>'
                return dato;
            }
        },
        {
            label: 'Detalle', name: 'Detalle_N', width: 15, hidden: false, search: true, editable: true, align: 'right', align: 'center',
            formatter: function (cellvalue, options, rowObject) {
                var dato = '<span role="button" class="glyphicon glyphicon-folder-open muestradet2" aria-hidden="true" href="#' + rowObject.Id + '"></span>';

                //dato = `<span role="button" class="glyphicon glyphicon-th-list" aria-hidden="true onclick="yourFunction()"></span>`
                return dato;
            }
        },
        {
            label: 'Reservar', name: 'Detalle_N', width: 15, hidden: false, search: true, editable: true, align: 'right', align: 'center',
            formatter: function (cellvalue, options, rowObject) {
                var dato = '<span role="button" class="glyphicon glyphicon-import muestrareservasub" aria-hidden="true" href="#' + rowObject.Id + '"></span>';
                return dato;
            }
        },

    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        rowNum: 100,
        datatype: "json",
        //caption: 'Resumen Sub-Limites',
        width: 1500,
        //shrinkToFit: false,
        //autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        page: 1,
        colModel: modelSublinea,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        //pager: "#" + childGridPagerID,

        subGrid: true,
        subGridRowExpanded: showsublimiteoperaciones,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        ondblClickRow: function (rowid) {
            $(this).jqGrid("toggleSubGridRow", rowid);
        },


        editurl: '/limite/action3',
        loadComplete: function () {
            $("#" + childGridID).css("margin-left", "-6px");
            $("#" + childGridID).jqGrid("hideCol", "subgrid");
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
                                    <div class="panel panel-primary">
                                        <div class="form-group">
                                            <label class="radio-inline"><input type="radio" name="optradio">Total</label>
                                            <label class="radio-inline"><input type="radio" name="optradio">Parcial</label>
                                        </div>
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

                    <div class="modal fade" id="modalreservarsub" role="dialog " data-backdrop="false" style="z-index:500">
                    <div class="modal-dialog modal-lg" style="width:1150px;z-index:500;">
                        <div class="modal-content" >
                            <div class="panel-heading" style="background-color: #002464;color: #fff;">Generar Reserva</div>
                            <div class="modal-body" style="z-index:500">

                                <div class="gcontainer">
                                    <input type="text" class="form-control" id="rut" name="rut" style="background-color: #002464;display: none">
                                    <table id="gridreserva"></table>
                                    <div id="pager"></div>
                                </div>
                            </div>
                            
                            <div class="modal-footer">
                                <button id="btnCerrarSub" type="button" class="btn btn-default" data-dismiss="modal">Aceptar</button>
                            </div>

                        </div>
                    </div>
                </div> 
        `);

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


            //BOTÓN RESERVA SUB
            $('.muestrareservasub').click(function () {
                var idlimite = $(this).attr('href');
                console.log("valor id limite sin cortar " + idlimite);
                idlimite = idlimite.substring(1, 3);
                console.log("valor cortado " + idlimite)
                $("#modalreservarsub").modal();
                //var elrutqueviene = $(this).attr('href');
                //var elrutquenecesito = elrutqueviene.substring(1)

                var elcaption = "Operaciones";
                //console.log("el valor del rut es "+rut)
                var template = "";

                var modelOperacion = [
                    {
                        label: 'Id', name: 'Id', index: 'Id', key: true, hidden: true, width: 10,
                        editable: true, hidedlg: true, sortable: false
                    },

                    { label: 'Tipo Operacion', name: 'TipoOperacion', width: 8, hidden: false, editable: true, align: 'center' },
                    { label: 'Nro Producto', name: 'NumeroProducto', width: 8, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
                    { label: 'Fecha Otorgamiento', name: 'FechaOtorgamiento', width: 10, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
                    //{ label: 'TipoLimite', name: 'Tipolimite', width: 30, hidden: false, search: true, editable: true, editrules: { required: true } },
                    {
                        label: 'Fecha Prox Vencimiento', name: 'FechaProxVenc', width: 9, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true },
                    },
                    //{ label: '', name: 'PlazoResudual', width: 30, hidden: false, search: true, editable: true, editrules: { required: true } },
                    { label: 'Moneda', name: 'Moneda', width: 5, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
                    { label: 'Monto Inicial', name: 'MontoInicial', width: 8, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                    { label: 'Monto Actual', name: 'MontoActual', width: 6, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                    // { label: 'Monto Actual Equiv.M /Linea', name: 'MontoActualMLinea', width: 15, hidden: false, search: true, editable: true,align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                    {
                        label: 'Monto Actual Equiv. M/N', name: 'MontoActualMNac', width: 10, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 },
                    },
                    {
                        label: 'Rut Empresa', name: 'RutEmpresa', width: 10, hidden: true, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 },

                    },
                ];


                $("#gridreserva").jqGrid({
                    url: '/reservaroperacion/' + idlimite,
                    mtype: "GET",
                    datatype: "json",
                    rowNum: 20,
                    pager: "#pager",
                    height: 'auto',
                    shrinkToFit: true,
                    width: 1100,
                    subGrid: false,
                    subGridRowExpanded: subGridversublimiteasignaciones, //se llama la funcion de abajo
                    subGridOptions: {
                        plusicon: "glyphicon-hand-right",
                        minusicon: "glyphicon-hand-down"
                    },
                    page: 1,
                    colModel: modelOperacion,
                    regional: 'es',
                    //autowidth: true,
                    caption: elcaption,
                    viewrecords: true,
                    rowList: [5, 10, 20, 50],
                    styleUI: "Bootstrap",
                    editurl: '/postreservaroperacion',
                    loadError: sipLibrary.jqGrid_loadErrorHandler,
                    gridComplete: function () {
                        var recs = $("#gridreserva").getGridParam("reccount");
                        if (isNaN(recs) || recs == 0) {

                            $("#gridreserva").addRowData("blankRow", { "nombre": "No hay datos" });
                        }
                    },
                    loadComplete: function () {

                        var recs = $("#gridreserva").getGridParam("reccount");
                        if (isNaN(recs) || recs == 0) {
                            //$("#" + childGridID).addRowData("blankRow", { "id": 0, "Descripcion": " ", "Aprobado": "0" });
                            $("#gridreserva").parent().parent().remove();
                            // $gridTab2PagerID.hide();

                        }

                        var rows = $("#gridreserva").getDataIDs();
                        for (var i = 0; i < rows.length; i++) {
                            var eldisponible = $("#gridreserva").getRowData(rows[i]).Disponible;
                            if (parseInt(eldisponible) < 0) {
                                $("#gridreserva").jqGrid('setCell', rows[i], "Disponible", "", { color: 'red' });
                            }
                        }
                    }
                });


                $("#gridreserva").jqGrid('navGrid', "#pager", {
                    edit: true, add: true, del: true, search: false,
                    refresh: true, view: false, position: "left", cloneToTop: false
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
                        },
                        onclickSubmit: function (rowid) {
                            return { RutEmpresa: rut, Idlim: idlimite };
                        }
                    },
                    {
                        closeAfterAdd: true,
                        recreateForm: true,
                        ajaxEditOptions: sipLibrary.jsonOptions,
                        serializeEditData: sipLibrary.createJSON,
                        addCaption: "Agregar Operación",
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
                            if (result.error == "2")
                                return [false, "Error en llamada a Servidor", ""];
                            else
                                return [true, "Operacion Reservada"];

                        }, afterShowForm: function (form) {
                            sipLibrary.centerDialog($("#gridreserva").attr('Id'));

                        },
                        onclickSubmit: function (rowid) {
                            return { RutEmpresa: rut, Idlim: idlimite };
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
                            if (result.error != "0")
                                return [false, result.error_text, ""];
                            else
                                return [true, "", ""]
                        },
                        onclickSubmit: function (rowid) {
                            return { RutEmpresa: rut, Idlim: idlimite };
                        }
                    },
                    {
                        recreateFilter: true
                    }
                );
                //$("#gridreserva").reload();
                $("#pager").css("padding-bottom", "10px");
                // $("#rut").val(rut);
                // console.log(rut)

                function subGridversublimiteasignaciones(subgrid_id, row_id) {
                    //gridversublimitesasignaciones(subgrid_id, row_id, 'asignaciones');
                }
            });

            $("#btnCerrar").on("click", function (e) {
                
             console.log("llegue a la funcion!!")
             e.preventDefault();
             location.reload();
                
            });
        },

        gridComplete: function () {
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

    $("#" + childGridID).closest("div.ui-jqgrid-view")
        .children("div.ui-jqgrid-hdiv")
        .hide();


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


    function showsublimiteoperaciones(subgrid_id, row_id) {
        gridsublimiteoperaciones(subgrid_id, row_id, 'operaciones');
    }



}