var gridAprobacion = {

    renderGrid: function (loadurl, targ) {
        var $gridTab = $(targ + "_t")
        var idmac = 11//targ.substring(4)

        $gridTab.html(
            `
            <div id="cabecera" class="panel panel-primary" style="width: 1250px">
                <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161;'>
                    <h3 align="center" class="panel-title">MEMORANDUM DE APROBACIÓN DE CRÉDITOS</h3>
                </div>
                <div class="panel-body">
                <ul class='nav nav-tabs tabs-up' id='myTabmac'>
                <li><a data-target='#limite' id='limite_tab' data-toggle='tabmac'>Anverso</a></li>
                <li><a data-target='#garantia' id='aprobacion_tab' data-toggle='tabgrupal'>Reverso</a></li>
                
            </ul>
            <div class='tab-content'>
                <div class='tab-pane active' id='limite'><div class='container-fluid'><table id='limite_t'></table><div id='navGridLimite'></div></div></div>
                <div class='tab-pane' id='aprobacion'><table id='aprobacion_t'></table><div id='navGridAprob'></div></div>
            </div>
                    <div>
                        <h5>I. IDENTIFICACIÓN</h5>
                        <div class="panel panel-primary">
                            <div class="row">
                                <div class="col-xs-1"><b>NOMBRE</b></div>
                                <div class="col-xs-5"><span id="nombre`+ idmac + `"></span></div>
                                <div class="col-xs-2"></div>
                                <div class="col-xs-2"><b>RATING GRUPO</b></div>
                                <div class="col-xs-1">7</div>
                            </div>
                            <div class="row">
                                <div class="col-xs-1"><b>RUT</b></div>
                                <div class="col-xs-3"><span id="rut`+ idmac + `"></span></div>
                                <div class="col-xs-2"></div>
                                <div class="col-xs-2"></div>
                                <div class="col-xs-2"><b>NIVEL ATRIBUCIÓN</b></div>
                                <div class="col-xs-1"><span id="nivelatribucion`+ idmac + `"></span></div>
                            </div>
                            <div class="row">
                                <div class="col-xs-1"><b>ACTIVIDAD</b></div>
                                <div class="col-xs-3"><span id="actividad`+ idmac + `"></span></div>
                                <div class="col-xs-2"></div>
                                <div class="col-xs-2"></div>
                                <div class="col-xs-2"><b>RATING INDIVIDUAL</b></div>
                                <div class="col-xs-1"><span id="ratingindividual`+ idmac + `"></span></div>
                            </div>
                            <div class="row">
                                <div class="col-xs-1"><b>OFIC/EJEC</b></div>
                                <div class="col-xs-3">Mayorista 1 / Marcela Castro C.</div>
                                <div class="col-xs-2"><b>FECHA PROX. VENC.</b></div>
                                <div class="col-xs-2"><span id="fechaproxvenc`+ idmac + `"></span></div>
                                <div class="col-xs-2"><b>CLASIFICACIÓN</b></div>
                                <div class="col-xs-1"><span id="clasificacion`+ idmac + `"></span></div>
                            </div>
                            <div class="row">
                                <div class="col-xs-1"><b>FECHA</b></div>
                                <div class="col-xs-3"><span id="fecha`+ idmac + `"></span></div>
                                <div class="col-xs-2"><b>FECHA VENC. ANT.</b></div>
                                <div class="col-xs-2"><span id="fechavencant`+ idmac + `"></span></div>
                                <div class="col-xs-2"><b>VIGILANCIA</b></div>
                                <div class="col-xs-1"><span id="vigilancia`+ idmac + `"></span></div>
                            </div>
                            <div class="row">
                                <div class="col-xs-1"></div>
                                <div class="col-xs-3"></div>
                                <div class="col-xs-2"></div>
                                <div class="col-xs-2"></div>
                                <div class="col-xs-2"><b>FECHA INFORMACIÓN</br>FINANCIERA</b></div>
                                <div class="col-xs-1"><span id="fechainfo`+ idmac + `"></span></div>
                            </div>
                        </div>
                        <h5>II. ANTECEDENTES (M$ a 31/05/2017)</h5>
                        <div class="panel panel-primary">
                            <div class="row">
                                <div class="col-xs-1"></div>
                                <div class="col-xs-1"></div>
                                <div class="col-xs-2"><b>DEUDA SBIF</b></div>
                                <div class="col-xs-1"><b>DIRECTA</b></div>
                                <div class="col-xs-2"><b>INDIRECTA</b></div>
                                <div class="col-xs-2"></div>
                                <div class="col-xs-1"><b>DIRECTA</b></div>
                            </div>
                            <div class="row">
                                <div class="col-xs-1"><b>P. SALDO </br>VISTA</br><span style="font-size:10px">(Ultimos 12 Meses)</span></b></div>
                                <div class="col-xs-1"><u><span id="promediosaldovista`+ idmac + `"></span></u></div>
                                <div class="col-xs-2">SIST. FINANCIERO</div>
                                <div class="col-xs-1"><u><span id="deudasbif`+ idmac + `"></span></u></div>
                                <div class="col-xs-2"><u>0</u></div>
                                <div class="col-xs-2">LEASING ACHEL</div>
                                <div class="col-xs-1"><u>65.983</u></div>
                            </div>
                        </div>
                        
                        <h5>III. DESCRIPCIÓN DE LOS CRÉDITOS</h5>
 
                        <div class="gcontainer">
                            <table id="gridlimites"></table>
                            <div id="pagerlimites"></div>
                        </div>

                    </div>         
                </div>
                
            </div>
        
        `)
        $.ajax({
            type: "GET",
            url: '/getmacindividual/' + idmac,
            async: false,
            success: function (data) {
                if (data.length > 0) {
                    //console.log("nombre"+idmac+" es "+data[0].Nombre)
                    $("#nombre" + idmac).html(data[0].Nombre)
                    $("#rut" + idmac).html(data[0].Rut)
                    $("#actividad" + idmac).html(data[0].ActividadEconomica)
                    $("#fecha" + idmac).html(data[0].FechaCreacion)
                    $("#fechaproxvenc" + idmac).html(data[0].FechaVencimiento)
                    $("#fechavencant" + idmac).html(data[0].FechaVencimientoMacAnterior)
                    $("#ratingindividual" + idmac).html(data[0].RatingIndividual)
                    $("#clasificacion" + idmac).html(data[0].Clasificacion)
                    $("#vigilancia" + idmac).html(data[0].Vigilancia)
                    $("#fechainfo" + idmac).html(data[0].FechaInformacionFinanciera)
                    $("#nivelatribucion" + idmac).html(data[0].NivelAtribucion)
                    $("#promediosaldovista" + idmac).html(data[0].PromedioSaldoVista)
                    $("#deudasbif" + idmac).html(data[0].DeudaSbif)

                } else {
                    alert("Error con datos del Mac Grupal")
                }
            }
        });
        //var elrutqueviene = $(this).attr('href');
        var elrutquenecesito = '79663940'

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
                label: 'Disponible (Miles)', name: 'Disponible2', width: 30, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true },
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
                     var dispo = disp - bloq;
                return (formatear.formatearNumero(dispo));
                }
            },



        ];

        $("#gridlimites").jqGrid({
            url: '/limite/' + elrutquenecesito,
            mtype: "GET",
            datatype: "json",
            rowNum: 20,
            pager: "#pagerlimites",
            height: 'auto',
            shrinkToFit: true,
            width: 1100,
            // subGrid: true,
            // subGridRowExpanded: subGridversublimiteasignaciones, //se llama la funcion de abajo
            // subGridOptions: {
            //     plusicon: "glyphicon-hand-right",
            //     minusicon: "glyphicon-hand-down"
            // },
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
            },
            loadComplete: function () {

                var recs = $("#grid").getGridParam("reccount");
                if (isNaN(recs) || recs == 0) {
                    //$("#" + childGridID).addRowData("blankRow", { "id": 0, "Descripcion": " ", "Aprobado": "0" });
                    $("#grid").parent().parent().remove();
                    $gridTab2PagerID.hide();

                }

                var rows = $("#grid").getDataIDs();
                for (var i = 0; i < rows.length; i++) {
                    var eldisponible = $("#grid").getRowData(rows[i]).Disponible;
                    if (parseInt(eldisponible) < 0) {
                        $("#grid").jqGrid('setCell', rows[i], "Disponible", "", { color: 'red' });
                    }
                }
            }
        });


        // $("#gridlimites").jqGrid('navGrid', "#pagerlimites", {
        //     edit: false, add: false, del: false, search: false,
        //     refresh: false, view: false, position: "left", cloneToTop: false
        // },
        //     {
        //         closeAfterEdit: true,
        //         recreateForm: true,
        //         ajaxEditOptions: sipLibrary.jsonOptions,
        //         serializeEditData: sipLibrary.createJSON,
        //         editCaption: "Modifica Grupo",
        //         //template: template,
        //         errorTextFormat: function (data) {
        //             return 'Error: ' + data.responseText
        //         }
        //     },
        //     {
        //         closeAfterAdd: true,
        //         recreateForm: true,
        //         ajaxEditOptions: sipLibrary.jsonOptions,
        //         serializeEditData: sipLibrary.createJSON,
        //         addCaption: "Agregar Empresa",
        //         template: template,
        //         errorTextFormat: function (data) {
        //             return 'Error: ' + data.responseText
        //         },
        //         beforeShowForm: function (form) {
        //             $("input#Nombre").prop('disabled', true);
        //             $("input#RazonSocial").prop('disabled', true);
        //         },
        //         afterSubmit: function (response, postdata) {
        //             var json = response.responseText;
        //             var result = JSON.parse(json);
        //             if (result.error != "0")
        //                 return [false, "Error en llamada a Servidor", ""];
        //             else
        //                 return [true, "", ""]

        //         }, afterShowForm: function (form) {
        //             sipLibrary.centerDialog($("#grid").attr('Id'));

        //         },
        //         onclickSubmit: function (rowid) {
        //             return { grupo: "1" };
        //         }
        //     },
        //     {
        //         closeAfterDelete: true,
        //         recreateForm: true,
        //         ajaxEditOptions: sipLibrary.jsonOptions,
        //         serializeEditData: sipLibrary.createJSON,
        //         addCaption: "Eliminar Empresa",
        //         errorTextFormat: function (data) {
        //             return 'Error: ' + data.responseText
        //         }, afterSubmit: function (response, postdata) {
        //             var json = response.responseText;
        //             var result = JSON.parse(json);
        //             if (result.success != true)
        //                 return [false, result.error_text, ""];
        //             else
        //                 return [true, "", ""]
        //         },
        //         onclickSubmit: function (rowid) {
        //             var rowKey = $("#grid").getGridParam("selrow");
        //             var rowData = $("#grid").getRowData(rowKey);
        //             var thissid = rowData.idrelacion;
        //             return { idrelacion: thissid };
        //         }
        //     },
        //     {
        //         recreateFilter: true
        //     }
        // );
        $("#pagerlimites").css("padding-bottom", "10px");
//         $("#gridlimites").jqGrid('navButtonAdd', "#pager", {
//             caption: '<button class="btn btn-default">Asignar Linea</button>',
//             buttonicon: "",
//             title: "Excel",
//             position: "last",
//             onClickButton: function () {
//                 /*
//                 var $grid = $("#grid")
//                 var selIds = $grid.jqGrid("getGridParam", "selarrrow")
//                 var alerta = "Se asignará la operación _________"

//                 if (confirm(alerta)) {
//                     alert("Funcionalidad en desarrollo");



//                 } else {
//                     alert("No");
//                 }
// */
//             }
//         });


    }
}
