
$(document).ready(function () {
    var total = 0;
    $.getJSON("/fabricantesgrafico", function (j) {
        $('#fabricante').append('<option value="0"> - Escoger Fabricante - </option>');
        $.each(j, function (i, item) {
            $('#fabricante').append('<option value="' + item.id + '">' + item.nombre + '</option>');
        });
    });

    $("#fabricante").change(function () {
        
        var idproveedor = $(this).val();
        var optionsPieIncident = {
            chart: {
                renderTo: 'container',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            }, title: {
                text: 'Licencias por Fabricante'
            }, tooltip: {
                formatter: function () {
                    return '<b>' + this.point.name + '</b>: ' + Highcharts.numberFormat(this.percentage, 2) + ' %';
                }
            }, plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function (event) {
                                loadGrid(this.options.idprod);
                            }
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.idcui}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        },
                        connectorColor: 'silver'
                    }
                }
            }, series: []
        };


        $.ajax({
            url: '/graficolicencia/' + idproveedor,
            type: 'GET',
            success: function (data) {
                optionsPieIncident.series.push(data);
                var charPieDepa = new Highcharts.Chart(optionsPieIncident);
                total = data.total;
                var totalfmt = format1(total, "$");
                console.log("total:" + totalfmt);
                console.log("total1:" + totalfmt);
                loadGrid(null);
                //$("#grid").jqGrid('setGridState', 'hidden');
                $("#grid").jqGrid('setCaption', ' ');                
            },
            error: function (e) {

            }
        });

        //Segundo grafico
        var optionsPieIncident2 = {
            chart: {
                renderTo: 'container2',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            }, title: {
                text: 'Soporte por Fabricante'
            }, tooltip: {
                formatter: function () {
                    return '<b>' + this.point.name + '</b>: ' + Highcharts.numberFormat(this.percentage, 2) + ' %';
                }
            }, plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function (event) {
                                loadGrid2(this.options.idprod);
                            }
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.idcui}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        },
                        connectorColor: 'silver'
                    }
                }
            }, series: []
        };


        $.ajax({
            url: '/graficosoporte/' + idproveedor,
            type: 'GET',
            success: function (data) {
                optionsPieIncident2.series.push(data);
                var charPieDepa = new Highcharts.Chart(optionsPieIncident2);
                total = data.total;
                var totalfmt = format1(total, "$");
                console.log("total:" + totalfmt);
                console.log("total1:" + totalfmt);
                loadGrid2(null);
                //$("#grid").jqGrid('setGridState', 'hidden');
                //$("#grid").jqGrid('setCaption', ' ');                
            },
            error: function (e) {

            }
        });        

    });


});

function format1(n, currency) {
    return currency + " " + n.toFixed(0).replace(/./g, function (c, i, a) {
        return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "." + c : c;
    });
}

var leida = false;
function loadGrid(producto) {
    var url = "/graficogetcompras/" + producto;
    var formatter = new Intl.NumberFormat();
    if (leida) {
        $("#grid").setGridParam({ postData: { page: 1, rows: 10 } });
        $("#grid").jqGrid('setCaption', "Compras por Fabricante").jqGrid('setGridParam', { url: url, page: 1 }).jqGrid("setGridParam", { datatype: "json" }).trigger("reloadGrid");
    } else {
        showDocumentos(producto);
    }
}

