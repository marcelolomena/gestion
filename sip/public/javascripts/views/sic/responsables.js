//doc.js
var gridResponsables = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        //var $gridTab = $(targ + "_t")
        var $gridTab = $(targ + "_t_" + parentRowKey)

        var tmplServ = "<div id='responsive-form' class='clearfix'>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'>Rol<span style='color:red'>*</span>{idrol}</div>";
        tmplServ += "</div>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'>Responsable<span style='color:red'>*</span>{idresponsable}</div>";
        tmplServ += "</div>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'>Fecha Tardía<span style='color:red'>*</span>{fechamastardia}</div>";
        tmplServ += "</div>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'>Descripción Deberes en el Proceso<span style='color:red'>*</span>{descripciondeberesproceso}</div>";
        tmplServ += "</div>";

        tmplServ += "<hr style='width:100%;'/>";
        tmplServ += "<div> {sData} {cData}  </div>";
        tmplServ += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['id', 'idrol', 'Rol', 'idresponsable', 'Nombre Responsable', 'Apellido Responsable', 'Fecha Más Tardía', 'Descripción'],
            colModel: [
                { name: 'id', index: 'id', key: true, hidden: true },
                {
                    name: 'idrol', search: false, editable: true, hidden: true,
                    edittype: "select",
                    editoptions: {
                        dataUrl: '/sic/getroles',
                        buildSelect: function (response) {
                            var rowKey = $gridTab.getGridParam("selrow");
                            var rowData = $gridTab.getRowData(rowKey);
                            var thissid = rowData.idrol;
                            var data = JSON.parse(response);
                            var s = "<select>";//el default
                            s += '<option value="0">--Seleccione un Rol--</option>';
                            $.each(data, function (i, item) {

                                if (data[i].id == thissid) {
                                    s += '<option value="' + data[i].id + '" selected>' + data[i].glosarol + '</option>';
                                } else {
                                    s += '<option value="' + data[i].id + '">' + data[i].glosarol + '</option>';
                                }
                            });
                            return s + "</select>";
                        },
                        dataEvents: [{
                            type: 'change', fn: function (e) {
                                //$("input#lider").val($('option:selected', this).val());
                                var idrol = $('option:selected', this).val();

                                if (idrol != "0") {
                                    $.ajax({
                                        type: "GET",
                                        url: '/sic/usuarios_por_rolid/' + idrol,
                                        async: false,
                                        success: function (data) {
                                            var grid = $gridTab;
                                            var rowKey = grid.getGridParam("selrow");
                                            var rowData = grid.getRowData(rowKey);
                                            var thissid = rowData.idresponsable;
                                            var s = "<select>";//el default
                                            s += '<option value="0">--Escoger Responsable--</option>';
                                            $.each(data, function (i, item) {
                                                if (data[i].uid == thissid) {
                                                    s += '<option value="' + data[i].uid + '" selected>' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                                                } else {
                                                    s += '<option value="' + data[i].uid + '">' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                                                }
                                            });
                                            s += "</select>";
                                            //lahora = new Date();
                                            //console.log('Termina el for a las ' + lahora.getHours() + ":" + lahora.getMinutes() + ":" + lahora.getSeconds());
                                            $("select#idresponsable").empty().html(s);
                                            //lahora = new Date();
                                            //console.log('Seteo el html a las ' + lahora.getHours() + ":" + lahora.getMinutes() + ":" + lahora.getSeconds());
                                        }
                                    });
                                }

                            }
                        }],
                    }
                },

                { name: 'rol.glosarol', index: 'glosarol', width: 150, editable: true, editoptions: { size: 10 } },
                {
                    name: 'idresponsable', search: false, editable: true, hidden: true,
                    edittype: "select",
                    editoptions: {
                        value: "0:--Escoger Responsable--"
                    }
                },
                { name: 'user.first_name', index: 'servicio', width: 150, editable: true, editoptions: { size: 10 } },
                { name: 'user.last_name', index: 'servicio', width: 150, editable: true, editoptions: { size: 10 } },
                {
                    name: 'fechamastardia', width: 100, align: 'left', search: false,
                    formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
                    editable: true, editrules: { required: false },
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
                {
                   name: 'descripciondeberesproceso', width: 500, align: 'left',
                    search: false, editable: true, editoptions: { rows: "3", cols: "50" },
                    editrules: { required: true }, edittype: "textarea", hidden: false
                },


            ],
            rowNum: 10,
            rowList: [3, 6],
            pager: '#navGridResp',
            styleUI: "Bootstrap",
            sortname: 'id',
            sortorder: "asc",
            shrinkToFit: false,
            height: "auto",
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Responsable"
        });
        $gridTab.jqGrid('navGrid', '#navGridResp', { edit: false, add: true, del: true, search: false },
            {
                editCaption: "Modifica Servicio",
                mtype: 'POST',
                url: '/sic/responsables/action',
                closeAfterEdit: true,
                recreateForm: true,
                template: tmplServ,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                beforeSubmit: function (postdata, formid) {
                    if (postdata.idservicio == 0) {
                        return [false, "Servicio: Campo obligatorio", ""];
                    } if (postdata.idclasecriticidad == 0) {
                        return [false, "Clase Criticidad : Campo obligatorio", ""];
                    } else {
                        return [true, "", ""]
                    }
                }
            }, {
                addCaption: "Agrega Responsable",
                mtype: 'POST',
                url: '/sic/responsables/action',
                closeAfterAdd: true,
                recreateForm: true,
                template: tmplServ,
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
                addCaption: "Eliminar Servicio",
                mtype: 'POST',
                url: '/sic/responsables/action',
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                }
            }

        );



    }
}

