$(document).ready(function () {

    var template = "<div style='margin-left:15px;'><div> Contrato <sup>*</sup>:</div><div> {nombre} </div>";
    template += "<div> Fecha Inicio: </div><div>{fechainicontrato} </div>";
    template += "<div> Fecha Termino: </div><div>{fechatercontrato} </div>";
    template += "<div> Solicitud: </div><div>{solicitudcontrato} </div>";
    template += "<div> Estado:</div><div> {estado} </div>";
    template += "<div> Plazo:</div><div> {plazocontrato} </div>";
    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div></div>";

    var modelContrato = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'Proveedor', name: 'razonsocial', width: 300, align: 'left', search: true, editable: true, formoptions: { rowpos: 1, colpos: 1 } },
        { label: 'Contrato', name: 'nombre', width: 500, align: 'left', search: true, editable: true, formoptions: { rowpos: 1, colpos: 2 } },
        {
            label: 'Fecha Inicio', name: 'fechainicontrato', width: 150, align: 'left', search: true,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' }, editable: true, formoptions: { rowpos: 2, colpos: 1 },
            searchoptions: {
                dataInit: function (el) {
                    $(el).datepicker({
                        language: 'es',
                        format: 'yyyy-mm-dd',
                        autoclose: true,
                        onSelect: function (dateText, inst) {
                            setTimeout(function () {
                                $('#grid')[0].triggerToolbar();
                            }, 100);
                        }
                    });
                },
                sopt: ["eq", "le", "ge"]
            },
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).datepicker({ language: 'es', format: 'yyyy-mm-dd', autoclose: true })
                }
            }
        },
        {
            label: 'Fecha Termino', name: 'fechatercontrato', width: 150, align: 'left', search: true,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' }, editable: true,
            formoptions: { rowpos: 2, colpos: 2 },
            searchoptions: {
                dataInit: function (el) {
                    $(el).datepicker({
                        language: 'es',
                        format: 'yyyy-mm-dd',
                        autoclose: true,
                        onSelect: function (dateText, inst) {
                            setTimeout(function () {
                                $('#grid')[0].triggerToolbar();
                            }, 100);
                        }
                    });
                },
                sopt: ["eq", "le", "ge"]
            },
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).datepicker({ language: 'es', format: 'yyyy-mm-dd', autoclose: true })
                }
            }
        },
        { label: 'Solicitud', name: 'solicitudcontrato', width: 100, align: 'left', search: true, editable: true, formoptions: { rowpos: 3, colpos: 1 } },
        { label: 'Estado', name: 'estado', width: 200, align: 'left', search: true, editable: true, formoptions: { rowpos: 3, colpos: 2 } },
        { label: 'Plazo', name: 'plazocontrato', width: 100, align: 'left', search: true, editable: true, formoptions: { rowpos: 4, colpos: 1 } },
    ];
    $("#grid").jqGrid({
        url: '/contratos/list',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelContrato,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        width: null,
        shrinkToFit: false,
        caption: 'Lista de contratos',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }
    });

    $("#grid").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $('#grid').jqGrid('navGrid', "#pager", { edit: true, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false },
        {
            addCaptionCaption: "Modifica Contrato",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }
        },
        {
            recreateForm: true,
            closeAfterEdit: true,
            mtype: 'POST',
            url: '/contratos/new',
            modal: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.reateJSON,
            editCaption: "Agrega Contrato",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }
        },
        {
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }
        },
        {
            recreateFilter: true
        }
    );

    $("#pager_left").css("width", "");
});