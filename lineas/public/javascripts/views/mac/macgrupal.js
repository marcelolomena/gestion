$(document).ready(function () {
    $("#gridMaster").append(`
            <div class="panel panel-primary">
                <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161;'>
                    <h3 class="panel-title">Información General</h3>
                </div>
                <div class="panel-body">
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
                </div>
            </div>`);
    var idmacgrupal = $("#param").text();
    var nombre = ""
    var rut = ""
    var idgrupo = ""
    var nombregrupo = ""
    var elcaption = ""
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
                $('#mac' + data[0].Id+'_tab').addClass('media_node active span')

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