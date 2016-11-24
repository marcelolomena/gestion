//doc.js
var gridServ = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var $gridTab = $(targ + "_t")
        console.log('le parent: '+parentRowKey);

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['id', 'Solicitud', 'idServicio', 'Servicio', 'Glosa Servicio', 'Id Documento','Documento', 'Glosa Referencia', 'Nota Criticidad', 'Color Nota', 'Clase Proveedor'],
            colModel: [
                { name: 'id', index: 'id', key: true, hidden: true },
                { name: 'idsolicitud', index: 'idsolicitud', width: 100, hidden: true, editable: true },
                { name: 'idservicio', index: 'idservicio', width: 100, hidden: true, editable: true, editoptions: { size: 10 } },
                { name: 'servicio.nombre', index: 'servicio', width: 150, editable: true, editoptions: { size: 10 } },
                { name: 'glosaservicio', index: 'glosaservicio', width: 200, editable: true, editoptions: { size: 25 } },
                { name: 'iddoctotecnico', index: 'iddoctotecnico', width: 100, hidden: true,  editable: true, editoptions: { size: 10 } },
                { name: 'documentoscotizacion.nombrecorto', index: 'documento', width: 150, editable: true, editoptions: { size: 10 } },
                { name: 'glosareferencia', index: 'glosareferencia', width: 200, align: "left", editable: true, editoptions: { size: 10 } },
                { name: 'notacriticidad', index: 'notacriticidad', width: 150, align: "left", editable: true, editoptions: { size: 10 } },
                { name: 'colornota', index: 'colornota', width: 50, align: "left", editable: true, editoptions: { size: 10 } },
                { name: 'claseproveedor', index: 'claseproveedor', width: 150, align: "left", editable: true, editoptions: { size: 10 } }
            ],
            rowNum: 5,
            rowList: [3, 6],
            loadonce: true,
            pager: '#navGridServ',
            styleUI: "Bootstrap",
            sortname: 'id',
            sortorder: "asc",
            shrinkToFit: false,
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

