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
                    <h3 class="panel-title"> MAC Individuales</h3>
                </div>
                <div class="panel-body" id="contenido">
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