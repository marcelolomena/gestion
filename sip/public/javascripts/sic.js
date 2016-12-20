var sicLibrary = {
    radioElemCalculado: function (value, options) {
        var receivedradio = '<label class="radio-inline"><input type="radio" name="calculado" value="1"',
            breakline = '/>Variable</label>',
            naradio = '<label class="radio-inline"><input type="radio" name="calculado" value="0"',
            endnaradio = '/>Constante</label>';

        if (value === '1') {
            return "<div style='margin-top:5px'>" + receivedradio + ' checked="checked"' + breakline + naradio + endnaradio + "</div>";
        }
        if (value === '0') {
            return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
        }
        return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + endnaradio + "</div>";
    },
    radioElemCritica: function(value, options) {
        var receivedradio = '<label class="radio-inline"><input type="radio" name="critica" value="1"',
            breakline = '/>Sí</label>',
            naradio = '<label class="radio-inline"><input type="radio" name="critica" value="0"',
            endnaradio = '/>No</label>';

        if (value === 'Sí') {
            return "<div style='margin-top:5px'>" + receivedradio + ' checked="checked"' + breakline + naradio + endnaradio + "</div>";
        }
        if (value === 'No') {
            return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
        }
        //return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + endnaradio + "</div>";
        return "<div style='margin-top:5px'>" + receivedradio + breakline + naradio + ' checked="checked"' + endnaradio + "</div>";
    },
    getRadioElementValue: function (elem, oper, value) {
        if (oper === "set") {
            var radioButton = $(elem).find("input:radio[value='" + value + "']");
            if (radioButton.length > 0) {
                radioButton.prop("checked", true);
            }
        }

        if (oper === "get") {
            return $(elem).find("input:radio:checked").val();
        }

    }
}