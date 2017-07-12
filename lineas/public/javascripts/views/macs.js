function gridMacIndividual(parentRowID, parentRowKey, suffix) {
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

    var oldRadio = ""

    var tmplPF = "<div id='responsive-form' class='clearfix'>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-full'>Pregunta<span style='color:red'>*</span>{ArchivoUpload}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row' style='display: none;'>";
    tmplPF += "</div>";

    tmplPF += "<hr style='width:100%;'/>";
    tmplPF += "<div> {sData} {cData}  </div>";
    tmplPF += "</div>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    var childGridURL = "/macindividuales/" + parentRowKey;

    var modelGarantia = [
        { label: 'ID', name: 'Id', key: true, hidden: true },
        {
            label: ' ', name: 'marca', key: false, hidden: false, width: 30,
            formatter: function (cellvalue, options, rowObject) {

                dato = '<input type="checkbox" name="chk_group" value="1" />'

                return dato
            }
        },
        {
            label: 'Rut',
            name: 'Rut',
            width: 80,
            align: 'left',
            search: false,
            editable: true,
            hidden: false
        },
        {
            label: 'Cliente', name: 'Nombre', width: 150, hidden: false, search: true, editable: true, editrules: { required: true }
        },

        { label: 'R. Individ.', name: 'RatingIndividual', width: 80, hidden: false, search: true, editable: true, editrules: { required: true } },

        { label: 'Clasif.', name: 'Clasificacion', width: 70, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Vigil.', name: 'Vigilancia', width: 70, hidden: false, search: true, editable: true, editrules: { required: true } },
        {
            label: 'Directo', name: 'Directo', width: 100, hidden: false, search: true, editable: true,
            formatter: function (cellvalue, options, rowObject) {
                dato = Math.floor((Math.random() * 200000) + 1000);
                return dato
            }
        },
        {
            label: 'Contingente', name: 'Contingente', width: 100, hidden: false, search: true, editable: true,
            formatter: function (cellvalue, options, rowObject) {
                dato = Math.floor((Math.random() * 200000) + 1000);
                return dato
            }
        },
        {
            label: 'Derivados', name: 'Derivados', width: 100, hidden: false, search: true, editable: true,
            formatter: function (cellvalue, options, rowObject) {
                dato = Math.floor((Math.random() * 200000) + 1000);
                return dato
            }
        },
        {
            label: 'Entrega Dif.', name: 'Diferida', width: 100, hidden: false, search: true, editable: true,
            formatter: function (cellvalue, options, rowObject) {
                dato = Math.floor((Math.random() * 200000) + 1000);
                return dato
            }
        },
        {
            label: 'Total', name: 'Total', width: 100, hidden: false, search: true, editable: true,
            formatter: function (cellvalue, options, rowObject) {
                dato = Math.floor((Math.random() * 200000) + 1000);
                return dato
            }
        },
        {
            label: 'Var Aprob.', name: 'VarAprobacion', width: 100, hidden: false, search: true, editable: true,
            formatter: function (cellvalue, options, rowObject) {
                dato = Math.floor((Math.random() * 200000) + 1000);
                return dato
            }
        },
        {
            label: 'Deuda Banco', name: 'DeudaBanco', width: 120, hidden: false, search: true, editable: true,
            formatter: function (cellvalue, options, rowObject) {
                dato = Math.floor((Math.random() * 200000) + 1000);
                return dato
            }
        },
        {
            label: 'Gar. Real', name: 'GarantiaReal', width: 100, hidden: false, search: true, editable: true,
            formatter: function (cellvalue, options, rowObject) {
                dato = Math.floor((Math.random() * 200000) + 1000);
                return dato
            }
        },
        {
            label: 'SBIF+ACHEL', name: 'SBIFACHEL', width: 100, hidden: false, search: true, editable: true,
            formatter: function (cellvalue, options, rowObject) {
                dato = Math.floor((Math.random() * 200000) + 1000);
                return dato
            }
        },
        {
            label: 'Penetración', name: 'Penetracion', width: 100, hidden: false, search: true, editable: true,
            formatter: function (cellvalue, options, rowObject) {
                dato = Math.floor((Math.random() * 100) + 0);
                return dato + '%'
            }
        },




    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        rowNum: 20,
        datatype: "json",
        caption: 'MACs Individuales',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        page: 1,
        colModel: modelGarantia,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,
        /*
        subGrid: true,
        subGridRowExpanded: showSubGrids3,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        */

        editurl: '/limite/action3',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "id": 0, "nombre": "No hay datos" });
            }
        },
        footerrow: true,
        loadComplete: function () {
            var sum1 = $("#" + childGridID).jqGrid('getCol', 'Directo', false, 'sum');
            var sum2 = $("#" + childGridID).jqGrid('getCol', 'Contingente', false, 'sum');
            var sum3 = $("#" + childGridID).jqGrid('getCol', 'Derivados', false, 'sum');
            var sum4 = $("#" + childGridID).jqGrid('getCol', 'Diferida', false, 'sum');
            var sum5 = $("#" + childGridID).jqGrid('getCol', 'Total', false, 'sum');
            var sum6 = $("#" + childGridID).jqGrid('getCol', 'VarAprobacion', false, 'sum');
            var sum7 = $("#" + childGridID).jqGrid('getCol', 'DeudaBanco', false, 'sum');
            var sum8 = $("#" + childGridID).jqGrid('getCol', 'GarantiaReal', false, 'sum');
            var sum9 = $("#" + childGridID).jqGrid('getCol', 'SBIFACHEL', false, 'sum');
            var sum10 = $("#" + childGridID).jqGrid('getCol', 'Penetracion', false, 'avg');

            $("#" + childGridID).jqGrid('footerData', 'set',
                {
                    Vigilancia: 'Totales:', 
                    Directo: sum1,
                    Contingente: sum2,
                    Derivados: sum3,
                    Diferida : sum4,
                    Total : sum5,
                    VarAprobacion : sum6,
                    DeudaBanco: sum7,
                    GarantiaReal: sum8,
                    SBIFACHEL: sum9,
                    Penetracion: sum10

                });
        }

    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false, add: false, del: false, search: false, refresh: true, view: false, position: "left", cloneToTop: false,
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            width: 800,
            editCaption: "Modificar Pregunta de Evaluación",
            template: tmplPF,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            },
            beforeSubmit: function (postdata, formid) {
                var elporcentaje = parseFloat(postdata.porcentaje);
                //console.log('porcentaje: ' + elporcentaje);
                if (elporcentaje > 100) {
                    return [false, "Porcentaje no puede ser mayor a 100", ""];
                }
                else {
                    return [true, "", ""]
                }
            },
        },
        {
            addCaption: "Agrega Preguntas",
            mtype: 'POST',
            url: '/sic/criteriosevaluacion/action3',
            closeAfterAdd: true,
            recreateForm: true,
            template: tmplPF,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            beforeShowForm: function (form) {
                //$('input#notacriticidad', form).attr('readonly', 'readonly');
            },

            onclickSubmit: function (rowid) {
                return { idclaseevaluaciontecnica: parentbisabuelo, childGridID: childGridID, idcriterioevaluacion2: parentRowKey };
            }, afterSubmit: UploadPre

        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Eliminar Pregunta",
            mtype: 'POST',
            url: '/sic/criteriosevaluacion/action3',
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }
        },
        {
            recreateFilter: true
        }
    );

    /*
        function showSubGrids3(subgrid_id, row_id) {
            gridCriterios3(subgrid_id, row_id, 'criterios2');
        }
        */


}
function UploadPre(response, postdata) {
    //console.log(postdata)
    var data = $.parseJSON(response.responseText);
    if (data.success) {
        if ($("#ArchivoUpload").val() != "") {
            ajaxPregUpload(data.id, data.idc, postdata.idcriterioevaluacion2, postdata.childGridID);
            console.log(data.id);
            console.log(data.idc);
        }
    }

    return [data.success, data.message, data.id];
}

function ajaxPregUpload(id, idc, idpadre, childGridID) {
    console.log("ESTA WEA SI FUNCIONA CTM: " + id)
    console.log("este es:" + idc)
    var dialog = bootbox.dialog({
        title: 'Se inicia la transferencia',
        message: '<p><i class="fa fa-spin fa-spinner"></i> Esto puede durar segundos...</p>'
    });
    dialog.init(function () {
        $.ajaxFileUpload({
            url: '/sic/criterio3/upload/' + idc,
            secureuri: false,
            fileElementId: 'ArchivoUpload',
            dataType: 'json',
            data: { id: id, idc: idc },
            success: function (data, status) {
                if (typeof (data.success) != 'undefined') {
                    if (data.success == true) {
                        dialog.find('.bootbox-body').html(data.message);
                        $("#" + childGridID).trigger('reloadGrid');
                    } else {
                        dialog.find('.bootbox-body').html(data.message);
                    }
                }
                else {
                    dialog.find('.bootbox-body').html(data.message);
                }
            },
            error: function (data, status, e) {
                dialog.find('.bootbox-body').html(e);
            }
        })
    });
}