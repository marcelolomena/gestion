$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Iniciativa{idiniciativapadre}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Iniciativa Programa{idiniciativaprograma}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Moneda{idmoneda}</div>";
    template += "</div>";

    template += "<div class='form-row' style='display: none;'>";
    template += "<div class='column-half'>idiniciativapadre{nombreiniciativapadre}</div>";
    template += "<div class='column-half'>idiniciativaprograma{nombreiniciativa}</div>";
    template += "<div class='column-half'>idmoneda{glosamoneda}</div>";
    template += "</div>";

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";

    var modelNuevosProyectos = [
        {
            label: 'id',
            name: 'id',
            key: true,
            hidden: true
        },
        {
            label: 'Id Iniciativa Padre',
            name: 'idiniciativapadre',
            jsonmap: "iniciativaprograma.iniciativa.id",
            hidden: true, editable: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/iniciativa/combobox',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idiniciativapadre;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Selecciona iniciativa--</option>';
                    $.each(data, function (i, item) {
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
                        $("input#nombreiniciativapadre").val($('option:selected', this).text());
                        var idpadre = $('option:selected', this).val()
                        if (idpadre != "0") {
                            $.ajax({
                                type: "GET",
                                url: '/iniciativaprograma/combobox/' + idpadre,
                                async: false,
                                success: function (data) {
                                    var grid = $("#grid");
                                    var rowKey = grid.getGridParam("selrow");
                                    var rowData = grid.getRowData(rowKey);
                                    var thissid = rowData.idiniciativaprograma;
                                    var s = "<select>";//el default
                                    s += '<option value="0">--Selecciona iniciativa programa--</option>';
                                    $.each(data, function (i, item) {
                                        if (data[i].id == thissid) {
                                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                                        } else {
                                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                                        }
                                    });
                                    s += "</select>";
                                    $("select#idiniciativaprograma").html(s);
                                }
                            });
                        }

                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Iniciativa Padre',
            name: 'nombreiniciativapadre',
            jsonmap: "iniciativaprograma.iniciativa.nombre",
            hidden: true,
            editable: true
        },
        {
            label: 'Id Iniciativa',
            name: 'idiniciativaprograma',
            hidden: true,
            editable: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/iniciativaprograma/comboboxtotal',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idiniciativaprograma;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Selecciona iniciativa programa--</option>';
                    $.each(data, function (i, item) {
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
                        $("input#nombreiniciativa").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Iniciativa',
            name: 'nombreiniciativa',
            jsonmap: "iniciativaprograma.nombre",
            width: 250, align: 'left',
            search: true,
            editable: true
        },
        {
            label: 'División Iniciativa',
            name: 'iniciativaprograma.divisionsponsor',
            width: 250, align: 'left',
            search: true,
            editable: true
        },
        {
            label: 'Gerente Iniciativa',
            name: 'iniciativaprograma.gerenteresponsable',
            width: 250, align: 'left',
            search: true,
            editable: true
        },
        {
            label: 'PMO Iniciativa',
            name: 'iniciativaprograma.pmoresponsable',
            width: 250, align: 'left',
            search: true,
            editable: true
        },
        {
            label: 'Id Moneda',
            name: 'idmoneda',
            hidden: true,
            editable: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/monedas',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idmoneda;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Moneda--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].moneda + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].moneda + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }, dataInit: function (elem) {/* $(elem).width(200);*/ },
            dataEvents: [{
                type: 'change', fn: function (e) {
                    $("input#glosamoneda").val($('option:selected', this).text());
                }
            }],
        },
        {
            label: 'Moneda',
            name: 'glosamoneda',
            jsonmap: "moneda.glosamoneda",
            width: 250, align: 'left',
            search: true,
            editable: true
        },
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