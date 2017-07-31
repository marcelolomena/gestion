var gridMacIndividual = {

    renderGrid: function (loadurl, targ) {
        var $gridTab = $(targ + "_t")
        var idmac = targ.substring(4)

        $gridTab.html(
            `
            <div id="cabecera" class="panel panel-primary" style="width: 1250px">
                <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161;'>
                    <h3 align="center" class="panel-title">MEMORANDUM DE APROBACIÓN DE CRÉDITOS</h3>
                </div>
                <div class="panel-body">
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
                        <h5>III. TIPO DE CAMBIO</h5>
                        <div class="panel panel-primary">
                            <div class="row">
                                <div class="col-xs-1"><b>UF</b></div>
                                <div class="col-xs-1">26.597,3</div>
                            </div>
                            <div class="row">
                                <div class="col-xs-1"><b>USD</b></div>
                                <div class="col-xs-1">664,3</div>
                            </div>
                        </div>
                        <h5>IV. DETALLE MAC</h5>
                        <ul class='nav nav-tabs tabs-up' id='myTabmac'>
                            <li><a href='/limite/` + idmac + `' data-target='#limite' id='limite_tab' data-toggle='tabmac'>Límites</a></li>
                            <li><a href='/garantia/' data-target='#garantia' id='aprobacion_tab' data-toggle='tabgrupal'>Garantías</a></li>
                            <li><a href='/bitacora/' data-target='#bitacora' id='bitacora_tab' data-toggle='tabgrupal'>Bitacora</a></li>
                        </ul>
                        <div class='tab-content'>
                            <div class='tab-pane active' id='limite'><div class='container-fluid'><table id='limite_t'></table><div id='navGridLimite'></div></div></div>
                            <div class='tab-pane' id='aprobacion'><table id='aprobacion_t'></table><div id='navGridAprob'></div></div>
                            <div class='tab-pane' id='bitacora'><table id='bitacora_t'></table><div id='navGridBita'></div></div>
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


    }
}
