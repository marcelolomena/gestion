$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
    function formatearNumero(nStr) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? ',' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + '.' + '$2');
        }
        return x1 + x2;
    }
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
    var dv = ""
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
                dv = data[0].Dv;
                if (data[0].grupo) {
                    nombregrupo = data[0].grupo
                }
            } else {
                alert("Error al traer datos del cliente")
                window.location.assign("/menu/vista360");
            }
        }
    });
    $(".cajaRut").html(`
    <div class="id_rut">`+ rut + "-" + dv + `</div>
    <div class="id_nombre">`+ nombre + `</div>
    <div class="id_banca">Banca Corporativa / Oficina Moneda / PEP</div>


`);


    $(".gcontainer").prepend(`
            <div class="panel panel-primary">
                <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161;'>
                    <h3 class="panel-title">Seleccionar Tipo de Aprobación</h3>
                </div>
                <div class="panel-body">
                    <form id="paso2" onsubmit="return false;">
                        <div class="form-group col-lg-6">
                            <label for="tipoaprobacion">Tipo Aprobación:</label>
                            <select id="tipoaprobacion" class="form-control" style="height:auto; width:auto;">
                                
                            </select>
                            <div id="warning" class="form-group" style="display: none;">
                                <span id="mensaje" class="glyphicon glyphicon-exclamation-sign" style="color: red; margin-top:10px;"> Warning</span>     
                            </div>
                            <div id="sinmacgrupal" class="form-group" style="display:none; padding-top: 10px;">
                                <p>
                                    No ha sido posible encontrar MAC de Grupo asociado a este cliente </br>
                                    ¿Desea buscar el grupo por otro RUT cliente o crear grupo nuevo para el cliente seleccionado?
                                </p>
                                <button id="si" class="btn btn-default">Buscar Nuevo Cliente</button> 
                                <button id="no" class="btn btn-default">Crear Nuevo Grupo</button>  
                            </div>
                            <div id="buscarrut" class="form-group" style="display:none;">
                                <form id="paso2" onsubmit="return false;">
                                    <label for="nuevorut">Ingrese RUT de Empresa:</label>
                                    <input id="nuevorut" class="form-control" style="height:auto; width:auto;">
                                    </input>
                                    <button id="elboton2" type="submit" class="btn neutro border ladda-button ng-scope" style="margin-top:15px;">Continuar</button>
                                </form>  
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
                    contenidoselect += "<option value='" + data[i].Id + "'>" + data[i].Nombre + "</option>"
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
        } else {
            if (this.value == "1") {
                $('#warning').css("display", "none");
                $('#paso2').attr("action", "/menu/crearaprobacionmac");
            } else {
                $('#warning').css("display", "block");
                $('#mensaje').html(" Funcionalidad no desarrollada")
            }
        }

    })
    $('#elboton').click(function () {
        console.log("hola")
        var tipoaprobacion = $('#tipoaprobacion option:selected').val();

        if (tipoaprobacion == 1) {
            $.ajax({
                type: "GET",
                url: '/getdatosclientecongrupo2/' + rut,
                async: false,
                success: function (data) {
                    if (data.length > 0) {

                        var idgrupo = data[0].Grupo_Id
                        $.ajax({
                            type: "GET",
                            url: '/getdatosclientecongrupo3/' + idgrupo + '/' + id,
                            async: false,
                            success: function (data2) {
                                if (data2.length > 0) {
                                    window.location.assign("/menu/crearaprobacionmac/p/" + data2[0].idcabecera);
                                } else {
                                    alert("Error")
                                }
                            }
                        });
                        /*
                        var idcabeceraold = data.
                            window.location.assign("/menu/crearaprobacionmac/p/" + id);
                        
                            alert("Cliente ya tiene MAC Grupal vigente")

                            */
                    } else {
                        $('#tipoaprobacion').prop('disabled', 'disabled');
                        $('#sinmacgrupal').css("display", "block");
                    }
                }
            });




        } else {
            alert("Funcionalidad no desarrollada");
        }
    })

    $('#elboton2').click(function () {
        var nuevorut = $("#nuevorut").val()
        window.location.assign("/menu/crearaprobacion/p/" + nuevorut);
    })

    $('#si').click(function () {
        $('#sinmacgrupal').css("display", "none");
        $("#buscarrut").css("display", "block")
    });

    $('#no').click(function () {
        var nombregrupo = prompt("Ingrese un nombre para el grupo", nombre);
        if (nombregrupo == null || nombregrupo == "") {
            alert("Debe ingresar un nombre de grupo")
        } else {
            $.ajax({
                type: "GET",
                url: '/creargruponuevo/' + id + '/' + nombregrupo,
                async: false,
                success: function (data) {
                    var idcabecera = data[0].idcabecera
                    console.log("primero la data")
                    console.dir(data);
                    console.log("la cabecera " + idcabecera)
                    if (data.length > 0) {
                        window.location.assign("/menu/crearaprobacionmac/p/" + idcabecera);
                    } else {
                        alert("Error al crear grupo");
                    }
                }
            });
        }



    });


    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });
});