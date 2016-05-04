$(document).ready(function(){
     
var modelProveedor=[
	    { label: 'id', name: 'id',key: true, hidden:true },
	    { label: 'RUT', name: 'numrut',width:100,align:'center',search:false },
	    { label: 'Razón Social', name: 'razonsocial',width:600,align:'left',search:true },	    
	];	    
    $("#table_proveedor").jqGrid({
        url: '/proveedoreslist',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelProveedor,
        rowNum: 10,
        regional : 'es',
        height: 'auto',
        width:null, 
        shrinkToFit: false,
        caption:'Lista de proveedores',
        pager: "#pager_proveedor",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI : "Bootstrap"
    });
    $("#table_proveedor").jqGrid('filterToolbar', {stringResult: true,searchOperators: true, searchOnEnter: false, defaultSearch: 'cn'});
    
    $('#table_proveedor').jqGrid('navGrid', "#pager_proveedor_left", {
        search: false, // show search button on the toolbar
        add: true,
        edit: true,
        del: true,
        refresh: true
    });     

    $("#pager_proveedor_left").css("width", "");
});