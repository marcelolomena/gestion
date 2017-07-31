var gridVermacIndividuales = {

    renderGrid: function (loadurl, targ) {
        var $gridTab = $(targ + "_t")

        var tmpl = "<div id='responsive-form' class='clearfix'>";
        tmpl += "<div class='form-row'>";
        tmpl += "<div id='mensaje' class='column-full'>"
        tmpl += "Cierre esta ventana cuando termine de crear los MACs";
        tmpl += "</div>";
        tmpl += "</div>";
        tmpl += "</div>";
        var modelmacindividual = [
            { label: 'ID', name: 'Id', key: true, hidden: true },
            {
                label: 'Rut',
                name: 'Rut',
                width: 60,
                align: 'left',
                search: false,
                editable: true,
                hidden: false
            },
            {
                label: 'Nombre', name: 'Nombre', width: 150, hidden: false, search: true, editable: true, editrules: { required: true }
            },

            { label: 'A. Económica', name: 'ActividadEconomica', width: 80, hidden: false, search: true, editable: true, editrules: { required: true } },

            { label: 'Ejecutivo C.', name: 'EquipoCobertura', width: 70, hidden: false, search: true, editable: true, editrules: { required: true } },
            { label: 'Banca/Oficina', name: 'Oficina', width: 70, hidden: false, search: true, editable: true, editrules: { required: true } },
            { label: 'Clasificación', name: 'Clasificacion', width: 70, hidden: false, search: true, editable: true, editrules: { required: true } },
            { label: 'Vigilancia', name: 'Vigilancia', width: 60, hidden: false, search: true, editable: true, editrules: { required: true } },
            { label: 'F.Info', name: 'FechaInformacionFinanciera', width: 60, hidden: false, search: true, editable: true, editrules: { required: true } },
            { label: 'F.Apertura C', name: 'FechaCreacion', width: 70, hidden: false, search: true, editable: true, editrules: { required: true } },
            { label: 'Saldo Prom.$', name: 'PromedioSaldoVista', width: 80, hidden: false, search: true, editable: true, editrules: { required: true } },
            {
                label: 'Saldo Prom.USD', name: 'SaldoPromUsd', width: 90, hidden: false, search: true, editable: true, editrules: { required: true },
                formatter: function (cellvalue, options, rowObject) {
                    dato = (parseInt(rowObject.PromedioSaldoVista) / 644).toFixed(2)
                    return dato
                }
            },
            {
                label: 'T. Cambio UF', name: 'TipoCambioUF', width: 70, hidden: false, search: true, editable: true, editrules: { required: true },
                formatter: function (cellvalue, options, rowObject) {
                    dato = 26.611
                    return dato
                }
            },
            {
                label: 'T. Cambio USD', name: 'TipoCambioUSD', width: 80, hidden: false, search: true, editable: true, editrules: { required: true },
                formatter: function (cellvalue, options, rowObject) {
                    dato = 644
                    return dato
                }
            },
        ];

        $gridTab.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            colModel: modelmacindividual,
            rowNum: 20,
            pager: '#navGridVermacindividuales',
            styleUI: "Bootstrap",
            //sortname: 'fecha',
            //sortorder: "desc",
            height: "auto",
            //shrinkToFit: true,
            //autowidth: true,
            width: 1350,
            rownumbers: false,
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "MAC Individuales",
            footerrow: true,
            loadComplete: function () {
                var sum1 = $gridTab.jqGrid('getCol', 'Directo', false, 'sum');
                var sum2 = $gridTab.jqGrid('getCol', 'Contingente', false, 'sum');
                var sum3 = $gridTab.jqGrid('getCol', 'Derivados', false, 'sum');
                var sum4 = $gridTab.jqGrid('getCol', 'Diferida', false, 'sum');
                var sum5 = $gridTab.jqGrid('getCol', 'Total', false, 'sum');
                var sum6 = $gridTab.jqGrid('getCol', 'VarAprobacion', false, 'sum');
                var sum7 = $gridTab.jqGrid('getCol', 'DeudaBanco', false, 'sum');
                var sum8 = $gridTab.jqGrid('getCol', 'GarantiaReal', false, 'sum');
                var sum9 = $gridTab.jqGrid('getCol', 'SBIFACHEL', false, 'sum');
                var sum10 = $gridTab.jqGrid('getCol', 'Penetracion', false, 'avg');

                $gridTab.jqGrid('footerData', 'set',
                    {
                        Vigilancia: 'Totales:',
                        Directo: sum1,
                        Contingente: sum2,
                        Derivados: sum3,
                        Diferida: sum4,
                        Total: sum5,
                        VarAprobacion: sum6,
                        DeudaBanco: sum7,
                        GarantiaReal: sum8,
                        SBIFACHEL: sum9,
                        Penetracion: sum10

                    });
            }


        });

        $gridTab.jqGrid('navGrid', '#navGridVermacindividuales', { edit: false, add: true, del: false, search: false },
            {
                editCaption: "Modificar Límite",
                closeAfterEdit: true,
                recreateForm: true,
                template: tmpl,
                mtype: 'POST',
                url: '/limite',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON
            }, {
                addCaption: "Crear MAC Individuales",
                closeAfterAdd: true,
                recreateForm: true,
                template: tmpl,
                mtype: 'POST',
                url: '/limite',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                beforeShowForm: function (form) {
                    window.open("/menu/operaciones", "Creación MAC Individual EMPRESAS CMPC S.A.", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=1024, height=768");
                    //window.open ("/menu/operaciones", "Creación MAC Individual FORESTAL, CONST. Y COMERCIAL DEL PACIFICO SUR S.A.","directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=1024, height=768");
                }
            }, {
                mtype: 'POST',
                url: '/limite',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                },
                beforeShowForm: function (form) {
                    ret = $gridTab.getRowData($gridTab.jqGrid('getGridParam', 'selrow'));
                    $("td.delmsg", form).html("<b>Usted borrará el limite:</b><br><b>" + ret.tipolimite + "</b> ?");

                },
                afterSubmit: function (response, postdata) {
                    var json = response.responseText;
                    var result = JSON.parse(json);
                    if (!result.success)
                        return [false, result.message, ""];
                    else
                        return [true, "", ""]
                }
            });

    }
}

function subGridSublimite(subgrid_id, row_id) {
    gridSublimiteOp(subgrid_id, row_id, 'sublimite');
    gridOperacion(subgrid_id, row_id, 'veroperacion');
}