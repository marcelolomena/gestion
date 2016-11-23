//doc.js
var gridDoc = {

    renderGrid: function (targ, data) {
        var $gridTab = $(targ + "_t")

        $gridTab.jqGrid({
            datatype: "local",
            data: data,
            colNames: ['id', 'Tipo', 'Nombre', 'Descripción', 'Responsable', 'Archivo', 'Archivo'],
            colModel: [
                { name: 'id', index: 'id', key: true, hidden: true, editable: true, hidedlg: true, editrules: { edithidden: true } },
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
            rowNum: 10,
            rowList: [3, 6],
            loadonce: true,
            pager: '#navGrid',
            styleUI: "Bootstrap",
            sortname: 'id',
            sortorder: "asc",
            height: "auto",
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
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON
            }, {
                addCaption: "Agrega Documento",
                closeAfterAdd: true,
                recreateForm: true,
                mtype: 'POST',
                url: '/sic/documentos/save',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                afterSubmit: sipLibrary.UploadDoc
            }, {

            }, {

            });


    }
}

