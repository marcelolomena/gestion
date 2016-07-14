$(document).ready(function () {
    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
    var currentYear = (new Date).getFullYear();
    var idcui = 0;
    var data = sipLibrary.currentPeriod();
    var listOfColumnModels = listColumnModels(data);
    var listOfColumnNames = listColumnNames(data);

    var newColModel = [
        { label: 'ID', name: 'idcui', key: true, hidden: true },
        { label: 'CUI Gerencia', name: 'gerencia', width: 150 },
        { label: 'CUI Departamento', name: 'departamento', width: 150 },
        { label: 'CUI Sección', name: 'seccion', width: 150 },
        { label: 'cui', name: 'cui', hidden: true },
        {
            label: 'Estado',
            name: 'diferencia',
            width: 60,
            cellattr: function (rowId, val, rawObject, cm, rdata) {
                var val = rawObject.idcui;
                if (val > 0) {
                    console.log(val)
                    color = 'green';
                } else {
                    color = 'red';
                }
                return "style='background-color:" + color + "'";
            },
        }
    ]

    $("#gridMaster").jqGrid({
        url: '/hyperion/presupuesto',
        datatype: "json",
        colModel: newColModel,
        page: 1,
        rowNum: 20,
        regional: 'es',
        height: 'auto',
        width: 600,
        shrinkToFit: true,
        viewrecords: true,
        multiselect: true,
        caption: 'Presupuestos para Hyperion',
        styleUI: "Bootstrap",
        onSelectRow: function (rowid, selected) {
            if (rowid != null) {
                var wsParams = { idcui: rowid }
                var rowData = $("#gridMaster").getRowData(rowid);
                var cui = rowData.cui;
                var gridDetailParam = { postData: wsParams };
                $("#gridDetail").jqGrid('setGridParam', gridDetailParam);
                $("#gridDetail").jqGrid('setCaption', 'CUI :: ' + cui);
                $("#gridDetail").trigger("reloadGrid");
            }
        },
        onSortCol: clearSelection,
        onPaging: clearSelection,
        pager: "#pagerMaster"
    });

    $('#gridMaster').jqGrid('navGrid', '#pagerMaster', {
        edit: false,
        add: false,
        del: false,
        search: false,
    },
        {},
        {},
        {},
        {});

    $('#gridMaster').jqGrid('navButtonAdd', '#pagerMaster', {
        caption: "",
        buttonicon: "glyphicon glyphicon glyphicon-cog",
        title: "Procesar",
        position: "last",
        onClickButton: function () {
            var grid = $("#gridMaster");
            var rowKey = grid.getGridParam("selrow");

            if (!rowKey)
                alert("No hay filas seleccionadas");
            else {
                var selectedIDs = grid.getGridParam("selarrrow");
                var result = "";
                for (var i = 0; i < selectedIDs.length; i++) {
                    result += selectedIDs[i] + ",";
                }

                alert(result);
            }
        }
    });

    $("#gridDetail").jqGrid({
        url: '/hyperion/list',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colNames: listOfColumnNames,
        colModel: listOfColumnModels,
        rowNum: 50,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        caption: "CUI :: ",
        pager: "#pagerDetail",
        viewrecords: true,
        rowList: [50, 100, 1000],
        styleUI: "Bootstrap",
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $("#gridDetail").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {
                $("#gridDetail").addRowData("blankRow", { "nombre": "No hay datos" });
            }
        },
        postData: { ano: currentYear, idcui: idcui },
        grouping: true,
        groupingView: {
            groupField: ["cuentacontable"],
            groupColumnShow: [true],
            groupText: ["<b>{0}</b>"],
            groupOrder: ["asc"],
            groupSummary: [true],
            groupCollapse: false
        }, loadComplete: function () {
            gridParentWidth = $(".gcontainer").width();
            $("#gridDetail").jqGrid('setGridWidth', gridParentWidth, true);
        },
    });

    $('#gridDetail').jqGrid('navGrid', '#pagerDetail', {
        edit: false,
        add: false,
        del: false
    },
        {},
        {},
        {},
        { closeAfterSearch: true });

    $('#gridDetail').jqGrid('navButtonAdd', '#pagerDetail', {
        caption: "",
        buttonicon: "glyphicon glyphicon-download-alt",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $('#gridDetail');
            var rowKey = grid.getGridParam("selrow");
            var url = '/hyperion/excel';
            $('#gridDetail').jqGrid('excelExport', { "url": url });
        }
    });

    $("#pager_left").css("width", "");

});

function clearSelection() {
    var wsParams = { idcui: 0 }
    var gridDetailParam = { postData: wsParams };
    $("#gridDetail").jqGrid('setGridParam', gridDetailParam);
    $("#gridDetail").jqGrid('setCaption', 'CUI :: none');
    $("#gridDetail").trigger("reloadGrid");
}

function listColumnModels(data) {
    var _listOfColumnModels = [];
    _listOfColumnModels.push({
        name: 'cuentacontable',
        width: 100,
        sortable: true,
        hidden: false,
        search: true,
        searchoptions: { sopt: ["eq", "le", "ge"] }
    });

    _listOfColumnModels.push({
        name: 'gerencia',
        width: 100,
        sortable: true,
        hidden: false,
        search: true,
        stype: 'select',
        searchoptions: {
            sopt: ["eq"],
            dataUrl: '/hyperion/listcui',
            buildSelect: function (response) {
                var data = JSON.parse(response);
                var s = "<select>";
                s += '<option value="0">--Escoger Cui--</option>';
                $.each(data, function (i, item) {
                    s += '<option value="' + data[i].idcui + '">' + data[i].estructuracui.cui + '</option>';
                });
                return s + "</select>";
            }
        },

    });

    _listOfColumnModels.push({
        name: 'departamento',
        width: 100,
        sortable: true,
        hidden: false,
        search: false,
        searchoptions: { sopt: ["eq", "le", "ge"] }
    });
    
    _listOfColumnModels.push({
        name: 'seccion',
        width: 100,
        sortable: true,
        hidden: false,
        search: false,
        searchoptions: { sopt: ["eq", "le", "ge"] }
    });    

    _listOfColumnModels.push({
        name: 'ano',
        width: 100,
        sortable: true,
        hidden: true,
        searchoptions: { searchhidden: true, sopt: ["eq", "le", "ge"] }
    });
    $.each(data, function (i, item) {
        _listOfColumnModels.push({
            name: data[i].toString(),
            width: 100,
            sortable: true,
            hidden: false,
            align: 'right',
            search: false,
            summaryType: 'sum',
            formatter: sipLibrary.currencyFormatter
        });
    });
    return _listOfColumnModels;
}

function listColumnNames(data) {
    var _listOfColumnNames = [];
    _listOfColumnNames.push('Cuenta');
    _listOfColumnNames.push('Gerencia');
    _listOfColumnNames.push('Departamento');
    _listOfColumnNames.push('Sección');    
    _listOfColumnNames.push('Periodo');
    $.each(data, function (i, item) {
        _listOfColumnNames.push(data[i].toString().substring(4, 6) + '/' + data[i].toString().substring(0, 4));
    })

    return _listOfColumnNames;
}