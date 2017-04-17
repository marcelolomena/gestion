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

        tmplServ += "<hr style='width:100%;'/>";
        tmplServ += "<div> {sData} {cData}  </div>";
        tmplServ += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['id', 'idrol', 'Rol', 'idresponsable', 'Nombre Responsable', 'Apellido Responsable'],
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
                            if (thissid == "999") {
                                s += '<option value="999" selected>Tecnico Responsable</option>';
                            } else {
                                s += '<option value="999">Tecnico Responsable</option>';
                            }
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
                                    if (idrol == "999") {
                                        $.ajax({
                                            type: "GET",
                                            url: '/sic/tecnicosresponsables/' + parentRowKey,
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
                                                        s += '<option value="' + data[i].uid + '" selected>' + data[i].nombre + ' ' + data[i].apellido + '</option>';
                                                    } else {
                                                        s += '<option value="' + data[i].uid + '">' + data[i].nombre + ' ' + data[i].apellido + '</option>';
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
                                    } else {
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

                            }
                        }],
                    }
                },

                {
                    name: 'rol.glosarol', index: 'glosarol', width: 250, editable: true, editoptions: { size: 10 },
                    formatter: function (cellvalue, options, rowObject) {
                        var dato = '';
                        var val = rowObject.idrol;
                        //console.log(val);
                        if (val == "999") {
                            dato = 'Tecnico Responsable';

                        } else {
                            //console.log(rowObject.rol.glosarol);
                            dato = rowObject.rol.glosarol;
                        }

                        return dato;
                    }
                },
                {
                    name: 'idresponsable', search: false, editable: true, hidden: true,
                    edittype: "select",
                    editoptions: {
                        value: "0:--Escoger Responsable--"
                    }
                },
                { name: 'user.first_name', index: 'servicio', width: 250, editable: true, editoptions: { size: 10 } },
                { name: 'user.last_name', index: 'servicio', width: 250, editable: true, editoptions: { size: 10 } },



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
            caption: "Responsables",
            loadComplete: function (data) {
                var thisId = $.jgrid.jqID(this.id);
                $.get('/sic/getsession', function (data) {
                    $.each(data, function (i, item) {
                        console.log("EL ROL ES: " + item.glosarol)
                        if (item.glosarol != 'Administrador SIC' && item.glosarol != 'Negociador SIC') {
                            $("#add_" + thisId).addClass('ui-disabled');
                            //$("#add_gridMaster").hide();
                            //$("#edit_" + thisId).addClass('ui-disabled');
                            //$("#edit__gridMaster").hide();
                            $("#del_" + thisId).addClass('ui-disabled');
                            //$("#del__gridMaster").hide();
                        }
                    });
                });
            }
        });
        $gridTab.jqGrid('navGrid', '#navGridResp', { edit: false, add: true, del: true, search: false },
            {
                editCaption: "Modifica",
                closeAfterEdit: true,
                recreateForm: true,
                template: tmplServ,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
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
                addCaption: "Eliminar Responsable",
                mtype: 'POST',
                url: '/sic/responsables/action',
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                }
            }

        );



    }
}

