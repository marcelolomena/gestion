$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'><span style='color:red'>* </span>Sigla{sigla}</div>";
    template += "<div class='column-full'><span style='color:red'>* </span>Nombre{nombre}</div>";
    template += "</div>";

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";

    var modelConcepto = [
        { label: 'id', name: 'id', key: true, hidden: true },
        {
            label: 'Sigla', name: 'sigla', width: 50, align: 'left', search: true, editable: true,
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("AAA", { placeholder: "___" });

                }
            }, editrules: { required: true, number: false }
        },
        { label: 'Nombre', name: 'nombre', width: 50, align: 'left', search: true, editable: true, hidden: false },
    ];
    $("#grid").jqGrid({
        url: '/sic/segmentoproveedor/list',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelConcepto,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        width: null,
        shrinkToFit: true,
        viewrecords: true,
        caption: 'Lista de Segmentos de Proveedor',
        pager: "#pager",
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        editurl: '/sic/segmentoproveedor/action',
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $("#grid").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#grid").addRowData("blankRow", { "nombre": "No hay datos" });
            }
            $("table.ui-jqgrid-htable").css('width','100%');      $("table.ui-jqgrid-btable").css('width','100%');
            $("#pager_left").css("width", "");
        },
        // subGrid: true,
        // subGridRowExpanded: showChildGrid,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
    });

    $("#grid").jqGrid('navGrid', "#pager", {
        edit: true, add: true, del: true, search: false,
        refresh: true, view: true, position: "left", cloneToTop: false
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            editCaption: "Modifica Segmento Proveedor",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.success != true)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }, beforeShowForm: function (form) {
                $('input#sigla', form).attr('readonly', 'readonly');
                sipLibrary.centerDialog($("#grid").attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#grid").attr('id'));
            }
        },
        {
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agregar Segmento Proveedor",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {

                if (postdata.sigla == 0) {
                    return [false, "Sigla: Debe escoger un valor", ""];
                } if (postdata.nombre == 0) {
                    return [false, "Nombre Segmento: Debe escoger un valor", ""];
                } else {
                    return [true, "", ""]
                }
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.success != true)
                    return [false, "Error en llamada a Servidor", ""];
                else
                    return [true, "", ""]

            }, beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#grid").attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#grid").attr('id'));
            }
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Elimina Segmento Proveedor",
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.success != true)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }
        },
        {
            recreateFilter: true
        }
    );

    $("#grid").jqGrid('navButtonAdd', "#pager", {
        caption: "",
        buttonicon: "glyphicon glyphicon-download-alt",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $('#grid');
            var rowKey = grid.getGridParam("selrow");
            var url = '/sic/segmentoproveedor/excel';
            $('#grid').jqGrid('excelExport', { "url": url });
        }
    });

    $("#pager_left").css("width", "");

    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });
});
