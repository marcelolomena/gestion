//doc.js
var gridClausula = {

    renderGrid: function(loadurl, parentRowKey, targ) {
        //var $gridTab = $(targ + "_t")
        var $gridTab = $(targ + "_t_" + parentRowKey)

        var tmpl = "<div id='responsive-form' class='clearfix'>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Clase<span style='color:red'>*</span>{idclase}</div>";
        tmpl += "</div>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Código<span style='color:red'>*</span>{idclausulaplantilla}</div>";
        tmpl += "</div>";


        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Cláusula<span style='color:red'>*</span>{texto}</div>";
        tmpl += "</div>";

        tmpl += "<hr style='width:100%;'/>";
        tmpl += "<div> {sData} {cData}  </div>";
        tmpl += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['Id', 'Clase', 'codclase', 'idclase', 'idplantilla', 'Código', 'idclausulaplantilla', 'Texto'],
            colModel: [
                {
                    name: 'id', index: 'id', key: true, hidden: true,
                    editable: true, hidedlg: true, sortable: false, editrules: { edithidden: false }
                },
                { name: 'Clase', index: 'clase', width: 100, align: "left", editable: false, jsonmap: "plantillaclausula.clase.nombre", },
                { name: 'codclase', index: 'codclase', editable: false, hidden: true, jsonmap: "plantillaclausula.clase.id", },
                {
                    name: 'idclase', search: false, editable: true, hidden: true,
                    edittype: "select",
                    editoptions: {
                        dataUrl: '/sic/clases',
                        buildSelect: function(response) {
                            var rowKey = $gridTab.getGridParam("selrow");
                            var rowData = $gridTab.getRowData(rowKey);
                            var thissid = rowData.codclase;
                            var data = JSON.parse(response);
                            var s = "<select>";//el default
                            s += '<option value="0">--Escoger Clase--</option>';
                            $.each(data, function(i, item) {

                                if (data[i].id == thissid) {
                                    s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                                } else {
                                    s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                                }
                            });
                            return s + "</select>";
                        },
                        dataEvents: [{
                            type: 'change', fn: function(e) {
                                //$("input#tarea").val($('option:selected', this).val());
                                var idClausulaPlantilla = $('option:selected', this).val()
                                if (idClausulaPlantilla != "0") {
                                    $.ajax({
                                        type: "GET",
                                        url: '/sic/plantillas/' + idClausulaPlantilla,
                                        async: false,
                                        success: function(data) {
                                            var rowKey = $gridTab.getGridParam("selrow");
                                            var rowData = $gridTab.getRowData(rowKey);
                                            var thissid = rowData.idclausulaplantilla;
                                            var s = "<select>";//el default
                                            s += '<option value="0">--Escoger Código--</option>';
                                            $.each(data, function(i, item) {
                                                if (data[i].id == thissid) {
                                                    s += '<option value="' + data[i].id + '" selected>' + data[i].codigo + '</option>';
                                                } else {
                                                    s += '<option value="' + data[i].id + '">' + data[i].codigo + '</option>';
                                                }
                                            });
                                            s += "</select>";
                                            //console.log(s)
                                            $("select#idclausulaplantilla").html(s);
                                        }
                                    });
                                }

                            }
                        }],
                    }
                },
                { name: 'codplantilla', index: 'codplantilla', hidden: true, editable: false, jsonmap: "plantillaclausula.id", },
                { name: 'Código', index: 'Código', width: 100, align: "left", editable: false, jsonmap: "plantillaclausula.codigo", },
                {
                    name: 'idclausulaplantilla', search: false, editable: true, hidden: true, edittype: "select",
                    editoptions: {
                        value: "0:--Escoger Código--",
                        dataEvents: [{
                            type: 'change', fn: function(e) {
                                var thisval = $(this).val();
                                if (thisval) {
                                    $.ajax({
                                        type: "GET",
                                        url: '/sic/texto/' + thisval,
                                        success: function(data) {
                                            //console.dir(data[0].glosaclausula)
                                            //$("input#texto").val(data[0].glosaclausula);
                                            tinymce.activeEditor.execCommand('mceInsertContent', false, data[0].glosaclausula);
                                        }
                                    });
                                }
                            }
                        }]
                    },
                },
                {
                    name: 'texto', index: 'texto', editable: true,
                    width: 800, hidden: false,
                    //edittype: "textarea",
                    edittype: 'custom',
                    editoptions: {
                        custom_element: function(value, options) {
                            var elm = $("<textarea></textarea>");
                            elm.val(value);
                            setTimeout(function() {
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
                                    plugins: "link"
                                });
                            }, 50);
                            return elm;
                        },
                        custom_value: function(element, oper, gridval) {
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
                }
            ],
            rowNum: 20,
            pager: '#navGridClau',
            styleUI: "Bootstrap",
            sortname: 'id',
            sortorder: "asc",
            height: "auto",
            rownumbers: true,
            width: 1000,
            shrinkToFit: true,
            //autowidth: true,
            onSelectRow: function(id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Clausulas"
        });

        $gridTab.jqGrid('navGrid', '#navGridClau', { edit: true, add: true, del: true, view: true, search: false },
            {
                editCaption: "Modifica Cláusula",
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
                }, beforeShowForm: function(form) {
                    setTimeout(function() {
                        $.ajax({
                            type: "GET",
                            url: '/sic/plantillas/' + $gridTab.getRowData($gridTab.getGridParam("selrow")).codclase,
                            success: function(data) {
                                var s = "<select>";//el default
                                s += '<option value="0">--Escoger Código--</option>';
                                $.each(data, function(i, item) {
                                    if (data[i].id == $gridTab.getRowData($gridTab.getGridParam("selrow")).codplantilla) {
                                        s += '<option value="' + data[i].id + '" selected>' + data[i].codigo + '</option>';
                                    } else {
                                        s += '<option value="' + data[i].id + '">' + data[i].codigo + '</option>';
                                    }
                                });
                                s += "</select>";
                                $("#idclausulaplantilla").html(s);
                            }
                        });
                    }, 100);
                }
            }, {
                addCaption: "Agrega Cláusula",
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
                    if (parseInt(postdata.idclausulaplantilla) == 0) {
                        return [false, "Cláusula: Debe escoger un valor", ""];
                    } else {
                        return [true, "", ""]
                    }
                }
            }, {
                mtype: 'POST',
                url: '/sic/clausulas/action',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                beforeShowForm: function(form) {
                    ret = $gridTab.getRowData($gridTab.jqGrid('getGridParam', 'selrow'));
                    $("td.delmsg", form).html("<b>Usted borrará la Cláusula:</b><br>" + ret.texto);

                },
                afterSubmit: function(response, postdata) {
                    var json = response.responseText;
                    var result = JSON.parse(json);
                    if (!result.success)
                        return [false, result.message, ""];
                    else
                        return [true, "", ""]
                }

            }, {

            });

    }
}