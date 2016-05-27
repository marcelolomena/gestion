$(document).ready(function () {

    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Rut {numrut}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Razon Social {razonsocial}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Negociador DIVOT {negociadordivot}</div>";
    tmpl += "</div>";

    tmpl += "<hr style='width:100%;'/>";
    tmpl += "<div> {sData} {cData}  </div>";
    tmpl += "</div>";

    var modelProveedor = [
        { label: 'id', name: 'id', key: true, hidden: true },
        {
            label: 'RUT', name: 'numrut', width: 150, align: 'right', search: false, editable: true,
            formatter: function (cellvalue, options, rowObject) {
                return rowObject.numrut + '-' + rowObject.dvrut;
            }
        },
        { label: 'DV', name: 'dvrut', search: false, editable: false, hidden: true },
        { label: 'Razón Social', name: 'razonsocial', width: 500, align: 'left', search: true, editable: true, formoptions: { rowpos: 1, colpos: 2 } },
        { label: 'Negociador DIVOT', name: 'negociadordivot', width: 300, align: 'left', search: true, editable: true, formoptions: { rowpos: 1, colpos: 2 } },
    ];

    var tmpc = "<div id='responsive-form' class='clearfix'>";

    tmpc += "<div class='form-row'>";
    tmpc += "<div class='column-full'>Contacto {contacto}</div>";
    tmpc += "</div>";

    tmpc += "<div class='form-row'>";
    tmpc += "<div class='column-full'>Telefono {fono}</div>";
    tmpc += "</div>";

    tmpc += "<div class='form-row'>";
    tmpc += "<div class='column-full'>Correo {correo}</div>";
    tmpc += "</div>";

    tmpc += "<hr style='width:100%;'/>";
    tmpc += "<div> {sData} {cData}  </div>";
    tmpc += "</div>";

    $("#table_proveedor").jqGrid({
        url: '/proveedores/list',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelProveedor,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        width: null,
        shrinkToFit: false,
        caption: 'Lista de proveedores',
        pager: "#pager_proveedor",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        editurl: '/proveedores/action',
        styleUI: "Bootstrap",
        subGrid: true, // set the subGrid property to true to show expand buttons for each row
        subGridRowExpanded: showContactos, // javascript function that will take care of showing the child grid        
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }
    });
    $("#table_proveedor").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $('#table_proveedor').jqGrid('navGrid', "#pager_proveedor", { edit: true, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false },
        {
            editCaption: "Modifica Proveedor",
            closeAfterEdit: true,
            recreateForm: true,
            //  mtype: 'POST',
            //  url: '/proveedores/update',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
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
                $('input#numrut', form).attr('readonly', 'readonly');
                sipLibrary.centerDialog($('#table_proveedor').attr('id'));
            }
        },
        {
            addCaption: "Agrega Proveedor",
            closeAfterAdd: true,
            recreateForm: true,
            // mtype: 'POST',
            // url: '/proveedores/add',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {
                if (postdata.numrut == 0) {
                    return [false, "Rut: Debe escoger un valor", ""];
                } if (postdata.razonsocial == 0) {
                    return [false, "Razon Social: Debe escoger un valor", ""];
                } if (postdata.negociadordivot == 0) {
                    return [false, "Negociador DIVOT: Debe escoger un valor", ""];
                } else {
                    return [true, "", ""]
                }
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0) {
                    return [false, result.error_text, ""];
                } else {
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"razonsocial\",\"op\":\"cn\",\"data\":\"" + postdata.razonsocial + "\"}]}";
                    $("#table_proveedor").jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }, beforeShowForm: function (form) {
                sipLibrary.centerDialog($('#table_proveedor').attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#table_proveedor").attr('id'));
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

    $('#table_proveedor').jqGrid('navButtonAdd', '#pager_proveedor', {
        caption: "Excel",
        buttonicon: "silk-icon-page-excel",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $('#table_proveedor');
            var rowKey = grid.getGridParam("selrow");
            var url = '/proveedoresexcel';
            $('#table_proveedor').jqGrid('excelExport', { "url": url });
        }
    });

    function showContactos(parentRowID, parentRowKey) {
        var childGridID = parentRowID + "_table";
        var childGridPagerID = parentRowID + "_pager";
        var childGridURL = "/contactos/list/" + parentRowKey;

        var modelContacto = [
            { label: 'Contacto', name: 'contacto', width: 300, align: 'center', search: true, editable: true, },
            {
                label: 'Telefono', name: 'fono', width: 100, align: 'center', search: false, editable: true,
                editoptions: {
                    dataInit: function (element) {
                        $(element).mask("00000000000", { placeholder: "___________" });
                    }
                }
            },
            { label: 'Correo', name: 'correo', width: 300, align: 'left', search: false, editable: true, }
        ];

        $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


        $("#" + childGridID).jqGrid({
            url: childGridURL,
            mtype: "GET",
            cache: false,
            datatype: "json",
            page: 1,
            colModel: modelContacto,
            viewrecords: true,
            styleUI: "Bootstrap",
            regional: 'es',
            height: 'auto',
            pager: "#" + childGridPagerID,
            editurl: '/contactos/action',
            gridComplete: function () {
                var recs = $("#" + childGridID).getGridParam("reccount");
                if (isNaN(recs) || recs == 0) {

                    $("#" + childGridID).addRowData("blankRow", { "contacto": "", "fono": "No hay datos" });
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
                editCaption: "Modifica Contacto",
                template: tmpc,
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
                    sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                }, afterShowForm: function (form) {
                    sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                }
            },
            {
                closeAfterAdd: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                addCaption: "Agrega contacto",
                template: tmpc,
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                },
                beforeSubmit: function (postdata, formid) {
                    if (postdata.contacto == 0) {
                        return [false, "Contacto: Debe escoger un valor", ""];
                    } if (postdata.fono == 0) {
                        return [false, "Telefono: Debe escoger un valor", ""];
                    } if (postdata.correo == 0) {
                        return [false, "Correo: Debe escoger un valor", ""];
                    } else {
                        return [true, "", ""]
                    }
                },
                afterSubmit: function (response, postdata) {
                    var json = response.responseText;
                    var result = JSON.parse(json);
                    if (result.error_code != 0) {
                        return [false, result.error_text, ""];
                    } else {
                        var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"contacto\",\"op\":\"cn\",\"data\":\"" + postdata.contacto + "\"}]}";
                        $("#" + childGridID).jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                        return [true, "", ""];
                    }
                },
                beforeShowForm: function (form) {
                    sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                },
                afterShowForm: function (form) {
                    sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                },
                onclickSubmit: function (rowid) {
                    return { parent_id: parentRowKey };
                },
            },
            {
                closeAfterDelete: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                addCaption: "Elimina Contacto",
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

    }

    $("#pager_proveedor_left").css("width", "");
});