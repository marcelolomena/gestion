$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
    $(".gcontainer").prepend(`
        <div id="cascara" style="background-image: url('../../images/cascaracdn.png'); width: 1266px; height: 95px;">   
                <div class="panel-body">
                    <form id="paso2" onsubmit="return false;">
                        <div class="form-group" style="padding-left: 260px; padding-top: 10px;">
                            <input id="rut" class="form-control" style="height:46px; width:700px;border:none; display:inline">
                            </input>
                            <button type="submit" id="elboton" class="btn btn-default" style="margin-left: 80px;">Continuar</button>
                        </div>
                    </form>        
                </div>              
        </div>`);
    $(".gcontainer").append(`
        
        `);
    $('#elboton').click(function () {
        var rut = $("#rut").val();
        $.ajax({
            type: "GET",
            url: '/getdatoscliente/' + rut,
            async: false,
            success: function (data) {
                if (data.length > 0) {
                    window.location.assign ("/menu/crearaprobacion/p/" + rut);
                } else {
                    alert("No existe cliente en Base de Datos");
                }
            }
        });

    });
    /*
    $('#rut').on('change', function () {
        if (this.value != "") {
            $('#warning').css("display", "none");
            $('#paso2').attr("action", "/menu/crearaprobacion/p/" + this.value);
        } else {
            $('#warning').css("display", "block");
            $('#mensaje').html("Ingrese un RUT")
        }
    })
    */
    //<a href='2' class="btn btn-info" role="button" style="background-color: #0B2161; border-color: #0B2161;"></a>

    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });
});



