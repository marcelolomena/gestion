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
                search: false
            },
            // {
            //     label: 'Tipo de Instalación',
            //     name: 'tipoinstalacion',
            //     width: 90,
            //     align: 'center',
            //     editable: true,
            //     edittype: "custom",
            //     editoptions: {
            //         fullRow: true,
            //         custom_value: sipLibrary.getRadioElementValue,
            //         custom_element: sipLibrary.radioElemInstalacion
            //     },
            //     search: false
            // },
            {
                label: 'Producto',
                name: 'idProducto',
                jsonmap: 'producto.nombre',
                width: 250,
                align: 'center',
                sortable: false,
                editable: true,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/misAutorizaciones',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.nombre;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione el Producto', thissid).template;
                    },
                    dataEvents: [{
                        type: 'change',
                        fn: function (e) {
                            var thisval = $(this).val();
                            if (thisval) {

                                $.ajax({
                                    type: "GET",
                                    url: '/lic/miscodigos/' + thisval,
                                    async: false,
                                    success: function (data) {
                                        if (data) {
                                            $("input#codautorizacion").val(data.codAutorizacion);
                                            $("#codautorizacion").attr('disabled', true);
                                        } else {
                                            alert("No existe codigo de autorizacion para este Producto");
                                        }
                                    }
                                });
                            }
                        }
                    }],
                },
                editrules: {
                    required: true
                },
                search: false
            },
            {
                label: 'Código de Autorización',
                name: 'codautorizacion',
                align: 'center',
                width: 100,
                editable: true,
                editrules: {
                    required: true
                },
                search: false
            },
            {
                label: '¿Quien soy Yo?',
                name: 'informacion',
                width: 400,
                hidden: false,
                editable: true,
                edittype: 'custom',
                editoptions: {
                    fullRow: true,
                    custom_element: function (value, options) {
                        var elm = $("<textarea></textarea>");
                        elm.val(value);
                        setTimeout(function () {
                            //tinymce.remove();
                            //var ctr = $("#" + options.id).tinymce();
                            //if (ctr !== null) {
                            //    ctr.remove();
                            //}
                            try {
                                tinymce.remove("#" + options.id);
                            } catch (ex) {}
                            tinymce.init({
                                // selector: 'textarea',
                                // plugins: 'image',
                                // toolbar: 'image',
                                
                                // // without images_upload_url set, Upload tab won't show up
                                // images_upload_url: 'postAcceptor.php',
                                
                                // // we override default upload handler to simulate successful upload
                                // images_upload_handler: function (blobInfo, success, failure) {
                                //   setTimeout(function() {
                                //     // no matter what you upload, we will turn it into TinyMCE logo :)
                                //     success('http://moxiecode.cachefly.net/tinymce/v9/images/logo.png');
                                //   }, 2000);
                                // }














                                // selector: 'textarea',
                                // plugins: 'image code',
                                // toolbar: 'undo redo | image code',

                                // // without images_upload_url set, Upload tab won't show up
                                // images_upload_url: 'postAcceptor.php',

                                // // we override default upload handler to simulate successful upload
                                // images_upload_handler: function (blobInfo, success, failure) {
                                //     setTimeout(function () {
                                //         // no matter what you upload, we will turn it into TinyMCE logo :)
                                //         success('http://moxiecode.cachefly.net/tinymce/v9/images/logo.png');
                                //     }, 2000);
                                // },

                                // init_instance_callback: function (ed) {
                                //     ed.execCommand('mceImage');
                                // }




                                // selector: 'textarea',  // change this value according to your html
                                // images_upload_url: 'postAcceptor.php',
                                // images_upload_base_path: '/some/basepath',
                                // images_upload_credentials: true


                                menubar: false,
                                statusbar: false,
                                selector: 'textarea',
                                plugins: 'image code',
                                toolbar: 'image',
                                image_advtab: true,
                                height: 300,


                                // selector: 'textarea',
                                // plugins: 'image code',
                                // toolbar: 'image',

                                // // without images_upload_url set, Upload tab won't show up
                                // images_upload_url: 'postAcceptor.php',

                                // // we override default upload handler to simulate successful upload
                                // images_upload_handler: function (blobInfo, success, failure) {
                                //     setTimeout(function () {
                                //         // no matter what you upload, we will turn it into TinyMCE logo :)
                                //         success('http://moxiecode.cachefly.net/tinymce/v9/images/logo.png');
                                //     }, 2000);
                                // },

                                // init_instance_callback: function (ed) {
                                //     ed.execCommand('mceImage');
                                // }
                            });
                        }, 50);
                        return elm;
                    },
                    custom_value: function (element, oper, gridval) {
                        var id;
                        if (element.length > 0) {
                            id = element.attr("id");
                        } else if (typeof element.selector === "string") {
                            var sels = element.selector.split(" "),
                                idSel = sels[sels.length - 1];
                            if (idSel.charAt(0) === "#") {
                                id = idSel.substring(1);
                            } else {
                                return "";
                            }
                        }
                        if (oper === "get") {
                            return tinymce.get(id).getContent({
                                format: "row"
                            });
                        } else if (oper === "set") {
                            if (tinymce.get(id)) {
                                tinymce.get(id).setContent(gridval);
                            }
                        }
                    }
                },
                editrules: {
                    required: true
                },
                search: false
            }
        ];
        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Solicitud de Instalación', 'Editar Instalación', 'Agregar Instalación', '/lic/instalacionSolicitud', viewModel, 'estado', '/lic/getsession', ['Administrador LIC']);
        grid.build();
    });

})(jQuery, _);