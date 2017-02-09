//doc.js
var gridForo = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        //var $gridTab = $(targ + "_t")
        var $gridTab = $(targ + "_t_" + parentRowKey)

        var tmplForo = "<div id='responsive-form' class='clearfix'>";


        tmplForo += "<div class='form-row'>";
        tmplForo += "<div class='column-full'>Pregunta<span style='color:red'>*</span>{glosapregunta}</div>";
        tmplForo += "</div>";

        tmplForo += "<hr style='width:100%;'/>";
        tmplForo += "<div> {sData} {cData}  </div>";
        tmplForo += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['id', 'Idsolicitud', 'Pregunta', 'Nombre', 'Apellido', 'Fecha'],
            colModel: [
                { name: 'id', index: 'id', key: true, hidden: true },

                { name: 'idsolicitudcotizacion', index: 'idsolicitudcotizacion',  hidden: true },

                {
                    name: 'glosapregunta', index: 'glosapregunta', editable: true,
                    width: 500, hidden: false,
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
                { name: 'user.first_name', index: 'nombre', width: 250, editable: true, editoptions: { size: 10 } },
                { name: 'user.last_name', index: 'apellido', width: 250, editable: true, editoptions: { size: 10 } },
                {
                    name: 'fechapregunta', index: 'fechapregunta', width: 150, align: 'left', search: false,
                    formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
                    editable: true, editrules: { required: true },
                    searchoptions: {
                        dataInit: function (el) {
                            $(el).datepicker({
                                language: 'es',
                                format: 'dd-mm-yyyy',
                                autoclose: true,
                                onSelect: function (dateText, inst) {
                                    setTimeout(function () {
                                        $gridTab[0].triggerToolbar();
                                    }, 100);
                                }
                            });
                        },
                        sopt: ["eq", "le", "ge"]
                    }
                },

            ],
            rowNum: 10,
            rowList: [3, 6],
            pager: '#navGridForo',
            subGrid: true,
            subGridRowExpanded: gridRespuestaForo,
            subGridOptions: {
                plusicon: "glyphicon-hand-right",
                minusicon: "glyphicon-hand-down"
            },
            styleUI: "Bootstrap",
            sortname: 'id',
            sortorder: "asc",
            shrinkToFit: false,
            height: "auto",
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Foro"
        });

        $gridTab.jqGrid('navGrid', '#navGridForo', { edit: false, add: true, del: true, search: false },
            {
                editCaption: "Modifica",
                closeAfterEdit: true,
                recreateForm: true,
                template: tmplForo,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
            }, {
                addCaption: "Agrega Preguntas",
                mtype: 'POST',
                url: '/sic/foro/' + parentRowKey,

                closeAfterAdd: true,
                recreateForm: true,
                template: tmplForo,
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
                },

            },

            {
                closeAfterDelete: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                addCaption: "Eliminar Pregunta",
                mtype: 'POST',
                url: '/sic/foro/action',
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                }
            }

        );

    }



}
function gridRespuestaForo(parentRowID, parentRowKey, suffix) {
    var subgrid_id = parentRowID;
    var row_id = parentRowKey;
    var subgrid_table_id, pager_id, toppager_id;
    subgrid_table_id = subgrid_id + '_t';
    pager_id = 'p_' + subgrid_table_id;
    toppager_id = subgrid_table_id + '_toppager';
    if (suffix) {
        subgrid_table_id += suffix;
        pager_id += suffix;
    }

    var tmpresforo = "<div id='responsive-form' class='clearfix'>";

    tmpresforo += "<div class='form-row'>";
    tmpresforo += "<div class='column-full'>Respuesta<span style='color:red'>*</span>{glosarespuesta}</div>";
    tmpresforo += "</div>";

    tmpresforo += "<div class='form-row'>";
    tmpresforo += "<div class='column-full'>Documento Asociado<span style='color:red'>*</span>{iddocumento}</div>";
    tmpresforo += "</div>";

    tmpresforo += "<div class='form-row' style='display: none;'>";
    tmpresforo += "</div>";

    tmpresforo += "<hr style='width:100%;'/>";
    tmpresforo += "<div> {sData} {cData}  </div>";
    tmpresforo += "</div>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    console.log("la subgrid_id : " + subgrid_id)

    var grillapadre = subgrid_id.substring(0, subgrid_id.lastIndexOf("_"));
    console.log("la grilla padre: " + grillapadre)
    var rowData = $("#" + grillapadre).getRowData(parentRowKey);
    console.log("la rowData : " + rowData)
    var parentSolicitud = rowData.idsolicitudcotizacion;
    console.log("la parentSolicitud : " + parentSolicitud)

    var childGridURL = "/sic/listarespuestaforo/" + parentRowKey + "/list";




    var modelrespuestaforo = [
        { label: 'id', name: 'id', key: true, hidden: true },

        {
            name: 'glosarespuesta', index: 'glosarespuesta', label: 'Respuesta', editable: true,
            width: 800, hidden: false,
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
        {
            name: 'iddocumento', index: 'iddocumento', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/sic/docrespuesta/' + parentSolicitud,
                buildSelect: function (response) {
                    var rowKey = $("#" + childGridID).getGridParam("selrow");
                    var rowData = $("#" + childGridID).getRowData(rowKey);
                    var thissid = rowData.iddocumento;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Seleccione un Documento--</option>';
                    $.each(data, function (i, item) {

                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombrecorto + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombrecorto + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }
        },

        { label: 'Documento', name: 'documentoscotizacion.nombrecorto', index: 'documento', width: 150, editable: true, editoptions: { size: 10 } },

        { name: 'user.first_name', index: 'user.first_name', label: 'Nombre', width: 250, editable: true, editoptions: { size: 10 } },
        { name: 'user.last_name', index: 'user.last_name', label: 'Apellido', width: 250, editable: true, editoptions: { size: 10 } },
        {
            name: 'fecha', index: 'fecha', label: 'Fecha', width: 150, align: 'left', search: false,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
            editable: true, editrules: { required: true },
            searchoptions: {
                dataInit: function (el) {
                    $(el).datepicker({
                        language: 'es',
                        format: 'dd-mm-yyyy',
                        autoclose: true,
                        onSelect: function (dateText, inst) {
                            setTimeout(function () {
                                $gridTab[0].triggerToolbar();
                            }, 100);
                        }
                    });
                },
                sopt: ["eq", "le", "ge"]
            }
        },
    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        caption: 'Respuestas',
        rownumbers: true,
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        page: 1,
        colModel: modelrespuestaforo,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,
        editurl: '/sic/actionrespuesta/' + parentRowKey,
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "id": 0, "tipofecha": "No hay datos", "fecha": "" });
            }
        }
    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            editCaption: "Modificar ",
            template: tmpresforo,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }
        },
        {
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agregar Respuesta",
            template: tmpresforo,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentRowKey };
            }
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Eliminar Respuesta",
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (!result.success)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }
        },
        {
            recreateFilter: true
        }
    );
}


