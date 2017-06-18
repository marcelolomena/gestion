$(document).ready(function () {
    var t1 = "<div id='responsive-form' class='clearfix'>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half' id='d_idcui'>CUI Responsable Proyecto<span style='color:red'>*</span>{idcui}</div>";
    t1 += "<div class='column-half' id='d_idtecnico'>Técnico Responsable<span style='color:red'>*</span>{idtecnico}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half' id='d_tipocontrato'>Tipo Contrato<span style='color:red'>*</span>{tipocontrato}</div>";
    t1 += "<div class='column-half' id='d_codigoart'>Codigo Art{codigoart}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half' id='d_sap'>SAP{sap}</div>";
    t1 += "<div class='column-half'>Descripción<span style='color:red'>*</span>{descripcion}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half' id='d_idnegociador'>Negociador<span style='color:red'>*</span>{idnegociador}</div>";
    t1 += "<div class='column-half' id='d_idclasificacionsolicitud'>Clasificación<span style='color:red'>*</span>{idclasificacionsolicitud}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half' id='d_codigosolicitud'>Código solicitud<span style='color:red'>*</span>{codigosolicitud}</div>";
    t1 += "<div class='column-half' id='d_correonegociador'>Correo Negociador<span style='color:red'>*</span>{correonegociador}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half' id='d_fononegociador'>Fono Negociador<span style='color:red'>*</span>{fononegociador}</div>";
    t1 += "<div class='column-half' id='d_direccionnegociador'>Dirección Negociador<span style='color:red'>*</span>{direccionnegociador}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half' id='d_numerorfp'>Número RFP<span style='color:red'>*</span>{numerorfp}</div>";
    t1 += "<div class='column-half' id='d_fechaenviorfp'>Fecha RFP<span style='color:red'>*</span>{fechaenviorfp}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half' id='d_tipo'>Tipo<span style='color:red'>*</span>{idtipo}</div>";
    t1 += "<div class='column-half' id='d_grupo'>Grupo<span style='color:red'>*</span>{idgrupo}</div>";
    t1 += "</div>";

    t1 += "<hr style='width:100%;'/>";
    t1 += "<div> {sData} {cData}  </div>";

    t1 += "</div>";

    var $grid = $("#gridMaster"), carteraModel = [
        { label: 'ID', name: 'id', key: true, hidden: true },
        { label: 'Rut', name: 'rut', width: 80, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Nombre', name: 'nombre', width: 250, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Actividad', name: 'actividad', width: 150, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Oficina', name: 'oficina', width: 80, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Ejecutivo', name: 'ejecutivo', width: 100, hidden: false, search: true, editable: true, editrules: { required: true } },
        {
            label: 'Fecha', name: 'fecha', width: 80, align: 'left', search: false,
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
            },
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).mask("00-00-0000", { placeholder: "__-__-____" });
                    $(element).datepicker({ language: 'es', format: 'dd-mm-yyyy', autoclose: true })
                }
            },
        },
        {
            label: 'Fecha Prox Venc', name: 'fechaproxvenc', width: 80, align: 'left', search: false,
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
            },
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).mask("00-00-0000", { placeholder: "__-__-____" });
                    $(element).datepicker({ language: 'es', format: 'dd-mm-yyyy', autoclose: true })
                }
            },
        },
        {
            label: 'Fecha Venc Ant', name: 'fechavencant', width: 80, align: 'left', search: false,
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
            },
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).mask("00-00-0000", { placeholder: "__-__-____" });
                    $(element).datepicker({ language: 'es', format: 'dd-mm-yyyy', autoclose: true })
                }
            },
        },
        { label: 'Rating Grupo', name: 'ratinggrupo', width: 90, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Nivel Atribución', name: 'nivelatr', width: 110, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Rating Ind', name: 'ratingind', width: 80, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Clasificación', name: 'clasificacion', width: 90, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Vigilancia', name: 'vigilancia', width: 70, hidden: false, search: true, editable: true, editrules: { required: true } },
        {
            label: 'Fecha Info', name: 'fechainf', width: 90, align: 'left', search: false,
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
            },
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).mask("00-00-0000", { placeholder: "__-__-____" });
                    $(element).datepicker({ language: 'es', format: 'dd-mm-yyyy', autoclose: true })
                }
            },
        },
     
    ];
    var previousRowId = 0;
    $grid.jqGrid({
        url: '/grid_cartera',
        datatype: "json",
        mtype: "GET",
        colModel: carteraModel,
        page: 1,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        //width: 1500,
        //sortname: 'rut',
        //sortorder: "asc",
        shrinkToFit: false,
        forceFit: true,
        viewrecords: true,
        editurl: '/sic/grid_cartera',
        caption: 'Cartera',
        styleUI: "Bootstrap",
        pager: "#pagerMaster",
        subGrid: true,
        subGridRowExpanded: showChildGrid,
        subGridBeforeExpand: function (divid, rowid) {
            var expanded = jQuery("td.sgexpanded", "#gridMaster")[0];
            if (expanded) {
                setTimeout(function () {
                    $(expanded).trigger("click");
                }, 100);
            }
        },
        loadComplete: function (data) {
            var thisId = $.jgrid.jqID(this.id);
        }
    });

    $grid.jqGrid('filterToolbar', {
        stringResult: true, searchOperators: true,
        searchOnEnter: false, defaultSearch: 'cn'
    });

    $grid.jqGrid('navGrid', '#pagerMaster', { edit: true, add: true, del: true, search: false },
        {
            editCaption: "Modificar MAC",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: t1,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {

                if (parseInt(postdata.idcui) == 0) {
                    return [false, "CUI: Debe escoger un valor", ""];
                } else if (parseInt(postdata.idtecnico) == 0) {
                    return [false, "Técnico: Debe escoger un valor", ""];
                } else {
                    return [true, "", ""]
                }

            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error != 0) {
                    return [false, result.glosa, ""];
                } else {
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"nombre\",\"op\":\"cn\",\"data\":\"" + postdata.nombre + "\"}]}";
                    $grid.jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }, beforeShowForm: function (form) {
                var grid = $("#grid");
                var rowKey = $grid.getGridParam("selrow");
                var rowData = $grid.getRowData(rowKey);
                var tipocontrato = rowData.tipocontrato;
                var thisidcui = rowData.idcui;
                var thisidtecnico = rowData.idtecnico;
                //console.log(tipocontrato)
                setTimeout(function () {

                    if (tipocontrato == "Proyectos") {
                        $("input#codigoart").attr("readonly", false);
                    }
                    $("#idtipo", form).attr('disabled', 'disabled');
                    $("#idgrupo", form).attr('disabled', 'disabled');
                    $.ajax({
                        type: "GET",
                        url: '/sic/tecnicosresponsablescui/' + thisidcui,
                        success: function (data) {
                            //console.log(thisidtecnico)
                            var s = "<select>";//el default
                            s += '<option value="0">--Escoger Técnico--</option>';
                            $.each(data, function (i, item) {
                                if (data[i].uid == thisidtecnico) {
                                    s += '<option value="' + data[i].uid + '" selected>' + data[i].nombre + ' ' + data[i].apellido + '</option>';
                                } else {
                                    s += '<option value="' + data[i].uid + '">' + data[i].nombre + ' ' + data[i].apellido + '</option>';
                                }
                            });
                            s += "</select>";
                            $("select#idtecnico").html(s);
                        }
                    });

                }, 550);
            }

        }, {
            addCaption: "Agregar MAC",
            closeAfterAdd: true,
            recreateForm: true,
            mtype: 'POST',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: t1,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {

                if (parseInt(postdata.idcui) == 0) {
                    return [false, "CUI: Debe escoger un valor", ""];
                } else if (parseInt(postdata.idclasificacionsolicitud) == 0) {
                    return [false, "Clasificación: Debe escoger un valor", ""];
                } else if (postdata.descripcion.trim().length == 0) {
                    return [false, "Descripción: Debe ingresar una descripción", ""];
                } else {

                    return [true, "", ""]
                }

            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error != 0) {
                    return [false, result.glosa, ""];
                } else {
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"nombre\",\"op\":\"cn\",\"data\":\"" + postdata.nombre + "\"}]}";
                    $grid.jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }, beforeShowForm: function (form) {
                setTimeout(function () {
                    $("#idtipo", form).attr('disabled', 'disabled');
                }, 500);
            }
        }, {
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            mtype: 'POST',
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (!result.success)
                    return [false, result.message, ""];
                else
                    return [true, "", ""]
            }
        },
        {
        });

    function showChildGrid(parentRowID, parentRowKey) {
        var tabs = "<ul class='nav nav-tabs tabs-up' id='myTab'>"
        tabs += "<li><a href='/lineas/" + parentRowKey + "' data-target='#lineas' id='lineas_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Lineas</a></li>"
        tabs += "<li><a href='/responsables/" + parentRowKey + "' data-target='#responsables' id='responsables_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Responsables</a></li>"
        tabs += "<li><a href='/aprobaciones/" + parentRowKey + "' data-target='#aprobaciones' id='aprobaciones_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Aprobaciones</a></li>"
        tabs += "<li><a href='/garantias/" + parentRowKey + "' data-target='#garantias' id='garantias_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Garantías</a></li>"
        tabs += "<li><a href='/bitacora/" + parentRowKey + "' data-target='#bitacora' id='bitacora_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Bitacora</a></li>"
        tabs += "</ul>"

        tabs += "<div class='tab-content'>"
        tabs += "<div class='tab-pane active' id='lineas'><div class='container-fluid'><table id='lineas_t_" + parentRowKey + "'></table><div id='navGridLineas'></div></div></div>"
        tabs += "<div class='tab-pane' id='responsables'><table id='responsables_t_" + parentRowKey + "'></table><div id='navGridResp'></div></div>"
        tabs += "<div class='tab-pane' id='aprobaciones'><table id='aprobaciones_t_" + parentRowKey + "'></table><div id='navGridAprob'></div></div>"
        tabs += "<div class='tab-pane' id='garantias'><table id='garantias_t_" + parentRowKey + "'></table><div id='navGridGar'></div></div>"
        tabs += "<div class='tab-pane' id='bitacora'><table id='bitacora_t_" + parentRowKey + "'></table><div id='navGridBita'></div></div>"
        tabs += "</div>"

        $("#" + parentRowID).append(tabs);
        $('#lineas_tab_' + parentRowKey).addClass('media_node active span')
        $('.active[data-toggle="tab_' + parentRowKey + '"]').each(function (e) {
            var $this = $(this),
                loadurl = $this.attr('href'),
                targ = $this.attr('data-target');
            if (targ === '#lineas') {
                gridLineas.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#responsables') {
                gridResponsables.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#aprobaciones') {
                gridAprobaciones.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#garantias') {
                gridGarantias.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#bitacora') {
                gridBitacora.renderGrid(loadurl, parentRowKey, targ)
            }

            $this.tab('show');
            return false;
        });

        $('[data-toggle="tab_' + parentRowKey + '"]').click(function (e) {
            var $this = $(this),
                loadurl = $this.attr('href'),
                targ = $this.attr('data-target');
            if (targ === '#lineas') {
                gridLineas.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#documentos') {
                gridDoc.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#responsables') {
                gridResponsables.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#aprobaciones') {
                gridAprobaciones.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#garantias') {
                gridGarantias.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#bitacora') {
                gridBitacora.renderGrid(loadurl, parentRowKey, targ)
            }

            $this.tab('show');
            return false;
        });

    }
})