function gridClases(parentRowID, parentRowKey, suffix) {
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
    tmplPF += "<div class='column-four'><span style='color: red'>*</span>Clase {idclase}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row' id='elradio'>";
    tmplPF += "<div class='column-full'><span style='color: red'>*</span>Secuencia {secuencia}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row' style='display: none;'>";
    tmplPF += "</div>";

    tmplPF += "<hr style='width:100%;'/>";
    tmplPF += "<div> {sData} {cData}  </div>";
    tmplPF += "</div>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    var childGridURL = "/sic/tocclases/" + parentRowKey + "/list";

    var modelClases = [
        { label: 'id', name: 'id', key: true, hidden: true },
    
        {
            label: 'Clase', name: 'idclase', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/sic/grupoclausula',
                buildSelect: function (response) {
                    var rowKey = $("#" + childGridID).getGridParam("selrow");
                    var rowData = $("#" + childGridID).getRowData(rowKey);
                    var thissid = rowData.idgrupo;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Seleccione un Grupo--</option>';
                    $.each(data, function (i, item) {

                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }
        },
        { label: 'Clase', name: 'clase.titulo', width: 150, editable: true, editoptions: { size: 10 } },

         { label: 'Secuencia', name: 'secuencia', width: 80, editable: true, editoptions: { size: 10 } },
        
    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        rowNum: 20,
        datatype: "json",
        caption: 'Clases',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        page: 1,
        colModel: modelClases,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        checkOnUpdate: true,
        pager: "#" + childGridPagerID,
        subGrid: true,
        subGridRowExpanded: showSubGrids,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        editurl: '/sic/tocclases/action',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "id": 0, "clase.titulo": "No hay datos" });
            }
        }
    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: true, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            width: 800,
            editCaption: "Modificar Clase",
            template: tmplPF,
            checkOnUpdate: true,
            saveData: "¿Desea guardar los cambios antes de salir?",
            bYes: "Sí",
            bNo: "",
            bExit: "No",
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            },

           

           
            beforeSubmit: function (postdata, formid) {
                if (postdata.idclase == 0) {
                    return [false, "Clase: Campo obligatorio", ""];
                } else {
                    return [true, "", ""]
                }
            }
            
        },
        {
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            width: 800,
            checkOnUpdate: true,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agregar Clase",
            template: tmplPF,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentRowKey };
            },
            beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            },


           

           
            beforeSubmit: function (postdata, formid) {
                if (postdata.idclase == 0) {
                    return [false, "Clase: Campo obligatorio", ""];
                } else {
                    return [true, "", ""]
                }
            }
            
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Eliminar Clase",
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }
        },
        {
            recreateFilter: true
        }
    );

    function showSubGrids(subgrid_id, row_id) {
        gridPlantilla(subgrid_id, row_id, 'plantilla');
    }

}