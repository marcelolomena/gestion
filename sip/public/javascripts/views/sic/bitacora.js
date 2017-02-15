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
            colNames: ['id', 'tabla', 'idregistro', 'accion', 'dataold', 'idusuario', 'fecha'],
            colModel: [
                { name: 'id', index: 'id', key: true, hidden: true },
                { name: 'tabla', index: 'tabla', label: 'Tabla', width: 150, editable: true, search: true,editoptions: { size: 10 } },
                { name: 'idregistro', index: 'idregistro', label: 'Registro', width: 100, editable: true, editoptions: { size: 10 } },
                { name: 'accion', index: 'accion', width: 100, editable: true, editoptions: { size: 10 } },
                { name: 'dataold', index: 'accion', width: 700, editable: true, editoptions: { size: 10 } },
                { name: 'idusuario', label: '', width: 50, editable: true, editoptions: { size: 10 } },

                {
                    label: 'Fecha', name: 'fecha',
                    width: 150, align: 'center', search: true, editable: true, hidden: false,
                    formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' },
                    searchoptions: {
                        dataInit: function (el) {
                            $(el).datepicker({
                                language: 'es',
                                format: 'yyyy-mm-dd',
                                autoclose: true
                            });
                        },
                        sopt: ["eq", "le", "ge"]
                    },
                    editoptions: {
                        size: 10, maxlengh: 10,
                        dataInit: function (element) {
                            $(element).mask("0000-00-00", { placeholder: "____-__-__" });
                            $(element).datepicker({ language: 'es', format: 'yyyy-mm-dd', autoclose: true })
                        }
                    }
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
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Bitacora"
        }).jqGrid('filterToolbar', {
        stringResult: true,
        searchOnEnter: true,
        defaultSearch: "cn",
        searchOperators: true,
        afterSearch: function () {

        }
    });;
        
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



    }
}

