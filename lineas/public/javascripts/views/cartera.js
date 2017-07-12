$(document).ready(function () {
    var t1 = "<div id='responsive-form' class='clearfix'>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-full'>RUT: {Rut}</div>";
    t1 += "<div class='column-full'>Nombre: {Nombre}</div>";
    t1 += "<div class='column-full'>Actividad: {ActividadEconomica}</div>";
    t1 += "</div>"
    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half'>Oficina: {Oficina}</div>";
    t1 += "<div class='column-half'>Ejecutivo: {EquipoCobertura}</div>";
    t1 += "</div>"
    t1 += "<div class='form-row'>";
    t1 += "<div class='column-three'>Creación: {FechaCreacion}</div>";
    t1 += "<div class='column-three'>Prox. Vencimiento: {FechaVencimiento}</div>";
    t1 += "<div class='column-three'>Vencimiento Ant.: {FechaVencimientoMacAnterior}</div>";
    t1 += "</div>"

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-three'>Rating Individual: {RatingIndividual}</div>";
    t1 += "<div class='column-three'>Nivel Atribución: {NivelAtribucion}</div>";
    t1 += "<div class='column-three'>Clasificación: {Clasificacion}</div>";
    t1 += "</div>"
    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half'>MAC Grupal:</br> <span id='elgrupo'><select><option value='0'>--Escoger Grupo--</option></select></span></div>";
    t1 += "<div class='column-three'>Rating Grupal: {RatingGrupal}</div>";
    t1 += "</div>"
    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half'>Vigilancia: {Vigilancia}</div>";
    t1 += "<div class='column-half'>Fecha información: {FechaInformacionFinanciera}</div>";
    t1 += "</div>"
    t1 += "<div class='form-row'>";
    t1 += "<div class='column-three'>Promedio Saldo Vista: {PromedioSaldoVista}</div>";
    t1 += "<div class='column-three'>Deuda SBIF: {DeudaSbif}</div>";
    t1 += "<div class='column-three'>Aprob Vinculado: {AprobadoVinculado}</div>";
    t1 += "</div>"

    t1 += "</div>";

    t1 += "<hr style='width:100%;'/>";
    t1 += "<div> {sData} {cData}  </div>";

    t1 += "</div>";

    var $grid = $("#gridMaster"), carteraModel = [
        { label: 'ID', name: 'Id', key: true, hidden: true },
        { label: 'Empresa_Id', name: 'Empresa_Id', hidden: true },

        {
            label: 'Rut',
            name: 'Rut',
            width: 80,
            align: 'left',
            search: false,
            editable: true,
            hidden: false,
            editoptions: {
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        var grid = $grid
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        //console.log("rowData:" + rowData);
                        var thissid = $(this).val();
                        $.ajax({
                            type: "GET",
                            url: '/getdatoscliente/' + thissid,
                            async: false,
                            success: function (data) {
                                if (data.length > 0) {
                                    //console.log("glosa:" + data[0].glosaservicio);
                                    $("input#Nombre").val(data[0].Nombre);
                                    $("input#ActividadEconomica").val("Sociedad de inversiones");
                                    $("input#Oficina").val("CENTRAL");
                                    $("input#EquipoCobertura").val("SERGIO VALENZUELA");;
                                    $("input#FechaCreacion").val("2016-05-21");
                                    $("input#FechaVencimiento").val("2016-06-31");
                                    $("input#FechaVencimientoMacAnterior").val("2016-05-22");
                                    $("input#RatingGrupal").val("0");
                                    $("input#NivelAtribucion").val("R3");
                                    $("input#RatingIndividual").val("0");
                                    $("input#Clasificacion").val("A5");
                                    $("input#Vigilancia").val("NO");
                                    $("input#FechaInformacionFinanciera").val("2016-06-22");
                                    $("input#PromedioSaldoVista").val("650");
                                    $("input#DeudaSbif").val("350");
                                    $("input#AprobadoVinculado").val("");

                                } else {
                                    alert("No existe cliente en Base de Datos");
                                }
                            }
                        });
                        setTimeout(function () {
                            var rut = $('#Rut').val();
                            $.ajax({
                                type: "GET",
                                url: '/buscargrupo/' + rut,
                                success: function (data) {
                                    var s = "<select id='grupos'>";
                                    s += '<option value="0">--Escoger Grupo--</option>';
                                    $.each(data, function (i, item) {
                                        s += '<option value="' + data[i].Id + '">' + data[i].Nombre + '</option>';
                                    });
                                    s += "</select>";
                                    $("#elgrupo").html(s);
                                }
                            });
                        }, 500);

                    }
                }],
            }
        },

        //{ label: 'Rut', name: 'rut', width: 80, hidden: false, search: true, editable: true, editrules: { required: true } },
        {
            label: 'Nombre', name: 'Nombre', width: 250, hidden: false, search: true, editable: true, editrules: { required: true }
        },
        {
            label: ' Id MAC Grupal', jsonmap: 'MacGrupalMacIndividual.MacGrupal.Id', name: 'idmacgrupal', hidden: true, search: true, editable: true
        },
        {
            label: 'Grupo', name: 'MacGrupalMacIndividual.MacGrupal.Grupo.Nombre', width: 250, hidden: false, search: true, editable: true, editrules: { required: true },
            formatter: function (cellvalue, options, rowObject) {
                var dato = ""
                dato = '<a href="/menu/macgrupal">' + cellvalue + '</a>'
                return dato
            }
        },
        { label: 'Actividad', name: 'ActividadEconomica', width: 150, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Oficina', name: 'Oficina', width: 80, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'E. Cobertura', name: 'EquipoCobertura', width: 100, hidden: false, search: true, editable: true, editrules: { required: true } },
        {
            label: 'F. Creación', name: 'FechaCreacion', width: 80, align: 'left', search: false,
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
            label: 'F. Venc.', name: 'FechaVencimiento', width: 80, align: 'left', search: false,
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
            label: 'F. Ant Venc', name: 'FechaVencimientoMacAnterior', width: 100, align: 'left', search: false,
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
        { label: 'R. Individ.', name: 'RatingIndividual', width: 80, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'R. Grupal', name: 'RatingGrupal', width: 90, hidden: false, search: true, editable: true, editrules: { required: true } },

        { label: 'N. Atribución', name: 'NivelAtribucion', width: 110, hidden: false, search: true, editable: true, editrules: { required: true } },

        { label: 'Clasificación', name: 'Clasificacion', width: 90, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Vigilancia', name: 'Vigilancia', width: 70, hidden: false, search: true, editable: true, editrules: { required: true } },
        {
            label: 'F. Info', name: 'FechaInformacionFinanciera', width: 90, align: 'left', search: false,
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
        { label: 'P. Saldo V', name: 'PromedioSaldoVista', width: 100, hidden: false, search: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 2 }, editrules: { required: true } },
        { label: 'D. SBIF', name: 'DeudaSbif', width: 100, hidden: false, search: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 2 }, editrules: { required: true } },
        { label: 'A. Vinculado', name: 'AprobadoVinculado', width: 100, hidden: false, search: true, editable: true, editrules: { required: true } },


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
        editurl: '/grid_cartera',
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
        console.log("la grilla padre: " + grillapadre)
        var rowData = $("#" + grillapadre).getRowData(parentRowKey);
        console.log("la rowData : " + rowData)
        var parentRUT = rowData.rut;
        console.log("la parentRUT : " + parentRUT)
        var tabs = "<ul class='nav nav-tabs tabs-up' id='myTab'>"
        tabs += "<li><a href='/limite/" + parentRowKey + "' data-target='#limite' id='limite_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Límites</a></li>"
        //tabs += "<li><a href='/responsables/" + parentRowKey + "' data-target='#responsables' id='responsables_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Responsables</a></li>"
        //tabs += "<li><a href='/aprobaciones/" + parentRowKey + "' data-target='#aprobaciones' id='aprobaciones_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Aprobaciones</a></li>"
        tabs += "<li><a href='/garantia/" + parentRUT + "' data-target='#garantia' id='garantia_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Garantías</a></li>"
        tabs += "<li><a href='/bitacora/" + parentRowKey + "' data-target='#bitacora' id='bitacora_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Bitacora</a></li>"
        tabs += "</ul>"

        tabs += "<div class='tab-content'>"
        tabs += "<div class='tab-pane active' id='limite'><div class='container-fluid'><table id='limite_t_" + parentRowKey + "'></table><div id='navGridLimite'></div></div></div>"
        //tabs += "<div class='tab-pane' id='responsables'><table id='responsables_t_" + parentRowKey + "'></table><div id='navGridResp'></div></div>"
        //tabs += "<div class='tab-pane' id='aprobaciones'><table id='aprobaciones_t_" + parentRowKey + "'></table><div id='navGridAprob'></div></div>"
        tabs += "<div class='tab-pane' id='garantia'><table id='garantia_t_" + parentRowKey + "'></table><div id='navGridGar'></div></div>"
        tabs += "<div class='tab-pane' id='bitacora'><table id='bitacora_t_" + parentRowKey + "'></table><div id='navGridBita'></div></div>"
        tabs += "</div>"

        $("#" + parentRowID).append(tabs);
        $('#limite_tab_' + parentRowKey).addClass('media_node active span')
        $('.active[data-toggle="tab_' + parentRowKey + '"]').each(function (e) {
            var $this = $(this),
                loadurl = $this.attr('href'),
                targ = $this.attr('data-target');
            if (targ === '#limite') {
                gridLimite.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#garantia') {
                gridGarantia.renderGrid(loadurl, parentRowKey, targ)
            }

            $this.tab('show');
            return false;
        });

        $('[data-toggle="tab_' + parentRowKey + '"]').click(function (e) {
            var $this = $(this),
                loadurl = $this.attr('href'),
                targ = $this.attr('data-target');
            if (targ === '#limites') {
                gridLimite.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#garantia') {
                gridGarantia.renderGrid(loadurl, parentRowKey, targ)
            }

            $this.tab('show');
            return false;
        });

    }
})