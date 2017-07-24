$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
    
    $(".gcontainer").prepend(`
            <div class="panel panel-primary">
                <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161;'>
                    <h3 class="panel-title">Paso 1 de 3 - Seleccionar Tipo de Aprobación</h3>
                </div>
                <div class="panel-body">
                    <form id="paso2" action="/menu/crearaprobacion">
                        <div class="form-group">
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
                        </div>
                        <div id="warning" class="form-group" style="display: none;">
                            <span id="mensaje" class="glyphicon glyphicon-exclamation-sign" style="color: red;"> Warning</span>     
                        </div>
                        <button type="submit" class="btn btn-default">Continuar</button>      
                    </form>        
                </div>              
            </div>`);
    $(".gcontainer").append(`
        
        `);
    $('#tipoaprobacion').on('change', function () {
        if(this.value=="1"){
            $('#warning').css("display", "none");
            $('#paso2').attr("action", "/menu/crearaprobacionmac"); 
        }else{
            $('#warning').css("display", "block");
            $('#mensaje').html(" Funcionalidad no desarrollada")
        }
    })
    //<a href='2' class="btn btn-info" role="button" style="background-color: #0B2161; border-color: #0B2161;"></a>

    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });
});



