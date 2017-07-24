$(document).ready(function () {
    var parentRowKey = "hola"

    var tabs = "<ul class='nav nav-tabs tabs-up' id='myTab'>"
    tabs += "<li><a href='/operacionmac/1' data-target='#operacionmac' id='operacionmac' data-toggle='tab'>Ver Mac</a></li>"
    //tabs += "<li><a href='/responsables/" + parentRowKey + "' data-target='#responsables' id='responsables_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Responsables</a></li>"
    //tabs += "<li><a href='/aprobaciones/" + parentRowKey + "' data-target='#aprobaciones' id='aprobaciones_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Aprobaciones</a></li>"
    tabs += "<li><a href='/reservar/' data-target='#reservar' id='reservar_tab' data-toggle='tab'>Reservar</a></li>"
    tabs += "<li><a href='/reservar/' data-target='#reservar' id='reservar_tab' data-toggle='tab'>Asignar</a></li>"
    tabs += "<li><a href='/reservar/' data-target='#reservar' id='reservar_tab' data-toggle='tab'>Estado</a></li>"
    tabs += "<li><a href='/bitacora/' data-target='#bitacora' id='bitacora_tab' data-toggle='tab'>Bitacora</a></li>"
    tabs += "</ul>"

    tabs += "<div class='tab-content'>"
    tabs += "<div class='tab-pane active' id='operacionmac'><div class='container-fluid'><table id='operacionmac_t'></table><div id='navGridVermac'></div></div></div>"
    //tabs += "<div class='tab-pane' id='responsables'><table id='responsables_t_" + parentRowKey + "'></table><div id='navGridResp'></div></div>"
    //tabs += "<div class='tab-pane' id='aprobaciones'><table id='aprobaciones_t_" + parentRowKey + "'></table><div id='navGridAprob'></div></div>"
    tabs += "<div class='tab-pane' id='reservar'><table id='reservar_t'></table><div id='navGridRes'></div></div>"
    tabs += "<div class='tab-pane' id='reservar'><table id='reservar_t'></table><div id='navGridRes'></div></div>"
    tabs += "<div class='tab-pane' id='bitacora'><table id='bitacora_t'></table><div id='navGridBita'></div></div>"
    tabs += "</div>"
    $("#gridMaster").append(`
            <div class="panel panel-primary">
                <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161;'>
                    <h3 class="panel-title">Información General</h3>
                </div>
                <div class="panel-body">
                    <div class="row">
                        <div class="col-xs-9"><b>Cliente: </b> 75.214.694-9 / Zrismart Consultores Limitada </div>
                    </div>
                    <div class="row">    
                        <div class="col-xs-6 col-sm-3"><b>Clasificación:</b> A4</div>
                        <div class="col-xs-6 col-sm-3"><b>Rating Ind:</b> 7 <span class="glyphicon glyphicon-exclamation-sign" style="color: red;"></span></div>
                        <div class="col-xs-6 col-sm-3"><b>Rating Grupal:</b> 8 <span class="glyphicon glyphicon-ok-sign" style="color: green;"></div>     
                        <div class="col-xs-6 col-sm-3"><b>Vigilancia:</b> No</div>
                    </div>   
                    <div class="row">    
                        <div class="col-xs-6 col-sm-3"><b>F. Rating Ind:</b> 13-07-2017</div>
                        <div class="col-xs-6 col-sm-3"><b>F. Rating Grupal:</b> 13-07-2017</div>
                        <div class="col-xs-6 col-sm-3"><b>F. Creación MAC:</b> 09-06-2017</div>
                        <div class="col-xs-6 col-sm-3"><b>F. Vencimiento MAC:</b> 08-06-2018</div>
                    </div>       
                </div>
            </div>`);

    $("#gridMaster").append(tabs);
    $('#operacionmac_tab').addClass('media_node active span')
    $('.active[data-toggle="tab"]').each(function (e) {
        var $this = $(this),
            loadurl = $this.attr('href'),
            targ = $this.attr('data-target');
        if (targ === '#operacionmac') { //ver macgrupal es la grilla padre
            gridoperacionmac.renderGrid(loadurl, targ)//genera la grilla, la obtiene desde vermac
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
        if (targ === '#operacionmac') {
            gridoperacionmac.renderGrid(loadurl, targ)
        } else if (targ === '#reservar') {
            gridReservar.renderGrid(loadurl, targ)
        } else if (targ === '#bitacora') {
            gridBitacora.renderGrid(loadurl, targ)
        }

        $this.tab('show');
        return false;
    });


})