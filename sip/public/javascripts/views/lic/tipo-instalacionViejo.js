(function ($, _) {
    'use strict';
    var zs = window.zs;
    $(function () {
        var $table = $('#gridMaster');
        var viewModel = [{
                label: 'ID',
                name: 'id',
                key: true,
                hidden: true,
                editable: false,
                formatter: function (cellvalue, options, rowObject) { return returnDocLink(cellvalue, options, rowObject); },
            }, {
                label: 'Nombre',
                name: 'nombre',
                width: 200,
                align: 'center',
                editable: true,
                editrules: {
                    required: true
                },
                editoptions: {
                    fullRow: true
                },
                search: true
            },
            {
                name: 'fileToUpload',
                label: 'Cargar Archivo',
                hidden: true,
                editable: true,
                edittype: 'file',
                editrules: {
                    edithidden: true
                },
                editoptions: {
                    fullRow: true,
                    enctype: "multipart/form-data"
                },
                search: false
            },
            {
                id: 'elarchivo',
                label: 'Nombre Archivo',
                name: 'nombrearchivo',
                hidden: false,
                width: 100,
                align: "left",
                editable: true,
                editoptions: {
                    custom_element: labelEditFunc,
                    custom_value: getLabelValue
                }
            }            
        ];

        function beforeShowForm(form) {
            $('input#nombrearchivo', form).attr('readonly', 'readonly');
        }

        function beforeShowFormADD(form) {
            $("elarchivo").empty().html('');
        }

        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Tipo de Instalación', 'Editar Tipo de Instalación', 'Agregar Tipo de Instalación', '/lic/tipoInstalacion', viewModel, 'nombre', '/lic/getsession', ['Administrador LIC']);
        grid.config.rowNum = 20;
        grid.config.sortorder = 'asc';
        grid.prmAdd.beforeShowForm = beforeShowForm;
        grid.prmEdit.beforeShowForm = beforeShowForm;
        grid.prmEdit.afterSubmit = UploadDoc;
        grid.build();
    });

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
                data: { id: id },
                success: function (data, status) {
                    if (typeof (data.success) != 'undefined') {
                        if (data.success == true) {
                            dialog.find('.bootbox-body').html(data.message);
                            $("#grid").trigger('reloadGrid');
                        } else {
                            dialog.find('.bootbox-body').html(data.message);
                        }
                    }
                    else {
                        dialog.find('.bootbox-body').html(data.message);
                    }
                },
                error: function (data, status, e) {
                    dialog.find('.bootbox-body').html(e);
                }
            })
        });
    }
    function returnDocLink(cellValue, options, rowdata) {
        return "<a href='/docs/tipoinstalacion/" + rowdata.nombrearchivo + "' ><img border='0'  src='../images/file.gif' width='16' height='16'></a>";
    }

})(jQuery, _);