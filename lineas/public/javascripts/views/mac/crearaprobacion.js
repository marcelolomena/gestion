$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
    var rut = $("#param").text();
    var id = ""
    var nombre = ""
    var nombregrupo = "No tiene"
    var banca = ""
    var oficina = ""
    var ejecutivo = ""
    var riesgo = ""
    var rating = ""
    var pep = ""
    $.ajax({
        type: "GET",
        url: '/getdatoscliente/' + rut,
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
                pep = data[0].Pep;
                if (data[0].grupo) {
                    nombregrupo = data[0].grupo
                }
            } else {
                alert("Error al traer datos del cliente")
                window.location.assign("/menu/vista360");
            }
        }
    });


    $(".gcontainer").prepend(`
            <div class="panel panel-primary">
                <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161;'>
                    <h3 class="panel-title">Seleccionar Tipo de Aprobación</h3>
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
                        <div class="col-xs-4" style="font-size:12px"><b>`+ banca + ` / ` + oficina + ` / ` + pep + `</b></div>
                    </div>
                    <div class="row">    
                        <div class="col-xs-4" style="font-size:12px"><b>Ejecutivo Control: `+ ejecutivo + `</b></div>
                    </div>
                    <div class="row">
                        <div class="col-xs-4" style="font-size:12px"><b>Riesgo: `+ riesgo + ` / Rating: ` + rating + `</b></div>
                    </div>
                    <hr class="section-separations"></hr>
                    <form id="paso2" onsubmit="return false;">
                        <div class="form-group col-lg-6">
                            <label for="tipoaprobacion">Tipo Aprobación:</label>
                            <select id="tipoaprobacion" class="form-control" style="height:auto; width:auto;">
                                
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

    var contenidoselect = `<option value="0">Seleccione un valor</option>`

    $.ajax({
        type: "GET",
        url: '/gettiposaprobacion',
        async: false,
        success: function (data) {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    contenidoselect += "<option value='"+data[i].Id+"'>"+data[i].Nombre+"</option>"
                }
                $('#tipoaprobacion').html(contenidoselect);
            } else {
                alert("No existen tipos de aprobación en BD")
            }
        }
    });

    $('#tipoaprobacion').on('change', function () {
        if (this.value == "0") {
            $('#mensaje').html(" Debe seleccionar un tipo de aprobación")
            $('#warning').css("display", "block");
        } else{
            if (this.value == "1") {
                $('#warning').css("display", "none");
                $('#paso2').attr("action", "/menu/crearaprobacionmac");
            } else{
                $('#warning').css("display", "block");
                $('#mensaje').html(" Funcionalidad no desarrollada")
            }
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


    $(window).bind('resize', function () {
        8
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });
});



