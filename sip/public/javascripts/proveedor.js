$(document).ready(function(){
     
var modelProveedor=[
	    { label: 'id', name: 'id',key: true, hidden:true },
	    { label: 'RUT', name: 'numrut',width:100,align:'center' },
	    { label: 'Razón Social', name: 'razonsocial',width:400,align:'left' },	    
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
        autowidth:true, 
        shrinkToFit: false,
        //forceFit:true,
        //subGrid: true, 
        caption:'Lista de proveedores',
        pager: "#pager_proveedor",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        //gridview: true
    });

});