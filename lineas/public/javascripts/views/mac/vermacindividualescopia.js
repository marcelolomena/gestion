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
                width: 80,
                align: 'left',
                search: false,
                editable: true,
                hidden: false
            },
            {
                label: 'Cliente', name: 'Nombre', width: 150, hidden: false, search: true, editable: true, editrules: { required: true }
            },

            { label: 'R. Individ.', name: 'RatingIndividual', width: 80, hidden: false, search: true, editable: true, editrules: { required: true } },

            { label: 'Clasif.', name: 'Clasificacion', width: 70, hidden: false, search: true, editable: true, editrules: { required: true } },
            { label: 'Vigil.', name: 'Vigilancia', width: 70, hidden: false, search: true, editable: true, editrules: { required: true } },
            {
                label: 'Directo', name: 'Directo', width: 100, hidden: false, search: true, editable: true,
                formatter: function (cellvalue, options, rowObject) {
                    dato = Math.floor((Math.random() * 200000) + 1000);
                    return dato
                }
            },
            {
                label: 'Contingente', name: 'Contingente', width: 100, hidden: false, search: true, editable: true,
                formatter: function (cellvalue, options, rowObject) {
                    dato = Math.floor((Math.random() * 200000) + 1000);
                    return dato
                }
            },
            {
                label: 'Derivados', name: 'Derivados', width: 100, hidden: false, search: true, editable: true,
                formatter: function (cellvalue, options, rowObject) {
                    dato = Math.floor((Math.random() * 200000) + 1000);
                    return dato
                }
            },
            {
                label: 'Entrega Dif.', name: 'Diferida', width: 100, hidden: false, search: true, editable: true,
                formatter: function (cellvalue, options, rowObject) {
                    dato = Math.floor((Math.random() * 200000) + 1000);
                    return dato
                }
            },
            {
                label: 'Total', name: 'Total', width: 100, hidden: false, search: true, editable: true,
                formatter: function (cellvalue, options, rowObject) {
                    dato = Math.floor((Math.random() * 200000) + 1000);
                    return dato
                }
            },
            {
                label: 'Var Aprob.', name: 'VarAprobacion', width: 100, hidden: false, search: true, editable: true,
                formatter: function (cellvalue, options, rowObject) {
                    dato = Math.floor((Math.random() * 200000) + 1000);
                    return dato
                }
            },
            {
                label: 'Deuda Banco', name: 'DeudaBanco', width: 120, hidden: false, search: true, editable: true,
                formatter: function (cellvalue, options, rowObject) {
                    dato = Math.floor((Math.random() * 200000) + 1000);
                    return dato
                }
            },
            {
                label: 'Gar. Real', name: 'GarantiaReal', width: 100, hidden: false, search: true, editable: true,
                formatter: function (cellvalue, options, rowObject) {
                    dato = Math.floor((Math.random() * 200000) + 1000);
                    return dato
                }
            },
            {
                label: 'SBIF+ACHEL', name: 'SBIFACHEL', width: 100, hidden: false, search: true, editable: true,
                formatter: function (cellvalue, options, rowObject) {
                    dato = Math.floor((Math.random() * 200000) + 1000);
                    return dato
                }
            },
            {
                label: 'Penetración', name: 'Penetracion', width: 100, hidden: false, search: true, editable: true,
                formatter: function (cellvalue, options, rowObject) {
                    dato = Math.floor((Math.random() * 100) + 0);
                    return dato + '%'
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
                    window.open ("/menu/operaciones", "Creación MAC Individual EMPRESAS CMPC S.A.","directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=1024, height=768");
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