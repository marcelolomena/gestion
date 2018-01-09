$(document).ready(function () {
    var tmpl; //Sin edición
    var viewModel = [{
        label: 'ID',
        name: 'id',
        key: true,
        hidden: true,
        editable: false
    },
    {
        label: 'Producto',
        name: 'nombre',
        jsonmap: 'nombre',
        align: 'left',
        width: 300,
        editable: true,
        editoptions: {
            fullRow: true,
            readonly: 'readonly'
        },
        editrules: {
            required: false,
            edithidden: false
        },
        search: true
    },	
    {
        label: 'Estado',
        name: 'alertarenovacion',
        width: 90,
        align: 'center',
        editable: true,
        search: false,
        formatter: function (cellvalue, options, rowObject) {
            var rojo = '<span><img src="../../../../images/redcircle.png" width="19px"/></span>';
            var amarillo = '<span><img src="../../../../images/yellowcircle.png" width="19px"/></span>';
            var verde = '<span><img src="../../../../images/greencircle.png" width="19px"/></span>';
            var gris = '<span><img src="../../../../images/greycircle.png" width="19px"/></span>';
            if(rowObject.alertarenovacion === 'aGris'){
                return gris;
            }else{
                if (rowObject.alertarenovacion === 'Vencida') {
                    return rojo;
                } else {
                    if (rowObject.alertarenovacion === 'Renovar') {
                        return amarillo;
                    } else {
                        if (rowObject.alertarenovacion === 'bAl Dia')
                        
                        
                        return verde;
                    }
                }    
            }   
        }         
    },
    {
        label: 'Compradas',
        name: 'licstock',
        align: 'center',
        width: 100,
        editable: true,
        search: false,
        editoptions: {
            fullRow: true,
            readonly: 'readonly'
        }        
    },    
    {
        label: 'Instaladas',
        name: 'licocupadas',
        width: 110,
        align: 'center',
        sortable: false,
        editable: true,
        editoptions: {
            fullRow: true,
            readonly: 'readonly'
        },        
        search: false
    },
    {
        label: 'Snow',
        name: 'snow',
        width: 200,
        hidden: false,
        editable: true,
        edittype: 'textarea',
        editoptions: {
            fullRow: true,
            readonly: 'readonly'
        },
        editrules: {
            required: false,
            edithidden: false
        },
        search: false
    },
    {
        label: 'Addm',
        name: 'addm',
        width: 200,
        hidden: false,
        editable: false,
        search: false
    }
];
    $("#grid").jqGrid({
        url: '/lic/reportecomparativo',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: viewModel,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        sortable: "true",
        width: null,
        shrinkToFit: false,
        caption: 'Reporte Comparativo',
        pager: "#pager",
        viewrecords: true,
        rowList: [10, 20, 30, 40, 50],
        styleUI: "Bootstrap",
        editurl: '/lic/reportecomparativo',
        subGrid: false // set the subGrid property to true to show expand buttons for each row
    });

    $("#grid").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $('#grid').jqGrid('navGrid', "#pager", {
        edit: false,
        add: false,
        del: false,    
        refresh: true,
        search: false, // show search button on the toolbar        
        cloneToTop: false
    },

        {
            editCaption: "Modifica Visación",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return [true,'Error: ' + data.responseText, ""];
            },
            beforeShowForm: function (postdata, formid) {
                var grid = $('#grid');
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                if (rowData.idtipoinstalacion == 13 || rowData.idtipoinstalacion == 15) { //Deshabilita torre en caso de tipo PC
                    window.setTimeout(function () {
                        $("#torre").attr('disabled', true);
                    }, 1000); 
                    $("#torre",formid).hide();                                           
                }             
            },
            beforeSubmit: function (postdata, formid) {
                console.log("beforeSubmit");
                var grid = $('#grid');
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                if (rowData.estado == 'Autorizado') {
                    return [false, "No puede editar asignación en estado Autorizado", ""];
                } else {
                    return [true, "", ""]
                }

            }

        },   
        {}
    );

    $('#grid').jqGrid('navButtonAdd', '#pager', {
        caption: "",
        buttonicon: "glyphicon glyphicon-download-alt",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $('#grid');
            var rowKey = grid.getGridParam("selrow");
            var url = '/lic/excelcomprativo';
            $('#grid').jqGrid('excelExport', { "url": url });
        }
    });

    $("#pager_left").css("width", "");
});

