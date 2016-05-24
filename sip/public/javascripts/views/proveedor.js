$(document).ready(function () {

    var tmpl = "<div id='responsive-form' class='clearfix'>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Rut {numrut}</div>";
        tmpl += "</div>";

        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Razon Social {razonsocial}</div>";
        tmpl += "</div>";
        
        tmpl += "<div class='form-row'>";
        tmpl += "<div class='column-full'>Negociador DIVOT {negociadordivot}</div>";
        tmpl += "</div>";
        
        tmpl += "<hr style='width:100%;'/>";
        tmpl += "<div> {sData} {cData}  </div>";
        tmpl += "</div>";
    
    var modelProveedor = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'RUT', name: 'numrut', width: 150, align: 'center', search: false, editable: true, },
      //  { label: 'DV', name: 'dvrut', width: 40, align: 'center', search: false, editable: true, },
        { label: 'Razón Social', name: 'razonsocial', width: 500, align: 'left', search: true, editable: true,formoptions: { rowpos: 1, colpos: 2 } },
        { label: 'Negociador DIVOT', name: 'negociadordivot', width: 300, align: 'left', search: true, editable: true,formoptions: { rowpos: 1, colpos: 2 } },
    ];
        var modelContacto = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'idproveedor', name: 'idproveedor', key: true, hidden: true },
        { label: 'CONTACTO', name: 'contacto', width: 100, align: 'center', search: false, editable: true, },
        { label: 'FONO', name: 'fono', width: 40, align: 'center', search: false, editable: true, },
        { label: 'CORREO', name: 'correo', width: 600, align: 'left', search: true, editable: true, },
    ];
    
     $("#table_proveedor").jqGrid({
        url: '/proveedores/list',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelProveedor,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        sortable: "true",
        width: null,
        shrinkToFit: false,
        caption: 'Lista de proveedores',
        pager: "#pager_proveedor",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        subGrid: true, // set the subGrid property to true to show expand buttons for each row
        subGridRowExpanded: showContactos, // javascript function that will take care of showing the child grid        
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }
    });

    $("#table_proveedor").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $('#table_proveedor').jqGrid('navGrid', "#pager_proveedor", {
        search: false, // show search button on the toolbar
        add: true,
        edit: true,
        del: true,
        refresh: true},
        {
            editCaption: "Modifica Proveedor",
            closeAfterEdit: true,
            recreateForm: true,
            mtype: 'POST',
            url: '/proveedores/update',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }, beforeShowForm: function (form) {
                sipLibrary.centerDialog($('#table_proveedor').attr('id'));
            }
        },
        {
            recreateFilter: true
        }
    );


    $('#table_proveedor').jqGrid('navButtonAdd', '#pager_proveedor', {
        caption: "Excel",
        buttonicon: "silk-icon-page-excel",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $('#table_proveedor');
            var rowKey = grid.getGridParam("selrow");
            var url = '/proveedoresexcel';
            $('#table_proveedor').jqGrid('excelExport', { "url": url });
        }
    });
 
    $("#pager_proveedor_left").css("width", "");
});

    
function showContactos(parentRowID, parentRowKey) {
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";

    // send the parent row primary key to the server so that we know which grid to show
    var childGridURL = "/contactos/list/" + parentRowKey;

    // add a table and pager HTML elements to the parent grid row - we will render the child grid here
    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: [
                   { label: 'id',
                      name: 'id',
                      width: 10,
                      key: true, 
                      hidden:true
                   },
                   { label: 'idproveedor',
                      name: 'idproveedor',
                      width: 10,
                      key: false, 
                      hidden:true
                   },
                   { label: 'Contacto',
                     name: 'contacto',  
                     search: false,                 
                     width: 300
                   },                                      
                   { label: 'Telefono',
                     name: 'fono',
                     search: false,
                     width: 120
                   },
                   { label: 'Correo',
                     name: 'correo',
                     width: 300,
                     search: false,
                   }
                   
        ],
        viewrecords: true,
        styleUI: "Bootstrap", 
        regional: 'es',
        sortable: "true",
        width: 740,
        rowNum: 10,
 		height: 'auto',  
        rowList: [5, 10, 20, 50],
        autowidth:false,       
        subGrid: false, // set the subGrid property to true to show expand buttons for each row
   //     subGridRowExpanded: showProyectoErogaciones, // javascript function that will take care of showing the child grid                
        pager: "#" + childGridPagerID,
        gridComplete: function () {
                var recs = $("#" + childGridID).getGridParam("reccount");
                if (isNaN(recs) || recs == 0) {

                    $("#" + childGridID).addRowData("blankRow", { "Contacto": "", "contacto": "No hay datos" });
                }
            }
    });
    
    $("#" + childGridID).jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#" + childGridID).jqGrid('navGrid', "#"+ childGridPagerID, {
        search: false, // show search button on the toolbar
        add: true,
        edit: true,
        del: true,
        refresh: true
    });    
    
    $("#" + childGridID).jqGrid('navButtonAdd', "#" + childGridPagerID, {
    caption: "Excel",
    buttonicon: "silk-icon-page-excel",
    title: "Excel",
    position: "last",
    onClickButton: function () {
        var grid = $("#" + childGridID);
        var rowKey = grid.getGridParam("selrow");
        var url = '/contactosexcel/'+ parentRowKey;
        $("#" + childGridID).jqGrid('excelExport', { "url": url });
        }      
    });

    $("#" + childGridPagerID +"_left").css("width", "");
}