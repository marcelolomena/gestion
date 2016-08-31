$(document).ready(function () {
    console.log(uid);

    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Nombre {nombre}</div>";

    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Login {uname}</div>";
    template += "<div class='column-half'>E-mail {email}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'><span style='color: red'>*</span>Rol de negocio {rolnegocio}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'><span style='color: red'>*</span>Delegado {uiddelegado}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'><span style='color: white'>*</span></div>";
    template += "</div>";

    template += "<div class='form-row' style='display: none;'>";
    template += "<div class='column-half'>uid{uid}</div>";
    template += "</div>";

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";

    var modelRoles = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'uid', name: 'uid', hidden: true, editable: true },
        {
            label: 'Nombre', name: 'nombre', width: 300, align: 'left',
            search: true, editable: true, hidden: false,
        },
        {
            label: 'Login', name: 'uname', width: 300, align: 'left',
            search: true, editable: true, hidden: false
        },
        {
            label: 'E-mail', name: 'email', width: 300, align: 'left',
            search: true, editable: true, hidden: false
        },
        {
            label: 'Rol de Negocio', name: 'rolnegocio', width: 300, align: 'left',
            search: true, editable: true, hidden: false,
            edittype: "select",
            editoptions: {
                dataUrl: '/monedas',
                buildSelect: function (response) {
                    var grid = $("#table_roldenegocio");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.rolnegocio;
                    //var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Rol de Negocio--</option>';
                    /*
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].moneda + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].moneda + '</option>';
                        }
                    });
                    */
                    var data2 = '[' +
                        '{ "id":"GERENTE" , "rol":"GERENTE" },' +
                        '{ "id":"ROLADMDIVOT" , "rol":"ROLADMDIVOT" } ]';
                    var data = JSON.parse(data2);
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].rol + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].rol + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            },
            dataEvents: [{
                type: 'change', fn: function (e) {
                    $("input#rolnegocio").val($('option:selected', this).val());
                }
            }],
        },
        {
            label: 'uiddelegado', name: 'uiddelegado',
            search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/usuariosdelegados/'+uid,
                buildSelect: function (response) {
                    var grid = $("#table_roldenegocio");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.uiddelegado;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Delegado--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].uid == thissid) {
                            s += '<option value="' + data[i].uid + '" selected>' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        } else {
                            s += '<option value="' + data[i].uid + '">' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#nombredelegado").val($('option:selected', this).text());
                    }
                }],
            }
        },
        {
            label: 'ID Delegado', name: 'uiddelegado', width: 300, align: 'left',
            search: true, editable: true, hidden: true
        },
        {
            label: 'Delegado', name: 'nombredelegado', width: 300, align: 'left',
            search: true, editable: true, hidden: false
        },
    ];

    $("#table_roldenegocio").jqGrid({
        url: '/roldenegocio/list',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelRoles,
        rowNum: 20,
        regional: 'es',
        height: 'auto',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        caption: 'Lista de Usuarios',
        pager: "#pager_roldenegocio",
        viewrecords: true,
        rowList: [10, 20, 50, 100],
        editurl: '/roldenegocio/action',
        styleUI: "Bootstrap",
        onSelectRow: function (rowid, selected) {
            if (rowid != null) {
                var grid = $("#table_roldenegocio");
                var rowData = grid.getRowData(rowid);
                var uidnecesario = rowData.uid;
                jQuery('#table_roldenegocio').setColProp('uiddelegado',{editoptions:{dataUrl: '/usuariosdelegados/'+uidnecesario}});
            }
        },

        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }
    });
    $("#table_roldenegocio").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $('#table_roldenegocio').jqGrid('navGrid', "#pager_roldenegocio", { edit: true, add: false, del: false, search: false, refresh: true, view: false, position: "left", cloneToTop: false },
        {
            editCaption: "Modificar Rol de negocio/Delegado",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            },
            beforeShowForm: function (form) {
                $('input#nombre', form).attr('readonly', 'readonly');
                $('input#uname', form).attr('readonly', 'readonly');
                $('input#email', form).attr('readonly', 'readonly');

                var grid = $("#table_roldenegocio");
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                var thissid = rowData.id;
                if (thissid == 0) {
                    alert("Debe seleccionar una fila");
                    return [false, result.error_text, ""];
                }
                sipLibrary.centerDialog($("#table_roldenegocio").attr('id'));
            },
            afterShowForm: function (form) {
                if (uid != 1) {
                    window.setTimeout(function () {
                        $("#rolnegocio").attr('disabled', true);
                    }, 500);
                }
            }
        },
        {
            recreateFilter: true
        }
    );

    $("#pager_roldenegocio_left").css("width", "");


});