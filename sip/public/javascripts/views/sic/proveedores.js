var gridProveedor = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var $gridTab = $(targ + "_t_" + parentRowKey)
        var tmpl = "<div id='responsive-form' class='clearfix'>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Proveedor<span style='color:red'>*</span>{idproveedor}</div>";
        tmpl += "</div>";

        tmpl += "<hr style='width:100%;'/>";
        tmpl += "<div> {sData} {cData}  </div>";
        tmpl += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['id','Rut', 'idproveedor', 'Proveedor'],
            colModel: [
                {
                    name: 'id', index: 'id', key: true, hidden: true, width: 10, editable: false
                },
                {
                    name: 'rut', index: 'rut',  hidden: false, width: 10, editable: false,jsonmap: "proveedor.numrut",
                },                
                {
                    name: 'idproveedor', search: false, editable: true, hidden: true, width: 100, jsonmap: "proveedor.id",
                    edittype: "select",
                    editoptions: {
                        dataUrl: '/proveedores/combobox',
                        buildSelect: function (response) {
                            var grid = $("#grid");
                            var rowKey = grid.getGridParam("selrow");
                            var rowData = grid.getRowData(rowKey);
                            var thissid = rowData.idproveedor;

                            var data = JSON.parse(response);
                            var s = "<select>";//el default
                            s += '<option value="0">--Escoger Proveedor--</option>';
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

                { name: 'proveedor', width: 150, search: false, editable: false, hidden: false, jsonmap: "proveedor.razonsocial" },

            ],
            rowNum: 20,
            pager: '#navGridPro',
            styleUI: "Bootstrap",
            sortname: 'id',
            sortorder: "asc",
            height: "auto",
            autowidth: true,
            rownumbers: true,
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Proveedores"
        });

        $gridTab.jqGrid('navGrid', '#navGridPro', { edit: false, add: true, del: true, search: false },
            {
            }, {
                addCaption: "Agrega Proveedor",
                closeAfterAdd: true,
                recreateForm: true,
                template: tmpl,
                mtype: 'POST',
                url: '/sic/preguntaproveedor/action',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                }, beforeSubmit: function (postdata, formid) {
                    if (parseInt(postdata.idproveedor) == 0) {
                        return [false, "Proveedor: Debe escoger un valor", ""];
                    } else {
                        return [true, "", ""]
                    }
                }
            }, {
                mtype: 'POST',
                url: '/sic/preguntaproveedor/action',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                onclickSubmit: function (rowid) {
                    return { idsolicitud: parentRowKey };
                },
                beforeShowForm: function (form) {
                    ret = $gridTab.getRowData($gridTab.jqGrid('getGridParam', 'selrow'));
                    $("td.delmsg", form).html("<b>Usted borrará el proveedor:</b><br><b>" + ret.proveedor + "</b> ?");

                },
                afterSubmit: function (response, postdata) {
                    var json = response.responseText;
                    var result = JSON.parse(json);
                    if (!result.success)
                        return [false, result.message, ""];
                    else
                        return [true, "", ""]
                }
            });
    }
}



