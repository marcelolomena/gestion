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
    t1 += "<div class='column-half' id='d_descripcion'>Descripción<span style='color:red'>*</span>{descripcion}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half' id='d_idclasificacionsolicitud'>Clasificación<span style='color:red'>*</span>{idclasificacionsolicitud}</div>";
    t1 += "<div class='column-half' id='d_idnegociador'>Negociador<span style='color:red'>*</span>{idnegociador}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half' id='d_correonegociador'>Correo Negociador<span style='color:red'>*</span>{correonegociador}</div>";
    t1 += "<div class='column-half' id='d_fononegociador'>Fono Negociador<span style='color:red'>*</span>{fononegociador}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-full' id='d_direccionnegociador'>Dirección Negociador<span style='color:red'>*</span>{direccionnegociador}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half' id='d_numerorfp'>Número RFP<span style='color:red'>*</span>{numerorfp}</div>";
    t1 += "<div class='column-half' id='d_fechaenviorfp'>Fecha RFP<span style='color:red'>*</span>{fechaenviorfp}</div>";
    t1 += "</div>";

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
    //t1 += "<div class='form-row' style='display: none;'>";
    //t1 += "<div class='column-half'>tecnico{tecnico}</div>";
    //t1 += "</div>";

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
                    var s = "<select>";//el default
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
        { label: 'Nombre CUI', name: 'nombrecui', jsonmap: "estructuracui.nombre", width: 250, align: 'left', search: false, sortable: false, editable: true },
        {
            label: 'Técnico', name: 'idtecnico', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/usuarios_por_rol/Negociador',
                buildSelect: function (response) {
                    //var grid = $("#gridMaster");
                    var rowKey = $grid.getGridParam("selrow");
                    var rowData = $grid.getRowData(rowKey);
                    var thissid = rowData.uidpmo;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
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
        { label: 'Técnico', name: 'tecnico', width: 150, search: false, editable: false, formatter: returnTecnico },
        {
            label: 'Tipo Contrato', name: 'tipocontrato', search: false, editable: true, hidden: false,
            edittype: "custom",
            editoptions: {
                custom_value: sipLibrary.getRadioElementValue,
                custom_element: sipLibrary.radioElemContrato,
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
            label: 'ID Art', name: 'program_id', width: 200, align: 'left', search: false, editable: false,
            hidden: true, editoptions: { defaultValue: "0" }
        },
        {
            label: 'Codigo ART', name: 'codigoart', width: 200, align: 'left', search: false, editable: true, hidden: true,
            editrules: { edithidden: false }, hidedlg: true, editoptions: {
                size: 10, readonly: 'readonly',
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        //var grid = $("#grid");
                        var rowKey = $grid.getGridParam("selrow");
                        var rowData = $grid.getRowData(rowKey);
                        console.log("rowData:" + rowData);
                        var thissid = $(this).val();
                        $.ajax({
                            type: "GET",
                            url: '/getcodigoart/' + thissid,
                            async: false,
                            success: function (data) {
                                if (data.length > 0) {
                                    console.log("glosa:" + data[0].nombreart);
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
        { label: 'SAP', name: 'sap', width: 200, align: 'left', search: false, editable: true },
        { label: 'Descripción', name: 'descripcion', width: 150, align: 'left', search: false, editable: true },
        { label: 'Código', name: 'codigosolicitud', width: 60, align: 'left', search: false, editable: true },
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
                    var s = "<select>";//el default
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
        { label: 'Clasificación', name: 'clasificacion', jsonmap: "valore.nombre", width: 150, align: 'left', search: false, editable: true },
        {
            label: 'Negociador', name: 'idnegociador', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/usuarios_por_rol/Negociador',
                buildSelect: function (response) {
                    //var grid = $("#gridMaster");
                    var rowKey = $grid.getGridParam("selrow");
                    var rowData = $grid.getRowData(rowKey);
                    var thissid = rowData.uidpmo;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
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
        { label: 'Negociador', name: 'negociador', width: 150, search: false, editable: false, formatter: returnNegociador },
        { label: 'Correo Negociador', name: 'correonegociador', width: 150, hidden: true, search: false, editable: true },
        { label: 'Fono Negociador', name: 'fononegociador', width: 150, hidden: true, search: false, editable: true },
        { label: 'Dirección Negociador', name: 'direccionnegociador', width: 150, hidden: true, search: false, editable: true },
        { label: 'Número RFP', name: 'numerorfp', width: 150, hidden: true, search: false, editable: true },
        {
            label: 'Fecha RFP', name: 'fechaenviorfp',
            width: 150, align: 'center', search: true, editable: true, hidden: true,
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
        { label: 'Interlocutor 1', name: 'nombreinterlocutor1', width: 150, search: false, hidden: true, editable: true },
        { label: 'Correo Interlocutor 1', name: 'correointerlocutor1', width: 150, search: false, hidden: true, editable: true },
        { label: 'Fono Interlocutor 1', name: 'fonointerlocutor1', width: 150, search: false, hidden: true, editable: true },
        { label: 'Interlocutor 2', name: 'nombreinterlocutor2', width: 150, search: false, hidden: true, editable: true },
        { label: 'Correo Interlocutor 2', name: 'correointerlocutor2', width: 150, search: false, hidden: true, editable: true },
        { label: 'Fono Interlocutor 2', name: 'fonointerlocutor2', width: 150, search: false, hidden: true, editable: true },
    ];

    $grid.jqGrid({
        url: '/sic/grid_solicitudcotizacion',
        datatype: "json",
        mtype: "GET",
        colModel: solicitudcotizacionModel,
        page: 1,
        rowNum: 20,
        regional: 'es',
        height: 'auto',
        //width: 600,
        //shrinkToFit: true,
        viewrecords: true,
        editurl: '/sic/grid_solicitudcotizacion',
        caption: 'Solicitud de Cotización',
        styleUI: "Bootstrap",
        onSelectRow: function (rowid, selected) {
            if (rowid != null) {
                console.log("rowid : " + rowid)
                var wsParams = { idcui: rowid }
                var rowData = $("#gridMaster").getRowData(rowid);
                var cui = rowData.cui;
                var gridDetailParam = { postData: wsParams };
                console.dir(gridDetailParam)
            }
        },
        pager: "#pagerMaster",
        subGrid: true,
        subGridRowExpanded: showChildGrid,
        loadComplete: function (data) {
            $.get('/sic/getsession', function (data) {
                $.each(data, function (i, item) {
                    console.log('EL SUPER ROL : ' + item.glosarol)
                    if (item.glosarol === 'Negociador SIC') {
                        $("#add_gridMaster").hide()
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
                    }
                });
            });
        }
    });

    //$grid.jqGrid('filterToolbar', { stringResult: true, searchOperators: false, searchOnEnter: false, defaultSearch: 'cn' });

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
                } if (parseInt(postdata.idtecnico) == 0) {
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
            }, beforeShowForm: function (form) {
                setTimeout(function () {
                    $.get('/sic/getsession', function (data) {
                        $.each(data, function (i, item) {
                            console.log('EL SUPER ROL : ' + item.glosarol)
                            if (item.glosarol === 'Negociador SIC') {
                                $("#idcui", form).attr("disabled", true);
                                $("#idtecnico", form).attr('readonly', 'readonly');
                                $("#tipocontrato", form).attr('readonly', 'readonly');
                                $("#codigoart", form).attr('readonly', 'readonly');
                                $("#sap", form).attr('readonly', 'readonly');
                                $("#descripcion", form).attr('readonly', 'readonly');
                                $("#idclasificacionsolicitud", form).attr('readonly', 'readonly');
                            } else if (item.glosarol === 'Técnico SIC') {
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
                } if (parseInt(postdata.idtecnico) == 0) {
                    return [false, "Técnico: Debe escoger un valor", ""];
                } else {

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
                            console.log('EL SUPER ROL : ' + item.glosarol)
                            if (item.glosarol === 'Negociador SIC') {
                                $("#d_idcui", form).hide();
                                $("#d_idtecnico", form).hide();
                                $("#d_tipocontrato", form).hide();
                                $("#d_codigoart", form).hide();
                                $("#d_sap", form).hide();
                                $("#d_descripcion", form).hide();
                                $("#d_idclasificacionsolicitud", form).hide();
                            } else if (item.glosarol === 'Técnico SIC') {
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
                            }
                        });
                    });
                }, 100);
            }
        }, {

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
        //console.log("parentRowID [" + parentRowID + "]")
        //console.log("parentRowKey [" + parentRowKey + "]")

        var tabs = "<ul class='nav nav-tabs tabs-up' id='myTab'>"
        tabs += "<li><a href='/sic/documentos/" + parentRowKey + "' data-target='#documentos' id='documentos_tab' class='media_node active span' data-toggle='tab'>Documentos</a></li>"
        tabs += "<li><a href='/sic/servicios/" + parentRowKey + "' data-target='#servicios' id='servicios_tab' data-toggle='tab'>Servicios</a></li>"
        tabs += "<li><a data-target='#foro' data-toggle='tab'>Foro</a></li>"
        tabs += "<li><a data-target='#calendario' data-toggle='tab'>Calendario</a></li>"
        tabs += "<li><a data-target='#responsables' data-toggle='tab'>Responsables</a></li>"
        tabs += "<li><a href='/sic/clausulas/" + parentRowKey + "' data-target='#clausulas' id='clausulas_tab' data-toggle='tab'>Cláusulas</a></li>"
        tabs += "<li><a data-target='#criterios' data-toggle='tab'>Criterios</a></li>"
        tabs += "<li><a data-target='#anexos' data-toggle='tab'>Anexos</a></li>"
        tabs += "<li><a data-target='#bitacora' data-toggle='tab'>Bitácora</a></li>"
        tabs += "</ul>"

        tabs += "<div class='tab-content'>"
        tabs += "<div class='tab-pane active' id='documentos'><table id='documentos_t'></table><div id='navGrid'></div></div>"
        tabs += "<div class='tab-pane' id='servicios'><table id='servicios_t'></table><div id='navGridServ'></div></div>"
        tabs += "<div class='tab-pane' id='foro'></div>"
        tabs += "<div class='tab-pane' id='calendario'></div>"
        tabs += "<div class='tab-pane' id='responsables'></div>"
        tabs += "<div class='tab-pane' id='clausulas'><table id='clausulas_t'></table><div id='navGridClau'></div>"
        tabs += "<div class='tab-pane' id='criterios'></div>"
        tabs += "<div class='tab-pane' id='anexos'></div>"
        tabs += "<div class='tab-pane' id='bitacora'></div>"
        tabs += "</div>"

        $("#" + parentRowID).append(tabs);

        $('.active[data-toggle="tab"]').each(function (e) {
            var $this = $(this),
                loadurl = $this.attr('href'),
                targ = $this.attr('data-target');

            if (targ === '#documentos') {
                gridDoc.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#servicios') {
                gridServ.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#clausulas') {
                gridClausula.renderGrid(loadurl, parentRowKey, targ)
            }

            $this.tab('show');
            return false;
        });

        $('[data-toggle="tab"]').click(function (e) {
            var $this = $(this),
                loadurl = $this.attr('href'),
                targ = $this.attr('data-target');

            if (targ === '#documentos') {
                gridDoc.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#servicios') {
                gridServ.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#clausulas') {
                gridClausula.renderGrid(loadurl, parentRowKey, targ)
            }

            $this.tab('show');
            return false;
        });

    }
})