var gridVermacgrupal = {

    renderGrid: function (loadurl, targ) {
        var $gridTab = $(targ + "_t")

        var tmpl = "<div id='responsive-form' class='clearfix'>";
        tmpl += "<div class='form-row'>";
        tmpl += "<div id='mensaje' class='column-full'>"
        tmpl += "Cierre esta ventana cuando termine de crear los MACs";
        tmpl += "</div>";
        tmpl += "</div>";
        tmpl += "</div>";
        var modelmacgrupal = [
            { label: 'ID', name: 'Id', key: true, hidden: true },
            {
                label: ' ', name: 'Acomite', width: 20, hidden: false, search: true, editable: true, editrules: { required: true },
                formatter: function (cellvalue, options, rowObject) {
                    if (cellvalue == 2) {
                        dato = '<span class="glyphicon glyphicon-certificate"></span>'
                    }
                    else {
                        dato = ' '
                    }
                    return dato
                }
            },
            {
                label: 'Rut',
                name: 'Rut',
                width: 60,
                align: 'left',
                search: false,
                editable: true,
                hidden: false,
                formatter: function (cellvalue, options, rowObject) {

                    dato = cellvalue + '-' + rowObject.Dv

                    return dato
                },
            },
            { label: 'Dv', name: 'Dv', hidden: true, editable: true },
            {
                label: 'Cliente', name: 'Nombre', width: 150, hidden: false, search: true, editable: true, editrules: { required: true }
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
            colModel: modelmacgrupal,
            rowNum: 20,
            pager: '#navGridVermacgrupal',
            styleUI: "Bootstrap",
            //sortname: 'fecha',
            //sortorder: "desc",
            height: "auto",
            shrinkToFit: true,
            //autowidth: true,
            width: 1350,
            rownumbers: false,
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "MAC Grupo",
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

        $gridTab.jqGrid('navGrid', '#navGridVermacgrupal', { edit: false, add: true, del: false, search: false },
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

        if (document.getElementById("elmacgrupal") == null) {

            $("#vermacgrupal").prepend(`
            <div class="panel panel-primary" id="elmacgrupal" style="margin-left:15px;">
                <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161;'>
                    <h3 class="panel-title">Información General</h3>
                </div>
                <div class="panel-body">
                    <div class="row">
                        <div class="col-xs-2"><b>Promedio Saldo Vista Ultimos </br>12 Meses (M$):</b></div>
                        <div class="col-xs-2">408.000</div>
                        <div class="col-xs-2"></div>
                        <div class="col-xs-2"></div>
                        <div class="col-xs-2"></br><b>Nombre Grupo:</b></div>
                        <div class="col-xs-2"></br><span id="nombregrupo"></span></div>
                    </div>
                    <div class="row">
                        <div class="col-xs-2"><b>Fecha Presentación:</b></div>
                        <div class="col-xs-2">05-06-2017</div>
                        <div class="col-xs-2"><b>Fecha Vcto:</b></div>
                        <div class="col-xs-2">05-06-2017</div>
                    </div>

                    <div class="row">
                        <div class="col-xs-4"></div>
                        <div class="col-xs-2"><b>Rating Grupo:</b></div>
                        <div class="col-xs-2">7</div>
                    </div>

                    <div class="row">
                        <div class="col-xs-2"><b>Ejecutivo Control /Area:</b></div>
                        <div class="col-xs-2">Leslie Calderón / Mayorista 4</div>
                        <div class="col-xs-2"><b>Nivel Atribución:</b></div>
                        <div class="col-xs-2">R2</div>
                    </div>    
                </div>
            </div>`);
            var idmacgrupal = $("#param").text();
            var nombre = ""
            var rut = ""
            var idgrupo = ""
            var nombregrupo = ""
            var elcaption = ""
            $.ajax({
                type: "GET",
                url: '/getdatosmacgrupal/' + idmacgrupal,
                async: false,
                success: function (data) {
                    if (data.length > 0) {
                        nombregrupo = data[0].nombregrupo;
                        $("#nombregrupo").html(nombregrupo)
                    } else {
                        alert("Error con datos del Mac Grupal")
                    }
                }
            });

        }

    }
}

function subGridSublimite(subgrid_id, row_id) {
    //gridSublimiteOp(subgrid_id, row_id, 'sublimite');
    //gridOperacion(subgrid_id, row_id, 'veroperacion');
}