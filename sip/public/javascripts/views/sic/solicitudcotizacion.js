$(document).ready(function () {
    var t1 = "<div id='responsive-form' class='clearfix'>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half' id='d_idcui'>CUI<span style='color:red'>*</span>{idcui}</div>";
    t1 += "<div class='column-half' id='d_idtecnico'>Técnico<span style='color:red'>*</span>{idtecnico}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half' id='d_tipocontrato'>Tipo Contrato<span style='color:red'>*</span>{tipocontrato}</div>";
    t1 += "<div class='column-half' id='d_codigoart'>Codigo Art<span style='color:red'>*</span>{codigoart}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half' id='d_sap'>SAP<span style='color:red'>*</span>{sap}</div>";
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
    /*
        t1 += "<div class='form-row'>";
        t1 += "<div class='column-half' id='d_nombreinterlocutor1'>Nombre Interlocutor 1<span style='color:red'>*</span>{nombreinterlocutor1}</div>";
        t1 += "<div class='column-half' id='d_correointerlocutor1'>Correo Interlocutor 1<span style='color:red'>*</span>{correointerlocutor1}</div>";
        t1 += "</div>";
    
        t1 += "<div class='form-row'>";
        t1 += "<div class='column-half' id='d_fonointerlocutor1'>Fono Interlocutor 1<span style='color:red'>*</span>{fonointerlocutor1}</div>";
        t1 += "<div class='column-half' id='d_nombreinterlocutor2'>Nombre Interlocutor 2<span style='color:red'>*</span>{nombreinterlocutor2}</div>";
        t1 += "</div>";
    
        t1 += "<div class='form-row'>";
        t1 += "<div class='column-half' id='d_correointerlocutor2'>Correo Interlocutor 2<span style='color:red'>*</span>{correointerlocutor2}</div>";
        t1 += "<div class='column-half' id='d_fonointerlocutor2'>Fono Interlocutor 2<span style='color:red'>*</span>{fonointerlocutor2}</div>";
        t1 += "</div>";
    */
    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half' id='d_tipo'>Tipo<span style='color:red'>*</span>{idtipo}</div>";
    t1 += "<div class='column-half' id='d_grupo'>Grupo<span style='color:red'>*</span>{idgrupo}</div>";
    t1 += "</div>";

    t1 += "<hr style='width:100%;'/>";
    t1 += "<div> {sData} {cData}  </div>";

    t1 += "</div>";

    var $grid = $("#gridMaster"), solicitudcotizacionModel = [
        { label: 'ID', name: 'id', key: true, hidden: true },
        {
            label: 'CUI', name: 'idcui', width: 80, align: 'left', search: false, sortable: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/allcuis',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idcui;
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger CUI--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].cui + ' - ' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].cui + ' - ' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        { label: 'CUI', name: 'nombrecui', jsonmap: "estructuracui.cui", width: 50, align: 'left', search: false, sortable: false, editable: true, hidden: false },
        {
            label: 'Técnico', name: 'idtecnico', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/usuarios_por_rol/Negociador',
                buildSelect: function (response) {
                    var rowKey = $grid.getGridParam("selrow");
                    var rowData = $grid.getRowData(rowKey);
                    var thissid = rowData.uidpmo;
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger Técnico--</option>';
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
                        $("input#tecnico").val($('option:selected', this).text());
                    }
                }],
            }
        },
        { label: 'Técnico', name: 'tecnico', width: 150, search: false, editable: false, formatter: returnTecnico, hidden: false },
        {
            label: 'T.Contrato', name: 'tipocontrato', search: false, editable: true, hidden: false, width:100,
            edittype: "custom",
            editoptions: {
                custom_value: sipLibrary.getRadioElementValue,
                custom_element: sipLibrary.radioElemContrato,
                defaultValue: "Continuidad",
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        var actual = $("input#codigoart").attr("readonly");
                        if (actual == 'readonly') {
                            $("input#codigoart").attr("readonly", false);
                        } else {
                            $("input#codigoart").attr("readonly", true);
                        }
                    }
                }],
            },
            formatter: function (cellvalue, options, rowObject) {
                var dato = '';
                var val = rowObject.tipocontrato;
                if (val == 1) {
                    dato = 'Continuidad';

                } else if (val == 0) {
                    dato = 'Proyectos';
                }
                return dato;
            }
        },
        {
            label: 'Código Programa', name: 'program_id', width: 200, align: 'left', search: false, editable: false,
            hidden: true, editoptions: { defaultValue: "0" }
        },
        {
            label: 'CódigoART', name: 'codigoart', width: 90, align: 'left', search: false, editable: true, hidden: false,
            editrules: { edithidden: false }, hidedlg: true, editoptions: {
                size: 10, readonly: 'readonly',
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        var rowKey = $grid.getGridParam("selrow");
                        var rowData = $grid.getRowData(rowKey);
                        var thissid = $(this).val();
                        $.ajax({
                            type: "GET",
                            url: '/getcodigoart/' + thissid,
                            async: false,
                            success: function (data) {
                                if (data.length > 0) {
                                    $("input#program_id").val(data[0].program_id);
                                } else {
                                    alert("No existe el codigo art ingresado");
                                    $("input#program_id").val("0");
                                }
                            }
                        });
                    }
                }],
            }
        },
        { label: 'SAP', name: 'sap', width: 50, align: 'left', search: false, editable: true, hidden: false },
        {
            label: 'Descripción', name: 'descripcion', width: 250, align: 'left',
            search: false, editable: true, editoptions: { rows: "2", cols: "50" },
            editrules: { required: true }, edittype: "textarea", hidden: false
        },

        { label: 'Código', name: 'codigosolicitud', width: 100, align: 'left', search: false, editable: true, hidden: false },
        {
            name: 'idclasificacionsolicitud', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/sic/parametros/clasificacionsolicitud',
                buildSelect: function (response) {
                    var rowKey = $grid.getGridParam("selrow");
                    var rowData = $grid.getRowData(rowKey);
                    var thissid = rowData.idclasificacionsolicitud;
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger una Clasificación--</option>';
                    $.each(data, function (i, item) {

                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }
        },
        { label: 'Clasificación', name: 'clasificacion', jsonmap: "clasificacion.nombre", width: 120, align: 'left', search: false, editable: true, hidden: false },
        { label: 'Color',
            name: 'colornota',
            index: 'colornota', width: 50, align: "left", editable: true, editoptions: { size: 10 },
            formatter: function (cellvalue, options, rowObject) {

                var solicitud = rowObject.id;
                var color = 'pink'

                $.ajax({
                    type: "GET",
                    url: '/sic/getcolorservicios/' + solicitud,
                    async: false,
                    success: function (data) {
                        
                        if (data == 'Rojo') {
                            color = 'red';
                        } else if (data == 'Verde') {
                            color = 'green';
                        } else if (data == 'Amarillo') {
                            color = 'yellow';
                        } else if (data == 'Azul') {
                            color = 'blue';
                        } else if (data == 'indefinido') {
                            color = 'gray';
                        }

                    }
                });


                return '<span class="cellWithoutBackground" style="background-color:' + color + '; display:block; height: 16px;"></span>';
            }
        },
        {
            label: 'Negociador', name: 'idnegociador', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/usuarios_por_rol/Negociador',
                buildSelect: function (response) {
                    var rowKey = $grid.getGridParam("selrow");
                    var rowData = $grid.getRowData(rowKey);
                    var thissid = rowData.uidpmo;
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger Negociador--</option>';
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
                        $("input#negociador").val($('option:selected', this).text());
                    }
                }],
            }
        },
        { label: 'Negociador', name: 'negociador', width: 150, search: false, editable: false, formatter: returnNegociador, hidden: false },
        { label: 'C.Negociador', name: 'correonegociador', width: 130, hidden: false, search: false, editable: true },
        { label: 'F.Negociador', name: 'fononegociador', width: 100, hidden: false, search: false, editable: true },
        { label: 'D.Negociador', name: 'direccionnegociador', width: 150, hidden: false, search: false, editable: true },
        { label: 'N° RFP', name: 'numerorfp', width: 80, hidden: false, search: false, editable: true },
        {
            label: 'Fecha RFP', name: 'fechaenviorfp',
            width: 90, align: 'center', search: true, editable: true, hidden: false,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' },
            searchoptions: {
                dataInit: function (el) {
                    $(el).datepicker({
                        language: 'es',
                        format: 'yyyy-mm-dd',
                        autoclose: true
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
        /*
        { label: 'Interlocutor 1', name: 'nombreinterlocutor1', width: 150, search: false, hidden: false, editable: true },
        { label: 'Correo Interlocutor 1', name: 'correointerlocutor1', width: 150, search: false, hidden: false, editable: true },
        { label: 'Fono Interlocutor 1', name: 'fonointerlocutor1', width: 150, search: false, hidden: false, editable: true },
        { label: 'Interlocutor 2', name: 'nombreinterlocutor2', width: 150, search: false, hidden: false, editable: true },
        { label: 'Correo Interlocutor 2', name: 'correointerlocutor2', width: 150, search: false, hidden: false, editable: true },
        { label: 'Fono Interlocutor 2', name: 'fonointerlocutor2', width: 150, search: false, hidden: false, editable: true },
        */
        {
            name: 'idtipo', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/sic/tipos',
                buildSelect: function (response) {
                    var rowKey = $grid.getGridParam("selrow");
                    var rowData = $grid.getRowData(rowKey);
                    var thissid = rowData.idtipo;
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger un Tipo--</option>';
                    $.each(data, function (i, item) {

                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }
        },
        { label: 'Tipo', name: 'tipo', jsonmap: "tipoclausula.nombre", width: 100, align: 'left', search: false, editable: false, hidden: false },
        {
            name: 'idgrupo', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/sic/parametros/grupoclausula',
                buildSelect: function (response) {
                    var rowKey = $grid.getGridParam("selrow");
                    var rowData = $grid.getRowData(rowKey);
                    var thissid = rowData.idgrupo;
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger un Grupo--</option>';
                    $.each(data, function (i, item) {

                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }
        },
        { label: 'Grupo', name: 'grupo', jsonmap: "grupo.nombre", width: 120, align: 'left', search: false, editable: false, hidden: false },
    ];
    var previousRowId = 0;
    $grid.jqGrid({
        url: '/sic/grid_solicitudcotizacion',
        datatype: "json",
        mtype: "GET",
        colModel: solicitudcotizacionModel,
        page: 1,
        rowNum: 20,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        //width: 1500,
        shrinkToFit: false,
        forceFit: true,
        viewrecords: true,
        editurl: '/sic/grid_solicitudcotizacion',
        caption: 'Solicitud de Cotización',
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
            $.get('/sic/getsession', function (data) {
                $.each(data, function (i, item) {
                    if (item.glosarol === 'Negociador SIC') {
                        $("#add_" + thisId).addClass('ui-disabled');
                        $("#add_gridMaster").hide()
                        /*
                        $grid.jqGrid("showCol", "codigosolicitud")
                        $grid.jqGrid("showCol", "negociador")
                        $grid.jqGrid("showCol", "correonegociador")
                        $grid.jqGrid("showCol", "fononegociador")
                        $grid.jqGrid("showCol", "direccionnegociador")
                        $grid.jqGrid("showCol", "numerorfp")
                        $grid.jqGrid("showCol", "fechaenviorfp")
                        $grid.jqGrid("showCol", "nombreinterlocutor1")
                        $grid.jqGrid("showCol", "correointerlocutor1")
                        $grid.jqGrid("showCol", "fonointerlocutor1")
                        $grid.jqGrid("showCol", "nombreinterlocutor2")
                        $grid.jqGrid("showCol", "correointerlocutor2")
                        $grid.jqGrid("showCol", "fonointerlocutor2")
                        $grid.jqGrid("showCol", "grupo")
                        $grid.jqGrid("showCol", "tipo")
                        */
                    }
                });
            });
        }
    });

    $grid.jqGrid('navGrid', '#pagerMaster', { edit: true, add: true, del: true, search: false },
        {
            editCaption: "Modifica Solicitud",
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
                    /*
                    if (postdata.fonointerlocutor1.trim().length == 0) {
                        postdata.fonointerlocutor1 = null
                    }
                    if (postdata.fonointerlocutor2.trim().length == 0) {
                        postdata.fonointerlocutor2 = null
                    }
                    if (postdata.fechaenviorfp.trim().length == 0) {
                        postdata.fechaenviorfp = null
                    }
                    if (postdata.fononegociador.trim().length == 0) {
                        postdata.fononegociador = null
                    }
*/
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
                    $.get('/sic/getsession', function (data) {
                        $.each(data, function (i, item) {
                            if (item.glosarol === 'Negociador SIC') {
                                $("#idcui", form).attr("disabled", true);
                                $("#idtecnico", form).attr('readonly', 'readonly');
                                $("#tipocontrato", form).attr('readonly', 'readonly');
                                $("#codigoart", form).attr('readonly', 'readonly');
                                $("#sap", form).attr('readonly', 'readonly');
                                $("#descripcion", form).attr('readonly', 'readonly');
                                //$("#idclasificacionsolicitud", form).attr('readonly', 'readonly');
                            } else if (item.glosarol === 'Técnico SIC') {
                                $("#codigosolicitud", form).attr('readonly', 'readonly');
                                $("#idclasificacionsolicitud", form).attr('disabled', 'disabled');
                                $("#idnegociador", form).attr('disabled', 'disabled');
                                $("#correonegociador", form).attr('readonly', 'readonly');
                                $("#direccionnegociador", form).attr('readonly', 'readonly');
                                $("#fononegociador", form).attr('readonly', 'readonly');
                                $("#numerorfp", form).attr('readonly', 'readonly');
                                $("#fechaenviorfp", form).attr('disabled', 'disabled');
                                $("#nombreinterlocutor1", form).attr('readonly', 'readonly');
                                $("#correointerlocutor1", form).attr('readonly', 'readonly');
                                $("#fonointerlocutor1", form).attr('readonly', 'readonly');
                                $("#nombreinterlocutor2", form).attr('readonly', 'readonly');
                                $("#correointerlocutor2", form).attr('readonly', 'readonly');
                                $("#fonointerlocutor2", form).attr('readonly', 'readonly');
                                $("#idgrupo", form).attr('disabled', 'disabled');
                                $("#idtipo", form).attr('disabled', 'disabled');
                            }
                        });
                    });
                }, 100);
            }

        }, {
            addCaption: "Agrega Solicitud",
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
                } else if (parseInt(postdata.idtecnico) == 0) {
                    return [false, "Técnico: Debe escoger un valor", ""];
                } else if (postdata.descripcion.trim().length == 0) {
                    return [false, "Descripción: Debe ingresar una descripción", ""];
                } else {
                    postdata.codigosolicitud = null;
                    postdata.idnegociador = null;
                    postdata.correonegociador = null;
                    postdata.fononegociador = null;
                    postdata.direccionnegociador = null;
                    postdata.numerorfp = null;
                    postdata.fechaenviorfp = null;
                    postdata.nombreinterlocutor1 = null;
                    postdata.correointerlocutor1 = null;
                    postdata.fonointerlocutor1 = null;
                    postdata.nombreinterlocutor2 = null;
                    postdata.correointerlocutor2 = null;
                    postdata.fonointerlocutor2 = null;
                    postdata.idtipo = null;
                    postdata.idgrupo = null;

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
                    $.get('/sic/getsession', function (data) {
                        $.each(data, function (i, item) {
                            if (item.glosarol === 'Negociador SIC') {
                                $("#d_idcui", form).hide();
                                $("#d_idtecnico", form).hide();
                                $("#d_tipocontrato", form).hide();
                                $("#d_codigoart", form).hide();
                                $("#d_sap", form).hide();
                                $("#d_descripcion", form).hide();
                                $("#d_idclasificacionsolicitud", form).hide();
                            } else if (item.glosarol === 'Técnico SIC') {
                                $("#d_codigosolicitud", form).hide();
                                $("#d_idclasificacionsolicitud", form).hide();
                                $("#d_idnegociador", form).hide();
                                $("#d_correonegociador", form).hide();
                                $("#d_direccionnegociador", form).hide();
                                $("#d_fononegociador", form).hide();
                                $("#d_numerorfp", form).hide();
                                $("#d_fechaenviorfp", form).hide();
                                $("#d_nombreinterlocutor1", form).hide();
                                $("#d_correointerlocutor1", form).hide();
                                $("#d_fonointerlocutor1", form).hide();
                                $("#d_nombreinterlocutor2", form).hide();
                                $("#d_correointerlocutor2", form).hide();
                                $("#d_fonointerlocutor2", form).hide();
                                $("#d_tipo", form).hide();
                                $("#d_grupo", form).hide();
                            }
                        });
                    });
                }, 100);
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

        }, {

        });

    function returnTecnico(cellValue, options, rowdata, action) {
        if (rowdata.tecnico != null)
            return rowdata.tecnico.first_name + ' ' + rowdata.tecnico.last_name;
        else
            return '';
    }

    function returnNegociador(cellValue, options, rowdata, action) {
        if (rowdata.negociador != null)
            return rowdata.negociador.first_name + ' ' + rowdata.negociador.last_name;
        else
            return '';
    }

    function showChildGrid(parentRowID, parentRowKey) {
        var tabs = "<ul class='nav nav-tabs tabs-up' id='myTab'>"
        tabs += "<li><a href='/sic/documentos/" + parentRowKey + "' data-target='#documentos' id='documentos_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Documentos</a></li>"
        tabs += "<li><a href='/sic/servicios/" + parentRowKey + "' data-target='#servicios' id='servicios_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Servicios</a></li>"
        tabs += "<li><a data-target='#foro' data-toggle='tab'>Foro</a></li>"
        tabs += "<li><a href='/sic/calendario/" + parentRowKey + "'data-target='#calendario' id='calendario_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Calendario</a></li>"
        tabs += "<li><a href='/sic/responsables/" + parentRowKey + "' data-target='#responsables' id='responsables_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Responsables</a></li>"
        tabs += "<li><a href='/sic/clausulas/" + parentRowKey + "' data-target='#clausulas' id='clausulas_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Cláusulas</a></li>"
        tabs += "<li><a data-target='#criterios' data-toggle='tab'>Criterios</a></li>"
        tabs += "<li><a data-target='#anexos' data-toggle='tab'>Anexos</a></li>"
        tabs += "<li><a href='/sic/preguntasrfp/" + parentRowKey + "' data-target='#preguntasrfp' id='preguntasrfp_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Preguntas Proveedor</a></li>"
        tabs += "<li><a data-target='#bitacora' data-toggle='tab'>Bitácora</a></li>"
        tabs += "</ul>"

        tabs += "<div class='tab-content'>"
        tabs += "<div class='tab-pane active' id='documentos'><div class='container-fluid'><table id='documentos_t_" + parentRowKey + "'></table><div id='navGrid'></div></div></div>"
        tabs += "<div class='tab-pane' id='servicios'><table id='servicios_t_" + parentRowKey + "'></table><div id='navGridServ'></div></div>"
        tabs += "<div class='tab-pane' id='foro'></div>"
        tabs += "<div class='tab-pane' id='calendario'><table id='calendario_t_" + parentRowKey + "'></table><div id='navGridCal'></div></div>"
        tabs += "<div class='tab-pane' id='responsables'><table id='responsables_t_" + parentRowKey + "'></table><div id='navGridResp'></div></div>"
        tabs += "<div class='tab-pane' id='clausulas'><div class='container-fluid'><table id='clausulas_t_" + parentRowKey + "'></table><div id='navGridClau'></div></div></div>"
        tabs += "<div class='tab-pane' id='criterios'></div>"
        tabs += "<div class='tab-pane' id='anexos'></div>"
        tabs += "<div class='tab-pane' id='preguntasrfp'><table id='preguntasrfp_t_" + parentRowKey + "'></table><div id='navGridPreg'></div></div>"
        tabs += "<div class='tab-pane' id='bitacora'></div>"
        tabs += "</div>"

        $("#" + parentRowID).append(tabs);
        $('#documentos_tab_' + parentRowKey).addClass('media_node active span')
        $('.active[data-toggle="tab_' + parentRowKey + '"]').each(function (e) {
            var $this = $(this),
                loadurl = $this.attr('href'),
                targ = $this.attr('data-target');

            if (targ === '#documentos') {
                gridDoc.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#servicios') {
                gridServ.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#clausulas') {
                gridClausula.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#responsables') {
                gridResponsables.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#calendario') {
                gridCalendario.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#preguntasrfp') {
                gridPreguntasrfp.renderGrid(loadurl, parentRowKey, targ)
            }

            $this.tab('show');
            return false;
        });

        $('[data-toggle="tab_' + parentRowKey + '"]').click(function (e) {
            var $this = $(this),
                loadurl = $this.attr('href'),
                targ = $this.attr('data-target');
            if (targ === '#documentos') {
                gridDoc.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#servicios') {
                gridServ.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#clausulas') {
                gridClausula.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#responsables') {
                gridResponsables.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#calendario') {
                gridCalendario.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#preguntasrfp') {
                gridPreguntasrfp.renderGrid(loadurl, parentRowKey, targ)
            }

            $this.tab('show');
            return false;
        });

    }
})