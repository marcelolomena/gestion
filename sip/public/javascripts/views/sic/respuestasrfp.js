var gridRespuestasRFP = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        //var $gridTab = $(targ + "_t")
        var $gridTab = $(targ + "_t_" + parentRowKey)

        var tmplServ = "<div id='responsive-form' class='clearfix'>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'>Pregunta<span style='color:red'>*</span>{fileToUpload}</div>";
        tmplServ += "</div>";

        tmplServ += "<hr style='width:100%;'/>";
        tmplServ += "<div> {sData} {cData}  </div>";
        tmplServ += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['id', 'Preguntas', 'pregunta'],
            colModel: [
                { name: 'id', index: 'id', key: true, hidden: true },
                { name: 'pregunta', width: 1100, search: false, editable: false, hidden: false },
                {
                    name: 'fileToUpload',
                    hidden: true,
                    editable: true,
                    edittype: 'file',
                    editrules: { edithidden: true },
                    editoptions: {
                        enctype: "multipart/form-data"
                    },
                    search: false
                },

            ],
            //rowList: [3, 6],
            //page: 1,
            rowNum: 10,
            pager: '#navGridPreg',
            subGrid: true,
            subGridRowExpanded: showSubGridsProv1,
            subGridOptions: {
                plusicon: "glyphicon-hand-right",
                minusicon: "glyphicon-hand-down"
            },
            styleUI: "Bootstrap",
            sortname: 'id',
            sortorder: "asc",
            shrinkToFit: false,
            height: "auto",
            width: "auto",
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Preguntas al Proveedor",
            loadComplete: function (data) {
                var thisId = $.jgrid.jqID(this.id);
                $.get('/sic/getsession', function (data) {
                    $.each(data, function (i, item) {
                        console.log("EL ROL ES: " + item.glosarol)
                        if (item.glosarol != 'Administrador SIC' && item.glosarol != 'Negociador SIC') {
                            $("#add_" + thisId).addClass('ui-disabled');
                            //$("#add_gridMaster").hide();
                            //$("#edit_" + thisId).addClass('ui-disabled');
                            //$("#edit__gridMaster").hide();
                            $("#del_" + thisId).addClass('ui-disabled');
                            //$("#del__gridMaster").hide();
                            $("#download_" + thisId).addClass('ui-disabled');
                        }
                    });
                });
            }
        });
        $gridTab.jqGrid('navGrid', '#navGridPreg', { edit: false, add: true, del: true, search: false },
            {
                editCaption: "Modifica",
                closeAfterEdit: true,
                recreateForm: true,
                template: tmplServ,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
            }, {
                addCaption: "Agrega Preguntas",
                mtype: 'POST',
                url: '/sic/preguntasrfp/action',
                closeAfterAdd: true,
                recreateForm: true,
                template: tmplServ,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                beforeShowForm: function (form) {
                    //$('input#notacriticidad', form).attr('readonly', 'readonly');
                },
                beforeSubmit: function (postdata, formid) {
                    if (postdata.idsolicitudcotizacion == 0) {
                        return [false, "Pregunta : Campo obligatorio", ""];
                    } else {
                        return [true, "", ""]
                    }
                },
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                },afterSubmit: UploadPre

            },
            
            {
                closeAfterDelete: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                addCaption: "Eliminar Pregunta",
                mtype: 'POST',
                url: '/sic/preguntasrfp/action',
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                }
            }

        );

        $gridTab.jqGrid('navButtonAdd', '#navGridPreg', {
            caption: "",
            id: "download_" + $(targ + "_t_" + parentRowKey).attr('id'),
            buttonicon: "glyphicon glyphicon-download-alt",
            title: "Generar Documento",
            position: "last",
            onClickButton: function () {
                //var rowKey = $gridTab.getGridParam("selrow");
                //var parentRowData = $("#gridMaster").getRowData(parentRowKey);
                //console.log(parentRowData.idtipo)
                //console.log(parentRowData.idgrupo)
                try {
                    var url = '/sic/descargapreguntas/' + parentRowKey;
                    $gridTab.jqGrid('excelExport', { "url": url });
                } catch (e) {
                    console.log("error: " + e)

                }

            }
        });


    }
}

function showSubGridsProv1(subgrid_id, row_id) {
    gridProveedores(subgrid_id, row_id, 'proveedores');
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

    var childGridURL = "/sic/proveedoressugeridostotal/" + parentSolicitud + "/list";

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
        caption: 'Proveedores',
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
        subGrid: true,
        subGridRowExpanded: showSubGridsPro,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
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
function showSubGridsPro(subgrid_id, row_id) {
    gridRespuestasFinal(subgrid_id, row_id, 'respuestasfinal');
}

function gridRespuestasFinal(parentRowID, parentRowKey, suffix) {
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

    var tmplServ = "<div id='responsive-form' class='clearfix'>";

    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-full'>Respuesta<span style='color:red'>*</span>{fileToUpload}</div>";
    tmplServ += "</div>";

    tmplServ += "<hr style='width:100%;'/>";
    tmplServ += "<div> {sData} {cData}  </div>";
    tmplServ += "</div>";

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

    var childGridURL = "/sic/preguntasrfp/" + parentSolicitud;

    var modelIniciativaFecha = [
        { name: 'id', index: 'id', key: true, hidden: true },
        { label: 'Pregunta', name: 'pregunta', width: 1100, search: false, editable: false, hidden: false },
        { label: 'Respuesta', name: 'respuesta', width: 1100, search: false, editable: false, hidden: false },
        {
            name: 'fileToUpload',
            hidden: true,
            editable: true,
            edittype: 'file',
            editrules: { edithidden: true },
            editoptions: {
                enctype: "multipart/form-data"
            },
            search: false
        },
    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        caption: 'Respuestas del proveedor',
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
        /*subGrid: true,
        subGridRowExpanded: showSubGridsPro,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },*/
        //editurl: '/sic/proveedoressugeridos/action',
        editurl: '/sic/preguntasrfp/action',// + parentRowKey + '/' + parentSolicitud,
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
            editCaption: "Modifica",
            closeAfterEdit: true,
            recreateForm: true,
            template: tmplServ,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
        }, {
            addCaption: "Agrega Preguntas",
            mtype: 'POST',
            url: '/sic/preguntasrfp/action',
            closeAfterAdd: true,
            recreateForm: true,
            template: tmplServ,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            beforeShowForm: function (form) {
                //$('input#notacriticidad', form).attr('readonly', 'readonly');
            },
            beforeSubmit: function (postdata, formid) {
                if (postdata.idsolicitudcotizacion == 0) {
                    return [false, "Pregunta : Campo obligatorio", ""];
                } else {
                    return [true, "", ""]
                }
            },
            onclickSubmit: function (rowid) {
                return { idsolicitudcotizacion: parentRowKey };
            }, afterSubmit: UploadPre

        },

        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Eliminar Pregunta",
            mtype: 'POST',
            url: '/sic/preguntasrfp/action',
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }
        }
    );
}