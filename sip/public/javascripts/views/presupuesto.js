$(document).ready(function () {
    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>CUI {idcui}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Ejercicio {idejercicio}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Descripción {descripcion}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' style='display: none;'>";
    tmpl += "<div class='column-half'>CUI {CUI}</div>";
    tmpl += "</div>";

    tmpl += "<hr style='width:100%;'/>";
    tmpl += "<div> {sData} {cData}  </div>";
    tmpl += "</div>";

    var modelPresupuesto = [
        { label: 'id', name: 'id', key: true, hidden: true },
        {
            label: 'CUI', name: 'CUI', width: 100, align: 'left', search: false, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'CUI', name: 'idcui', width: 80, align: 'left', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/CUIs',
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
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                }/*
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#divisionsponsor").val($('option:selected', this).text());
                    }
                }],*/
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        { label: 'Nombre CUI', name: 'nombre', width: 250, align: 'left', search: false, editable: true },
        { label: 'Responsable CUI', name: 'responsable', width: 200, align: 'left', search: false, editable: true },
        {
            label: 'Ejercicio', name: 'ejercicio', width: 80, align: 'left', search: false, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Ejercicio', name: 'idejercicio', width: 50, align: 'left', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/ejercicios',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idejercicio;
                    console.log(response);
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Ejercicio--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].ejercicio + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].ejercicio + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        { label: 'Versión', name: 'version', width: 80, align: 'left', search: false, editable: true },
        { label: 'Estado', name: 'estado', width: 80, align: 'left', search: false, editable: false },
        {
            label: 'Monto Forecast', name: 'montoforecast', width: 130, align: 'left', search: false, editable: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Monto Anual', name: 'montoanual', width: 100, align: 'left', search: false, editable: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        { label: 'Descripción', name: 'descripcion', width: 200, align: 'left', search: false, editable: true }
    ];
    $("#grid").jqGrid({
        url: '/presupuestolist',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelPresupuesto,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        sortable: "true",
        width: null,
        shrinkToFit: false,
        caption: 'Lista de Presupuestos',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        editurl: '/presupuesto/action',
        subGrid: true, // set the subGrid property to true to show expand buttons for each row
        subGridRowExpanded: showPresupuestoServicios, // javascript function that will take care of showing the child grid        
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }
    });

    $("#grid").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $('#grid').jqGrid('navGrid', "#pager", {
        edit: true,
        add: true,
        del: true,
        refresh: true,
        search: false, // show search button on the toolbar        
        cloneToTop: false
    },

        {
            editCaption: "Modifica Presupuesto",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                var grid = $('#grid');
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                if (rowData.idcui != postdata.idcui) {
                    return [false, "NO puede cambiar el CUI base", ""];
                } if (rowData.idejercicio != postdata.idejercicio) {
                    return [false, "NO puede cambiar el Ejercicio base", ""];
                }
                return [true, "", ""]
            },
            beforeShowForm: function (postdata, formid) {
                var grid = $('#grid');
                var rowKey = grid.getGridParam("selrow");
                //alert("rowKey:"+rowKey);
                var rowData = grid.getRowData(rowKey);
                //alert("rowData:"+rowData);
                var s = grid.jqGrid('getGridParam', 'selarrrow');
                //alert("SS:"+s);
                window.setTimeout(function () {
                   $("#idcui").attr('disabled', true);
                   $("#idejercicio").attr('disabled', true);
                }, 1000);
                
            }
        },
        {
            addCaption: "Agrega Presupuesto",
            closeAfterAdd: true,
            recreateForm: true,
            //mtype: 'GET',
            //url: '/iniciativas/add',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                var grid = $('#grid');
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                if (rowKey == null) {
                    //alert("Esta opción agrega presupuesto para un nuevo CUI.\nPara una nueva versión de presupuesto:\n   1.-Seleccione versión base\n   2.-Presione boton agregar");
                    //return [false, "", ""];
                } else {
                    if (rowData.idcui != postdata.idcui) {
                        return [false, "NO puede cambiar el CUI base", ""];
                    }
                }
                console.log("*** selrow:" + rowKey);
                console.log("***Ejercicio:" + postdata.idejercicio + "," + rowData.idejercicio);
                postdata.id = rowKey;
                //Obtiene version
                var ver = getVersion(postdata.idcui, postdata.idejercicio);
                console.log("Version:" + ver);
                if (ver > 0) {
                    postdata.version = parseInt(ver) + 1;
                    console.log("v+1:" + postdata.version);
                } else {
                    postdata.version = 1;
                }

                postdata.ejercicio = rowData.ejercicio;
                postdata.montoforecast = rowData.montoforecast;
                postdata.montoanual = rowData.montoanual;
                if (postdata.idcui == 0) {
                    return [false, "CUI: Debe escoger un valor", ""];
                } if (postdata.idejercicio == 0) {
                    return [false, "Ejercicio: Debe escoger un valor", ""];
                } if (postdata.descripcion == 0) {
                    return [false, "Descripción: Debe escoger un valor", ""];
                } else {
                    return [true, "", ""]
                }

            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code == 10)
                    return [false, "Ya existe un presuspuesto Aprobado o Confirmado para el CUI", ""];
                else {
                    return [true, "", ""];
                }
            }
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Elimina Presupuesto",
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {
                var grid = $('#grid');
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                if (rowData.estado != 'Creado') {
                    return [false, "Solo puede eliminar presupuestos en estado Creado", ""];
                } else {
                    return [true, "", ""];
                }
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }
        }, {}
    );

    $("#grid").jqGrid({
        loadComplete: function(data) {
            $("#grid").trigger("reloadGrid");
        }
    });
    
    $('#grid').jqGrid('navButtonAdd', '#pager', {
        caption: "",
        buttonicon: "glyphicon glyphicon-download-alt",
        title: "Excel",
        //position: "last",
        onClickButton: function () {
            var grid = $('#grid');
            var rowKey = grid.getGridParam("selrow");
            var url = '/presupuestosexcel';
            $('#grid').jqGrid('excelExport', { "url": url });
        }
    });

    $('#grid').jqGrid('navButtonAdd', '#pager', {
        caption: "",
        buttonicon: "glyphicon glyphicon glyphicon-check",
        title: "Confirmar",
        position: "last",
        onClickButton: function () {
            var grid = $('#grid');
            var rowKey = grid.getGridParam("selrow");
            var rowData = grid.getRowData(rowKey);

            if (rowKey != null) {
                if (rowData.estado == 'Creado') {
                    if (confirm("¿Esta seguro de Confirmar el presupuesto?")) {
                        $.ajax({
                            url: "/presupuestoconfirma/" + rowData.id + "/Confirmado/" + rowData.idcui + "/" + rowData.idejercicio,
                            dataType: 'json',
                            async: false,
                            success: function (j) {
                                //var json = response.responseText;
                                //var result = JSON.parse(json);
                                console.log("j:" + j);
                                if (j.error_code == 0) {
                                    $("#grid").trigger("reloadGrid");
                                } else if (j.error_code == 10) {
                                    alert("Ya existe un presupuesto Confirmado para el CUI");
                                }
                            }
                        });
                    }
                } else if (rowData.estado == 'Confirmado') {
                    if (confirm("El presupuesto ya esta Confirmado, desea volver a estado Creado")) {
                        $.ajax({
                            url: "/presupuestoconfirma/" + rowData.id + "/Creado/" + rowData.idcui + "/" + rowData.idejercicio,
                            dataType: 'json',
                            async: false,
                            success: function (j) {
                                $("#grid").trigger("reloadGrid");
                            }
                        });
                    }
                } else if (rowData.estado == 'Aprobado') {
                    alert("El presupuesto esta aprobado, no se puede cambiar el estado")
                }
            } else {
                alert("Debe seleccionar una fila");
            }
        }
    });

    $("#pager_left").css("width", "");
});

