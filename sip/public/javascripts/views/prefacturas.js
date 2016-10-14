function returnTaskLink(cellValue, options, rowdata, action) 
{
    return "<a href='/factura/prefactura/" + rowdata.id + "' >" + cellValue +"</a>";
}

$(document).ready(function () {
    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color: red'>*</span>Proyecto {nombre}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color: red'>*</span> División {iddivision}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Sponsor {sponsor1}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'><span style='color: red'>*</span>PMO {uidpmo}</div>";
    tmpl += "<div class='column-half'><span style='color: red'>*</span>Gerente {uidgerente}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'><span style='color: red'>*</span>Estado {idestado}</div>";
    tmpl += "<div class='column-half'><span style='color: red'>*</span>Categoría {idcategoria}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-four'>Q1 {q1}</div>";
    tmpl += "<div class='column-four'>Q2 {q2}</div>";
    tmpl += "<div class='column-four'>Q3 {q3}</div>";
    tmpl += "<div class='column-four'>Q4 {q4}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Fecha Último Comité {fechacomite}</div>";
    tmpl += "<div class='column-half'><span style='color: red'>*</span>Año {ano}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-three'>Gasto Estimado {pptoestimadogasto}</div>";
    tmpl += "<div class='column-three'>Inversión Estimada {pptoestimadoinversion}</div>";
    tmpl += "<div class='column-three'>Presupuesto Estimado {pptoestimadoprevisto}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Importante: Los montos estimados están en Dolares.</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-three'>Gasto Aprobado {pptoaprobadogasto}</div>";
    tmpl += "<div class='column-three'>Inversión Aprobada {pptoaprobadoinversion}</div>";
    tmpl += "<div class='column-three'>PresupuestoAprobado{pptoaprobadoprevisto}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Importante: Los montos aprobados están en Pesos.</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Presupuesto Aprobado en Dolares {pptoaprobadodolares}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' style='display: none;'>";
    tmpl += "<div class='column-half'>estado {estado}</div>";
    tmpl += "<div class='column-half'>categoria {categoria}</div>";
    tmpl += "<div class='column-half'>pmoresponsable {pmoresponsable}</div>";
    tmpl += "<div class='column-half'>gerenteresponsable {gerenteresponsable}</div>";
    tmpl += "<div class='column-half'>divisionsponsor {divisionsponsor}</div>";
    tmpl += "</div>";

    tmpl += "<hr style='width:100%;'/>";
    tmpl += "<div> {sData} {cData}  </div>";
    tmpl += "</div>";

    var modelPrefacturas = [
        { label: 'Numero Prefactura', name: 'id', key: true, hidden: false, formatter: returnTaskLink },
        {
            label: 'Periodo', name: 'periodo', width: 200, align: 'left',
            search: true, editable: true, hidden: false
        },
        {
            label: 'Proveedor', name: 'idproveedor',
            search: false, editable: true, hidden: true,
            editrules: { required: true },
            edittype: "select",
            editoptions: {
                dataUrl: '/divisiones',
                buildSelect: function (response) {
                    var grid = $("#table_iniciativa");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.iddivision;
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger División--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].idRRHH == thissid) {
                            s += '<option value="' + data[i].idRRHH + '" selected>' + data[i].division + '</option>';
                        } else {
                            s += '<option value="' + data[i].idRRHH + '">' + data[i].division + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        if ($('option:selected', this).val() != 0) {
                            $("input#divisionsponsor").val($('option:selected', this).text());
                        } else {
                            $("input#divisionsponsor").val("");
                        }
                    }
                }],
            },
            dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Proveedor', name: 'proveedor', width: 450, align: 'left',
            search: true, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true }
        },
        {
            label: 'CUI', name: 'idcui',
            search: false, editable: true, hidden: true,
            editrules: { required: true },
            edittype: "select",
            editoptions: {
                dataUrl: '/divisiones',
                buildSelect: function (response) {
                    var grid = $("#table_iniciativa");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.iddivision;
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger División--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].idRRHH == thissid) {
                            s += '<option value="' + data[i].idRRHH + '" selected>' + data[i].division + '</option>';
                        } else {
                            s += '<option value="' + data[i].idRRHH + '">' + data[i].division + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        if ($('option:selected', this).val() != 0) {
                            $("input#divisionsponsor").val($('option:selected', this).text());
                        } else {
                            $("input#divisionsponsor").val("");
                        }
                    }
                }],
            },
            dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'CUI', name: 'cui', width: 150, align: 'left',
            search: true, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true }
        },
        {
            label: 'Contrato', name: 'idcontrato',
            search: false, editable: true, hidden: true,
            editrules: { required: true },
            edittype: "select",
            editoptions: {
                dataUrl: '/divisiones',
                buildSelect: function (response) {
                    var grid = $("#table_iniciativa");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.iddivision;
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger División--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].idRRHH == thissid) {
                            s += '<option value="' + data[i].idRRHH + '" selected>' + data[i].division + '</option>';
                        } else {
                            s += '<option value="' + data[i].idRRHH + '">' + data[i].division + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        if ($('option:selected', this).val() != 0) {
                            $("input#divisionsponsor").val($('option:selected', this).text());
                        } else {
                            $("input#divisionsponsor").val("");
                        }
                    }
                }],
            },
            dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Contrato', name: 'idcontrato', width: 150, align: 'left',
            search: true, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true }
        },
        {
            label: 'Factura', name: 'factura', width: 200, align: 'left',
            search: true, editable: true, hidedlg: true
        },
        {
            label: 'Fecha', name: 'fecha', width: 130, align: 'left',
            search: false, editable: true, formatter: 'date',
            formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' },
            searchoptions: {
                dataInit: function (el) {
                    $(el).datepicker({
                        language: 'es',
                        format: 'yyyy-mm-dd',
                        autoclose: true,
                        onSelect: function (dateText, inst) {
                            setTimeout(function () {
                                $('#table_prefacturas')[0].triggerToolbar();
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
        
        {
            label: 'Estado', name: 'estado', width: 150, align: 'left',
            search: true, editable: true, hidedlg: true, hidden: true,
            editrules: { edithidden: false, required: true }
        },
        
    ];
    $("#table_prefacturas").jqGrid({
        url: '/prefacturas/list',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelPrefacturas,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        caption: 'Lista de prefacturas',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        pager: "#pager_prefacturas",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        editurl: '/prefacturas/action',
        styleUI: "Bootstrap",
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }
    });
    $("#table_prefacturas").jqGrid('filterToolbar', {
        stringResult: true, searchOperators: true,
        searchOnEnter: false, defaultSearch: 'cn'
    });

    $('#table_prefacturas').jqGrid('navGrid', "#pager_prefacturas", {
        edit: false, add: false, del: false, search: false, refresh: true,
        view: false, position: "left", cloneToTop: false
    },
        {
            editCaption: "Modifica Iniciativa",
            closeAfterEdit: true,
            recreateForm: true,
            //mtype: 'POST',
            //url: '/iniciativas/update',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }, beforeShowForm: function (form) {
                sipLibrary.centerDialog($('#table_iniciativa').attr('id'));
                $('input#pptoestimadogasto', form).attr('readonly', 'readonly');
                $('input#pptoestimadoinversion', form).attr('readonly', 'readonly');
                $('input#pptoestimadoprevisto', form).attr('readonly', 'readonly');
                $('input#pptoaprobadogasto', form).attr('readonly', 'readonly');
                $('input#pptoaprobadoinversion', form).attr('readonly', 'readonly');
                $('input#pptoaprobadoprevisto', form).attr('readonly', 'readonly');
                $('input#pptoaprobadodolares', form).attr('readonly', 'readonly');
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#table_iniciativa").attr('id'));
            }
        },
        {
            addCaption: "Agrega Iniciativa",
            closeAfterAdd: true,
            recreateForm: true,
            //mtype: 'POST',
            //url: '/iniciativas/add',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
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
                $('input#pptoestimadogasto', form).attr('readonly', 'readonly');
                $('input#pptoestimadoinversion', form).attr('readonly', 'readonly');
                $('input#pptoestimadoprevisto', form).attr('readonly', 'readonly');
                $('input#pptoaprobadogasto', form).attr('readonly', 'readonly');
                $('input#pptoaprobadoinversion', form).attr('readonly', 'readonly');
                $('input#pptoaprobadoprevisto', form).attr('readonly', 'readonly');
                $('input#pptoaprobadodolares', form).attr('readonly', 'readonly');
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
    $("#pager_prefacturas_left").css("width", "");
});