$(document).ready(function () {
    var rut = $("#param").text();

    var tabs = "<ul class='nav nav-tabs tabs-up' id='myTab'>"
    tabs += "<li><a href='/limite/" + rut + "' data-target='#vertablimites' id='vertablimites_tab' data-toggle='tab'>Limites</a></li>"
    tabs += "<li><a href='/reservar/' data-target='#reservar' id='reservar_tab' data-toggle='tab'>Operaciones</a></li>"
    tabs += "<li><a href='/reservar/' data-target='#reservar' id='reservar_tab' data-toggle='tab'>Reservas</a></li>"
    tabs += "<li><a href='/bitacora/' data-target='#bitacora' id='bitacora_tab' data-toggle='tab'>Asignar</a></li>"
    tabs += "<li><a href='/bitacora/' data-target='#bitacora' id='bitacora_tab' data-toggle='tab'>Excepciones</a></li>"
    tabs += "<li><a href='/bitacora/' data-target='#bitacora' id='bitacora_tab' data-toggle='tab'>Reportes</a></li>"
    tabs += "<li><a href='/operacionmac/" + rut + "' data-target='#operacionmac' id='operacionmac_tab' data-toggle='tab'>Mac</a></li>"
    tabs += "</ul>"

    tabs += "<div class='tab-content'>"

    tabs += "<div class='tab-pane active' id='vertablimites'><table id='vertablimites_t'></table><div id='navGridtabverlimites'></div></div>"
    tabs += "<div class='tab-pane' id='reservar'><table id='reservar_t'></table><div id='navGridRes'></div></div>"
    tabs += "<div class='tab-pane' id='bitacora'><table id='bitacora_t'></table><div id='navGridBita'></div></div>"
    tabs += "<div class='tab-pane' id='operacionmac'><div class='container-fluid'><table id='operacionmac_t'></table><div id='lol'></div></div></div>"
    tabs += "</div>"

    var nombre = ""
    var idgrupo = ""
    var nombregrupo = "No tiene"
    var banca = ""
    var oficina = ""
    var ejecutivo = ""
    var riesgo = ""
    var rating = ""
    var ratinggrupal = ""
    var pep = ""
    var vigilancia = ""
    $.ajax({
        type: "GET",
        url: '/getdatosclientelimite/' + rut,
        async: false,
        success: function (data) {
            if (data.length > 0) {
                id = data[0].Id;
                nombre = data[0].Nombre;
                banca = data[0].Banca;
                oficina = data[0].Oficina;
                ejecutivo = data[0].Ejecutivo;
                riesgo = data[0].Riesgo;
                rating = data[0].Rating;
                vigilancia = data[0].Vigilancia;
                pep = data[0].Pep;
                if (data[0].nombregrupo) {
                    idgrupo = data[0].idgrupo
                    nombregrupo = data[0].nombregrupo
                    ratinggrupal = data[0].ratinggrupal
                }
            } else {
                alert("Error al traer datos del cliente")
            }
        }
    });

    $("#gridMaster").append(`
            <div class="panel panel-primary">
                <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161;'>
                    <h3 class="panel-title">Información General</h3>
                </div>
                <div class="panel-body">
                    <div class="row">
                        <div class="col-xs-6 col-sm-6"><b>Cliente: </b>`+rut+` / `+nombre+` </div>
                        <div class="col-xs-6 col-sm-6"><b>Grupo Id: </b>`+idgrupo+` / `+nombregrupo+`</div>
                        
                    </div>
                    <div class="row">    
                        <div class="col-xs-6 col-sm-3"><b>Clasificación:</b> `+riesgo+`</div>
                        <div class="col-xs-6 col-sm-3"><b>Rating Ind:</b> `+rating+` <span class="glyphicon glyphicon-exclamation-sign" style="color: red;"></span></div>
                        <div class="col-xs-6 col-sm-3"><b>Rating Grupal:</b> `+ratinggrupal+` <span class="glyphicon glyphicon-ok-sign" style="color: green;"></div>     
                        <div class="col-xs-6 col-sm-3"><b>Vigilancia:</b> `+vigilancia+`</div>
                    </div>   
                    <div class="row">    
                        <!-- <div class="col-xs-6 col-sm-3"><b>F. Rating Ind:</b> 13-07-2017</div> -->
                        <!-- <div class="col-xs-6 col-sm-3"><b>F. Rating Grupal:</b> 13-07-2017</div>-->
                        <div class="col-xs-6 col-sm-3"><b>F. Creación MAC:</b> 03-07-2017</div>
                        <div class="col-xs-6 col-sm-3"><b>F. Vencimiento MAC:</b> 26-07-2018</div>
                    </div>       
                </div>
            </div>`);

    $("#gridMaster").append(tabs);
    $('#vertablimites_tab').addClass('media_node active span') //tab seleccionado
    $('.active[data-toggle="tab"]').each(function (e) {
        var $this = $(this),
            loadurl = $this.attr('href'),
            targ = $this.attr('data-target');
        if (targ === '#operacionmac') { //ver macgrupal es la grilla padre
            gridoperacionmac.renderGrid(loadurl, targ)//genera la grilla, la obtiene desde vermac
        } else if (targ === '#vertablimites') { // target del <li>
            gridvertablimites.renderGrid(loadurl, targ)
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
        } else if (targ === '#vertablimites') {
            gridvertablimites.renderGrid(loadurl, targ)
        } else if (targ === '#bitacora') {
            gridBitacora.renderGrid(loadurl, targ)
        }

        $this.tab('show');
        return false;
    });


})