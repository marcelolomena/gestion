var gridAprobacion = {

    renderGrid: function (loadurl, targ) {
        var $gridTab = $(targ + "_t")
        var idmac = loadurl
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

        if (document.getElementById("cabecera") == null) {

            $gridTab.prepend(
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
                                <div class="col-xs-1"><b>GRUPO</b></div>
                                <div class="col-xs-3"><span id="nombregrupo`+ idmac + `"></span></div>
                                <div class="col-xs-2"><b>RATING GRUPO</b></div>
                                <div class="col-xs-2"><span id="ratinggrupo`+ idmac + `">7</span></div>
                                <div class="col-xs-2"><b>NIVEL ATRIBUCIÓN</b></div>
                                <div class="col-xs-1"><span id="nivelatribucion`+ idmac + `">R2</span></div>
                            </div>
                            <div class="row">
                                <div class="col-xs-1">&nbsp;</div>
                            </div>
                            <div class="row">
                                <div class="col-xs-1"><b>NOMBRE</b></div>
                                <div class="col-xs-5"><span id="nombre`+ idmac + `"></span></div>
                            </div>
                            <div class="row">
                                <div class="col-xs-1"><b>RUT</b></div>
                                <div class="col-xs-3"><span id="rut`+ idmac + `"></span></div>
                                <div class="col-xs-2"><b>FECHA CREACIÓN</b></div>
                                <div class="col-xs-2"><span id="fechacreacion`+ idmac + `"></span></div>
                                <div class="col-xs-2"><b>RATING INDIVIDUAL</b></div>
                                <div class="col-xs-1"><span id="ratingindividual`+ idmac + `"></span></div>
                            </div>
                            <div class="row">
                                <div class="col-xs-1"><b>ACTIVIDAD</b></div>
                                <div class="col-xs-3"><span id="actividad`+ idmac + `"></span></div>
                                <div class="col-xs-2"><b>FECHA PROX. VENC.</b></div>
                                <div class="col-xs-2"><span id="fechaproxvenc`+ idmac + `" style="border-style: solid; padding: 1px;"></span></div>
                                <div class="col-xs-2"><b>CLASIFICACIÓN</b></div>
                                <div class="col-xs-1"><span id="clasificacion`+ idmac + `"></span></div>
                            </div>
                            <div class="row">
                                <div class="col-xs-1"><b>EJECUTIVO</b></div>
                                <div class="col-xs-3">Marcela Castro C.</div>
                                <div class="col-xs-2"><b>FECHA VENC. ANT.</b></div>
                                <div class="col-xs-2"><span id="fechavencant`+ idmac + `"></span></div>
                                <div class="col-xs-2"><b>VIGILANCIA</b></div>
                                <div class="col-xs-1"><span id="vigilancia`+ idmac + `"></span></div>
                            </div>
                            <div class="row">
                                <div class="col-xs-1"><b>OFICINA</b></div>
                                <div class="col-xs-3"><span id="oficina`+ idmac + `">Mayorista 1</span></div>
                                <div class="col-xs-2"><b>FECHA INF. FINANCIERA</b></div>
                                <div class="col-xs-2"><span id="fechainfo`+ idmac + `"></span></div>
                                <div class="col-xs-2"><b>COMPORTAMIENTO</b></div>
                                <div class="col-xs-1"><span id="comportamiento`+ idmac + `">VERDE</span></div>
                            </div>
                            <div class="row">
                                <div class="col-xs-1"><b>PEP</b></div>
                                <div class="col-xs-3"><span id="pep`+ idmac + `"></span></div>
                                <div class="col-xs-2"><b>FECHA VCTO. FICHA PEP</b></div>
                                <div class="col-xs-2"><span id="fechafichapep`+ idmac + `"></span></div>
                                <div class="col-xs-2"><b>RIESGO REPUTACIONAL</b></div>
                                <div class="col-xs-1"><span id="riesgoreputacional`+ idmac + `">SI</span></div>
                            </div>
                        </div>
                        <h5>II. ANTECEDENTES (M$ a 31/05/2017)</h5>
                        <div class="panel panel-primary">
                            <div class="row">
                                <div class="col-xs-2"></div>
                                <div class="col-xs-1"></div>
                                <div class="col-xs-2"><b>DEUDA SBIF</b></div>
                                <div class="col-xs-1"><b>DIRECTA</b></div>
                                <div class="col-xs-2"><b>INDIRECTA</b></div>
                                <div class="col-xs-2"></div>
                                <div class="col-xs-1"><b>DIRECTA</b></div>
                            </div>
                            <div class="row">
                                <div class="col-xs-2"><b>F.APER. C.CTE.</b></div>
                                <div class="col-xs-1"><span id="fechaaperturaccte`+ idmac + `">05-04-2012</span></div>
                                <div class="col-xs-2">SIST. FINANCIERO</div>
                                <div class="col-xs-1"><span id="deudasbif`+ idmac + `">934.152</span></div>
                                <div class="col-xs-2">0</div>
                                <div class="col-xs-2">LEASING ACHEL</div>
                                <div class="col-xs-1">65.983</div>
                            </div>
                            <div class="row">
                                <div class="col-xs-2"><b>P. SALDO VISTA</br><span style="font-size:10px">(Ultimos 12 Meses MN y MX)</span></b></div>
                                <div class="col-xs-1"><span id="promediosaldovista`+ idmac + `"></span></div>
                                <div class="col-xs-2">PENETRACIÓN</div>
                                <div class="col-xs-1"><span id="penetracion`+ idmac + `">65%</span></div>
                                <div class="col-xs-2"></div>

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
                        $("#nombregrupo" + idmac).html('COMFRUT')
                        $("#nombre" + idmac).html(data[0].Nombre)
                        $("#rut" + idmac).html(data[0].Rut)
                        $("#actividad" + idmac).html(data[0].Actividad)
                        $("#pep" + idmac).html(data[0].Vigilancia)
                        $("#fechaproxvenc" + idmac).html(data[0].FechaVenc)
                        $("#fechafichapep" + idmac).html(data[0].FechaVenc)
                        $("#fechavencant" + idmac).html(data[0].FechaVencAnt)
                        $("#ratingindividual" + idmac).html(data[0].RatingInd)
                        $("#clasificacion" + idmac).html(data[0].Clasificacion)
                        $("#vigilancia" + idmac).html(data[0].Vigilancia)
                        $("#fechainfo" + idmac).html(data[0].FechaInfFin)
                        //$("#nivelatribucion" + idmac).html(data[0].NivelAtribucion)
                        $("#promediosaldovista" + idmac).html(data[0].PromSaldoVista)
                        $("#deudasbif" + idmac).html(data[0].DeudaSbif)
                        $("#fechacreacion" + idmac).html(data[0].FechaCreacion)

                    } else {
                        alert("Error con datos del Mac Grupal")
                    }
                }
            });
            //var elrutqueviene = $(this).attr('href');
            var elrutquenecesito = '79663940'

            var elcaption = "Límites";

            var template = "<div id='responsive-form' class='clearfix'>";

            template += "<div class='form-row'>";
            template += "<div class='column-full'>Tipo Límite {Tipo_Id}</div>";
            template += "</div>";

            template += "<div class='form-row' style='display: none;'>";
            template += "<div class='column-full'>Descripcion {Descripcion}</div>";
            template += "</div>";

            template += "<div class='form-row'>";
            template += "<div class='column-full'>Tipo de Riesgo {Riesgo}</div>";
            template += "</div>";

            template += "<div class='form-row'>";
            template += "<div class='column-full'>Moneda {MonedaSometido}</div>";
            template += "</div>";

            template += "<div class='form-row'>";
            template += "<div class='column-full'>Monto Sometido Aprobación {Sometido}</div>";
            template += "</div>";

            template += "<div class='form-row' style='display: none;'>";
            template += "</div>";

            template += "<hr style='width:100%;'/>";
            template += "<div> {sData} {cData}  </div>";
            template += "</div>";
            var modelLimites = [
                {
                    label: 'Id', name: 'Id', index: 'Id', key: true, hidden: true, width: 10,
                    editable: true, hidedlg: true, sortable: false, editrules: { edithidden: false },
                },
                { label: 'Mac Individual', name: 'MacIndividual_Id', hidden: true, editable: true, align: 'right' },
                {
                    label: 'Tipo Límite', name: 'Tipo_Id', search: false, editable: true, hidden: true,
                    edittype: "select",
                    editoptions: {
                        dataUrl: '/tipolimite',
                        buildSelect: function (response) {
                            var grid = $("#gridlimites");
                            //console.log(grid);
                            var rowKey = grid.getGridParam("selrow");
                            var rowData = grid.getRowData(rowKey);
                            var thissid = rowData.Tipo_Id;
                            var data = JSON.parse(response);
                            var s = "<select>";//el default
                            s += '<option value="0">--Escoger Tipo Límite--</option>';
                            $.each(data, function (i, item) {
                                if (data[i].Id == thissid) {
                                    s += '<option value="' + data[i].Id + '" selected>' + data[i].Nombre + '</option>';
                                } else {
                                    s += '<option value="' + data[i].Id + '">' + data[i].Nombre + '</option>';
                                }
                            });
                            return s + "</select>";
                        },
                        dataEvents: [{
                            type: 'change', fn: function (e) {
                                $("input#Descripcion").val($('option:selected', this).text());
                            }
                        }],
                    }, dataInit: function (elem) { $(elem).width(200); }
                },
                { label: 'N°', name: 'Numero', width: 6, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
                { label: 'Riesgo', name: 'Riesgo', width: 10, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
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
                { label: 'P. Residual', name: 'PlazoResidual', width: 20, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
                //{ label: '', name: 'PlazoResudual', width: 30, hidden: false, search: true, editable: true, editrules: { required: true } },
                {
                    label: 'Moneda', name: 'Moneda', width: 12, hidden: false, search: true, editable: true,
                    align: 'center', editrules: { required: true },

                },
                {
                    label: 'Monto (Miles)', name: 'Aprobado', width: 30, hidden: false, search: true, editable: true, align: 'right',
                    formatter: 'number', formatoptions: { decimalPlaces: 0 },
                    editoptions: {
                        dataInit: function (el) {
                            $(el).mask('000.000.000.000.000', { reverse: true });
                        }
                    },
                    editrules: { required: true }
                },
                { label: 'Moneda', name: 'MonedaDisponible', width: 12, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
                { label: 'Monto (Miles)', name: 'Utilizado', width: 30, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                {
                    label: 'Moneda', name: 'MonedaSometido', width: 12, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true },
                    edittype: "select",
                    editoptions: {
                        dataUrl: '/lamoneda',
                        buildSelect: function (response) {
                            var grid = $("#gridlimites");
                            //console.log(grid);
                            var rowKey = grid.getGridParam("selrow");
                            var rowData = grid.getRowData(rowKey);
                            var thissid = rowData.MonedaSometido;
                            var data = JSON.parse(response);
                            var s = "<select>";//el default
                            s += '<option value="0">--Escoger Moneda--</option>';
                            $.each(data, function (i, item) {
                                if (data[i].Nombre == thissid) {
                                    s += '<option value="' + data[i].Nombre + '" selected>' + data[i].Nombre + '</option>';
                                } else {
                                    s += '<option value="' + data[i].Nombre + '">' + data[i].Nombre + '</option>';
                                }
                            });
                            return s + "</select>";
                        },
                        dataEvents: [{
                            type: 'change', fn: function (e) {
                                //$("input#rol").val($('option:selected', this).text());
                            }
                        }],
                    }, dataInit: function (elem) { $(elem).width(200); }
                },
                { label: 'Monto (Miles)', name: 'Sometido', width: 30, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                { label: 'Monto (MM$)', name: 'Sometido', width: 30, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },




            ];

            $("#gridlimites").jqGrid({
                url: '/limitemac/' + idmac,
                mtype: "GET",
                datatype: "json",
                rowNum: 200,
                pager: "#pagerlimites",
                height: 'auto',
                shrinkToFit: true,
                width: 1215,
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
                viewrecords: false,
                pgtext: null,
                pgbuttons: false,
                rowList: [],
                styleUI: "Bootstrap",
                editurl: '/limitemac',
                loadError: sipLibrary.jqGrid_loadErrorHandler,
                gridComplete: function () {
                    var recs = $("#gridlimites").getGridParam("reccount");
                    if (isNaN(recs) || recs == 0) {

                        $("#gridlimites").addRowData("blankRow", { "nombre": "No hay datos" });
                    }
                },
                loadComplete: function () {

                    var recs = $("#gridlimites").getGridParam("reccount");
                    if (isNaN(recs) || recs == 0) {
                        //$("#" + childGridID).addRowData("blankRow", { "id": 0, "Descripcion": " ", "Aprobado": "0" });
                        //$("#gridlimites").parent().parent().remove();
                        //$gridTab2PagerID.hide();

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

            $("#gridlimites").jqGrid('setGroupHeaders', {
                useColSpanStyle: false,
                groupHeaders: [
                    { startColumnName: 'Moneda', numberOfColumns: 2, titleText: 'Aprobación Actual' },
                    { startColumnName: 'MonedaDisponible', numberOfColumns: 2, titleText: 'Deuda Actual' },
                    { startColumnName: 'MonedaSometido', numberOfColumns: 3, titleText: 'Sometido Aprobación' },
                    //{startColumnName: 'closed', numberOfColumns: 2, titleText: 'Shiping'}
                ]
            });


            $("#gridlimites").jqGrid('navGrid', "#pagerlimites", {
                edit: true, add: true, del: true, search: false,
                refresh: false, view: false, position: "left", cloneToTop: false
            },
                {
                    closeAfterEdit: true,
                    recreateForm: true,
                    ajaxEditOptions: sipLibrary.jsonOptions,
                    serializeEditData: sipLibrary.createJSON,
                    editCaption: "Modificar Límite",
                    template: template,
                    errorTextFormat: function (data) {
                        return 'Error: ' + data.responseText
                    },
                    beforeShowForm: function (form) {
                        //$("input#Nombre").prop('disabled', true);
                        //$("input#RazonSocial").prop('disabled', true);


                    },
                },
                {
                    closeAfterAdd: true,
                    recreateForm: true,
                    ajaxEditOptions: sipLibrary.jsonOptions,
                    serializeEditData: sipLibrary.createJSON,
                    addCaption: "Agregar Límite",
                    template: template,
                    errorTextFormat: function (data) {
                        return 'Error: ' + data.responseText
                    },
                    beforeShowForm: function (form) {
                        //$("input#Nombre").prop('disabled', true);
                        //$("input#RazonSocial").prop('disabled', true);
                        var dlgDiv = $("#editmod" + $("#gridlimites")[0].id);
                        var parentDiv = dlgDiv.parent();
                        var dlgWidth = dlgDiv.width();
                        var parentWidth = parentDiv.width();
                        var dlgHeight = dlgDiv.height();
                        var parentHeight = parentDiv.height();
                        // TODO: change parentWidth and parentHeight in case of the grid
                        //       is larger as the browser window
                        dlgDiv[0].style.top = Math.round((parentHeight - dlgHeight) / 2) + "px";
                        dlgDiv[0].style.left = Math.round((parentWidth - dlgWidth) / 2) + "px";

                    },
                    afterSubmit: function (response, postdata) {
                        var json = response.responseText;
                        var result = JSON.parse(json);
                        if (result.error != "0")
                            return [false, "Error en llamada a Servidor", ""];
                        else
                            return [true, "", ""]

                    }, afterShowForm: function (form) {
                        sipLibrary.centerDialog($("#gridlimites").attr('Id'));

                    },
                    onclickSubmit: function (rowid) {
                        return { mac: idmac};
                    }
                },
                {
                    closeAfterDelete: true,
                    recreateForm: true,
                    ajaxEditOptions: sipLibrary.jsonOptions,
                    serializeEditData: sipLibrary.createJSON,
                    addCaption: "Eliminar Limite",
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
                    // onclickSubmit: function (rowid) {
                    //     var rowKey = $("#gridlimites").getGridParam("selrow");
                    //     var rowData = $("#gridlimites").getRowData(rowKey);
                    //     var thissid = rowData.idrelacion;
                    //     return { idrelacion: thissid };
                    // }
                },
                {
                    recreateFilter: true
                }
            );


        }
    }
}
