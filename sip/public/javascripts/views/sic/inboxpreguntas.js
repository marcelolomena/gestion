$(document).ready(function () {

    var t1 = "<div id='responsive-form' class='clearfix'>";


    t1 += "<div class='form-row'>";
    t1 += "<div class='column-full' id='d_titulo'>Título<span style='color:red'>*</span>{titulo}</div>";
    t1 += "</div>";

    t1 += "<hr style='width:100%;'/>";
    t1 += "<div> {sData} {cData}  </div>";

    t1 += "</div>";

    var $grid = $("#table_inbox"),
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
        width: 1200,
        shrinkToFit: true,
        viewrecords: true,
        editurl: '/sic/grid_catalogoclausulas',
        caption: 'Clases de Cláusulas',
        styleUI: "Bootstrap",
        onSelectRow: function (id) {
            var getID = $(this).jqGrid('getCell', id, 'id');
        },
        pager: "#pager_inbox",
    });

    //$grid.jqGrid('filterToolbar', { stringResult: true, searchOperators: false, searchOnEnter: false, defaultSearch: 'cn' });

    $grid.jqGrid('navGrid', '#pager_inbox', { edit: true, add: false, del: false, search: false },
        {
            editCaption: "Responder Preguntas",
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


})