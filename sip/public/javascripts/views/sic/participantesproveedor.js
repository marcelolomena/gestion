//doc.js
var gridParticipantesPro = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        //var $gridTab = $(targ + "_t")
        var $gridTab = $(targ + "_t_" + parentRowKey)

        var tmplServ = "<div id='responsive-form' class='clearfix'>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'><span style='color: red'>*</span>Provedor {idproveedor}</div>";
        tmplServ += "</div>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'><span style='color: red'>*</span>Nombre {nombre}</div>";
        tmplServ += "</div>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'><span style='color: red'>*</span>Cargo {cargo}</div>";
        tmplServ += "</div>";

        tmplServ += "<div class='form-row' style='display: none;'>";
        tmplServ += "</div>";

        tmplServ += "<hr style='width:100%;'/>";
        tmplServ += "<div> {sData} {cData}  </div>";
        tmplServ += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            //colNames: ['id', 'idServicio', 'Servicio', 'Glosa Servicio', 'Id Documento', 'Documento', 'Glosa Referencia', 'ID Clase Criticidad', 'Clase Criticidad', 'Nota Criticidad', 'Color Nota'],
            colModel: [
                { label: 'id', name: 'id', key: true, hidden: true },

                {
                    name: 'idproveedor', search: false, editable: true, hidden: true,
                    edittype: "select",
                    editoptions: {
                        dataUrl: '/sic/proveedoressugeridostotal/' + parentRowKey,
                        buildSelect: function (response) {
                            var rowKey = $gridTab.getGridParam("selrow");
                            var rowData = $gridTab.getRowData(rowKey);
                            var thissid = rowData.idproveedor;
                            var data = JSON.parse(response);
                            var s = "<select>";//el default
                            s += '<option value="0">--Seleccione Proveedor--</option>';
                            $.each(data, function (i, item) {

                                if (data[i].id == thissid) {
                                    s += '<option value="' + data[i].id + '" selected>' + data[i].razonsocial + '</option>';
                                } else {
                                    s += '<option value="' + data[i].id + '">' + data[i].razonsocial + '</option>';
                                }
                            });
                            return s + "</select>";
                        }
                    }
                },

                {
                    label: 'Nombre Proveedor', name: 'proveedor.razonsocial', width: 400, align: 'left', search: true, editable: true,
                    editrules: { edithidden: false, required: true }, hidedlg: true
                },
                { label: 'Nombre', name: 'nombre', width: 350, align: 'left', search: false, editable: true, editrules: { required: true } },
                { label: 'Cargo', name: 'cargo', width: 350, align: 'left', search: false, editable: true, editrules: { required: true } },

            ],
            rowNum: 10,
            rowList: [3, 6],
            pager: '#navGridPartPro',
            styleUI: "Bootstrap",
            sortname: 'id',
            sortorder: "asc",
            shrinkToFit: false,
            height: "auto",
            editurl: '/sic/participantesproveedor/' + parentRowKey,
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Participantes Proveedor",
            loadComplete: function (data) {
                var thisId = $.jgrid.jqID(this.id);
                $.get('/sic/getsession', function (data) {
                    $.each(data, function (i, item) {
                        console.log("EL ROL ES: " + item.glosarol)
                        if (item.glosarol != 'Administrador SIC' && item.glosarol != 'Negociador SIC') {
                            $("#add_" + thisId).addClass('ui-disabled');
                            //$("#add_gridMaster").hide();
                            $("#edit_" + thisId).addClass('ui-disabled');
                            //$("#edit__gridMaster").hide();
                            $("#del_" + thisId).addClass('ui-disabled');
                            //$("#del__gridMaster").hide();
                        }
                    });
                });
            }
        });
        $gridTab.jqGrid('navGrid', '#navGridPartPro', { edit: true, add: true, del: true, search: false },
            {
                closeAfterEdit: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                editCaption: "Modificar Participante ",
                template: tmplServ,
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                },
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                },
            }, {
                closeAfterAdd: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                addCaption: "Agregar Participante",
                template: tmplServ,
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                },
                onclickSubmit: function (rowid) {
                    return { parent_id: parentRowKey, idsolicitudcotizacion: parentRowKey };
                },
                beforeSubmit: function (postdata, formid) {
                    if (parseInt(postdata.idproveedor) == 0) {
                        return [false, "Proveedor: Seleccionar un proveedor", ""];
                    } else {
                        return [true, "", ""]
                    }
                },

            },
            {
                closeAfterDelete: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                addCaption: "Eliminar Participante",
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                }, afterSubmit: function (response, postdata) {
                    var json = response.responseText;
                    var result = JSON.parse(json);
                    console.dir(result);
                    if (result.sucess) {
                        return [true, "", ""];
                    } else {
                        return [false, result.error_text, ""];

                    }

                },
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                },
            }

        );



    }
}
