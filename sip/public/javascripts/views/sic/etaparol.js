$(document).ready(function () {

    var t1 = "<div id='responsive-form' class='clearfix'>";


    t1 += "<div class='form-row'>";
    t1 += "<div class='column-full'>Etapas<span style='color:red'>*</span>{idetapa}</div>";
    t1 += "</div>";

    t1 += "<div class='form-row'>";
    t1 += "<div class='column-full'>Rol<span style='color:red'>*</span>{idrol}</div>";
    t1 += "</div>";

    t1 += "<hr style='width:100%;'/>";
    t1 += "<div> {sData} {cData}  </div>";

    t1 += "</div>";

    var $grid = $("#grid"),
        etapaRolModel = [
            {
                label: 'id', name: 'id', key: true, hidden: true
            },
            // {
            //     label: 'Etapa', name: 'idetapa', width: 50, align: 'left', search: true, editable: true, hidden: false
            // }
            {
                label: 'Etapa',
                name: 'idetapa',
                jsonmap: 'valore.nombre',
                search: false,
                editable: true,
                hidden: false,
                edittype: "select",
                editoptions: {
                    dataUrl: '/sic/etapassolicitud',
                    buildSelect: function (response) {
                        var rowKey = $grid.getGridParam("selrow");
                        var rowData = $grid.getRowData(rowKey);
                        var thissid = rowData.idetapa;
                        var data = JSON.parse(response);
                        var s = "<select>";
                        s += '<option value="0">--Escoger una Etapa--</option>';
                        $.each(data, function (i, item) {

                            if (data[i].id == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                            }
                        });
                        return s + "</select>";
                    }
                }
            },
            {
                label: 'Rol',
                name: 'idrol',
                jsonmap: 'rol.glosarol',
                search: false,
                editable: true,
                hidden: false,
                edittype: "select",
                editoptions: {
                    dataUrl: '/sic/rolSIC',
                    buildSelect: function (response) {
                        var rowKey = $grid.getGridParam("selrow");
                        var rowData = $grid.getRowData(rowKey);
                        var thissid = rowData.idrol;
                        var data = JSON.parse(response);
                        var s = "<select>";
                        s += '<option value="0">--Escoger un Rol--</option>';
                        $.each(data, function (i, item) {

                            if (data[i].id == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].glosarol + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].glosarol + '</option>';
                            }
                        });
                        return s + "</select>";
                    }
                }
            }
            // {
            //     label: 'Rol', name: 'idrol', width: 50, align: 'left', search: true, editable: true, hidden: false
            // }
        ];

    $grid.jqGrid({
        url: '/sic/etaparol/list',
        datatype: "json",
        mtype: "GET",
        colModel: etapaRolModel,
        page: 1,
        rowNum: 20,
        regional: 'es',
        height: 'auto',
        width: 1200,
        shrinkToFit: true,
        viewrecords: true,
        editurl: '/sic/etaparol/list',
        caption: 'Etapas por Rol',
        styleUI: "Bootstrap",
        onSelectRow: function (id) {
            var getID = $(this).jqGrid('getCell', id, 'id');
        },
        pager: "#pager",
    });

    $grid.jqGrid('navGrid', '#pager', { edit: true, add: true, del: true, search: false },
        {
            editCaption: "Modificar el Rol de una Etapa",
            closeAfterEdit: true,
            recreateForm: true,
            mtype: 'POST',
            url: '/sic/etaparol/action',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: t1
        }, {
            addCaption: 'Agregar un Rol a una Etapa',
            closeAfterAdd: true,
            recreateForm: true,
            mtype: 'POST',
            url: '/sic/etaparol/action',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: t1
        });

})
