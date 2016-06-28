$(document).ready(function () {
    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>CUI {idcui}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Ejercicio {idejercicio}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Descripción {descripcion}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' style='display: none;'>";
    tmpl += "<div class='column-half'>CUI {CUI}</div>";
    tmpl += "</div>";

    tmpl += "<hr style='width:100%;'/>";
    tmpl += "<div> {sData} {cData}  </div>";
    tmpl += "</div>";

    var modelPresupuesto = [
        { label: 'id', name: 'id', key: true, hidden: true },
        {
            label: 'CUI', name: 'CUI', width: 100, align: 'left', search: false, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'CUI', name: 'idcui', width: 80, align: 'left', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/CUIs',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idcui;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger CUI--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                }/*
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#divisionsponsor").val($('option:selected', this).text());
                    }
                }],*/
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        { label: 'Nombre CUI', name: 'nombre', width: 250, align: 'left', search: false, editable: true },
        { label: 'Responsable CUI', name: 'responsable', width: 200, align: 'left', search: false, editable: true },
        {
            label: 'Ejercicio', name: 'ejercicio', width: 80, align: 'left', search: false, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Ejercicio', name: 'idejercicio', width: 50, align: 'left', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/ejercicios',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idejercicio;
                    console.log(response);
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Ejercicio--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].ejercicio + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].ejercicio + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        { label: 'Versión', name: 'version', width: 80, align: 'left', search: false, editable: true },
        { label: 'Estado', name: 'estado', width: 80, align: 'left', search: false, editable: false},
        { label: 'Monto Forecast', name: 'montoforecast', width: 130, align: 'left', search: false, editable: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 }},
        { label: 'Monto Anual', name: 'montoanual', width: 100, align: 'left', search: false, editable: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 }},
        { label: 'Descripción', name: 'descripcion', width: 200, align: 'left', search: false, editable: true }
    ];
    $("#grid").jqGrid({
        url: '/presupuestosconfirmados',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelPresupuesto,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        sortable: "true",
        width: null,
        shrinkToFit: false,
        caption: 'Lista de Presupuestos',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        multiselect: true,
        editurl: '/presupuesto/action',
        subGrid: true, // set the subGrid property to true to show expand buttons for each row
        subGridRowExpanded: showPresupuestoServicios, // javascript function that will take care of showing the child grid        
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }
    });

    $("#grid").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $('#grid').jqGrid('navGrid', "#pager", {
        edit: false,
        add: false,
        del: false,
        refresh: true,
        search: false, // show search button on the toolbar        
        cloneToTop: false
    });

    $('#grid').jqGrid('navButtonAdd', '#pager', {
        caption: "",
        buttonicon: "glyphicon glyphicon glyphicon-check",
        title: "Confirmar",
        position: "last",
        onClickButton: function () {
            var grid = $('#grid');
            var rowKey = grid.getGridParam("selrow");
            var rowData = grid.getRowData(rowKey);   
                
            if (rowKey != null) {     
                if (confirm("¿Esta seguro de Aprobar el presupuesto?")){
                    var grid = $('#grid');
                    var rowKey = grid.getGridParam("selrow");
                    //alert("rowKey:"+rowKey);
                    var rowData = grid.getRowData(rowKey);
                    //alert("rowData:"+rowData);
                    var ids = grid.jqGrid('getGridParam','selarrrow');
                    alert("SS:"+ids);
                    $.ajax({ 
                        url: "/aprueba/"+ids,
                        dataType: 'json', 
                        async: false, 
                        success: function(j){ 
                            $("#grid").trigger("reloadGrid"); 
                        } 
                    });
                }                
            } else {
                alert("Debe seleccionar una fila");
            }        
        }
    });    

    $("#pager_left").css("width", "");
});


