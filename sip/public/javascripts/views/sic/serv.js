//doc.js
var gridServ = {

    renderGrid: function (targ, data) {
        var $gridTab = $(targ + "_t")

        $gridTab.jqGrid({
            datatype: "local",
            data: data,
            colNames: ['id', 'Solicitud', 'Servicio', 'Glosa Servicio', 'Documento', 'Glosa Referencial', 'Nota Criticidad', 'Color Nota', 'Clase Proveedor'],
            colModel: [
                { name: 'id', index: 'id', key: true, hidden: true },
                { name: 'idsolicitud', index: 'idsolicitud', width: 100, editable: true },
                { name: 'idservicio', index: 'idservicio', width: 100, editable: true, editoptions: { size: 10 } },
                { name: 'glosaservicio', index: 'glosaservicio', hidden: true, width: 100, editable: true, editoptions: { size: 25 } },
                { name: 'iddocumento', index: 'iddocumento', width: 100, align: "center", editable: true, editoptions: { size: 10 } },
                { name: 'glosareferencia', index: 'glosareferencia', width: 200, align: "center", editable: true, editoptions: { size: 10 } },
                { name: 'notacriticidad', index: 'notacriticidad', width: 100, align: "center", editable: true, editoptions: { size: 10 } },
                { name: 'colornota', index: 'colornota', width: 50, align: "center", editable: true, editoptions: { size: 10 } },
                { name: 'claseproveedor', index: 'claseproveedor', width: 100, align: "center", editable: true, editoptions: { size: 10 } }
            ],
            rowNum: 10,
            rowList: [3, 6],
            loadonce: true,
            pager: '#navGridServ',
            styleUI: "Bootstrap",
            sortname: 'id',
            sortorder: "asc",
            height: "auto",
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Servicios"
        });
        $gridTab.jqGrid('navGrid', '#navGridServ', { edit: true, add: true, del: true, search: false },
            {
                editCaption: "Modifica Servicio",
                closeAfterEdit: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON
            }, {
                addCaption: "Agrega Servicio",
                closeAfterAdd: true,
                recreateForm: true,
                mtype: 'POST',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON
            }, {

            }, {

            });


    }
}

