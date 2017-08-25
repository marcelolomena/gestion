function gridOperacionesAsignar(parentRowID, parentRowKey, suffix) {
    //console.log('hola');

    var subgrid_id = parentRowID;
    var row_id = parentRowKey;
    var subgrid_table_id, pager_id, toppager_id;
    subgrid_table_id = subgrid_id + '_t';
    pager_id = 'p_' + subgrid_table_id;
    toppager_id = subgrid_table_id + '_toppager';
    if (suffix) {
        subgrid_table_id += suffix;
        pager_id += suffix;
    }

    var oldRadio = ""

    var tmplPF = "<div id='responsive-form' class='clearfix'>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-full'>Pregunta<span style='color:red'>*</span>{ArchivoUpload}</div>";
    tmplPF += "</div>";

    tmplPF += "<div class='form-row' style='display: none;'>";
    tmplPF += "</div>";

    tmplPF += "<hr style='width:100%;'/>";
    tmplPF += "<div> {sData} {cData}  </div>";
    tmplPF += "</div>";

    var grillapadre = subgrid_id.substring(0, subgrid_id.lastIndexOf("_"));
    var rowData = $("#" + grillapadre).getRowData(parentRowKey);
    var parentRut = rowData.Rut;

    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    var childGridURL = "/getoperacionesasignar/" + parentRowKey + "/" + parentRut;  //ruta que ejecuta la grilla con Get 

    var modelOperacion = [
        {
            label: 'Id', name: 'Id', index: 'Id', key: true, hidden: true, width: 10,
            editable: true, hidedlg: true, sortable: false, editrules: { edithidden: false },
        },
        { label: 'Tipo Operacion', name: 'TipoOperacion', hidden: true, editable: true, align: 'right' },
        { label: 'Nro Producto', name: 'NumeroProducto', width: 8, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
        { label: 'Fecha Otorgamiento', name: 'FechaOtorgamiento', width: 10, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
        //{ label: 'TipoLimite', name: 'Tipolimite', width: 30, hidden: false, search: true, editable: true, editrules: { required: true } },
        {
            label: 'Fecha Prox Vencimiento', name: 'FechaProxVenc', width: 10, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true },
        },
        //{ label: '', name: 'PlazoResudual', width: 30, hidden: false, search: true, editable: true, editrules: { required: true } },
        { label: 'Moneda', name: 'Moneda', width: 5, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
        { label: 'Monto Inicial', name: 'MontoInicial', width: 5, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
        { label: 'Monto Actual', name: 'MontoActual', width: 10, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
        { label: 'Monto Actual Equiv.M /Linea', name: 'MontoActualMLinea', width: 10, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
        { label: 'Monto Actual Equiv. M/N M$', name: 'MontoActualMNac', width: 10, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
        //{ label: 'Número SubLinea', name: 'Numero', width: 10, hidden: false, search: true, editable: true, align: 'center' },
        {
            label: 'Asignar Operacion', name: 'n', width: 5, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true },

            formatter: function (cellvalue, options, rowObject) {
                var dato = '<span role="button" class="glyphicon glyphicon-import asignar" href="#' + rowObject.RutEmpresa + '" aria-hidden="true"></span>';
                return dato;
            }
        },
    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        rowNum: 100,
        datatype: "json",
        //caption: 'Resumen Sub-Limites',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        page: 1,
        colModel: modelOperacion,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        //pager: "#" + childGridPagerID,
        /*
        subGrid: true,
        subGridRowExpanded: showSubGrids3,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        */

        editurl: '/limite/action3',
        loadComplete: function () {

            $("#" + childGridID).append(`
                <div class="modal fade" id="myModalAsignar" role="dialog">
                    <div class="modal-dialog modal-lg" style="width:70%; >
                        <div class="modal-content">
                            <div class="modal-body">
                                <div class="panel panel-default" >
                                    <div class="panel-heading" style="background-color: #002464;color: #fff;">Asignar Operaciones</div>
                                        <div class="panel-body">
                                            <div class="gcontainer">
                                                <table id="grid"></table>
                                                <div id="pager"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    `);

            $('.asignar').click(function () {

                var formatear =
                    {
                        formatearNumero: function (nStr) {
                            nStr += '';
                            x = nStr.split('.');
                            x1 = x[0];
                            x2 = x.length > 1 ? ',' + x[1] : '';
                            var rgx = /(\d+)(\d{3})/;
                            while (rgx.test(x1)) {
                                x1 = x1.replace(rgx, '$1' + '.' + '$2');
                            }
                            return x1 + x2;
                        }
                    }

                $("#myModalAsignar").modal();
                var elrutqueviene = $(this).attr('href');
                var elrutquenecesito = elrutqueviene.substring(1)

                var elcaption = "Límites";

                var template = "";
                var modelLimites = [
                    {
                        label: 'Id', name: 'Id', index: 'Id', key: true, hidden: true, width: 10,
                        editable: true, hidedlg: true, sortable: false, editrules: { edithidden: false },
                    },
                    { label: 'Mac Individual', name: 'MacIndividual_Id', hidden: true, editable: true, align: 'right' },
                    { label: 'N°', name: 'Numero', width: 6, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
                    { label: 'Riesgo', name: 'Riesgo', width: 20, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
                    //{ label: 'TipoLimite', name: 'Tipolimite', width: 30, hidden: false, search: true, editable: true, editrules: { required: true } },
                    {
                        label: 'Descripcion', name: 'Descripcion', width: 40, hidden: false, search: true, editable: true, align: 'left', editrules: { required: true },
                        formatter: function (cellvalue, options, rowObject) {
                            var idlimite = rowObject.Id;
                            var dato = cellvalue;
                            //var dato = '<a class="muestraop" href="#' + idlimite + '">' + cellvalue + '</a>';
                            return dato;
                        }
                    },
                    //{ label: '', name: 'PlazoResudual', width: 30, hidden: false, search: true, editable: true, editrules: { required: true } },
                    { label: 'Moneda', name: 'Moneda', width: 25, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
                    { label: 'Aprobado (Miles)', name: 'Aprobado', width: 30, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                    { label: 'Utilizado (Miles)', name: 'Utilizado', width: 30, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                    { label: 'Reservado (Miles)', name: 'Reservado', width: 30, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                    {
                        label: 'Disponible (Miles)', name: 'Disponible2', width: 30, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true },
                        formatter: function (cellvalue, options, rowObject) {
                            var bloq = 0;
                            var disp = 0;
                            $.ajax({
                                type: "GET",
                                url: '/verdetalleslim/' + rowObject.Id,
                                async: false,
                                success: function (data) {
                                    if (data.length > 0) {
                                        bloq = data[0].Bloqueado;
                                        disp = data[0].Disponible;
                                        //console.log("valor de bloqueo " + bloq);
                                    }
                                }
                            })
                             var dispo = disp - bloq;
                        return (formatear.formatearNumero(dispo));
                        }
                    },



                ];

                $("#grid").jqGrid({
                    url: '/limite/' + elrutquenecesito,
                    mtype: "GET",
                    datatype: "json",
                    rowNum: 20,
                    pager: "#pager",
                    height: 'auto',
                    shrinkToFit: true,
                    width: 1100,
                    subGrid: true,
                    subGridRowExpanded: subGridversublimiteasignaciones, //se llama la funcion de abajo
                    subGridOptions: {
                        plusicon: "glyphicon-hand-right",
                        minusicon: "glyphicon-hand-down"
                    },
                    page: 1,
                    colModel: modelLimites,
                    regional: 'es',
                    //autowidth: true,
                    caption: elcaption,
                    viewrecords: true,
                    rowList: [5, 10, 20, 50],
                    styleUI: "Bootstrap",
                    editurl: '/grupoempresa',
                    loadError: sipLibrary.jqGrid_loadErrorHandler,
                    gridComplete: function () {
                        var recs = $("#grid").getGridParam("reccount");
                        if (isNaN(recs) || recs == 0) {

                            $("#grid").addRowData("blankRow", { "nombre": "No hay datos" });
                        }
                    },
                    loadComplete: function () {

                        var recs = $("#grid").getGridParam("reccount");
                        if (isNaN(recs) || recs == 0) {
                            //$("#" + childGridID).addRowData("blankRow", { "id": 0, "Descripcion": " ", "Aprobado": "0" });
                            $("#grid").parent().parent().remove();
                            $gridTab2PagerID.hide();

                        }

                        var rows = $("#grid").getDataIDs();
                        for (var i = 0; i < rows.length; i++) {
                            var eldisponible = $("#grid").getRowData(rows[i]).Disponible;
                            if (parseInt(eldisponible) < 0) {
                                $("#grid").jqGrid('setCell', rows[i], "Disponible", "", { color: 'red' });
                            }
                        }
                    }
                });


                $("#grid").jqGrid('navGrid', "#pager", {
                    edit: false, add: false, del: false, search: false,
                    refresh: false, view: false, position: "left", cloneToTop: false
                },
                    {
                        closeAfterEdit: true,
                        recreateForm: true,
                        ajaxEditOptions: sipLibrary.jsonOptions,
                        serializeEditData: sipLibrary.createJSON,
                        editCaption: "Modifica Grupo",
                        //template: template,
                        errorTextFormat: function (data) {
                            return 'Error: ' + data.responseText
                        }
                    },
                    {
                        closeAfterAdd: true,
                        recreateForm: true,
                        ajaxEditOptions: sipLibrary.jsonOptions,
                        serializeEditData: sipLibrary.createJSON,
                        addCaption: "Agregar Empresa",
                        template: template,
                        errorTextFormat: function (data) {
                            return 'Error: ' + data.responseText
                        },
                        beforeShowForm: function (form) {
                            $("input#Nombre").prop('disabled', true);
                            $("input#RazonSocial").prop('disabled', true);
                        },
                        afterSubmit: function (response, postdata) {
                            var json = response.responseText;
                            var result = JSON.parse(json);
                            if (result.error != "0")
                                return [false, "Error en llamada a Servidor", ""];
                            else
                                return [true, "", ""]

                        }, afterShowForm: function (form) {
                            sipLibrary.centerDialog($("#grid").attr('Id'));

                        },
                        onclickSubmit: function (rowid) {
                            return { grupo: "1" };
                        }
                    },
                    {
                        closeAfterDelete: true,
                        recreateForm: true,
                        ajaxEditOptions: sipLibrary.jsonOptions,
                        serializeEditData: sipLibrary.createJSON,
                        addCaption: "Eliminar Empresa",
                        errorTextFormat: function (data) {
                            return 'Error: ' + data.responseText
                        }, afterSubmit: function (response, postdata) {
                            var json = response.responseText;
                            var result = JSON.parse(json);
                            if (result.success != true)
                                return [false, result.error_text, ""];
                            else
                                return [true, "", ""]
                        },
                        onclickSubmit: function (rowid) {
                            var rowKey = $("#grid").getGridParam("selrow");
                            var rowData = $("#grid").getRowData(rowKey);
                            var thissid = rowData.idrelacion;
                            return { idrelacion: thissid };
                        }
                    },
                    {
                        recreateFilter: true
                    }
                );
                $("#pager").css("padding-bottom", "10px");
                $("#grid").jqGrid('navButtonAdd', "#pager", {
                    caption: '<button class="btn btn-default">Asignar Linea</button>',
                    buttonicon: "",
                    title: "Excel",
                    position: "last",
                    onClickButton: function () {
                        /*
                        var $grid = $("#grid")
                        var selIds = $grid.jqGrid("getGridParam", "selarrrow")
                        var alerta = "Se asignará la operación _________"

                        if (confirm(alerta)) {
                            alert("Funcionalidad en desarrollo");



                        } else {
                            alert("No");
                        }
*/
                    }
                });

                function subGridversublimiteasignaciones(subgrid_id, row_id) {
                    gridversublimitesasignaciones(subgrid_id, row_id, 'asignaciones');
                }

            });
        },

        gridComplete: function () {
            //$("#" + childGridID).css("margin-left", "6px");


            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {
                //$("#" + childGridID).addRowData("blankRow", { "id": 0, "Descripcion": " ", "Aprobado": "0" });
                $("#" + childGridID).parent().parent().remove();
                $("#" + childGridPagerID).hide();

            }
            var rows = $("#" + childGridID).getDataIDs();
            for (var i = 0; i < rows.length; i++) {

                $("#" + childGridID).jqGrid('setRowData', rows[i], false, { background: '#f5f5f5' });

            }


        },
        footerrow: false,

    });
    /*
        $("#" + childGridID).closest("div.ui-jqgrid-view")
            .children("div.ui-jqgrid-hdiv")
            .hide();
    */

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false, add: false, del: false, search: false, refresh: true, view: false, position: "left", cloneToTop: false,
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            width: 800,
            editCaption: "Modificar Pregunta de Evaluación",
            template: tmplPF,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            },
            beforeSubmit: function (postdata, formid) {
                var elporcentaje = parseFloat(postdata.porcentaje);
                //console.log('porcentaje: ' + elporcentaje);
                if (elporcentaje > 100) {
                    return [false, "Porcentaje no puede ser mayor a 100", ""];
                }
                else {
                    return [true, "", ""]
                }
            },
        },
        {
            addCaption: "Agrega Preguntas",
            mtype: 'POST',
            url: '/sic/criteriosevaluacion/action3',
            closeAfterAdd: true,
            recreateForm: true,
            template: tmplPF,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            beforeShowForm: function (form) {
                //$('input#notacriticidad', form).attr('readonly', 'readonly');
            },

            onclickSubmit: function (rowid) {
                return { idclaseevaluaciontecnica: parentbisabuelo, childGridID: childGridID, idcriterioevaluacion2: parentRowKey };
            }

        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Eliminar Pregunta",
            mtype: 'POST',
            url: '/sic/criteriosevaluacion/action3',
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }
        },
        {
            recreateFilter: true
        }
    );

    /*
        function showSubGrids3(subgrid_id, row_id) {
            gridCriterios3(subgrid_id, row_id, 'criterios2');
        }
        */


}