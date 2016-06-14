$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Contrato{nombre}</div>";
    template += "<div class='column-full'>Proveedor{idproveedor}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Tipo Solicitud{idtiposolicitud}</div>";
    template += "<div class='column-half'>Estado Solicitud{idestadosol}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Solicitud {solicitudcontrato}</div>";
    template += "<div class='column-half'>Número  {numero}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Tipo {tipocontrato}</div>";
    template += "<div class='column-half'>Documento {tipodocumento}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>PMO {uidpmo}</div>";
    template += "</div>";

    template += "<div class='form-row' style='display: none;'>";
    template += "<div class='column-half'>razonsocial{razonsocial}</div>";
    template += "<div class='column-half'>pmoresponsable{pmoresponsable}</div>";
    template += "<div class='column-half'>tiposolicitud{tiposolicitud}</div>";
    template += "<div class='column-half'>estadosolicitud{estadosolicitud}</div>";
    template += "</div>";

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";

    var modelNuevosProyectos = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'Id Iniciativa', name: 'iniciativaprograma.idiniciativaprograma', hidden: true, editable: true },
        { label: 'Iniciativa', name: 'iniciativaprograma.nombre', width: 250, align: 'left', search: true, editable: true },
        { label: 'División Iniciativa', name: 'iniciativaprograma.divisionsponsor', width: 250, align: 'left', search: true, editable: true },
        { label: 'Gerente Iniciativa', name: 'iniciativaprograma.gerenteresponsable', width: 250, align: 'left', search: true, editable: true },
        { label: 'PMO Iniciativa', name: 'iniciativaprograma.pmoresponsable', width: 250, align: 'left', search: true, editable: true },
        { label: 'Id Moneda', name: 'moneda.idmoneda', hidden: true, editable: true },
        { label: 'Moneda', name: 'moneda.glosamoneda', width: 250, align: 'left', search: true, editable: true },
    ];
    $("#grid").jqGrid({
        url: '/nuevosproyectos/list',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelNuevosProyectos,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default        
        caption: 'Lista de Nuevos Proyectos',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        editurl: '/nuevosproyectos/action',
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $("#grid").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#grid").addRowData("blankRow", { "nombre": "No hay datos" });
            }
        },
    }).jqGrid('filterToolbar', {
        stringResult: true,
        searchOnEnter: true,
        defaultSearch: "cn",
        searchOperators: true,
        beforeSearch: function () {
            var postData = $("#grid").jqGrid('getGridParam', 'postData');
            var searchData = jQuery.parseJSON(postData.filters);
            for (var iRule = 0; iRule < searchData.rules.length; iRule++) {
                if (searchData.rules[iRule].field === "idiniciativaprograma") {
                    var valueToSearch = searchData.rules[iRule].data;
                    searchData.rules[iRule].field = 'idmoneda'
                }
            }
            //return false;
            postData.filters = JSON.stringify(searchData);
        },
        afterSearch: function () {

        }
    });

    $("#grid").jqGrid('navGrid', "#pager", {
        edit: true, add: true, del: true, search: false,
        refresh: true, view: true, position: "left", cloneToTop: false
    },
        {
            editCaption: "Modifica Nuevo Proyecto",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: template,
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
                $("input[type=radio]").attr('disabled', true);
                sipLibrary.centerDialog($('#grid').attr('id'));
            }
        },
        {
            addCaption: "Agrega Nuevo Proyecto",
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {
                if (postdata.idiniciativa == 0) {
                    return [false, "Iniciativa: Debe escoger una iniciativa", ""];
                } else {
                    return [true, "", ""]
                }
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0) {
                    return [false, result.error_text, ""];
                } else {
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"nombre\",\"op\":\"cn\",\"data\":\"" + postdata.nombre + "\"}]}";
                    $("#grid").jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }, beforeShowForm: function (form) {
                sipLibrary.centerDialog($('#grid').attr('id'));
            }
        },
        {
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
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

    $('#grid').jqGrid('navButtonAdd', '#pager', {
        caption: "",
        buttonicon: "glyphicon glyphicon-download-alt",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $('#grid');
            var rowKey = grid.getGridParam("selrow");
            var url = '/nuevosproyectos/excel';
            $('#grid').jqGrid('excelExport', { "url": url });
        }
    });

    $("#pager_left").css("width", "");

    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });
});