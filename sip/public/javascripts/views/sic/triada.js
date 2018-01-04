
var gridTriada = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        //var $gridTab = $(targ + "_t")
        var $gridTab = $(targ + "_t_" + parentRowKey)

        var tmplTria = "<div id='responsive-form' class='clearfix'>";

        tmplTria += "<hr style='width:100%;'/>";
        tmplTria += "<div> {sData} {cData}  </div>";
        tmplTria += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colModel: [
                { label: 'id', name: 'id', width: 70, key: true, hidden: true },
                { label: 'CUI', name: 'cui', width: 50, align: 'left', search: true, editable: false, hidden: false },
                { label: 'Nombre', name: 'nombre', width: 700, align: 'left', search: true, editable: false, hidden: false },
                { label: 'Nombre Responsable', name: 'nombreresponsable', width: 150, align: 'left', search: true, editable: true },
                { label: 'Nombre Gerente', name: 'nombregerente', width: 150, align: 'left', search: true, editable: true },

            ],
            rowNum: 10,
            rowList: [5, 10, 20, 50],
            pager: '#navGridTriada',
            subGrid: true,
            subGridRowExpanded: gridServicioProveedor,
            subGridOptions: {
                plusicon: "glyphicon-hand-right",
                minusicon: "glyphicon-hand-down"
            },
            styleUI: "Bootstrap",
            sortname: 'id',
            sortorder: "asc",
            regional: 'es',
            shrinkToFit: true,
            height: "auto",
            viewrecords: true,
            caption: "Triada",
            editurl: '/sic/triada/action',
            gridComplete: function () {
                var recs = $gridTab.getGridParam("reccount");
                if (isNaN(recs) || recs == 0) {

                    $gridTab.addRowData("blankRow", { "nombre": "No hay datos" });
                }
            },

        });

        $gridTab.jqGrid('navGrid', '#navGridTriada', { edit: false, add: false, del: false, search: false });
        $(window).bind('resize', function () {
            $gridTab.setGridWidth($(".gcontainer").width(), true);
            $("#navGridTriada").setGridWidth($(".gcontainer").width(), true);
        });

    }
}
function gridServicioProveedor(parentRowID, parentRowKey, suffix) {
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

    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    var childIdServicio = 0;

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    var tmpserprovee = "<div id='responsive-form' class='clearfix'>";

    tmpserprovee += "<div class='form-row'>";
    tmpserprovee += "<div class='column-full'>CUI{cui}</div>";
    tmpserprovee += "<div class='column-full'>Nombre{nombrecui}</div>";
    tmpserprovee += "</div>";

    tmpserprovee += "<div class='form-row'>";
    tmpserprovee += "<div class='column-full'><span style='color:red'>* </span>Servicio {idservicio}</div>";
    tmpserprovee += "<div class='column-full'>Proveedor {razonsocial}</div>";
    tmpserprovee += "</div>";

    tmpserprovee += "<div class='form-row' style='display: none;'>";
    tmpserprovee += "<div class='column-full'>Servicio {nombre}</div>";
    tmpserprovee += "</div>";

    tmpserprovee += "<hr style='width:100%;'/>";
    tmpserprovee += "<div> {sData} {cData}  </div>";
    tmpserprovee += "</div>";

    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    console.log("la subgrid_id : " + subgrid_id)

    var grillapadre = subgrid_id.substring(0, subgrid_id.lastIndexOf("_"));
    console.log("la grilla padre: " + grillapadre)
    var rowData = $("#" + grillapadre).getRowData(parentRowKey);
    console.log("la rowData : " + rowData)
    var parentSolicitud = rowData.cui;
    console.log("PARENTSOLICITUD: " + parentSolicitud)

    var parentPadre = rowData.idsolicitudcotizacion;
    console.log("PARENTCOTIZACION: " + parentPadre)

    var numerocui = rowData.cui;
    var nombrecui = rowData.nombre;
    console.log("la cui : " + parentSolicitud)
    var childIdServicio = 0;


    var parentSolicitudC = subgrid_id.split("_")[2]
    console.log("la parentSolicitudC : " + parentSolicitudC)






    var childGridURL = "/sic/detalleplantilla/" + parentRowKey;

    var modelDetalleServicio = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'idcui', name: 'idcui', hidden: true },
        { label: 'CUI', name: 'cui', search: true, editable: true, width: 100, hidden: true, jsonmap: "estructuracui.cui", editrules: { edithidden: false }, hidedlg: false },
        { label: 'Nombre', name: 'nombrecui', search: true, editable: true, hidden: true, jsonmap: "estructuracui.nombre", editrules: { edithidden: false }, hidedlg: true },
        {
            label: 'Servicio', name: 'nombre', search: true, width: 300,
            editable: true, //jsonmap: "servicio.nombre",
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Servicio', name: 'idservicio', search: false, width: 300,
            editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/sic/cuiservicios/' + parentSolicitudC,
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idservicio;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Servicio--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                            childIdServicio = data[i].id;
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        var thispid = $(this).val();
                        $.ajax({
                            type: "GET",
                            url: '/cuiproveedores/' + parentRowKey + '/' + thispid,
                            async: false,
                            success: function (data) {
                                var s = "<select>";//el default
                                s += '<option value="0">--Escoger Proveedor--</option>';
                                $.each(data, function (i, item) {
                                    s += '<option value="' + data[i].id + '">' + data[i].razonsocial + '</option>';
                                });
                                s += "</select>";
                                $("#razonsocial").html(s);
                            }
                        });
                    }
                }]
            }, dataInit: function (elem) { $(elem).width(100); }

        },
        { label: 'Cuenta', name: 'cuentacontable', editable: true, width: 300, editrules: { edithidden: false }, hidedlg: true },
        { label: 'Tarea', name: 'tarea', editable: true, width: 80, editrules: { edithidden: false }, hidedlg: true },
        {
            label: 'Proveedor', name: 'razonsocial', width: 300, align: 'left',
            search: true, editable: true, hidden: false,
            edittype: "select",
            editoptions: {
                value: "0:--Escoger Proveedor--"
            }
        }
    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelDetalleServicio,
        rowNum: 10,
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        shrinkToFit: true,
        autowidth: true,
        caption: 'SERVICIO - PROVEEDOR',
        styleUI: "Bootstrap",
        subGrid: false,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,
        editurl: '/sic/triada/action',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "nombre": "No hay datos" });
            }
        }
    });
    $("#" + childGridID).jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            editCaption: "Modifica Plantilla de Presupuesto",
            template: tmpserprovee,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }, beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }
        },
        {
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agregar Plantilla de Presupuesto",
            template: tmpserprovee,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {

                if (postdata.idcui == 0) {
                    return [false, "Cui: Debe escoger un valor", ""];
                } if (postdata.idservicio == 0) {
                    return [false, "Servicio: Debe escoger un valor", ""];
                } else {
                    return [true, "", ""]
                }
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentRowKey, cui: numerocui, idsolicitudcotizacion: parentSolicitudC };

            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, "Problemas en llamada al servidor de base de datos", ""];
                else
                    return [true, "", ""]

            }, beforeShowForm: function (form) {

                var grid = $("#" + childGridID);
                console.log("ESTO ES UNA una grid: " + grid)
                var rowData = grid.getRowData(parentRowKey);
                console.log("ESTO ES UN rowDATA: " + rowData)
                var thissid = rowData.cui;
                console.log("ESTO ES UN ID DE CUI: " + parentSolicitud)

                $("#cui", form).val(numerocui);
                var grid = $("#" + childGridID);
                var rowData = grid.getRowData(parentRowKey);
                var thissid = rowData.nombre;
                $("#nombrecui", form).val(nombrecui);

                $('input#cui', form).attr('readonly', 'readonly');
                $('input#nombrecui', form).attr('readonly', 'readonly');
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }, afterShowForm: function (form) {

                $("#idservicio").change(function () {
                    childIdServicio = $(this).val();
                    $.getJSON("/sic/cuiproveedores/" + parentRowKey + "/" + childIdServicio, function (j) {
                        $('#idproveedor').remove();
                        $.each(j, function (i, item) {
                            $('#idproveedor').append('<option value="' + item.id + '">' + item.razonsocial + '</option>');
                        });
                    });
                });

                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Elimina Plantilla Presupuestaria",
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentRowKey, cui: numerocui, idsolicitudcotizacion: parentSolicitudC };

            },
        },
        {
            recreateFilter: true
        }
    );
}


