var gridAsignar = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var $gridTab = $(targ + "_t_" + parentRowKey)
        var tmpl = "<div id='responsive-form' class='clearfix'>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Tipo<span style='color:red'>*</span>{tipo}</div>";
        tmpl += "</div>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Pregunta<span style='color:red'>*</span>{pregunta}</div>";
        tmpl += "</div>";


        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Responsable<span style='color:red'>*</span>{idresponsable}</div>";
        tmpl += "</div>";

        tmpl += "<hr style='width:100%;'/>";
        tmpl += "<div> {sData} {cData}  </div>";
        tmpl += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['id', 'Proveedor', 'Tipo', 'Preguntas', 'idresponsable', 'Responsable'],
            colModel: [
                { name: 'id', index: 'id', key: true, hidden: true, width: 10, editable: false },
                { name: 'proveedor', width: 300, search: false, editable: false, hidden: false, jsonmap: "proveedor.razonsocial" },
                { name: 'tipo', width: 100, search: false, editable: true, hidden: false },
                { name: 'pregunta', width: 450, search: false, editable: true, hidden: false, edittype: "textarea", editoptions: { rows: "4" } },
                {
                    name: 'idresponsable', width: 120, search: false, editable: true, hidden: true, edittype: "select",
                    editrules: { edithidden: true },
                    editoptions: {
                        dataUrl: '/sic/getresponsablessolicitud/'+parentRowKey,
                        buildSelect: function (response) {
                            var rowKey = $gridTab.getGridParam("selrow");
                            var rowData = $gridTab.getRowData(rowKey);
                            var thissid = rowData.idresponsable;
                            var data = JSON.parse(response);
                            var s = "<select>";
                            s += '<option value="0">--Escoger Responsable--</option>';
                            $.each(data, function (i, item) {
                                if (data[i].uid == thissid) {
                                    s += '<option value="' + data[i].uid + '" selected>' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                                } else {
                                    s += '<option value="' + data[i].uid + '">' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                                }
                            });
                            return s + "</select>";
                        }
                    }
                },
                { name: 'responsable', width: 120, search: false, editable: false, hidden: false, formatter: returnResponsable, },
            ],
            rowNum: 20,
            pager: '#navGridAsig',
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
            caption: "Asignación"
        });

        $gridTab.jqGrid('navGrid', '#navGridAsig', { edit: true, add: false, del: false, search: false },
            {
                editCaption: "Asignar Responsable",
                closeAfterEdit: true,
                recreateForm: true,
                //template: tmpl,
                mtype: 'POST',
                url: '/sic/asignar',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                }, beforeSubmit: function (postdata, formid) {
                    if (parseInt(postdata.idproveedor) == 0) {
                        return [false, "Tipo Documento: Debe escoger un valor", ""];
                    } else {
                        return [true, "", ""]
                    }
                },
                beforeShowForm: function (form) {
                    $("#tipo", form).attr('readonly', 'readonly');
                    $("#pregunta", form).attr('readonly', 'readonly');
                },

            }, {
                //Add
            }, {
                mtype: 'POST',
                url: '/sic/pre/falsa',
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

function returnResponsable(cellValue, options, rowdata, action) {
    if (rowdata.user != null)
        return rowdata.user.first_name + ' ' + rowdata.user.last_name;
    else
        return '';
}
