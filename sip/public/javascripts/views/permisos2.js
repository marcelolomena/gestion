function gridPermisos2(parentRowID, parentRowKey, suffix) {
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

    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'><span style='color: red'>*</span>Menu{mid}</div>";
    template += "</div>";

    template += "<div class='form-row' style='display: none;'>";
    template += "<div class='column-half'><span style='color: red'>*</span>Rol{rid}</div>";
    template += "</div>";

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    var childGridURL = "/permisos/list2/" + parentRowKey;

    var modelRoles2 = [
        {
            label: 'id',
            name: 'id',
            key: true,
            hidden: true
        },
        {
            label: 'Rolid', name: 'rid', width: 300, align: 'left',
            search: true, editable: true, hidden: true, jsonmap: 'rid'
        },
        {
            label: 'Menu', name: 'menu', width: 300, align: 'left',
            search: true, editable: false, hidden: false, jsonmap: 'descripcion'
        },

        {
            label: 'Menu', name: 'mid', search: false, editable: true, hidden: true, jsonmap: 'mid',
            edittype: "select",
            editoptions: {
                dataUrl: '/getmenus',
                buildSelect: function (response) {
                    var grid = $('#' + childGridID);
                    console.log(grid);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.id;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Menu--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].descripcion + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].descripcion + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#menu").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },


    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "POST",
        datatype: "json",
        // caption: 'Menus',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        subGrid: true,
        subGridRowExpanded: showSubGrids2,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        page: 1,
        colModel: modelRoles2,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,
        //editurl: '/tareaenvuelo/action',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "id": 0, "rol": "No hay datos" });
            }
        }
    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            editCaption: "Modificar Rol",
            url: '/permisos/action',
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
        },
        {
            closeAfterAdd: true,
            recreateForm: true,
            mtype: "POST",
            url: '/permisos/action',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agregar Menu",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentRowKey };
            },
            beforeSubmit: function (postdata, formid) {
                if (postdata.mid == 0) {
                    return [false, "Menu: Debe seleccionar un valor", ""];
                } else {
                    return [true, "", ""]
                }
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }, beforeShowForm: function (form) {
                //document.getElementsByName("reqcontrato").checked = true; 
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }, afterShowForm: function (form) {
                //$('select#idcui').attr("disabled", true); 
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            url: '/permisos/action',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Eliminar Menu",
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
    function showSubGrids2(subgrid_id, row_id) {

        var grid = $('#' + childGridID);
        console.log(grid);
        //var rowKey = grid.getGridParam("selrow");
        var rowData = grid.getRowData(row_id);
        console.dir(rowData);
        var menuid = rowData.mid;
        var rolid = parentRowKey;
        console.log("el menu: "+menuid);
        console.log("el rol: "+rolid);
        gridPermisos3(subgrid_id, row_id, menuid,rolid, 'permisos3');
    }
}