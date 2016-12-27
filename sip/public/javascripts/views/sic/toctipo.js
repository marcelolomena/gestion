$(document).ready(function () {

    var t1 = "<div id='responsive-form' class='clearfix'>";


    t1 += "<div class='form-row'>";
    t1 += "<div class='column-full' id='d_titulo'>Nombre<span style='color:red'>*</span>{nombre}</div>";
    t1 += "</div>";

    t1 += "<hr style='width:100%;'/>";
    t1 += "<div> {sData} {cData}  </div>";

    t1 += "</div>";

    var $grid = $("#table_toc"),
        tocModel = [
            { label: 'ID', name: 'id', key: true, hidden: true },

            
        { label: 'Nombre', name: 'nombre', width: 150, editable: true, editoptions: { size: 10 } },
        ];

    $grid.jqGrid({
        url: '/sic/grid_toctipo',
        datatype: "json",
        mtype: "GET",
        colModel: tocModel,
        page: 1,
        rowNum: 20,
        regional: 'es',
        height: 'auto',
        width: 1200,
        shrinkToFit: true,
        viewrecords: true,
        editurl: '/sic/grid_toctipo',
        caption: 'Tipos de Cláusulas',
        styleUI: "Bootstrap",
        onSelectRow: function (id) {
            var getID = $(this).jqGrid('getCell', id, 'id');
        },
        pager: "#pager_toc",
        subGrid: true,
        subGridRowExpanded: showSubGrids,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        }
    });

    //$grid.jqGrid('filterToolbar', { stringResult: true, searchOperators: false, searchOnEnter: false, defaultSearch: 'cn' });

    $grid.jqGrid('navGrid', '#pager_toc', { edit: true, add: true, del: true, search: false },
        {
            editCaption: "Modifica Tipo",
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
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"nombre\",\"op\":\"cn\",\"data\":\"" + postdata.nombre + "\"}]}";
                    $grid.jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }

        }, {
            addCaption: "Agrega Tipo",
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
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"nombre\",\"op\":\"cn\",\"data\":\"" + postdata.nombre + "\"}]}";
                    $grid.jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }
        }, {

        }, {

        });

})
function showSubGrids(subgrid_id, row_id) {
    gridClases(subgrid_id, row_id, 'clases');
}
