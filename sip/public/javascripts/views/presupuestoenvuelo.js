$(document).ready(function () {
    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'><span style='color: red'>*</span>Nombre Proyecto {nombreproyecto}</div>";
    template += "<div class='column-half'><span style='color: red'>*</span>N° SAP{sap}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Programa ART {program_id}</div>";
    template += "<div class='column-half'>Código ART{codigoart}</div>";
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
    template += "<div class='column-full'>Beneficios Cuantitativos{beneficioscuantitativos}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Beneficios Cualitativos{beneficioscualitativos}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-three'><span style='color: red'>*</span>Lider{uidlider}</div>";
    template += "<div class='column-three'><span style='color: red'>*</span>Jefe Proyecto{uidjefeproyecto}</div>";
    template += "<div class='column-three'><span style='color: red'>*</span>PMO Responsable{uidpmoresponsable}</div>";
    template += "</div>";
    /*
        template += "<div class='form-row'>";
        template += "<div class='column-three'><span style='color: red'>*</span>Dolar{dolar}</div>";
        template += "<div class='column-three'><span style='color: red'>*</span>UF{uf}</div>";
        template += "<div class='column-three'><span style='color: red'>*</span>Fecha Conversión{fechaconversion}</div>";
        template += "</div>";
    
    */
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
            hidden: true,
            hidedlg: true
        },
        {
            label: 'Proyecto', name: 'nombreproyecto', width: 250, align: 'left',
            search: true, editable: true, hidden: false,
            editrules: { required: true },
            colMenu: true,
            coloptions: {
                sorting: false, columns: true, filtering: false, searching: false,
                grouping: false, freeze: false
            },
        },

        {
            label: 'SAP', name: 'sap', width: 110, align: 'left',
            search: true, editable: true, hidden: false,
            editrules: { required: true },
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("00000", { placeholder: "_____" });
                }
            },
            colMenu: true,
            coloptions: {
                sorting: false, columns: true, filtering: false, searching: false,
                grouping: false, freeze: false
            },
        },
        {
            label: 'program_id', name: 'program_id', width: 150, align: 'left',
            hidden: true, editable: true, hidedlg: true,
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
                                    $("input#program_id").val(data.program_id);
                                }
                            });
                            $.ajax({
                                type: "GET",
                                url: '/usuariosporprograma/' + thispid,
                                async: false,
                                success: function (data) {
                                    var grid = $('#table_iniciativa');
                                    var rowKey = grid.getGridParam("selrow");
                                    var rowData = grid.getRowData(rowKey);
                                    var thissid = rowData.uidlider;
                                    //var data = JSON.parse(response);
                                    var s = "<select>";//el default
                                    s += '<option value="0">--Escoger Lider--</option>';
                                    $.each(data, function (i, item) {
                                        if (data[i].uid == thissid) {
                                            s += '<option value="' + data[i].uid + '" selected>' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                                        } else {
                                            s += '<option value="' + data[i].uid + '">' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                                        }
                                    });
                                    s += "</select>";
                                    $("select#uidlider").html(s);
                                    $("select#uidjefeproyecto").html(s);
                                }
                            });
                        } else {
                            $("input#codigoart").val(null);
                            $("input#program_id").val(null);
                        }
                    }
                }],
            },
            dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Art', name: 'codigoart', width: 70, align: 'left',
            search: false, editable: true, jsonmap: 'codigoart',
            colMenu: true,
            coloptions: {
                sorting: false, columns: true, filtering: false, searching: false,
                grouping: false, freeze: false
            },
        },
        {
            label: 'Cui 1', name: 'cuifinanciamiento1', width: 120, align: 'left',
            search: false, editable: true, hidden: false,
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("0000", { placeholder: "____" });
                }
            },
            editrules: { edithidden: false, required: true, number: true },
            hidedlg: true,
            colMenu: true,
            coloptions: {
                sorting: false, columns: true, filtering: false, searching: false,
                grouping: false, freeze: false
            },
        },
        {
            label: '% Cui 1', name: 'porcentaje1', width: 85, align: 'left',
            //formatter: 'number', 
            formatoptions: { decimalPlaces: 0 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000', { reverse: true, placeholder: "___" });
                }
            },
            formatter: function (cellvalue, options, rowObject) {
                var dato = '';
                var val = rowObject.porcentaje1;
                dato = val * 100;
                return dato;
            },
            search: false, editable: true, hidden: false,
            editrules: { edithidden: false, required: true },
            colMenu: true,
            coloptions: {
                sorting: false, columns: true, filtering: false, searching: false,
                grouping: false, freeze: false
            },
            //hidedlg: true
        },
        {
            label: 'Cui 2', name: 'cuifinanciamiento2', width: 75, align: 'left',
            search: false, editable: true, hidden: false,
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("0000", { placeholder: "____" });

                }
            },
            editrules: { edithidden: false, required: false, number: true },
            hidedlg: true,
            colMenu: true,
            coloptions: {
                sorting: false, columns: true, filtering: false, searching: false,
                grouping: false, freeze: false
            },
        },
        {
            label: '% Cui 2', name: 'porcentaje2', width: 85, align: 'left',
            //formatter: 'number', 
            formatoptions: { decimalPlaces: 0 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000', { reverse: true, placeholder: "___" });
                }
            },
            formatter: function (cellvalue, options, rowObject) {
                var dato = '';
                var val = rowObject.porcentaje2;
                dato = val * 100;
                return dato;
            },
            search: false, editable: true, hidden: false,
            editrules: { edithidden: false, required: false },
            colMenu: true,
            coloptions: {
                sorting: false, columns: true, filtering: false, searching: false,
                grouping: false, freeze: false
            },
            //hidedlg: true
        },
        {
            label: 'Beneficios Cuantitativos', name: 'beneficioscuantitativos', width: 200,
            align: 'left', edittype: "textarea",
            search: true, editable: true, hidden: true,
            colMenu: true,
            coloptions: {
                sorting: false, columns: true, filtering: false, searching: false,
                grouping: false, freeze: false
            },
        },
        {
            label: 'Beneficios Cualitativos', name: 'beneficioscualitativos', width: 200,
            align: 'left', edittype: "textarea",
            search: true, editable: true, hidden: true,
            colMenu: true,
            coloptions: {
                sorting: false, columns: true, filtering: false, searching: false,
                grouping: false, freeze: false
            },
        },
        {
            label: 'uidlider', name: 'uidlider',
            search: false, editable: true, hidden: true,
            editrules: { required: true }, hidedlg: true,
            edittype: "select",
            editoptions: {
                value: "0:--Escoger Lider--",
                /*
                buildSelect: function (response) {
                    var grid = $('#table_iniciativa');
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
                */

                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#lider").val($('option:selected', this).val());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }

        },
        {
            label: 'Lider', name: 'lider', width: 120, align: 'left',
            search: false, editable: true, hidden: false/*, jsonmap: "lider.first_name"*/,
            colMenu: true,
            coloptions: {
                sorting: false, columns: true, filtering: false, searching: false,
                grouping: false, freeze: false
            }, formatter: function (cellvalue, options, rowObject) {
                if (rowObject.lider)
                    return rowObject.lider.nombre + ' ' + rowObject.lider.apellido;
                else
                    return ''
            }
        },
        {
            label: 'uidjefeproyecto', name: 'uidjefeproyecto',
            search: false, editable: true, hidden: true,
            editrules: { required: true }, hidedlg: true,
            edittype: "select",
            editoptions: {
                value: "0:--Escoger Lider--",
                /*
                buildSelect: function (response) {
                    var grid = $('#table_iniciativa');
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
                */
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#jefeproyecto").val($('option:selected', this).val());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Jefe Area Responsable', name: 'jefeproyecto', width: 150, align: 'left',
            search: false, editable: true, hidden: false, /*jsonmap: "nombrejefe",*/
            colMenu: true,
            coloptions: {
                sorting: false, columns: true, filtering: false, searching: false,
                grouping: false, freeze: false
            }, formatter: function (cellvalue, options, rowObject) {
                if (rowObject.jefe)
                    return rowObject.jefe.nombre + ' ' + rowObject.jefe.apellido;
                else
                    return ''
            }
        },
        {
            label: 'uidpmoresponsable', name: 'uidpmoresponsable',
            search: false, editable: true, hidden: true,
            editrules: { required: true }, hidedlg: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/usuarios_por_rol/PMO',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.uidpmo;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger PMO--</option>';
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
                        $("input#pmoresponsable").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'PMO Responsable', name: 'first_name', width: 150, align: 'left',
            search: true, editable: false,
            hidden: false,/* jsonmap: "nombrepmo",*/
            colMenu: true,
            coloptions: {
                sorting: false, columns: true, filtering: false, searching: false,
                grouping: false, freeze: false
            }, formatter: function (cellvalue, options, rowObject) {
                if (rowObject.pmo)
                    return rowObject.pmo.nombre + ' ' + rowObject.pmo.apellido;
                else
                    return ''
            }
        },
        /*
                {
                    label: 'Dolar', name: 'dolar', width: 55, align: 'right',
                    search: false, editable: true, hidden: false,
                    editrules: { required: true },
                    formatter: 'number', formatoptions: { decimalPlaces: 0 },
                    editoptions: {
                        dataInit: function (el) {
                            $(el).mask('000', { reverse: true });
                        }
                    },
                    colMenu:true,
                    coloptions: {sorting:false, columns: true, filtering: false, searching: false,
                        grouping: false, freeze: false},
                },
        
                {
                    label: 'UF', name: 'uf', width: 60, align: 'right',
                    search: false, editable: true, hidden: false,
                    editrules: { required: true },
                    formatter: 'number', formatoptions: { decimalPlaces: 0 },
                    editoptions: {
                        dataInit: function (el) {
                            $(el).mask('00.000', { reverse: true });
                        }
                    },
                    colMenu:true,
                    coloptions: {sorting:false, columns: true, filtering: false, searching: false,
                        grouping: false, freeze: false},
                },
                {
                    label: 'Fecha Conv', name: 'fechaconversion', width: 100, align: 'left', search: false,
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
                    },
                    colMenu:true,
                    coloptions: {sorting:false, columns: true, filtering: false, searching: false,
                        grouping: false, freeze: false},
                },
        */
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
        responsive:true,
        caption: 'Compromisos por SAP',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        pager: "#pager_iniciativa",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        editurl: '/presupuestoenvuelo/action',
        styleUI: "Bootstrap",
        subGrid: true,
        subGridRowExpanded: showSubGrids,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        onSelectRow: function (id) {
            //var temp = $('#table_iniciativa').getRowData($('#table_iniciativa').getGridParam("selrow")).program_id;
            //$("#table_iniciativa").setColProp('uidjefeproyecto', { editoptions: { dataUrl: '/usuariosporprograma/' + temp } });
            //$("#table_iniciativa").setColProp('uidlider', { editoptions: { dataUrl: '/usuariosporprograma/' + temp } });
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
        },
    });
    jQuery.extend(jQuery.jgrid.edit, { recreateForm: true });
    $("#table_iniciativa").jqGrid('filterToolbar', {
        stringResult: true, searchOperators: true,
        searchOnEnter: true, defaultSearch: 'cn'
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
                } if (postdata.uidpmoresponsable == 0) {
                    return [false, "PMO Responsable: Campo obligatorio", ""];
                } if (postdata.program_id == 0) {
                    return [false, "Programa ART: Campo obligatorio", ""];
                }
                //var elporcentaje1 = parseFloat(postdata.porcentaje1.split(".").join("").replace(",", "."));
                var elporcentaje1 = parseInt(postdata.porcentaje1);
                console.log('porcentaje1: ' + elporcentaje1);
                var elporcentaje2 = 0;
                if (postdata.porcentaje2 != "") {
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
                $('input#codigoart', form).attr('readonly', 'readonly');
                var grid = $("#table_iniciativa");
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                var thissid = rowData.id;
                if (thissid == 0) {
                    alert("Debe seleccionar una fila");
                    return [false, result.error_text, ""];
                }
                var temp = $('#table_iniciativa').getRowData($('#table_iniciativa').getGridParam("selrow")).program_id;

                $.ajax({
                    type: "GET",
                    url: '/usuariosporprograma/' + temp,
                    success: function (data) {
                        var grid = $('#table_iniciativa');
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid2 = rowData.uidlider;
                        var s = "<select>";
                        s += '<option value="0">--Escoger Lider--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].uid == thissid2) {
                                s += '<option value="' + data[i].uid + '" selected>' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                            } else {
                                s += '<option value="' + data[i].uid + '">' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                            }
                        });
                        s += "</select>";
                        $("select#uidlider").html(s);
                        $("select#uidjefeproyecto").html(s);
                    }
                });

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
            beforeSubmit: function (postdata, formid) {
                if (postdata.uidlider == 0) {
                    return [false, "Lider: Campo obligatorio", ""];
                } if (postdata.uidjefeproyecto == 0) {
                    return [false, "Jefe de Proyecto: Campo obligatorio", ""];
                } if (postdata.uidpmoresponsable == 0) {
                    return [false, "PMO Responsable: Campo obligatorio", ""];
                } if (postdata.program_id == 0) {
                    return [false, "Programa ART: Campo obligatorio", ""];
                }
                //var elporcentaje1 = parseFloat(postdata.porcentaje1.split(".").join("").replace(",", "."));
                var elporcentaje1 = parseInt(postdata.porcentaje1);
                console.log('porcentaje1: ' + elporcentaje1);
                var elporcentaje2 = 0;
                if (postdata.porcentaje2 != "") {
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
                if (result.error_code != 0) {
                    return [false, result.error_text, ""];
                } else {
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"nombreproyecto\",\"op\":\"cn\",\"data\":\"" + postdata.nombreproyecto + "\"}]}";
                    $("#table_iniciativa").jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }, beforeShowForm: function (form) {
                sipLibrary.centerDialog($('#table_iniciativa').attr('id'));
                $('input#codigoart', form).attr('readonly', 'readonly');
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

    $('#table_iniciativa').jqGrid('navButtonAdd', '#pager_iniciativa_left', {
        caption: "",
        buttonicon: "glyphicon glyphicon-download-alt",
        title: "Exporta Excel",
        //position: "last",
        onClickButton: function () {
            var grid = $('#table_iniciativa');
            var rowKey = grid.getGridParam("selrow");
            var url = '/presupuestoenvuelo/exportar';
            $('#table_iniciativa').jqGrid('excelExport', { "url": url });
        }
    });

    $("#pager_iniciativa_left").css("width", "");
    function showSubGrids(subgrid_id, row_id) {
        gridTareaEnVuelo(subgrid_id, row_id, 'tareaenvuelo');
        //gridFechaEnVuelo(subgrid_id, row_id, 'fechaenvuelo');
        gridConversionEnVuelo(subgrid_id, row_id, 'conversionenvuelo');
    }
});