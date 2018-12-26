$(document).ready(function () {
    var t1 = "<div id='responsive-form' class='clearfix'>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-half'>Producto<span style='color:red'>*</span>{nombre}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-full'>Versión<span style='color:red'>*</span>{aplicacion}</div>";
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
                label: 'Producto',
                name: 'nombre',
                align: 'left',
                width: 70,
                editable: true,
                hidden: false,
                search: true,
                sortable: false
            },
            {
                label: 'Versión',
                name: 'aplicacion',
                search: true,
                editable: true,
                hidden: true,
                edittype: "select",
                editoptions: {
                    value: "0:--Escoger de Versión--",
                    dataEvents: [{
                        type: 'change',
                        fn: function (e) {
                            $("input#aplicacion").val($('option:selected', this).text());
                        }
                    }],
                }
            }
        ];

    $grid.jqGrid({
        url: '/lic/ProductoPendiente',
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
        editurl: '/lic/ProductoPendiente',
        caption: 'Traducciones Pendientes para Productos',
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
        editCaption: "Modifica Traducción",
        closeAfterEdit: true,
        recreateForm: true,
        template: t1,
        mtype: 'POST',
        url: '/lic/ProductoPendiente',
        ajaxEditOptions: sipLibrary.jsonOptions,
        serializeEditData: sipLibrary.createJSON,
        beforeShowForm: function (form) {
            var grid = $("#grid");
            var rowKey = grid.getGridParam("selrow");
            var rowData = grid.getRowData(rowKey);
            var thissid = rowData.nombre;

            setTimeout(function () {
                $("#nombre", form).attr('disabled', 'disabled');
                $.ajax({
                    type: "GET",
                    url: '/lic/getLikeVersiones/' + thissid,
                    success: function (data) {
                        var s = "<select>"; //el default
                        s += '<option value="0">--Escoger la Versión--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].aplicacion == thissid) {
                                s += '<option value="' + data[i].aplicacion + '" selected>' + data[i].aplicacion + '</option>';
                            } else {
                                s += '<option value="' + data[i].aplicacion + '">' + data[i].aplicacion + '</option>';
                            }
                        });
                        s += "</select>";
                        $("select#aplicacion").html(s);
                    },
                    error: function (e) {}

                });
            }, 500);
        }
    });

})