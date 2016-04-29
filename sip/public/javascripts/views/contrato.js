$(document).ready(function(){
     
var modelContrato=[
	    { label: 'id', name: 'id',key: true, hidden:true },
	    { label: 'Contrato', name: 'nombrecontrato',width:300,align:'center',search: true },
	    { label: 'Fecha Inicio', name: 'fechainicontrato',width:100,align:'left',search: true },
        { label: 'Fecha Termino', name: 'fechatercontrato',width:100,align:'left',search: true }, 
        { label: 'Solicitud', name: 'solicitudcontrato',width:100,align:'left',search: true },   
        { label: 'Estado', name: 'estado',width:200,align:'left',search: true },
        { label: 'Plazo', name: 'plazocontrato',width:200,align:'left',search: true },                               	    
	];	    
    $("#grid").jqGrid({
        url: '/contratoslist',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelContrato,
        rowNum: 10,
        regional : 'es',
        height: 'auto',
        autowidth:true, 
        shrinkToFit: false,
        caption:'Lista de contratos',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI : "Bootstrap"
    });
    $("#grid").jqGrid('filterToolbar', {stringResult: true,searchOperators: true, searchOnEnter: false, defaultSearch: 'cn'});

});