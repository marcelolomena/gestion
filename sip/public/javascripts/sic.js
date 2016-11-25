var sicLibrary = {
    radioElemCalculado: function(value, options) {
        var receivedradio = '<label class="radio-inline"><input type="radio" name="calculado" value="1"',
            breakline = '/>Factor Variable</label>',
            naradio = '<label class="radio-inline"><input type="radio" name="calculado" value="0"',
            endnaradio = '/>Factor Constante</label>';

        if (value === '1') {
            return "<div style='margin-top:5px'>" + receivedradio + ' checked="checked"' + breakline + naradio + endnaradio + "</div>";
        }
        if (value === '0') {
            return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
        }
        return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + endnaradio + "</div>";
    }
}