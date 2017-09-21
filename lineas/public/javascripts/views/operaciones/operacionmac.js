var gridoperacionmac = {

    renderGrid: function (loadurl, targ) {
        var $gridTab = $(targ + "_t")
        console.log(loadurl.substring(14))
        console.log(loadurl)
        var rut = loadurl.substring(14);
        $gridTab.html(
            `
            <div style="text-align:right;"><button type="button" class="btn btn-primary" style="background-color: #0B2161;"> Imprimir</button></div>
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
                                <div class="col-xs-5"><span id="nombre`+ rut + `"></span></div>
                                <div class="col-xs-2"></div>
                                <div class="col-xs-2"><b>RATING GRUPO</b></div>
                                <div class="col-xs-1">7</div>
                            </div>
                            <div class="row">
                                <div class="col-xs-1"><b>RUT</b></div>
                                <div class="col-xs-3"><span id="rut`+ rut + `"></span></div>
                                <div class="col-xs-2"></div>
                                <div class="col-xs-2"></div>
                                <div class="col-xs-2"><b>NIVEL ATRIBUCIÓN</b></div>
                                <div class="col-xs-1"><span id="nivelatribucion`+ rut + `"></span></div>
                            </div>
                            <div class="row">
                                <div class="col-xs-1"><b>ACTIVIDAD</b></div>
                                <div class="col-xs-3"><span id="actividad`+ rut + `"></span></div>
                                <div class="col-xs-2"></div>
                                <div class="col-xs-2"></div>
                                <div class="col-xs-2"><b>RATING INDIVIDUAL</b></div>
                                <div class="col-xs-1"><span id="ratingindividual`+ rut + `"></span></div>
                            </div>
                            <div class="row">
                                <div class="col-xs-1"><b>OFIC/EJEC</b></div>
                                <div class="col-xs-3">Mayorista 1 / Marcela Castro C.</div>
                                <div class="col-xs-2"><b>FECHA PROX. VENC.</b></div>
                                <div class="col-xs-2"><span id="fechaproxvenc`+ rut + `"></span></div>
                                <div class="col-xs-2"><b>CLASIFICACIÓN</b></div>
                                <div class="col-xs-1"><span id="clasificacion`+ rut + `"></span></div>
                            </div>
                            <div class="row">
                                <div class="col-xs-1"><b>FECHA</b></div>
                                <div class="col-xs-3"><span id="fecha`+ rut + `"></span></div>
                                <div class="col-xs-2"><b>FECHA VENC. ANT.</b></div>
                                <div class="col-xs-2"><span id="fechavencant`+ rut + `"></span></div>
                                <div class="col-xs-2"><b>VIGILANCIA</b></div>
                                <div class="col-xs-1"><span id="vigilancia`+ rut + `"></span></div>
                            </div>
                            <div class="row">
                                <div class="col-xs-1"></div>
                                <div class="col-xs-3"></div>
                                <div class="col-xs-2"></div>
                                <div class="col-xs-2"></div>
                                <div class="col-xs-2"><b>FECHA INFORMACIÓN</br>FINANCIERA</b></div>
                                <div class="col-xs-1"><span id="fechainfo`+ rut + `"></span></div>
                            </div>
                        </div>
                        <h5>II. ANTECEDENTES (M$ a 31/05/2017)</h5>
                        <div class="panel panel-primary">
                            <div class="row">
                                <div class="col-xs-1"></div>
                                <div class="col-xs-1"></div>
                                <div class="col-xs-2"><b>DEUDA SBIF</b></div>
                                <div class="col-xs-1"><b>DIRECTA</b></div>
                                <div class="col-xs-1"><b>INDIRECTA</b></div>
                                <div class="col-xs-2"></div>
                                <div class="col-xs-1"><b>DIRECTA</b></div>
                            </div>
                            <div class="row">
                                <div class="col-xs-1"><b>P. SALDO </br>VISTA</br><span style="font-size:10px">(Ultimos 12 Meses)</span></b></div>
                                <div class="col-xs-1"><u><span id="promediosaldovista`+ rut + `"></span></u></div>
                                <div class="col-xs-2">SIST. FINANCIERO</div>
                                <div class="col-xs-1"><u><span id="deudasbifdirecta`+ rut + `"></span></u></div>
                                <div class="col-xs-1"><u><span id="deudasbifindirecta`+ rut + `"></span></u></div>
                                <div class="col-xs-2">LEASING ACHEL</div>
                                <div class="col-xs-1"><u><span id="leasing`+ rut + `"></span></u></div>
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
                    </div>         
                </div>
                
            </div>
        
        `)
        $.ajax({
            type: "GET",
            url: '/getultimomac/' + rut,
            async: false,
            success: function (data) {
                if (data.length > 0) {
                    //console.log("nombre"+idmac+" es "+data[0].Nombre)
                    $("#nombre" + rut).html(data[0].Nombre)
                    $("#rut" + rut).html(data[0].Rut)
                    $("#actividad" + rut).html(data[0].Actividad)
                    $("#fecha" + rut).html(data[0].FechaCreacion)
                    $("#fechaproxvenc" + rut).html(data[0].FechaVenc)
                    $("#fechavencant" + rut).html(data[0].FechaVencAnt)
                    $("#ratingindividual" + rut).html(data[0].RatingInd)
                    $("#clasificacion" + rut).html(data[0].Clasificacion)
                    $("#vigilancia" + rut).html(data[0].Vigilancia)
                    $("#fechainfo" + rut).html(data[0].FechaInfFin)
                    $("#nivelatribucion" + rut).html(data[0].NivelAtribucion)
                    $("#promediosaldovista" + rut).html(data[0].PromSaldoVista)
                    $("#deudasbifdirecta" + rut).html(data[0].DeudaSbifDirecta)
                    $("#deudasbifindirecta" + rut).html(data[0].DeudaSbifIndirecta)
                    $("#leasing" + rut).html(data[0].Leasing)

                } else {
                    alert("Error con datos del Mac")
                }
            }
        });







    }
}