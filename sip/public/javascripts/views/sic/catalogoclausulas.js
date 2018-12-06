$(document).ready(function () {

    var t1 = "<div id='responsive-form' class='clearfix'>";


    t1 += "<div class='form-row'>";
    t1 += "<div class='column-full' id='d_titulo'>Título<span style='color:red'>*</span>{titulo}</div>";
    t1 += "</div>";

    t1 += "<hr style='width:100%;'/>";
    t1 += "<div> {sData} {cData}  </div>";

    t1 += "</div>";

    var $grid = $("#grid"),
        catalogoclausulasModel = [
            { label: 'ID', name: 'id', key: true, hidden: true },

            { label: 'Título', name: 'titulo', width: 250, align: 'left', search: false, editable: true, editrules: { required: true } },
     

        ];

    $grid.jqGrid({
        url: '/sic/grid_catalogoclausulas',
        datatype: "json",
        mtype: "GET",
        colModel: catalogoclausulasModel,
        page: 1,
        rowNum: 20,
        regional: 'es',
        height: 'auto',
        width: null,
        shrinkToFit: true,
        viewrecords: true,
        editurl: '/sic/grid_catalogoclausulas',
        caption: 'Clases de Cláusulas',
        styleUI: "Bootstrap",
        gridComplete: function () {
            $("table.ui-jqgrid-htable").css('width','100%');      $("table.ui-jqgrid-btable").css('width','100%');
            $("#pager_left").css("width", "");
        },
        onSelectRow: function (id) {
            var getID = $(this).jqGrid('getCell', id, 'id');
        },
        pager: "#pager",
        subGrid: true,
        subGridRowExpanded: showSubGrids,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        }
    });

    //$grid.jqGrid('filterToolbar', { stringResult: true, searchOperators: false, searchOnEnter: false, defaultSearch: 'cn' });

    $grid.jqGrid('navGrid', '#pager', { edit: true, add: true, del: true, search: false },
        {
            editCaption: "Modifica Clase",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: t1,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error != 0) {
                    return [false, result.glosa, ""];
                } else {
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"titulo\",\"op\":\"cn\",\"data\":\"" + postdata.titulo + "\"}]}";
                    $grid.jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }

        }, {
            addCaption: "Agrega Clase",
            closeAfterAdd: true,
            recreateForm: true,
            mtype: 'POST',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: t1,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText

            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error != 0) {
                    return [false, result.glosa, ""];
                } else {
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"titulo\",\"op\":\"cn\",\"data\":\"" + postdata.titulo + "\"}]}";
                    $grid.jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }
        }, {

        }, {

        });
/*
    $grid.jqGrid('navButtonAdd', '#pager', {
        caption: "",
        id: "download",
        buttonicon: "glyphicon glyphicon-download-alt",
        title: "Generar Documento",
        position: "last",
        onClickButton: function () {
            $.getJSON('/sic/parametros2/grupoclausula', function (data) {
                bootbox.prompt({
                    title: "Generando Documento...",
                    inputType: 'select',
                    inputOptions: data,
                    callback: function (result) {
                        if (result) {
                            try {
                                var url = '/sic/downloadclausulas/' + result;
                                $grid.jqGrid('excelExport', { "url": url });
                            } catch (e) {
                                console.log("error: " + e)

                            }

                        } else {
                            bootbox.alert("Debe seleccionar un grupo de cláusulas");
                        }
                    }
                });
            });
        }
    })

*/

})
function showSubGrids(subgrid_id, row_id) {
    gridClausulas(subgrid_id, row_id, 'clausulas');
}
