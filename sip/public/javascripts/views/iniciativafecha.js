function gridIniciativaFecha(parentRowID, parentRowKey, suffix) {
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

    var tmplPF = "<div id='responsive-form' class='clearfix'>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-half'><span style='color: red'>*</span>Tipo Fecha {idtipofecha}</div>";
    tmplPF += "<div class='column-half'><span style='color: red'>*</span>Fecha {fecha}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-full'>Comentario {comentario}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row' style='display: none;'>";
    tmplPF += "<div class='column-half'>tipofecha {tipofecha}</div>";
    tmplPF += "</div>";

    tmplPF += "<hr style='width:100%;'/>";
    tmplPF += "<div> {sData} {cData}  </div>";
    tmplPF += "</div>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    var childGridURL = "/iniciativafecha/" + parentRowKey;

    var modelIniciativaFecha = [
        { label: 'id', name: 'id', key: true, hidden: true },

        {
            label: 'Tipo Fecha', name: 'idtipofecha', search: false, editable: true, hidden: true,
            edittype: "select",
            editrules: {required: true},
            editoptions: {
                dataUrl: '/iniciativagetfechas',
                buildSelect: function (response) {
                    var grid = $("#" + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.tipofecha;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Tipo de Fecha--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].nombre == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#tipofecha").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Tipo Fecha', name: 'tipofecha', width: 250, align: 'left', search: true, editable: true,
            editrules: { edithidden: false, required: true}, hidedlg: true
        },

        
        {
            label: 'Fecha', name: 'fecha', width: 150, align: 'left', search: false,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
            editable: true, editrules: {required: true},
            searchoptions: {
                dataInit: function (el) {
                    $(el).datepicker({
                        language: 'es',
                        format: 'dd-mm-yyyy',
                        autoclose: true,
                        onSelect: function (dateText, inst) {
                            setTimeout(function () {
                                childGridID[0].triggerToolbar();
                            }, 100);
                        }
                    });
                },
                sopt: ["eq", "le", "ge"]
            },
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).mask("00-00-0000", { placeholder: "__-__-____" });
                    $(element).datepicker({ language: 'es', format: 'dd-mm-yyyy', autoclose: true })
                }
            },
        },
        {
            label: 'Comentario', name: 'comentario', width: 500,
            align: 'left', edittype: "textarea",
            search: true, editable: true, hidden: false,
            editoptions: {placeholder: "Ingresar comentario sobre la fecha" }
        },
    ];

    $('#' + parentRowID).append('<br><table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "POST",
        datatype: "json",
        // caption: 'Fechas Clave',
        width: null,
        shrinkToFit: false,
        // autowidth: true,  // set 'true' here
        // shrinkToFit: true, // well, it's 'true' by default
        page: 1,
        colModel: modelIniciativaFecha,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,
        editurl: '/iniciativafecha/action',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "id": 0, "tipofecha": "No hay datos", "fecha": "" });
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
            editCaption: "Modificar Fecha Crítica",
            template: tmplPF,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    $.ajax({
                        type: "GET",
                        url: '/actualizaduracion/' + parentRowKey,
                        async: false,
                        success: function (data) {
                            return [true, "", ""]
                        }
                    });
                return [true, "", ""]
            },
            beforeShowForm: function (form) {
                var grid = $("#" + childGridID);
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                var thissid = rowData.id;
                if (thissid == 0) {
                    alert("Debe seleccionar una fila");
                    return [false, result.error_text, ""];
                }
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                //$('input#codigoart', form).attr('readonly', 'readonly');
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }
        },
        {
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agregar Fecha Crítica",
            template: tmplPF,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentRowKey };
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    $.ajax({
                        type: "GET",
                        url: '/actualizaduracion/' + parentRowKey,
                        async: false,
                        success: function (data) {
                            return [true, "", ""]
                        }
                    });
                return [true, "", ""]
            }, beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Eliminar Fecha Crítica",
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

    $("table.ui-jqgrid-htable").css('width','100%');      $("table.ui-jqgrid-btable").css('width','100%');
    $("#" + pager_id + "_left").css("width", "");  
}