function showPresupuestoServicios(parentRowID, parentRowKey) {
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    var childGridURL = "/presupuestoservicios/" + parentRowKey;
    var urlServicios = '/serviciospre/'+parentRowKey;
    var urlProveedores = '/proveedorespre/'+parentRowKey;
    var urlProveedoresServ = '/proveedorespreserv/'+parentRowKey;

    var tmplServ = "<div id='responsive-form' class='clearfix'>";

    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-full'>Servicio {idservicio}</div>";
    tmplServ += "</div>";

    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-half'>Glosa Servicio {glosaservicio}</div>";
    tmplServ += "</div>";
    
    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-full'>Moneda {idmoneda}</div>";
    tmplServ += "</div>";

    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-full'>Proveedor {idproveedor}</div>";
    tmplServ += "</div>";
    
    tmplServ += "<div class='form-row' style='display: none;'>";
    tmplServ += "<div class='column-full'>Monto Forecast {montoforecast}</div>";
    tmplServ += "</div>";

    tmplServ += "<div class='form-row' style='display: none;'>";
    tmplServ += "<div class='column-half'>Monto Anual {montoanual}</div>";
    tmplServ += "</div>";

    tmplServ += "<div class='form-row'>";
    tmplServ += "<div class='column-half'>Comentario {comentario}</div>";
    tmplServ += "</div>";
    
    tmplServ += "<hr style='width:100%;'/>";
    tmplServ += "<div> {sData} {cData}  </div>";
    tmplServ += "</div>";

    var modelPresupuestoServ = [
        {
            label: 'id', name: 'id', width: 50, key: true, hidden: true
        },
        {
            label: 'Servicio', name: 'nombre', search: false, width: 300,
            editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Servicio', name: 'idservicio', search: false, width: 200,
            editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: urlServicios,
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idservicio;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Servicio--</option>';
                    $.each(data, function (i, item) {
                        console.log("***data:" + data[i].id + ", " + thissid);
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        var servicio = $('option:selected', this).val()
                        if (servicio != "0") {
                            $.ajax({
                                type: "GET",
                                url: urlProveedoresServ + '/'+servicio,
                                async: false,
                                success: function (data) {
                                    var s = "<select>";//el default
                                    s += '<option value="0" selected>--Escoger Proveedor--</option>';
                                    $.each(data, function (i, item) {
                                        s += '<option value="' + data[i].idproveedor + '">' + data[i].nombreproveedor + '</option>';
                                    });
                                    s += "</select>";
                                    $("select#idproveedor").html(s);
                                }
                            });
                        } 
                    }
                }],                
            }, dataInit: function (elem) { $(elem).width(200); }

        },
        {
            label: 'Glosa Servicio', name: 'glosaservicio',
            search: false, editable: true, edittype: "textarea"
        },        
        {
            label: 'Moneda', name: 'moneda', width: 100, align: 'right',
            search: false, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Moneda', name: 'idmoneda', width: 100, align: 'right',
            search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/monedas',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idmoneda;
                    console.log(response);
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Moneda--</option>';
                    $.each(data, function (i, item) {
                        console.log("***monedas:" + data[i].id + ", " + thissid);
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].moneda + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].moneda + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }, dataInit: function (elem) { $(elem).width(200); }

        },
        {
            label: 'Proveedor', name: 'razonsocial', width: 200, align: 'right',
            search: false, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Proveedor', name: 'idproveedor', width: 100, align: 'right',
            search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: urlProveedores,
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idproveedor;
                    console.log(response);
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Proveedor--</option>';
                    $.each(data, function (i, item) {
                        console.log("***proveedor:" + data[i].id + ", " + thissid);
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombreproveedor + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombreproveedor + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }, dataInit: function (elem) { $(elem).width(200); }
        },     
        {
            label: 'Comentario', name: 'comentario',
            search: false, editable: true, edittype: "textarea", hidden: true,
        },             
        {
            label: 'Monto Forecast',
            name: 'montoforecast',
            width: 130,
            align: 'right',
            search: false,
            editable: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Monto Anual',
            name: 'montoanual',
            width: 130,
            align: 'right',
            search: false,
            editable: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        }
    ];

    // add a table and pager HTML elements to the parent grid row - we will render the child grid here
    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelPresupuestoServ,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        width: null,
        shrinkToFit: false,
        rowNum: 10,
        rowList: [5, 10, 20, 50],
        editurl: '/presupuestoservicios/action/' + parentRowKey,
        subGrid: true, // set the subGrid property to true to show expand buttons for each row
        subGridRowExpanded: showPresupuestoPeriodos, // javascript function that will take care of showing the child grid                
        pager: "#" + childGridPagerID
    });

    $("#" + childGridID).jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false,
        add: false,
        del: false,
        refresh: true,
        search: false
    });

}

function showPresupuestoPeriodos(parentRowID, parentRowKey) {
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";

    var grid = $("#" + childGridID);
    var rowKey = grid.getGridParam("selrow");

    // send the parent row primary key to the server so that we know which grid to show
    var childGridURL = "/presupuestoperiodoslist/" + parentRowKey;

    // add a table and pager HTML elements to the parent grid row - we will render the child grid here
    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        //page: 1,
        colModel: [
            {
                label: 'id',
                name: 'id',
                width: 50,
                key: true,
                hidden: true
            },
            {
                label: 'Periodo',
                name: 'periodo',
                search: false,
                editable: false,
                sortable: false,
                width: 100,
            },
            {
                label: 'Presupuesto',
                name: 'presupuestobasepesos',
                align: 'right',
                width: 150,
                search: false,
                sortable: false,
                formatter: 'number', formatoptions: { decimalPlaces: 0 }
            },
            {
                label: 'Valor Presupuesto',
                name: 'presupuestopesos',
                editable: true,
                align: 'right',
                search: false,
                width: 150,
                formatter: 'number', formatoptions: { decimalPlaces: 0 }           
            }
        ],
        //viewrecords: true,
        //rowNum: 16,
        styleUI: "Bootstrap",
        regional: "es",
        pgbuttons: false,
        pgtext: null,
        height: 'auto',
        viewrecords: false,
        width: null,
        shrinkToFit: false,
        editurl: '/presupuestoperiodos/action',
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        pager: "#" + childGridPagerID
    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false,
        add: false,
        del: false,
        search: false,
        refresh: true,
        view: false, position: "left", cloneToTop: false
    });
}