function disableSelect() {
    //alert("disable");
    $('#idcui').attr('disabled', 'disabled');
}

function getVersion(cui, ejercicio) {
    var version;
    $.ajax({
        url: "/getversion/" + cui + "/" + ejercicio,
        dataType: 'json',
        async: false,
        success: function (j) {
            $.each(j, function (i, item) {
                version = item.version;
                console.log('***version:' + version);
            });
        }
    });
    return version;

}

function showPresupuestoServicios(parentRowID, parentRowKey) {
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    var childGridURL = "/presupuestoservicios/" + parentRowKey;
    var urlServicios = '/serviciospre/' + parentRowKey;
    var urlProveedores = '/proveedorespre/' + parentRowKey;
    var urlProveedoresServ = '/proveedorespreserv/' + parentRowKey;

    var tmplServ = "<div id='responsive-form' class='clearfix'>";

    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-full'>Servicio {idservicio}</div>";
    tmplServ += "</div>";

    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-half'>Glosa Servicio {glosaservicio}</div>";
    tmplServ += "</div>";

    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-full'>Moneda {idmoneda}</div>";
    tmplServ += "</div>";

    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-full'>Proveedor {idproveedor}</div>";
    tmplServ += "</div>";

    tmplServ += "<div class='form-row' style='display: none;'>";
    tmplServ += "<div class='column-full'>Monto Forecast {montoforecast}</div>";
    tmplServ += "</div>";

    tmplServ += "<div class='form-row' style='display: none;'>";
    tmplServ += "<div class='column-half'>Monto Anual {montoanual}</div>";
    tmplServ += "</div>";

    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-half'>Comentario {comentario}</div>";
    tmplServ += "</div>";

    tmplServ += "<hr style='width:100%;'/>";
    tmplServ += "<div> {sData} {cData}  </div>";
    tmplServ += "</div>";

    var modelPresupuestoServ = [
        {
            label: 'id', name: 'id', width: 50, key: true, hidden: true
        },
        {
            label: 'Servicio', name: 'nombre', search: false, width: 300,
            editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Servicio', name: 'idservicio', search: false, width: 200,
            editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: urlServicios,
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idservicio;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Servicio--</option>';
                    $.each(data, function (i, item) {
                        console.log("***data:" + data[i].id + ", " + thissid);
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        var servicio = $('option:selected', this).val()
                        if (servicio != "0") {
                            $.ajax({
                                type: "GET",
                                url: urlProveedoresServ + '/' + servicio,
                                async: false,
                                success: function (data) {
                                    var s = "<select>";//el default
                                    s += '<option value="0" selected>--Escoger Proveedor--</option>';
                                    $.each(data, function (i, item) {
                                        s += '<option value="' + data[i].id + '">' + data[i].nombreproveedor + '</option>';
                                    });
                                    s += "</select>";
                                    $("select#idproveedor").html(s);
                                }
                            });
                        }
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }

        },
        {
            label: 'Glosa Servicio', name: 'glosaservicio',
            search: false, editable: true, edittype: "textarea"
        },
        {
            label: 'Moneda', name: 'moneda', width: 100, align: 'right',
            search: false, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Moneda', name: 'idmoneda', width: 100, align: 'right',
            search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/monedas',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idmoneda;
                    console.log(response);
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Moneda--</option>';
                    $.each(data, function (i, item) {
                        console.log("***monedas:" + data[i].id + ", " + thissid);
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].moneda + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].moneda + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }, dataInit: function (elem) { $(elem).width(200); }

        },
        {
            label: 'Proveedor', name: 'razonsocial', width: 200, align: 'right',
            search: false, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Proveedor', name: 'idproveedor', width: 100, align: 'right',
            search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: urlProveedores,
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idproveedor;
                    console.log(response);
                    var data = JSON.parse(response);
                    console.log(data);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Proveedor--</option>';
                    $.each(data, function (i, item) {
                        console.log("***proveedor:" + data[i].id + ", " + thissid);
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombreproveedor + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombreproveedor + '</option>';
                        }
                    });
                    console.log(s);
                    return s + "</select>";
                }
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Comentario', name: 'comentario',
            search: false, editable: true, edittype: "textarea", hidden: true,
        },
        {
            label: 'Monto Forecast',
            name: 'montoforecast',
            width: 130,
            align: 'right',
            search: false,
            editable: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Monto Anual',
            name: 'montoanual',
            width: 130,
            align: 'right',
            search: false,
            editable: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        }
    ];

    // add a table and pager HTML elements to the parent grid row - we will render the child grid here
    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelPresupuestoServ,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        width: null,
        shrinkToFit: false,
        rowNum: 10,
        rowList: [5, 10, 20, 50],
        editurl: '/presupuestoservicios/action/' + parentRowKey,
        subGrid: true, // set the subGrid property to true to show expand buttons for each row
        subGridRowExpanded: showPresupuestoPeriodos, // javascript function that will take care of showing the child grid                
        pager: "#" + childGridPagerID
    });

    $("#" + childGridID).jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: true,
        add: true,
        del: true,
        refresh: true,
        search: false
    },
        {
            editCaption: "Modifica Servicio",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmplServ,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {

                if (postdata.idservicio == 0) {
                    return [false, "Servicio: Debe escoger un valor", ""];
                } if (postdata.idmoneda == 0) {
                    return [false, "Moneda: Debe escoger un valor", ""];
                } if (postdata.idproveedor == 0) {
                    return [false, "Proveedor: Debe escoger un proveedor", ""];
                } else {
                    return [true, "", ""]
                }
            }
        },
        {
            addCaption: "Agrega Servicio",
            closeAfterAdd: true,
            recreateForm: true,
            //mtype: 'GET',
            //url: '/iniciativas/add',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmplServ,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                //alert("postdata:"+postdata.idproveedor);
                if (postdata.idservicio == 0) {
                    return [false, "Servicio: Debe escoger un servicio", ""];
                } if (postdata.idmoneda == 0) {
                    return [false, "Moneda: Debe escoger una moneda", ""];
                } if (postdata.idproveedor == 0) {
                    return [false, "Proveedor: Debe escoger un proveedor", ""];
                } else {
                    return [true, "", ""]
                }
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
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Elimina Servicio",
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
        }, {}

    );
    /*
        $("#" + childGridID).jqGrid('navButtonAdd', "#" + childGridPagerID, {
            caption: "Excel",
            buttonicon: "silk-icon-page-excel",
            title: "Excel",
            position: "last",
            onClickButton: function () {
                var grid = $("#" + childGridID);
                var rowKey = grid.getGridParam("selrow");
                var url = '/presupuestoserviciosexcel/' + parentRowKey;
                $("#" + childGridID).jqGrid('excelExport', { "url": url });
            }
        });
    */
}

