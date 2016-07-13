$(document).ready(function () {
    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Nombre Proyecto {nombreproyecto}</div>";
    template += "<div class='column-half'>N° SAP{sap}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Programa ART {program_id}</div>";
    template += "<div class='column-half'>Código ART{codigoart}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>CUI 1{cuifinanciamiento1}</div>";
    template += "<div class='column-half'>% financiamiento{porcentaje1}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>CUI 2{cuifinanciamiento2}</div>";
    template += "<div class='column-half'>% financiamiento{porcentaje2}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Beneficios Cuantitativos{beneficioscuantitativos}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Beneficios Cualitativos{beneficioscualitativos}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-three'>Lider{uidlider}</div>";
    template += "<div class='column-three'>Jefe Proyecto{uidjefeproyecto}</div>";
    template += "<div class='column-three'>PMO Responsable{uidpmoresponsable}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-three'>Dolar{dolar}</div>";
    template += "<div class='column-three'>UF{uf}</div>";
    template += "<div class='column-three'>Fecha Conversión{fechaconversion}</div>";
    template += "</div>";

    template += "<div class='form-row' style='display: none;'>";
    template += "<div class='column-half'>idiniciativapadre{nombreiniciativapadre}</div>";
    template += "<div class='column-half'>idiniciativaprograma{nombreiniciativa}</div>";
    template += "<div class='column-half'>idmoneda{glosamoneda}</div>";
    template += "<div class='column-half'>lider{lider}</div>";
    template += "<div class='column-half'>jefeproyecto{jefeproyecto}</div>";
    template += "</div>";

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";

    var modelPresupuestoEnVuelo = [
        {
            label: 'id',
            name: 'id',
            key: true,
            hidden: true
        },
        {
            label: 'Proyecto', name: 'nombreproyecto', width: 200, align: 'left',
            search: true, editable: true, hidden: false,
            editrules: { required: true },
        },

        {
            label: 'SAP', name: 'sap', width: 80, align: 'left',
            search: true, editable: true, hidden: false,
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("0000", { placeholder: "____" });
                }
            },
        },
        {
            label: 'program_id', name: 'program_id', width: 150, align: 'left',
            hidden: true, editable: true,
            editrules: { edithidden: true },
            edittype: "select",
            editoptions: {
                dataUrl: '/programas',
                buildSelect: function (response) {
                    var grid = $("#table_iniciativa");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.program_name;
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger Programa--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].program_name == thissid) {
                            s += '<option value="' + data[i].program_id + '" selected>' + data[i].program_name + '</option>';
                        } else {
                            s += '<option value="' + data[i].program_id + '">' + data[i].program_name + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        var thispid = $(this).val();
                        if (thispid != "0") {
                            $.ajax({
                                type: "GET",
                                url: '/programa/' + thispid,
                                async: false,
                                success: function (data) {
                                    $("input#codigoart").val(data.program_code);
                                }
                            });
                        } else {
                            $("input#codigoart").val(null);
                        }
                    }
                }],
            },
            dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Art', name: 'codigoart', width: 100, align: 'left',
            search: false, editable: true, jsonmap: 'codigoart'
        },
        {
            label: 'Cui 1', name: 'cuifinanciamiento1', width: 50, align: 'left',
            search: true, editable: true, hidden: false,
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("0000", { placeholder: "____" });
                }
            },
            editrules: { edithidden: false, required: true, number: true },
            hidedlg: true
        },
        {
            label: '% Cui 1', name: 'porcentaje1', width: 50, align: 'left',
            formatter: 'number', formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('0,00', { reverse: true, placeholder: "_,__" });
                }
            },
            search: true, editable: true, hidden: false,
            editrules: { edithidden: false, required: true },
            hidedlg: true
        },
        {
            label: 'Cui 2', name: 'cuifinanciamiento2', width: 50, align: 'left',
            search: true, editable: true, hidden: false,
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("0000", { placeholder: "____" });

                }
            },
            editrules: { edithidden: false, required: true, number: true },
            hidedlg: true
        },
        {
            label: '% Cui 2', name: 'porcentaje2', width: 50, align: 'left',
            formatter: 'number', formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('0,00', { reverse: true, placeholder: "_,__" });
                }
            },
            search: true, editable: true, hidden: false,
            editrules: { edithidden: false, required: true },
            hidedlg: true
        },
        {
            label: 'Beneficios Cuantitativos', name: 'beneficioscuantitativos', width: 200,
            align: 'left', edittype: "textarea",
            search: true, editable: true, hidden: false,
        },
        {
            label: 'Beneficios Cualitativos', name: 'beneficioscualitativos', width: 200,
            align: 'left', edittype: "textarea",
            search: true, editable: true, hidden: false,
        },
        {
            label: 'uidlider', name: 'uidlider',
            search: false, editable: true, hidden: true,
            editrules: { required: true },
            edittype: "select",
            editoptions: {
                dataUrl: '/usuariosprograma/',
                buildSelect: function (response) {
                    var grid = $('#' + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.uidlider;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Lider--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].uid == thissid) {
                            s += '<option value="' + data[i].uid + '" selected>' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        } else {
                            s += '<option value="' + data[i].uid + '">' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#lider").val($('option:selected', this).val());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }

        },
        {
            label: 'Lider', name: 'lider', width: 150, align: 'left',
            search: true, editable: true, hidden: false, jsonmap: "nombrelider"
        },
        {
            label: 'uidjefeproyecto', name: 'uidjefeproyecto',
            search: false, editable: true, hidden: true,
            editrules: { required: true },
            edittype: "select",
            editoptions: {
                dataUrl: '/usuariosprograma/',
                buildSelect: function (response) {
                    var grid = $('#' + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.uidjefeproyecto;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Jefe de Proyecto--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].uid == thissid) {
                            s += '<option value="' + data[i].uid + '" selected>' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        } else {
                            s += '<option value="' + data[i].uid + '">' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#jefeproyecto").val($('option:selected', this).val());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Jefe Area Responsable', name: 'jefeproyecto', width: 150, align: 'left',
            search: true, editable: true, hidden: false, jsonmap: "nombrejefe",
        },
        {
            label: 'uidpmoresponsable', name: 'uidpmoresponsable',
            search: false, editable: true, hidden: true,
            editrules: { required: true },
            edittype: "select",
            editoptions: {
                dataUrl: '/usuariosprograma/',
                buildSelect: function (response) {
                    var grid = $('#' + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.uidjefeproyecto;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Jefe de Proyecto--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].uid == thissid) {
                            s += '<option value="' + data[i].uid + '" selected>' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        } else {
                            s += '<option value="' + data[i].uid + '">' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#jefeproyecto").val($('option:selected', this).val());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'PMO Responsable', name: 'pmoresponsable', width: 150, align: 'left',
            search: true, editable: true, hidden: false, jsonmap: "nombrepmo",
        },

        {
            label: 'Dolar', name: 'dolar', width: 80, align: 'right',
            search: false, editable: true, hidden: false,
            editrules: { required: true },
            formatter: 'number', formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000,00', { reverse: true });
                }
            }
        },

        {
            label: 'UF', name: 'uf', width: 80, align: 'right',
            search: false, editable: true, hidden: false,
            editrules: { required: true },
            formatter: 'number', formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('00.000,00', { reverse: true });
                }
            }
        },
        {
            label: 'Fecha Conversión', name: 'fechaconversion', width: 150, align: 'left', search: false,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' },
            editable: true,
            editrules: { required: true },
            searchoptions: {
                dataInit: function (el) {
                    $(el).datepicker({
                        language: 'es',
                        format: 'yyyy-mm-dd',
                        autoclose: true,
                        onSelect: function (dateText, inst) {
                            setTimeout(function () {
                                childGridID[0].triggerToolbar();
                            }, 100);
                        }
                    });
                },
                sopt: ["eq", "le", "ge"]
            },
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).mask("0000-00-00", { placeholder: "____-__-__" });
                    $(element).datepicker({ language: 'es', format: 'yyyy-mm-dd', autoclose: true })
                }
            }
        },

    ];

    $("#table_iniciativa").jqGrid({
        url: '/presupuestoenvuelo/list',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelPresupuestoEnVuelo,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        caption: 'Presupuesto Proyectos en Vuelo',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        pager: "#pager_iniciativa",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        editurl: '/iniciativas/action',
        styleUI: "Bootstrap",
        subGrid: true,
        subGridRowExpanded: showSubGrids,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        },
        gridComplete: function () {
            var recs = $("#table_iniciativa").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#table_iniciativa").addRowData("blankRow", { "sap": "", "codigoart": "No hay datos" });
            }
        }
    });
    $("#table_iniciativa").jqGrid('filterToolbar', {
        stringResult: true, searchOperators: true,
        searchOnEnter: false, defaultSearch: 'cn'
    });

    $('#table_iniciativa').jqGrid('navGrid', "#pager_iniciativa", {
        edit: true, add: true, del: true, search: false, refresh: true,
        view: false, position: "left", cloneToTop: false
    },
        {
            editCaption: "Modificar Presupuesto",
            closeAfterEdit: true,
            recreateForm: true,
            //mtype: 'POST',
            //url: '/iniciativas/update',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                if (postdata.uidlider == 0) {
                    return [false, "Lider: Campo obligatorio", ""];
                } if (postdata.uidjefeproyecto == 0) {
                    return [false, "Jefe de Proyecto: Campo obligatorio", ""];
                } else {
                    return [true, "", ""]
                }
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }, beforeShowForm: function (form) {
                var grid = $("#table_iniciativa");
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                var thissid = rowData.id;
                if (thissid == 0) {
                    alert("Debe seleccionar una fila");
                    return [false, result.error_text, ""];
                }
                sipLibrary.centerDialog($("#table_iniciativa").attr('id'));
                //$('input#codigoart', form).attr('readonly', 'readonly');
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#table_iniciativa").attr('id'));
            }
        },
        {
            addCaption: "Agregar Presupuesto",
            closeAfterAdd: true,
            recreateForm: true,
            //mtype: 'POST',
            //url: '/iniciativas/add',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0) {
                    return [false, result.error_text, ""];
                } else {
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"nombre\",\"op\":\"cn\",\"data\":\"" + postdata.nombre + "\"}]}";
                    $("#table_iniciativa").jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }, beforeShowForm: function (form) {
                sipLibrary.centerDialog($('#table_iniciativa').attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#table_iniciativa").attr('id'));
            }
        },
        {
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }
        },
        {
            recreateFilter: true
        }
    );
    $("#pager_iniciativa_left").css("width", "");
    function showSubGrids(subgrid_id, row_id) {
        gridTareaEnVuelo(subgrid_id, row_id, 'tareaenvuelo');
        //gridIniciativaFecha(subgrid_id, row_id, 'fecha');
    }
});