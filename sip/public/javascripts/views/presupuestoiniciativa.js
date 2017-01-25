function gridPresupuestoIniciativa(parentRowID, parentRowKey, suffix) {
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

    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'><span style='color: red'>*</span>Glosa(Max: 50){glosa}</div>";
    template += "<div class='column-half'>N° SAP{sap}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'><span style='color: red'>*</span>CUI 1{cuifinanciamiento1}</div>";
    template += "<div class='column-half'><span style='color: red'>*</span>% financiamiento{porcentaje1}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'><span style='color: red'>*</span>CUI 2{cuifinanciamiento2}</div>";
    template += "<div class='column-half'><span style='color: red'>*</span>% financiamiento{porcentaje2}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Beneficios Cuantitativos(Max 250){beneficioscuantitativos}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Beneficios Cualitativos(Max 250){beneficioscualitativos}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'><span style='color: red'>*</span>Lider{uidlider}</div>";
    template += "<div class='column-half'><span style='color: red'>*</span>Jefe Area Responsable{uidjefeproyecto}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-three'><span style='color: red'>*</span>Dolar{dolar}</div>";
    template += "<div class='column-three'><span style='color: red'>*</span>UF{uf}</div>";
    template += "<div class='column-three'><span style='color: red'>*</span>Fecha Conversión{fechaconversion}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'><span style='color: red'>*</span>Para inscripción{parainscripcion}</div>";
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
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    var childGridURL = "/presupuestoiniciativa/" + parentRowKey;

    var modelPresupuestoIniciativa = [
        {
            label: 'id',
            name: 'id',
            key: true,
            hidden: true
        },
        {
            label: 'Glosa', name: 'glosa', width: 100, align: 'left',
            search: true, editable: true, hidden: false,
            editoptions: {size:10, maxlength: 50},
            editrules: { required: true },
        },
        {
            label: 'SAP', name: 'sap', width: 80, align: 'left',
            search: true, editable: true, hidden: false,
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("00000", { placeholder: "_____" });
                }
            },
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
            hidedlg: false
        },
        {
            label: '% Cui 1', name: 'porcentaje1', width: 50, align: 'left',
            formatoptions: { decimalPlaces: 0 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000', { reverse: true, placeholder: "___" });
                }
            },
            formatter: function (cellvalue, options, rowObject) {
                var dato = '';
                var val = rowObject.porcentaje1;
                dato = val*100;
                return dato;
            },
            search: true, editable: true, hidden: false,
            editrules: { edithidden: false, required: true },
            hidedlg: false
        },
        {
            label: 'Cui 2', name: 'cuifinanciamiento2', width: 50, align: 'left',
            search: true, editable: true, hidden: false,
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("0000", { placeholder: "____" });

                }
            },
            editrules: { edithidden: false, required: false, number: true },
            hidedlg: false
        },
        {
            label: '% Cui 2', name: 'porcentaje2', width: 50, align: 'left',
            formatoptions: { decimalPlaces: 0 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000', { reverse: true, placeholder: "___" });
                }
            },
            formatter: function (cellvalue, options, rowObject) {
                var dato = '';
                var val = rowObject.porcentaje2;
                dato = val*100;
                return dato;
            },
            search: true, editable: true, hidden: false,
            editrules: { edithidden: false, required: false },
            hidedlg: false
        },
        {
            label: 'Beneficios Cuantitativos', name: 'beneficioscuantitativos', width: 200,
            align: 'left', edittype: "textarea", editoptions: {maxlength:"250"},
            search: true, editable: true, hidden: false,
        },
        {
            label: 'Beneficios Cualitativos', name: 'beneficioscualitativos', width: 200,
            align: 'left', edittype: "textarea", editoptions: {maxlength:"250"},
            search: true, editable: true, hidden: false,
        },
        {
            label: 'uidlider', name: 'uidlider',
            search: false, editable: true, hidden: true,
            editrules: { required: true },
            edittype: "select",
            editoptions: {
                dataUrl: '/usuariosprograma/' + parentRowKey,
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
                        var idlider = $('option:selected', this).val();

                        if (idlider != "0") {
                            $.ajax({
                                type: "GET",
                                url: '/getjefe/' + idlider,
                                async: false,
                                success: function (data) {
                                    var grid = $("#" + childGridID);
                                    var rowKey = grid.getGridParam("selrow");
                                    var rowData = grid.getRowData(rowKey);
                                    var thissid = rowData.uidjefeproyecto;
                                    var s = "<select>";//el default
                                    s += '<option value="0">--Escoger Jefe--</option>';
                                    $.each(data, function (i, item) {
                                        if (data[i].idjefe == thissid) {
                                            s += '<option value="' + data[i].idjefe + '" selected>' + data[i].nombrejefe + '</option>';
                                        } else {
                                            s += '<option value="' + data[i].idjefe + '">' + data[i].nombrejefe + '</option>';
                                        }
                                    });
                                    s += "</select>";
                                    //lahora = new Date();
                                    //console.log('Termina el for a las ' + lahora.getHours() + ":" + lahora.getMinutes() + ":" + lahora.getSeconds());
                                    $("select#uidjefeproyecto").empty().html(s);
                                    //lahora = new Date();
                                    //console.log('Seteo el html a las ' + lahora.getHours() + ":" + lahora.getMinutes() + ":" + lahora.getSeconds());
                                }
                            });
                        }

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
                value: "0:--Escoger Jefe Proyecto--",
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
            label: 'Fecha Conversión', name: 'fechaconversion', width: 150, align: 'left', search: false,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
            editable: true,
            editrules: { required: true },
            searchoptions: {
                dataInit: function (el) {
                    $(el).datepicker({
                        language: 'es',
                        format: 'dd-mm-yyyy',
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
                    $(element).mask("00-00-0000", { placeholder: "__-__-____" });
                    $(element).datepicker({ language: 'es', format: 'dd-mm-yyyy', autoclose: true })
                }
            }
        },
        {
            label: 'Dolar', name: 'dolar', width: 80, align: 'right',
            search: false, editable: true, hidden: false,
            editrules: { required: true },
            formatter: 'number', formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('0.000,00', { reverse: true });
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
            label: 'Inscripción', name: 'parainscripcion', width: 20, align: 'left',
            search: true, editable: true, hidden: false,
            edittype: "custom",
            editoptions: {
                custom_value: sipLibrary.getRadioElementValue,
                custom_element: sipLibrary.radioElemInscripcion
            },
            formatter: function (cellvalue, options, rowObject) {
                var dato = '';
                var val = rowObject.parainscripcion;
                if (val == 1) {
                    dato = 'Sí';

                } else if (val == 0) {
                    dato = 'No';
                }
                return dato;
            }
        },

    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        caption: 'Presupuesto',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        page: 1,
        rowNum: 10,
        rowList: [5, 10, 20, 50],
        sortable: "true",
        colModel: modelPresupuestoIniciativa,
        viewrecords: true,
        styleUI: "Bootstrap",
        subGrid: true,
        subGridRowExpanded: showSubGrids2,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,
        editurl: '/presupuestoiniciativa/action',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {
                $("#" + childGridID).addRowData("blankRow", { "id": 0, "beneficioscuantitativos": "No hay datos", "porcentaje1": " ", "porcentaje2": " ", "dolar": " ", "uf": " " });
            }
        }
    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: true, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            editCaption: "Modificar Presupuesto Iniciativa",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                if (postdata.uidlider == 0) {
                    return [false, "Lider: Campo obligatorio", ""];
                } if (postdata.uidjefeproyecto == 0) {
                    return [false, "Jefe de Proyecto: Campo obligatorio", ""];
                }
                //var elporcentaje1 = parseFloat(postdata.porcentaje1.split(".").join("").replace(",", "."));
                var elporcentaje1 = parseInt(postdata.porcentaje1);
                console.log('porcentaje1: ' + elporcentaje1);
                var elporcentaje2 = 0;
                if(postdata.porcentaje2!=""){
                    //elporcentaje2 = parseFloat(postdata.porcentaje2.split(".").join("").replace(",", "."));
                    elporcentaje2 = parseInt(postdata.porcentaje2);
                }
                console.log('porcentaje2: ' + elporcentaje2);
                var lasuma = elporcentaje1 + elporcentaje2;
                console.log('total: ' + lasuma);
                if (lasuma != 100) {
                    return [false, "Porcentajes no suman 100", ""];
                }
                else {
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
            },
            beforeShowForm: function (form) {
                var grid = $("#" + childGridID);
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                var thissid = rowData.id;
                if (thissid == 0) {
                    alert("Debe seleccionar una fila");
                    return [false, result.error_text, ""];
                }


                var thisidlider = rowData.uidlider;
                var thisidjefe = rowData.uidjefeproyecto;

                    $.ajax({
                        type: "GET",
                        url: '/getjefe/' + thisidlider,
                        success: function (data) {
                            var s = "<select>";
                            s += '<option value="0">--Escoger Jefe--</option>';
                            $.each(data, function (i, item) {
                                if (data[i].idjefe == thisidjefe) {
                                    s += '<option value="' + data[i].idjefe + '" selected>' + data[i].nombrejefe+'</option>';
                                } else {
                                    s += '<option value="' + data[i].idjefe + '">' + data[i].nombrejefe+'</option>';
                                }
                            });
                            s += "</select>";
                            $("select#uidjefeproyecto").html(s);
                        }
                    });


                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                //$('input#codigoart', form).attr('readonly', 'readonly');
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }
        },
        {
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agregar Presupuesto Iniciativa",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentRowKey };
            },
            beforeSubmit: function (postdata, formid) {
                if (postdata.uidlider == 0) {
                    return [false, "Lider: Campo obligatorio", ""];
                } if (postdata.uidjefeproyecto == 0) {
                    return [false, "Jefe de Proyecto: Campo obligatorio", ""];
                }
                //var elporcentaje1 = parseFloat(postdata.porcentaje1.split(".").join("").replace(",", "."));
                var elporcentaje1 = parseInt(postdata.porcentaje1);
                console.log('porcentaje1: ' + elporcentaje1);
                var elporcentaje2 = 0;
                if(postdata.porcentaje2!=""){
                    //elporcentaje2 = parseFloat(postdata.porcentaje2.split(".").join("").replace(",", "."));
                    elporcentaje2 = parseInt(postdata.porcentaje2);
                }
                console.log('porcentaje2: ' + elporcentaje2);
                var lasuma = elporcentaje1 + elporcentaje2;
                console.log('total: ' + lasuma);
                if (lasuma != 100) {
                    return [false, "Porcentajes no suman 100", ""];
                }
                else {
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
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Eliminar Presupuesto Iniciativa",
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
}
function showSubGrids2(subgrid_id, row_id) {
    gridTareasNuevosProyectos(subgrid_id, row_id, 'tareas');
}