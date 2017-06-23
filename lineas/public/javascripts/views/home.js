$(document).ready(function () {

    $("#zerogrid1").click(function(){
        //alert('hola:');
        var actual = $('#contenedor').attr('class');
        if (actual == 'container') {
            $('#contenedor').attr('class','container open-sidebar');
        } else {
            $('#contenedor').attr('class','container');
        }
    });  
    $("#zerogrid2").click(function(){
        //alert('hola');
        var actual = $('#contenedor').attr('class');
        if (actual == 'container') {
            $('#contenedor').attr('class','container open-sidebar');
        } else {
            $('#contenedor').attr('class','container');
        }
    });     
});