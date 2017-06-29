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

        {
            label: 'Rut',
            name: 'rut',
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
                                    $("input#nombre").val(data[0].razonsocial);
                                    $("input#actividad").val("INMOBILIARIA");
                                    $("input#oficina").val("CENTRAL");
                                    $("input#ejecutivo").val("SERGIO VALENZUELA");;
                                    $("input#fechacreacion").val("2016-05-21");
                                    $("input#fechaproxvenc").val("2016-06-31");
                                    $("input#fechavencant").val("2016-05-22");
                                    $("input#ratinggrupo").val("0");
                                    $("input#nivelatr").val("R3");
                                    $("input#ratingind").val("0");
                                    $("input#clasificacion").val("A5");
                                    $("input#vigilancia").val("NO");
                                    $("input#fechainf").val("2016-06-22");
                                    $("input#promediosaldovista").val("650");
                                    $("input#deudasbif").val("350");
                                    $("input#aprobvinculado").val("NO");

                                } else {
                                    alert("No existe cliente en Base de Datos");
                                }
                            }
                        });

                    }
                }],
            },
            formatter: function (cellvalue, options, rowObject) {
                var rut = rowObject.rut;
                var dato = ""
                $.ajax({
                    type: "GET",
                    url: '/buscargrupo/' + rut,
                    async: false,
                    success: function (data) {
                        if (data.length > 0) {
                            console.log(data[0].rutcliente)
                            dato = '<a href="/menu/macgrupal/'+data[0].idgrupo+'">'+rut+'</a>'
                        } else {
                            dato = '<a href="/menu/macgrupal/#">'+rut+'</a>';
                        }
                    }
                }); 
                return dato
            }
        },

        //{ label: 'Rut', name: 'rut', width: 80, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Nombre', name: 'nombre', width: 250, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Actividad', name: 'actividad', width: 150, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Oficina', name: 'oficina', width: 80, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Ejecutivo', name: 'ejecutivo', width: 100, hidden: false, search: true, editable: true, editrules: { required: true } },
        {
            label: 'Fecha Creación', name: 'fechacreacion', width: 80, align: 'left', search: false,
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
            label: 'Fecha Venc', name: 'fechaproxvenc', width: 80, align: 'left', search: false,
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
            label: 'Fecha Ant Venc', name: 'fechavencant', width: 100, align: 'left', search: false,
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
        { label: 'Rating Ind', name: 'ratingind', width: 80, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Rating Grupo', name: 'ratinggrupo', width: 90, hidden: false, search: true, editable: true, editrules: { required: true } },

        { label: 'Nivel Atribución', name: 'nivelatr', width: 110, hidden: false, search: true, editable: true, editrules: { required: true } },

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
        { label: 'Prom Saldo V', name: 'promediosaldovista', width: 100, hidden: false, search: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 2 }, editrules: { required: true } },
        { label: 'Deuda SBIF', name: 'deudasbif', width: 100, hidden: false, search: true, editable: true, formatter: 'number', formatoptions: { decimalPlaces: 2 }, editrules: { required: true } },
        { label: 'Aprobación', name: 'aprobvinculado', width: 70, hidden: false, search: true, editable: true, editrules: { required: true } },


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
        //tabs += "<li><a href='/bitacora/" + parentRowKey + "' data-target='#bitacora' id='bitacora_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Bitacora</a></li>"
        tabs += "</ul>"

        tabs += "<div class='tab-content'>"
        tabs += "<div class='tab-pane active' id='limite'><div class='container-fluid'><table id='limite_t_" + parentRowKey + "'></table><div id='navGridLimite'></div></div></div>"
        //tabs += "<div class='tab-pane' id='responsables'><table id='responsables_t_" + parentRowKey + "'></table><div id='navGridResp'></div></div>"
        //tabs += "<div class='tab-pane' id='aprobaciones'><table id='aprobaciones_t_" + parentRowKey + "'></table><div id='navGridAprob'></div></div>"
        tabs += "<div class='tab-pane' id='garantia'><table id='garantia_t_" + parentRowKey + "'></table><div id='navGridGar'></div></div>"
        //tabs += "<div class='tab-pane' id='bitacora'><table id='bitacora_t_" + parentRowKey + "'></table><div id='navGridBita'></div></div>"
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