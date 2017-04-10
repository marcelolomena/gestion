//doc.js
var gridCalendario = {



    renderGrid: function (loadurl, parentRowKey, targ) {
        //var $gridTab = $(targ + "_t")
        var $gridTab = $(targ + "_t_" + parentRowKey)



        var tmplServ = "<div id='responsive-form' class='clearfix'>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'>Descripción<span style='color:red'>*</span>{descripcion}</div>";
        tmplServ += "</div>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'>Fecha Esperada<span style='color:red'>*</span>{fechaesperada}</div>";
        tmplServ += "</div>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'>Fecha Real<span style='color:red'>*</span>{fechareal}</div>";
        tmplServ += "</div>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'>Observación<span style='color:red'>*</span>{observacion}</div>";
        tmplServ += "</div>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'>Tipo Responsable<span style='color:red'>*</span>{idtiporesponsable}</div>";
        tmplServ += "</div>";

        tmplServ += "<hr style='width:100%;'/>";
        tmplServ += "<div> {sData} {cData}  </div>";
        tmplServ += "</div>";

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colNames: ['id', 'Descripcion', 'Fecha Esperada', 'Fecha Real', 'Observación', 'idtiporesponsable', 'Responsable'],
            colModel: [
                { name: 'id', index: 'id', key: true, hidden: true },
                { name: 'descripcion', width: 200, editable: true, editoptions: { size: 25 }, editrules: { required: true } },
                {
                    name: 'fechaesperada', width: 150, align: 'left', search: false,
                    formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y H:i' },
                    editable: true, editrules: { required: true },
                    searchoptions: {
                        dataInit: function (el) {
                            $(el).datetimepicker({
                                format: "dd-mm-yyyy hh:ii",
                                weekStart: 1,
                                language: "es",
                                autoclose: true,
                                todayHighlight: true,
                                startDate: todaysDate
                            });
                        },
                        sopt: ["eq", "le", "ge"]
                    },
                    editoptions: {
                        size: 10, maxlengh: 10,
                        dataInit: function (element) {
                            //$(element).mask("00-00-0000", { placeholder: "__-__-____" });
                            $(element).datetimepicker({
                                format: "dd-mm-yyyy hh:ii",
                                weekStart: 1,
                                language: "es",
                                autoclose: true,
                                todayHighlight: true

                            });
                        }
                    },
                },
                {
                    name: 'fechareal', width: 150, align: 'left', search: false,
                    formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y H:i' },
                    editable: true, editrules: { required: false },
                    searchoptions: {
                        dataInit: function (el) {
                            $(el).datetimepicker({
                                format: "dd-mm-yyyy hh:ii",
                                weekStart: 1,
                                language: "es",
                                autoclose: true,
                                todayHighlight: true,
                                startDate: todaysDate
                            });
                        },
                        sopt: ["eq", "le", "ge"]
                    },
                    editoptions: {
                        size: 10, maxlengh: 10,
                        dataInit: function (element) {
                            //$(element).mask("00-00-0000", { placeholder: "__-__-____" });
                            $(element).datetimepicker({
                                format: "dd-mm-yyyy hh:ii",
                                weekStart: 1,
                                language: "es",
                                autoclose: true,
                                todayHighlight: true
                            });
                        }
                    },
                },
                { name: 'observacion', width: 200, editable: true, editoptions: { size: 25 }, editrules: { required: true } },
                {
                    name: 'idtiporesponsable', search: false, editable: true, hidden: true,
                    edittype: "select",
                    editoptions: {
                        dataUrl: '/sic/gettiporesponsable',
                        buildSelect: function (response) {
                            var rowKey = $gridTab.getGridParam("selrow");
                            var rowData = $gridTab.getRowData(rowKey);
                            var thissid = rowData.idrol;
                            var data = JSON.parse(response);
                            var s = "<select>";//el default
                            s += '<option value="0">--Seleccione tipo de Responsable--</option>';
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
                { name: 'valore.nombre', width: 250, editable: true, editoptions: { size: 10 } },




            ],
            rowNum: 10,
            rowList: [3, 6],
            pager: '#navGridCal',
            styleUI: "Bootstrap",
            sortname: 'id',
            sortorder: "asc",
            shrinkToFit: false,
            height: "auto",
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Calendario",
            loadComplete: function (data) {
                var thisId = $.jgrid.jqID(this.id);
                $.get('/sic/getsession', function (data) {
                    $.each(data, function (i, item) {
                        console.log("EL ROL ES: " + item.glosarol)
                        if (item.glosarol != 'Administrador SIC' && item.glosarol != 'Negociador SIC') {
                            $("#add_" + thisId).addClass('ui-disabled');
                            //$("#add_gridMaster").hide();
                            $("#edit_" + thisId).addClass('ui-disabled');
                            //$("#edit__gridMaster").hide();
                            $("#del_" + thisId).addClass('ui-disabled');
                            //$("#del__gridMaster").hide();
                        }
                    });
                });
            }
        });

        $gridTab.jqGrid('navGrid', '#navGridCal', { edit: true, add: true, del: true, search: false },
            {
                editCaption: "Modifica Fecha",
                mtype: 'POST',
                url: '/sic/calendario/action',
                closeAfterEdit: true,
                recreateForm: true,
                template: tmplServ,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                beforeSubmit: function (postdata, formid) {
                    if (postdata.idtiporesponsable == 0) {
                        return [false, "Tipo Responsable: Campo obligatorio", ""];
                    } else {
                        return [true, "", ""]
                    }
                }
            }, {
                addCaption: "Agrega Fecha",
                mtype: 'POST',
                url: '/sic/calendario/action',
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
                    if (postdata.idtiporesponsable == 0) {
                        return [false, "Tipo Responsable: Campo obligatorio", ""];
                    } else {
                        return [true, "", ""]
                    }

                },
                onclickSubmit: function (rowid) {
                    var fechaespe = $("input#fechaesperada").val()
                    console.log("esta es la fecha 1:" +fechaespe)
                    var d = new Date(fechaespe)
                    var dformat = [d.getDate(),
                    d.getMonth() + 1,
                    d.getFullYear()].join('-') + ' ' +
                        [d.getHours(),
                        d.getMinutes(),
                        d.getSeconds()].join(':');
                    var fechaintermedia = new Date(dformat + ' UTC')
                    console.log("esta es la fecha 1:" +fechaintermedia)
                    fechaespe = fechaintermedia
                    console.log("esta es la fecha 1:" +fechaespe)
                    var fecharea = $("input#fechareal").val()
                    console.log("esta es la fecha 1:" +fecharea)
                    var d2 = new Date(fecharea)
                    var dformat2 = [d2.getDate(),
                    d2.getMonth() + 1,
                    d2.getFullYear()].join('-') + ' ' +
                        [d2.getHours(),
                        d2.getMinutes(),
                        d2.getSeconds()].join(':');
                    var fechaintermedia2 = new Date(dformat2 + ' UTC')
                    fecharea = fechaintermedia2


                    return { idsolicitudcotizacion: parentRowKey, fechanueva: fechaespe, fechanuevar: fecharea };
                }

            },
            {
                closeAfterDelete: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                addCaption: "Eliminar Fecha",
                mtype: 'POST',
                url: '/sic/calendario/action',
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                }
            }

        );



    }
}

