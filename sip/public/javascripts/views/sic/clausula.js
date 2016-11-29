//doc.js
var gridClausula = {

    renderGrid: function(loadurl, parentRowKey, targ) {
        var $gridTab = $(targ + "_t")

        var tmpl = "<div id='responsive-form' class='clearfix'>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Cláusula<span style='color:red'>*</span>{idclausula}</div>";
        tmpl += "</div>";

        tmpl += "<hr style='width:100%;'/>";
        tmpl += "<div> {sData} {cData}  </div>";
        tmpl += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['Id', 'idclausula', 'Texto'],
            colModel: [
                {
                    name: 'id', index: 'id', key: true, hidden: false,
                    editable: true, hidedlg: true, sortable: false, editrules: { edithidden: false }
                },
                {
                    name: 'idclausula', search: false, editable: true, hidden: true,
                    edittype: "select",
                    editoptions: {
                        dataUrl: '/sic/parametros/tipodocumento',
                        buildSelect: function(response) {
                            var rowKey = $gridTab.getGridParam("selrow");
                            var rowData = $gridTab.getRowData(rowKey);
                            var thissid = rowData.idtipodocumento;
                            var data = JSON.parse(response);
                            var s = "<select>";//el default
                            s += '<option value="0">--Escoger una Cláusula--</option>';
                            $.each(data, function(i, item) {

                                if (data[i].id == thissid) {
                                    s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                                } else {
                                    s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                                }
                            });
                            return s + "</select>";
                        }
                    }
                },
                { name: 'texto', index: 'texto', width: 200, align: "left", editable: true }
            ],
            rowNum: 20,
            pager: '#navGridClau',
            styleUI: "Bootstrap",
            sortname: 'id',
            sortorder: "asc",
            height: "auto",
            shrinkToFit: true,
            autowidth: true,
            onSelectRow: function(id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Clausulas"
        });

        $gridTab.jqGrid('navGrid', '#navGridClau', { edit: true, add: true, del: true, search: false },
            {
                editCaption: "Modifica Clausula",
                closeAfterEdit: true,
                recreateForm: true,
                template: tmpl,
                mtype: 'POST',
                url: '/sic/clausulas/action',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                onclickSubmit: function(rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                }, beforeSubmit: function(postdata, formid) {
                    if (parseInt(postdata.idclausula) == 0) {
                        return [false, "Cláusula: Debe escoger un valor", ""];
                    } else {
                        return [true, "", ""]
                    }
                }, afterSubmit: UploadDoc
            }, {
                addCaption: "Agrega Documento",
                closeAfterAdd: true,
                recreateForm: true,
                template: tmpl,
                mtype: 'POST',
                url: '/sic/clausulas/action',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                onclickSubmit: function(rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                }, beforeSubmit: function(postdata, formid) {
                    if (parseInt(postdata.idclausula) == 0) {
                        return [false, "Cláusula: Debe escoger un valor", ""];
                    } else {
                        return [true, "", ""]
                    }
                }, afterSubmit: UploadDoc
            }, {

            }, {

            });

    }
}