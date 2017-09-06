(function ($) {

    var populateSelect = function (data, caption, selectedId) {
        var s = '<select><option value="0">--' + caption + '--</option>';
        var selected;
        $.each(data, function (i, item) {
            selected = item.id == selectedId ? '" selected>' : '">';
            s += '<option value="' + item.id + selected + item.nombre + '</option>';
        });
        return s + '</select>';
    };

    $(function () {
        var t1;
        (function () {
            t1 = "<div id='responsive-form' class='clearfix'>";

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
            t1 += "<div class='column-half' id='d_idclasificacionsolicitud'>Clasificación<span style='color:red'>*</span>{idclasificacionsolicitud}</div>";
            t1 += "</div>";

            t1 += "<div class='form-row'>";
            t1 += "<div class='column-half' id='d_codigosolicitud'>Código solicitud{codigosolicitud}</div>";
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
            t1 += "<div class='column-threequarter' id='d_tipo'>Tipo<span style='color:red'>*</span>{idtipo}</div>";
            t1 += "<div class='column-quarter' id='d_grupo'>Grupo{idgrupo}</div>";
            t1 += "</div>";

            t1 += "<hr style='width:100%;'/>";
            t1 += "<div> {sData} {cData}  </div>";

            t1 += "</div>";
        })()

        var $grid = $('#gridMaster');

        var solicitudcotizacionModel = [{
                label: 'ID',
                name: 'id',
                key: true,
                hidden: true
            }, {
                label: 'Estado',
                name: 'colorestado',
                index: 'colorestado',
                width: 60,
                align: "left",
                editable: true,
                search: false,
                editoptions: {
                    size: 10
                },
                formatter: function (cellvalue, options, rowObject) {
                    var color = rowObject.colorestado;
                    if (color == 'Rojo') {
                        color = 'red';
                    } else if (color == 'Verde') {
                        color = 'green';
                    } else if (color == 'Amarillo') {
                        color = 'yellow';
                    } else if (color == 'Azul') {
                        color = 'blue';
                    } else if (color == 'indefinido') {
                        color = 'gray';
                    }
                    return '<span class="cellWithoutBackground" style="background-color:' + color + '; display:block; width: 50px; height: 16px;"></span>';
                }
            },{
                label: 'N° RFP',
                name: 'numerorfp',
                width: 60,
                hidden: false,
                search: false,
                editable: true,
                formatter: 'integer',
                editrules: {
                    required: true
                }
            },{
                label: 'CUI',
                name: 'idcui',
                width: 80,
                align: 'left',
                search: false,
                sortable: false,
                editable: true,
                hidden: true,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/allcuis',
                    buildSelect: function (response) {
                        var $grid = $('#grid');
                        var rowKey = $grid.getGridParam('selrow');
                        var rowData = $grid.getRowData(rowKey);
                        var thissid = rowData.idcui;
                        var data = JSON.parse(response);
                        return populateSelect(data,'Escoger CUI',thissid );
                    },
                    dataEvents: [{
                        type: 'change',
                        fn: function (e) {
                            var idcui = $('option:selected', this).val();
                            if (idcui != '0') {
                                $.ajax({
                                    type: 'GET',
                                    url: '/sic/tecnicosresponsablescui/' + idcui,
                                    async: false,
                                    success: function (data) {
                                        var grid = $('#grid');
                                        var rowKey = grid.getGridParam('selrow');
                                        var rowData = grid.getRowData(rowKey);
                                        var thissid = rowData.idtecnico;
                                        var s = '<select>'; //el default
                                        s += '<option value="0">--Escoger Técnico--</option>';
                                        $.each(data, function (i, item) {
                                            if (data[i].uid == thissid) {
                                                s += '<option value="' + data[i].uid + '" selected>' + data[i].nombre + ' ' + data[i].apellido + '</option>';
                                            } else {
                                                s += '<option value="' + data[i].uid + '">' + data[i].nombre + ' ' + data[i].apellido + '</option>';
                                            }
                                        });
                                        s += '</select>';
                                        $('select#idtecnico').empty().html(s);
                                    }
                                });
                            }

                        }
                    }],
                },
                dataInit: function (elem) {
                    $(elem).width(200);
                }
            },
            {
                label: 'CUI',
                name: 'cui',
                jsonmap: 'estructuracui.cui',
                width: 80,
                align: 'left',
                search: true,
                sortable: false,
                editable: true,
                hidden: false
            },
            {
                label: 'Técnico Responsable',
                name: 'idtecnico',
                search: false,
                editable: true,
                hidden: true,
                edittype: 'select',
                editoptions: {
                    value: '0:--Escoger Técnico--',
                    dataEvents: [{
                        type: 'change',
                        fn: function (e) {
                            $('input#tecnico').val($('option:selected', this).text());
                        }
                    }],
                }
            },
            {
                label: 'Técnico',
                name: 'first_name',
                width: 150,
                search: true,
                editable: false,
                formatter: returnTecnico,
                hidden: false
            },
            {
                label: 'T.Contrato',
                name: 'tipocontrato',
                search: false,
                editable: true,
                hidden: false,
                width: 100,
                edittype: 'custom',
                editoptions: {
                    custom_value: sipLibrary.getRadioElementValue,
                    custom_element: sipLibrary.radioElemContrato,
                    defaultValue: 'Continuidad',
                    dataEvents: [{
                        type: 'change',
                        fn: function (e) {
                            var actual = $('input#codigoart').attr('readonly');
                            if (actual == 'readonly') {
                                $('input#codigoart').attr('readonly', false);
                            } else {
                                $('input#codigoart').attr('readonly', true);
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
                label: 'Código Programa',
                name: 'program_id',
                width: 200,
                align: 'left',
                search: false,
                editable: false,
                hidden: true,
                editoptions: {
                    defaultValue: '0'
                }
            },
            {
                label: 'CódigoART',
                name: 'codigoart',
                width: 90,
                align: 'left',
                search: false,
                editable: true,
                hidden: false,
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
                            var rowKey = $grid.getGridParam('selrow');
                            var rowData = $grid.getRowData(rowKey);
                            var thissid = $(this).val();
                            $.ajax({
                                type: 'GET',
                                url: '/getcodigoart/' + thissid,
                                async: false,
                                success: function (data) {
                                    if (data.length > 0) {
                                        $('input#program_id').val(data[0].program_id);
                                    } else {
                                        alert('No existe el codigo art ingresado');
                                        $('input#program_id').val('0');
                                    }
                                }
                            });
                        }
                    }],
                }
            },
            {
                label: 'SAP',
                name: 'sap',
                width: 50,
                align: 'left',
                search: false,
                editable: true,
                hidden: false,
                editoptions: {
                    dataInit: function (element) {
                        $(element).mask('00000', {
                            placeholder: '_____'
                        });
                    }
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
                    rows: '2',
                    cols: '50'
                },
                editrules: {
                    required: true
                },
                edittype: 'textarea',
                hidden: false

            },

            {
                label: 'Código',
                name: 'codigosolicitud',
                width: 100,
                align: 'left',
                search: true,
                editable: true,
                editrules: {
                    required: false
                },
                hidden: false
            },
            {
                name: 'idclasificacionsolicitud',
                search: false,
                editable: true,
                hidden: true,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/sic/parametros/clasificacionsolicitud',
                    buildSelect: function (response) {
                        var rowKey = $grid.getGridParam('selrow');
                        var rowData = $grid.getRowData(rowKey);
                        var thissid = rowData.idclasificacionsolicitud;
                        var data = JSON.parse(response);
                        var s = '<select>';
                        s += '<option value="0">--Escoger una Clasificación--</option>';
                        $.each(data, function (i, item) {

                            if (data[i].id == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                            }
                        });
                        return s + '</select>';
                    }
                }
            },
            {
                label: 'Clasificación',
                name: 'clasificacion',
                jsonmap: 'clasificacion.nombre',
                width: 120,
                align: 'left',
                search: false,
                editable: true,
                hidden: false
            },
            {
                label: 'Criticidad',
                name: 'colornota',
                index: 'colornota',
                width: 80,
                align: 'left',
                editable: true,
                search: false,
                editoptions: {
                    size: 10
                },
                formatter: function (cellvalue, options, rowObject) {

                    var solicitud = rowObject.id;
                    var color = 'pink'

                    $.ajax({
                        type: 'GET',
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
                label: 'Negociador',
                name: 'idnegociador',
                search: false,
                editable: true,
                hidden: true,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/usuarios_por_rol/Negociador',
                    buildSelect: function (response) {
                        var rowKey = $grid.getGridParam('selrow');
                        var rowData = $grid.getRowData(rowKey);
                        var thissid = rowData.uidpmo;
                        var data = JSON.parse(response);
                        var s = '<select>';
                        s += '<option value="0">--Escoger Negociador--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].uid == thissid) {
                                s += '<option value="' + data[i].uid + '" selected>' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                            } else {
                                s += '<option value="' + data[i].uid + '">' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                            }
                        });
                        return s + '</select>';
                    },
                    dataEvents: [{
                        type: 'change',
                        fn: function (e) {
                            $('input#negociador').val($('option:selected', this).text());
                            var idnegociador = $('option:selected', this).val();

                            if (idnegociador != '0') {

                                $.ajax({
                                    type: 'GET',
                                    url: '/sic/traerdatos/' + idnegociador,
                                    async: false,
                                    success: function (data) {
                                        var grid = $('#grid');
                                        var rowKey = grid.getGridParam('selrow');
                                        var rowData = grid.getRowData(rowKey);
                                        var thissid = rowData.idnegociador;
                                        $('input#correonegociador').val(data[0].email);
                                        $('input#fononegociador').val(data[0].telefonoTrab);
                                        $('input#direccionnegociador').val('Estado 260, Entrepiso');
                                    }
                                });
                            }

                        }
                    }],
                }
            },
            {
                label: 'Negociador',
                name: 'negociador',
                width: 150,
                search: true,
                editable: false,
                formatter: returnNegociador,
                hidden: false
            },
            {
                label: 'C.Negociador',
                name: 'correonegociador',
                width: 130,
                hidden: true,
                search: false,
                editable: true
            },
            {
                label: 'F.Negociador',
                name: 'fononegociador',
                width: 100,
                hidden: true,
                search: false,
                editable: true
            },
            {
                label: 'D.Negociador',
                name: 'direccionnegociador',
                width: 150,
                hidden: true,
                search: false,
                editable: true
            },

            {
                label: 'Fecha RFP',
                name: 'fechaenviorfp',
                width: 150,
                align: 'left',
                search: false,
                formatter: 'date',
                formatoptions: {
                    srcformat: 'ISO8601Long',
                    newformat: 'd-m-Y'
                },
                editable: true,
                editrules: {
                    required: true
                },
                searchoptions: {
                    dataInit: function (el) {
                        $(el).datepicker({
                            language: 'es',
                            format: 'dd-mm-yyyy',
                            autoclose: true,
                            onSelect: function (dateText, inst) {
                                setTimeout(function () {
                                    $gridTab[0].triggerToolbar();
                                }, 100);
                            }
                        });
                    },
                    sopt: ['eq', 'le', 'ge']
                },
                editoptions: {
                    size: 10,
                    maxlengh: 10,
                    dataInit: function (element) {
                        $(element).mask('00-00-0000', {
                            placeholder: '__-__-____'
                        });
                        $(element).datepicker({
                            language: 'es',
                            format: 'dd-mm-yyyy',
                            autoclose: true
                        })
                    }
                },
            },

            {
                name: 'idtipo',
                search: false,
                editable: true,
                hidden: true,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/sic/tipos',
                    buildSelect: function (response) {
                        var rowKey = $grid.getGridParam('selrow');
                        var rowData = $grid.getRowData(rowKey);
                        var thissid = rowData.idtipo;
                        var data = JSON.parse(response);
                        var s = '<select>';
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
            },
            {
                label: 'Tipo',
                name: 'tipo',
                jsonmap: "tipoclausula.nombre",
                width: 100,
                align: 'left',
                search: false,
                editable: false,
                hidden: false
            },
            {
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
            },
            {
                label: 'Grupo',
                name: 'grupo',
                jsonmap: "grupo.nombre",
                width: 120,
                align: 'left',
                search: false,
                editable: false,
                hidden: false
            },
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
            sortname: 'numerorfp',
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
                        if (item.glosarol != 'Administrador SIC' && item.glosarol != 'Negociador SIC') {
                            $("#add_" + thisId).addClass('ui-disabled');
                            $("#edit_" + thisId).addClass('ui-disabled');
                            $("#del_" + thisId).addClass('ui-disabled');
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

                if (parseInt(postdata.idcui) == 0) {
                    return [false, "CUI: Debe escoger un valor", ""];
                } else if (parseInt(postdata.idtecnico) == 0) {
                    return [false, "Técnico: Debe escoger un valor", ""];
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
                setTimeout(function () {

                    if (tipocontrato == "Proyectos") {
                        $("input#codigoart").attr("readonly", false);
                    }

                    $("#idtipo", form).attr('disabled', 'disabled');
                    $("#idtipo", form).attr('disabled', 'disabled');
                    $("#idgrupo", form).attr('disabled', 'disabled');



                    $.ajax({
                        type: "GET",
                        url: '/sic/tecnicosresponsablescui/' + thisidcui,
                        success: function (data) {
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
            mtype: 'POST',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: t1,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {

                if (parseInt(postdata.idcui) == 0) {
                    return [false, "CUI: Debe escoger un valor", ""];
                } else if (parseInt(postdata.idtecnico) == 0) {
                    return [false, "Técnico: Debe escoger un valor", ""];
                } else if (parseInt(postdata.idnegociador) == 0) {
                    return [false, "Negociador: Debe escoger un valor", ""];
                } else if (parseInt(postdata.idgrupo) == 0) {
                    return [false, "Grupo: Debe escoger un valor", ""];
                } else if (parseInt(postdata.idclasificacionsolicitud) == 0) {
                    return [false, "Clasificación: Debe escoger un valor", ""];
                } else if (postdata.descripcion.trim().length == 0) {
                    return [false, "Descripción: Debe ingresar una descripción", ""];
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
                    $("#idtipo", form).attr('disabled', 'disabled');
                }, 500);
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
            tabs += "<li><a href='/sic/estadosolicitud/" + parentRowKey + "' data-target='#estadosolicitud' id='estadosolicitud_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Estado</a></li>"
            tabs += "<li><a href='/sic/responsables/" + parentRowKey + "' data-target='#responsables' id='responsables_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Responsables</a></li>"
            tabs += "<li><a href='/sic/calendario/" + parentRowKey + "'data-target='#calendario' id='calendario_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Calendario</a></li>"
            tabs += "<li><a href='/sic/documentos/" + parentRowKey + "' data-target='#documentos' id='documentos_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Documentos</a></li>"
            tabs += "<li><a href='/sic/servicios/" + parentRowKey + "' data-target='#servicios' id='servicios_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Servicios</a></li>"
            tabs += "<li><a href='/sic/foro/" + parentRowKey + "' data-target='#foro' id='foro_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Foro</a></li>"
            tabs += "<li><a href='/sic/clausulas/" + parentRowKey + "' data-target='#clausulas' id='clausulas_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Cláusulas</a></li>"
            tabs += "<li><a href='/sic/criterios/" + parentRowKey + "' data-target='#criterios' id='criterios_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Criterios</a></li>"
            tabs += "<li><a href='/sic/anexos/" + parentRowKey + "' data-target='#anexos' id='anexos_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Anexos</a></li>"
            tabs += "<li><a href='/sic/preguntasrfp/" + parentRowKey + "' data-target='#preguntasrfp' id='preguntasrfp_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Preguntas al Proveedor</a></li>"
            tabs += "<li><a href='/sic/bitacora/" + parentRowKey + "' data-target='#bitacora' id='bitacora_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Bitacora</a></li>"
            tabs += "<li><a href='/sic/triada/" + parentRowKey + "' data-target='#triada' id='triada_tab_" + parentRowKey + "' data-toggle='tab_" + parentRowKey + "'>Triada</a></li>"
            tabs += "</ul>"

            tabs += "<div class='tab-content'>"
            tabs += "<div class='tab-pane active' id='estadosolicitud'><div class='container-fluid'><table id='estadosolicitud_t_" + parentRowKey + "'></table><div id='navGridEst'></div></div></div>"
            tabs += "<div class='tab-pane' id='responsables'><table id='responsables_t_" + parentRowKey + "'></table><div id='navGridResp'></div></div>"
            tabs += "<div class='tab-pane' id='calendario'><table id='calendario_t_" + parentRowKey + "'></table><div id='navGridCal'></div></div>"
            tabs += "<div class='tab-pane' id='documentos'><table id='documentos_t_" + parentRowKey + "'></table><div id='navGrid'></div></div>"
            tabs += "<div class='tab-pane' id='servicios'><table id='servicios_t_" + parentRowKey + "'></table><div id='navGridServ'></div></div>"
            tabs += "<div class='tab-pane' id='foro'><table id='foro_t_" + parentRowKey + "'></table><div id='navGridForo'></div></div>"
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
                } else if (targ === '#foro') {
                    gridForo.renderGrid(loadurl, parentRowKey, targ)
                } else if (targ === '#clausulas') {
                    gridClausula.renderGrid(loadurl, parentRowKey, targ)
                } else if (targ === '#responsables') {
                    gridResponsables.renderGrid(loadurl, parentRowKey, targ)
                } else if (targ === '#calendario') {
                    gridCalendario.renderGrid(loadurl, parentRowKey, targ)
                } else if (targ === '#preguntasrfp') {
                    gridPreguntasrfp.renderGrid(loadurl, parentRowKey, targ)
                } else if (targ === '#anexos') {
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
                } else if (targ === '#foro') {
                    gridForo.renderGrid(loadurl, parentRowKey, targ)
                } else if (targ === '#clausulas') {
                    gridClausula.renderGrid(loadurl, parentRowKey, targ)
                } else if (targ === '#responsables') {
                    gridResponsables.renderGrid(loadurl, parentRowKey, targ)
                } else if (targ === '#calendario') {
                    gridCalendario.renderGrid(loadurl, parentRowKey, targ)
                } else if (targ === '#preguntasrfp') {
                    gridPreguntasrfp.renderGrid(loadurl, parentRowKey, targ)
                } else if (targ === '#anexos') {
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
    })
})(jQuery);