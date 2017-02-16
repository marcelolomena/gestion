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
            colNames: ['id', 'Tabla', 'Registro', 'Acción', 'Datos', 'ID Usuario', 'Nombre Responsable', 'Apellido Responsable','Fecha'],
            colModel: [
                { name: 'id', index: 'id', key: true, hidden: true },
                { name: 'tabla', index: 'tabla', width: 150, editable: true, search: true,editoptions: { size: 10 } },
                { name: 'idregistro', index: 'idregistro', label: 'Registro', width: 100, editable: true, editoptions: { size: 10 } },
                { name: 'accion', index: 'accion', width: 100, editable: true, editoptions: { size: 10 } },
                { name: 'dataold', index: 'accion', width: 700, editable: true, editoptions: { size: 10 } },
                { name: 'idusuario', label: '', width: 100, editable: true, editoptions: { size: 10 } },
                { name: 'user.first_name', index: 'servicio', width: 250, editable: true, editoptions: { size: 10 } },
                { name: 'user.last_name', index: 'servicio', width: 250, editable: true, editoptions: { size: 10 } },
                {
                    name: 'fecha', width: 100, align: 'left', search: false,
                    formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
                    editable: true, editrules: { required: true },
                    searchoptions: {
                        dataInit: function (el) {
                            $(el).datepicker({
                                language: 'es',
                                format: 'dd-mm-yyyy',
                                autoclose: true,
                                onSelect: function (dateText, inst) {
                                    setTimeout(function () {
                                        $gridTab[0].triggerToolbar();
                                    }, 100);
                                }
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

