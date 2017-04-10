//doc.js
var gridPreguntasrfp = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        //var $gridTab = $(targ + "_t")
        var $gridTab = $(targ + "_t_" + parentRowKey)

        var tmplServ = "<div id='responsive-form' class='clearfix'>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'>Pregunta<span style='color:red'>*</span>{fileToUpload}</div>";
        tmplServ += "</div>";

        tmplServ += "<hr style='width:100%;'/>";
        tmplServ += "<div> {sData} {cData}  </div>";
        tmplServ += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['id', 'Preguntas', 'pregunta'],
            colModel: [
                { name: 'id', index: 'id', key: true, hidden: true },
                { name: 'pregunta', width: 1100, search: false, editable: false, hidden: false },
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
                },

            ],
            //rowList: [3, 6],
            //page: 1,
            rowNum: 10,
            pager: '#navGridPreg',
            styleUI: "Bootstrap",
            sortname: 'id',
            sortorder: "asc",
            shrinkToFit: false,
            height: "auto",
            width: "auto",
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Preguntas al Proveedor",
            loadComplete: function (data) {
                var thisId = $.jgrid.jqID(this.id);
                $.get('/sic/getsession', function (data) {
                    $.each(data, function (i, item) {
                        console.log("EL ROL ES: " + item.glosarol)
                        if (item.glosarol != 'Administrador SIC' && item.glosarol != 'Negociador SIC') {
                            $("#add_" + thisId).addClass('ui-disabled');
                            //$("#add_gridMaster").hide();
                            //$("#edit_" + thisId).addClass('ui-disabled');
                            //$("#edit__gridMaster").hide();
                            $("#del_" + thisId).addClass('ui-disabled');
                            //$("#del__gridMaster").hide();
                            $("#download_" + thisId).addClass('ui-disabled');
                        }
                    });
                });
            }
        });
        $gridTab.jqGrid('navGrid', '#navGridPreg', { edit: false, add: true, del: true, search: false },
            {
                editCaption: "Modifica",
                closeAfterEdit: true,
                recreateForm: true,
                template: tmplServ,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
            }, {
                addCaption: "Agrega Preguntas",
                mtype: 'POST',
                url: '/sic/preguntasrfp/action',
                closeAfterAdd: true,
                recreateForm: true,
                template: tmplServ,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                beforeShowForm: function (form) {
                    //$('input#notacriticidad', form).attr('readonly', 'readonly');
                },
                beforeSubmit: function (postdata, formid) {
                    if (postdata.idsolicitudcotizacion == 0) {
                        return [false, "Pregunta : Campo obligatorio", ""];
                    } else {
                        return [true, "", ""]
                    }
                },
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                },afterSubmit: UploadPre

            },
            
            {
                closeAfterDelete: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                addCaption: "Eliminar Pregunta",
                mtype: 'POST',
                url: '/sic/preguntasrfp/action',
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                }
            }

        );

        $gridTab.jqGrid('navButtonAdd', '#navGridPreg', {
            caption: "",
            id: "download_" + $(targ + "_t_" + parentRowKey).attr('id'),
            buttonicon: "glyphicon glyphicon-download-alt",
            title: "Generar Documento",
            position: "last",
            onClickButton: function () {
                //var rowKey = $gridTab.getGridParam("selrow");
                //var parentRowData = $("#gridMaster").getRowData(parentRowKey);
                //console.log(parentRowData.idtipo)
                //console.log(parentRowData.idgrupo)
                try {
                    var url = '/sic/descargapreguntas/' + parentRowKey;
                    $gridTab.jqGrid('excelExport', { "url": url });
                } catch (e) {
                    console.log("error: " + e)

                }

            }
        });


    }
}

function UploadPre(response, postdata) {
    //console.log(postdata)
    var data = $.parseJSON(response.responseText);
    if (data.success) {
        if ($("#fileToUpload").val() != "") {
            ajaxPregUpload(data.id);
        }
    }

    return [data.success, data.message, data.id];
}

function ajaxPregUpload(id) {
    var dialog = bootbox.dialog({
        title: 'Se inicia la transferencia',
        message: '<p><i class="fa fa-spin fa-spinner"></i> Esto puede durar segundos...</p>'
    });
    dialog.init(function () {
        $.ajaxFileUpload({
            url: '/sic/preguntasrfps/upload',
            secureuri: false,
            fileElementId: 'fileToUpload',
            dataType: 'json',
            data: { id: id},
            success: function (data, status) {
                if (typeof (data.success) != 'undefined') {
                    if (data.success == true) {
                        dialog.find('.bootbox-body').html(data.message);
                        $("#preguntasrfp_t_" + id).trigger('reloadGrid');
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

