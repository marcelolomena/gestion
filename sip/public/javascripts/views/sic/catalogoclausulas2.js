function gridClausulas(parentRowID, parentRowKey, suffix) {
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
    tmplPF += "<div class='column-four'><span style='color: red'>*</span>Código {codigo}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-four'><span style='color: red'>*</span>Nombre {nombre}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row' id='elradio'>";
    tmplPF += "<div class='column-full'><span style='color: red'>*</span>Crítica {criticidad}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row' style='display: none;'>";
    tmplPF += "</div>";

    tmplPF += "<hr style='width:100%;'/>";
    tmplPF += "<div> {sData} {cData}  </div>";
    tmplPF += "</div>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    var childGridURL = "/sic/catalogoclausulas2/" + parentRowKey + "/list";

    var modelCatClausulas = [
        { label: 'id', name: 'id', key: true, hidden: true },

        {
            label: 'Código', name: 'codigo', width: 25, align: 'left', search: false, editable: true,
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("00.00", { placeholder: "__.__" });
                }
            },
            editrules: { required: true }
        },

        {
            label: 'Nombre', name: 'nombre', width: 100, align: 'left', search: false, editable: true,
            editrules: { required: false }
        },

        {
            label: 'Criticidad', name: 'criticidad', width: 25,
            search: false, editable: true, hidden: false,
            //editrules: { required: true },
            edittype: "custom",
            editoptions: {
                custom_value: sicLibrary.getRadioElementValue,
                custom_element: sicLibrary.radioElemCritica
            },
            formatter: function (cellvalue, options, rowObject) {
                var dato = '';
                var val = rowObject.criticidad;
                if (val == 1) {
                    dato = 'Sí';

                } else if (val == 0) {
                    dato = 'No';
                }
                return dato;
            }
        },

    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        rowNum: 20,
        datatype: "json",
        caption: 'Catálogo de Cláusulas',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        page: 1,
        colModel: modelCatClausulas,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,
        subGrid: true,
        subGridRowExpanded: showSubGrids,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        editurl: '/sic/catalogoclausulas2/action',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "id": 0, "codigo": "No hay datos" });
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
            editCaption: "Modificar Plantilla Cláusula",
            template: tmplPF,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            },

            afterShowForm: function (form) {
                oldRadio = $("#elradio").html();
                console.log("radio antes: " + oldRadio);
                var rowKey = $("#" + childGridID).getGridParam("selrow");
                var rowData = $("#" + childGridID).getRowData(rowKey);
                var thissid = rowData.idgrupo;
                if (parseInt(thissid) != 15) {
                    $("#elradio").html("");
                } else {
                    $("#elradio").html(oldRadio);
                }


            },

            /*
            beforeSubmit: function (postdata, formid) {
                if (postdata.idtipoclausula == 0) {
                    return [false, "Tipo Clausula: Campo obligatorio", ""];
                } if (postdata.idgrupo == 0) {
                    return [false, "Grupo Clausula: Campo obligatorio", ""];
                } else {
                    return [true, "", ""]
                }
            }
            */
        },
        {
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            width: 800,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agregar Plantilla Cláusula",
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


            afterShowForm: function (form) {
                oldRadio = $("#elradio").html();
                console.log("radio antes: " + oldRadio);
            },

            /*
            beforeSubmit: function (postdata, formid) {
                if (postdata.idtipoclausula == 0) {
                    return [false, "Tipo Clausula: Campo obligatorio", ""];
                } if (postdata.idgrupo == 0) {
                    return [false, "Grupo Clausula: Campo obligatorio", ""];
                } else {
                    return [true, "", ""]
                }
            }
            */
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Eliminar Plantilla Cláusula",
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }
        },
        {
            recreateFilter: true
        }
    );

    function showSubGrids(subgrid_id, row_id) {
        gridCuerpos(subgrid_id, row_id, 'cuerpos');
    }

}