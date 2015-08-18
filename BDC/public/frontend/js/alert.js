window.alert = function(message){
    $(document.createElement('div'))
        .attr({title: 'Alert', 'class': 'alert'})
        .html(message)
        .dialog({
            buttons: {OK: function(){$(this).dialog('close');}},
            close: function(){$(this).remove();},
            draggable: true,
            modal: true,
            resizable: false,
            width: 'auto'
        });
};