$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var template = "<div id='responsive-form' class='clearfix'>";

    var modelSolicitudes = [
        { label: 'id', name: 'id', key: true, hidden: true },  
        { label: 'Glosa Servicio',
            name: 'glosaservicio',
            width: 450,
            align: 'left',
            search: false,
            editable: true,
            editoptions: { size: 10, readonly: 'readonly'}                       
        },         
        { label: 'Monto a Pagar',
            name: 'montoapagar',  
            search: false,
            align: 'left',                 
            width: 100,
            editable: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 },
            editoptions: { size: 10, readonly: 'readonly'}                                    
        },  
        { label: 'Monto Aprobado',
                     name: 'montoaprobado',
                     width: 100,
                     search: false,
                     align: 'left',
                     editable: true,
                     formatter: 'number', formatoptions: { decimalPlaces: 0 }
                   },
        { label: 'Glosa Aprobación',
            name: 'glosaaprobacion',
            width: 200,
            search: false,
            align: 'left',
            editable: true,
            edittype: "textarea"
        },
        { label: 'Estado',
                     name: 'aprobado',
                     search: false,
                     align: 'left',
                     width: 80,
                     editable: true,
                    formatter: function (cellvalue, options, rowObject) {
                        var dato = '';
                        var val = rowObject.aprobado;
                        if (val == 0) {
                            dato = 'Pendiente';
                        } else if (val == 1) {
                            dato = 'Aprobado';
                        } else if (val == 2) {
                            dato = 'Rechazado';                            
                        }
                        return dato;
                    }, dataInit: function (elem) { $(elem).width(200); }                     
                                          
                   },
                   
    ], $grid = $("#grid");

    $grid.jqGrid({
        url: '/solicitudesaprobadas',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelSolicitudes,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        caption: 'Solicitudes Aprobadas',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        loadError: sipLibrary.jqGrid_loadErrorHandler
    }).jqGrid('filterToolbar', {
        stringResult: true,
        searchOnEnter: true,
        defaultSearch: "cn",
        searchOperators: true,
        beforeSearch: function () { },
        afterSearch: function () { }
    });

    $grid.jqGrid('navGrid', '#pager', { edit: false, add: false, del: false, search: false }, {}, {}, {}, {});
    $grid.jqGrid('navButtonAdd', '#pager', {
        caption: "",
        buttonicon: "glyphicon glyphicon glyphicon-send",
        title: "Generar Prefacturas",
        position: "last",
        onClickButton: function () {
            bootbox.confirm("¿Esta seguro que desea generar las prefacturas para el periodo actual?", function (confirmed) {
                if (confirmed == true) {
                    $.ajax({
                        url: '/generarprefacturas'
                    }).done(function () {
                        bootbox.alert("Se han generado las prefacturas del periodo", function () { /* your callback code */ })
                        $grid.trigger("reloadGrid");
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        bootbox.alert("Error!!…", function () { /* your callback code */ })
                    }).always(function () {
                        bootbox.alert("Ha comenzado la generación", function () { /* your callback code */ })
                    });
                }
            });
        }
    });
      
});