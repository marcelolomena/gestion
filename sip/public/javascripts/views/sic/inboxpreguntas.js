$(document).ready(function () {

    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Pregunta<span style='color:red'>*</span>{pregunta}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Respuesta<span style='color:red'>*</span>{respuesta}</div>";
    tmpl += "</div>";

    tmpl += "<hr style='width:100%;'/>";
    tmpl += "<div> {sData} {cData}  </div>";
    tmpl += "</div>";

    var $grid = $("#table_inbox"),
        catalogoclausulasModel = [
            { label: 'ID', name: 'idpregunta', key: true, hidden: false, width: 25 },
            { label: 'Solicitud Cotización', name: 'descripcion', width: 300, align: 'left', search: false, editable: false, editrules: { required: true } },
            { label: 'ID Solicitud', name: 'idsolicitud', width: 250, align: 'left', hidden: true, search: false, editable: false, },
            { label: 'Tipo Pregunta', name: 'tipo', width: 150, align: 'left', search: false, editable: false },
            {
                label: 'Pregunta', name: 'pregunta', width: 300, search: false, editable: true, hidden: false, edittype: "textarea", editoptions: { rows: "2" }
            },
            {
                label: 'Respuesta', name: 'respuesta', width: 340, search: false, editable: true, hidden: false,
                edittype: 'custom',
                editoptions: {
                    custom_element: function (value, options) {
                        var elm = $("<textarea></textarea>");
                        elm.val(value);
                        setTimeout(function () {
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
        ];

    $grid.jqGrid({
        url: '/sic/inboxpreguntaslist',
        datatype: "json",
        mtype: "POST",
        colModel: catalogoclausulasModel,
        page: 1,
        rowNum: 20,
        regional: 'es',
        height: 'auto',
        width: 1200,
        shrinkToFit: true,
        viewrecords: true,
        editurl: '/sic/inboxpreguntasaction',
        caption: 'Preguntas Solicitudes de Cotización',
        styleUI: "Bootstrap",
        onSelectRow: function (id) {
            var getID = $(this).jqGrid('getCell', id, 'id');
        },
        pager: "#pager_inbox",
    });

    //$grid.jqGrid('filterToolbar', { stringResult: true, searchOperators: false, searchOnEnter: false, defaultSearch: 'cn' });

    $grid.jqGrid('navGrid', '#pager_inbox', { edit: true, add: false, del: false, search: false },
        {
            editCaption: "Responder Preguntas",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (!result.success) {
                    return [false, result.message, ""];
                } else {
                    //var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"titulo\",\"op\":\"cn\",\"data\":\"" + postdata.titulo + "\"}]}";
                    //$grid.jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            },
            beforeShowForm: function (form) {
                $("#pregunta", form).attr('readonly', 'readonly');
            },

        }, {
            addCaption: "Agrega Clase",
            closeAfterAdd: true,
            recreateForm: true,
            mtype: 'POST',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText

            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error != 0) {
                    return [false, result.glosa, ""];
                } else {
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"titulo\",\"op\":\"cn\",\"data\":\"" + postdata.titulo + "\"}]}";
                    $grid.jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }

        }, {

        }, {

        });


    var $grid = $("#table_inboxRFC"),
        catalogoclausulasModel = [
            { label: 'ID', name: 'id', key: true, hidden: false, width: 50 },
            { label: 'CUI', name: 'idcui', width: 75, align: 'left', search: false, editable: false, editrules: { required: true } },
            { label: 'tipo', name: '', width: 150, align: 'left', search: false, editable: false },
            { label: 'ID Program', name: 'tipo', width: 150, align: 'left', search: false, editable: false },
            { label: 'ID Program', name: 'tipo', width: 150, align: 'left', search: false, editable: false },
            { label: 'ID Program', name: 'tipo', width: 150, align: 'left', search: false, editable: false },
            { label: 'ID Program', name: 'tipo', width: 150, align: 'left', search: false, editable: false },
            { label: 'ID Program', name: 'tipo', width: 150, align: 'left', search: false, editable: false },
            { label: 'ID Program', name: 'tipo', width: 150, align: 'left', search: false, editable: false },
            { label: 'ID Program', name: 'tipo', width: 150, align: 'left', search: false, editable: false },
            { label: 'ID Program', name: 'tipo', width: 150, align: 'left', search: false, editable: false },
            { label: 'ID Program', name: 'tipo', width: 150, align: 'left', search: false, editable: false },
            { label: 'ID Program', name: 'tipo', width: 150, align: 'left', search: false, editable: false },

            {
                label: 'Pregunta', name: 'pregunta', width: 300, search: false, editable: true, hidden: false, edittype: "textarea", editoptions: { rows: "2" }
            },
            {
                label: 'Respuesta', name: 'respuesta', width: 340, search: false, editable: true, hidden: false,
                edittype: 'custom',
                editoptions: {
                    custom_element: function (value, options) {
                        var elm = $("<textarea></textarea>");
                        elm.val(value);
                        setTimeout(function () {
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
        ];

    $grid.jqGrid({
        url: '/sic/inboxpreguntaslist',
        datatype: "json",
        mtype: "POST",
        colModel: catalogoclausulasModel,
        page: 1,
        rowNum: 20,
        regional: 'es',
        height: 'auto',
        width: 1200,
        shrinkToFit: true,
        viewrecords: true,
        editurl: '/sic/inboxpreguntasaction',
        caption: 'Mis RFC',
        styleUI: "Bootstrap",
        onSelectRow: function (id) {
            var getID = $(this).jqGrid('getCell', id, 'id');
        },
        pager: "#pager_inboxRFC",
    });

    //$grid.jqGrid('filterToolbar', { stringResult: true, searchOperators: false, searchOnEnter: false, defaultSearch: 'cn' });

    $grid.jqGrid('navGrid', '#pager_inboxRFC', { edit: true, add: false, del: false, search: false },
        {
            editCaption: "Responder Preguntas",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (!result.success) {
                    return [false, result.message, ""];
                } else {
                    //var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"titulo\",\"op\":\"cn\",\"data\":\"" + postdata.titulo + "\"}]}";
                    //$grid.jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            },
            beforeShowForm: function (form) {
                $("#pregunta", form).attr('readonly', 'readonly');
            },

        }, {
            addCaption: "Agrega Clase",
            closeAfterAdd: true,
            recreateForm: true,
            mtype: 'POST',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText

            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error != 0) {
                    return [false, result.glosa, ""];
                } else {
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"titulo\",\"op\":\"cn\",\"data\":\"" + postdata.titulo + "\"}]}";
                    $grid.jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }

        }, {

        }, {

        });
})