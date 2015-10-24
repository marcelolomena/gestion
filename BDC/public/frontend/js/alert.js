window.alert = function(message){
    $(document.createElement('div'))
        .attr({title: 'Alerta', 'class': 'alert'})
        .html(message)
        .dialog({
            buttons: {OK: function(){$(this).dialog('close');}},
            close: function(){$(this).remove();},
            draggable: true,
            modal: true,
            resizable: false,
            width: 'auto',
            open: function (event, ui) {
            	 $('.ui-dialog').css('z-index',103);
            	 $('.ui-widget-overlay').css('z-index',102);
            	},
        });
};