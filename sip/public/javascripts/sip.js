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
    centerDialog: function (id) {
        var dlgDiv = $("#editmod" + id);
        var parentDiv = dlgDiv.parent(); // div#gbox_list
        var dlgWidth = dlgDiv.width();
        var parentWidth = parentDiv.width();
        var dlgHeight = dlgDiv.height();
        var parentHeight = parentDiv.height();
        var parentTop = parentDiv.offset().top;
        var parentLeft = parentDiv.offset().left;

        var height = parentTop + (parentHeight - dlgHeight) / 2
        if (height < 0)
            height = 0;

        dlgDiv[0].style.top = Math.round(height) + "px";
        dlgDiv[0].style.left = Math.round(parentLeft + (parentWidth - dlgWidth) / 2) + "px";

    }

}

