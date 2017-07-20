//doc.js
var gridServ = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        //var $gridTab = $(targ + "_t")
        var $gridTab = $(targ + "_t_" + parentRowKey)

        var tmplServ = "<div id='responsive-form' class='clearfix'>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'>Servicio<span style='color:red'>*</span>{idservicio}</div>";
        tmplServ += "</div>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'>Glosa Servicio<span style='color:red'>*</span>{glosaservicio}</div>";
        tmplServ += "</div>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'>Documento Técnico Asociado<span style='color:red'>*</span>{iddoctotecnico}</div>";
        tmplServ += "</div>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'>Glosa Referencia Dcto<span style='color:red'>*</span>{glosareferencia}</div>";
        tmplServ += "</div>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-half'>Clase Criticidad<span style='color:red'>*</span>{idclasecriticidad}</div>";
        tmplServ += "<div class='column-half'>Nota Criticidad{notacriticidad}</div>";
        tmplServ += "</div>";

        tmplServ += "<hr style='width:100%;'/>";
        tmplServ += "<div> {sData} {cData}  </div>";
        tmplServ += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['id', 'idServicio', 'Servicio', 'Glosa Servicio', 'Id Documento', 'Documento', 'Glosa Referencia', 'ID Clase Criticidad', 'Clase Criticidad', 'Nota Criticidad', 'Color Nota'],
            colModel: [
                { name: 'id', index: 'id', key: true, hidden: true },
                {
                    name: 'idservicio', search: false, editable: true, hidden: true,
                    edittype: "select",
                    editoptions: {
                        dataUrl: '/sic/servicios/' + parentRowKey + '/list',
                        buildSelect: function (response) {
                            var rowKey = $gridTab.getGridParam("selrow");
                            var rowData = $gridTab.getRowData(rowKey);
                            var thissid = rowData.idservicio;
                            var data = JSON.parse(response);
                            var s = "<select>";//el default
                            s += '<option value="0">--Seleccione un Servicio--</option>';
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
                { name: 'servicio.nombre', index: 'servicio', width: 150, editable: true, editoptions: { size: 10 } },
                { name: 'glosaservicio', index: 'glosaservicio', width: 200, editable: true, editoptions: { size: 25 }, editrules: { required: true } },
                //{ name: 'iddoctotecnico', index: 'iddoctotecnico', width: 100, hidden: true,  editable: true, editoptions: { size: 10 } },
                {
                    name: 'iddoctotecnico', search: false, editable: true, hidden: true,
                    edittype: "select",
                    editoptions: {
                        dataUrl: '/sic/servicios/' + parentRowKey + '/doctoasociado',
                        buildSelect: function (response) {
                            var rowKey = $gridTab.getGridParam("selrow");
                            var rowData = $gridTab.getRowData(rowKey);
                            var thissid = rowData.iddoctotecnico;
                            var data = JSON.parse(response);
                            var s = "<select>";//el default
                            s += '<option value="0">--Seleccione un Documento--</option>';
                            $.each(data, function (i, item) {

                                if (data[i].id == thissid) {
                                    s += '<option value="' + data[i].id + '" selected>' + data[i].nombrecorto + '</option>';
                                } else {
                                    s += '<option value="' + data[i].id + '">' + data[i].nombrecorto + '</option>';
                                }
                            });
                            return s + "</select>";
                        }
                    }
                },
                { name: 'documentoscotizacion.nombrecorto', index: 'documento', width: 150, editable: true, editoptions: { size: 10 } },
                { name: 'glosareferencia', index: 'glosareferencia', width: 200, align: "left", editable: true, editoptions: { size: 10 } },
                {
                    name: 'idclasecriticidad', search: false, editable: true, hidden: true,
                    edittype: "select",
                    editoptions: {
                        dataUrl: '/sic/clasecriticidadserv',
                        buildSelect: function (response) {
                            var rowKey = $gridTab.getGridParam("selrow");
                            var rowData = $gridTab.getRowData(rowKey);
                            var thissid = rowData.idclasecriticidad;
                            var data = JSON.parse(response);
                            var s = "<select>";//el default
                            s += '<option value="0">--Seleccione Clase Criticidad--</option>';
                            $.each(data, function (i, item) {

                                if (data[i].id == thissid) {
                                    s += '<option value="' + data[i].id + '" selected>' + data[i].glosaclase + '</option>';
                                } else {
                                    s += '<option value="' + data[i].id + '">' + data[i].glosaclase + '</option>';
                                }
                            });
                            return s + "</select>";
                        },
                        dataEvents: [{
                            type: 'change', fn: function (e) {

                                var idclasecriticidad = $('option:selected', this).val()

                                $.ajax({
                                    type: "GET",
                                    url: '/sic/getcalculadoconclase/' + idclasecriticidad,
                                    async: false,
                                    success: function (data) {
                                        console.log("el val: " + parseInt(data[0].calculado));
                                        //if(parseInt(data[0].calculado)!=0){

                                        $("input#notacriticidad").val(data[0].factor);

                                        //}
                                    }
                                });

                            }
                        }],

                    }
                },
                { name: 'clasecriticidad.glosaclase', index: 'clasecriticidad', width: 150, align: "left", editable: true, editoptions: { size: 10 } },
                { name: 'notacriticidad', index: 'notacriticidad', width: 100, align: "right", editable: true, editoptions: { size: 10 }, formatter: 'number', formatoptions: { decimalPlaces: 2 } },
                {
                    name: 'colornota',
                    index: 'colornota', width: 50, align: "left", editable: true, editoptions: { size: 10 },
                    formatter: function (cellvalue, options, rowObject) {
                        var color = rowObject.colornota;

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


                        return '<span class="cellWithoutBackground" style="background-color:' + color + '; display:block; height: 16px;"></span>';
                    }
                },
            ],
            rowNum: 10,
            rowList: [3, 6],
            pager: '#navGridServ',
            subGrid: true,
            subGridRowExpanded: showSubGridsServ,
            subGridOptions: {
                plusicon: "glyphicon-hand-right",
                minusicon: "glyphicon-hand-down"
            },
            styleUI: "Bootstrap",
            sortname: 'id',
            sortorder: "asc",
            shrinkToFit: false,
            height: "auto",
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Servicios",
            loadComplete: function (data) {
                var thisId = $.jgrid.jqID(this.id);
                $.get('/sic/getsession', function (data) {
                    $.each(data, function (i, item) {
                        console.log("EL ROL ES: " + item.glosarol)
                        if (item.glosarol != 'Administrador SIC' && item.glosarol != 'Negociador SIC') {
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
        $gridTab.jqGrid('navGrid', '#navGridServ', { edit: true, add: true, del: true, search: false },
            {
                editCaption: "Modifica Servicio",
                mtype: 'POST',
                url: '/sic/servicios/action',
                closeAfterEdit: true,
                recreateForm: true,
                template: tmplServ,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                beforeShowForm: function (form) {
                    $('input#notacriticidad', form).attr('readonly', 'readonly');
                    setTimeout(function () {
                        $("#idclasecriticidad", form).attr('disabled', 'disabled');
                    }, 450);



                },
                beforeSubmit: function (postdata, formid) {
                    if (postdata.idservicio == 0) {
                        return [false, "Servicio: Campo obligatorio", ""];
                    } if (postdata.idclasecriticidad == 0) {
                        return [false, "Clase Criticidad : Campo obligatorio", ""];
                    } else {
                        return [true, "", ""]
                    }
                }
            }, {
                addCaption: "Agrega Servicio",
                mtype: 'POST',
                url: '/sic/servicios/action',
                closeAfterAdd: true,
                recreateForm: true,
                template: tmplServ,
                mtype: 'POST',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                beforeShowForm: function (form) {
                    $('input#notacriticidad', form).attr('readonly', 'readonly');
                },
                beforeSubmit: function (postdata, formid) {
                    if (postdata.idservicio == 0) {
                        return [false, "Servicio: Campo obligatorio", ""];
                    } if (postdata.idclasecriticidad == 0) {
                        return [false, "Clase Criticidad : Campo obligatorio", ""];
                    } if (postdata.idsegmento == 0) {
                        return [false, "Segmento Proveedor : Campo obligatorio", ""];
                    } else {
                        return [true, "", ""]
                    }
                },
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                }

            },
            {
                closeAfterDelete: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                addCaption: "Eliminar Servicio",
                mtype: 'POST',
                url: '/sic/servicios/action',
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                }
            }

        );



    }
}

function showSubGridsServ(subgrid_id, row_id) {
    gridProveedores(subgrid_id, row_id, 'proveedores');


    $.ajax({
        type: "GET",
        url: '/sic/getcalculado/' + row_id,
        async: false,
        success: function (data) {
            //console.dir("calc: "+data[0].calculado);

            if (parseInt(data[0].calculado) != 0) {
                gridCriticidad(subgrid_id, row_id, 'criticidad');
            }

        }
    });

}

function gridCriticidad(parentRowID, parentRowKey, suffix) {
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

    var tmplPF = "<div id='responsive-form' class='clearfix'>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-half'><span style='color: red'>*</span>Nombre Factor {nombrefactor}</div>";
    tmplPF += "<div class='column-half'><span style='color: red'>*</span>Porcentaje {porcentaje}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-half'><span style='color: red'>*</span>Nota {nota}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-half'><span style='color: red'>*</span>Valor {valor}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-full'>Observación {observacion}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row' style='display: none;'>";
    tmplPF += "</div>";

    tmplPF += "<hr style='width:100%;'/>";
    tmplPF += "<div> {sData} {cData}  </div>";
    tmplPF += "</div>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    console.log("la subgrid_id : " + subgrid_id)
    var parentSolicitud = subgrid_id.split("_")[2]
    console.log("la parentSolicitud : " + parentSolicitud)
    var childGridURL = "/sic/desglosefactoresserv/" + parentRowKey + "/list";

    var modelIniciativaFecha = [
        { label: 'id', name: 'id', key: true, hidden: true },

        {
            label: 'Nombre Factor', name: 'nombrefactor', jsonmap: 'desglosefactore.nombrefactor', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false, required: true }, hidedlg: true
        },
        {
            label: 'Porcentaje', name: 'porcentaje', width: 50, align: 'right',
            search: true, editable: true, hidden: false,
            formatter: 'number', formatoptions: { decimalPlaces: 2 }
        },
        {
            label: 'Nota', name: 'nota', search: false, editable: true, hidden: false, width: 50,
            edittype: "select",
            editoptions: {
                dataUrl: '/sic/notas/' + 1,
                buildSelect: function (response) {
                    //console.log("fsfs:" + $("#" + childGridID).getRowData($("#" + childGridID).getGridParam("selrow")).id)
                    var rowKey = $("#" + childGridID).getGridParam("selrow");
                    var rowData = $("#" + childGridID).getRowData(rowKey);
                    var thissid = rowData.nota;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Seleccione Nota--</option>';
                    $.each(data, function (i, item) {

                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].valor + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].valor + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {

                        var lanota = $('option:selected', this).val();
                        var rowKey = $("#" + childGridID).getGridParam("selrow");
                        var rowData = $("#" + childGridID).getRowData(rowKey);
                        var porcentaje = rowData.porcentaje;
                        //console.log("la nota: "+lanota+" porcentaje: "+porcentaje);
                        $("input#valor").val((parseFloat(porcentaje) / 100) * parseFloat(lanota));

                    }
                }],

            }
        },
        {
            label: 'Valor', name: 'valor', width: 50, align: 'right',
            search: true, editable: true, hidden: false,
            formatter: 'number', formatoptions: { decimalPlaces: 2 }
        },
        {
            label: 'Observación', name: 'observacion', width: 200,
            align: 'left', edittype: "textarea",
            search: true, editable: true, hidden: false,
            editoptions: { placeholder: "Ingresar comentario sobre la nota" },

        },
    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        caption: 'Desglose Factores Criticidad',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        page: 1,
        colModel: modelIniciativaFecha,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        navkeys: true,
        pager: "#" + childGridPagerID,
        //editurl: '/sic/desglosefactoresserv/action',
        editurl: '/sic/desglosefactoraction/' + parentRowKey + '/' + parentSolicitud,

        onSelectRow: function (rowid, selected) {
            if (rowid != null) {
                var grid = $("#" + childGridID);
                var rowData = grid.getRowData(rowid);
                var idnecesario = rowData.id;
                jQuery("#" + childGridID).setColProp('nota', { editoptions: { dataUrl: '/sic/notas/' + idnecesario } });
            }
        },
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "id": 0, "tipofecha": "No hay datos", "fecha": "" });
            }
        },
        loadComplete: function (data) {
                var thisId = $.jgrid.jqID(this.id);
                $.get('/sic/getsession', function (data) {
                    $.each(data, function (i, item) {
                        console.log("EL ROL ES: " + item.glosarol)
                        if (item.glosarol != 'Administrador SIC' && item.glosarol != 'Negociador SIC') {
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

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: true, add: false, del: false, search: false, refresh: true, view: false, position: "left", cloneToTop: false
    },
        {
            closeAfterEdit: false,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            editCaption: "Modificar Nota Factor",
            //template: tmplPF,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },

            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.success != true)
                    return [false, result.message, ""];
                else
                    $.ajax({
                        type: "GET",
                        url: '/sic/actualizanotafactor/' + parentRowKey,
                        async: false,
                        success: function (data) {
                            return [true, "", ""]
                        }
                    });
                $.ajax({
                    type: "GET",
                    url: '/sic/actualizacolorfactor/' + parentRowKey,
                    async: false,
                    success: function (data) {
                        return [true, "", ""]
                    }
                });



                return [true, "", ""]
            },

            beforeShowForm: function (form) {
                $('input#nombrefactor', form).attr('readonly', 'readonly');
                $('input#porcentaje', form).attr('readonly', 'readonly');
                $('input#valor', form).attr('readonly', 'readonly');
                $(".EditTable td textarea").css("width", "360");

                var grid = $("#" + childGridID);
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                var thissid = rowData.id;
                if (thissid == 0) {
                    alert("Debe seleccionar una fila");
                    return [false, result.error_text, ""];
                }
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
            addCaption: "Agregar Factor",
            template: tmplPF,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentRowKey };
            },

        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Eliminar Factor",
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
    $("#" + childGridID).jqGrid('navButtonAdd', "#" + childGridPagerID, {
        caption: "",
        buttonicon: "glyphicon glyphicon-retweet",
        title: "Actualizar Nota Servicio",
        position: "last",
        onClickButton: function () {
            $("#" + subgrid_id).trigger('reloadGrid');

        }
    });
}
function gridProveedores(parentRowID, parentRowKey, suffix) {
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

    var tmplPF = "<div id='responsive-form' class='clearfix'>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-half'><span style='color: red'>*</span>Provedor {idproveedor}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row' style='display: none;'>";
    tmplPF += "</div>";

    tmplPF += "<hr style='width:100%;'/>";
    tmplPF += "<div> {sData} {cData}  </div>";
    tmplPF += "</div>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    console.log("la subgrid_id : " + subgrid_id)
    var parentSolicitud = subgrid_id.split("_")[2]
    console.log("la parentSolicitud : " + parentSolicitud)
    /*
var grillapadre = subgrid_id.substring(0, subgrid_id.lastIndexOf("_"));

console.log("la grilla padre: " + grillapadre)
var rowData = $("#" + grillapadre).getRowData(parentRowKey);
console.log("la rowData : " + rowData)
var parentSolicitud = rowData.idsolicitudcotizacion;
console.log("la parentSolicitud : " + parentSolicitud)
*/

    var childGridURL = "/sic/proveedoressugeridoslist/" + parentRowKey + "/list";

    var modelIniciativaFecha = [
        { label: 'id', name: 'id', key: true, hidden: true },

        {
            name: 'idproveedor', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/sic/proveedoressugeridostriada/' + parentRowKey,
                buildSelect: function (response) {
                    var rowKey = $("#" + childGridID).getGridParam("selrow");
                    var rowData = $("#" + childGridID).getRowData(rowKey);
                    var thissid = rowData.idproveedor;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Seleccione Proveedor--</option>';
                    $.each(data, function (i, item) {

                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].razonsocial + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].razonsocial + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }
        },

        {
            label: 'Nombre Proveedor', name: 'proveedor.razonsocial', width: 600, align: 'left', search: true, editable: true,
            editrules: { edithidden: false, required: true }, hidedlg: true
        }
    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        caption: 'Proveedores Sugeridos',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        page: 1,
        colModel: modelIniciativaFecha,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,
        //editurl: '/sic/proveedoressugeridos/action',
        editurl: '/sic/proveedoressugeridosaction/' + parentRowKey + '/' + parentSolicitud,
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "id": 0, "tipofecha": "No hay datos", "fecha": "" });
            }
        }
    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            editCaption: "Modificar ",
            template: tmplPF,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }
        },
        {
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agregar Proveedor",
            template: tmplPF,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentRowKey };
            },
            beforeSubmit: function (postdata, formid) {
                if (parseInt(postdata.idproveedor) == 0) {
                    return [false, "Proveedor: Seleccionar un proveedor", ""];
                } else {
                    return [true, "", ""]
                }
            },
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Eliminar Proveedor",
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                console.dir(result);
                if (result.sucess) {
                    return [true, "", ""];
                } else {
                    return [false, result.error_text, ""];

                }

            }
        },
        {
            recreateFilter: true
        }
    );
}