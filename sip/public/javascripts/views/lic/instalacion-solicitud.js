$(document).ready(function () {



    var t1 = "<div id='responsive-form' class='clearfix'>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-full'>Producto  -  Código de Autorización<span style='color:red'>*</span>{idProducto}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='form-row', id='laplantilla'>";
    t1 += "</div>";

    t1 += "<div class='form-row', id='elarchivo'>";
    t1 += "<div class='column-half'>Archivo Actual<span style='color:red'>*</span>{nombrearchivo}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-full'>Subir Archivo<span style='color:red'>*</span>{fileToUpload}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-full'>Comentario<span style='color:red'>*</span>{informacion}</div>";
    t1 += "</div>";

    t1 += "<hr style='width:100%;'/>";
    t1 += "<div> {sData} {cData}  </div>";

    t1 += "</div>";

    var idTipoInstalacion;
    var codAutorizacion;
    var $grid = $("#grid"),

        instalacionModel = [{
                label: 'Plantilla',
                name: 'id',
                key: true,
                hidden: true,
                width: 50,
                editable: true,
                hidedlg: true,
                sortable: false,
                editrules: {
                    edithidden: false
                }

            }, {
                label: 'Producto',
                name: 'idProducto',
                jsonmap: 'producto.nombre',
                width: 150,
                align: 'center',
                sortable: false,
                editable: true,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/misAutorizaciones',
                    buildSelect: function (response) {
                        // var grid = $('#grid');
                        var rowKey = $grid.getGridParam("selrow");
                        var rowData = $grid.getRowData(rowKey);
                        var thissid = rowData.idProducto;
                        var data = JSON.parse(response);
                        var s = "<select>";
                        s += '<option value="0">--Escoger Producto--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].nombre == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + ' - ' + data[i].codautoriza + '</option>';
                                codAutorizacion = data[i].codautoriza;
                                idTipoInstalacion = data[i].idtipoinstalacion;
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].nombre + ' - ' + data[i].codautoriza + '</option>';
                                idTipoInstalacion = data[i].idtipoinstalacion;
                                codAutorizacion = data[i].codautoriza;
                            }
                        });
                        return s + "</select>";
                    },
                    dataEvents: [{
                        type: 'change',
                        fn: function (e) {
                            $.ajax({
                                type: "GET",
                                url: '/lic/getplantillatipo/' + idTipoInstalacion,
                                async: false,
                                success: function (data) {
                                    if (data.length > 0 && data[0].nombrearchivo != null) {
                                        $("#laplantilla").empty().html("<div class='column-full'>Plantilla: <a href='/docs/tipoinstalacion/" + data[0].nombrearchivo + "'>" + data[0].nombrearchivo + "</a></div>");
                                        //$("input#program_id").val(data[0].nombrearchivo);
                                    } else {
                                        $("#laplantilla").empty().html("");
                                    }
                                }
                            });
                        }
                    }],
                },
                search: false
            }, {
                label: 'Código de Autorización',
                name: 'codAutorizacion',
                align: 'center',
                width: 100,
                editable: false,
                editrules: {
                    required: true
                },
                search: false
            }, {
                label: 'Nombre de Archivo',
                name: 'nombrearchivo',
                index: 'nombrearchivo',
                hidden: false,
                width: 100,
                align: "left",
                editable: true,
                editoptions: {
                    custom_element: labelEditFunc,
                    custom_value: getLabelValue
                },
                formatter: function (cellvalue, options, rowObject) {
                    return returnDocLinkDoc(cellvalue, options, rowObject);
                },
                unformat: function (cellvalue, options, rowObject) {
                    return returnDocLinkDoc2(cellvalue, options, rowObject);
                }
            },
            {
                name: 'fileToUpload',
                label: 'Subir Archivo',
                hidden: true,
                editable: true,
                edittype: 'file',
                editrules: {
                    edithidden: true,
                    required: true
                },
                editoptions: {
                    enctype: "multipart/form-data"
                },
                search: false
            },
            {
                label: 'Comentario',
                name: 'informacion',
                width: 400,
                hidden: false,
                editable: true,
                edittype: 'textarea',
                editoptions: {
                    fullRow: true
                },
                editrules: {
                    required: true
                },
                search: false
            }


        ];

    $grid.jqGrid({
        url: '/lic/instalacionSolicitud',
        datatype: "json",
        mtype: "GET",
        colModel: instalacionModel,
        page: 1,
        rowNum: 20,
        regional: 'es',
        height: 'auto',
        width: 1200,
        shrinkToFit: true,
        viewrecords: true,
        editurl: '/lic/instalacionSolicitud',
        caption: 'Instalación',
        styleUI: "Bootstrap",
        onSelectRow: function (id) {
            var getID = $(this).jqGrid('getCell', id, 'id');
        },
        pager: "#pager",
    });

    //$grid.jqGrid('filterToolbar', { stringResult: true, searchOperators: false, searchOnEnter: false, defaultSearch: 'cn' });

    $grid.jqGrid('navGrid', '#pager', {
        edit: true,
        add: true,
        del: true,
        search: false
    }, {
        editCaption: "Modifica la Instalación",
        closeAfterEdit: true,
        recreateForm: true,
        ajaxEditOptions: sipLibrary.jsonOptions,
        serializeEditData: sipLibrary.createJSON,
        template: t1,
        // beforeShowForm: function (form) {
        //     $('input#nombrearchivo', form).attr('readonly', 'readonly');
        // },
        // errorTextFormat: function (data) {
        //     return 'Error: ' + data.responseText
        // },
        // beforeSubmit: function (postdata, formid) {
        //     if (postdata.nombrecorto.trim().length == 0) {
        //         return [false, "Nombre: El documento debe tener nombre", ""];
        //     } else {
        //         return [true, "", ""]
        //     }
        // },
        beforeShowForm: function (form) {
            var rowKey = $grid.getGridParam("selrow");
            var rowData = $grid.getRowData(rowKey);
            var thissid = rowData.nombrearchivo;
            if (thissid != "") {
                var lol = jQuery(thissid).attr('href');
                var numero = jQuery(thissid).attr('href').split("/", 3).join("/").length;
                $('#elarchivo').html("<div class='column-full'>Archivo Actual: " + thissid + "</div>");
                $('input#nombrearchivo', form).attr('readonly', 'readonly');
            } else {
                $('#elarchivo').html("<div class='column-full'>Archivo Actual: </div>");
                $('input#nombrearchivo', form).attr('readonly', 'readonly');
            }
        },
        afterSubmit: UploadDoc

    }, {
        addCaption: "Agrega la Instalación",
        closeAfterAdd: true,
        recreateForm: true,
        mtype: 'POST',
        ajaxEditOptions: sipLibrary.jsonOptions,
        serializeEditData: sipLibrary.createJSON,
        template: t1,
        onclickSubmit: function (rowid) {




            return {
                idTipoInstalacion: idTipoInstalacion,
                codAutorizacion: codAutorizacion
            }
        },
        beforeSubmit: function (postdata, formid) {
            if (postdata.informacion.trim().length == 0) {
                return [false, "Comentario: La Instalación debe tener un comentario", ""];
            } else {
                return [true, "", ""]
            }
        },
        beforeShowForm: function (form) {
            $("#elarchivo").empty().html('');
        },
        errorTextFormat: function (data) {
            return 'Error: ' + data.responseText
        },
        afterSubmit: UploadDoc
    }, {

    }, {

    });

})

