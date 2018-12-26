$(document).ready(function () {
    var t1 = "<div id='responsive-form' class='clearfix'>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half'>Versiones<span style='color:red'>*</span>{aplicacion}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-full'>Producto<span style='color:red'>*</span>{nombre}</div>";
    t1 += "</div>";

    t1 += "<hr style='width:100%;'/>";
    t1 += "<div> {sData} {cData}  </div>";

    t1 += "</div>";

    var $grid = $("#grid"),

        Model = [{
                label: 'id',
                name: 'id',
                key: true,
                hidden: true,
                editable: false
            },
            {
                label: 'Versiones',
                name: 'aplicacion',
                align: 'left',
                width: 70,
                editable: true,
                hidden: false,
                search: true,
                sortable: false
            },
            {
                label: 'Producto',
                name: 'nombre',
                search: true,
                editable: true,
                hidden: true,
                edittype: "select",
                editoptions: {
                    value: "0:--Escoger de Producto--",
                    dataEvents: [{
                        type: 'change',
                        fn: function (e) {
                            $("input#nombre").val($('option:selected', this).text());
                        }
                    }],
                }
            }
        ];

    $grid.jqGrid({
        url: '/lic/VersionPendiente',
        datatype: "json",
        mtype: "GET",
        colModel: Model,
        page: 1,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        width: 1200,
        shrinkToFit: true,
        viewrecords: true,
        editurl: '/lic/VersionPendiente',
        caption: 'Traducciones Pendientes para Versiones',
        styleUI: "Bootstrap",
        onSelectRow: function (id) {
            var getID = $(this).jqGrid('getCell', id, 'id');
        },
        pager: "#pager",
    });

    $grid.jqGrid('navGrid', '#pager', {
        edit: true,
        add: false,
        del: false,
        search: false
    }, {
        editCaption: "Seleccionar Versión",
        closeAfterEdit: true,
        recreateForm: true,
        template: t1,
        mtype: 'POST',
        url: '/lic/VersionPendiente',
        ajaxEditOptions: sipLibrary.jsonOptions,
        serializeEditData: sipLibrary.createJSON,
        beforeShowForm: function (form) {
            var grid = $("#grid");
            var rowKey = grid.getGridParam("selrow");
            var rowData = grid.getRowData(rowKey);
            var thissid = rowData.aplicacion;

            setTimeout(function () {
                $("#aplicacion", form).attr('disabled', 'disabled');
                $.ajax({
                    type: "GET",
                    url: '/lic/getLikeProductos/' + thissid,
                    success: function (data) {
                        var s = "<select>"; //el default
                        s += '<option value="0">--Escoger la Versión--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].nombre == thissid) {
                                s += '<option value="' + data[i].nombre + '" selected>' + data[i].nombre + '</option>';
                            } else {
                                s += '<option value="' + data[i].nombre + '">' + data[i].nombre + '</option>';
                            }
                        });
                        s += "</select>";
                        $("select#nombre").html(s);
                    },
                    error: function (e) {}

                });
            }, 500);
        }
    });

})