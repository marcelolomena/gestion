$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

	var idestructura

	$.getJSON("/estructuracui/responsables", function (j) {
		$.each(j, function (i, item) {
			$('#Responsable').append('<option value="' + item.id + '">' + item.nombre + '</option>');
		});
	});

	$("#button").click(function () {
		idestructura = $('#EstructuraCui').val();
		if (idestructura == 0) {
			alert('Debe escoger una Estructura de CUI');
			return;
		}
		$.getJSON("/estructuracui/cabecera/" + idestructura, function (data) {
			console.log(data);
			$('#CUIPadre').val(data[0].iddivision);
			$('#NombreEstructura').val(data[0].nombre);
			$('#Nombre').val(data[0].division);
			//$('#responsable').remove();
			//$('#responsable').val(data[0].responsable);

			//       $('#responsable').append('<option value="'+data[0].responsable+'</option>');
		});
	});
	loadGrid(idestructura);
});

var leida = false;

function loadGrid(idestructura) {

 var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Concepto{conceptopresupuestario}</div>";
    template += "<div class='column-full'>Nombre{glosaconcepto}</div>";
    template += "</div>";

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";

    var modelConcepto = [
        { label: 'id', name: 'id', key: true, hidden: true },
        {
            label: 'Concepto Presupuestario', name: 'conceptopresupuestario', width: 50, align: 'left', search: true, editable: true,
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("000000", { placeholder: "_________" });

                }
            }, editrules: { required: true, number: true }
        },
        { label: 'Nombre', name: 'glosaconcepto', width: 50, align: 'left', search: true, editable: true, hidden: false },
    ];
    $("#grid").jqGrid({
        url: '/conceptos/list',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelConcepto,
        rowNum: 10,
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        caption: 'Lista de Conceptos Presupuestarios',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        editurl: '/conceptos/action',
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $("#grid").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#grid").addRowData("blankRow", { "nombre": "No hay datos" });
            }
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
            editCaption: "Modifica Concepto Presupuestario",
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
                $('input#conceptopresupuestario', form).attr('readonly', 'readonly');
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
            addCaption: "Agregar Concepto Presupuestario",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {

                if (postdata.conceptopresupuestario == 0) {
                    return [false, "Concepto: Debe escoger un valor", ""];
                } if (postdata.glosaconcepto == 0) {
                    return [false, "Glosa Concepto: Debe escoger un valor", ""];
                } else {
                    return [true, "", ""]
                }
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
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
            addCaption: "Elimina Concepto Presupuestario",
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

    $("#grid").jqGrid('navButtonAdd', "#pager", {
        caption: "",
        buttonicon: "glyphicon glyphicon-download-alt",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $('#grid');
            var rowKey = grid.getGridParam("selrow");
            var url = '/conceptos/excel';
            $('#grid').jqGrid('excelExport', { "url": url });
        }
    });

    $("#pager_left").css("width", "");

    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });
};




