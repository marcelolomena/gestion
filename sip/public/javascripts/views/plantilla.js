$(document).ready(function () {
    
    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>CUI {idcui}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Nombre {nombre}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Nombre Responsable {nombreresponsable}</div>";
    tmpl += "</div>";
    
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Nombre Gerente {nombregerente}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' style='display: none;'>";
    tmpl += "<div class='column-half'>CUI {CUI}</div>";
    tmpl += "</div>";

    tmpl += "<hr style='width:100%;'/>";
    tmpl += "<div> {sData} {cData}  </div>";
    tmpl += "</div>";

    var modelPlantilla = [
        { label: 'id', name: 'id', key: true, hidden: true },
        {
         label: 'CUI', name: 'CUI', width: 250, align: 'left', search: true, 
          editable: true, jsonmap: "estructuracui.cui"},
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
                }

            }, dataInit: function (elem) { $(elem).width(200); }
        },
        { label: 'Nombre CUI', name: 'nombre', width: 250, align: 'left', search: true, 
          editable: true, jsonmap: "estructuracui.nombre"},
        { label: 'Nombre Responsable', name: 'nombreresponsable', width: 250, align: 'left', search: true, 
          editable: true, jsonmap: "estructuracui.nombreresponsable"},  
        { label: 'Nombre Gerente', name: 'nombreresponsable', width: 250, align: 'left', search: true, 
          editable: true, jsonmap: "estructuracui.nombregerente"}    
    ];
    $("#grid").jqGrid({
        url: '/plantilla/list',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelPlantilla,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        sortable: "true",
        width: null,
        shrinkToFit: false,
        caption: 'Lista de Plantillas',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        editurl: '/plantilla/action',
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
        edit: true,
        add: true,
        del: true,
        refresh: true,
        search: false, // show search button on the toolbar        
        cloneToTop: false
    },

        {
            editCaption: "Modifica Presupuesto",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }
        },
        {
            addCaption: "Agrega Presupuesto",
            closeAfterAdd: true,
            recreateForm: true,
            //mtype: 'GET',
            //url: '/iniciativas/add',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                var grid = $('#grid');
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                console.log("*** selrow:" + rowKey);
                postdata.id = rowKey;
                postdata.version = parseInt(rowData.version) + 1;
                if (postdata.idcui == 0) {
                    return [false, "CUI: Debe escoger un valor", ""];
                } if (postdata.idejercicio == 0) {
                    return [false, "Ejercicio: Debe escoger un valor", ""];
                } if (postdata.descripcion == 0) {
                    return [false, "Descripción: Debe escoger un valor", ""];
                } else {
                    return [true, "", ""]
                }
            },
            beforeShowForm: function (formid) {
                var grid = $('#grid');
                var rowKey = grid.getGridParam("selrow");
                if (rowKey == null) {
                    alert("Esta opción agrega presupuesto para un nuevo CUI.\nPara una nueva versión de presupuesto:\n   1.-Seleccione versión base\n   2.-Presione boton agregar");
                    return [false, "", ""];
                }
                return [true, "", ""];
            }
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Elimina Presupuesto",
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
        }, {}
    );


    $('#grid').jqGrid('navButtonAdd', '#pager', {
        caption: "Excel",
        buttonicon: "silk-icon-page-excel",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $('#grid');
            var rowKey = grid.getGridParam("selrow");
            var url = '/presupuestosexcel';
            $('#grid').jqGrid('excelExport', { "url": url });
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
                }/*
            dataEvents: [{
                type: 'change', fn: function (e) {
                    $("input#divisionsponsor").val($('option:selected', this).text());
                }
            }],*/
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
            label: 'Proveedor', name: 'nombreproveedor', width: 100, align: 'right',
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
                    var thissid = rowData.idmoneda;
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
            search: false, editable: true, edittype: "textarea"
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
        edit: true,
        add: true,
        del: true,
        refresh: false,
        search: false
    },
        {
            editCaption: "Modifica Servicio",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmplServ,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {

                if (postdata.idservicio == 0) {
                    return [false, "Servicio: Debe escoger un valor", ""];
                } if (postdata.idmoneda == 0) {
                    return [false, "Moneda: Debe escoger un valor", ""];
                } else {
                    return [true, "", ""]
                }
            }
        },
        {
            addCaption: "Agrega Servicio",
            closeAfterAdd: true,
            recreateForm: true,
            //mtype: 'GET',
            //url: '/iniciativas/add',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmplServ,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {

                if (postdata.idservicio == 0) {
                    return [false, "Servicio: Debe escoger un valor", ""];
                } if (postdata.idmoneda == 0) {
                    return [false, "Moneda: Debe escoger un valor", ""];
                } else {
                    return [true, "", ""]
                }
            }
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Elimina Servicio",
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
        }, {}

    );
    /*
        $("#" + childGridID).jqGrid('navButtonAdd', "#" + childGridPagerID, {
            caption: "Excel",
            buttonicon: "silk-icon-page-excel",
            title: "Excel",
            position: "last",
            onClickButton: function () {
                var grid = $("#" + childGridID);
                var rowKey = grid.getGridParam("selrow");
                var url = '/presupuestoserviciosexcel/' + parentRowKey;
                $("#" + childGridID).jqGrid('excelExport', { "url": url });
            }
        });
    */
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
                label: 'Contrato',
                name: 'compromisopesos',
                align: 'right',
                search: false,
                sortable: false,
                width: 150,
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
    /*
        $("#" + childGridID).jqGrid('filterToolbar', {
            stringResult: false, searchOperators: true, searchOnEnter: false,
            defaultSearch: 'cn'
        });
    */
    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false,
        add: false,
        del: false,
        search: false,
        refresh: false,
        view: false, position: "left", cloneToTop: false
    },
    {
        
    },
        {
            recreateFilter: true
        }    
    );
    $("#" + childGridID).jqGrid('navButtonAdd', "#" + childGridPagerID, {
        caption: "",
        buttonicon: "glyphicon glyphicon-pencil",
        title: "Editar",
        position: "last",
        onClickButton: function () {
            var subgrid = $("#" + childGridID);
            var ids = subgrid.jqGrid('getDataIDs');
            for (var i = 0; i < ids.length; i++) {
                subgrid.jqGrid('editRow', ids[i]);
            }
        }
    });

    $("#" + childGridID).jqGrid('navButtonAdd', "#" + childGridPagerID, {
        caption: "",
        buttonicon: 'glyphicon glyphicon-save-file',
        title: "Grabar",
        iconsOverText: true,
        position: "last",
        onClickButton: function () {
            var subgrid = $("#" + childGridID);
            var ids = subgrid.jqGrid('getDataIDs');
            for (var i = 0; i < ids.length; i++) {
                subgrid.jqGrid('saveRow', ids[i]);
            }
        }
    });    
/*
    $("#" + childGridID).jqGrid('navButtonAdd', "#" + childGridPagerID, {
        caption: "Excel",
        buttonicon: "silk-icon-page-excel",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $("#" + childGridID);
            var rowKey = grid.getGridParam("selrow");
            var url = '/presupuestoperiodosexcel/' + parentRowKey;
            $("#" + childGridID).jqGrid('excelExport', { "url": url });
        }
    });
*/    
}
