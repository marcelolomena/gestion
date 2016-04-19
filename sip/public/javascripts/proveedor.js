$(document).ready(function(){
    $("#table_proveedor").jqGrid({
        url: '/proveedores',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelIncident,
        rowNum: 20,
        regional : 'es',
        height: 'auto',
        autowidth:true, 
        shrinkToFit: false,
        forceFit:true,
        subGrid: true, 
        subGridRowExpanded: showGridStatus,
        caption:'Lista de proveedores',
        pager: "#pager_proveedor",
        loadComplete: findWithColor,
        editurl:"/incidentSave",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        gridview: true
    });

});