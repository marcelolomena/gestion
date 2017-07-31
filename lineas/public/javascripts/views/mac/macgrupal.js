$(document).ready(function () {
    var idmacgrupal = $("#param").text();
    var nombre = ""
    var rut = ""
    var idgrupo = ""
    var nombregrupo = ""
    var elcaption = ""
    $("#gridMaster").append(`
            <div class="panel panel-primary" id="accordion">
                <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161; cursor: pointer;' data-toggle="collapse" data-parent="#accordion" data-target="#contenido" aria-expanded="true">
                    <h3 class="panel-title">Información General</h3>
                </div>
                <div class="panel-body" id="contenido">
                    <div class="row">
                        <div class="col-xs-2"><b>Promedio Saldo Vista Ultimos </br>12 Meses (M$):</b></div>
                        <div class="col-xs-2">408.000</div>
                        <div class="col-xs-2"></div>
                        <div class="col-xs-2"></div>
                        <div class="col-xs-2"></br><b>Nombre Grupo:</b></div>
                        <div class="col-xs-2"></br><span id="nombregrupo"></span></div>
                    </div>
                    <div class="row">
                        <div class="col-xs-2"><b>Fecha Presentación:</b></div>
                        <div class="col-xs-2">05-06-2017</div>
                        <div class="col-xs-2"><b>Fecha Vcto:</b></div>
                        <div class="col-xs-2">05-06-2017</div>
                    </div>
                    <div class="row">
                        <div class="col-xs-4"></div>
                        <div class="col-xs-2"><b>Rating Grupo:</b></div>
                        <div class="col-xs-2">7</div>
                    </div>
                    <div class="row">
                        <div class="col-xs-2"><b>Ejecutivo Control /Area:</b></div>
                        <div class="col-xs-2">Leslie Calderón / Mayorista 4</div>
                        <div class="col-xs-2"><b>Nivel Atribución:</b></div>
                        <div class="col-xs-2">R2</div>
                    </div>
                    <hr class="section-separations"></hr>
                    <ul class='nav nav-tabs tabs-up' id='myTabGrupal'>
                        <li><a href='/macindividuales/` + idmacgrupal+`' data-target='#vermacgrupal' id='vermacgrupal_tab' data-toggle='tabgrupal'>MAC Grupal</a></li>
                        <li><a href='/aprobacion/' data-target='#aprobacion' id='aprobacion_tab' data-toggle='tabgrupal'>Aprobación</a></li>
                        <li><a href='/bitacora/' data-target='#bitacora' id='bitacora_tab' data-toggle='tabgrupal'>Bitacora</a></li>
                    </ul>
                    <div class='tab-content'>
                        <div class='tab-pane active' id='vermacgrupal'><div class='container-fluid'><table id='vermacgrupal_t'></table><div id='navGridVermacGrupal'></div></div></div>
                        <div class='tab-pane' id='aprobacion'><table id='aprobacion_t'></table><div id='navGridAprob'></div></div>
                        <div class='tab-pane' id='bitacora'><table id='bitacora_t'></table><div id='navGridBita'></div></div>
                    </div>
                </div>
            </div> `)


    
    $('#vermacgrupal_tab').addClass('media_node active span')
    $('.active[data-toggle="tabgrupal"]').each(function (e) {
        var $this = $(this),
            loadurlgrupal = $this.attr('href'),
            targgrupal = $this.attr('data-target');
        if (targgrupal === '#vermacgrupal') {
            gridVermacgrupal.renderGrid(loadurlgrupal, targgrupal)
        } else if (targ === '#aprobacion') {
            gridAprobacion.renderGrid(loadurlgrupal, targgrupal)
        }
        $this.tab('show');
        return false;
    });

    $('[data-toggle="tabgrupal"]').click(function (e) {
        var $this = $(this),
            loadurlgrupal = $this.attr('href'),
            targgrupal = $this.attr('data-target');
        if (targgrupal === '#vermacgrupal') {
            gridVermacgrupal.renderGrid(loadurlgrupal, targgrupal)
        } else if (targgrupal === '#aprobacion') {
            gridAprobacion.renderGrid(loadurlgrupal, targgrupal)
        }

        $this.tab('show');
        return false;
    });




    $.ajax({
        type: "GET",
        url: '/getdatosmacgrupal/' + idmacgrupal,
        async: false,
        success: function (data) {
            if (data.length > 0) {
                nombregrupo = data[0].nombregrupo;
                $("#nombregrupo").html(nombregrupo)
            } else {
                alert("Error con datos del Mac Grupal")
            }
        }
    });



    $.ajax({
        type: "GET",
        url: '/getmacindividuales/' + idmacgrupal,
        async: false,
        success: function (data) {
            if (data.length > 0) {
                var tabs = "<ul class='nav nav-tabs tabs-up' id='myTab'>"
                for (t in data) {
                    tabs += "<li><a href='/macindividual/" + data[t].Id + "' data-target='#mac" + data[t].Id + "' id='mac" + data[t].Id + "_tab' data-toggle='tab'>" + data[t].Nombre + "</a></li>"
                }
                tabs += "</ul>"
                tabs += "<div class='tab-content'>"
                for (t in data) {
                    if (t == 0) {
                        tabs += "<div class='tab-pane active' id='mac" + data[t].Id + "'><div class='container-fluid'><table id='mac" + data[t].Id + "_t'></table><div id='navGridmac" + data[t].Id + "'></div></div></div>"
                    } else {
                        tabs += "<div class='tab-pane' id='mac" + data[t].Id + "'><div class='container-fluid'><table id='mac" + data[t].Id + "_t'></table><div id='navGridmac" + data[t].Id + "'></div></div></div>"
                    }
                }
                tabs += "</div>"
                $("#gridMaster").append(tabs);
                $('#mac' + data[0].Id + '_tab').addClass('media_node active span')

                $('.active[data-toggle="tab"]').each(function (e) {
                    var $this = $(this),
                        loadurl = $this.attr('href'),
                        targ = $this.attr('data-target');
                    console.log("hola mac " + targ)
                    gridMacIndividual.renderGrid(loadurl, targ)
                    $this.tab('show');
                    return false;
                });

                $('[data-toggle="tab"]').click(function (e) {
                    var $this = $(this),
                        loadurl = $this.attr('href'),
                        targ = $this.attr('data-target');
                    console.log("hola mac " + targ)
                    gridMacIndividual.renderGrid(loadurl, targ)
                    $this.tab('show');
                    return false;
                });

            } else {
                alert("No existen MAC Individuales")
            }
        }
    });


})