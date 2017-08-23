$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    $(".gcontainer").prepend(`
        <div id="cascara" style="background-image: url('../../images/cascaracdn.png'); width: 1266px; height: 95px;">   
                <div class="panel-body">
                    <form id="vista360" onsubmit="return false;">
                        <div class="form-group" style="padding-left: 260px; padding-top: 10px;">
                            <input id="rut" name="rut" class="form-control" style="height:46px; width:700px;border:none; display:inline">
                            </input>
                            <button type="submit" id="elboton" class="btn btn-default" style="margin-left: 80px;">Continuar</button>
                        </div>
                    </form>        
                </div>              
        </div>`);
    $(".gcontainer").append(`
        
        `);
    $('#rut').Rut({
        on_error: function () { alert('Rut incorrecto'); },
        format_on: 'keyup'
    });
    $(`#rut`).keypress(function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && ((charCode < 48 || charCode > 57 ) && ( charCode !=75|| charCode !=107)) ) {
            return false;
        }
        return true;
    })

    $('#elboton').click(function () {
        var rut = $("#rut").val();
        var aux = "";
        for(var i=0; i<rut.length - 1 ;i++){
            if (rut[i] != "." && rut[i]!= "-"){
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

    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });
});


