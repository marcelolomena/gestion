$(document).ready(function () {
    // PDFObject.embed("/reporte/testtroya", "#outerDiv");

    function ajax_download(url, data) {
        var $iframe,
            iframe_doc,
            iframe_html;

        if (($iframe = $('#download_iframe')).length === 0) {
            $iframe = $("<iframe id='download_iframe'" +
                " style='display: none' src='about:blank'></iframe>"
            ).appendTo("body");
        }

        iframe_doc = $iframe[0].contentWindow || $iframe[0].contentDocument;
        if (iframe_doc.document) {
            iframe_doc = iframe_doc.document;
        }

        iframe_html = "<html><head></head><body><form method='POST' action='" +
            url + "'>"

        Object.keys(data).forEach(function (key) {
            iframe_html += "<input type='hidden' name='" + key + "' value='" + data[key] + "'>";

        });

        iframe_html += "</form></body></html>";

        iframe_doc.open();
        iframe_doc.write(iframe_html);
        $(iframe_doc).find('form').submit();
    }

    $('#xlsx').on('click', function () {
        ajax_download('/reporte/testtroya', { 'para1': 1, 'para2': 2 });
    });
});