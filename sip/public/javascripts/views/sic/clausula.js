//doc.js
var gridClausula = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var $gridTab = $(targ + "_t_" + parentRowKey)
        var tmpl = "<div id='responsive-form' class='clearfix'>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Clase<span style='color:red'>*</span>{idclase}</div>";
        tmpl += "</div>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Código<span style='color:red'>*</span>{idclausulaplantilla}</div>";
        tmpl += "</div>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Nombre<span style='color:red'>*</span>{titulo}</div>";
        tmpl += "</div>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Cláusula<span style='color:red'>*</span>{glosa}</div>";
        tmpl += "</div>";

        tmpl += "<hr style='width:100%;'/>";
        tmpl += "<div> {sData} {cData}  </div>";
        tmpl += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['Id', 'Clase', 'codclase', 'idclase', 'idplantilla', 'Código', 'idclausulaplantilla', 'Nombre', 'Texto'],
            colModel: [
                {
                    name: 'id', index: 'id', key: true, hidden: true,
                    editable: true, hidedlg: true, sortable: false, editrules: { edithidden: false }
                },
                { name: 'clase', index: 'clase', width: 300, align: "left", editable: false, jsonmap: "plantillaclausula.clase.titulo", },
                { name: 'codclase', index: 'codclase', editable: false, hidden: true, jsonmap: "plantillaclausula.clase.id", },
                {
                    name: 'idclase', search: false, editable: true, hidden: true,
                    edittype: "select",
                    editoptions: {
                        dataUrl: '/sic/clases',
                        buildSelect: function (response) {
                            var rowKey = $gridTab.getGridParam("selrow");
                            var rowData = $gridTab.getRowData(rowKey);
                            var thissid = rowData.codclase;
                            var data = JSON.parse(response);
                            var s = "<select>";//el default
                            s += '<option value="0">--Escoger Clase--</option>';
                            $.each(data, function (i, item) {

                                if (data[i].id == thissid) {
                                    s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                                } else {
                                    s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                                }
                            });
                            return s + "</select>";
                        },
                        dataEvents: [{
                            type: 'change', fn: function (e) {
                                //$("input#tarea").val($('option:selected', this).val());
                                var idClausulaPlantilla = $('option:selected', this).val()
                                if (idClausulaPlantilla != "0") {
                                    $.ajax({
                                        type: "GET",
                                        url: '/sic/plantillas/' + idClausulaPlantilla,
                                        async: false,
                                        success: function (data) {
                                            var rowKey = $gridTab.getGridParam("selrow");
                                            var rowData = $gridTab.getRowData(rowKey);
                                            var thissid = rowData.idclausulaplantilla;
                                            var s = "<select>";//el default
                                            s += '<option value="0">--Escoger Código--</option>';
                                            $.each(data, function (i, item) {
                                                if (data[i].id == thissid) {
                                                    s += '<option value="' + data[i].id + '" selected>' + data[i].codigo + '</option>';
                                                } else {
                                                    s += '<option value="' + data[i].id + '">' + data[i].codigo + '</option>';
                                                }
                                            });
                                            s += "</select>";
                                            $("select#idclausulaplantilla").html(s);
                                        }
                                    });
                                }

                            }
                        }],
                    }
                },
                { name: 'codplantilla', index: 'codplantilla', hidden: true, editable: false, jsonmap: "plantillaclausula.id", },
                {
                    name: 'Código', index: 'Código', width: 200, align: "left", editable: false, jsonmap: "plantillaclausula.codigo",
                },
                {
                    name: 'idclausulaplantilla', search: false, editable: true, hidden: true, edittype: "select",
                    editoptions: {
                        value: "0:--Escoger Código--",
                        dataEvents: [{
                            type: 'change', fn: function (e) {
                                var thisval = $(this).val();
                                if (thisval) {
                                    var parentRowData = $("#gridMaster").getRowData(parentRowKey);
                                    //console.log(parentRowData.idtipo)
                                    //console.log(parentRowData.idgrupo)
                                    $.ajax({
                                        type: "GET",
                                        url: '/sic/texto/' + thisval + '/' + parentRowData.idgrupo,
                                        success: function (data) {
                                            if (data) {
                                                $("input#titulo").val(data[0].nombrecorto);
                                                //tinymce.activeEditor.execCommand('mceInsertContent', false, data[0].glosaclausula);
                                                tinyMCE.activeEditor.setContent(data[0].glosaclausula);
                                            } else {
                                                $("input#titulo").val('');
                                                tinyMCE.activeEditor.setContent('');
                                            }
                                        }
                                    });
                                }
                            }
                        }]
                    },
                },
                { name: 'titulo', index: 'titulo', width: 300, align: "left", editable: true },
                {
                    name: 'glosa', index: 'glosa', editable: true,
                    width: 1280, hidden: false,
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
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Cláusulas",
            gridComplete: function () {
                var recs = $gridTab.getGridParam("reccount"),
                    thisId = $.jgrid.jqID(this.id);

                if (isNaN(recs) || recs == 0) {
                    $("#add_" + thisId).addClass('ui-disabled');
                    $("#edit_" + thisId).addClass('ui-disabled');
                    $("#del_" + thisId).addClass('ui-disabled');
                    $("#refresh_" + thisId).addClass('ui-disabled');
                    $("#download_" + thisId).addClass('ui-disabled');

                    $gridTab.jqGrid('navButtonAdd', '#navGridClau', {
                        caption: "",
                        id: "pushpin_" + $(targ + "_t_" + parentRowKey).attr('id'),
                        buttonicon: "glyphicon glyphicon-pushpin",
                        title: "Agrega Cláusulas Predefinidas",
                        position: "last",
                        onClickButton: function () {
                            var parentRowData = $("#gridMaster").getRowData(parentRowKey);
                            console.log(parentRowData.idtipo)
                            console.log(parentRowData.idgrupo)

                            /*
                            $.getJSON('/sic/parametros2/grupoclausula', function(data) {
                                bootbox.prompt({
                                    title: "Generando Cláusulas Predefinidas...",
                                    inputType: 'select',
                                    inputOptions: data,
                                    callback: function(result) {
                                        if (result) {
                                            $.getJSON('/sic/default/' + parentRowKey + '/' + result, function(res) {
                                                $gridTab.trigger("reloadGrid");
                                                bootbox.alert(res.message);
                                            });
                                        } else {
                                            bootbox.alert("Debe seleccionar un grupo de cláusulas");
                                        }
                                    }
                                });
                            });
                            */
                            var dialog = bootbox.dialog({
                                title: 'Generando Cláusulas Predefinidas...',
                                message: '<p><i class="fa fa-spin fa-spinner"></i> Esto puede durar varios minutos...</p>'
                            });
                            dialog.init(function () {
                                $.getJSON('/sic/default/' + parentRowKey + '/' + parentRowData.idgrupo + '/' + parentRowData.idtipo, function (res) {
                                    $gridTab.trigger("reloadGrid");
                                    dialog.find('.bootbox-body').html(res.message);
                                });
                            });

                        }
                    })
                } else {
                    $("#add_" + thisId).removeClass('ui-disabled');
                    $("#edit_" + thisId).removeClass('ui-disabled');
                    $("#del_" + thisId).removeClass('ui-disabled');
                    $("#refresh_" + thisId).removeClass('ui-disabled');
                    $("#download_" + thisId).removeClass('ui-disabled');
                    $("#pushpin_" + thisId).addClass('ui-disabled');
                }
            }
        });

        $gridTab.jqGrid('navGrid', '#navGridClau', { edit: true, add: true, del: true, view: false, search: false },
            {
                editCaption: "Modifica Cláusula",
                closeAfterEdit: true,
                recreateForm: true,
                checkOnUpdate: true,
                template: tmpl,
                mtype: 'POST',
                width: 800,
                url: '/sic/clausulas/action',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                }, beforeSubmit: function (postdata, formid) {
                    if (parseInt(postdata.codclase) == 0) {
                        return [false, "Clase: Debe escoger un valor", ""];
                    } else if (parseInt(postdata.idclausulaplantilla) == 0) {
                        return [false, "Código: Debe escoger un valor", ""];
                    } if (postdata.titulo.trim().length == 0) {
                        return [false, "Nombre: Debe ingresar un nombre", ""];
                    } if (postdata.glosa.trim().length == 0) {
                        return [false, "Texto: Debe ingresar un texto", ""];
                    } else {
                        return [true, "", ""]
                    }
                },
                beforeShowForm: function (form) {
                    setTimeout(function () {
                        $.ajax({
                            type: "GET",
                            url: '/sic/plantillas/' + $gridTab.getRowData($gridTab.getGridParam("selrow")).codclase,
                            success: function (data) {
                                var s = "<select>";
                                s += '<option value="0">--Escoger Código--</option>';
                                $.each(data, function (i, item) {
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
                    sipLibrary.centerDialog($gridTab.attr('id'));
                }, afterShowForm: function (form) {

                }
            }, {
                addCaption: "Agrega Cláusula",
                closeAfterAdd: true,
                recreateForm: true,
                checkOnUpdate: true,
                template: tmpl,
                width: 800,
                mtype: 'POST',
                url: '/sic/clausulas/action',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                }, beforeSubmit: function (postdata, formid) {
                    if (parseInt(postdata.codclase) == 0) {
                        return [false, "Clase: Debe escoger un valor", ""];
                    } else if (parseInt(postdata.idclausulaplantilla) == 0) {
                        return [false, "Código: Debe escoger un valor", ""];
                    } if (postdata.titulo.trim().length == 0) {
                        return [false, "Nombre: Debe ingresar un nombre", ""];
                    } if (postdata.glosa.trim().length == 0) {
                        return [false, "Texto: Debe ingresar un texto", ""];
                    } else {
                        return [true, "", ""]
                    }
                }, beforeShowForm: function (form) {
                    sipLibrary.centerDialog($gridTab.attr('id'));
                }
            }, {
                mtype: 'POST',
                url: '/sic/clausulas/action',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                beforeShowForm: function (form) {
                    ret = $gridTab.getRowData($gridTab.jqGrid('getGridParam', 'selrow'));
                    $("td.delmsg", form).html("<b>Usted borrará la Cláusula:</b><br>" + ret.titulo);
                },
                afterSubmit: function (response, postdata) {
                    var json = response.responseText;
                    var result = JSON.parse(json);
                    if (!result.success)
                        return [false, result.message, ""];
                    else
                        return [true, "", ""]
                }

            }, {

            });

        $gridTab.jqGrid('navButtonAdd', '#navGridClau', {
            caption: "",
            id: "download_" + $(targ + "_t_" + parentRowKey).attr('id'),
            buttonicon: "glyphicon glyphicon-download-alt",
            title: "Generar Documento",
            position: "last",
            onClickButton: function () {
                //var rowKey = $gridTab.getGridParam("selrow");
                try {
                    var url = '/sic/pruebahtmlword/' + parentRowKey;
                    $gridTab.jqGrid('excelExport', { "url": url });
                } catch (e) {
                    console.log("error: " + e)

                }

            }
        });
    }
}