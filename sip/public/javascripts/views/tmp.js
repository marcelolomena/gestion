jQuery(document).ready(function () {
	jQuery('#JQGrid1').jqGrid(
		{
			url: '/examples/grid/hierarchy/several_subgrids/default.aspx?jqGridID=JQGrid1',
			editurl: '/examples/grid/hierarchy/several_subgrids/default.aspx?jqGridID=JQGrid1&editMode=1',
			datatype: 'json',
			page: 1,
			colNames: ["Order ID", "CustomerID", "EmployeeID", "ShipCity", "Freight"],
			colModel: [
				{ "searchoptions": {}, "name": "OrderID", "key": true, "width": 50, "summaryTpl": "{0}", "index": "OrderID" },
				{ "searchoptions": {}, "name": "CustomerID", "width": 100, "summaryTpl": "{0}", "index": "CustomerID" },
				{ "searchoptions": {}, "name": "EmployeeID", "width": 100, "summaryTpl": "{0}", "index": "EmployeeID" },
				{ "searchoptions": {}, "name": "ShipCity", "width": 100, "summaryTpl": "{0}", "index": "ShipCity" },
				{ "searchoptions": {}, "name": "Freight", "width": 100, "summaryTpl": "{0}", "index": "Freight" }],
			viewrecords: true, scrollrows: false,
			postBackUrl: "__doPostBack('JQGrid1','jqGridParams')",
			editDialogOptions: {
				"recreateForm": true,
				errorTextFormat: function (data) { return 'Error: ' + data.responseText }
			},
			addDialogOptions: { "recreateForm": true, errorTextFormat: function (data) { return 'Error: ' + data.responseText } },
			delDialogOptions: { errorTextFormat: function (data) { return 'Error: ' + data.responseText } },
			searchDialogOptions: {},
			viewRowDetailsDialogOptions: {},
			jsonReader: { id: "OrderID" },
			rowNum: 10,
			rowList: [10, 20, 30],
			sortorder: 'asc',
			hidegrid: false,
			width: '650',
			height: '100%',
			headertitles: true,
			hoverrows: false,
			pager: jQuery('#JQGrid1_pager'),
			viewsortcols: [false, 'vertical', true],
			responsive: true,
			subGrid: true,
			subGridRowExpanded: showSubGrids,
			loadError: jqGrid_aspnet_loadErrorHandler
		});

	function jqGrid_aspnet_loadErrorHandler(xht, st, handler) {
		jQuery(document.body).css('font-size', '100%');
		jQuery(document.body).html(xht.responseText);
	};

	jQuery('#JQGrid1').bindKeys();
	var _theForm = document.getElementsByTagName('FORM')[0];
	jQuery(_theForm).submit(function () {
		jQuery('#JQGrid1_SelectedRow').attr('value', jQuery('#JQGrid1').getGridParam('selrow'));
	});

});

function showSubGrids(subgrid_id, row_id) {
	// the "showSubGrid_JQGrid2" function is autogenerated and available globally on the page by the second child grid. 
	// Calling it will place the child grid below the parent expanded row and will call the OnDataRequesting event 
	// of the child grid, with ID equal to the ID of the parent expanded row
	showSubGrid_JQGrid2(subgrid_id, row_id, "<br><b>Employee responsible for this order</b><br><br>", "JQGrid2");
	showSubGrid_JQGrid3(subgrid_id, row_id, "<br><b>This order should be shipped to this customer</b><br><br>", "JQGrid3");
}


