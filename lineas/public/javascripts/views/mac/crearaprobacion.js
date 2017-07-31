$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
    var rut = $("#param").text();
    var id = ""
    var nombre = ""
    $.ajax({
        type: "GET",
        url: '/getdatoscliente/' + rut,
        async: false,
        success: function (data) {
            if (data.length > 0) {
                id = data[0].Id;
                nombre = data[0].Nombre;
            } else {
                alert("Error al traer datos del cliente")
                window.location.assign("/menu/vista360");
            }
        }
    });
    var nombregrupo = "No tiene"
    if(rut =="90222000"){
        nombregrupo = "MATTE"
    }
    $(".gcontainer").prepend(`
            <div class="panel panel-primary">
                <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161;'>
                    <h3 class="panel-title">Paso 1 de 3 - Seleccionar Tipo de Aprobación</h3>
                </div>
                <div class="panel-body">
                    <div class="row">
                        <div class="col-xs-4" style="font-size:12px"><b>`+ rut + `</b></div>
                    </div>
                    <div class="row">
                        <div class="col-xs-4" style="font-size:18px"><b>`+ nombre + `</b></div>
                        <div class="col-xs-4" style="font-size:16px"><b>Grupo: `+ nombregrupo + `</b></div>
                    </div>
                    <div class="row">
                        <div class="col-xs-4" style="font-size:12px"><b>Banca Corporativa / Oficina Moneda / PEP</b></div>
                    </div>
                    <div class="row">    
                        <div class="col-xs-4" style="font-size:12px"><b>Ejecutivo Control: Alvaro Vidal</b></div>
                    </div>
                    <div class="row">
                        <div class="col-xs-4" style="font-size:12px"><b>Riesgo: A5 / Rating: 7.5</b></div>
                    </div>
                    <hr class="section-separations"></hr>
                    <form id="paso2" onsubmit="return false;">
                        <div class="form-group col-lg-6">
                            <label for="tipoaprobacion">Tipo Aprobación:</label>
                            <select id="tipoaprobacion" class="form-control" style="height:auto; width:auto;">
                                <option value="0">Seleccione un valor</option>    
                                <option value="1">MAC</option> 
                                <option value="2">Prórroga</option> 
                                <option value="3">Especial</option> 
                                <option value="4">Complementaria</option> 
                                <option value="5">Atribuciones Factory</option> 
                                <option value="6">Atribuciones Leasing</option> 
                            </select>
                            <div id="warning" class="form-group" style="display: none;">
                                <span id="mensaje" class="glyphicon glyphicon-exclamation-sign" style="color: red; margin-top:10px;"> Warning</span>     
                            </div>
                            <button id="elboton" type="submit" class="btn neutro border ladda-button ng-scope" style="margin-top:20px;">Crear Aprobación</button>   
                        </div>    
                    </form>        
                </div>              
            </div>`);
    $(".gcontainer").append(`
        
        `);
    $('#tipoaprobacion').on('change', function () {
        if (this.value == "1") {
            $('#warning').css("display", "none");
            $('#paso2').attr("action", "/menu/crearaprobacionmac");
        } else {
            $('#warning').css("display", "block");
            $('#mensaje').html(" Funcionalidad no desarrollada")
        }
    })
    $('#elboton').click(function () {
        var tipoaprobacion = $('#tipoaprobacion option:selected').val();

        if (tipoaprobacion == 1) {
            window.location.assign("/menu/crearaprobacionmac/p/" + id);
        } else {
            alert("Funcionalidad no desarrollada");
        }
    })


    //<a href='2' class="btn btn-info" role="button" style="background-color: #0B2161; border-color: #0B2161;"></a>

    $(window).bind('resize', function () {
        8
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });
});