function labelEditFunc(value, opt) {
    return "<span>" + value + "</span";
}

function getLabelValue(e, action, textvalue) {
    if (action == 'get') {
        console.log("esto es?")
        return e.innerHTML;
    } else {
        if (action == 'set') {
            $(e).html(textvalue);
            console.log("o no??")
        }
        console.log("o nada??")
    }
}

function UploadDoc(response, postdata) {

    var data = $.parseJSON(response.responseText);
    //console.log(data)
    if (data.success) {
        if ($("#fileToUpload").val() != "") {
            ajaxDocUpload(data.id);
        }
    }

    return [data.success, data.message, data.id];
}

function ajaxDocUpload(id) {
    //console.log(id)
    var dialog = bootbox.dialog({
        title: 'Se inicia la transferencia',
        message: '<p><i class="fa fa-spin fa-spinner"></i> Esto puede durar varios minutos...</p>'
    });
    dialog.init(function () {
        $.ajaxFileUpload({
            url: '/lic/imagenEquipo/upload',
            secureuri: false,
            fileElementId: 'fileToUpload',
            dataType: 'json',
            data: {
                id: id
            },
            success: function (data, status) {
                if (typeof (data.success) != 'undefined') {
                    if (data.success == true) {
                        dialog.find('.bootbox-body').html(data.message);
                        $("#grid").trigger('reloadGrid');
                    } else {
                        dialog.find('.bootbox-body').html(data.message);
                    }
                } else {
                    dialog.find('.bootbox-body').html(data.message);
                }
            },
            error: function (data, status, e) {
                dialog.find('.bootbox-body').html(e);
            }
        })
    });
}

function returnDocLinkDoc(cellValue, options, rowdata) {
    if (rowdata.nombrearchivo != "") {
        return "<a href='/docs/lic/" + rowdata.nombrearchivo + "' >" + rowdata.nombrearchivo + "</a>";
    } else {
        return "";
    }

}

function returnDocLinkDoc2(cellValue, options, rowdata) {
    if (rowdata.nombrearchivo != "") {
        return rowdata.nombrearchivo;
        //return "<a href='/docs/" + parentRowKey + "/" + rowdata.nombrearchivo + "' >"+rowdata.nombrearchivo+"</a>";
    } else {
        return "";
    }

}