function showPresupuestoPeriodos(parentRowID, parentRowKey) {
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";

    var grid = $("#" + childGridID);
    var rowKey = grid.getGridParam("selrow");

    // send the parent row primary key to the server so that we know which grid to show
    var childGridURL = "/presupuestoperiodoslist/" + parentRowKey;

    // add a table and pager HTML elements to the parent grid row - we will render the child grid here
    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        //page: 1,
        colModel: [
            {
                label: 'id',
                name: 'id',
                width: 50,
                key: true,
                hidden: true
            },
            {
                label: 'Periodo',
                name: 'periodo',
                search: false,
                editable: false,
                sortable: false,
                width: 100,
            },
            {
                label: 'Presupuesto',
                name: 'presupuestobasepesos',
                align: 'right',
                width: 150,
                search: false,
                sortable: false,
                formatter: 'number', formatoptions: { decimalPlaces: 0 }
            },
            {
                label: 'Valor Presupuesto',
                name: 'presupuestopesos',
                editable: true,
                align: 'right',
                search: false,
                width: 150,
                formatter: 'number', formatoptions: { decimalPlaces: 0 }
            }
        ],
        //viewrecords: true,
        //rowNum: 16,
        styleUI: "Bootstrap",
        regional: "es",
        pgbuttons: false,
        pgtext: null,
        height: 'auto',
        viewrecords: false,
        width: null,
        shrinkToFit: false,
        editurl: '/presupuestoperiodos/action',
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        pager: "#" + childGridPagerID
    });
    /*
        $("#" + childGridID).jqGrid('filterToolbar', {
            stringResult: false, searchOperators: true, searchOnEnter: false,
            defaultSearch: 'cn'
        });
    */
    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false,
        add: false,
        del: false,
        search: false,
        refresh: true,
        view: false, position: "left", cloneToTop: false
    },
        {

        },
        {
            recreateFilter: true
        }
    );
    $("#" + childGridID).jqGrid('navButtonAdd', "#" + childGridPagerID, {
        caption: "",
        buttonicon: "glyphicon glyphicon-pencil",
        title: "Editar",
        position: "last",
        onClickButton: function () {
            var subgrid = $("#" + childGridID);
            var ids = subgrid.jqGrid('getDataIDs');
            for (var i = 0; i < ids.length; i++) {
                subgrid.jqGrid('editRow', ids[i]);
            }
        }
    });

    $("#" + childGridID).jqGrid('navButtonAdd', "#" + childGridPagerID, {
        caption: "",
        buttonicon: 'glyphicon glyphicon-save-file',
        title: "Grabar",
        iconsOverText: true,
        position: "last",
        onClickButton: function () {
            var subgrid = $("#" + childGridID);
            var ids = subgrid.jqGrid('getDataIDs');
            for (var i = 0; i < ids.length; i++) {
                subgrid.jqGrid('saveRow', ids[i]);
            }
            $.ajax({
                type: "GET",
                url: '/actualizaTotales/' + parentRowKey,
                async: true,
                success: function (data) {
                    if (data.error_code != 0) {
                        alert('Problemas al actualizar totales');
                    } else {
                        //alert("Actualiza OK");
                        loadGrid();
                    }
                }
            });
        }
    });
}

function loadGrid(parentID) {
    var url = '/presupuestolist';
    $("#grid").jqGrid('setCaption', "Lista de Presupuestos").jqGrid('setGridParam', { url: url, page: 1 }).jqGrid("setGridParam", { datatype: "json" }).trigger("reloadGrid");
}
