$(document).ready(function () {

    $.ajax({
        url: '/sic/proveeAdjudicado',
        type: 'GET',
        async: false,
        success: function (j) {
            $('#provee').append('<option value="0"> - Escoger Proveedor - </option>');
            $.each(j, function (i, item) {
                $('#provee').append('<option value="' + item.idproveedor + '">' + item.razonsocial + '</option>');
            });
        },
        error: function (e) {

        }
    });

    provee = $('#provee').val();
    loadGrid(provee);

    $("#buscar").click(function () {
        provee = $('#provee').val();
        loadGrid(provee);
    });

});

var leida = false;
function loadGrid(provee) {
    var url = '/sic/grid_solicitudcotizacion';
    if (leida) {
        $("#gridMaster").setGridParam({ postData: { provee: provee, page: 1, rows: 10 } });
        $("#gridMaster").jqGrid('setCaption', "Solicitud de Cotización").jqGrid('setGridParam', { url: url, page: 1 }).jqGrid("setGridParam", { datatype: "json" }).trigger("reloadGrid");
    } else {
        showSolicitudCotizacion(provee);
    }
}

function showSolicitudCotizacion(provee) {

    var t1 = "<div id='responsive-form' class='clearfix'>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half' id='d_idcui'>CUI Responsable Proyecto<span style='color:red'>*</span>{idcui}</div>";
    t1 += "<div class='column-half' id='d_idtecnico'>Técnico Responsable<span style='color:red'>*</span>{idtecnico}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half' id='d_tipocontrato'>Tipo Contrato<span style='color:red'>*</span>{tipocontrato}</div>";
    t1 += "<div class='column-half' id='d_codigoart'>Codigo Art{codigoart}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half' id='d_sap'>SAP{sap}</div>";
    t1 += "<div class='column-half'>Descripción<span style='color:red'>*</span>{descripcion}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half' id='d_idnegociador'>Negociador<span style='color:red'>*</span>{idnegociador}</div>";
    t1 += "<div class='column-half' id='d_fechaenviorfp'>Fecha de Solicitud{fechaenviorfp}</div>";
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
    t1 += "<div class='column-half' id='d_tipo'>Tipo<span style='color:red'>*</span>{idtipo}</div>";
    t1 += "<div class='column-half' id='d_grupo'>Grupo<span style='color:red'>*</span>{idgrupo}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half' id='d_estado'>Estado<span style='color:red'>*</span>{idestado}</div>";
    t1 += "<div class='column-half' id='d_idadministracion'>Ejecutivo Administración{idadministracion}</div>";
    t1 += "</div>";

    t1 += "<hr style='width:100%;'/>";
    t1 += "<div> {sData} {cData}  </div>";

    t1 += "</div>";

    var $grid = $("#gridMaster"),
        solicitudcotizacionModel = [{
            label: 'ID',
            name: 'id',
            key: true,
            hidden: true
        },
        {
            label: 'Estado',
            name: 'idestado',
            jsonmap: "estado.nombre",
            width: 80,
            align: 'center',
            search: false,
            editable: false,
            hidden: false
        },
        {
            label: 'Código Solicitud',
            name: 'codigosolicitud',
            width: 125,
            align: 'center',
            search: true,
            editable: true,
            editrules: {
                required: true
            },
            editoptions: {
                placeholder: "AAA-AA-000 o AAA-AA-000.0"
            },
            hidden: false
        },
        {
            label: 'Tipo',
            name: 'idtipo',
            jsonmap: "tipoclausula.nombre",
            width: 60,
            align: 'center',
            search: false,
            editable: false,
            hidden: false
        }, {
            label: '.',
            width: 40,
            hidden: false,
            search: false,
            editable: true,
            sortable: false,
            align: 'center',
            formatter: function (cellvalue, options, rowObject) {
                var rojo = '<span><img src="../../../../images/redcircle.png" width="19px"/></span>';
                var amarillo = '<span><img src="../../../../images/yellowcircle.png" width="19px"/></span>';
                var verde = '<span><img src="../../../../images/greencircle.png" width="19px"/></span>';
                var gris = '<span><img src="../../../../images/greycircle.png" width="19px"/></span>';
                if (rowObject.colorestado === 'aGris') {
                    return gris;
                } else {
                    if (rowObject.colorestado === 'Vencida') {
                        return rojo;
                    } else {
                        if (rowObject.colorestado === 'Renovar') {
                            return amarillo;
                        } else {
                            if (rowObject.colorestado === 'bAl Dia')


                                return verde;
                        }
                    }
                }
            }
        }, {
            label: 'Etapa',
            name: 'idclasificacionsolicitud',
            jsonmap: "clasificacion.nombre",
            width: 120,
            align: 'center',
            search: false,
            editable: true,
            hidden: false
        }, {
            label: 'Grupo',
            name: 'idgrupo',
            jsonmap: "grupo.nombre",
            width: 120,
            align: 'center',
            search: false,
            editable: false,
            hidden: false
        },
        {
            label: 'Fecha Solicitud',
            name: 'fechaenviorfp',
            width: 120,
            align: 'center',
            search: true,
            editable: true,
            hidden: false,
            formatter: 'date',
            formatoptions: {
                srcformat: 'ISO8601Long',
                newformat: 'Y-m-d'
            },
            searchoptions: {
                dataInit: function (el) {
                    $(el).datepicker({
                        language: 'es',
                        format: 'yyyy-mm-dd',
                        autoclose: true,
                        onSelect: function (dateText, inst) {
                            setTimeout(function () {
                                $('#' + subgrid_table_id)[0].triggerToolbar();
                            }, 100);
                        }
                    });
                },
                sopt: ["eq", "le", "ge"]
            },
            editoptions: {
                size: 10,
                maxlengh: 10,
                dataInit: function (element) {
                    $(element).mask("0000-00-00", {
                        placeholder: "____-__-__"
                    });
                    $(element).datepicker({
                        language: 'es',
                        format: 'yyyy-mm-dd',
                        autoclose: true
                    })
                }
            }
        },
        {
            label: 'CUI',
            name: 'idcui',
            width: 80,
            align: 'left',
            search: false,
            sortable: false,
            editable: true,
            hidden: true,
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
                },
                dataEvents: [{
                    type: 'change',
                    fn: function (e) {
                        //$("input#lider").val($('option:selected', this).val());
                        var idcui = $('option:selected', this).val();
                        //console.log(idcui);

                        if (idcui != "0") {

                            $.ajax({
                                type: "GET",
                                url: '/sic/tecnicosresponsablescui/' + idcui,
                                async: false,
                                success: function (data) {
                                    var grid = $("#grid");
                                    var rowKey = grid.getGridParam("selrow");
                                    var rowData = grid.getRowData(rowKey);
                                    var thissid = rowData.idtecnico;
                                    var s = "<select>"; //el default
                                    s += '<option value="0">--Escoger Técnico--</option>';
                                    $.each(data, function (i, item) {
                                        if (data[i].uid == thissid) {
                                            s += '<option value="' + data[i].uid + '" selected>' + data[i].nombre + ' ' + data[i].apellido + '</option>';
                                        } else {
                                            s += '<option value="' + data[i].uid + '">' + data[i].nombre + ' ' + data[i].apellido + '</option>';
                                        }
                                    });
                                    s += "</select>";
                                    //lahora = new Date();
                                    //console.log('Termina el for a las ' + lahora.getHours() + ":" + lahora.getMinutes() + ":" + lahora.getSeconds());
                                    $("select#idtecnico").empty().html(s);
                                    //lahora = new Date();
                                    //console.log('Seteo el html a las ' + lahora.getHours() + ":" + lahora.getMinutes() + ":" + lahora.getSeconds());
                                }
                            });
                        }

                    }
                }],
            },
            dataInit: function (elem) {
                $(elem).width(200);
            }
        }, {
            label: 'CUI',
            name: 'idcui',
            jsonmap: "estructuracui.cui",
            width: 90,
            align: 'center',
            search: true,
            sortable: true,
            editable: true,
            hidden: false
        }, {
            label: 'SAP',
            name: 'sap',
            width: 90,
            align: 'center',
            search: false,
            sortable: false,
            editable: true,
            hidden: false,
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("00000", {
                        placeholder: "_____"
                    });
                }
            }
        }, {
            label: 'Código ART',
            name: 'codigoart',
            width: 90,
            align: 'center',
            search: false,
            editable: true,
            hidden: false,
            sortable: false,
            editrules: {
                edithidden: false
            },
            hidedlg: true,
            editoptions: {
                size: 10,
                readonly: 'readonly',
                dataEvents: [{
                    type: 'change',
                    fn: function (e) {
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
        }, {
            label: 'Técnico Responsable',
            name: 'idtecnico',
            search: false,
            editable: true,
            hidden: true,
            edittype: "select",
            editoptions: {
                value: "0:--Escoger Técnico--",
                dataEvents: [{
                    type: 'change',
                    fn: function (e) {
                        $("input#tecnico").val($('option:selected', this).text());
                    }
                }],
            }
        }, {
            label: 'Técnico Responsable',
            name: 'idtecnico',
            width: 180,
            search: true,
            align: 'center',
            editable: false,
            formatter: returnTecnico,
            hidden: false
        }, {
            label: 'Tipo de Contrato',
            name: 'tipocontrato',
            search: false,
            editable: true,
            hidden: false,
            align: 'center',
            width: 130,
            edittype: "custom",
            editoptions: {
                custom_value: sipLibrary.getRadioElementValue,
                custom_element: sipLibrary.radioElemContrato,
                defaultValue: "Continuidad",
                dataEvents: [{
                    type: 'change',
                    fn: function (e) {
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
        }, {
            label: 'Código Programa',
            name: 'program_id',
            width: 200,
            align: 'left',
            search: false,
            editable: false,
            hidden: true,
            editoptions: {
                defaultValue: "0"
            }
        },

        {
            label: 'Descripción',
            name: 'descripcion',
            width: 250,
            align: 'left',
            search: true,
            editable: true,
            editoptions: {
                rows: "2",
                cols: "50"
            },
            editrules: {
                required: true
            },
            edittype: "textarea",
            hidden: false

        },
        {
            label: 'Criticidad',
            name: 'colornota',
            index: 'colornota',
            width: 80,
            align: "left",
            sortable: false,
            editable: true,
            search: false,
            editoptions: {
                size: 10
            },
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
        }, {
            label: 'Negociador',
            name: 'idnegociador',
            search: false,
            editable: true,
            hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/usuarios_por_rol/Negociador',
                buildSelect: function (response) {
                    var rowKey = $grid.getGridParam("selrow");
                    var rowData = $grid.getRowData(rowKey);
                    var thissid = rowData.idnegociador;
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
                    type: 'change',
                    fn: function (e) {
                        $("input#negociador").val($('option:selected', this).text());
                        var idnegociador = $('option:selected', this).val();

                        if (idnegociador != "0") {

                            $.ajax({
                                type: "GET",
                                url: '/sic/traerdatos/' + idnegociador,
                                async: false,
                                success: function (data) {
                                    var grid = $("#grid");
                                    var rowKey = grid.getGridParam("selrow");
                                    var rowData = grid.getRowData(rowKey);
                                    var thissid = rowData.idnegociador;
                                    $("input#correonegociador").val(data[0].email);
                                    $("input#fononegociador").val(data[0].telefonoTrab);
                                    $("input#direccionnegociador").val('Estado 260, Entrepiso');
                                }
                            });
                        }

                    }
                }],
            }
        }, {
            label: 'Negociador',
            name: 'idnegociador',
            width: 150,
            search: true,
            editable: false,
            formatter: returnNegociador,
            hidden: false
        }, {
            label: 'C.Negociador',
            name: 'correonegociador',
            width: 130,
            hidden: true,
            search: false,
            editable: true
        }, {
            label: 'F.Negociador',
            name: 'fononegociador',
            width: 100,
            hidden: true,
            search: false,
            editable: true
        }, {
            label: 'D.Negociador',
            name: 'direccionnegociador',
            width: 150,
            hidden: true,
            search: false,
            editable: true
        }, {
            name: 'idtipo',
            search: false,
            editable: true,
            hidden: true,
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

                        if (data[i].id == 3) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }
        }, {
            name: 'idgrupo',
            search: false,
            editable: true,
            hidden: true,
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
        }, {
            name: 'idestado',
            search: false,
            editable: true,
            hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/sic/valores/etapa',
                buildSelect: function (response) {
                    var rowKey = $grid.getGridParam("selrow");
                    var rowData = $grid.getRowData(rowKey);
                    var thissid = rowData.idestado;
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger Estado--</option>';
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
        }, {
            label: 'Administración',
            name: 'idadministracion',
            search: false,
            editable: true,
            hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/sic/getUsuariosAdmin',
                buildSelect: function (response) {
                    var rowKey = $grid.getGridParam("selrow");
                    var rowData = $grid.getRowData(rowKey);
                    var thissid = rowData.idadministracion;
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger Ejecutivo Administración--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].uid == thissid) {
                            s += '<option value="' + data[i].uid + '" selected>' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        } else {
                            s += '<option value="' + data[i].uid + '">' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }
        },
        {

            label: 'Administración',
            name: 'idadministracion',
            width: 150,
            search: true,
            editable: false,
            formatter: returnAdministracion,
            hidden: false

        },
        {
            label: 'Fecha Asignación Administración',
            name: 'fechaasignacionadmin',
            width: 120,
            align: 'center',
            search: true,
            editable: false,
            hidden: false,
            formatter: 'date',
            formatoptions: {
                srcformat: 'ISO8601Long',
                newformat: 'Y-m-d'
            },
            searchoptions: {
                dataInit: function (el) {
                    $(el).datepicker({
                        language: 'es',
                        format: 'yyyy-mm-dd',
                        autoclose: true,
                        onSelect: function (dateText, inst) {
                            setTimeout(function () {
                                $('#' + subgrid_table_id)[0].triggerToolbar();
                            }, 100);
                        }
                    });
                },
                sopt: ["eq", "le", "ge"]
            },
            editoptions: {
                size: 10,
                maxlengh: 10,
                dataInit: function (element) {
                    $(element).mask("0000-00-00", {
                        placeholder: "____-__-__"
                    });
                    $(element).datepicker({
                        language: 'es',
                        format: 'yyyy-mm-dd',
                        autoclose: true
                    })
                }
            }
        }
        ];
    $grid.jqGrid({
        url: '/sic/grid_solicitudcotizacion',
        datatype: "json",
        mtype: "GET",
        postData: {
            prove: function () {
                return provee;
            }
        },
        colModel: solicitudcotizacionModel,
        page: 1,
        rowNum: 20,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        sortname: 'colorestado',
        sortorder: "desc",
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
                    console.log("EL ROL ES: " + item.glosarol)
                    if (item.glosarol != 'Administrador SIC' && item.glosarol != 'Negociador SIC' && item.glosarol != 'Encargado Administracion SIC') {
                        $("#add_" + thisId).addClass('ui-disabled');
                        //$("#add_gridMaster").hide();
                        $("#edit_" + thisId).addClass('ui-disabled');
                        //$("#edit__gridMaster").hide();
                        $("#del_" + thisId).addClass('ui-disabled');
                        //$("#del__gridMaster").hide();
                    }
                });
            });
        }
    });

    $grid.jqGrid('filterToolbar', {
        stringResult: true,
        searchOperators: true,
        searchOnEnter: false,
        defaultSearch: 'cn'
    });

    $grid.jqGrid('navGrid', '#pagerMaster', {
        edit: true,
        add: true,
        del: true,
        search: false
    }, {
            editCaption: "Modifica Solicitud",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: t1,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                const regex = /[A-Z]{3}-[A-Z]{2}-([0-9]{2,})(.?)[0-9]{1}$/;
                if (parseInt(postdata.idcui) == 0) {
                    return [false, "CUI: Debe escoger un valor", ""];
                } else if (parseInt(postdata.idtecnico) == 0) {
                    return [false, "Técnico: Debe escoger un valor", ""];
                } else if (parseInt(postdata.idestado) == 0) {
                    return [false, "Estado: Debe escoger un estado", ""];
                } else if (postdata.codigosolicitud.trim().length == 0) {
                    return [false, "Código de Solicitud: Debe agregar un valor", ""];
                } else if (!regex.test(postdata.codigosolicitud)) {
                    return [false, "Código de Solicitud: Debe Ingresar valores de este tipo AAA-AA-000 o AAA-AA-000.0", ""];
                } else {
                    return [true, "", ""]
                }

            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error != 0) {
                    return [false, result.glosa, ""];
                } else {
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"nombre\",\"op\":\"cn\",\"data\":\"" + postdata.nombre + "\"}]}";
                    $grid.jqGrid('setGridParam', {
                        search: true,
                        postData: {
                            filters
                        }
                    }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            },
            beforeShowForm: function (form) {
                var grid = $("#grid");
                var rowKey = $grid.getGridParam("selrow");
                var rowData = $grid.getRowData(rowKey);
                var tipocontrato = rowData.tipocontrato;
                var thisidcui = rowData.idcui;
                var thisidtecnico = rowData.idtecnico;
                //console.log(tipocontrato)
                setTimeout(function () {

                    if (tipocontrato == "Proyectos") {
                        $("input#codigoart").attr("readonly", false);
                    }

                    // $("#idtipo", form).attr('disabled', 'disabled');
                    /*
                    $.get('/sic/getsession', function (data) {
                        $.each(data, function (i, item) {
                            if (item.glosarol === 'Encargado Administracion SIC' && item.glosarol === 'Encargado Administracion SIC') {
                                //$("#idcui", form).attr("disabled", true);
                                $("#idtecnico", form).attr('readonly', 'readonly');
                                
                            } else if (item.glosarol === 'Técnico SIC') {
                                $("#codigosolicitud", form).attr('readonly', 'readonly');
                                
                            }
                        });
                    });*/
                    // $("#idtipo", form).attr('disabled', 'disabled');
                    $("#idgrupo", form).attr('disabled', 'disabled');



                    $.ajax({
                        type: "GET",
                        url: '/sic/tecnicosresponsablescui/' + thisidcui,
                        success: function (data) {
                            //console.log(thisidtecnico)
                            var s = "<select>"; //el default
                            s += '<option value="0">--Escoger Técnico--</option>';
                            $.each(data, function (i, item) {
                                if (data[i].uid == thisidtecnico) {
                                    s += '<option value="' + data[i].uid + '" selected>' + data[i].nombre + ' ' + data[i].apellido + '</option>';
                                } else {
                                    s += '<option value="' + data[i].uid + '">' + data[i].nombre + ' ' + data[i].apellido + '</option>';
                                }
                            });
                            s += "</select>";
                            $("select#idtecnico").html(s);
                        }
                    });

                }, 550);
            }

        }, {
            addCaption: "Agrega Solicitud",
            closeAfterAdd: true,
            recreateForm: true,
            // mtype: 'POST',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: t1,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                const regex = /[A-Z]{3}-[A-Z]{2}-([0-9]{2,})(.?)[0-9]{1}$/;
                if (parseInt(postdata.idcui) == 0) {
                    return [false, "CUI: Debe escoger un valor", ""];
                } else if (parseInt(postdata.idtecnico) == 0) {
                    return [false, "Técnico: Debe escoger un valor", ""];
                } else if (postdata.descripcion.trim().length == 0) {
                    return [false, "Descripción: Debe ingresar una descripción", ""];
                } else if (parseInt(postdata.idnegociador) == 0) {
                    return [false, "Negociador: Debe escoger un valor", ""];
                } else if (postdata.codigosolicitud.trim().length == 0) {
                    return [false, "Código de Solicitud: Debe agregar un valor", ""];
                } else if (!regex.test(postdata.codigosolicitud)) {
                    return [false, "Código de Solicitud: Debe Ingresar valores de este tipo AAA-AA-000 o AAA-AA-000.0", ""];
                } else if (parseInt(postdata.idtipo) == 0) {
                    return [false, "Tipo: Debe escoger un valor", ""];
                } else if (parseInt(postdata.idestado) == 0) {
                    return [false, "Estado: Debe escoger una estado", ""];
                } else if (parseInt(postdata.idgrupo) == 0) {
                    return [false, "Grupo: Debe escoger un valor", ""];
                } else {
                    return [true, "", ""]
                }

            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error != 0) {
                    return [false, result.glosa, ""];
                } else {
                    //console.log(postdata)
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"descripcion\",\"op\":\"cn\",\"data\":\"" + postdata.descripcion + "\"}]}";
                    $grid.jqGrid('setGridParam', {
                        search: true,
                        postData: {
                            filters
                        }
                    }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            },
            beforeShowForm: function (form) {
                setTimeout(function () {

                    /*
                    $.get('/sic/getsession', function (data) {
                        $.each(data, function (i, item) {
                            if (item.glosarol === 'Negociador SIC') {
                                //$("#d_idcui", form).hide();
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
                                $("#d_tipo", form).hide();
                                $("#d_grupo", form).hide();
                            }
                        });
                    });
                    */
                    // $("#idtipo", form).attr('disabled', 'disabled');
                    //$("#idgrupo", form).attr('disabled', 'disabled');
                }, 500);
            }
        }, {
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            // mtype: 'POST',
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

    function returnAdministracion(cellValue, options, rowdata, action) {
        if (rowdata.administrador != null)
            return rowdata.administrador.first_name + ' ' + rowdata.administrador.last_name;
        else
            return '';
    }

    function showChildGrid(parentRowID, parentRowKey) {
        var tabs = "<ul class='nav nav-tabs tabs-up' id='myTab'>"
        tabs += "<li><a href='/sic/estadosolicitud/" + parentRowKey + "' data-target='#estadosolicitud' id='estadosolicitud_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Etapa</a></li>"
        // tabs += "<li><a href='/sic/responsables/" + parentRowKey + "' data-target='#responsables' id='responsables_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Responsables</a></li>"
        tabs += "<li><a href='/sic/calendario/" + parentRowKey + "'data-target='#calendario' id='calendario_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Calendario</a></li>"
        tabs += "<li><a href='/sic/documentos/" + parentRowKey + "' data-target='#documentos' id='documentos_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Documentos</a></li>"
        tabs += "<li><a href='/sic/servicios/" + parentRowKey + "' data-target='#servicios' id='servicios_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Servicios</a></li>"
        // tabs += "<li><a href='/sic/foro/" + parentRowKey + "' data-target='#foro' id='foro_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Foro</a></li>"
        tabs += "<li><a href='/sic/clausulas/" + parentRowKey + "' data-target='#clausulas' id='clausulas_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Cláusulas</a></li>"
        tabs += "<li><a href='/sic/criterios/" + parentRowKey + "' data-target='#criterios' id='criterios_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Criterios</a></li>"
        tabs += "<li><a href='/sic/anexos/" + parentRowKey + "' data-target='#anexos' id='anexos_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Anexos</a></li>"
        tabs += "<li><a href='/sic/preguntasrfp/" + parentRowKey + "' data-target='#preguntasrfp' id='preguntasrfp_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Preguntas al Proveedor</a></li>"
        tabs += "<li><a href='/sic/bitacora/" + parentRowKey + "' data-target='#bitacora' id='bitacora_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Bitacora</a></li>"
        tabs += "<li><a href='/sic/triada/" + parentRowKey + "' data-target='#triada' id='triada_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Triada</a></li>"
        tabs += "</ul>"

        tabs += "<div class='tab-content'>"
        tabs += "<div class='tab-pane active' id='estadosolicitud'><div class='container-fluid'><table id='estadosolicitud_t_" + parentRowKey + "'></table><div id='navGridEst'></div></div></div>"
        // tabs += "<div class='tab-pane' id='responsables'><table id='responsables_t_" + parentRowKey + "'></table><div id='navGridResp'></div></div>"
        tabs += "<div class='tab-pane' id='calendario'><table id='calendario_t_" + parentRowKey + "'></table><div id='navGridCal'></div></div>"
        tabs += "<div class='tab-pane' id='documentos'><table id='documentos_t_" + parentRowKey + "'></table><div id='navGrid'></div></div>"
        tabs += "<div class='tab-pane' id='servicios'><table id='servicios_t_" + parentRowKey + "'></table><div id='navGridServ'></div></div>"
        // tabs += "<div class='tab-pane' id='foro'><table id='foro_t_" + parentRowKey + "'></table><div id='navGridForo'></div></div>"
        tabs += "<div class='tab-pane' id='clausulas'><div class='container-fluid'><table id='clausulas_t_" + parentRowKey + "'></table><div id='navGridClau'></div></div></div>"
        tabs += "<div class='tab-pane' id='criterios'><table id='criterios_t_" + parentRowKey + "'></table><div id='navGridCrit'></div></div>"
        tabs += "<div class='tab-pane' id='anexos'><div class='container-fluid'><table id='anexos_t_" + parentRowKey + "'></table><div id='navGridAnexos'></div></div></div>"
        tabs += "<div class='tab-pane' id='preguntasrfp'><table id='preguntasrfp_t_" + parentRowKey + "'></table><div id='navGridPreg'></div></div>"
        tabs += "<div class='tab-pane' id='bitacora'><table id='bitacora_t_" + parentRowKey + "'></table><div id='navGridBita'></div></div>"
        tabs += "<div class='tab-pane' id='triada'><table id='triada_t_" + parentRowKey + "'></table><div id='navGridTriada'></div></div>"
        tabs += "</div>"

        $("#" + parentRowID).append(tabs);
        $('#estadosolicitud_tab_' + parentRowKey).addClass('media_node active span')
        $('.active[data-toggle="tab_' + parentRowKey + '"]').each(function (e) {
            var $this = $(this),
                loadurl = $this.attr('href'),
                targ = $this.attr('data-target');
            if (targ === '#estadosolicitud') {
                gridEstado.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#documentos') {
                gridDoc.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#servicios') {
                gridServ.renderGrid(loadurl, parentRowKey, targ)
                // } else 
                // if (targ === '#foro') {
                //     gridForo.renderGrid(loadurl, parentRowKey, targ)
            } else
                if (targ === '#clausulas') {
                    gridClausula.renderGrid(loadurl, parentRowKey, targ)
                } else if (targ === '#responsables') {
                    gridResponsables.renderGrid(loadurl, parentRowKey, targ)
                } else if (targ === '#calendario') {
                    gridCalendario.renderGrid(loadurl, parentRowKey, targ)
                    // } else 
                    // if (targ === '#preguntasrfp') {
                    //     gridPreguntasrfp.renderGrid(loadurl, parentRowKey, targ)
                } else
                    if (targ === '#anexos') {
                        gridAnexos.renderGrid(loadurl, parentRowKey, targ)
                    } else if (targ === '#criterios') {
                        gridCriterios.renderGrid(loadurl, parentRowKey, targ)
                    } else if (targ === '#bitacora') {
                        gridBitacora.renderGrid(loadurl, parentRowKey, targ)
                    } else if (targ === '#triada') {
                        gridTriada.renderGrid(loadurl, parentRowKey, targ)
                    }

            $this.tab('show');
            return false;
        });

        $('[data-toggle="tab_' + parentRowKey + '"]').click(function (e) {
            var $this = $(this),
                loadurl = $this.attr('href'),
                targ = $this.attr('data-target');
            if (targ === '#estadosolicitud') {
                gridEstado.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#documentos') {
                gridDoc.renderGrid(loadurl, parentRowKey, targ)
            } else if (targ === '#servicios') {
                gridServ.renderGrid(loadurl, parentRowKey, targ)
            } else
                // if (targ === '#foro') {
                //     gridForo.renderGrid(loadurl, parentRowKey, targ)
                // } else 
                if (targ === '#clausulas') {
                    gridClausula.renderGrid(loadurl, parentRowKey, targ)
                } else if (targ === '#responsables') {
                    gridResponsables.renderGrid(loadurl, parentRowKey, targ)
                } else if (targ === '#calendario') {
                    gridCalendario.renderGrid(loadurl, parentRowKey, targ)
                } else
                    // if (targ === '#preguntasrfp') {
                    //     gridPreguntasrfp.renderGrid(loadurl, parentRowKey, targ)
                    // } else 
                    if (targ === '#anexos') {
                        gridAnexos.renderGrid(loadurl, parentRowKey, targ)
                    } else if (targ === '#criterios') {
                        gridCriterios.renderGrid(loadurl, parentRowKey, targ)
                    } else if (targ === '#bitacora') {
                        gridBitacora.renderGrid(loadurl, parentRowKey, targ)
                    } else if (targ === '#triada') {
                        gridTriada.renderGrid(loadurl, parentRowKey, targ)
                    }

            $this.tab('show');
            return false;
        });
    }
    leida = true;
}