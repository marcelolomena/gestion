//doc.js
var gridDoc = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var $gridTab = $(targ + "_t")

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['id', 'Tipo', 'Nombre', 'Descripción', 'Responsable', 'Archivo', 'Archivo'],
            colModel: [
                { name: 'id', index: 'id', key: true, hidden: true, editable: true, hidedlg: true, editrules: { edithidden: false } },
                { name: 'idtipodocumento', index: 'idtipodocumento', width: 100, editable: true },
                { name: 'nombrecorto', index: 'nombrecorto', width: 100, editable: true, editoptions: { size: 10 } },
                { name: 'descripcionlarga', index: 'descripcionlarga', hidden: true, width: 100, editable: true, editoptions: { size: 25 } },
                { name: 'nombreresponsable', index: 'nombreresponsable', width: 100, align: "center", editable: true, editoptions: { size: 10 } },
                { name: 'nombrearchivo', index: 'nombrearchivo', hidden: true, editable: false },
                {
                    name: 'fileToUpload',
                    hidden: true,
                    editable: true,
                    edittype: 'file',
                    editrules: { edithidden: true },
                    editoptions: {
                        enctype: "multipart/form-data"
                    },
                    search: false
                }
            ],
            rowNum: 20,
            pager: '#navGrid',
            styleUI: "Bootstrap",
            sortname: 'id',
            sortorder: "asc",
            height: "auto",
            shrinkToFit: false,
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Documentos"
        });

        $gridTab.jqGrid('navGrid', '#navGrid', { edit: true, add: true, del: true, search: false },
            {
                editCaption: "Modifica Documento",
                closeAfterEdit: true,
                recreateForm: true,
                mtype: 'POST',
                url: '/sic/documentos/action',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                },
                afterSubmit: UploadDoc
            }, {
                addCaption: "Agrega Documento",
                closeAfterAdd: true,
                recreateForm: true,
                mtype: 'POST',
                url: '/sic/documentos/action',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                },
                afterSubmit: UploadDoc
            }, {

            }, {

            });


    }
}

function UploadDoc(response, postdata) {

    var data = $.parseJSON(response.responseText);
    if (data.success) {
        if ($("#fileToUpload").val() != "") {
            ajaxDocUpload(data.id, data.parent);
        }
    }

    return [data.success, data.message, data.id];

}

function ajaxDocUpload(id, parent) {
    var dialog = bootbox.dialog({
        title: 'Se inicia la transferencia',
        message: '<p><i class="fa fa-spin fa-spinner"></i> Esto puede durar varios minutos...</p>'
    });
    dialog.init(function () {
        $.ajaxFileUpload({
            url: '/sic/documentos/upload',
            secureuri: false,
            fileElementId: 'fileToUpload',
            dataType: 'json',
            data: { id: id, parent: parent },
            success: function (data, status) {
                if (typeof (data.success) != 'undefined') {
                    if (data.success == true) {
                        dialog.find('.bootbox-body').html(data.message);
                    } else {
                        dialog.find('.bootbox-body').html(data.message);
                    }
                }
                else {
                    dialog.find('.bootbox-body').html(data.message);
                }
            },
            error: function (data, status, e) {
                dialog.find('.bootbox-body').html(e);
            }
        })
    });
}


