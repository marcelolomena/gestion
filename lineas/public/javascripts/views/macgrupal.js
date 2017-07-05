$(document).ready(function () {
    var t1 = "<div id='responsive-form' class='clearfix'>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-full'>RUT: {rut}</div>";
    t1 += "<div class='column-full'>Nombre: {nombre}</div>";
    t1 += "<div class='column-full'>Actividad: {actividad}</div>";
    t1 += "</div>"
    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half'>Oficina: {oficina}</div>";
    t1 += "<div class='column-half'>Ejecutivo: {ejecutivo}</div>";
    t1 += "</div>"
    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half'>Fecha Creación: {fechacreacion}</div>";
    t1 += "<div class='column-half'>Fecha Prox. Vencimiento: {fechaproxvenc}</div>";
    t1 += "</div>"
    t1 += "<div class='form-row'>";
    t1 += "<div class='column-full'>Fecha Vencimiento Ant.: {fechavencant}</div>";
    t1 += "</div>"
    t1 += "<div class='form-row'>";
    t1 += "<div class='column-four'>Rating Individual: {ratingind}</div>";
    t1 += "<div class='column-four'>Rating Grupal: {ratinggrupo}</div>";
    t1 += "<div class='column-four'>Nivel Atribución: {nivelatr}</div>";
    t1 += "<div class='column-four'>Clasificación: {clasificacion}</div>";
    t1 += "</div>"
    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half'>Vigilancia: {vigilancia}</div>";
    t1 += "<div class='column-half'>Fecha información: {fechainf}</div>";
    t1 += "</div>"
    t1 += "<div class='form-row'>";
    t1 += "<div class='column-three'>Promedio Saldo Vista: {promediosaldovista}</div>";
    t1 += "<div class='column-three'>Deuda SBIF: {deudasbif}</div>";
    t1 += "<div class='column-three'>Aprob Vinculado: {aprobvinculado}</div>";
    t1 += "</div>"

    t1 += "</div>";

    t1 += "<hr style='width:100%;'/>";
    t1 += "<div> {sData} {cData}  </div>";

    t1 += "</div>";

    var $grid = $("#gridMaster"), carteraModel = [
        { label: 'ID', name: 'id', key: true, hidden: true },
        { label: 'ID Grupo', name: 'idgrupo', key: false, hidden: true },
        { label: 'Nombre', name: 'nombre', width: 250, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Ejecutivo', name: 'ejecutivocontrol', width: 120, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Area', name: 'areaejecutivo', width: 80, hidden: false, search: true, editable: true, editrules: { required: true } },
        
        {
            label: 'Fecha Venc.', name: 'fechavencimiento', width: 100, align: 'left', search: false,
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
            label: 'Presentación', name: 'fechapresentacion', width: 100, align: 'left', search: false,
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
        { label: 'R. Grupal', name: 'ratinggrupo', width: 90, hidden: false, search: true, editable: true, editrules: { required: true } },

        { label: 'N. Atribución', name: 'nivelatr', width: 110, hidden: false, search: true, editable: true, editrules: { required: true } },

        { label: 'Prom Saldo V', name: 'promediosaldovista', width: 100, hidden: false, search: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 2 }, editrules: { required: true } },


    ];
    var previousRowId = 0;
    $grid.jqGrid({
        url: '/grid_macgrupal',
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
        editurl: '/grid_macgrupal',
        caption: 'MONEX',
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

    $grid.jqGrid('navGrid', '#pagerMaster', { edit: true, add: false, del: true, search: false },
        {
            editCaption: "Modificar MAC Grupal",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            //template: t1,
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

                /*if (parseInt(postdata.idcui) == 0) {
                    return [false, "CUI: Debe escoger un valor", ""];
                } else if (parseInt(postdata.idclasificacionsolicitud) == 0) {
                    return [false, "Clasificación: Debe escoger un valor", ""];
                } else if (postdata.descripcion.trim().length == 0) {
                    return [false, "Descripción: Debe ingresar una descripción", ""];
                } else {
*/
                return [true, "", ""]
                // }

            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error != "0")
                    return [false, "Error en llamada a Servidor", ""];
                else
                    return [true, "", ""]

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
        var grillapadre = parentRowID.substring(0, parentRowID.lastIndexOf("_"));
        /*console.log("la grilla padre: " + grillapadre)
        var rowData = $("#" + grillapadre).getRowData(parentRowKey);
        console.log("la rowData : " + rowData)
        var parentRUT = rowData.rut;
        console.log("la parentRUT : " + parentRUT)*/
        var tabs = "<ul class='nav nav-tabs tabs-up' id='myTab'>"
        tabs += "<li><a href='/macs/" + parentRowKey + "' data-target='#macs' id='macs_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>MACs</a></li>"
        //tabs += "<li><a href='/responsables/" + parentRowKey + "' data-target='#responsables' id='responsables_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Responsables</a></li>"
        //tabs += "<li><a href='/aprobaciones/" + parentRowKey + "' data-target='#aprobaciones' id='aprobaciones_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Aprobaciones</a></li>"
        tabs += "<li><a href='/notas/" + parentRowKey + "' data-target='#notas' id='notas_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Notas</a></li>"
        tabs += "<li><a href='/set/" + parentRowKey + "' data-target='#set' id='set_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Set</a></li>"
        tabs += "<li><a href='/aprobacion/" + parentRowKey + "' data-target='#aprobacion' id='aprobacion_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Aprobación</a></li>"
        tabs += "<li><a href='/bitacora/" + parentRowKey + "' data-target='#bitacora' id='bitacora_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Bitacora</a></li>"
        tabs += "</ul>"

        tabs += "<div class='tab-content'>"
        tabs += "<div class='tab-pane active' id='macs'><div class='container-fluid'><table id='macs_t_" + parentRowKey + "'></table><div id='navGridMacs'></div></div></div>"
        //tabs += "<div class='tab-pane' id='responsables'><table id='responsables_t_" + parentRowKey + "'></table><div id='navGridResp'></div></div>"
        //tabs += "<div class='tab-pane' id='aprobaciones'><table id='aprobaciones_t_" + parentRowKey + "'></table><div id='navGridAprob'></div></div>"
        tabs += "<div class='tab-pane' id='notas'><table id='notas_t_" + parentRowKey + "'></table><div id='navGridNotas'></div></div>"
        tabs += "<div class='tab-pane' id='set'><table id='set_t_" + parentRowKey + "'></table><div id='navGridSet'></div></div>"
        tabs += "<div class='tab-pane' id='aprobacion'><table id='aprobacion_t_" + parentRowKey + "'></table><div id='navGridAprob'></div></div>"
        tabs += "<div class='tab-pane' id='bitacora'><table id='bitacora_t_" + parentRowKey + "'></table><div id='navGridBita'></div></div>"
        tabs += "</div>"

        $("#" + parentRowID).append(tabs);
        $('#macs_tab_' + parentRowKey).addClass('media_node active span')
        $('.active[data-toggle="tab_' + parentRowKey + '"]').each(function (e) {
            var $this = $(this),
                loadurl = $this.attr('href'),
                targ = $this.attr('data-target');
            if (targ === '#macs') {
                gridMacs.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#aprobacion') {
                gridAprobacion.renderGrid(loadurl, parentRowKey, targ)
            }

            $this.tab('show');
            return false;
        });

        $('[data-toggle="tab_' + parentRowKey + '"]').click(function (e) {
            var $this = $(this),
                loadurl = $this.attr('href'),
                targ = $this.attr('data-target');
            if (targ === '#macs') {
                gridMacs.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#aprobacion') {
                gridAprobacion.renderGrid(loadurl, parentRowKey, targ)
            }

            $this.tab('show');
            return false;
        });

    }
})