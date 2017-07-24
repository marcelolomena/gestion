$(document).ready(function () {
    var parentRowKey = "hola"

    var tabs = "<ul class='nav nav-tabs tabs-up' id='myTab'>"
    tabs += "<li><a href='/macindividuales/1' data-target='#vermacindividuales' id='vermacindividuales_tab' data-toggle='tab'>MAC Individuales</a></li>"
    //tabs += "<li><a href='/responsables/" + parentRowKey + "' data-target='#responsables' id='responsables_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Responsables</a></li>"
    //tabs += "<li><a href='/aprobaciones/" + parentRowKey + "' data-target='#aprobaciones' id='aprobaciones_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Aprobaciones</a></li>"
    tabs += "<li><a href='/aprobaciones/' data-target='#aprobaciones' id='aprobaciones_tab' data-toggle='tab'>Aprobaciones</a></li>"
    //tabs += "<li><a href='/reservar/' data-target='#reservar' id='reservar_tab' data-toggle='tab'>Asignar</a></li>"
    //tabs += "<li><a href='/reservar/' data-target='#reservar' id='reservar_tab' data-toggle='tab'>Estado</a></li>"
    tabs += "<li><a href='/bitacora/' data-target='#bitacora' id='bitacora_tab' data-toggle='tab'>Bitacora</a></li>"
    tabs += "</ul>"

    tabs += "<div class='tab-content'>"
    tabs += "<div class='tab-pane active' id='vermacindividuales'><div class='container-fluid'><table id='vermacindividuales_t'></table><div id='navGridVermacindividuales'></div></div></div>"
    //tabs += "<div class='tab-pane' id='responsables'><table id='responsables_t_" + parentRowKey + "'></table><div id='navGridResp'></div></div>"
    //tabs += "<div class='tab-pane' id='aprobaciones'><table id='aprobaciones_t_" + parentRowKey + "'></table><div id='navGridAprob'></div></div>"
    tabs += "<div class='tab-pane' id='aprobaciones'><table id='aprobaciones_t'></table><div id='navGridAprob'></div></div>"
    //tabs += "<div class='tab-pane' id='reservar'><table id='reservar_t'></table><div id='navGridRes'></div></div>"
    tabs += "<div class='tab-pane' id='bitacora'><table id='bitacora_t'></table><div id='navGridBita'></div></div>"
    tabs += "</div>"
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
                        <div class="col-xs-2"></br>MATTE</div>
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

    $("#gridMaster").append(tabs);
    $('#vermacindividuales_tab').addClass('media_node active span')
    $('.active[data-toggle="tab"]').each(function (e) {
        var $this = $(this),
            loadurl = $this.attr('href'),
            targ = $this.attr('data-target');
        if (targ === '#vermacindividuales') { //ver mac es la grilla padre
            gridVermacIndividuales.renderGrid(loadurl, targ)//genera la grilla, la obtiene desde vermac
        } else if (targ === '#reservar') {
            gridReservar.renderGrid(loadurl, targ)
        } else if (targ === '#bitacora') {
            gridBitacora.renderGrid(loadurl, targ)
        }

        $this.tab('show');
        return false;
    });

    $('[data-toggle="tab"]').click(function (e) {
        var $this = $(this),
            loadurl = $this.attr('href'),
            targ = $this.attr('data-target');
        if (targ === '#vermacindividuales') {
            gridVermacIndividuales.renderGrid(loadurl, targ)
        } else if (targ === '#reservar') {
            gridReservar.renderGrid(loadurl, targ)
        } else if (targ === '#bitacora') {
            gridBitacora.renderGrid(loadurl, targ)
        }

        $this.tab('show');
        return false;
    });


})