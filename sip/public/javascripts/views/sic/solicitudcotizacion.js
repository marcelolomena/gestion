$(document).ready(function() {

    $.get('/sic/getsession', function(data) {
        console.log('ROL : ' + data);
    });

    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>CUI<span style='color:red'>*</span>{idcui}</div>";
    template += "<div class='column-half'>Técnico<span style='color:red'>*</span>{idtecnico}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Codigo Art<span style='color:red'>*</span>{codigoart}</div>";
    template += "</div>";

    template += "<div class='form-row' style='display: none;'>";
    template += "<div class='column-half'>pmoresponsable{pmoresponsable}</div>";
    template += "</div>";


    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";


    var $grid = $("#gridMaster"), solicitudcotizacionModel = [
        { label: 'ID', name: 'id', key: true, hidden: true },
        {
            label: 'CUI', name: 'idcui', width: 80, align: 'left', search: false, sortable: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/CUIs',
                buildSelect: function(response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idcui;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger CUI--</option>';
                    $.each(data, function(i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }, dataInit: function(elem) { $(elem).width(200); }
        },
        { label: 'Nombre CUI', name: 'nombre', width: 250, align: 'left', search: true, sortable: false, editable: true },
        {
            label: 'Técnico', name: 'idtecnico', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/usuarios_por_rol/Negociador',
                buildSelect: function(response) {
                    var grid = $("#gridMaster");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.uidpmo;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Técnico--</option>';
                    $.each(data, function(i, item) {
                        if (data[i].uid == thissid) {
                            s += '<option value="' + data[i].uid + '" selected>' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        } else {
                            s += '<option value="' + data[i].uid + '">' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function(e) {
                        $("input#pmoresponsable").val($('option:selected', this).text());
                    }
                }],
            }
        },
        { label: 'Tipo', name: 'tipocontrato', width: 150 },
        { label: 'Código ART', name: 'codigoart', width: 150, editable: true, },
        {
            label: 'PMO', name: 'pmoresponsable', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        { label: 'SAP', name: 'sap', width: 150 },
        { label: 'Descripción', name: 'descripcion', width: 150 },
    ];

    $grid.jqGrid({
        url: '/sic/grid_solicitudcotizacion',
        datatype: "json",
        mtype: "GET",
        colModel: solicitudcotizacionModel,
        page: 1,
        rowNum: 20,
        regional: 'es',
        height: 'auto',
        //width: 600,
        //shrinkToFit: true,
        viewrecords: true,
        editurl: '/sic/grid_solicitudcotizacion',
        caption: 'Solicitud de Cotización',
        styleUI: "Bootstrap",
        onSelectRow: function(rowid, selected) {
            if (rowid != null) {
                console.log("rowid : " + rowid)
                var wsParams = { idcui: rowid }
                var rowData = $("#gridMaster").getRowData(rowid);
                var cui = rowData.cui;
                var gridDetailParam = { postData: wsParams };
                console.dir(gridDetailParam)
            }
        },
        pager: "#pagerMaster",
        subGrid: true, // set the subGrid property to true to show expand buttons for each row
        subGridRowExpanded: showChildGrid, // javascript function that will take care of showing the child grid
    });

    $grid.jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $grid.jqGrid('navGrid', '#pagerMaster', { edit: true, add: true, del: true, search: false },
        {
            editCaption: "Modifica Solicitud",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: template,
            errorTextFormat: function(data) {
                return 'Error: ' + data.responseText
            }

        }, {
            addCaption: "Agrega Solicitud",
            closeAfterAdd: true,
            recreateForm: true,
            mtype: 'POST',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: template,
            errorTextFormat: function(data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function(postdata, formid) {
                if (parseInt(postdata.idcui) == 0) {
                    return [false, "CUI: Debe escoger un valor", ""];
                } if (parseInt(postdata.idtecnico) == 0) {
                    return [false, "Técnico: Debe escoger un valor", ""];
                } else {
                    return [true, "", ""]
                }
            }, afterSubmit: function(response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error != 0) {
                    return [false, result.glosa, ""];
                } else {
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"nombre\",\"op\":\"cn\",\"data\":\"" + postdata.nombre + "\"}]}";
                    $grid.jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }, beforeShowForm: function(form) {
                var rowKey = $grid.getGridParam("selrow");
                var rowData = $grid.getRowData(rowKey);
            }
        }, {

        }, {

        });

    function showChildGrid(parentRowID, parentRowKey) {

        //console.log("parentRowID: " + parentRowID)
        //console.log("parentRowKey " + parentRowKey)
        var tabs = "<ul class='nav nav-tabs tabs-up' id='myTab'>"
        tabs += "<li><a href='/sic/documentos/" + parentRowKey + "' data-target='#documentos' id='documentos_tab' class='media_node active span' data-toggle='tab'>Documentos</a></li>"
        tabs += "<li><a href='/sic/servicios/" + parentRowKey + "' data-target='#servicios' id='servicios_tab' class='media_node active span' data-toggle='tab'>Servicios</a></li>"
        tabs += "<li><a data-target='#foro' data-toggle='tab'>Foro</a></li>"
        tabs += "<li><a data-target='#calendario' data-toggle='tab'>Calendario</a></li>"
        tabs += "<li><a data-target='#responsables' data-toggle='tab'>Responsables</a></li>"
        tabs += "<li><a data-target='#clausulas' data-toggle='tab'>Cláusulas</a></li>"
        tabs += "<li><a data-target='#criterios' data-toggle='tab'>Criterios</a></li>"
        tabs += "<li><a data-target='#anexos' data-toggle='tab'>Anexos</a></li>"
        tabs += "<li><a data-target='#bitacora' data-toggle='tab'>Bitácora</a></li>"
        tabs += "</ul>"

        tabs += "<div class='tab-content'>"
        tabs += "<div class='tab-pane active' id='documentos'><table id='documentos_t'></table><div id='navGrid'></div></div>"
        tabs += "<div class='tab-pane' id='servicios'><table id='servicios_t'></table><div id='navGridServ'></div></div>"
        tabs += "<div class='tab-pane' id='foro'></div>"
        tabs += "<div class='tab-pane' id='calendario'></div>"
        tabs += "<div class='tab-pane' id='responsables'></div>"
        tabs += "<div class='tab-pane' id='clausulas'></div>"
        tabs += "<div class='tab-pane' id='criterios'></div>"
        tabs += "<div class='tab-pane' id='anexos'></div>"
        tabs += "<div class='tab-pane' id='bitacora'></div>"
        tabs += "</div>"

        $("#" + parentRowID).append(tabs);

        $('.active[data-toggle="tab"]').each(function(e) {
            var $this = $(this),
                loadurl = $this.attr('href'),
                targ = $this.attr('data-target');

            if (targ === '#documentos') {

                gridDoc.renderGrid(loadurl, parentRowKey, targ)
            }
            if (targ === '#servicios') {

                gridServ.renderGrid(parentRowKey, targ, data)
            }

            $this.tab('show');
            return false;
        });

        $('[data-toggle="tab"]').click(function(e) {
            var $this = $(this),
                loadurl = $this.attr('href'),
                targ = $this.attr('data-target');

            if (targ === '#documentos') {

                gridDoc.renderGrid(loadurl, parentRowKey, targ)
            }
            if (targ === '#servicios') {

                gridServ.renderGrid(parentRowKey, targ, data)
            }

            $this.tab('show');
            return false;
        });

    }

    function clearSelection() {
        var wsParams = { idcui: 0 }
        var gridDetailParam = { postData: wsParams };
    }
})