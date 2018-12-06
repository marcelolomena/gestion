$(document).ready(function () {

    $.ajax({
        url: '/usuarios_por_rol/PMO',
        type: 'GET',
        async: false, 
        success: function (j) {            
            $('#pmo').append('<option value="0"> - Escoger PMO - </option>');
            $.each(j, function (i, item) {
                $('#pmo').append('<option value="' + item.uid + '">' + item.first_name + ' '+ item.last_name + '</option>');
            });
        },
        error: function (e) {

        }                
    });
    
    $.ajax({
        url: '/parameters/estadoiniciativa',
        type: 'GET',
        async: false, 
        success: function (j) {            
            $('#estado').append('<option value="0"> - Escoger Estado - </option>');
            $.each(j, function (i, item) {
                $('#estado').append('<option value="' + item.id + '">' + item.nombre + '</option>');
            });
        },
        error: function (e) {

        }                
    });    
        
    nombreini = $('#nombreini').val();
    numart = $('#numart').val();
    pmo = $('#pmo').val();
    estado = $('#estado').val();    
    loadGrid(nombreini, numart, pmo, estado);     
               
    $("#buscar").click(function(){
   
       nombreini = $('#nombreini').val();
       numart = $('#numart').val();
       pmo = $('#pmo').val();
       estado = $('#estado').val();
       loadGrid(nombreini, numart, pmo, estado);
    });

});    
    
var leida = false;
var proveedorx;
function loadGrid(nombreini, numart, pmo, estado) {
	var url = "/iniciativas/list";
	if (leida){
        $("#grid").setGridParam({ postData: {nombreini:nombreini, numart:numart, pmo:pmo, estado:estado, page:1, rows:10} });
        $("#grid").jqGrid('setCaption', "Iniciativas").jqGrid('setGridParam', { url: url, page: 1}).jqGrid("setGridParam", {datatype: "json"}).trigger("reloadGrid");
	} else {
		showIniciativas(nombreini, numart, pmo, estado);
	}
}
    
