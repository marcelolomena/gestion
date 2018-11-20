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
        tmplServ += "<div class='column-half'>Fecha Esperada<span style='color:red'>*</span>{fechaesperada}</div>";
        tmplServ += "<div class='column-half'>Hora Esperada{horaesperada}</div>";
        tmplServ += "</div>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-half'>Fecha Real{fechareal}</div>";
        tmplServ += "<div class='column-half'>Hora Real{horareal}</div>";
        tmplServ += "</div>";

        tmplServ += "<div class='form-row'>";
        tmplServ += "<div class='column-full'>Observación{observacion}</div>";
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
            colNames: ['id', 'Descripcion', 'Fecha Esperada', 'Hora Esperada', 'Fecha Real', 'Hora Real', 'Observación', 'idtiporesponsable', 'Responsable'],
            colModel: [
                { name: 'id', index: 'id', key: true, hidden: true },
                { name: 'descripcion', width: 200, editable: true, editoptions: { size: 25 }, editrules: { required: true } },
                {
                    name: 'fechaesperada', width: 120, align: 'center', search: true, editable: true, hidden: false,
                    formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' },
                    searchoptions: {
                        dataInit: function (el) {
                            $(el).datepicker({
                                language: 'es',
                                format: 'yyyy-mm-dd',
                                autoclose: true,
                                onSelect: function (dateText, inst) {
                                    setTimeout(function () {
                                        $('#' + subgrid_table_id)[0].triggerToolbar();
                                    }, 100);
                                }
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
                {
                    name: 'horaesperada', align: 'center', search: false,
                    formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'ShortTime' },
                    editable: true, editrules: { required: false },
                    editoptions: {
                        dataInit: function (el) {
                            $(el).datetimepicker({
                                format: 'LT'
                            });
                        },
                    },
                },
                {
                    name: 'fechareal', width: 120, align: 'center', search: true, editable: true, hidden: false,
                    formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' },
                    searchoptions: {
                        dataInit: function (el) {
                            $(el).datepicker({
                                language: 'es',
                                format: 'yyyy-mm-dd',
                                autoclose: true,
                                onSelect: function (dateText, inst) {
                                    setTimeout(function () {
                                        $('#' + subgrid_table_id)[0].triggerToolbar();
                                    }, 100);
                                }
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
                {
                    name: 'horareal',  align: 'center', search: false, editable: true,
                    formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'ShortTime' },
                    editable: true, editrules: { required: false },
                    editoptions: {
                        dataInit: function (el) {
                            $(el).datetimepicker({
                                format: 'LT'
                            });
                        },
                    },
                },
                { name: 'observacion', editable: true, editoptions: { size: 25 }, editrules: { required: false } },
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
                { name: 'valore.nombre', editable: true, editoptions: { size: 10 } },
            ],
            rowNum: 10,
            rowList: [3, 6],
            pager: '#navGridCal',
            styleUI: "Bootstrap",
            sortname: 'id',
            sortorder: "asc",
            // autowidth: true,
            height: "auto",
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Calendario",
            width: null,
            forceFit: true,
            hidegrid: true,
            viewrecords: true,
            restoreCellonFail : true,
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
                    console.log("holapo")
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
                    /*
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
                    */


                    return { idsolicitudcotizacion: parentRowKey/*, fechanueva: fechaespe, fechanuevar: fecharea */ };
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

