function returnTaskLink(cellValue, options, rowdata, action) {
    return "<a target='_blank' href='/factura/prefactura/" + rowdata.id + "' >" + cellValue + " <img src='images/export_pdf.png' alt='PDF'></a>";
}

$(document).ready(function () {
    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color: red'>*</span>Proyecto {nombre}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Importante: Los montos aprobados están en Pesos.</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Presupuesto Aprobado en Dolares {pptoaprobadodolares}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' style='display: none;'>";
    tmpl += "<div class='column-half'>estado {estado}</div>";
    tmpl += "</div>";

    tmpl += "<hr style='width:100%;'/>";
    tmpl += "<div> {sData} {cData}  </div>";
    tmpl += "</div>";

    var modelPrefacturas = [
        { label: 'Numero', name: 'id', key: true, width: 80, hidden: false, formatter: returnTaskLink },
        {
            label: 'Estado', name: 'estado', width: 80, align: 'left',
            search: true, editable: false, hidden: false
        },        
        {
            label: 'Periodo', name: 'periodo', width: 70, align: 'left',
            search: true, editable: true, hidden: false
        },
        {
            label: 'Proveedor', name: 'idproveedor',
            search: false, editable: true, hidden: true,
            dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Proveedor', name: 'proveedor', width: 400, align: 'left',
            search: true, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true }
        },
        
        {
            label: 'Contrato', name: 'idcontrato', width: 150, align: 'left',
            search: true, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true }
        },
        {
            label: 'Contrato', name: 'idcontrato',
            search: false, editable: true, hidden: true,
            dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'CUI', name: 'idcui',
            search: false, editable: true, hidden: true,
            dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'CUI', name: 'cui', width: 150, align: 'left',
            search: true, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true }
        },

        {
            label: 'Moneda', name: 'idmoneda',
            search: false, editable: true, hidden: true,
            editrules: { required: true },
            edittype: "select",
            dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Moneda', name: 'moneda', width: 80, align: 'left',
            search: true, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true }
        },
        
        {
            label: 'Fecha', name: 'fecha', width: 130, align: 'left',
            search: false, editable: true, formatter: 'date',
            formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' },
            searchoptions: {
                dataInit: function (el) {
                    $(el).datepicker({
                        language: 'es',
                        format: 'yyyy-mm-dd',
                        autoclose: true,
                        onSelect: function (dateText, inst) {
                            setTimeout(function () {
                                $('#table_prefacturas')[0].triggerToolbar();
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
            label: 'Estado', name: 'estado', width: 150, align: 'left',
            search: true, editable: true, hidedlg: true, hidden: true,
            editrules: { edithidden: false, required: true }
        },

    ];
    $("#table_prefacturas").jqGrid({
        url: '/prefacturas/list',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelPrefacturas,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        caption: 'Lista de prefacturas',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        pager: "#pager_prefacturas",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        editurl: '/prefacturas/action',
        styleUI: "Bootstrap",
        subGrid: true,
        subGridRowExpanded: gridSolicitudes,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }
    });
    /*
    $("#table_prefacturas").jqGrid('filterToolbar', {
        stringResult: true, searchOperators: true,
        searchOnEnter: false, defaultSearch: 'cn'
    });
    */

    $('#table_prefacturas').jqGrid('navGrid', "#pager_prefacturas", {
        edit: false, add: false, del: false, search: false, refresh: true,
        view: false, position: "left", cloneToTop: false
    },
        {

        },
        {

        },
        {
        },
        {
            recreateFilter: true
        }
    );
    
    $("#pager_prefacturas_left").css("width", "");
});