function showIniciativas(nombreini, numart, pmo, estado) {    
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
    tmpl += "<div class='column-half'>Fec Último Comité {fechacomite}</div>";
    tmpl += "<div class='column-half'><span style='color: red'>*</span>Año {ano}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-three'>Gasto Est {pptoestimadogasto}</div>";
    tmpl += "<div class='column-three'>Inv. Est {pptoestimadoinversion}</div>";
    tmpl += "<div class='column-three'>Ppto Est {pptoestimadoprevisto}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Importante: Los montos estimados están en Dolares.</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-three'>Gasto Apr {pptoaprobadogasto}</div>";
    tmpl += "<div class='column-three'>Inv. Apr {pptoaprobadoinversion}</div>";
    tmpl += "<div class='column-three'>PresupuestoAprobado{pptoaprobadoprevisto}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Importante: Los montos aprobados están en Pesos.</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Ppto Apr en Dolares {pptoaprobadodolares}</div>";
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

    var modelIniciativa = [
        { label: 'id', name: 'id', key: true, hidden: true },
        {
            label: 'Proyecto', name: 'nombre', width: 280, align: 'left',
            search: false, editable: true, hidden: false,
            editrules: { required: true },
            editoptions: {placeholder: "Nombre del proyecto" }
        },
        {
            label: 'División', name: 'iddivision',
            search: false, editable: true, hidden: true,
            editrules: { required: true },
            edittype: "select",
            editoptions: {
                dataUrl: '/divisiones',
                buildSelect: function (response) {
                    var grid = $("#grid");
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
            label: 'División', name: 'divisionsponsor', width: 160, align: 'left',
            search: false, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true },
            stype: 'select',
            searchoptions: {
                dataUrl: '/divisiones',
                buildSelect: function (response) {
                    var grid = $("#grid");
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
                }
            },
        },
        {
            label: 'Sponsor', name: 'sponsor1', width: 90, align: 'left',
            search: false, editable: true, hidden: false,
            editoptions: {placeholder: "Nombre y apellido Sponsor 1" }
        },
        {
            label: 'Gerente', name: 'uidgerente',
            search: false, editable: true, hidden: true,
            editrules: { required: true },
            edittype: "select",
            editoptions: {
                dataUrl: '/usuarios_por_rol/Gerente',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.uidgerente;
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger Gerente--</option>';
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
                        if ($('option:selected', this).val() != 0) {
                            $("input#gerenteresponsable").val($('option:selected', this).text());
                        } else {
                            $("input#gerenteresponsable").val("");
                        }
                    }
                }],
            },
            dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Gerente', name: 'gerenteresponsable', width: 110, align: 'left',
            search: false, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true }
        },
        {
            label: 'PMO', name: 'uidpmo',
            search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/usuarios_por_rol/PMO',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.uidpmo;
                    var data = JSON.parse(response);
                    var s = "<select>";
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
                        if ($('option:selected', this).val() != 0) {
                            $("input#pmoresponsable").val($('option:selected', this).text());
                        } else {
                            $("input#pmoresponsable").val("");
                        }
                    }
                }],
            },
            dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'PMO', name: 'pmoresponsable', width: 150, align: 'left',
            search: false, editable: true, hidedlg: true,hidden: true,
            editrules: { edithidden: false }
        },
        {
            label: 'Categoria', name: 'idcategoria',
            search: false, editable: true, hidden: true,
            editrules: { required: true },
            edittype: "select",
            editoptions: {
                dataUrl: '/parameters/categoria',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.tipo;
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger Categoría--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].nombre == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        if ($('option:selected', this).val() != 0) {
                            $("input#categoria").val($('option:selected', this).text());
                        } else {
                            $("input#categoria").val("");
                        }
                    }
                }],
            },
            dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Categoria', name: 'categoria', width: 150, align: 'left',
            search: false, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true }
        },
        {
            label: 'Estado', name: 'estado', width: 120, align: 'left',
            search: false, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true }
        },
        {
            label: 'Año', name: 'ano', width: 50, align: 'left',
            search: false, editable: true,
            editrules: { required: true },
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("0000", { placeholder: "____" });
                }
            },
            searchoptions: {
                sopt: ["ge", "le", "eq"] // ge = greater or equal to, le = less or equal to, eq = equal to
            }
        },
        {
            label: 'Q1', name: 'q1', width: 50, align: 'left',
            search: false, editable: true, hidden: true,
            editoptions: {placeholder: "Q1 o vacío" }
        },
        {
            label: 'Q2', name: 'q2', width: 50, align: 'left',
            search: false, editable: true, hidden: true,
            editoptions: {placeholder: "Q2 o vacío" }
        },
        {
            label: 'Q3', name: 'q3', width: 50, align: 'left',
            search: false, editable: true, hidden: true,
            editoptions: {placeholder: "Q3 o vacío" }
        },
        {
            label: 'Q4', name: 'q4', width: 50, align: 'left',
            search: false, editable: true, hidden: true,
            editoptions: {placeholder: "Q4 o vacío" }
        },
        {
            label: 'Fec Último Comite', name: 'fechacomite', width: 130, align: 'left',
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
                                $('#grid')[0].triggerToolbar();
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
            label: 'Gasto Est (US$)', name: 'pptoestimadogasto', width: 108, align: 'right',
            search: false, editable: true, hidden: false, formatter: 'number',
            formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000,00', { reverse: true });
                }
            }
        },
        {
            label: 'Inv. Est (US$)', name: 'pptoestimadoinversion', width: 105, align: 'right',
            search: false, editable: true, hidden: false, formatter: 'number',
            formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000,00', { reverse: true });
                }
            }
        },
        {
            label: 'Ppto Est (US$)', name: 'pptoestimadoprevisto', width: 105, align: 'right',
            search: false, editable: true, hidden: false, formatter: 'number',
            formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000,00', { reverse: true });
                }
            }
        },
        {
            label: 'Gasto Apr (CLP)', name: 'pptoaprobadogasto', width: 110, align: 'right',
            search: false, editable: true, hidden: false, formatter: 'number',
            formatoptions: { decimalPlaces: 0 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000', { reverse: true });
                }
            }
        },
        {
            label: 'Inv. Apr (CLP)', name: 'pptoaprobadoinversion', width: 105, align: 'right',
            search: false, editable: true, hidden: false, formatter: 'number',
            formatoptions: { decimalPlaces: 0 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000', { reverse: true });
                }
            }
        },
        {
            label: 'Ppto Apr (CLP)', name: 'pptoaprobadoprevisto', width: 105, align: 'right',
            search: false, editable: true, hidden: false, formatter: 'number',
            formatoptions: { decimalPlaces: 0 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000', { reverse: true });
                }
            }
        },
        {
            label: 'Ppto Apr (US$)', name: 'pptoaprobadodolares', width: 105, align: 'right',
            search: false, editable: true, hidden: false, formatter: 'number',
            formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000,00', { reverse: true });
                }
            }
        },
        {
            label: 'Estado', name: 'idestado',
            search: false, editable: true, hidden: true,
            edittype: "select",
            editrules: { required: true },
            editoptions: {
                dataUrl: '/parameters/estadoiniciativa',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.divisionsponsor;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Estado--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].nombre == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        if ($('option:selected', this).val() != 0) {
                            $("input#estado").val($('option:selected', this).text());
                        } else {
                            $("input#estado").val("");
                        }
                    }
                }],
            },
            dataInit: function (elem) { $(elem).width(200); }
        },
    ];
    $("#grid").jqGrid({
        url: '/iniciativas/list',
        mtype: "POST",
        postData: {
            nombreini : function () {
                return nombreini;
            },
            numart : function () {
                return numart;
            },
            pmo : function () {
                return pmo;
            },
            estado : function () {
                return estado;
            }                                                        
        },            
        datatype: "json",
        page: 1,
        colModel: modelIniciativa,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        caption: 'Lista de iniciativas',
        width: null,
        shrinkToFit: false,
        // autowidth: true,  // set 'true' here
        // shrinkToFit: true, // well, it's 'true' by default
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        editurl: '/iniciativas/action',
        styleUI: "Bootstrap",
        subGrid: true,
        subGridRowExpanded: gridIniciativaPrograma,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }
    });
    $("#grid").jqGrid('filterToolbar', {
        stringResult: true, searchOperators: true,
        searchOnEnter: false, defaultSearch: 'cn'
    });

    $('#grid').jqGrid('navGrid', "#pager", {
        edit: true, add: true, del: true, search: false, refresh: true,
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
                sipLibrary.centerDialog($('#grid').attr('id'));
                $('input#pptoestimadogasto', form).attr('readonly', 'readonly');
                $('input#pptoestimadoinversion', form).attr('readonly', 'readonly');
                $('input#pptoestimadoprevisto', form).attr('readonly', 'readonly');
                $('input#pptoaprobadogasto', form).attr('readonly', 'readonly');
                $('input#pptoaprobadoinversion', form).attr('readonly', 'readonly');
                $('input#pptoaprobadoprevisto', form).attr('readonly', 'readonly');
                $('input#pptoaprobadodolares', form).attr('readonly', 'readonly');
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#grid").attr('id'));
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
                    $("#grid").jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
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
                sipLibrary.centerDialog($('#grid').attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#grid").attr('id'));
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

    $('#grid').jqGrid('navButtonAdd', '#pager', {
        caption: "",
        buttonicon: "glyphicon glyphicon-download-alt",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $('#grid');
            var rowKey = grid.getGridParam("selrow");
            var url = '/iniciativasexcel';
            $('#grid').jqGrid('excelExport', { "url": url });
        }
    });
    $("table.ui-jqgrid-htable").css('width','100%');      $("table.ui-jqgrid-btable").css('width','100%');
    $("#pager_left").css("width", "");

    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        //$("#grid").jqGrid("setGridWidth",$("#gcontainer").width() );
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });
    

	leida = true;    
    
}

