$(document).ready(function () {

    var t1 = "<div id='responsive-form' class='clearfix'>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-full'>Nombre<span style='color:red'>*</span>{nombre}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row', id='elarchivo'>";
    t1 += "<div class='column-full'>Archivo Actual<span style='color:red'>*</span>{nombrearchivo}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-full'>Subir Archivo<span style='color:red'>*</span>{fileToUpload}</div>";
    t1 += "</div>";

    t1 += "<hr style='width:100%;'/>";
    t1 += "<div> {sData} {cData}  </div>";

    t1 += "</div>";

    var $grid = $("#grid"),
        tipoInstalacionModel = [{
                label: 'Plantilla',
                name: 'id',
                key: true,
                hidden: true,
                // width: 50,
                editable: true,
                hidedlg: true,
                sortable: false,
                editrules: {
                    edithidden: false
                },
                formatter: function (cellvalue, options, rowObject) {
                    return returnDocLink(cellvalue, options, rowObject);
                },
            },

            {
                label: 'Nombre',
                name: 'nombre',
                width: 902,
                align: "left",
                editable: true
            },
            {
                label: 'nombrearchivo',
                name: 'nombrearchivo',
                hidden: false,
                width: 902,
                align: "left",
                editable: true,
                editoptions: {
                    custom_element: labelEditFunc,
                    custom_value: getLabelValue
                }
            },
            {
                name: 'fileToUpload',
                hidden: true,
                editable: true,
                edittype: 'file',
                editrules: {
                    edithidden: true
                },
                editoptions: {
                    enctype: "multipart/form-data"
                },
                search: false
            }
        ];

    $grid.jqGrid({
        url: '/lic/tipoInstalacion',
        datatype: "json",
        mtype: "GET",
        colModel: tipoInstalacionModel,
        page: 1,
        rowNum: 20,
        regional: 'es',
        height: 'auto',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default     
        viewrecords: true,
        pager: "#pager",
        editurl: '/lic/tipoInstalacion',
        caption: 'Tipos de Instalaciones',
        styleUI: "Bootstrap",
        onSelectRow: function (id) {
            var getID = $(this).jqGrid('getCell', id, 'id');
        },
    });

    //$grid.jqGrid('filterToolbar', { stringResult: true, searchOperators: false, searchOnEnter: false, defaultSearch: 'cn' });

    $grid.jqGrid('navGrid', '#pager', {
        edit: true,
        add: true,
        del: true,
        search: false
    }, {
        editCaption: "Modifica Tipo de Instalación",
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
        afterSubmit: UploadDoc

    }, {
        addCaption: "Agrega Tipo de Documento",
        closeAfterAdd: true,
        recreateForm: true,
        mtype: 'POST',
        ajaxEditOptions: sipLibrary.jsonOptions,
        serializeEditData: sipLibrary.createJSON,
        template: t1,
        // beforeSubmit: function (postdata, formid) {
        //     if (postdata.nombrecorto.trim().length == 0) {
        //         return [false, "Nombre: El documento debe tener nombre", ""];
        //     } else {
        //         return [true, "", ""]
        //     }
        // },
        // beforeShowForm: function (form) {
        //     $("#elarchivo").empty().html('');
        // },
        // errorTextFormat: function (data) {
        //     return 'Error: ' + data.responseText

        // },
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
            url: '/lic/tipoInstalacion/upload',
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
$("#pager_left").css("width", "");

    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        //$("#grid").jqGrid("setGridWidth",$("#gcontainer").width() );
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });

function returnDocLink(cellValue, options, rowdata) {
    return "<a href='/docs/tipoinstalacion/" + rowdata.nombrearchivo + "' ><img border='0'  src='../images/file.gif' width='16' height='16'></a>";
}