function showDocumentos(producto) {

    // send the parent row primary key to the server so that we know which grid to show
    var childGridURL = "/graficogetcompras/" + producto;
    $("#grid").jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        postData: {
            page: function () {
                return 1;
            },
            rows: function () {
                return 10;
            }
        },
        colModel: [
            {
                label: 'id',
                name: 'id',
                width: 50,
                hidden: true
            },
            {
                label: 'Producto',
                name: 'nombre',
                search: false,
                key: true,
                align: 'left',
                width: 200
            },
            {
                label: 'Fecha Compra',
                name: 'fechacompra',
                search: false,
                align: 'left',
                width: 50
            },
            {
                label: 'Proveedor ',
                name: 'razonsocial',
                search: false,
                align: 'left',
                width: 200
            },
            {
                label: 'Monto Licencia',
                name: 'valorlicencia',
                width: 50,
                search: false,
                align: 'left',
                formatter: 'number', formatoptions: { decimalPlaces: 2 }
            },
            {
                label: 'Comprador',
                name: 'comprador',
                width: 150,
                align: 'right',
                search: false
            }
        ],
        caption: "Compras por Licencia",
        height: 'auto',
        styleUI: "Bootstrap",
        autowidth: false,
        sortable: "true",
        pager: "#pager",
        jsonReader: { cell: "" },
        page: 1,
        rowNum: 10,
        rowList: [5, 10, 20, 50],
        sortname: 'id',
        sortorder: 'asc',
        viewrecords: true,
        regional: "es",
        loadComplete: function () {
            var $grid = $("#grid");
            var colSum = $grid.jqGrid('getCol', 'monto', false, 'sum');
            $grid.jqGrid('footerData', 'set', { monto: colSum });
        },
        subGrid: false,
        footerrow: true,
        userDataOnFooter: true
    });

    $("#grid").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#grid").jqGrid('navGrid', "#pager", {
        search: false, // show search button on the toolbar
        add: false,
        edit: false,
        del: false,
        refresh: true
    });

    leida = true;
}

var leida2 = false;

function loadGrid2(producto) {
    var url = "/graficogetcomprassop/"+producto;
    var formatter = new Intl.NumberFormat();
    if (leida2) {
        $("#grid2").setGridParam({ postData: { page: 1, rows: 10 } });
        $("#grid2").jqGrid('setCaption', "Soporte por Producto").jqGrid('setGridParam', { url: url, page: 1 }).jqGrid("setGridParam", { datatype: "json" }).trigger("reloadGrid");
    } else {
        showDocumentos2(producto);
    }
}

function showDocumentos2(producto) {
    
        // send the parent row primary key to the server so that we know which grid to show
        var childGridURL = "/graficogetcomprassop/" + producto;
        $("#grid2").jqGrid({
            url: childGridURL,
            mtype: "GET",
            datatype: "json",
            postData: {
                page: function () {
                    return 1;
                },
                rows: function () {
                    return 10;
                }
            },
            colModel: [
                {
                    label: 'id',
                    name: 'id',
                    width: 50,
                    hidden: true
                },
                {
                    label: 'Producto',
                    name: 'nombre',
                    search: false,
                    key: true,
                    align: 'left',
                    width: 200
                },
                {
                    label: 'Fecha Compra',
                    name: 'fechacompra',
                    search: false,
                    align: 'left',
                    width: 50
                },
                {
                    label: 'Proveedor ',
                    name: 'razonsocial',
                    search: false,
                    align: 'left',
                    width: 200
                },
                {
                    label: 'Monto Soporte',
                    name: 'valorsoporte',
                    width: 50,
                    search: false,
                    align: 'left',
                    formatter: 'number', formatoptions: { decimalPlaces: 2 }
                },
                {
                    label: 'Comprador',
                    name: 'comprador',
                    width: 150,
                    align: 'right',
                    search: false
                }
            ],
            caption: "Compras por Soporte",
            height: 'auto',
            styleUI: "Bootstrap",
            autowidth: false,
            sortable: "true",
            pager: "#pager2",
            jsonReader: { cell: "" },
            page: 1,
            rowNum: 10,
            rowList: [5, 10, 20, 50],
            sortname: 'id',
            sortorder: 'asc',
            viewrecords: true,
            regional: "es",
            loadComplete: function () {
                var $grid2 = $("#grid2");
                var colSum = $grid2.jqGrid('getCol', 'monto', false, 'sum');
                $grid2.jqGrid('footerData', 'set', { monto: colSum });
            },
            subGrid: false,
            footerrow: true,
            userDataOnFooter: true
        });
    
        $("#grid2").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });
    
        $("#grid2").jqGrid('navGrid', "#pager2", {
            search: false, // show search button on the toolbar
            add: false,
            edit: false,
            del: false,
            refresh: true
        });
    
        leida2 = true;
    }
    



