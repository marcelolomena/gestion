//sip.js
var sipLibrary = {

    jsonOptions: {
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    },

    createJSON: function (postdata) {
        if (postdata.id === '_empty')
            postdata.id = null;
        return JSON.stringify(postdata)
    },

    showChildGrid: function (parentRowID, parentRowKey) {
        $.ajax({
            url: "/programa/" + parentRowKey,
            type: "GET",
            success: function (json) {
                console.log(json.codigoart);
                var tr='<table>';
                    tr+='<tr>';
                    tr+="<td>ART</td>";                    
                    tr+="<td>" + json.codigoart + "</td>";
                    tr+='</tr>';
                tr+='</table>';
                console.log(tr);
                $("#" + parentRowID).append(tr);
            }
        });
    }
    
}

