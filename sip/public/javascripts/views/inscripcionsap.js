$(document).ready(function () {
    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Glosa Presupuesto {glosa}</div>";
    template += "<div class='column-half'><span style='color: red'>*</span>N° SAP{sap}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Código ART{codigoart}</div>";
    template += "<div class='column-half'>Fecha Entrega Control Financiero{fechafinal}</div>";
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
            label: 'Glosa', name: 'glosa', width: 200, align: 'left',
            search: true, editable: true, hidden: false,
            editrules: { required: true },
        },

        {
            label: 'SAP', name: 'sap', width: 80, align: 'left',
            search: true, editable: true, hidden: false,
            editrules: { required: true },
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("00000", { placeholder: "_____" });
                }
            },
        },
        /*
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
                                    $("input#program_id").val(data.program_id);
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
        },*/
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
            search: false, editable: true, hidden: false,
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
            search: false, editable: true, hidden: false,
            editrules: { edithidden: false, required: true },
            hidedlg: true
        },

        {
            label: 'Fecha Entrega Control Financiero', name: 'fechafinal', width: 150, align: 'left', search: false,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' },
            editable: true, editrules: {required: true}, sortable: false,
            searchoptions: {
                dataInit: function (el) {
                    $(el).datepicker({
                        language: 'es',
                        format: 'yyyy-mm-dd',
                        autoclose: true,
                        onSelect: function (dateText, inst) {
                            setTimeout(function () {
                                $("#" + childGridID)[0].triggerToolbar();
                            }, 100);
                        }
                    });
                },
                sopt: ["eq", "le", "ge"]
            }
        },

    ];

    $("#table_iniciativa").jqGrid({
        url: '/inscripcionsap/listSAP',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelPresupuestoEnVuelo,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        caption: 'Inscripción SAP',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        pager: "#pager_iniciativa",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        editurl: '/presupuestoiniciativa/actualiSAP',
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
        }
    });
    jQuery.extend(jQuery.jgrid.edit, { recreateForm: true });
    $("#table_iniciativa").jqGrid('filterToolbar', {
        stringResult: true, searchOperators: true,
        searchOnEnter: false, defaultSearch: 'cn'
    });

    $('#table_iniciativa').jqGrid('navGrid', "#pager_iniciativa", {
        edit: true, add: false, del: false, search: false, refresh: true,
        view: false, position: "left", cloneToTop: false
    },
        {
            editCaption: "Inscripción SAP",
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
                if (postdata.codigoart == "") {
                    return [false, "Codigo ART: Campo obligatorio", ""];
                } if (postdata.sap.length > 4) {
                    if (confirm("Numero SAP tiene 5 digitos, es una extensión")){
                        return [true, "", ""];
                    } 
                }else {
                    return [true, "", ""];
                }
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0) {
                    return [false, result.error_text, ""];
                } else {
                    var grid = $("#table_iniciativa");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.id;
                    var thissap = result.sap;
                    var thisiniciativa = rowData.glosa;
                    if (thissid == undefined) {
                        alert("Debe seleccionar una fila");
                        return [false, result.error_text, ""];
                    }
                    //console.log('la sap: '+thissap);
                    if (thissap == "0") {
                        alert("Presupuesto no tiene número de SAP");
                        return [false, result.error_text, ""];
                    }
                    var boton = confirm('Está seguro que desea pasar la iniciativa ' + thisiniciativa + ' a Proyecto en vuelo');
                    if (boton == true) {
                        //alert('Funcionalidad en desarrollo, se guardo el número de SAP pero no se creó el proyecto en vuelo');
                        
                        $.ajax({
                            type: "POST",
                            url: '/generarproyectoenvuelo/' + thissid,
                            success: function (data) {
                                alert("Se ha generado el proyecto en vuelo: " + thisiniciativa);// + " con el id: " + data.id);
                                //window.location.href = "/presupuestoenvuelo";
                            }
                        });
                        
                    }else{
                        alert('Se guardo el número de SAP pero no se creó el proyecto en vuelo');
                    }

                    return [true, "", ""]
                }
            }, beforeShowForm: function (form) {
                $('input#codigoart', form).attr('readonly', 'readonly');
                $('input#glosa', form).attr('readonly', 'readonly');
                $('input#fechafinal', form).attr('readonly', 'readonly');
                //$('#program_id').attr('disabled', 'disabled');
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
        gridTareasInscripcion(subgrid_id, row_id, 'tareasinscripcion');
        //gridFechaEnVuelo(subgrid_id, row_id, 'fechaenvuelo');
    }
    
});