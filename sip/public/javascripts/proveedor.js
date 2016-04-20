$(document).ready(function(){
     
var modelProveedor=[
	    { label: 'id', name: 'id',width:20,align:'center' },
	    { label: 'numrut', name: 'numrut',width:50,align:'center' },
	    { label: 'razonsocial', name: 'razonsocial',width:300,align:'center' },	    
	];	    
    $("#table_proveedor").jqGrid({
        url: '/proveedoreslist',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelProveedor,
        rowNum: 20,
        regional : 'es',
        height: 'auto',
        autowidth:true, 
        shrinkToFit: false,
        forceFit:true,
        subGrid: true, 
        caption:'Lista de proveedores',
        pager: "#pager_proveedor",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        gridview: true
    });

});