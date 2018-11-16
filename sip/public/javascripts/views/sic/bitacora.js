//doc.js
var gridBitacora = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        //var $gridTab = $(targ + "_t")
        var $gridTab = $(targ + "_t_" + parentRowKey)

        var tmplBita = "<div id='responsive-form' class='clearfix'>";

        tmplBita += "<hr style='width:100%;'/>";
        tmplBita += "<div> {sData} {cData}  </div>";
        tmplBita += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['id', 'Tabla', 'Registro', 'Acción', 'Datos', 'ID Usuario', 'Nombre', 'Apellido', 'Fecha'],
            colModel: [
                { name: 'id', index: 'id', key: true, hidden: true },
                {
                    name: 'tabla', index: 'tabla', width: 100, search: true, editable: true, stype: 'select', searchoptions: {
                        dataUrl: '/bitacora/combobox',
                        width: 100,
                        buildSelect: function (response) {
                            var data = JSON.parse(response);
                            var s = "<select>";
                            s += '<option value="0">--Escoger Tabla--</option>';
                            $.each(data, function (i, item) {
                                s += '<option value="' + data[i].tabla + '">' + data[i].tabla + '</option>';
                            });
                            return s + "</select>";
                        }
                    }
                },
                {
                    name: 'idregistro', index: 'idregistro', label: 'Registro', width: 70, editable: true, search: true,
                    searchoptions: {
                        sopt: ["eq"]
                    }
                },
                {
                    name: 'accion', index: 'accion', width: 70, editable: true, search: false, stype: 'select', searchoptions: {
                        dataUrl: '/bitacora/comboboxaction',
                        buildSelect: function (response) {
                            var data = JSON.parse(response);
                            var s = "<select>";
                            s += '<option value="0">--Escoger Acción--</option>';
                            $.each(data, function (i, item) {
                                s += '<option value="' + data[i].id + '">' + data[i].accion + '</option>';
                            });
                            return s + "</select>";
                        }
                    }
                },
                { name: 'dataold', index: 'accion', width: 350, editable: true, search: false },
                { name: 'idusuario', label: '', width: 70, editable: true, search: false, editoptions: { size: 10 } },
                { name: 'user.first_name', index: 'user.first_name', width: 100, editable: true, search: false },
                { name: 'user.last_name', index: 'user.last_name', width: 100, editable: true, search: false },
                {
                    name: 'fecha', width: 100, align: 'left', search: false,
                    formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
                    editable: true, editrules: { required: true },
                    searchoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                language: 'es',
                                format: 'dd-mm-yyyy',
                                autoclose: true,
                                orientation: 'bottom',
                                /*
                                onSelect: function (dateText, inst) {
                                    setTimeout(function () {
                                        $gridTab[0].triggerToolbar();
                                    }, 100);
                                }*/
                            });
                        },
                        sopt: ["eq", "le", "ge"]
                    },
                    editoptions: {
                        size: 10, maxlengh: 10,
                        dataInit: function (element) {
                            $(element).mask("00-00-0000", { placeholder: "__-__-____" });
                            $(element).datepicker({ language: 'es', format: 'dd-mm-yyyy', autoclose: true })
                        }
                    },
                },
            ],
            rowNum: 10,
            rowList: [3, 6],
            pager: '#navGridBita',
            styleUI: "Bootstrap",
            sortname: 'id',
            sortorder: "asc",
            shrinkToFit: false,
            height: "auto",
            width: null,
            //editurl: '/bitacora/action',
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Bitacora"
        });
        $gridTab.jqGrid('filterToolbar', {
            stringResult: true,
            searchOperators: true,
            searchOnEnter: true,
            defaultSearch: 'cn',
            afterSearch: function () {

            }
        });

        $gridTab.jqGrid('navGrid', '#navGridBita', { edit: false, add: false, del: false, search: false },
            {
                editCaption: "Modifica",
                closeAfterEdit: true,
                recreateForm: true,
                template: tmplBita,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
            }, {
                addCaption: "Agrega Responsable",
                mtype: 'POST',
                url: '/sic/bitacora/action',
                closeAfterAdd: true,
                recreateForm: true,
                template: tmplBita,
                mtype: 'POST',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                beforeShowForm: function (form) {
                    //$('input#notacriticidad', form).attr('readonly', 'readonly');
                },
                beforeSubmit: function (postdata, formid) {
                    if (postdata.idrol == 0) {
                        return [false, "Rol: Campo obligatorio", ""];
                    } if (postdata.idresponsable == 0) {
                        return [false, "Responsable : Campo obligatorio", ""];
                    } else {
                        return [true, "", ""]
                    }
                },
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                }

            },
            {
                closeAfterDelete: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                addCaption: "Eliminar Responsable",
                mtype: 'POST',
                url: '/sic/bitacora/action',
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                }
            }
        );

        $("table.ui-jqgrid-htable").css('width','100%');
    $("table.ui-jqgrid-btable").css('width','100%');



    }
}

