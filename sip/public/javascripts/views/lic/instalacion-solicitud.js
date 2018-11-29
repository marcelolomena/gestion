$(document).ready(function () {



    var t1 = "<div id='responsive-form' class='clearfix'>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-full'>Producto  -  Código de Autorización<span style='color:red'>*</span>{idProducto}</div>";
    t1 += "</div>";
	
    t1 += "<div class='form-row'>";
    t1 += "<div class='column-full' style='display: none;'>Producto {nombreProd}</div>";
    t1 += "</div>"; 	

    t1 += "<div class='form-row'>";
    t1 += "<div class='form-row', id='laplantilla'>";
    t1 += "</div>";

    t1 += "<div class='form-row', id='elarchivo'>";
    t1 += "<div class='column-half'>Archivo Actual<span style='color:red'>*</span>{nombrearchivo}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half'>Número de Licencia{numlicencia}</div>";
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
    var numLicencia;
    var $grid = $("#grid"),

        instalacionModel = [{
                label: 'Plantilla',
                name: 'id',
                key: true,
                hidden: true,
                width: 293,
                editable: true,
                hidedlg: true,
                sortable: false,
                editrules: {
                    edithidden: false
                }

            },
            {
                label: 'Estado',
                name: 'estado',
                align: 'center',
                width: 293,
                editable: false,
                search: false
            },
            {
                label: 'Nombre Producto',
                name: 'nombreProd',
                align: 'center',
                width: 293,
                editable: true,
                search: false,
				hidden: true
            },			
            {
                label: 'Producto',
                name: 'idProducto',
                jsonmap: 'producto.nombre',
                width: 293,
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
                                // codAutorizacion = data[i].codautoriza;
                                // idTipoInstalacion = data[i].idtipoinstalacion;
                                // numLicencia = data[i].numlicencia;
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].nombre + ' - ' + data[i].codautoriza + '</option>';
                                // idTipoInstalacion = data[i].idtipoinstalacion;
                                // codAutorizacion = data[i].codautoriza;
                                // numLicencia = data[i].numlicencia
                            }
                        });
                        return s + "</select>";
                    },
                    dataEvents: [{
                        type: 'change',
                        fn: function (e) {
                            var idReserv = $('option:selected', this).val();
                            // $("input#idProducto").val(idReserv);

                            $.ajax({
                                type: "GET",
                                url: '/lic/getplantillatipo/' + idReserv,
                                async: false,
                                success: function (data) {
                                    if (data.length > 0 && data[0].nombrearchivo != null) {
                                        $("#laplantilla").empty().html("<div class='column-full'>Por favor descargar y completar la Plantilla: <a href='/docs/tipoinstalacion/" + data[0].nombrearchivo + "'>" + data[0].nombrearchivo + "</a></div>");
                                        // $("input#program_id").val(data[0].nombrearchivo);
                                    } else {
                                        $("#laplantilla").empty().html("<div class='column-full'>Por favor adjuntar las pantallas de '¡Quien Soy!' de sus computadores.</div>");
                                    }
                                    if (data.length > 0) {
                                        $("input#numlicencia").val(data[0].numlicencia);
                                        idTipoInstalacion = data[0].idtipoinstalacion;
                                        codAutorizacion = data[0].codautoriza;
                                        idProducto = data[0].idproducto;
                                    }
									$("input#nombreProd").val(data[0].nombre);
                                }
                            });
                        }
                    }],
                },
                search: false
            },
            {
                label: 'Cantidad Lic.',
                name: 'numlicencia',
                align: 'center',
                width: 293,
                editable: true,
                hidden: false,
                search: false
            },
            {
                label: 'Código de Autorización',
                name: 'codAutorizacion',
                align: 'center',
                width: 293,
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
                width: 293,
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
                width: 293,
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
            },
        ];

    $grid.jqGrid({
        url: '/lic/instalacionSolicitud',
        datatype: "json",
        mtype: "GET",
        colModel: instalacionModel,
        page: 1,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        width: '100%',
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
                codAutorizacion: codAutorizacion,
                idProducto: idProducto
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
            ajaxDocUpload(data.id, data.parent);
        }
    }

    return [data.success, data.message, data.id];
}

function ajaxDocUpload(id, parent) {
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
                id: id,
                parent: parent
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