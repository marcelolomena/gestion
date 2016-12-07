$(document).ready(function () {

    var t1 = "<div id='responsive-form' class='clearfix'>";


    t1 += "<div class='form-row'>";
    t1 += "<div class='column-full' id='d_nombre'>Nombre<span style='color:red'>*</span>{nombre}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-full' id='d_secuencia'>Secuencia<span style='color:red'>*</span>{secuencia}</div>";
    t1 += "</div>";

    t1 += "<hr style='width:100%;'/>";
    t1 += "<div> {sData} {cData}  </div>";

    t1 += "</div>";

    var $grid = $("#table_catclausulas"),
        catalogoclausulasModel = [
            { label: 'ID', name: 'id', key: true, hidden: true },
          
            { label: 'Nombre', name: 'nombre', width: 250, align: 'left', search: false, editable: true },
            { label: 'Secuencia', name: 'secuencia', width: 100, align: 'left', search: false, editable: true },
            
            
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
        width: 1000,
        shrinkToFit: true,
        viewrecords: true,
        editurl: '/sic/grid_catalogoclausulas',
        caption: 'Clases de Cláusulas',
        styleUI: "Bootstrap",
        onSelectRow: function (id) {
            var getID = $(this).jqGrid('getCell', id, 'id');
        },
        pager: "#pager_catclausulas",
        subGrid: true,
        subGridRowExpanded: showSubGrids,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        loadComplete: function (data) {
            $.get('/sic/getsession', function (data) {
                $.each(data, function (i, item) {
                    console.log('EL SUPER ROL : ' + item.glosarol)
                    if (item.glosarol === 'Negociador SIC') {
                        
                    }
                });
            });
        }
    });

    //$grid.jqGrid('filterToolbar', { stringResult: true, searchOperators: false, searchOnEnter: false, defaultSearch: 'cn' });

    $grid.jqGrid('navGrid', '#pager_catclausulas', { edit: true, add: true, del: true, search: false },
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
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"nombre\",\"op\":\"cn\",\"data\":\"" + postdata.nombre + "\"}]}";
                    $grid.jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }, beforeShowForm: function (form) {
                setTimeout(function () {
                    $.get('/sic/getsession', function (data) {
                        $.each(data, function (i, item) {
                            console.log('EL SUPER ROL : ' + item.glosarol)
                            if (item.glosarol === 'Negociador SIC') {
                                /*
                                $("#idcui", form).attr("disabled", true);
                                $("#idtecnico", form).attr('readonly', 'readonly');
                                $("#tipocontrato", form).attr('readonly', 'readonly');
                                $("#codigoart", form).attr('readonly', 'readonly');
                                $("#sap", form).attr('readonly', 'readonly');
                                $("#descripcion", form).attr('readonly', 'readonly');
                                $("#idclasificacionsolicitud", form).attr('readonly', 'readonly');
                                */
                            } else if (item.glosarol === 'Técnico SIC') {
                                /*
                                $("#d_idnegociador", form).hide();
                                $("#d_correonegociador", form).hide();
                                $("#d_direccionnegociador", form).hide();
                                $("#d_fononegociador", form).hide();
                                $("#d_numerorfp", form).hide();
                                $("#d_fechaenviorfp", form).hide();
                                $("#d_nombreinterlocutor1", form).hide();
                                $("#d_correointerlocutor1", form).hide();
                                $("#d_fonointerlocutor1", form).hide();
                                $("#d_nombreinterlocutor2", form).hide();
                                $("#d_correointerlocutor2", form).hide();
                                $("#d_fonointerlocutor2", form).hide();
                                */
                            }
                        });
                    });
                }, 100);
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
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"nombre\",\"op\":\"cn\",\"data\":\"" + postdata.nombre + "\"}]}";
                    $grid.jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }, beforeShowForm: function (form) {

                setTimeout(function () {
                    $.get('/sic/getsession', function (data) {
                        $.each(data, function (i, item) {
                            console.log('EL SUPER ROL : ' + item.glosarol)
                            if (item.glosarol === 'Negociador SIC') {
                                /*
                                $("#d_idcui", form).hide();
                                $("#d_idtecnico", form).hide();
                                $("#d_tipocontrato", form).hide();
                                $("#d_codigoart", form).hide();
                                $("#d_sap", form).hide();
                                $("#d_descripcion", form).hide();
                                $("#d_idclasificacionsolicitud", form).hide();
                                */
                            } else if (item.glosarol === 'Técnico SIC') {
                                /*
                                $("#d_idnegociador", form).hide();
                                $("#d_correonegociador", form).hide();
                                $("#d_direccionnegociador", form).hide();
                                $("#d_fononegociador", form).hide();
                                $("#d_numerorfp", form).hide();
                                $("#d_fechaenviorfp", form).hide();
                                $("#d_nombreinterlocutor1", form).hide();
                                $("#d_correointerlocutor1", form).hide();
                                $("#d_fonointerlocutor1", form).hide();
                                $("#d_nombreinterlocutor2", form).hide();
                                $("#d_correointerlocutor2", form).hide();
                                $("#d_fonointerlocutor2", form).hide();
                                */
                            }
                        });
                    });
                }, 100);
            }
        }, {

        }, {

        });


})
function showSubGrids(subgrid_id, row_id) {
    gridClausulas(subgrid_id, row_id, 'clausulas');
}