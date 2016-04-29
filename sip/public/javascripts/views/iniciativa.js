$(document).ready(function(){
     
var modelIniciativa=[
	    { label: 'id', name: 'id',key: true, hidden:true },
	    { label: 'Art', name: 'codigoart',width:90,align:'center',search: false },
	    { label: 'Proyecto', name: 'nombreproyecto',width:500,align:'left',search: true },
        { label: 'División', name: 'divisionsponsor',width:245,align:'left',search: true }, 
        { label: 'Sponsor', name: 'sponsor1',width:180,align:'left',search: true },   
        { label: 'Gerente', name: 'gerenteresponsable',width:180,align:'left',search: true },
        { label: 'PMO', name: 'pmoresponsable',width:180,align:'left',search: true },                               	    
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
        width:null, 
        shrinkToFit: false,
        caption:'Lista de iniciativas',
        pager: "#pager_iniciativa",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI : "Bootstrap"
    });
    $("#table_iniciativa").jqGrid('filterToolbar', {stringResult: true,searchOperators: true, searchOnEnter: false, defaultSearch: 'cn'});

});