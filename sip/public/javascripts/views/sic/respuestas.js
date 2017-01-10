var gridRespuestas = {

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
        tmpl += "<div class='column-full'>Respuesta<span style='color:red'>*</span>{respuesta}</div>";
        tmpl += "</div>";

        tmpl += "<hr style='width:100%;'/>";
        tmpl += "<div> {sData} {cData}  </div>";
        tmpl += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['id', 'Proveedor', 'Tipo', 'Pregunta', 'idresponsable', 'Responsable', 'Respuesta'],
            colModel: [
                {
                    name: 'id', index: 'id', key: true, hidden: true, width: 10, editable: false
                },
                { name: 'proveedor', width: 300, search: false, editable: false, hidden: false, jsonmap: "proveedor.razonsocial" },
                { name: 'tipo', width: 100, search: false, editable: true, hidden: false },
                {
                    name: 'pregunta', width: 400, search: false, editable: true,
                    hidden: false, edittype: "textarea", editoptions: { rows: "2" }
                },
                {
                    name: 'idresponsable', search: false, editable: false, hidden: true,
                },
                { name: 'responsable', width: 200, search: false, editable: false, hidden: false, formatter: returnResponsable, },
                {
                    name: 'respuesta', width: 800, search: false, editable: true, hidden: false,
                    edittype: 'custom',
                    editoptions: {
                        custom_element: function (value, options) {
                            var elm = $("<textarea></textarea>");
                            elm.val(value);
                            setTimeout(function () {
                                //tinymce.remove();
                                //var ctr = $("#" + options.id).tinymce();
                                //if (ctr !== null) {
                                //    ctr.remove();
                                //}
                                try {
                                    tinymce.remove("#" + options.id);
                                } catch (ex) { }
                                tinymce.init({
                                    menubar: false,
                                    statusbar: false,
                                    selector: "#" + options.id,
                                    //plugins: "link",
                                    plugins: [
                                        'link print'
                                    ],
                                    toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
                                    toolbar2: 'print preview media | forecolor backcolor emoticons | codesample',
                                    image_advtab: true,
                                    height: 300,
                                });
                            }, 50);
                            return elm;
                        },
                        custom_value: function (element, oper, gridval) {
                            var id;
                            if (element.length > 0) {
                                id = element.attr("id");
                            } else if (typeof element.selector === "string") {
                                var sels = element.selector.split(" "),
                                    idSel = sels[sels.length - 1];
                                if (idSel.charAt(0) === "#") {
                                    id = idSel.substring(1);
                                } else {
                                    return "";
                                }
                            }
                            if (oper === "get") {
                                return tinymce.get(id).getContent({ format: "row" });
                            } else if (oper === "set") {
                                if (tinymce.get(id)) {
                                    tinymce.get(id).setContent(gridval);
                                }
                            }
                        }
                    },

                },
            ],
            rowNum: 20,
            pager: '#navGridResp',
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
            caption: "Respuestas"
        });

        $gridTab.jqGrid('navGrid', '#navGridResp', { edit: true, add: false, del: false, search: false },
            {
                editCaption: "Responder",
                closeAfterEdit: true,
                recreateForm: true,
                template: tmpl,
                mtype: 'POST',
                url: '/sic/responder',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                }, beforeSubmit: function (postdata, formid) {
                    if (postdata.respuesta.lenght == 0) {
                        return [false, "Debe ingresar una respuesta", ""];
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
                //Delete
            }
        );
    }
}

function returnResponsable(cellValue, options, rowdata, action) {
    if (rowdata.user != null)
        return rowdata.user.first_name + ' ' + rowdata.user.last_name;
    else
        return '';
}
