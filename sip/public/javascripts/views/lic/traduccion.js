$(document).ready(function () {
    var tmpl; //Sin edición
    var viewModel = [{
            label: 'ID',
            name: 'id',
            key: true,
            hidden: true,
            editable: false
        },
        {
            label: 'Producto',
            name: 'idProducto',
            jsonmap: 'producto.nombre',
            width: 400,
            align: 'left',
            sortable: false,
            editable: true,
            edittype: 'select',
            editrules: {
                required: true
            },
            search: true,
            editoptions: {
                dataUrl: '/lic/producto',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idProducto;
                    var data = JSON.parse(response);
                    var s = "<select>";
                    var sel = false;
                    s += '<option value="0">--Escoger Producto--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].nombre == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            },
            dataInit: function (elem) {
                $(elem).width(200);
            }
        },
        // {
        //     label: 'Producto',
        //     name: 'idProducto',
        //     jsonmap: 'producto.nombre',
        //     width: 250,
        //     align: 'center',
        //     sortable: false,
        //     editable: true,
        //     edittype: 'select',
        //     editoptions: {
        //         fullRow: true,
        //         dataUrl: '/lic/producto',
        //         buildSelect: function (response) {
        //             var rowData = $table.getRowData($table.getGridParam('selrow'));
        //             var thissid = rowData.nombre;
        //             var data = JSON.parse(response);
        //             return new zs.SelectTemplate(data, 'Seleccione el Producto', thissid).template;
        //         },
        //     },
        //     editrules: {
        //         required: true
        //     },
        //     search: true
        // }, 
        {
            label: 'Nombre Versión',
            name: 'nombre',
            width: 600,
            editable: true
        }
    ];
    $("#grid").jqGrid({
        url: '/lic/traduccion',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: viewModel,
        rowNum: 20,
        regional: 'es',
        height: 'auto',
        sortable: "true",
        width: null,
        shrinkToFit: false,
        viewrecords: true,
        caption: 'Traducciones',
        pager: "#pager",
        rowList: [20, 30, 40, 50],
        styleUI: "Bootstrap",
        editurl: '/lic/traduccion',
        subGrid: false // set the subGrid property to true to show expand buttons for each row
    },'filterToolbar', {
        stringResult: true,
        searchOperators: true,
        searchOnEnter: false,
        defaultSearch: 'cn'
    },'navGrid', "#pager", {
            edit: true,
            add: true,
            del: true,
            refresh: true,
            search: false, // show search button on the toolbar        
            cloneToTop: false
        },

        {
            editCaption: "Modifica Visación",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl
        }, {
            addCaption: "Agrega Traduccion",
            closeAfterAdd: true,
            recreateForm: true,
            mtype: 'POST',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl
        },'navButtonAdd', '#pager', {
        caption: "",
        buttonicon: "glyphicon glyphicon-hdd",
        title: "Refrescar SNOW",
        position: "last",
        onClickButton: function () {
            var dialog = bootbox.dialog({
                title: 'Procedimiento SNOW',
                message: '<p><i class="fa fa-spin fa-spinner"></i> Actualizando...</p>'
            });
            dialog.init(function () {
                setTimeout(function () {
                    $.ajax({
                        url: "/lic/actualizarSnow",
                        dataType: 'json',
                        async: false,
                        success: function (j) {
                            dialog.find('.bootbox-body').html('Fue actualizado la suite de productos!');
                        },
                        error: function (errorThrown) {
                            dialog.find('.bootbox-body').html('Hubo un problema con la actualización!');
                        }
                    });
                }, 6000);
            });
        }},'navButtonAdd', '#pager', {
        caption: "",
        buttonicon: "glyphicon glyphicon-tasks",
        title: "Refrescar ADDM",
        position: "last",
        onClickButton: function () {
            var dialog = bootbox.dialog({
                title: 'Procedimiento ADDM',
                message: '<p><i class="fa fa-spin fa-spinner"></i> Actualizando...</p>'
            });
            dialog.init(function () {
                setTimeout(function () {
                    $.ajax({
                        url: "/lic/actualizarAddm",
                        dataType: 'json',
                        async: false,
                        success: function (j) {
                            dialog.find('.bootbox-body').html('Fue actualizado la suite de productos!');
                        },
                        error: function (errorThrown) {
                            dialog.find('.bootbox-body').html('Hubo un problema con la actualización!');
                        }
                    });
                }, 6000);
            });
        }},'navButtonAdd', '#pager', {
        caption: "",
        buttonicon: "glyphicon glyphicon-repeat",
        title: "Refrescar Chubi",
        position: "last",
        onClickButton: function () {
            var dialog = bootbox.dialog({
                title: 'Procedimiento Chequeo de Alertas',
                message: '<p><i class="fa fa-spin fa-spinner"></i> Actualizando...</p>'
            });
            dialog.init(function () {
                setTimeout(function () {
                    $.ajax({
                        url: "/lic/actualizarChubi",
                        dataType: 'json',
                        async: false,
                        success: function (j) {
                            dialog.find('.bootbox-body').html('Fue actualizado la suite de productos!');
                        },
                        error: function (errorThrown) {
                            dialog.find('.bootbox-body').html('Hubo un problema con la actualización!');
                        }
                    });
                }, 6000);
            });
        }
    });
    $("#pager_left").css("width", "");
});