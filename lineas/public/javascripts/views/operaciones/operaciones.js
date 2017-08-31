$(document).ready(function () {
    var rut = $("#param").text();

    var tabs = "<ul class='nav nav-tabs tabs-up' id='myTab'>"
    tabs += "<li><a href='/limite/" + rut + "' data-target='#vertablimites' id='vertablimites_tab' data-toggle='tab'>Límites</a></li>"
    tabs += "<li><a href='/tipooperacion/" + rut + "' data-target='#operacion' id='operacion_tab' data-toggle='tab'>Operaciones</a></li>"
    tabs += "<li><a href='/reservar/' data-target='#reservar' id='reservar_tab' data-toggle='tab'>Reservas</a></li>"
    tabs += "<li><a href='/asignar/" + rut + "' data-target='#asignar' id='asignar_tab' data-toggle='tab'>Asignar</a></li>"
    tabs += "<li><a href='/bitacora/' data-target='#bitacora' id='bitacora_tab' data-toggle='tab'>Excepciones</a></li>"
    tabs += "<li><a href='/bitacora/' data-target='#bitacora' id='bitacora_tab' data-toggle='tab'>Reportes</a></li>"
    tabs += "<li><a href='/aprobaciones/" + rut + "' data-target='#operacionmac' id='operacionmac_tab' data-toggle='tab'>Aprobaciones</a></li>"
    tabs += "</ul>"

    tabs += "<div class='tab-content'>"

    tabs += "<div class='tab-pane active' id='vertablimites'><table id='vertablimites_t'></table><div id='navGridtabverlimites'></div></div>"
    tabs += "<div class='tab-pane' id='operacion'><table id='operacion_t'></table><div id='navGridveroperaciones'></div></div>"
    tabs += "<div class='tab-pane' id='bitacora'><table id='bitacora_t'></table><div id='navGridBita'></div></div>"
    tabs += "<div class='tab-pane' id='bitacora'><table id='bitacora_t'></table><div id='navGridBita'></div></div>"
    tabs += "<div class='tab-pane' id='operacionmac'><div class='container-fluid'><table id='operacionmac_t'></table><div id='lol'></div></div></div>"
    tabs += "<div class='tab-pane' id='operacionmac3'><div class='container-fluid'><table id='operacionmac3_t'></table><div id='lol'></div></div></div>"
    tabs += "<div class='tab-pane' id='asignar'><div class='container-fluid'><table id='asignar_t'></table><div id='lol'></div></div></div>"
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
    var dv = ""
    var comportamiento = ""
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
                dv = data[0].Dv;
                comportamiento = data[0].Comportamiento;
                if (data[0].Comportamiento == "Verde") {
                    comportamiento = '<img src="../../../../images/greencircle.png" width="19px"/></span>'
                }
                else {
                    if (data[0].Comportamiento == "Rojo") {
                        comportamiento = '<img src="../../../../images/redcircle.png" width="19px"/></span>'
                    }
                    else {
                        comportamiento = '<img src="../../../../images/yellowcircle.png" width="19px"/></span>'
                    }

                }

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
    $('#camponum').Rut({
        //on_error: function () { alert('Rut incorrecto'); },
        format_on: 'keyup'
    });
    $(`#camponum`).keypress(function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && ((charCode < 48 || charCode > 57) && (charCode != 75 || charCode != 107))) {
            return false;
        }
        return true;
    })

    $('#btnenviar').click(function () {
        var rut = $("#camponum").val();
        var aux = "";
        for (var i = 0; i < rut.length - 1; i++) {
            if (rut[i] != "." && rut[i] != "-") {
                aux = aux + rut[i];
            }

        }
        rut = aux;

        $.ajax({
            type: "GET",
            url: '/getdatoscliente/' + rut,
            async: false,
            success: function (data) {
                if (data.length > 0) {
                    window.location.assign("/menu/operaciones/p/" + rut);
                } else {
                    alert("No existe cliente en Base de Datos");
                }
            }
        });
    });
    $(".cajaRut").html(`
    <div class="id_rut">`+ rut + "-" + dv + `</div>
    <div class="id_nombre">`+ nombre + `</div>
    <div class="id_banca">Banca Corporativa / Oficina Moneda / PEP</div>


`);
$(".cajaRut").append(`
<div class="tabsheader">
<div class="tab1">
  <div class="tab_cajaTop">Segmento - Departamento</div>
  <div class="tab_cajaBottom">Multinacionales 1</div>
</div>
<div class="tab1">
  <div class="tab_cajaTop">Vinculación - Prioridad</div>
  <div class="tab_cajaBottom_b">Usuario - 4</div>
</div>
<div class="tab1">
  <div class="tab_cajaTop">Última Visita</div>
  <div class="tab_cajaBottom_b">23/08/2016</div>
</div>
<div class="tab1">
  <div class="tab_cajaTop">Comp. - Riesgo - Rating</div>
  <div class="tab_cajaBottom">A5 - 7.5</div>
</div>
<div class="tab1">
  <div class="tab_cajaTop">Cobertura de Garantía</div>
  <div class="tab_cajaBottom">30%</div>
</div>
<div class="tab1">
  <div class="tab_cajaTop">Rentabilidad</div>
  <div class="tab_cajaBottom">ROE 20%</div>
</div>
<div class="tab1">
  <div class="tab_cajaTop">Plan Tarifario</div>
  <div class="tab_cajaBottom">Por Producto</div>
</div>
</div>
`)
    /*
    $("#gridMaster").append(`
                <div class="panel panel-primary">
                    <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161;'>
                        <h3 class="panel-title">Información General</h3>
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-xs-6 col-sm-6"><b>Cliente: </b>`+ rut + "-" + dv + ` / ` + nombre + ` </div>
                            <div class="col-xs-6 col-sm-6"><b>Grupo Id: </b>`+ idgrupo + ` / ` + nombregrupo + `</div>
                            
                        </div>
                        <div class="row">    
                            <div class="col-xs-6 col-sm-3"><b>Clasificación:</b> `+ riesgo + `</div>
                            <div class="col-xs-6 col-sm-3"><b>Rating Ind:</b> `+ rating + ` <span class="glyphicon glyphicon-exclamation-sign" style="color: red;"></span></div>
                            <div class="col-xs-6 col-sm-3"><b>Rating Grupal:</b> `+ ratinggrupal + ` <span class="glyphicon glyphicon-ok-sign" style="color: green;"></div>     
                            <div class="col-xs-6 col-sm-3"><b>Vigilancia:</b> `+ vigilancia + `</div>
                        </div>   
                        <div class="row">    
                            <!-- <div class="col-xs-6 col-sm-3"><b>F. Rating Ind:</b> 13-07-2017</div> -->
                            <!-- <div class="col-xs-6 col-sm-3"><b>F. Rating Grupal:</b> 13-07-2017</div>-->
                            <div class="col-xs-6 col-sm-3"><b>F. Creación MAC:</b> 03-07-2017</div>
                            <div class="col-xs-6 col-sm-3"><b>Comportamiento: `+ comportamiento + `</b></div>
                        </div>
                        
                </div>
        ` );
    
    $("#gridMaster").append(`
                    <div class="panel panel-primary" style="width: 240px; margin-left: 14px">
                        <div class="panel-body">
                            <div class="row">
                                <div><b> F. Vencimiento MAC:</b> 26-07-2018</div>     
         
                            </div>      
                        </div>
                    </div>
    
                
        ` );
        */

    $("#gridMaster").append(tabs);
    $('#vertablimites_tab').addClass('media_node active span') //tab seleccionado
    $('.active[data-toggle="tab"]').each(function (e) {
        var $this = $(this),
            loadurl = $this.attr('href'),
            targ = $this.attr('data-target');
        if (targ === '#operacionmac') { //ver macgrupal es la grilla padre
            gridaprobaciones.renderGrid(loadurl, targ)  //genera la grilla, la obtiene desde vermac
            //gridaprobaciones2.renderGrid(loadurl, targ + '3')
            //$("a#operacionmac3_tab").tab('show');
        } else if (targ === '#vertablimites') { // target del <li>
            gridvertablimites.renderGrid(loadurl, targ)
        } else if (targ === '#operacion') {
            gridBitacora.renderGrid(loadurl, targ)
        } else if (targ === '#asignar') {
            gridvertabasignaciones.renderGrid(loadurl, targ)
        }
        //console.log($this)
        $this.tab('show');
        return false;
    });

    $('[data-toggle="tab"]').click(function (e) {
        var $this = $(this),
            loadurl = $this.attr('href'),
            targ = $this.attr('data-target');
        if (targ === '#operacionmac') {
            gridaprobaciones.renderGrid(loadurl, targ)
            //gridaprobaciones2.renderGrid(loadurl, targ + '3')
            //$("a#operacionmac3_tab").tab('show');
        } else if (targ === '#vertablimites') {
            gridvertablimites.renderGrid(loadurl, targ)
        } else if (targ === '#operacion') {
            gridvertaboperaciones.renderGrid(loadurl, targ)
        } else if (targ === '#asignar') {
            gridvertabasignaciones.renderGrid(loadurl, targ)
        }
        //console.log($this)
        $this.tab('show');
        return false;
    });


})