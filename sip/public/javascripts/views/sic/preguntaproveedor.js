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
            label: 'Tipo Contrato', name: 'tipocontrato', search: false, editable: true, hidden: false,
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
            label: 'Código ART', name: 'codigoart', width: 100, align: 'left', search: false, editable: true, hidden: false,
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
        { label: 'Clasificación', name: 'clasificacion', jsonmap: "clasificacion.nombre", width: 150, align: 'left', search: false, editable: true, hidden: false },
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
        { label: 'Correo Negociador', name: 'correonegociador', width: 150, hidden: false, search: false, editable: true },
        { label: 'Fono Negociador', name: 'fononegociador', width: 150, hidden: false, search: false, editable: true },
        { label: 'Dirección Negociador', name: 'direccionnegociador', width: 150, hidden: false, search: false, editable: true },
        { label: 'Número RFP', name: 'numerorfp', width: 150, hidden: false, search: false, editable: true },
        {
            label: 'Fecha RFP', name: 'fechaenviorfp',
            width: 150, align: 'center', search: true, editable: true, hidden: false,
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
        { label: 'Interlocutor 1', name: 'nombreinterlocutor1', width: 150, search: false, hidden: false, editable: true },
        { label: 'Correo Interlocutor 1', name: 'correointerlocutor1', width: 150, search: false, hidden: false, editable: true },
        { label: 'Fono Interlocutor 1', name: 'fonointerlocutor1', width: 150, search: false, hidden: false, editable: true },
        { label: 'Interlocutor 2', name: 'nombreinterlocutor2', width: 150, search: false, hidden: false, editable: true },
        { label: 'Correo Interlocutor 2', name: 'correointerlocutor2', width: 150, search: false, hidden: false, editable: true },
        { label: 'Fono Interlocutor 2', name: 'fonointerlocutor2', width: 150, search: false, hidden: false, editable: true },
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
        { label: 'Tipo', name: 'tipo', jsonmap: "tipoclausula.nombre", width: 150, align: 'left', search: false, editable: false, hidden: false },
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
        { label: 'Grupo', name: 'grupo', jsonmap: "grupo.nombre", width: 150, align: 'left', search: false, editable: false, hidden: false },
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
                    }
                });
            });
        }
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
        tabs += "<li><a href='/sic/proveedores/" + parentRowKey + "' data-target='#proveedores' id='proveedores_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Proveedores</a></li>"
        tabs += "<li><a href='/sic/preguntas/" + parentRowKey + "' data-target='#preguntas' id='preguntas_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Preguntas</a></li>"
        tabs += "</ul>"

        tabs += "<div class='tab-content'>"
        tabs += "<div class='tab-pane active' id='proveedores'><div class='container-fluid'><table id='proveedores_t_" + parentRowKey + "'></table><div id='navGridPro'></div></div></div>"
        tabs += "<div class='tab-pane' id='preguntas'><table id='preguntas_t_" + parentRowKey + "'></table><div id='navGridPre'></div></div>"
        tabs += "</div>"

        $("#" + parentRowID).append(tabs);
        $('#proveedores_tab_' + parentRowKey).addClass('media_node active span')
        $('.active[data-toggle="tab_' + parentRowKey + '"]').each(function (e) {
            var $this = $(this),
                loadurl = $this.attr('href'),
                targ = $this.attr('data-target');

            if (targ === '#proveedores') {
                gridProveedor.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#preguntas') {
                gridPreguntas.renderGrid(loadurl, parentRowKey, targ)
            } 

            $this.tab('show');
            return false;
        });

        $('[data-toggle="tab_' + parentRowKey + '"]').click(function (e) {
            var $this = $(this),
                loadurl = $this.attr('href'),
                targ = $this.attr('data-target');
            if (targ === '#proveedores') {
                gridProveedor.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#preguntas') {
                gridPreguntas.renderGrid(loadurl, parentRowKey, targ)
            } 

            $this.tab('show');
            return false;
        });

    }
})