$(document).ready(function(){
     
var modelIniciativa=[
	    { label: 'id', name: 'id',key: true, hidden:true },
	    { label: 'Art', name: 'codigoart',width:100,align:'center',search: false },
	    { label: 'Proyecto', name: 'nombreproyecto',width:400,align:'left',search: true },
        { label: 'División', name: 'divisionsponsor',width:200,align:'left',search: true }, 
        { label: 'Sponsor', name: 'sponsor1',width:200,align:'left',search: true },   
        { label: 'Gerente', name: 'gerenteresponsable',width:200,align:'left',search: true },
        { label: 'PMO', name: 'pmoresponsable',width:200,align:'left',search: true },                               	    
	];	    
    $("#table_iniciativa").jqGrid({
        url: '/iniciativaslist',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelIniciativa,
        rowNum: 10,
        regional : 'es',
        height: 'auto',
        autowidth:true, 
        shrinkToFit: false,
        caption:'Lista de iniciativas',
        pager: "#pager_iniciativa",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
    });
    $("#table_iniciativa").jqGrid('filterToolbar', {stringResult: true,searchOperators: true, searchOnEnter: false, defaultSearch: 'cn'});

});