function showSubGrid_JQGrid2(subgrid_id, row_id, message, suffix) {
	var subgrid_table_id, pager_id, toppager_id;
	subgrid_table_id = subgrid_id + '_t';
	pager_id = 'p_' + subgrid_table_id;
	toppager_id = subgrid_table_id + '_toppager';
	if (suffix) {
		subgrid_table_id += suffix;
		pager_id += suffix;
	}
	if (message) jQuery('#' + subgrid_id).append(message);

	jQuery('#' + subgrid_id).append('<table id=' + subgrid_table_id + ' class=scroll></table><div id=' + pager_id + ' class=scroll></div>');

	jQuery('#' + subgrid_table_id).jqGrid({
		url: '/examples/grid/hierarchy/several_subgrids/default.aspx?jqGridID=JQGrid2&parentRowID=' + encodeURIComponent(row_id) + '',
		editurl: '/examples/grid/hierarchy/several_subgrids/default.aspx?jqGridID=JQGrid2&editMode=1&parentRowID=' + encodeURIComponent(row_id) + '',
		datatype: 'json',
		page: 1,
		colNames: ["EmployeeID", "LastName", "FirstName", "Title"],
		colModel: [
			{ "searchoptions": {}, "name": "EmployeeID", "key": true, "summaryTpl": "{0}", "index": "EmployeeID" },
			{ "searchoptions": {}, "name": "LastName", "summaryTpl": "{0}", "index": "LastName" },
			{ "searchoptions": {}, "name": "FirstName", "summaryTpl": "{0}", "index": "FirstName" },
			{ "searchoptions": {}, "name": "Title", "summaryTpl": "{0}", "index": "Title" }
		],
		viewrecords: true,
		scrollrows: false,
		postBackUrl: "__doPostBack('JQGrid2','jqGridParams')",
		editDialogOptions: {
			"recreateForm": true,
			errorTextFormat: function (data) {
				return 'Error: ' + data.responseText
			}
		}, addDialogOptions: {
			"recreateForm": true,
			errorTextFormat: function (data) {
				return 'Error: ' + data.responseText
			}
		},
		delDialogOptions: {
			errorTextFormat: function (data) {
				return 'Error: ' + data.responseText
			}
		},
		searchDialogOptions: {},
		viewRowDetailsDialogOptions: {},
		jsonReader: { id: "EmployeeID" },
		rowNum: 10,
		rowList: [10, 20, 30],
		sortorder: 'asc',
		hidegrid: false,
		width: '100%',
		height: '100%',
		headertitles: true,
		hoverrows: false,
		pager: jQuery('#' + pager_id),
		viewsortcols: [false, 'vertical', true],
		responsive: true,
		loadError: jqGrid_aspnet_loadErrorHandler
	}
				);

	function jqGrid_aspnet_loadErrorHandler(xht, st, handler) {
		jQuery(document.body).css('font-size', '100%');
		jQuery(document.body).html(xht.responseText);
	};
	jQuery('#' + subgrid_table_id).bindKeys();
}




function showSubGrid_JQGrid3(subgrid_id, row_id, message, suffix) {
	var subgrid_table_id, pager_id, toppager_id;
	subgrid_table_id = subgrid_id + '_t';
	pager_id = 'p_' + subgrid_table_id;
	toppager_id = subgrid_table_id + '_toppager';
	if (suffix) {
		subgrid_table_id += suffix;
		pager_id += suffix;
	}
	if (message) jQuery('#' + subgrid_id).append(message);

	jQuery('#' + subgrid_id).append('<table id=' + subgrid_table_id + ' class=scroll></table><div id=' + pager_id + ' class=scroll></div>');

	jQuery('#' + subgrid_table_id).jqGrid({
		url: '/examples/grid/hierarchy/several_subgrids/default.aspx?jqGridID=JQGrid3&parentRowID=' + encodeURIComponent(row_id) + '',
		editurl: '/examples/grid/hierarchy/several_subgrids/default.aspx?jqGridID=JQGrid3&editMode=1&parentRowID=' + encodeURIComponent(row_id) + '',
		datatype: 'json',
		page: 1,
		colNames: ["ID", "ContactName", "Phone", "City"],
		colModel: [
			{ "searchoptions": {}, "name": "CustomerID", "key": true, "width": 50, "summaryTpl": "{0}", "index": "CustomerID" },
			{ "searchoptions": {}, "name": "ContactName", "summaryTpl": "{0}", "index": "ContactName" },
			{ "searchoptions": {}, "name": "Phone", "summaryTpl": "{0}", "index": "Phone" },
			{ "searchoptions": {}, "name": "City", "summaryTpl": "{0}", "index": "City" }
		],
		viewrecords: true,
		scrollrows: false,
		postBackUrl: "__doPostBack('JQGrid3','jqGridParams')",
		editDialogOptions: { "recreateForm": true, errorTextFormat: function (data) { return 'Error: ' + data.responseText } },
		addDialogOptions: { "recreateForm": true, errorTextFormat: function (data) { return 'Error: ' + data.responseText } },
		delDialogOptions: { errorTextFormat: function (data) { return 'Error: ' + data.responseText } },
		searchDialogOptions: {},
		viewRowDetailsDialogOptions: {},
		jsonReader: { id: "CustomerID" },
		rowNum: 10,
		rowList: [10, 20, 30],
		sortorder: 'asc',
		hidegrid: false,
		width: '100%',
		height: '100%',
		headertitles: true,
		hoverrows: false,
		pager: jQuery('#' + pager_id),
		viewsortcols: [false, 'vertical', true],
		responsive: true,
		loadError: jqGrid_aspnet_loadErrorHandler
	});

	function jqGrid_aspnet_loadErrorHandler(xht, st, handler) {
		jQuery(document.body).css('font-size', '100%');
		jQuery(document.body).html(xht.responseText);
	};
	jQuery('#' + subgrid_table_id).bindKeys();
}
