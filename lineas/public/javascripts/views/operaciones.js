$(document).ready(function () {
    var parentRowKey = "hola"
    
        var tabs = "<ul class='nav nav-tabs tabs-up' id='myTab'>"
        tabs += "<li><a href='/vermac/1' data-target='#vermac' id='vermac_tab' data-toggle='tab'>Ver MAC</a></li>"
        //tabs += "<li><a href='/responsables/" + parentRowKey + "' data-target='#responsables' id='responsables_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Responsables</a></li>"
        //tabs += "<li><a href='/aprobaciones/" + parentRowKey + "' data-target='#aprobaciones' id='aprobaciones_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Aprobaciones</a></li>"
        tabs += "<li><a href='/reservar/' data-target='#reservar' id='reservar_tab' data-toggle='tab'>Reservar</a></li>"
        tabs += "<li><a href='/bitacora/' data-target='#bitacora' id='bitacora_tab' data-toggle='tab'>Bitacora</a></li>"
        tabs += "</ul>"

        tabs += "<div class='tab-content'>"
        tabs += "<div class='tab-pane active' id='vermac'><div class='container-fluid'><table id='vermac_t'></table><div id='navGridVermac'></div></div></div>"
        //tabs += "<div class='tab-pane' id='responsables'><table id='responsables_t_" + parentRowKey + "'></table><div id='navGridResp'></div></div>"
        //tabs += "<div class='tab-pane' id='aprobaciones'><table id='aprobaciones_t_" + parentRowKey + "'></table><div id='navGridAprob'></div></div>"
        tabs += "<div class='tab-pane' id='reservar'><table id='reservar_t'></table><div id='navGridRes'></div></div>"
        tabs += "<div class='tab-pane' id='bitacora'><table id='bitacora_t'></table><div id='navGridBita'></div></div>"
        tabs += "</div>"

         $("#gridMaster").append(tabs);
        $('#vermac_tab').addClass('media_node active span')
        $('.active[data-toggle="tab"]').each(function (e) {
            var $this = $(this),
                loadurl = $this.attr('href'),
                targ = $this.attr('data-target');
            if (targ === '#vermac') {
                gridVermac.renderGrid(loadurl, targ)
            } else if (targ === '#garantia') {
                gridReservar.renderGrid(loadurl, targ)
            }

            $this.tab('show');
            return false;
        });

        $('[data-toggle="tab"]').click(function (e) {
            var $this = $(this),
                loadurl = $this.attr('href'),
                targ = $this.attr('data-target');
            if (targ === '#vermac') {
                gridVermac.renderGrid(loadurl,  targ)
            } else if (targ === '#garantia') {
                gridReservar.renderGrid(loadurl,  targ)
            }

            $this.tab('show');
            return false;
        });

    
})